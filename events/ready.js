const { ActivityType } = require('discord.js');
const client = require('..');
const chalk = require('chalk');
const mongoose = require('mongoose')
const srv = process.env.MONGO_SRV

client.on("ready", () => {
	if(!srv) return;
	mongoose.set('strictQuery', true);
	mongoose.connect(srv || '', {
		keepAlive: true,
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	if(mongoose.connect){
		console.log(chalk.green('MongoDB started'))
	}


	const activity =  `with ${client.users.cache.size} Users`
	client.user.setActivity(activity)

	
	console.log(chalk.red(`Logged in as ${client.user.tag}!`))
});