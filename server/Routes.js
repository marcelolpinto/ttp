const { MealsController, UsersController } = require('./controllers');

class Routes {
	constructor({ app, mongo, mailer }) {
    this.app = app;
    const meals = mongo.Meals;
    const users = mongo.Users;
    
    this.meals = new MealsController({ users, meals, mailer });
    this.users = new UsersController({ users, meals, mailer });
	}

	init() {
    const { app, meals, users } = this;
    
    const BASE_URL = '/api/v1';

    app.get(`${BASE_URL}/users/validate`, users.validate);
    app.get(`${BASE_URL}/users/email`, users.fetchByEmail);
    app.get(`${BASE_URL}/users`, users.list);
    app.get(`${BASE_URL}/users/:user_id`, users.fetch);
    app.get(`${BASE_URL}/users/:user_id/meals`, meals.list)
    app.get(`${BASE_URL}/users/:user_id/meals/:meal_id`, meals.fetch)
    
    app.post(`${BASE_URL}/users/authenticate`, users.authenticate);
    app.post(`${BASE_URL}/users`, users.create);
    app.post(`${BASE_URL}/users/:user_id/change-password`, users.changePassword);
    app.post(`${BASE_URL}/users/:user_id/meals`, meals.create);

    app.put(`${BASE_URL}/users/:user_id`, users.update);
    app.put(`${BASE_URL}/users/:user_id/meals/:meal_id`, meals.update)

    app.delete(`${BASE_URL}/users/:user_id`, users.delete);
    app.delete(`${BASE_URL}/users/:user_id/meals/:meal_id`, meals.delete)
	}
}

module.exports = Routes;