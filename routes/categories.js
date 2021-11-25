
/* Basic module requiring */
const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');



/* getting categories page */
router.get('/categories', (req,res) => {
    let customer_id = req.session.user_id
    let sql = 
    `
        select * from category
    `
    connectdb.query(sql, (err,result) => {
        if (err) throw err
        const categories = result.rows
        if (req.session.user_id) {
            res.render('categories', {categories,customer_id}) // rendering categories page 
        }
        else {
            res.redirect('/login')
        }
        // console.log(result.rows)
    })
})


module.exports = router  // exporting router