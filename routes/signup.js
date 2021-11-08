const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');


/* Getting singup page */
router.get('/signup', (req,res) => {
    res.render('signup')
})



/* Signup functionality */
router.post('/signup', (req,res) => {
    let body = req.body  
    let sql = `SELECT * FROM customer WHERE email_id = '${body.email_id}'`
    /* This query searches amongst users for this email id and password */

    try {
        connectdb.query(sql, (err,result) => {
            if (err) throw err

            /* Below lines checks if above query was empty or not */
            if (JSON.stringify(result.rows) === '[]') {
                customer_id = uniqid()
                cart_id = uniqid()
                // console.log(body)

                /* If no user was found this query creates a new user and inserts it in customer table */
                let cart_sql = 
                `
                    INSERT INTO CART(cart_id,total_cost)
                    VALUES
                    ('${cart_id}',0.0)
                `
                connectdb.query(cart_sql, (err,result) => {
                    if (err) throw err
                })
                let sql = 
                `
                    INSERT INTO customer(customer_id,name,phone_no,address,cart_id,password,email_id) 
                    VALUES
                    ('${customer_id}','${body.name}','${body.phone_no}','${body.address}','${cart_id}','${body.password}','${body.email_id}')
                `
                connectdb.query(sql, (err,result) => {
                    if (err) throw err;
                    console.log('user saved in db')
                    res.redirect(`/users/${customer_id}`)  // redirections to be handled in frontend
                })
            }
            else {

                // If user was found
                res.send('User exists')
                console.log('user already exists')
                // res.redirect(`/users/${result[0].id}`)
            }
        })
    }
    catch(err) {
        console.log(err)
    }
})


module.exports = router