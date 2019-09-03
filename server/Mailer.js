const nodemailer = require('nodemailer');
const { MAILER_SENDER, MAILER_PASS } = require('./global');

module.exports = class Mailer {
  constructor() {
    this.sendMail = this.sendMail.bind(this);
  }

  init() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: MAILER_SENDER,
        pass: MAILER_PASS
      }
    });
  }

  sendMail({ to, subject, html }) {
    const mailOptions = {
      from: MAILER_SENDER,
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