var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '123456789',
	database : 'loginDatabase'
});

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/login', function(request, response) {
	//console.log(request.url);
	response.sendFile(path.join(__dirname,"public", 'login.html'));

});

app.get('/configure', function(request, response) {

   response.sendFile(path.join(__dirname + '/configure.html'));
	 
});

/*app.get('/image', function(request, response) {
	
	response.sendFile(path.join(__dirname+ '/public/images/navy.png'));

});

app.get('/login-css', function(request, response) {
	
	response.sendFile(path.join(__dirname+ '/public/css/login.css'));

});

app.get('/3dlogo', function(request, response) {
	
	response.sendFile(path.join(__dirname+ '/public/images/3dlogo.png'));

});

app.get('/aircraftlist-css', function(request, response) {
	
	response.sendFile(path.join(__dirname+ '/aircraftlist.css'));

});


app.get('/jquery.min-js', function(request, response) {
	
	response.sendFile(path.join(__dirname+ '/jquery.min.js'));

});

app.get('/configure', function(request, response) {

   response.sendFile(path.join(__dirname + '/configure.html'));
	 
});
*/


app.post('/login-auth', function(request, response) {
	var username = request.body.userid;
	var password = request.body.pswrd;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/aircraftlist');
				
			} else {
				response.send('Incorrect Username and/or Password!');

			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});



app.get('/aircraftlist', function(request, response) {

   response.sendFile(path.join(__dirname + '/aircraftlist.html'));
	 
});


app.post('/configure-auth', function(request, response) {
	var curentUsername = request.body.CurrentUsername;
	var newUsername = request.body.NewUsername;
	var newPassword=request.body.NewPassword;
	var confirmPassword=request.body.ConfirmPassword;

	
	
	connection.query('SELECT * FROM accounts WHERE username = ? ', [curentUsername], function(error, results, fields) {
			if (results.length > 0) 
			{
				request.session.loggedin = true;
				//console.log("Login id "+curentUsername+" already exist")
				if(newPassword==confirmPassword)
				{
				     connection.query("UPDATE accounts SET username = ?, password = ?",[newUsername,newPassword],function(error, results, fields) 
				     {  if (error)
                        {
                             return console.error(error.message);
                        } 
                       
                        else
                        {                  
                              console.log("new login id and password successfully updated");
                              //response.send("new login id and password successfully updated");
                        }

				     });
				     
                }
                else
                {
                	response.send("entered newPassword donot match with confirmPassword");
                }

				
				
			} 

			else 

			{
				
                console.log("Login id "+curentUsername+" Don't exist") ;
			}			
			response.end();
		});
	
});

app.listen(3000);