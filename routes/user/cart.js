
/* Basic modules requiring */
const {Router} = require('express')
const express = require("express");
const router = express.Router();
// const bcryptjs = require("bcryptjs");
const connectdb = require('../../db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');
const requireLogin = require('../../middleware/requireLogin')


/* GET route to obtain user cart page */
router.get('/users/:id/cart', requireLogin, (req,res) => {
    const customer_id = req.params.id // getting customer id been stored in cookies
    const cart_id = req.session.cart_id
    /* basic sql query variable */
    let sql =
    `
        select
            a.total_cost,
            a.cart_id
            from cart as a
            inner join customer as b
            on a.cart_id = b.cart_id
            where b.customer_id = '${customer_id}'
            and a.cart_id = '${cart_id}'
            and a.cart_id = b.cart_id
    `

    /* running the above query */
    connectdb.query(sql, (err,result) => {
        if (err) throw err
        let total_cost = 0
        if (result.rows.length !== 0) {
            total_cost = result.rows[0].total_cost
        }
        /* getting cart items */
        let cart_item_sql = 
        `
            select 
            a.product_id,
            a.quantity
            from cart_item as a
            inner join cart as b
            on a.cart_id = b.cart_id
            where a.cart_id = '${cart_id}'
            and b.cart_id = '${cart_id}'
        `
        connectdb.query(cart_item_sql, (err,result) => {
            if (err) throw err
            let cart_items = null
            if (result.rows.length !== 0) {
                cart_items = result.rows
                // console.log(cart_items)

                /* getting product details present in the cart */
                let sql = 
                `
                select * from product where product_id in 
                    (select 
                    a.product_id
                    from cart_item as a
                    inner join cart as b
                    on a.cart_id = b.cart_id
                    where a.cart_id = '${cart_id}'
                    )
                `
                connectdb.query(sql, (err,result) => {
                    if (err) throw err
                    let product_details = result.rows
                    //console.log(cart_items)
                    // console.log(product_details)
                    // for (let i=0;i<cart_items.length;i++) {
                    //     for (let j=0;j<product_details.length;j++) {
                    //         if (cart_items[i].product_id === product_details[j].product_id)
                    //             total_cost += cart_items[i].quantity*(product_details[j].price - product_details[j].discount)
                    //     }
                    // }
                    res.render('user/cart', {total_cost,cart_items, customer_id, product_details,cart_id})
                })
               
            }
            else 
                res.send('No items yet')
        })
    })
})


/* GET route add items in user cart */
router.post('/cart', (req,res) => {
    const customer_id = req.session.user_id
    const cart_id = req.session.cart_id
    const product_id = req.body.product_id

    /* checking if product customer wants to add is already present */
    let check_if_item_present = 
    `
        select quantity from cart_item as a
        where a.product_id = '${product_id}' and a.cart_id = '${cart_id}'
    `
    connectdb.query(check_if_item_present, (err,result)=> {
        if (err) throw err

        /* if product is already there as a cart item */
        if (result.rows.length !== 0) {
            let quantity = result.rows[0].quantity
            // console.log(quantity);
            quantity += 1 // increasing quantity

            /* query to update the quantity of the product as its present already in the cart */
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
                    let show_cart_items_sql = 
                    `
                        select 
                            (a.price - a.discount)*b.quantity as def_cost
                            from product as a
                            inner join cart_item as b
                            on a.product_id = b.product_id
                            where a.product_id = b.product_id
                            and b.cart_id = '${cart_id}'
                    `
                    connectdb.query(show_cart_items_sql, (err,result) => {
                        if (err) throw err
                        let cart_items = result.rows
                        let total_cost = 0
                        for (let i=0;i<cart_items.length;i++)
                            total_cost += cart_items[i].def_cost
                        let total_cost_sql = 
                        `
                            update cart
                            set total_cost = '${total_cost}'
                            where cart_id = '${cart_id}'
                        `
                        connectdb.query(total_cost_sql, (err,result) => {
                            if (err) throw err
                        })
                    })
                })
            })
        }

        /* if product not already present as cart item */
        else {

            /* inserting the product as cart item */
            let cart_item_sql = 
            `
                insert into cart_item
                values
                ('${product_id}', '${cart_id}', 1) 
            `
            connectdb.query(cart_item_sql, (err,result) => {
                if (err) throw err 
                console.log('item added to cart');
                

                let show_cart_items_sql = 
                `
                    select 
                        (a.price - a.discount)*b.quantity as def_cost
                        from product as a
                        inner join cart_item as b
                        on a.product_id = b.product_id
                        where a.product_id = b.product_id
                        and b.cart_id = '${cart_id}'
                `
                connectdb.query(show_cart_items_sql, (err,result) => {
                    if (err) throw err
                    let cart_items = result.rows
                    let total_cost = 0
                    for (let i=0;i<cart_items.length;i++)
                        total_cost += cart_items[i].def_cost
                    let total_cost_sql = 
                    `
                        update cart
                        set total_cost = '${total_cost}'
                        where cart_id = '${cart_id}'
                    `
                    connectdb.query(total_cost_sql, (err,result) => {
                        if (err) throw err
                    })
                })
            })
        }
        res.redirect(`/users/${customer_id}/cart`) // redirecting to user cart page 
    })
    
})

module.exports = router