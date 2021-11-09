const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');


/* Hello */

router.get('/users/:id/cart', (req,res) => {
    const customer_id = req.cookies.customer_id
    let sql =
    `
        select
            a.total_cost
            from cart as a
            inner join customer as b
            on a.cart_id = b.cart_id
            where b.customer_id = '${customer_id}'
    `
    connectdb.query(sql, (err,result) => {
        if (err) throw err
        let total_cost = 0
        if (result.rows.length !== 0)
            total_cost = result.rows[0].total_cost
            let cart_item_sql = 
        `
            select 
            a.product_id,
            a.quantity
            from cart_item as a
            inner join cart as b
            on a.cart_id = b.cart_id
        `
        connectdb.query(cart_item_sql, (err,result) => {
            let cart_items = null
            if (result.rows.length !== 0) {
                cart_items = result.rows
                res.render('user/cart', {total_cost,cart_items, customer_id})
            }
            else 
                res.send('No items yet')
            
            // res.status(200).send(result.rows[0]["total_cost"].toString())
        })
    })
})


router.post('/categories/:category_id/cart', (req,res) => {
    const customer_id = req.cookies.customer_id
    const cart_id = req.cookies.cart_id
    const product_id = req.body.product_id
    let check_if_item_present = 
    `
        select quantity from cart_item as a
        where a.product_id = '${product_id}' and a.cart_id = '${cart_id}'
    `
    connectdb.query(check_if_item_present, (err,result)=> {
        if (err) throw err
        if (result.rows.length !== 0) {
            let quantity = result.rows[0].quantity
            // console.log(quantity);
            quantity += 1
            let cart_item_sql = 
            `
                update cart_item
                set quantity = ${quantity}
                where product_id = '${product_id}' and cart_id = '${cart_id}'
            `
            connectdb.query(cart_item_sql, (err,result) => {
                if (err) throw err 
                let sql =  
                `
                select quantity from cart_item where product_id = '${product_id}' and cart_id = '${cart_id}'
                `
                connectdb.query(sql, (err,result) => {
                    if (err) throw err
                    // console.log(result.rows);
                })
            })
        }
        else {
            let cart_item_sql = 
            `
                insert into cart_item
                values
                ('${product_id}', '${cart_id}', 1) 
            `
            connectdb.query(cart_item_sql, (err,result) => {
                if (err) throw err 
                console.log('item added to cart');
            })
        }
        res.redirect(`/users/${customer_id}/cart`)
    })
    
})

module.exports = router