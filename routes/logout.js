/* Basic module requiring */
const {Router} = require('express')
const express = require("express");
const router = express.Router();
const connectdb = require('../db_files/connect') // connect file connects to pgsql
const auth = require('../middleware/auth')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const session = require("express-session");


/* post method to logout a user with proper destroying of session contents */
router.post('/logout', (req,res) => {
    req.session.destroy()
    res.redirect('/')
})


module.exports = router