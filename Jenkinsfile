#!/usr/bin/env groovy

// This one is just the id of jenkins credentials. You could do nothing with it.
String NODE="master"
String DEV_BRANCH="develop"
String VERSION_BRANCH="stable"

// Testing the dev branch.
if (env.BRANCH_NAME == DEV_BRANCH) {
  node(NODE) {
    print "checkout: dummy"
    print "build: dummy"
    print "testAll: dummy"
    print "merge: dev->stable"
  }
}

// Testing the version branch.
if (env.BRANCH_NAME == VERSION_BRANCH) {
  node(NODE) {
    print "checkout: dummy"
    print "testAll: dummy"
    print "publish: dummy"
  }
}

// Testing pull requests.
if (env.BRANCH_NAME ==~ /PR-.*/ ) {
  node(NODE) {
    print "checkout: dummy"
    print "buildChanged: dummy"
    print "testChanged: dummy"
  }
}
