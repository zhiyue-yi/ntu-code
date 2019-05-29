const express = require('express');
const router = express.Router();
const pl = require('tau-prolog');
const session = pl.create();

router.get('/queries', function(req, res, next) {
  try {
    session.consult('./../test.pl');
    console.log(session.query('father(a, X).'));
    res.json('respond with a resource');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
