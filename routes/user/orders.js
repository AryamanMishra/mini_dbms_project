const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');




router.get('/users/:customer_id/orders', (req,res) => {
    const customer_id = req.cookies.customer_id
    let product_ids_sql = 
    `
        select product_id from order_details where customer_id = '${customer_id}'
    `
    connectdb.query(product_ids_sql, (err,result) => {
        const product_ids = result.rows
        const product_ids_array = []
        for (p of product_ids)
            product_ids_array.push(p.product_id)
        let product_details_sql = 
        `
            select * from product where product_id in (select product_id from order_details where customer_id = '${customer_id}')
        `
        connectdb.query(product_details_sql, (err, result) => {
            if (err) throw err
            const product_details = result.rows
            let sql = 
            `
                select * from order_details where customer_id = '${customer_id}'
            `
            connectdb.query(sql, (err,result) => { 
                const orders = result.rows
                console.log(product_details)
                res.render('user/orders', {orders,customer_id, product_details})
            })
        })
    })
})



module.exports = router