
/* Basic modules requiring */
const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');
const requireLogin = require('../../middleware/requireLogin')



/* GET route to obtain user home page */
router.get('/users/:id', requireLogin, (req,res) => {
    let c = 0
    const customer_id = req.params.id // getting customer id 
    let customer_name = ''
    

    /* query to get customer name */
    let sql =
    `
        SELECT name from customer where customer_id = '${customer_id}'
    `
    connectdb.query(sql, (err,result) => {
        if (err) throw err
        if (result.rows.length === 0) {
            res.send('User not found')
        }
        else { 
            customer_name = result.rows[0].name
            res.render('user/home', {customer_id,customer_name,c}) // rendering customer home page ejs file
            ++c
        }
    })
})
c = 0


module.exports = router