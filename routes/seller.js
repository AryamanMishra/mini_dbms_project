const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');




router.get('/seller', (req,res) => {
    let sql =
    `
        select * from seller
    `
    connectdb.query(sql, (err,result) => {
        if (err) throw err
        res.send(result.rows)
        console.log(result.rows)
    })
})


module.exports = router