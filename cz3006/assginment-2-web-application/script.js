// Get necessary dom element for later process
var fruitInputs = document.getElementsByClassName('fruitInput');
var totalCostInput = document.getElementById('totalCost');
var nameInput = document.getElementById('customerName');
var radiosInput = document.getElementsByClassName('form-check-input');
var radiosLabel = document.getElementsByClassName('form-check-label');

// Configuration for fruit cost
var costSettings = {
  apple: 69,
  orange: 59,
  banana: 39
};

// For every fruit input element, add keyup listener to it
// Onkeyup, the number should be validated, the total cost should be calculated
// and the form should be validated
for(var i = 0; i < fruitInputs.length; i++) {
  var input = fruitInputs[i];
  input.addEventListener('keyup', function(event) {
    validateNumber(event.target);
    calculateTotal();
    validateForm();
  });
}

// When name input is on keyup event, the form is to be validated
nameInput.addEventListener('keyup', function(event) {
  validateForm();
});

// For all the radio buttons, when they are clicked, the form is to be validated
for(var j = 0; j < radiosInput.length; j++) {
  radiosInput[j].addEventListener('click', function(event) {
    validateForm();
  });
}

// For all the labels of the radio buttons, when they are clicked, the form is to be validated
for(var k = 0; k < radiosInput.length; k++) {
  radiosLabel[k].addEventListener('click', function(event) {
    validateForm();
  });
}

/**
 * Validate the input to be the valid number
 * @param element The value of HTML element to be validated 
 */
function validateNumber(element) {
  var quantity = element.value;

  if(Number(quantity).toString() !== quantity) {
    alert('Invalid number. Please enter again.');
    element.value = '';
    return false;
  }

  return true;
}

/**
 * Calculate the total cost based on the inputs on the form
 */
function calculateTotal() {
  var quantities = {
    apple: document.getElementById('apple').value,
    orange: document.getElementById('orange').value,
    banana: document.getElementById('banana').value
  }

  var fruits = ['apple', 'orange', 'banana'];
  var totalCost = fruits.reduce(function (accumulatedCost, fruit) {
    return accumulatedCost + quantities[fruit] * costSettings[fruit];
  }, 0);

  document.getElementById('totalCost').value = totalCost;

  if(totalCost.toString() == 'NaN') {
    document.getElementById('submitBtn').setAttribute('disabled', 'disabled');
  } else {
    document.getElementById('submitBtn').removeAttribute('disabled');
  }
}

/**
 * Validate the form the check if the user inputs are valid
 */
function validateForm() {
  var resultText = true;
  var inputs = document.getElementsByTagName('input');

  for(var i = 0; i < inputs.length; i++) {
    if(inputs[i].type === 'text' && !inputs[i].value) {
      resultText = false;
    }
  }

  var radios = document.getElementsByName('paymentMethod');

  var resultRadio = false;
  for(var j = 0; j < radios.length; j++) {
    resultRadio = resultRadio || radios[j].checked;
  }

  var result = resultText && resultRadio;

  if(!result) {
    document.getElementById('submitBtn').setAttribute('disabled', 'disabled');
  } else {
    document.getElementById('submitBtn').removeAttribute('disabled');
  }
}