const signupsDB = require(process.env.FOOD_HOME + 'modules/db/signups')
  , mealsDB = require(process.env.FOOD_HOME + 'modules/db/meals')
  , error = require(process.env.FOOD_HOME + 'modules/error')
  , caches = require(process.env.FOOD_HOME + 'modules/cache')
  , log = require(process.env.FOOD_HOME + 'modules/log');

let signupCache = caches.getCache('signups'),
  updateCache = caches.getCache('update');

const validateSignupOptions = (meal, options) => {
  return meal.options.every(option => {
    // get correct option from meal
    const mealOption = options.find(mealOpt => mealOpt.id === option.id);

    // cant find equivalent option on meal --> invalid
    if (!mealOption) {
      return false;
    }
    switch (option.type) {
      // check for both count and value
      case 'count':
        if (mealOption.count === undefined || !error.validation.isNumber(mealOption.count)) {
          return false;
        }
      // check for value
      case 'select':
        if (mealOption.value === undefined || !error.validation.isText(mealOption.value)) {
          return false;
        }
        break;
      // check for show option
      case 'toggle':
        if (mealOption.show === undefined || !error.validation.isBool(mealOption.show)) {
          return false;
        }
        break;
    }
    return true;
  });
}

module.exports = {
  createSignup: (req, res) => {
    Promise.all([
      mealsDB.getMealById(req.body.meal),
      signupsDB.getSignupsByProperty('meal', req.body.meal)
    ])
      .then(([meal, signups]) => {
        if (result[0].signupLimit && result[0].signupLimit <= result[1].length) {
          log(5, 'post - /signups/', 'tried to sign up for full offer');
          return Promise.reject({ status: 409, type: 'Bad_Request', reason: 'offer_full' });
        }

        if (!validateSignupOptions(meal, req.body.options)) {
          log(5, 'post - /signups/', 'invalid options');
          return Promise.reject({ status: 422, type: 'Invalid_Request', data: ['options'] });
        }

        signupCache.delete('allSignups');
        updateCache.deleteAll();

        return signupsDB.createSignUp(req.body);
      })
      .then((signup) => signupsDB.getSignupByProperty('id', signup.id))
      .then((signup) => {
        res.status(200).send(signup);
      })
      .catch(error.router.internalError(res));
  },

  editSignup: (req, res) => {
    mealsDB.getMealById(req.body.meal)
      .then(meal => {
        if (!validateSignupOptions(meal, req.body.options)) {
          log(5, 'put - /signups/:id', 'invalid Options');
          return Promise.reject({ status: 422, type: 'Invalid_Request', data: ['options'] });
        }

        signupCache.delete(req.params.id);
        signupCache.delete('allSignups');
        updateCache.deleteAll();

        return Promise.all([signupsDB.getSignupByProperty('id', req.params.id), mealsDB.getMealCreatorBySignupId(req.params.id)]);
      })
      .then((data) => {
        if (data[0].userId == req.user.id || data[1] == req.user.id) {
          return signupsDB.setSignupById(req.params.id, req.body);
        } else {
          log(4, `User ${req.user.id} tried to update signup ${req.params.id} without being the creator.`);
          return Promise.reject({ status: 403, type: 'FORBIDDEN' });
        }
      })
      .then((signup) => {
        res.status(200).send(signup);
      })
      .catch(error.router.internalError(res));
  },

  deleteSignup: (req, res) => {
    signupCache.delete(req.params.id);
    signupCache.delete('allSignups');
    updateCache.deleteAll();

    Promise.all([signupsDB.getSignupByProperty('id', req.params.id), mealsDB.getMealCreatorBySignupId(req.params.id)])
      .then(([signup, mealCreatorId]) => {
        if (signup.userId == req.user.id || mealCreatorId == req.user.id) {
          return signupsDB.deleteSignupById(req.params.id);
        } else {
          log(4, `User ${req.user.id} tried to delete signup ${req.params.id} without being the creator.`);
          return Promise.reject({ status: 403, type: 'FORBIDDEN' });
        }
      })
      .then(() => {
        res.status(200).send({ success: true });
      })
      .catch(error.router.internalError(res));
  },

  listAllSignups: (req, res) => {
    let signup = signupCache.get('allSignups');

    if (signup) {
      res.status(200).send(signup);
    } else {
      signupsDB.getAllSignups().then((signups) => {
        signupCache.put('allSignups', signups);
        res.status(200).send(signups);
      })
      .catch(error.router.internalError(res));
    }
  }
}

