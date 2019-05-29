/**
 * capitalise first letter of word
 * @param word The word whose first letter is to be capittalised.
 */
function capitaliseWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * capitalise first letter of each word in a phrase
 * @param phrase The phrase to be capitalised
 */
function capitalisePhrase(phrase) {
  return phrase
    .split('_')
    .map(x => capitaliseWord(x))
    .join(' ');
}

/**
 * capitalise all first letters of phrases in an array
 * @param arr The array of strings to be capitalised
 */
function capitaliseArray(arr) {
  return arr.map(x => capitalisePhrase(x)).join(', ');
}

/**
 * Extract the chosen values from the HTML inputs
 */
function getChosenValues() {
  var chosen = [];
  $('input[name=choice]:checked').each(function() {
    chosen.push($(this).val());
  });
  return chosen;
}

/**
 * Generate the HTML input elements based on the available options api/queries has returned
 * @param json The query results returned from api/queries
 * @param currentChoice The current category
 */
function addQueryOptionsHtml(json, currentChoice) {
  // Meals, breads and meats are using radio buttons, while the others uses checkboxes
  var inputType = ['meals', 'breads', 'meats'].indexOf(currentChoice) >= 0 ? 'radio' : 'checkbox';
  var displayedChoice = inputType === 'radio' ? currentChoice.slice(0, -1) : currentChoice;

  // Question title
  $('#title').text('Please select your ' + displayedChoice + '.');

  // For each option, generate HTML element
  json.result.forEach(function(option, i) {
    var new_option;
    if (i == 0 && inputType == 'radio') {
      new_option = '<input type="' + inputType + '" name="choice" value="' + option + '" checked> ' + capitalisePhrase(option) + '<br>';
    } else {
      new_option = '<input type="' + inputType + '" name="choice" value="' + option + '"> ' + capitalisePhrase(option) + '<br>';
    }
    $('#options').append($(new_option));
  });

  // Append a submit button at the end
  $('#options').append($('<input type="submit" value="Submit">'));
}

/**
 * Generate the order confirmation HTML elements
 * @param json The query results returned from api/queries
 */
function addConfirmDisplayHtml(json) {
  $('#title').text('Please confirm your order.');
  $('#orderConfirm').append('You ordered:<br><br>');

  for (var key in json.result) {
    $('#orderConfirm').append('<b>' + capitaliseWord(key) + '</b>:<br>' + capitaliseArray(json.result[key]) + '<br>');
  }

  json.result.forEach(function(order, i) {
    var order_html = capitaliseWord(order) + '<br>';
    $('#orderConfirm').append(order_html);
  });

  $('#orderConfirm').append('<br>Thank you.');
}

// when submit button is clicked, send data to /api/choose, 
// and get return from /api/queries and display as options
$('#options').submit(function(e) {
  chosen = getChosenValues();

  // post chosen options to /api/choose
  $.ajax({
    // create an AJAX call...
    data: JSON.stringify({ value: chosen }),
    type: 'POST',
    contentType: 'application/json',
    datatype: 'jsonp',
    url: '/api/choose',
  });

  // get response containing result from ask query
  var request = $.ajax({
    type: 'GET',
    url: '/api/queries',
  });

  // display options
  request.done(function(json) {
    $('#options').text('');
    currentChoice = json.category;
    if (currentChoice == 'end') {
      addConfirmDisplayHtml(json);
      return;
    }

    addQueryOptionsHtml(json, currentChoice);
    return false;
  });

  return false; // cancel original event to prevent form submitting
});
