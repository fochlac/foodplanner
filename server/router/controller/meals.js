const signupsDB   = require(process.env.FOOD_HOME + 'modules/db/signups')
  , paymentDB     = require(process.env.FOOD_HOME + 'modules/db/payment')
  , mealsDB       = require(process.env.FOOD_HOME + 'modules/db/meals')
  , caches        = require(process.env.FOOD_HOME + 'modules/cache')
  , error         = require(process.env.FOOD_HOME + 'modules/error')
  , log           = require(process.env.FOOD_HOME + 'modules/log')
  , mailer        = require(process.env.FOOD_HOME + 'modules/mailer')
  , notification  = require(process.env.FOOD_HOME + 'modules/notification')
  , scheduler     = require(process.env.FOOD_HOME + 'modules/scheduler')
  , fs            = require('fs');

const signupCache   = caches.getCache('signups'),
  mealCache         = caches.getCache('meals'),
  updateCache       = caches.getCache('update'),
  userCache         = caches.getCache('users'),
  userListCache     = caches.getCache('userList');

const validateMealOptions = (options) => {
  return options.some(option => {
    if (!/^[^"%;]{1,150}$/.test(option.name)) {
      return true;
    } else if (
      option.type !== 'toggle'
      && (
        !option.values
        || !option.values.length
        || !option.values.every(value => /^[^"%;]{1,150}$/.test(value))
      )
    ) {
      return true;
    }

    return false;
  });
}

const validateUserCreator = (meal, user) => {
  return mealsDB.getMealById(meal)
    .then(meal => {
      if (meal.creatorId == user) {
        return Promise.resolve();
      } else {
        log(4, `User ${user} tried to change meal ${meal} without being the creator.`);
        return Promise.reject({ status: 403, type: 'FORBIDDEN' });
      }
    });
}

module.exports = {
  createMeal: (req, res) => {
    let mealData = Object.assign({}, req.body, { options: JSON.parse(req.body.options) });

    if (validateMealOptions(mealData.options)) {
      log(4, 'Options not valid.');
      return res.status(400).send({ msg: 'Options not valid.', type: 'Invalid_Request', data: ['options'] });
    }

    if (req.file) {
      let splitfile = req.file.filename.split('.');

      mealData.image = ['meal_', splitfile[splitfile.length - 1]];
    } else {
      delete mealData.image;
    }

    mealsDB.createMeal(mealData)
      .then(id => mealsDB.getMealById(id))
      .then(meal => {
        mealCache.delete('allMeals');
        updateCache.deleteAll();

        // async calls, not gonna wait for them
        mailer.sendCreationNotice(meal);
        scheduler.scheduleMeal(meal);
        notification.sendCreationNotice(meal);

        if (req.file) {
          let imageName = meal.image.split('/');
          fs.rename(req.file.path, req.file.destination + imageName[imageName.length - 1], (err) => {
            error.checkError(3, 'failed renaming ' + req.file.path)(err);
            res.status(200).send(meal);
          });
        } else {
          res.status(200).send(meal);
        }
      })
      .catch(error.router.internalError(res));
  },

  editMeal: (req, res) => {
    let mealData = Object.assign({}, req.body, { options: JSON.parse(req.body.options) });

    if (validateMealOptions(mealData.options)) {
      log(4, 'Options not valid.');
      return res.status(400).send({ msg: 'Options not valid.', type: 'Invalid_Request', data: ['options'] });
    }

    if (req.file) {
      let splitfile = req.file.filename.split('.');

      mealData.image = ['meal_', req.params.id, '.' + splitfile[splitfile.length - 1]].join('');
    } else {
      delete mealData.image;
    }

    mealCache.delete(req.params.id);
    mealCache.delete('allMeals');
    updateCache.deleteAll();

    validateUserCreator(req.params.id, req.user.id)
      .then(() => mealsDB.setMealById(req.params.id, mealData))
      .then(id => mealsDB.getMealById(id))
      .then((meal) => {
        scheduler.rescheduleMeal(meal);
        if (req.file) {
          fs.readdir(process.env.FOOD_CLIENT + '/images/meals/', function (err, files) {
            if (err) {
              log(5, 'Cant find image for product ' + req.params.id, err);
            }
            let path = process.env.FOOD_CLIENT + '/images/meals/' + files.find((file) => (-1 !== file.indexOf('meal_' + req.params.id)));
            fs.unlink(path, (err) => {
              if (err) {
                log(2, 'Cant find image for product ' + req.params.id, err);
              }
              fs.rename(req.file.path, req.file.destination + mealData.image, (err) => {
                error.checkError(3, 'failed renaming ' + req.file.path)(err);
                res.status(200).send(meal);
              });
            });
          });
        } else {
          res.status(200).send(meal);
        }
      })
      .catch(error.router.internalError(res));
  },

  deleteMeal: (req, res) => {

    mealCache.delete(req.params.id);
    mealCache.delete('allMeals');
    signupCache.deleteAll();
    updateCache.deleteAll();

    validateUserCreator(req.params.id, req.user.id)
      .then(() => mealsDB.deleteMealById(req.params.id))
      .then(() => signupsDB.deleteSignupsByMeal(req.params.id))
      .then((data) => {
        scheduler.cancelMeal(req.params.id);

        fs.readdir(process.env.FOOD_CLIENT + '/images/meals/', function (err, files) {
          if (err) {
            log(2, 'Cant find image for product ' + req.params.id, err);
            return res.status(200).send({});
          }
          let path = process.env.FOOD_CLIENT + '/images/meals/' + files.find((file) => (-1 !== file.indexOf('meal_' + req.params.id)));
          fs.unlink(path,
            (err) => {
              if (err) {
                log(2, 'Cant find image for product ' + req.params.id, err);
              }
              res.status(200).send({});
            });
        });
      })
      .catch(error.router.internalError(res));
  },

  listAllMeals: (req, res) => {
    let meal = mealCache.get('allMeals');

    if (meal) {
      res.status(200).send(meal);
    } else {
      mealsDB.getAllMeals().then((meals) => {
        mealCache.put('allMeals', meals);
        res.status(200).send(meals);
      })
      .catch(error.router.internalError(res));
    }
  },
}

