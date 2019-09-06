const multiparty = require('multiparty');

const codes = require('../codes');

class Multiparty {

  static async parse(req, res, next) {

    const parts = await new Promise((resolve, reject) => {
			const form = new multiparty.Form();
			form.parse(req, (err, fields, files) => {
				if(err) {
          res.status(400).send(codes.INVALID_FORM_DATA);
          reject(err);
          return;
				} else {
					resolve(files);
				}
			});
    });
    
		req.body = parts;
		next();
	}
}

module.exports = { Multiparty };