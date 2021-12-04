const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');
const requireLogin = require('../../middleware/requireLogin')
// const moment = require('moment')


/* get route to get all the orders placed by the user */
router.get('/users/:customer_id/orders', requireLogin, (req,res) => {
    const customer_id = req.session.user_id // getting customer id from cookies

    /* getting product id */
    let product_ids_sql = 
    `
        select product_id from order_details where customer_id = '${customer_id}'
    `
    connectdb.query(product_ids_sql, (err,result) => {
        const product_ids = result.rows
        const product_ids_array = []
        for (p of product_ids)
            product_ids_array.push(p.product_id)

        /* comma seperating ids */
        let ids = product_ids_array.join("','", product_ids_array)

        /* getting the product details by the id obtained above */
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

            /* getting order details from the customer id */
            let sql = 
            `
                select * from order_details where customer_id = '${customer_id}'
            `
            connectdb.query(sql, (err,result) => { 
                if (err) throw err
                const orders = result.rows
                if (orders.length === 0) {
                    res.send('No orders yet')
                }
                else {
                    // console.log(product_details)
                    // console.log(orders);

                    /* getting product quantity from order details by using ids */
                    let quantity_sql = 
                    `
                        select quantity,product_id from cart_item where product_id in ('${ids}')
                    `
                    connectdb.query(quantity_sql, (err,result) => {
                        if (err) throw err
                        let quantities = (result.rows)
                        res.render('user/orders', {orders,customer_id, product_details,quantities})
                    })
                }
            })
        })
    })
})



/* post method for placing new order */
router.post('/order', (req,res) => {

    /* cookie data parsed */
    const customer_id = req.session.user_id
    const cart_id = req.session.cart_id
    // console.log(customer_id)

    /* unique order id */
    const order_id = uuidv4()

    /* code to obtain current date and time */
    let date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    const hours = String(date.getHours())
    const minutes = String(date.getMinutes())
    const seconds = String(date.getSeconds())
    date = yyyy + '-' + mm + '-' + dd + ' ' + hours + ':' + minutes + ':' + seconds;



    /* getting details from request body */
    const product_id = req.body.product_id
    const total_price = req.body.price
    const total_discount = req.body.discount

    /* unique transaction id */
    const transaction_id = uuidv4()

    /* discount deducted */
    let total_amount = total_price - total_discount


    /* transaction placed before order */
    let transaction_sql = 
    `
        insert into transaction
        values('${transaction_id}','${date}','${total_amount}','${customer_id}','${cart_id}')
    `
    
    connectdb.query(transaction_sql, (err,result) => {
        if (err) throw err

        /* query to insert new order */
        let order_sql = 
    `
        insert into order_details
        values
        ('${order_id}','${date}','${customer_id}','${product_id}',${total_price},${total_discount},'${transaction_id}','${cart_id}') 
    `   
        connectdb.query(order_sql, (err,result) => {
            if (err) console.log(err)
            console.log('Order placed')

            req.session.orderPlaced = 1
            res.redirect(`/users/${customer_id}/cart`)
        })
    })
})



module.exports = router // router exported