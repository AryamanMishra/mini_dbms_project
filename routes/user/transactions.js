const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');
const requireLogin = require('../../middleware/requireLogin')



/* get route to get user transactions */
router.get('/users/:customer_id/transactions', requireLogin, (req,res) => {

    const customer_id = req.session.user_id

    /* transaction details obtained from customer id */
    let sql = 
    `
        select * from transaction where customer_id = '${customer_id}'
    `
    connectdb.query(sql, (err,result) => {
        if (err) throw err
        const transactions = result.rows

        /* product id obtained  */
        let product_id_sql = 
        `
            select a.product_id from order_details as a inner join transaction as b
            on a.transaction_id = b.transaction_id
        `
        connectdb.query(product_id_sql, (err,result) => {
            if (err) throw err
            const product_id = result.rows
            let product_id_array = []
            for (let p of product_id)
                product_id_array.push(p.product_id)
            let ids = product_id_array.join("','", product_id_array)

            /* product details obatined from the id*/
            let product_details_sql = 
            `
                select * from product where product_id in ('${ids}')
            `
            connectdb.query(product_details_sql, (err,result) => {
                if (err) throw err 
                let product_details = result.rows

                /* order details obtained */
                let order_details_sql = 
                `
                    select * from order_details where product_id in ('${ids}')
                `
                connectdb.query(order_details_sql, (err,result) => {
                    if (err) throw err
                    let order_details = result.rows
                    // console.log(product_details)

                    /* if no transactions found */
                    if (transactions.length === 0) {
                        res.send('No transactions yet')
                    }
                    else {
                        res.render('user/transactions', {transactions,customer_id,product_details,order_details})
                    }
                })
            })
        })
    })
})



module.exports = router // router exported