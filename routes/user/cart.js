const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');




router.get('/users/:id/cart', (req,res) => {
    customer_id = req.params.id
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
            res.render('user/cart', {total_cost,cart_items})
            // res.status(200).send(result.rows[0]["total_cost"].toString())
        })
    })
})



module.exports = router