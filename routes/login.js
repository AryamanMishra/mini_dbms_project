const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../db_files/connect') // connect file connects to pgsql



/* Getting login page */
router.get('/login', (req,res) => {
    res.render('login')
})



/* Login functionality */
router.post('/login', (req,res) => {
    const body = req.body // gives user mail and password been used for login

    /* This query checks whether a user with same email and password exists */
    let sql = `SELECT * FROM customer WHERE email_id = '${body.email_id}'`
    try {
        connectdb.query(sql, (err,result) => {
            if (err) console.log(err)


            /* This clause checks whether the result of the above query gives any rows or not */
            /* If the result is empty that means no user by above creds exists */
            if (JSON.stringify(result.rows) === '[]') {
                res.send('User does not exists please signup')
                console.log('User does not exists')
            }

            /* The result was not empty and we obtain a user with specified email and password */
            else {
                customer_id = result.rows[0].customer_id
                console.log(customer_id);
                cart_id = result.rows[0].cart_id
                res.redirect(`/users/${customer_id}`)
            }
        })    
    } 
    catch (err) {
        console.log(err)
    }
})



module.exports = router