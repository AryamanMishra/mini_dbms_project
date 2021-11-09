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

const userOrders = require('./routes/user/orders')

const userTransactions = require('./routes/user/transactions')

const categories = require('./routes/categories')

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




// Listening requests
const port = process.env.port || 8888
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


