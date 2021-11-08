const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const connectdb = require('../db_files/connect')

module.exports.isAuthenticated = function(req, res, next) {
	try {
		const email_id = req.body.email_id
		const params_email_id = req.params.email_id
		let auth_sql = 
		`
			select * from customer where email_id = '${email_id}' or email_id = '${params_email_id}'
		`
		connectdb.query(auth_sql, (err,result) => {
			if (err) throw err
			const customer = result.rows
			if (JSON.stringify(customer) === '[]') {
				throw new Error("User Does Not Exist");
			}
			req.user = user;
			next();
		})
		
	} 
	catch (err) {
		res.status(401).send("AUTH CHECK");
		console.log(err);
	}
};

