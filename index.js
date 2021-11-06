/* Basic modules requiring */

/* Views folder is only for additional testing and should be removed later */

const express = require('express')
const app = express()
const path = require('path')
const connectdb = require('./connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');


// inbuilt connect function 
connectdb.connect((err) => {
    if (err) throw err
    console.log('pgsql connection confirmed')
})


/* Setting views repo for ejs */
/* To be handled in frontend later */
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))


/* For static files */
/* To be handled in frontend later */
app.use(express.static(__dirname + '/public'));


/* For json formatting of data */
app.use(express.json())
app.use(express.urlencoded({extended:true}))




/* Home page */
app.get('/', (req,res) => {
    res.render('home')
})


/* Getting login page */
app.get('/login', (req,res) => {
    res.render('login')
})


/* Login functionality */
app.post('/login', (req,res) => {
    const body = req.body // gives user mail and password been used for login
    //console.log(body)

    /* This query checks whether a user with same email and password exists */
    let sql = `SELECT * FROM customer WHERE password= '${body.password}' AND email_id = '${body.email_id}'`
    try {
        connectdb.query(sql, (err,result) => {
            if (err) console.log(err)


            /* This clause checks whether the result of the above query gives any rows or not */
            /* If the result is empty that means no user by above creds exists */
            if (JSON.stringify(result.rows) === '[]') {
                res.send('User does not exists please signup')
                console.log('User does not exists')
            }

            /* The result was not empty and we obtain a user with specified email and password */
            else {
                res.redirect(`/users/${id}`)
                console.log(result.rows)
            }
        })    
    } 
    catch (err) {
        console.log('error')
    }
})





/* Getting singup page */
app.get('/signup', (req,res) => {
    res.render('signup')
})


/* Signup functionality */
app.post('/signup', (req,res) => {
    let body = req.body  
    let sql = `SELECT * FROM customer WHERE password= '${body.password}' AND email_id = '${body.email_id}'`
    /* This query searches amongst users for this email id and password */

    try {
        connectdb.query(sql, (err,result) => {
            if (err) throw err

            /* Below lines checks if above query was empty or not */
            if (JSON.stringify(result.rows) === '[]') {
                const customer_id = uniqid()
                const cart_id = uniqid()
                // console.log(body)

                /* If no user was found this query creates a new user and inserts it in customer table */
                let cart_sql = 
                `
                    INSERT INTO CART(cart_id,total_cost)
                    VALUES
                    ('${cart_id}',0.0)
                `
                connectdb.query(cart_sql, (err,result) => {
                    if (err) throw err
                })
                let sql = 
                `
                    INSERT INTO customer(customer_id,name,phone_no,address,cart_id,password,email_id) 
                    VALUES
                    ('${customer_id}','${body.name}','${body.phone_no}','${body.address}','${cart_id}','${body.password}','${body.email_id}')
                `
                connectdb.query(sql, (err,result) => {
                    if (err) throw err;
                    console.log('user saved in db')
                    res.redirect(`/users/${customer_id}`)  // redirections to be handled in frontend
                })
            }
            else {

                // If user was found
                res.send('User exists')
                console.log('user already exists')
                // res.redirect(`/users/${result[0].id}`)
            }
        })
    }
    catch(err) {
        console.log(err)
    }
})



app.get('/users/:id', (req,res) => {
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



app.get('/users/:id/cart', (req,res) => {
    const customer_id = req.params.id
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



app.get('/categories', (req,res) => {
    let sql = 
    `
        select * from category
    `
    connectdb.query(sql, (err,result) => {
        if (err) throw err
        const categories = result.rows
        res.render('categories', {categories})
        // console.log(result.rows)
    })
})





app.get('/seller', (req,res) => {
    let sql =
    `
        select * from seller
    `
    connectdb.query(sql, (err,result) => {
        if (err) throw err
        res.send(result.rows)
        console.log(result.rows)
    })
})


// Listening requests
const port = process.env.port || 8888
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


