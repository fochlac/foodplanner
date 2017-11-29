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

  stage("Build: ${branch}") {
    try {
      sh 'npm install'
      sh '''
        while read p; do
          export $p
        done < ./build_scripts/variables
      '''
    } finally {
      echo "Clean up workspace, Removing old packages"
      deleteDir()
    }
  }
}