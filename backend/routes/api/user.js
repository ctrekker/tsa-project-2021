const express = require('express');
const {OAuth2Client} = require('google-auth-library');
const getDb = require('../../db');
const {requireAuth, issue, verify} = require('../../auth');

const router = new express.Router();
const client = new OAuth2Client(process.env.GAPI_CLIENT_ID)

router.get('/', requireAuth, (req, res) => res.json(req.user));
router.get('/:gid', requireAuth, async (req, res) => {
    const user = await req.conn.queryAsync('SELECT ID, GID, NAME, PICTURE FROM USER WHERE GID = ?', [req.params.gid]);
    if(user.length > 0) {
        res.jsonDb(user[0]);
    }
    else {
        res.status(404).send('ERROR: User not found');
    }
});
router.post('/', async (req, res) => {
    const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.GAPI_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const authToken = issue(payload);
    res.cookie('auth', authToken, {});
    res.json(payload);

    const conn = await getDb();

    console.log(payload);
    req.conn.query('SELECT * FROM USER WHERE GID = ?', payload.sub, (err, results) => {
        if(results.length === 0) {
            const sql = 'INSERT INTO USER (GID, NAME, EMAIL, PICTURE) VALUES (?, ?, ?, ?)';
            req.conn.query(sql, [payload.sub, payload.name, payload.email, payload.picture], (err, results) => {
                if(err) console.log(err);
            });
        }
    });
});

module.exports = router;
