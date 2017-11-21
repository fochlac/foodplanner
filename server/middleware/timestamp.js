module.exports = (req, res, next) => {
    res.set('timestamp', Date.now());
    next();
}