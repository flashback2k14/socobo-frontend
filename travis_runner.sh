#!/bin/bash -e
set -o pipefail

if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]  && [ "$TRAVIS_NODE_VERSION" = "5.1" ]
then
  git config --global user.email "samccone@gmail.com"
  git config --global user.name "auto deployer"

  deploy_firebase () {
    # Deploying to Firebase! (https://polymer-starter-kit.firebaseapp.com)
    echo Deploying to Firebase
    # Starting Build Process for Firebase Changes
    firebase-bolt db/rules.bolt
    gulp
    # Starting Deploy Process to Firebaseapp.com Server -- polymer-starter-kit.firebaseapp.com
    firebase deploy --token "$FIREBASE_TOKEN" -m "Auto Deployed by Travis CI"
  }

  deploy_firebase

  # Revert to orginal index.html and delete temp file
  cp app/index.html.tmp1 app/index.html
  rm app/index.html.tmp1
elif [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]  && [ "$TRAVIS_NODE_VERSION" != "5.1" ]
then
  echo "Do Nothing, only deploy with Node 5.1"
else
  firebase-bolt db/rules.bolt
  xvfb-run npm test
fi
