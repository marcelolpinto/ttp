const mongoose = require('mongoose');
const { meals } = require('./schemas/meals.schema');
const { users } = require('./schemas/users.schema');
const { MONGO_URL } = require('../global');

class MongoDB {
	init() {
    mongoose.connect(MONGO_URL, { useNewUrlParser: true }, err => {
      if(err) console.log(err);
      else console.log(`Connected to mongo.`);
    });
		// mongoose.set('debug', true);
    
    const { Schema } = mongoose;
    this.Meals = mongoose.model('meals', meals(Schema))
    this.Users = mongoose.model('users', users(Schema))
	}
}

module.exports = MongoDB;