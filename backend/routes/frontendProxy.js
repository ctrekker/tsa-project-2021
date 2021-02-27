const httpProxy = require('http-proxy');
const express = require('express');
const router = express.Router();

const proxy = httpProxy.createProxyServer({
    target: 'http://localhost:3000',
    ws: true
});

router.use((req, res, next) => {
    proxy.web(req, res);
});

module.exports = router;