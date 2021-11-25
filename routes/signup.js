
/* Basic module requiring */
const {Router, application} = require('express')
const express = require("express");
const router = express.Router();
const connectdb = require('../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')

router.use(cookieParser())


/* Getting singup page */
router.get('/signup',(req,res,next) => {
    res.render('signup')
})



/* Signup functionality */
router.post('/signup', (req,res) => {
    let body = req.body  
    let sql = `SELECT * FROM customer WHERE email_id = '${body.email_id}'`
    /* This query searches amongst users for this email id and password */

    try {
        connectdb.query(sql, async(err,result) => {
            if (err) throw err

            /* Below lines checks if above query result was empty or not */
            if (JSON.stringify(result.rows) === '[]') {
                const customer_id = uniqid()
                const cart_id = uniqid()
                // console.log(body)

                // /* setting cookies */
                // res.cookie('customer_id', customer_id)
                // res.cookie('cart_id', cart_id)

                /* If no user was found this query creates a new user cart and inserts it in cart table */
                let cart_sql = 
                `
                    INSERT INTO CART(cart_id,total_cost)
                    VALUES
                    ('${cart_id}',0.0)
                `
                connectdb.query(cart_sql, (err,result) => {
                    if (err) throw err
                })


                /* password stored in hash form */
                /* 12 is the number of salt rounds */
                const hashPassword = await bcrypt.hash(body.password,12)


                /* If no user was found this query creates a new user and inserts it in customer table */
                let sql = 
                `
                    INSERT INTO customer(customer_id,name,phone_no,address,cart_id,password,email_id) 
                    VALUES
                    ('${customer_id}','${body.name}','${body.phone_no}','${body.address}','${cart_id}','${hashPassword}','${body.email_id}')
                `
                connectdb.query(sql, (err,result) => {
                    if (err) throw err;
                    console.log('user saved in db')
                    req.session.user_id = customer_id
                    res.redirect(`/users/${customer_id}`)  
                })
            }
            else {

                // If user was found
                res.send('Email id already exists')
                console.log('user already exists')
                // res.redirect(`/users/${result[0].id}`)
            }
        })
    }
    catch(err) {
        console.log(err)
    }
})


module.exports = router  // exporting router