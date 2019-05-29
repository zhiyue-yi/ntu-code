const express = require('express');
const router = express.Router();
const swipl = require('swipl');
const fs = require('fs');

let step = 0;
const skippedStep = [];
const categories = ['meals', 'breads', 'meats', 'veggies', 'sauces', 'topups', 'sides', 'end'];
swipl.call('consult("logic.pl")');

/**
 * Parse the returned object from prolog query to a list
 * @param ret The returned object from prolog query
 */
function getList(ret) {
  const data = [];
  if (ret.tail === '[]') {
    if (typeof ret.head === 'string' || ret.head instanceof String) {
      data.push(ret.head);
      return data.filter(d => d !== '');
    }
    return getList(ret.head);
  }
  while (ret.tail) {
    data.push(ret.head);
    ret = ret.tail;
  }
  return data.filter(d => d !== '');
}

/**
 * List all the options from all pre-defined categories
 */
router.get('/queries', function(req, res, next) {
  try {
    let result = {};

    // Call the first 7 categories each time the API is called
    while (step <= 6) {
      // ask_xxx(X) is queried to get the available options in a category.
      const query = `ask_${categories[step]}(X)`;
      const ret = swipl.call(query);

      // Format the returned object from prolog query result to an array.
      result = getList(ret.X);

      // If the list is not empty, skip the while loop
      if (result.length) {
        break;
      }

      // Else, store the skipped step and increase the counter
      skippedStep.push(step);
      step++;
    }

    // When the API is called at the 7th time, it reaches the end.
    // A summarised information will be returned as order confirmation
    if (step > 6) {
      // Use Array.reduce() to accumulate properties into an object.
      result = categories.reduce((acc, cur, index) => {
        // Skip the skipped step and the ending step (Summary step)
        if (skippedStep.indexOf(index) >= 0 || index === categories.length - 1) {
          return acc;
        }

        // Query show_xxx(X) to show the chosen items in all categories
        const ret = swipl.call(`show_${cur}(X)`).X;
        const choiceData = getList(ret);
        acc[categories[index]] = choiceData;
        return acc;
      }, {});
    }

    res.status(200).json({
      result,
      category: categories[step],
    });

    // If the end step is reached, shut down the application.
    if (step > 6) process.exit(0);

  } catch (e) {
    res.status(400).json({ error: e });
  }
});

// get user's chosen options and assert chosen
router.post('/choose', (req, res) => {
  try {
    // Assert selected options from UI to the prolog context
    if (step <= 6) {
      const data = req.body.value;
      if (!data.length) {
        skipped.add(progress);
      } else {
        // Initiate assertion
        data.forEach(x => swipl.call(`assert(chosen_${categories[step]}(${x}))`));
      }
    }

    // Increase the counter for next category
    if (step < 7) {
      step++;
    }

    // Call /api/queries to get all the options
    res.redirect('/api/queries');
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

module.exports = router;
