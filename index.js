/* Basic modules requiring */

const express = require('express')
const app = express()
const path = require('path')
const connectdb = require('./connect') // connect file connects to pgsql
const uniqid = require('uniqid')


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


app.post('/login', (req,res) => {
    const body = req.body
    console.log(body)
    let sql = `SELECT * FROM customer WHERE password= '${body.password}' AND email_id = '${body.email_id}'`
    try {
        connectdb.query(sql, (err,result) => {
            if (err) console.log('error')

            if (JSON.stringify(result.rows) === '[]') {
                res.send('User does not exists please signup')
                console.log('User does not exists')
            }
            else {
                res.send('Logged in succesfully')
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
    // This query searches amongst users for this name and password

    try {
        connectdb.query(sql, (err,result) => {
            if (err) throw err

            // Below lines checks if above query was empty or not
            if (JSON.stringify(result.rows) === '[]') {
                const customer_id = uniqid()
                const cart_id = uniqid()

                // If no user was found this query creates a new user and inserts it in customer table
                let sql = `
                INSERT INTO customer(customer_id,name,phone_no,address,cart_id,password,email_id) 
                VALUES
                ('${customer_id}','${body.name}','${body.phone_no}','${body.address}','${cart_id}','${body.password}','${body.email_id}')
                `
                connectdb.query(sql, (err,result) => {
                    if (err) throw err;
                    console.log('user saved in db')
                    // res.redirect(`/users/${id}`)  // redirections to be handled in frontend
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



// Listening requests
const port = process.env.port || 8888
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
