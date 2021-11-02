const {Pool} = require('pg')

const connect = new Pool({
    host:'localhost',
    user:'postgres',
    password:'arya99',
    database:'e_commerce',
    port:5432
})

module.exports = connect;