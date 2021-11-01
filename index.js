const express = require('express')
const app = express()
const path = require('path')
const connectdb = require('./connect')
const uniqid = require('uniqid')

connectdb.connect((err) => {
    if (err) throw err
    console.log('pgsql connection confirmed')
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/', (req,res) => {
    res.render('home')
 
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.get('/signup', (req,res) => {
    res.render('signup')
})

app.post('/signup', (req,res) => {
    let body = req.body
    let sql = `SELECT * FROM users WHERE password= '${body.password}' AND name = '${body.name}'`
    try {
        connectdb.query(sql, (err,result) => {
            console.log(body)
            if (JSON.stringify(result.rows) === '[]') {
                const id = uniqid()
                let sql = `INSERT INTO users(id,name,password) VALUES('${id}','${body.name}','${body.password}')`
                connectdb.query(sql, (err,result) => {
                    if (err) throw err;
                    console.log('user saved in db')
                    // res.redirect(`/users/${id}`)
                })
            }
            else {
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


app.listen('8888', () => {
    console.log('Listening on port 8888')
})
