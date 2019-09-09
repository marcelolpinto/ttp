const mongoose = require('mongoose');
const { Properties } = require('./schemas/Properties.schema');
const { Users } = require('./schemas/Users.schema');
const { MONGO_URL } = require('../global');

class MongoDB {
	init() {
    mongoose.connect(MONGO_URL, { useNewUrlParser: true }, err => {
      if(err) console.log(err);
      else console.log(`Connected to mongo.`);
    });
		mongoose.set('debug', true);
    
    const { Schema } = mongoose;
    this.Properties = Properties
    this.Users = Users;
	}
}

module.exports = MongoDB;