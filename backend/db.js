// This file is for initializing the database logic

const mysql = require('mysql');
const fs = require('fs');
const { json } = require('express');

let conn = null;

function queryPromise(conn, sql) {
    return new Promise((resolve, reject) => {
        conn.query(sql, (err, res) => {
            if(err) reject(err);
            else {
                resolve(res);
            }
        });
    });
}

module.exports = {
    getDb: async () => {
        return new Promise((resolve, reject) => {
            if(conn === null) {
                conn = mysql.createConnection({
                    host: process.env.DB_HOST,
                    port: process.env.DB_PORT,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DB_NAME
                });
                conn.connect(async (err) => {
                    if(err) reject(err);
                    else {
                        console.log('MySQL Database Connected');

                        conn.queryAsync = (sql, args) => {
                            return new Promise((resolve, reject) => {
                                conn.query(sql, args, (err, res) => {
                                    if(err) reject(err);
                                    else resolve(res);
                                });
                            });
                        };
                        
                        const initSql = fs.readFileSync('init.sql').toString().split(';');
                        for(let sql of initSql) {
                            if(sql.trim().length === 0) continue;

                            try {
                                await queryPromise(conn, sql);
                            }
                            catch(e) {
                                console.error(e);
                                console.error(`Error in query: \n${sql}`);
                                break;
                            }
                        }

                        resolve(conn);
                    }
                });
            }
            else {
                resolve(conn);
            }
        });
    }
};
module.exports.db = async (req, res, next) => {
    req.conn = await module.exports.getDb();
    res.objDb = (obj) => {
        const out = {};
        for(let [k, v] of Object.entries(obj)) {
            out[k.toLowerCase()] = v;
        }
        return out;
    };
    res.jsonDb = (obj) => {
        if(obj.length === undefined) {
            const out = [];
            for(let e of obj) {
                out.push(res.objDb(e));
            }
            res.json(out);
        }
        else {
            res.json(res.objDb(obj));
        }
    };
    next();
}