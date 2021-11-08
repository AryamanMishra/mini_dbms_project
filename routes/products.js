const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');




router.get('/categories/:name', (req,res) => {
    const category_name =  req.params.name
    let category_id_sql = 
    `
        select category_id from category
        where category_name = '${category_name}'
    `
    connectdb.query(category_id_sql, (err,result) => {
        const category_id = result.rows[0].category_id
        let cat_prod = 
        `
            select product_name,brand,price,discount,availability
            from product where category_id = '${category_id}'
        `
        connectdb.query(cat_prod, (err,result) => {
            if (err) throw err
            const products = result.rows
            res.render('products',{products,category_name, customer_id})
        })
    })
})



module.exports = router