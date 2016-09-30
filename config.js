const fs=require('fs');

module.exports=function(env){
		if(!~["dev","qa","staging","prod"].indexOf(env)){throw "Invalid env"}
		console.log("Using "+env+" config");

		return {
				"database":{
						/*"dialect":"mysql",
						"username":{dev:"root"}[env],
						"password":secret('mysqlDevRootPw'),
						"host":{dev:"localhost"}[env],
						"database":"jamcircle",
						"port":"3306"*/
						"connectionString":{
								dev:"mysql://root:"+secret('mysqlDevRootPw')+"@localhost:3306/jamcircle"
							}[env]
					},
				"session":{
						secret: secret('cookieSecret'),
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
								"secret": secret('fbAppSecret'),
								"scope": ["user_events", "user_actions.music"],
								"callback": "/connected/facebook"
							},
						"spotify": {
								"key": "22c2017d1a1c4b5593947d39e82865d1",
								"secret": secret('sfAppSecret'),
								"scope": ["user-top-read","user-library-read"],
								"callback": "/connected/spotify"
							}
					}
			};

		function secret(name){
				return JSON.parse(fs.readFileSync('secret/'+name+'.json'))
			}
	}
