let currentInput = '';
let firstOperand = null;
let operator = null;

const display = document.getElementById('display');

// Function to update the display
function updateDisplay(value) {
    display.value = value || '0';
}

// Function to handle number button clicks
function handleNumberClick(number) {
    currentInput += number;
    updateDisplay(currentInput);
}

// Function to handle operator button clicks
function handleOperatorClick(op) {
    if (currentInput === '') return; // Prevent setting operation with empty input

    // Calculate the percentage if the % button is pressed
    if (op === '%') {
        const percentValue = parseFloat(currentInput) / 100;
        currentInput = percentValue.toString(); // Update current input with the percentage value
        updateDisplay(currentInput);
        return; // Exit the function after calculating percentage
    }

    // If there's a current input, calculate the first operand
    if (firstOperand === null) {
        firstOperand = parseFloat(currentInput);
    } else {
        firstOperand = calculate(firstOperand, parseFloat(currentInput), operator);
    }
    operator = op;
    currentInput = '';
    updateDisplay(firstOperand);
}

// Function to calculate the result
function calculateResult() {
    if (currentInput === '' || operator === null) return;
    const result = calculate(firstOperand, parseFloat(currentInput), operator);
    updateDisplay(result);
    resetCalculator();
}

// Calculation function
function calculate(a, b, op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : 'Error';
        default: return b;
    }
}

// Function to reset the calculator
function resetCalculator() {
    currentInput = '';
    firstOperand = null;
    operator = null;
}

// Function to handle clear button
function clearCalculator() {
    currentInput = '';
    firstOperand = null;
    operator = null;
    updateDisplay();
}

// Function to handle backspace
function handleBackspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
}

// Event listeners for buttons
document.querySelectorAll('.number-button').forEach(button => {
    button.addEventListener('click', () => handleNumberClick(button.textContent));
});

document.querySelectorAll('.operator-button').forEach(button => {
    button.addEventListener('click', () => {
        const op = button.textContent === '×' ? '*' :
                   button.textContent === '÷' ? '/' :
                   button.textContent === '−' ? '-' : 
                   button.textContent; 
        if (button.classList.contains('equals')) {
            calculateResult();
        } else {
            handleOperatorClick(op);
        }
    });
});

document.getElementById('clear').addEventListener('click', clearCalculator);
document.getElementById('backspace').addEventListener('click', handleBackspace);
