const nodemailer = require('nodemailer');

module.exports = class Mailer {
  constructor(config) {
    this.config = config;

    this.sendMail = this.sendMail.bind(this);
  }

  init() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mlpdummy@gmail.com',
        pass: '10%d10=1'
      }
    });
  }

  sendMail({ to, subject, html }) {
    const mailOptions = {
      from: 'mlpdummy@gmail.com',
      to,
      subject,
      html
    }

    this.transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err);
      else
        console.log(info);
    });
  }
}