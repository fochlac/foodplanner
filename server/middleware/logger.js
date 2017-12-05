const log = require(process.env.FOOD_HOME + 'modules/log')

module.exports = (req, res, next) => {
    log(6, 'request to url \'' + req.url + '\'.');
    next();
}