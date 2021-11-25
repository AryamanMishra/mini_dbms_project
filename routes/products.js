
/* Basic module requiring */
const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');
const requireLogin = require('../middleware/requireLogin')


/* Getting all the products of a particular category */
router.get('/categories/:name', requireLogin, (req,res) => {
    const customer_id = req.session.user_id
    const category_name =  req.params.name // getting category name from the parameters

    /* getting category id */
    let category_id_sql = 
    `
        select category_id from category
        where category_name = '${category_name}'
    `
    connectdb.query(category_id_sql, (err,result) => {
        const category_id = result.rows[0].category_id


        /* getting products from the above mentioned id */
        let cat_prod = 
        `
            select product_id,product_name,brand,price,discount,availability
            from product where category_id = '${category_id}'
        `
        connectdb.query(cat_prod, (err,result) => {
            if (err) throw err
            const products = result.rows // products
            if (req.session.user_id) {
                res.render('products',{products,category_name, customer_id}) //rendering products page
            }
            else {
                res.redirect('/login')
            }
        })
    })
})



module.exports = router // exporting router