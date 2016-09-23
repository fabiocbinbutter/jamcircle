const fs=require('fs');

module.exports=function(env){
		if(!~["dev","qa","staging","prod"].indexOf(env)){throw "Invalid env"}
		console.log("Using "+env+" config");

		return {
				"session":{
						secret: JSON.parse(fs.readFileSync('secret/cookieSecret.json')),
						resave: false,
						saveUninitialized: true,
						secure:{dev:false}[env]||true
					},
				"grant":{
						"server": {
								"protocol": {dev:"http"}[env]||"https",
								"host": {
										dev:"dev.tamanin.com:3000"
									}[env]||"jamcircle.us"
							},
						"facebook": {
								"key": "1419234001659548",
								"secret": JSON.parse(fs.readFileSync('secret/fbAppSecret.json')),
								"scope": ["user_events", "user_actions.music"],
								"callback": "/connected/facebook"
							},
						"spotify": {
								"key": "22c2017d1a1c4b5593947d39e82865d1",
								"secret": JSON.parse(fs.readFileSync('secret/sfAppSecret.json')),
								"scope": ["user-top-read","user-library-read"],
								"callback": "/connected/spotify"
							}
					}
			};
	}
