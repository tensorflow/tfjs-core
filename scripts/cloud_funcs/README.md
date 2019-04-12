This directory contains the following Google Cloud Functions:
- `trigger_nightly` which programatically triggers a Cloud Build on master.
  This function is called by the Cloud Scheduler at 3am every day.
- `send_email` for sending an email with the nightly build status. Every build sends a message to the `cloud-builds` topic with its build information. The `send_email` function is subscribed to that topic and ignores all builds (e.g. builds triggered by pull requests) **except** for the nightly build and sends an email to an internal mailing list with its build status around 3:10am.

