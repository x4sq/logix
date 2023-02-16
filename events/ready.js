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


	const activities = [
		{ name: `${client.users.cache.size} Users`, type: ActivityType.Watching }
	];
	const status = [
		'idle'
	];
	let i = 0;
	setInterval(() => {
		if(i >= activities.length) i = 0
		client.user.setActivity(activities[i])
		i++;
	}, 5000);

	let s = 0;
	setInterval(() => {
		if(s >= activities.length) s = 0
		client.user.setStatus(status[s])
		s++;
	}, 30000);
	console.log(chalk.red(`Logged in as ${client.user.tag}!`))
});