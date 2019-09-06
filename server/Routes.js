const { PropertiesController, UsersController } = require('./controllers');
const { Multiparty } = require('./utils/Multiparty.utils');
const { TokenUtils } = require('./utils/Token.utils');

class Routes {
	constructor({ app, mongo, mailer }) {
    this.app = app;
    const properties = mongo.Properties;
    const users = mongo.Users;
    
    this.properties = new PropertiesController({ users, properties, mailer });
    this.users = new UsersController({ users, properties, mailer });
	}

	init() {
    const { app, properties, users } = this;
    const { validateToken } = TokenUtils;
    
    const BASE_URL = '/api/v1';

    // actions
    app.get(`${BASE_URL}/users/validate`, users.validate);
    
    app.post(`${BASE_URL}/users/invite`, validateToken, users.invite);
    app.post(`${BASE_URL}/users/authenticate`, users.authenticate);
    app.post(`${BASE_URL}/users/authenticate-sm`, users.authenticateSocialMedia);

    app.put(`${BASE_URL}/users/:user_id/upload-image`, Multiparty.parse, users.uploadImage);

    // rest
    app.get(`${BASE_URL}/users/email`, users.fetchByEmail);
    app.get(`${BASE_URL}/users`, users.list);
    app.get(`${BASE_URL}/users/:user_id`, users.fetch);
    app.get(`${BASE_URL}/users/:user_id/properties`, properties.list)
    app.get(`${BASE_URL}/users/:user_id/properties/:property_id`, properties.fetch)
    
    app.post(`${BASE_URL}/users`, users.create);
    app.post(`${BASE_URL}/users/:user_id/change-password`, users.changePassword);
    app.post(`${BASE_URL}/users/:user_id/properties`, properties.create);

    app.put(`${BASE_URL}/users/:user_id`, users.update);
    app.put(`${BASE_URL}/users/:user_id/properties/:property_id`, properties.update)

    app.delete(`${BASE_URL}/users/:user_id`, users.delete);
    app.delete(`${BASE_URL}/users/:user_id/properties/:property_id`, properties.delete)
	}
}

module.exports = Routes;