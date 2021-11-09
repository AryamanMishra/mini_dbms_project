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
        // let product_details_sql = 
        // `
        //     // select * from product where product_id in (select product_id from order_details where customer_id = '${customer_id}')
        // `
        let product_details_sql = 
        `
            select 
            * 
            from product as a
            right join (select product_id from order_details where customer_id = '${customer_id}')
            as b
            on a.product_id = b.product_id
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
                // console.log(product_details)
                // console.log(orders);
                res.render('user/orders', {orders,customer_id, product_details})
            })
        })
    })
})



router.post('/categories/:category_name/product', (req,res) => {
    const customer_id = req.cookies.customer_id
    const cart_id = req.cookies.cart_id
    // console.log(customer_id)
    const order_id = uuidv4()
    let date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    date = mm + '/' + dd + '/' + yyyy;
    const product_id = req.body.product_id
    const total_price = req.body.price
    const total_discount = req.body.discount
    const transaction_id = uuidv4()
    let total_amount = total_price - total_discount
    let transaction_sql = 
    `
        insert into transaction
        values('${transaction_id}','${date}','${total_amount}','${customer_id}','${cart_id}')
    `
    
    connectdb.query(transaction_sql, (err,result) => {
        if (err) throw err
        let order_sql = 
    `
        insert into order_details
        values
        ('${order_id}','${date}','${customer_id}','${product_id}','${total_price}','${total_discount}','${transaction_id}','${cart_id}') 
    `   
        connectdb.query(order_sql, (err,result) => {
            if (err) console.log(err)
            res.redirect(`/users/${customer_id}/orders`)
        })
    })
})




module.exports = router