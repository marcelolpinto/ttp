const mongoose = require('mongoose');
const { properties } = require('./schemas/properties.schema');
const { users } = require('./schemas/users.schema');
const { MONGO_URL } = require('../global');

class MongoDB {
	init() {
    mongoose.connect(MONGO_URL, { useNewUrlParser: true }, err => {
      if(err) console.log(err);
      else console.log(`Connected to mongo.`);
    });
		mongoose.set('debug', true);
    
    const { Schema } = mongoose;
    this.Properties = mongoose.model('properties', properties(Schema))
    this.Users = mongoose.model('users', users(Schema))
	}
}

module.exports = MongoDB;