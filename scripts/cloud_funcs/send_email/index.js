const Mailgun = require('mailgun-js');
const humanizeDuration = require('humanize-duration');
const config = require('./config.json');

module.exports.mailgun = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: config.MAILGUN_DOMAIN,
});

const TRIGGER_ID = '7423c985-2fd2-40f3-abe7-94d4c353eed0';

// subscribe is the main function called by Cloud Functions.
module.exports.subscribe = async event => {
  // Parse the build information.
  const build = JSON.parse(new Buffer(event.data, 'base64').toString());
  // Skip if the current status is not in the status list.
  const status =
      ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT', 'CANCELLED'];
  // Email only when the build has finished.
  if (status.indexOf(build.status) === -1) {
    return;
  }
  // Email only on nightly builds.
  if (build.buildTriggerId !== TRIGGER_ID) {
    return;
  }
  // Send email.
  const message = module.exports.createEmail(build);
  await module.exports.mailgun.messages().send(message);
};

// createEmail create an email message from a build object.
module.exports.createEmail =
    build => {
      let duration = humanizeDuration(
          new Date(build.finishTime) - new Date(build.startTime));
      let content = `<p>Build ${build.id} finished with status ${
                        build.status}, in ${duration}.</p>` +
          `<p><a href="${build.logUrl}">Build logs</a></p>`;
      if (build.images) {
        let images = build.images.join(',');
        content += `<p>Images: ${images}</p>`;
      }
      let message = {
        from: config.MAILGUN_FROM,
        to: config.MAILGUN_TO,
        subject: `Nightly ${build.substitutions.REPO_NAME}: ${build.status}`,
        text: content,
        html: content
      };
      return message
    }

// const request = require('request')

// request.post(
//     url, {json: {text: 'Testing webhook from cloudbuild'}},
//     (error, res, body) => {
//       if (error) {
//         console.error(error)
//         return;
//       }
//       console.log(`statusCode: ${res.statusCode}`)
//       console.log(body);
//     });
