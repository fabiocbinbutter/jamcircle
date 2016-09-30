module.exports=function(config){
		const Sequelize = require('sequelize')
		var sequelize = new Sequelize(config.connectionString)
		/*var sequelize = Sequelize(config.database,config.username,config.password,{
				host: config.host,
				dialect:config.dialect
			})*/
		const model = {
				users:sequelize.define("users",{
						name: Sequelize.STRING
					}),
				fbAccounts:sequelize.define("fbAccounts",{
						accountId: Sequelize.STRING,
						name: Sequelize.STRING,
						pictureUrl: Sequelize.STRING
					}),
				sfAccounts:sequelize.define("sfAccounts",{
						accountId: Sequelize.STRING,
						name: Sequelize.STRING,
						pictureUrl: Sequelize.STRING
					}),
				events:sequelize.define("events",{
						title: Sequelize.STRING,
						fbEventId: Sequelize.STRING,
						startTime: Sequelize.DATE,
						endTime: Sequelize.DATE,
						location:  Sequelize.STRING
					}),
				rsvps:sequelize.define("rsvps",{
						status: Sequelize.STRING
					}),
				songs:sequelize.define("songs",{
						title: Sequelize.STRING
					}),
				usersXSongs:sequelize.define("usersXSongs",{
							plays: Sequelize.STRING,
							firstDate: Sequelize.DATE,
							lastDate: Sequelize.DATE,
							rating: Sequelize.FLOAT
						})
			};
		model.users.hasOne(model.fbAccounts)
		model.users.hasOne(model.sfAccounts)

		model.events.belongsToMany(model.fbAccounts,{through:"rsvps"})
		model.fbAccounts.belongsToMany(model.events,{through:"rsvps"})

		model.songs.belongsToMany(model.sfAccounts,{through:"usersXSongs"})
		model.sfAccounts.belongsToMany(model.songs,{through:"usersXSongs"})

		return model;
	}
