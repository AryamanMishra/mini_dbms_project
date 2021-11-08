const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');



router.get('/categories', (req,res) => {
    let sql = 
    `
        select * from category
    `
    connectdb.query(sql, (err,result) => {
        if (err) throw err
        const categories = result.rows
        res.render('categories', {categories})
        // console.log(result.rows)
    })
})


module.exports = router