const {google} = require('googleapis');

module.exports.nightly = async data => {
  const cloudbuild = google.cloudbuild('v1');
  const auth = await google.auth.getClient(
      {scopes: ['https://www.googleapis.com/auth/cloud-platform']});
  google.options({auth});
  const resp = await cloudbuild.projects.triggers.run({
    'projectId': 'learnjs-174218',
    'triggerId': '7423c985-2fd2-40f3-abe7-94d4c353eed0',
    'resource': {'branchName': 'master'}
  });
  console.log(resp);
};
