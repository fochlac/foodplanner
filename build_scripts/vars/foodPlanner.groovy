/**
 * Checkout the project from github.
 */
def checkout() {

  stage("Checkout: ${env.BRANCH_NAME}") {

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

  stage("Build: ${env.BRANCH_NAME}") {
    /*try {
      sh """
        npm run-script build-dev
        systemctl restart food-devd
      """
    } finally {
      echo "Clean up workspace, Removing old packages"
      deleteDir()
    }*/
    sh "${pwd()}"
  }
}