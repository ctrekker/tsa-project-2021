const express = require('express');
const {OAuth2Client} = require('google-auth-library');
const getDb = require('../../db');
const {requireAuth, issue, verify} = require('../../auth');

const router = new express.Router();
const client = new OAuth2Client(process.env.GAPI_CLIENT_ID)

router.get('/', requireAuth, (req, res) => res.json(req.user));
router.get('/:id', requireAuth, async (req, res) => {
    const user = await req.conn.queryAsync('SELECT ID, GID, NAME, PICTURE FROM USER WHERE ID = ?', [req.params.id]);
    if(user.length > 0) {
        res.jsonDb(user[0]);
    }
    else {
        res.status(404).send('ERROR: User not found');
    }
});
router.get('/:id/posts', requireAuth, async (req, res) => {
    const posts = await req.conn.queryAsync(`
        SELECT P.ID, P.CONTENT, P.CREATED_AT,
            L.ID AS LOBBY_ID, L.NAME AS LOBBY_NAME,
            (SELECT COUNT(*) FROM LOBBY_POST_LIKE WHERE POST = P.ID) AS LIKES
        FROM
            LOBBY_POST AS P
                LEFT JOIN
            LOBBY AS L
        ON P.LOBBY = L.ID
        WHERE P.AUTHOR = ?
        ORDER BY P.CREATED_AT DESC
        LIMIT 100
    `, [req.params.id]);
    res.jsonDb(posts);
});
router.post('/', async (req, res) => {
    const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.GAPI_CLIENT_ID
    });
    const payload = ticket.getPayload();

    console.log(payload);
    req.conn.query('SELECT * FROM USER WHERE GID = ?', payload.sub, (err, results) => {
        if(results.length === 0) {
            const sql = 'INSERT INTO USER (GID, NAME, EMAIL, PICTURE) VALUES (?, ?, ?, ?)';
            req.conn.query(sql, [payload.sub, payload.name, payload.email, payload.picture], (err, results) => {
                if(err) console.log(err);

                const betterPayload = {
                    ...payload,
                    id: results.insertId
                };
                const authToken = issue(betterPayload);
                res.cookie('auth', authToken, {});
                res.json(betterPayload);
            });
        }
        else {
            const betterPayload = {
                ...payload,
                id: results[0].ID
            };
            const authToken = issue(betterPayload);
            res.cookie('auth', authToken, {});
            res.json(betterPayload);
        }
    });
});

module.exports = router;
