const express = require('express');
const router = express.Router();

const Course = require('../models/course');
const passport = require('passport');

function IsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.get('/', IsLoggedIn, (req, res, next) => {
  Course.find((err, courses) => {
    if (err) {
      console.log(err);
    } else {
      res.render('courses/index', {
        title: 'Task List',
        dataset: courses,
        user: req.user,
      });
    }
  });
});

router.get('/add', IsLoggedIn, (req, res, next) => {
  res.render('courses/add', { title: 'Add a new Task', user: req.user });
});

router.post('/add', IsLoggedIn, (req, res, next) => {
  Course.create(
    {
      name: req.body.name,
      Status: req.body.Status,
    },
    (err, newCourse) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/courses');
      }
    }
  );
});

// :_id is a placeholder for naming whatever is after the / in the path
router.get('/delete/:_id', IsLoggedIn, (req, res, next) => {
  // call remove method and pass id as a json object
  Course.remove({ _id: req.params._id }, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/courses');
    }
  });
});

// GET handler for Edit operations
router.get('/edit/:_id', IsLoggedIn, (req, res, next) => {
 
  Course.findById(req.params._id, (err, project) => {
    if (err) {
      console.log(err);
    } else {
      Course.find((err, courses) => {
        if (err) {
          console.log(err);
        } else {
          res.render('course/edit', {
            title: 'Edit a Task',
            project: project,
            courses: courses,
            user: req.user,
          });
        }
      });
    }
  });
});

// POST handler for Edit operations
router.post('/edit/:_id', IsLoggedIn, (req, res, next) => {
  
  Course.findOneAndUpdate(
    { _id: req.params._id },
    {
      name: req.body.name,
      course: req.body.course,
      status: req.body.status,
    },
    (err, updatedProject) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/courses');
      }
    }
  );
});

// Export this router module
module.exports = router;

module.exports = router;
