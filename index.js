const env=process.env.NODE_ENV || 'dev';
const util = require('util')
const config=require('./config.js')(env)

const express = require('express')
	var app = express()

const logger = require('morgan')
		app.use(logger(env))

const engine = require('express-dot-engine')
		app.engine('dot',engine.__express)
		app.set('views', './views')
		app.set('view engine', 'dot')

const session = require('express-session')
		app.use(session(config.session))

const Grant = require('grant-express')
		app.use(new Grant(config.grant))

const db=require("./model.js")(config.database)

const request = require('request')
const promise = require('bluebird')
const purest = require('purest')({request:request,promise:promise})
const purestConfig = require('@purest/providers')
const facebook = purest({provider: 'facebook', config:purestConfig})
const spotify = purest({provider: 'spotify', config:purestConfig})

app.use(express.static('static'))

app.get(config.grant.facebook.callback, storeReturnPath, function (req, res) {
		req.session.tokens.facebook=req.query;
		const token=req.session.tokens.facebook.access_token
		const fbUser=facebook.auth(token).get('me').qs({fields:'id,name,picture'}).request();
		fbUser.then(fbRes=>fbRes[0].body)
				.then(fbAccount=>
						db.fbAccounts.findOrCreate({
								where:{accountId:fbAccount.id},
								default:{
										accountId:fbAccount.id,
										name:fbAccount.name,
										pictureUrl:fbAccount.picture
									}
							})
					)
				.then(x=>res.send(JSON.stringify(x)))
				.catch(err=>res.send("Error:"+err));
		//res.end("Return to "+(req.session.returnPath||"root"))
		/*TODO: start loading events
		fbUser.then(remoteRes=>facebook
						.auth(token)
						.get('me/events')
						//.qs({type:...)
						.request()
			)*/
	})

app.get(config.grant.spotify.callback, storeReturnPath, function (req, res) {
		req.session.spotify=req.query;
		res.end("Return to "+(req.session.returnPath||"root"))
	})

app.get("/dev",(req,res)=>{
		res.end(JSON.stringify(req.session,undefined,2))
	})

app.get("/",(req,res)=>res.render('connect',{session:req.session}))

Promise.all(Object.keys(db).map(k=>db[k].sync()))
		.then(()=>
				app.listen(3000, function () {
						console.log('Express server listening on port ' + 3000)
					})
			)



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

function storeReturnPath(req,res,next){
		const ref=req.get("referer");
		//TODO :validate trusted URL
		req.session.returnPath=ref;
		next();
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
