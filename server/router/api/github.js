const	github = require('express').Router()
	,   exec = require('child_process').execFile
    ,   hmac = require(process.env.FOOD_HOME + 'modules/auth/hmac')(process.env.GITHUB_SECRET_FOOD, 'X-Hub-Signature');

github.post('/', hmac, (req, res) => {
    if (process.env.DEVELOP === 'true' && req.body.ref === 'refs/heads/develop') {
        exec(process.env.FOOD_HOME + "../build_scripts/buildDev", (error, stdout, stderr) => {
            log(1, stdout + error + stderr);
        });
    } else if (process.env.DEVELOP !== 'true' && req.body.ref === 'refs/heads/stable') {
        exec(process.env.FOOD_HOME + "../build_scripts/build", (error, stdout, stderr) => {
            log(1, stdout + error + stderr);
        });
    }
    res.status(200).send();
});

module.exports = github;