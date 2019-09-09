const { PropertiesController, UsersController } = require('./controllers');
const handle = require('./controllers/handle');
const { Multiparty } = require('./utils/Multiparty.utils');
const { TokenUtils } = require('./utils/Token.utils');
const { Guard } = require('./utils/Guard.utils');

class Routes {
	constructor({ app, mongo, mailer }) {
    this.app = app;

    const properties = mongo.Properties;
    const users = mongo.Users;
    
    this.properties = new PropertiesController({ users, properties, mailer });
    this.users = new UsersController({ users, properties, mailer });
	}

	init() {
    const { app, properties, users, router } = this;
    const { validateToken } = TokenUtils;
    
    const BASE_URL = '/api/v1';

    const adminOnly = new Guard(['client', 'realtor']);
    const adminAndRealtorOnly = new Guard(['client']);

    // actions
    app.get(
      `${BASE_URL}/validate-user`,
      (req, res) => handle(req, res, users.validate)
    );
    
    app.post(
      `${BASE_URL}/invite-user`,
      validateToken,
      adminOnly.guard,
      (req, res) => handle(req, res, users.invite)
    );

    app.post(
      `${BASE_URL}/authenticate`,
      (req, res) => handle(req, res, users.authenticate)
    );
    app.post(
      `${BASE_URL}/authenticate-sm`,
      (req, res) => handle(req, res, users.authenticateSocialMedia)
    );

    app.put(
      `${BASE_URL}/users/:user_id/upload-image`,
      validateToken,
      Multiparty.parse,
      (req, res) => handle(req, res, users.uploadImage)
    );

    // RES
    app.get(
      `${BASE_URL}/users/email*`,
      (req, res) => handle(req, res, users.fetchByEmail)
    );
    app.get(
      `${BASE_URL}/users`,
      validateToken, adminOnly.guard,
      (req, res) => handle(req, res, users.list)
    );
    app.get(
      `${BASE_URL}/users/:user_id`,
      validateToken,
      (req, res) => handle(req, res, users.fetch)
    );
    app.get(
      `${BASE_URL}/properties`,
      validateToken,
      (req, res) => handle(req, res, properties.list)
    )
    app.get(
      `${BASE_URL}/properties/:property_id`,
      validateToken,
      (req, res) => handle(req, res, properties.fetch)
    )
    
    app.post(
      `${BASE_URL}/users`,
      (req, res) => handle(req, res, users.create)
    );
    app.post(
      `${BASE_URL}/users/:user_id/change-password`,
      (req, res) => handle(req, res, users.changePassword)
    );
    app.post(
      `${BASE_URL}/properties`,
      validateToken,
      adminAndRealtorOnly.guard,
      (req, res) => handle(req, res, properties.create)
    );

    app.put(
      `${BASE_URL}/users/:user_id`,
      validateToken,
      (req, res) => handle(req, res, users.update)
    );
    app.put(
      `${BASE_URL}/properties/:property_id`,
      validateToken,
      adminAndRealtorOnly.guard,
      (req, res) => handle(req, res, properties.update)
    )

    app.delete(
      `${BASE_URL}/users/:user_id`,
      validateToken,
      adminOnly.guard,
      (req, res) => handle(req, res, users.remove)
    );
    app.delete(
      `${BASE_URL}/properties/:property_id`,
      validateToken,
      (req, res) => handle(req, res, properties.remove)
    );
	}
}

module.exports = Routes;