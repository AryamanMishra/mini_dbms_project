/* mini dbms e-commerce source */


/* Basic modules requiring */
const express = require('express')
const app = express()
const path = require('path')
const connectdb = require('./db_files/connect') // connect file connects to pgsql

/* Both added to generate unique ids */
const uniqid = require('uniqid')
const { v4: uuidv4 } = require('uuid');

/* express session npm package */
const session = require("express-session");

/* auth file */
const auth = require('./middleware/auth')




// inbuilt connect function of pg npm package
connectdb.connect((err) => {
    if (err) throw err
    console.log('pgsql connection confirmed')
})




/* Setting views repo for ejs */
app.set('view engine', 'ejs')

/* setting path to the views folder */
app.set('views', path.join(__dirname,'views'))


/* For static files */
app.use(express.static(__dirname + '/public'));


/* For json formatting of data */
app.use(express.json())
app.use(express.urlencoded({extended:true}))



/* Home page */
app.get('/', (req,res) => {
    res.render('home')
})


/* requiring login route */
const loginRoute = require('./routes/login')

/* requiring signup route */
const signupRoute = require('./routes/signup')

/* requiring user home route */
const userHome = require('./routes/user/home')

/* requiring user cart route */
const userCart = require('./routes/user/cart')

/* requiring categories route */
const categories = require('./routes/categories')

/* requiring user orders route */
const userOrders = require('./routes/user/orders')

/* requiring user transactions route */
const userTransactions = require('./routes/user/transactions')

/* requiring seller route */
const seller = require('./routes/seller')

/* requiring products route */
const products = require('./routes/products')


/* 

    calling all the routed by app.use and linking them directly to the / route.
    This simply means if suppose login route has app.get('/login',..),
    app.use directly go to /login route only.

*/

app.use('/', loginRoute)

app.use('/', signupRoute)

app.use('/', userHome)

app.use('/', userCart)

app.use('/', categories)

app.use('/', userOrders)

app.use('/', userTransactions)

app.use('/', seller)

app.use('/', products)






// Listening requests
const port = process.env.port || 8888
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


