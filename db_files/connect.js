const {Pool} = require('pg') /* Requiring postgres npm package pg */



const connect = new Pool({  /* Making a new instance of the Pool class */
    host:'localhost',
    user:'postgres',
    password:'arya99',
    database:'e_commerce',
    port:5432
})



module.exports = connect; /* Exporting the module */