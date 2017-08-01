const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Client } = require('pg');
const SQL = require('sql-template-strings');
const fs = require('fs');

const client = new Client({
	database: 'bulletinboard',
	host: 'localhost',
	user: process.env.POSTGRES_USER
})

client.connect();

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/../public'));
app.use('/', bodyParser());
// app.use(bodyParser({extended: true}))


app.get('/', function (req, res) {
	res.render('index');
});

app.post('/message', function (req, res) {
	let sendingTitle = req.body.title;
	console.log(req.body.title);
	let sendingMessage = req.body.message;
	console.log(req.body.message);
	// console.log(req.body)
	
	client.query(SQL`insert into messages (title,body) values (${sendingTitle}, ${sendingMessage});`, (err) => {
		console.log(err ? err.stack : 'new message added to the database')
	});
		res.redirect('/messagepost')

});


app.get('/messagepost', function (req, res) {
	client.query('select * from messages', function (err, result) {
		if(err){
		throw err;
		}
		console.log(result.rows)
		res.render('result', {key: result.rows});
	});
});



var server = app.listen(3000, function(req,res){
    console.log('Hey, is this thing on?!')
});
