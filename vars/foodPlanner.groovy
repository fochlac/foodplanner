/**
 * Checkout the project from github.
 */
def checkout() {

  stage("Checkout: ${env.BRANCH_NAME}") {

    // try to reset if already a repo
    try {
      sh 'git reset --hard'
    }
    catch(e) { }

    // checkout current branch
    checkout scm

    // repair rebases
    sh "rm -rf ${pwd()}/.git/rebase-apply"

    // rebase to origin(ep-friedel)
    sh 'git fetch origin'
    sh 'git rebase origin/develop'

  }
}

/**
 * Build the project with gradle in an docker container.
 *
 * @param branch we want to build the esf for.
 */
def build(String branch) {

  stage("Build: ${branch}") {
    try {
      sh 'npm install'
      sh '''
        while read p; do
          export $p
        done < /root/variables
        export FOOD_HOME=$(pwd)/server/
        export FOOD_CLIENT=$(pwd)/dist/
        export FOOD_TESTS=$(pwd)/test/
        export FOOD_ROOT=$(pwd)/
        openssl req -x509 -newkey rsa:4096 -keyout $SSLKEY -out $SSLCERT -days 365 -nodes -subj "/CN=$FOOD_EXTERNAL"
        node ./server/setup.js -y
        npm run-script build
      '''
    } finally {
      echo "Clean up workspace, Removing old packages"
    }
  }
}

/**
 * Runs unit tests and ui tests.
 *
 * @param branch we want to build the esf for.
 */
def tests(String branch) {

  stage("Unit Tests: ${branch}") {

    sh 'npm test'
  }

  stage("UI Tests: ${branch}") {
    try {
        sh '''
            while read p; do
              export $p
            done < /root/variables
            export FOOD_UUID=asdajsdlajiwdj1ij023j21oh9d8a98chao9fh8fjsd3b2fkjnöcou09djdibadj23hbsiu8szfhu2n23ud9s8fjs3rnun
            export FOOD_HOME=$(pwd)/server/
            export FOOD_CLIENT=$(pwd)/dist/
            export FOOD_TESTS=$(pwd)/test/
            export FOOD_ROOT=$(pwd)/
            export DEVELOP=true
            node ./server/index.js &
            touch test-log
            npm run-script test-ui > test-log
            cat test-log
            pkill -f "node.*server/index.js"
        '''
    } catch(err) {
        sh '''
            cat test-log
            pkill -f "node.*server/index.js"
        '''
        throw(err)
    }
  }

  stage("Code Coverage: ${branch}") {

    sh 'npm run coverage'
  }
}
