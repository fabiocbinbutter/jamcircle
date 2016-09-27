module.exports=function(config){
		const Sequelize = require('sequelize')
		const sequelize = Sequelize(config.connectionString)

		const model = {
				users:sequelize.deifne("users",{
						name: Sequelize.STRING
					}),
				fbUsers:sequelize.define("fbAccounts",{
						id: Sequelize.STRING,
						name: Sequelize.STRING,
						pictureUrl: Sequelize.STRING
					}),
				sfUsers:sequelize.define("sfAccounts",{
						id: Sequelize.STRING,
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
							rating: Sequlize.FLOAT
						})
			};
		model.users.hasOne("fbAccounts")
		model.users.hasOne("sfAccounts")

		model.events.belongsToMany("fbAccounts",{through:"rsvps"})
		model.fbAccounts.belongsToMany("events",{through:"rsvps"})

		model.songs.belongsToMany("sfAccounts",{through:"usersXSongs"})
		model.sfAccounts.belongsToMany("songs",{through:"usersXSongs"})

		
	}
