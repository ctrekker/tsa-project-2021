const express = require('express');
const {OAuth2Client} = require('google-auth-library');
const getDb = require('../../db');
const {requireAuth, issue} = require('../../auth');

const router = new express.Router();
const client = new OAuth2Client(process.env.GAPI_CLIENT_ID)

router.get('/', requireAuth, (req, res) => res.send('test'));
router.post('/', async (req, res) => {
    const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.GAPI_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const authToken = issue(req.body);
    res.cookie('auth', authToken, {});
    res.json({ test: 'hi' });

    const conn = await getDb();

    console.log(payload);
    conn.query('SELECT * FROM USER WHERE GID = ?', payload.sub, (err, results) => {
        if(results.length === 0) {
            const sql = 'INSERT INTO USER (GID, NAME, EMAIL, PICTURE) VALUES (?, ?, ?, ?)';
            conn.query(sql, [payload.sub, payload.name, payload.email, payload.picture], (err, results) => {
                if(err) console.log(err);
            });
        }
    });
});

module.exports = router;
