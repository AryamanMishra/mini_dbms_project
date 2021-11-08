const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');




router.get('/users/:id', (req,res) => {
    const customer_id = req.params.id
    let customer_name = ''
    let sql =
    `
        SELECT name from customer where customer_id = '${customer_id}'
    `
    connectdb.query(sql, (err,result) => {
        if (err) throw err
        customer_name = result.rows[0].name
        res.render('user/home', {customer_id,customer_name})
    })
})


module.exports = router