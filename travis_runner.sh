#!/bin/bash -e
set -o pipefail

if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]  && [ "$TRAVIS_NODE_VERSION" = "5.7.1" ]
then
  deploy_firebase () {
    # Deploying to Firebase!
    echo Deploying to Firebase
    # Starting Build Process for Firebase Changes
    firebase-bolt db/rules.bolt
    gulp
    # Starting Deploy Process to Firebaseapp.com Server -- polymer-starter-kit.firebaseapp.com
    firebase deploy --token "$FIREBASE_TOKEN" -m "Auto Deployed by Travis CI - $TRAVIS_COMMIT"
  }

  deploy_firebase

elif [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]  && [ "$TRAVIS_NODE_VERSION" != "5.7.1" ]
then
  echo "Do Nothing, only deploy with Node 5.1"
else
  firebase-bolt db/rules.bolt
  xvfb-run npm test
fi
