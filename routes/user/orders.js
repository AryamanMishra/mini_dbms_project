const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');




router.get('/users/:customer_id/orders', (req,res) => {
    const customer_id = req.cookies.customer_id
    let sql = 
    `
        select * from order_details where customer_id = '${customer_id}'
    `
    connectdb.query(sql, (err,result) => {
        if (err) throw err
        const orders = result.rows
        res.render('user/orders', {orders,customer_id})
    })
})



module.exports = router