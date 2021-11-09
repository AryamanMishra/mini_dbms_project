const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');


/* Hellop */

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
            if (result.rows.length !== 0)
                cart_items = result.rows
            res.render('user/cart', {total_cost,cart_items, customer_id})
            // res.status(200).send(result.rows[0]["total_cost"].toString())
        })
    })
})



router.post('/categories/:category_name/cart', (req,res) => {
    const customer_id = req.cookies.customer_id
    const product_id = req.body.product_id
    const cart_id = req.cookies.cart_id
    let quantity = 1
    let check_cart_for_this_item = 
    `
        select * from cart_item where cart_id = '${cart_id}' and product_id = '${product_id}'
    `
    connectdb.query(check_cart_for_this_item, (err,result) => {
        if (err) throw err
        if (result.rowCount !== 0) {
            quantity += result.rowCount
            let cart_sql = 
            `
                update cart_item
                set quantity = '${quantity}'
                where product_id = '${product_id}'
            `
            connectdb.query(cart_sql, (err,result) => {
                if (err) throw err
                console.log('quantity updated')
            })
        }
        else {
            let cart_sql = 
            `
                insert into cart_item
                values ('${product_id}','${cart_id}', '${quantity}')
            `
            connectdb.query(cart_sql, (err,result) => {
                if (err) throw err
                console.log('inserted to cart')
            })
        }
        res.redirect(`/users/${customer_id}/cart`)
    })
})

module.exports = router