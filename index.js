/* Basic modules requiring */

/* Views folder is only for additional testing and should be removed later */

const express = require('express')
const app = express()
const path = require('path')
const connectdb = require('./db_files/connect') // connect file connects to pgsql
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



const loginRoute = require('./routes/login')
const signupRoute = require('./routes/signup')
const userHome = require('./routes/user/home')
const userCart = require('./routes/user/cart')
const categories = require('./routes/categories')
const userOrders = require('./routes/user/orders')
const seller = require('./routes/seller')
const products = require('./routes/products')



app.use('/', loginRoute)

app.use('/', signupRoute)

app.use('/', userHome)

app.use('/', userCart)

app.use('/', categories)

app.use('/', userOrders)

app.use('/', seller)

app.use('/', products)







app.post('/categories/:category_name/product', (req,res) => {
    const id = req.body.customer_id
    const order_id = uuidv4()
    let date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    date = mm + '/' + dd + '/' + yyyy;
    const product_id = uuidv4()
    const total_price = req.body.price
    const total_discount = req.body.discount
    const transaction_id = uuidv4()
    let order_sql = 
    `
        insert into order_details
        values
        ('${order_id}','${date}','${id}','${product_id}','${total_price}','${total_discount}','${transaction_id}','${cart_id}') 
    `
    connectdb.query(order_sql, (err,result) => {
        if (err) throw err
        let total_amount = total_price - total_discount
        let transaction_sql = 
        `
            insert into transaction
            values('${transaction_id}','${date}','${total_amount}','${id}','${cart_id}')
        `
        connectdb.query(transaction_sql, (err,result) => {
            if (err) throw err
            res.redirect(`/users/${id}/orders`)
        })
    })
})












// Listening requests
const port = process.env.port || 8888
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


