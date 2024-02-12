let buttons = document.querySelectorAll(".grey-button"),
    display = document.querySelector(".display"),
    displayResult = document.querySelector(".display_result"),
    displayOperation = document.querySelector(".display_operation"),
    operators = ["%", "/", "+", "-", "*"],
    numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    actualState = {
      operationString : "",
      actualOperator : "none",
      firstNumber : [],
      secondNumber : [],
      finalResult: "noResult",
    };

function allButtonsFunctions() {
  buttons.forEach(button => button.addEventListener("click", () =>{
    let buttonValue = button.value;
    handleButtonEvents(buttonValue)
  }))
}

function handleButtonEvents(buttonValue) {
  if (operators.includes(buttonValue)) return handleOperatorButtons(buttonValue)

  switch (buttonValue) {
    case ".":
      handlePointButton(buttonValue);
      break;
    case "ac":
      handleClearAllButton();
      break;
    case "c":
      handleClearLastCharacter()
      break;
    case "=":
      calculate()
      break;
    default:
      handleNumberButtons(buttonValue);
      break;
  }
}

// master functions

function handleNumberButtons(el) {
  let totalOperation = actualState.operationString;
  if (displayOnlyHasZero(displayOperation)) {
    setNewTotalOperation(el)
    clearDisplayAndSetValue(displayOperation, el)
    return actualState.firstNumber.push(el)
  }
  else if (displayOperation.innerHTML.includes("Ans")) {
    pushNewElementToDisplay(displayOperation, totalOperation, el)
    setNewTotalOperation(el)
    return actualState.secondNumber.push(el)
  }
  else if (thereIsAnOperator(totalOperation)){
    setNewTotalOperation(el)
    pushNewElementToDisplay(displayOperation, totalOperation, el)
    return actualState.secondNumber.push(el);
  }
  else{
    setNewTotalOperation(el)
    pushNewElementToDisplay(displayOperation, totalOperation, el)
    return actualState.firstNumber.push(el)
  }
}

function handleOperatorButtons(el) {
  let totalOperation = actualState.operationString;
  if (thereIsAnOperator(totalOperation) && operatorIsLastCharacter(totalOperation)){
    actualState.operationString = clearLastElement(totalOperation);
    pushNewElementToDisplay(displayOperation, actualState.operationString, el)
    setNewTotalOperation(el);
    return actualState.actualOperator = `${el}`;
  }
  else if (thereIsAnOperator(totalOperation) || finalResultIsCalculated()) {
    calculate();
    [actualState.firstNumber, actualState.secondNumber] = [actualState.finalResult, []];
    displayOperation.innerHTML = `Ans${el}`;
    actualState.operationString = displayOperation.innerHTML
    return actualState.actualOperator = `${el}`;
  }
  else if (aPointIsLastCharacter(totalOperation)) {
    setNewTotalOperation(`0${el}`);
    actualState.firstNumber.push("0")
    pushNewElementToDisplay(displayOperation, `${totalOperation}0`, el)
    return actualState.actualOperator = `${el}`
  }
  else{
    setNewTotalOperation(el);
    actualState.actualOperator = `${el}`;
    displayResult.innerHTML = `${actualState.firstNumber.join("")}${el}`
    return pushNewElementToDisplay(displayOperation, totalOperation, el)
  }
}

function handlePointButton(el) {
  let totalOperation = actualState.operationString;
  if (thereIsAnOperator(totalOperation) && operatorIsLastCharacter(totalOperation)) {
    setNewTotalOperation(`0${el}`)
    pushNewElementToDisplay(displayOperation, totalOperation, `0${el}`)
    actualState.secondNumber.push("0")
    return actualState.secondNumber.push(el)
  }
  else if (thereIsAnOperator(totalOperation)) {
    setNewTotalOperation(`${el}`)
    pushNewElementToDisplay(displayOperation, totalOperation, el)
    return actualState.secondNumber.push(el)
  }
  else{
    setNewTotalOperation(el)
    pushNewElementToDisplay(displayOperation, totalOperation, el)
    return actualState.firstNumber.push(el)
  }
}

function handleClearAllButton() {
  actualState.operationString = "";
  actualState.finalResult = "noResult"
  actualState.firstNumber = [];
  actualState.secondNumber = [];
  actualState.actualOperator = "";
  displayOperation.innerHTML = "";
  displayResult.innerHTML = "";
  return noNumberLeft()
}

