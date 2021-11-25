/* Basic module requiring */
const {Router} = require('express')
const express = require("express");
const router = express.Router();
const connectdb = require('../db_files/connect') // connect file connects to pgsql
const auth = require('../middleware/auth')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const session = require("express-session");



router.post('/logout', (req,res) => {
    req.session.destroy()
    res.redirect('/')
})


module.exports = router