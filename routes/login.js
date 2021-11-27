
/* Basic module requiring */
const {Router} = require('express')
const express = require("express");
const router = express.Router();
const connectdb = require('../db_files/connect') // connect file connects to pgsql
const auth = require('../middleware/auth')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const session = require("express-session");

router.use(cookieParser())
// router.use(session({
//     secret:'asecret'
// }))


/* Getting login page */
router.get('/login',(req,res,next) => {
    res.render('login')
})



/* Login functionality */
router.post('/login',(req,res) => {
    const body = req.body // gives user mail and password been used for login

    /* This query checks whether a user with same email and password exists */
    const password = req.body.password
    let sql = `SELECT * FROM customer WHERE email_id = '${body.email_id}'`
    try {
        connectdb.query(sql, async(err,result) => {
            if (err) console.log(err)


            /* This clause checks whether the result of the above query gives any rows or not */
            /* If the result is empty that means no user by above creds exists */
            if (JSON.stringify(result.rows) === '[]') {
                res.send('User does not exist please signup')
                console.log('User does not exists')
            }

            /* The result was not empty and we obtain a user with specified email */
            else {

                /* This line checks whether the user entered password 
                matches with the password of the person whose email is found valis */
                const validPassword = await bcrypt.compare(password,result.rows[0].password)


                if (validPassword) {
                    const customer_id = result.rows[0].customer_id
                    const cart_id = result.rows[0].cart_id
                    req.session.user_id = customer_id
                    req.session.cart_id = cart_id
                    // /* saving cookies upon logging */
                    // res.cookie('customer_id', customer_id) 
                    // res.cookie('cart_id', cart_id)
                    req.flash('success', 'Logged in succesfully')
                    res.redirect(`/users/${customer_id}`)
                }
                else {
                    res.send('User does not exist please signup')
                }
            }
        })    
    } 
    catch (err) {
        console.log(err)
    }
})



module.exports = router  // exporting router