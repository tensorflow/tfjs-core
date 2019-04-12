const Mailgun = require('mailgun-js');
const humanizeDuration = require('humanize-duration');
const request = require('request');
const config = require('./config.json');

const mailgun = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: config.MAILGUN_DOMAIN,
});

const TRIGGER_ID = '7423c985-2fd2-40f3-abe7-94d4c353eed0';

// The main function called by Cloud Functions.
module.exports.send_email = async event => {
  // Parse the build information.
  const build = JSON.parse(new Buffer(event.data, 'base64').toString());
  // Add 'SUCCESS' to monitor successful builds also.
  const status =
      ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT', 'CANCELLED'];
  // Email only when the build has failed.
  if (status.indexOf(build.status) === -1) {
    return;
  }
  // Email only on nightly builds.
  if (build.buildTriggerId !== TRIGGER_ID) {
    return;
  }

  let duration =
      humanizeDuration(new Date(build.finishTime) - new Date(build.startTime));
  const msg = `${build.substitutions.REPO_NAME} nightly finished with status ` +
      `${build.status}, in ${duration}.`;

  // Send email.
  const email = createEmail(build, msg);
  await mailgun.messages().send(email);

  // Send a chat message.
  const chatMsg = `${msg} <${build.logUrl}|See logs>`;
  request.post(
      process.env.HANGOUTS_URL, {json: {text: chatMsg}}, (error, res, body) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(`statusCode: ${res.statusCode}`);
        console.log(body);
      });
};

// createEmail create an email message from a build object.
function createEmail(build, msg) {
  // Send an email.
  let emailMsg = `<p>${msg}</p><p><a href="${build.logUrl}">Build logs</a></p>`;
  return {
    from: config.MAILGUN_FROM,
    to: config.MAILGUN_TO,
    subject: `Nightly ${build.substitutions.REPO_NAME}: ${build.status}`,
    text: emailMsg,
    html: emailMsg
  };
}
