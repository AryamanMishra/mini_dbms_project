const {Pool} = require('pg')

const connect = new Pool({
    host:'localhost',
    user:'postgres',
    password:'arya99',
    database:'test_node',
    port:5432
})

module.exports = connect;