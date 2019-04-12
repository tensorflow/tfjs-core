This directory contains the following Google Cloud Functions.

## `trigger_nightly`
Programatically triggers a Cloud Build on master. This function is called by the Cloud Scheduler at 3am every day.

Command to re-deploy:
```sh
gcloud functions deploy nightly --runtime nodejs8 --trigger-topic nightly
```

If a build was triggered by nightly, there is a substitution variable `_NIGHTLY=true`.
You can forward the substitution as the `NIGHTLY` environment variable so the scripts can use it, by specifying `env: ['NIGHTLY=$_NIGHTLY']` in `cloudbuild.yml`.

## `send_email`
Sends an email with the nightly build status. Every build sends a message to the `cloud-builds` topic with its build information. The `send_email` function is subscribed to that topic and ignores all builds (e.g. builds triggered by pull requests) **except** for the nightly build and sends an email to an internal mailing list with its build status around 3:10am.

Command to re-deploy:
  ```sh
  gcloud functions deploy send_email --runtime nodejs8 --stage-bucket learnjs-174218_cloudbuild --trigger-topic cloud-builds --set-env-vars MAILGUN_API_KEY="[API_KEY_HERE]",HANGOUTS_URL="[URL_HERE]"
  ```


