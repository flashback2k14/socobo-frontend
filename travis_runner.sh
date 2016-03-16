#!/bin/bash -e
set -o pipefail

if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
  deploy_firebase () {
    # Deploying to Firebase!
    echo Deploying to Firebase
    # Starting Build Process for Firebase Changes
    firebase-bolt db/rules.bolt
    gulp
    # Starting Deploy Process to Firebaseapp.com Server
    firebase deploy --token "$FIREBASE_TOKEN" -m "Auto Deployed by Travis CI - $TRAVIS_COMMIT" --non-interactive
  }

  deploy_firebase
else
  firebase-bolt db/rules.bolt
  xvfb-run npm test
fi
