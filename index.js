const express = require('express')
const session = require('express-session')
const http=require('http')
const pRequest=require('request-promise');
const fs=require('fs');
const util = require('util');

//const pGraph = promisify(require('fbgraph'), undefined, true);
//pGraph.setVersion("2.5");

const app = express();

const env=process.env.NODE_ENV || 'dev';
const host = "dev.tamanin.com"
const port = process.env.PORT || 3000;
const fbAuthPath='/connect/facebook';

const conf = {
		fb:{
				client_id:      '1419234001659548',
				client_secret:  JSON.parse(fs.readFileSync('secret/fbAppSecret.json')),
				scope:          'user_events, user_actions.music',
				redirect_uri:   'http://'+host+':'+port+fbAuthPath
			}
	};


app.use(express.static(__dirname + '/static'));

app.get(fbAuthPath,(req,res)=>fbAuth(req,res))

app.listen(port, function() {
  console.log("Express server listening on port %d", port);
});

function fbAuth(req, res) {
		if (!req.query.code) {//Not a redirect from fb, starting the process
				if (req.query.error) {
						res.send('Facebook access denied');
						return Promise.resolve();
					}else{
						res.redirect(
								"https://www.facebook.com/v2.5/dialog/oauth"
								+"?client_id="+conf.fb.client_id
								+"&redirect_uri="+conf.fb.redirect_uri
								+"&scope="+conf.fb.scope
							)
						return Promise.resolve();
					}
			}else{ //req.query.code is set, i.e. user has been directed here after acceptin on fb.com
				return (pRequest
							.get(
									"https://graph.facebook.com/v2.5/oauth/access_token"
									+"?client_id="+conf.fb.client_id
									+"&redirect_uri="+conf.fb.redirect_uri
									+"&client_secret="+conf.fb.client_secret
									+"&code="+req.query.code
							)
						.then(JSON.parse)
						.then(peek)
						.then(fb=>{
								req.session.fbToken=fb.access_token;
								res.send({connected:{fb:true,spotify:req.session.spotify}});
							})
						.catch(peek)
					);
			}
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
