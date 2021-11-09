/* Basic modules requiring */

/* Views folder is only for additional testing and should be removed later */

const express = require('express')
const app = express()
const path = require('path')
const connectdb = require('./db_files/connect') // connect file connects to pgsql
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');
const session = require("express-session");
const auth = require('./middleware/auth')




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


// app.use(session({secret: "secret"}));

// app.use(passport.initialize());
// app.use(passport.session());



/* Home page */
app.get('/', (req,res) => {
    res.render('home')
})



const loginRoute = require('./routes/login')
const signupRoute = require('./routes/signup')
const userHome = require('./routes/user/home')
const userCart = require('./routes/user/cart')
const categories = require('./routes/categories')
const userOrders = require('./routes/user/orders')
const userTransactions = require('./routes/user/transactions')
const seller = require('./routes/seller')
const products = require('./routes/products')



app.use('/', loginRoute)

app.use('/', signupRoute)

app.use('/', userHome)

app.use('/', userCart)

app.use('/', categories)

app.use('/', userOrders)

app.use('/', userTransactions)

app.use('/', seller)

app.use('/', products)







app.post('/categories/:category_name/product', (req,res) => {
    const customer_id = req.cookies.customer_id
    const cart_id = req.cookies.cart_id
    // console.log(customer_id)
    const order_id = uuidv4()
    let date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    date = mm + '/' + dd + '/' + yyyy;
    const product_id = req.body.product_id
    const total_price = req.body.price
    const total_discount = req.body.discount
    const transaction_id = uuidv4()
    let total_amount = total_price - total_discount
    let transaction_sql = 
    `
        insert into transaction
        values('${transaction_id}','${date}','${total_amount}','${customer_id}','${cart_id}')
    `
    
    connectdb.query(transaction_sql, (err,result) => {
        if (err) throw err
        let order_sql = 
    `
        insert into order_details
        values
        ('${order_id}','${date}','${customer_id}','${product_id}','${total_price}','${total_discount}','${transaction_id}','${cart_id}') 
    `   
        connectdb.query(order_sql, (err,result) => {
            if (err) console.log('e')
            res.redirect(`/users/${customer_id}/orders`)
        })
    })
})












// Listening requests
const port = process.env.port || 8888
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


