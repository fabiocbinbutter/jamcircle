const fs=require('fs');
const util = require('util');

const express = require('express')
const session = require('express-session')
const logger = require('morgan')
const Grant = require('grant-express')
//const templates = require("dot").process({ path: "./templates"});
//CONTINUE: migrate from request to purest?

const env=process.env.NODE_ENV || 'dev';
const config=require('./config.js')(env)

var grant = new Grant(config.grant)
var app = express()
app.use(logger('dev'))
app.use(session(config.session))
app.use(grant)

app.get(config.grant.facebook.callback, function (req, res) {
		req.session.facebook=req.query;
		res.end(JSON.stringify(req.query, undefined, 2))
	})

app.get(config.grant.spotify.callback, function (req, res) {
		req.session.spotify=req.query;
		res.end(JSON.stringify(req.query, undefined, 2))
	})

app.get("/dev",(req,res)=>{
		res.end(JSON.stringify(req.session,undefined,2))
	})

app.listen(3000, function () {
		console.log('Express server listening on port ' + 3000)
	})

/* Upcoming routes
app.get("/",redirectRoot)
app.get("/events", ... )
app.get("/feed", ... )
app.get("/user/:userId", ... )
app.get("/event/:eventId", ... )
*/
/*
function redirectRoot(req,res){
		if(!req.session.facebook || ! req.session.spotify){res.redirect("/connect"); return;}
		res.redirect("/feed")
	});*/


//CONTINUE .... migrate below from request to purest?
function getFbUser(fbToken){
		if(!fbToken){throw('Missing FB token');}
		return pRequest
				.get(fbGraphUrl+"me?fields=id,name,picture")
				//events.limit(100){id,name,start_time,end_time,place,rsvp_status}")
				.then(fb=>
						req.session.fb={
								id:fb.id, name:fb.name, picture:fb.picture.data.url
							}
					)

	}

function peek(o){
		console.log(
				util.inspect(o,{colors:true, depth:1, maxArrayLength:5})
				.replace(/"([^"]{60})([^"]|\\")+"/,'"$1..."') //long strings
				.replace(/'([^']{60})([^']|\\')+"/,"'$1...'") //long strings
				//remove some uneccessary whitespace from objects
				.replace(/(\n\s+([_a-zA-Z$][_0-9a-zA-Z$]*)?:)\s+([_a-zA-Z$][_0-9a-zA-Z$]* {)/g,"$1 $2")
			);
		return o
	}
