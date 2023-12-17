const express = require('express');
const router = express.Router();

const knex = require('../db/knex');

/* This router is mounted at /blog */
router.get('/', (req, res) => {
  knex('blog')
    .select()
    .then(blogs => {
      res.render('all', { blogs: blogs });
    });
});

router.get('/new', (req, res) => {
  res.render('new');
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  respondAndRenderblog(id, res, 'single');
});

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  respondAndRenderblog(id, res, 'edit');
});

router.post('/', (req, res) => {
  validateblogRenderError(req, res, (blog) => {
    blog.date = new Date();
    knex('blog')
      .insert(blog, 'id')
      .then(ids => {
        const id = ids[0];
        res.redirect(`/blog/${id}`);
      });
  });
});

router.put('/:id', (req, res) => {
  validateblogRenderError(req, res, (blog) => {
    const id = req.params.id;
    knex('blog')
      .where('id', id)
      .update(blog, 'id')
      .then(() => {
        res.redirect(`/blog/${id}`);
      });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if(validId(id)) {
    knex('blog')
      .where('id', id)
      .del()
      .then(() => {
        res.redirect('/blog');
      });
  } else {
    res.status( 500);
    res.render('error', {
      message:  'Invalid id'
    });
  }
});

function validateblogRenderError(req, res, callback) {
  if(validblog(req.body)) {
    const blog = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority
    };

    callback(blog);
  } else {
    res.status( 500);
    res.render('error', {
      message:  'Invalid blog'
    });
  }
}

function respondAndRenderblog(id, res, viewName) {
  if(validId(id)) {
    knex('blog')
      .select()
      .where('id', id)
      .first()
      .then(blog => {
        res.render(viewName, blog);
      });
  } else {
    res.status( 500);
    res.render('error', {
      message:  'Invalid id'
    });
  }
}

function validblog(blog) {
  return typeof blog.title == 'string' &&
          blog.title.trim() != '' &&
          typeof blog.priority != 'undefined' &&
          !isNaN(blog.priority);
}

function validId(id) {
  return !isNaN(id);
}

module.exports = router;
