const express = require('express')
const session = require('express-session')
const http=require('http')
const pRequest=require('request-promise');
const fs=require('fs');
const util = require('util');
const templates = require("dot").process({ path: "./templates"});

//const pGraph = promisify(require('fbgraph'), undefined, true);
//pGraph.setVersion("2.5");

const app = express();

const env=process.env.NODE_ENV || 'dev';
const protocol = "http"
const host = "dev.tamanin.com"
const port = process.env.PORT || 3000;
const origin=protocol+'://'+host+(port==80||port==443?'':':'+port)

const conf = {
		fb:{
				apiVersion:"v2.7",
				clientId:'1419234001659548',
				clientSecret:JSON.parse(fs.readFileSync('secret/fbAppSecret.json')),
				scope:'user_events, user_actions.music',
				redirectUri:origin+"/connect/facebook"
			},
		spotify:{
				clientId:"",
				clientSecret:"",
				scope:"user-library-read,user-top-read", //later add playlist-read-private with UI to opt-in playlists
				redirectUri:origin+"/connect/spotify"
			}
	};


app.get("/",redirectRoot)
app.get("/connect", ... )
app.get("/connect/facebook", connectFacebook )
app.get("/connect/spotify", connectSpotify )
app.get("/events", ... )
app.get("/feed", ... )
app.get("/user/:userId", ... )
app.get("/event/:eventId", ... )


app.listen(port, function() {
		console.log("Express server listening on port %d", port);
	});



function redirectRoot(req,res){
		if(!req.session.fb || ! req.session.spotify){res.redirect("/connect"); return;}
		res.redirect("/feed")
	});


function connectFacebook(req,res){
		if (req.query.error) {res.send('Facebook access denied');return;}
		if (!req.query.code) {//Not a redirect from fb, starting the process
				else{res.redirect(dialogUrl(conf));return;}
			}else{ //req.query.code is set, i.e. user has been directed here after acceptin on fb.com
				const pUser=pRequest
						.get(authUrl(conf,request.query.code)
						.then(JSON.parse)
						.then(property("access_token"))
						.then(setOnAs(req.session,"fbToken"))
						.then(getFbUser)
						.then(setOnAs(req.session,"fb"));
				pUser.then(fbUser=>res.redirect(req.session.spotify?:"/connect":"/"))
				pUser.then(getFbUserEvents)
						.then(storeEvents)
					;
			}
		return;

		function dialogUrl(conf){
				return ("https://www.facebook.com/"+conf.fb.apiVersion+"/dialog/oauth"
						+"?client_id="+conf.fb.clientId
						+"&redirect_uri="+conf.fb.redirectUri
						+"&scope="+conf.fb.scope
					);
			}
		function authUrl(conf,code){
				return ("https://graph.facebook.com/"
						+conf.fb.apiVersion
						+"/oauth/access_token"
						+"?client_id="+conf.fb.clientId
						+"&redirect_uri="+conf.fb.redirectUri
						+"&client_secret="+conf.fb.clientSecret
						+"&code="+code
					)
			}
	}

function connectSpotify(req,res){
		if (req.query.error) {res.send('Spotify access denied');return;}
		if (!req.query.code) {
				res.redirect(dialogUrl(conf));return;}
			}else{ //req.query.code is set, i.e. user has been directed here after acceptin on dialog
				const pUser=pRequest
						.get(authUrl(conf.spotify,request.query.code)
						.then(JSON.parse)
						.then(property("access_token"))
						.then(setOnAs(req.session,"sfToken"))
						.then(getSfUser)
						.then(setOnAs(req.session,"spotify"));
				pUser.then(sfUser=>res.redirect(req.session.fb?:"/connect":"/"))
				pUser.then(sfFbUserMusic)
						.then(storeEvents)
					;
			}
		return;

		function dialogUrl(conf){
				return (
						"https://accounts.spotify.com/authorize/"
						+ "?client_id="+conf.clientId
						+ "&response_type=code"
						+ "&redirect_uri="+conf.redirectUri
						+ "&scope="conf.scope
						//TODO: add state for anti XSRF
					);
			}

		function authUrl(){
				//continue here

			}

	}


function setOnAs(tgt,prop){
		return (val=>tgt[prop]=val)
	}
function property(prop){
		return (obj=>obj[prop])
	}


function fbAuth(req, res) {

	}

function

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