function handleClearLastCharacter() {
  let totalOperation = actualState.operationString;
  if (thereIsAnOperator(totalOperation) && operatorIsLastCharacter(totalOperation)) {  
    actualState.operationString = `${clearLastElement(totalOperation)}`;
    displayOperation.innerHTML = actualState.operationString;
    return actualState.actualOperator = "";
  }
  else if (thereIsAnOperator(totalOperation)){
    actualState.operationString = `${clearLastElement(totalOperation)}`;
    displayOperation.innerHTML = actualState.operationString;
    return actualState.secondNumber = clearLastElement(actualState.secondNumber);
  }
  else {
    actualState.operationString = `${clearLastElement(totalOperation)}`;
    displayOperation.innerHTML = actualState.operationString;
    actualState.firstNumber = clearLastElement(actualState.firstNumber);
    return noNumberLeft()
  }
}

function calculate() {
  let totalOperation = actualState.operationString;
  if (thereIsAnOperator(totalOperation) && operatorIsLastCharacter(totalOperation)) {
    displayOperation.innerHTML = "Syntax ERROR";
    setTimeout(() => {
      handleClearAllButton();
    }, 1500);
    return;
  }
  else if (thereIsNotAnOperator(totalOperation)) {
    actualState.finalResult = totalOperation
    return displayResult.innerHTML = totalOperation
  }
  else if (displayOperation.innerHTML.includes("Ans")) {
    let actualOperator = actualState.actualOperator,
    firstNumber = actualState.firstNumber,
    secondNumber = floatOrIntNumbers(actualState.secondNumber.join(""));
    handleOperators(actualOperator, firstNumber, secondNumber)
    
  }
  else {
    let actualOperator = actualState.actualOperator,
    firstNumber = floatOrIntNumbers(actualState.firstNumber.join("")),
    secondNumber = floatOrIntNumbers(actualState.secondNumber.join(""));

    handleOperators(actualOperator, firstNumber, secondNumber)
  }
}

function handleOperators(operator, firstNumber, secondNumber) {
  switch (operator) {
    case "*":
      actualState.finalResult = firstNumber * secondNumber;
      displayResult.innerHTML = actualState.finalResult;
      break;
    case "+":
      actualState.finalResult = firstNumber + secondNumber;
      displayResult.innerHTML = actualState.finalResult;
      break;
    case "-":
      actualState.finalResult = firstNumber - secondNumber;
      displayResult.innerHTML = actualState.finalResult;
      break;
    case "/":
      actualState.finalResult = firstNumber / secondNumber;
      displayResult.innerHTML = actualState.finalResult;
      break;
    default:
      actualState.finalResult = firstNumber % secondNumber;
      displayResult.innerHTML = actualState.finalResult;
      break;
  }
}


// functions for number buttons:
function displayOnlyHasZero(display) {
  return display.innerHTML === "0";
}

function floatOrIntNumbers(num) {
  return num.includes(".") ? parseFloat(num) : parseInt(num);
}

// functions for point:

function aPointIsLastCharacter(string) {
  return ["."].includes(string[string.length -1])
}


// functions for operators:

function thereIsAnOperator(string) {
  return operators.some(op => string.includes(op))
}

function thereIsNotAnOperator(string) {
  return !thereIsAnOperator(string)
}

function operatorIsLastCharacter(string) {
  return operators.includes(string[string.length -1])
}


// functions for clear buttons:

function clearLastElement(el) {
  return el.slice(0, -1);
}

function noNumberLeft() {
  if (displayOperation.innerHTML === "" && actualState.operationString === "") {
    return displayOperation.innerHTML = "0";
  }
}



// general functions

function clearDisplayAndSetValue(display, newElement) {
  display.innerHTML = ""
  return display.innerHTML = newElement
}

function pushNewElementToDisplay(display, actualDisplay, newElement) {
  return display.innerHTML = `${actualDisplay}${newElement}`
}

function setNewTotalOperation(el) {
  return actualState.operationString = `${actualState.operationString}${el}`
}

function noFinalResult() {
  return actualState.finalResult === "noResult";
}

function finalResultIsCalculated() {
  return !(noFinalResult())
}
// --------------------------------
allButtonsFunctions()