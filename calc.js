let currentInput = "";
let firstOperand = null;
let operator = null;
let history = JSON.parse(localStorage.getItem("history")) || [];

const display = document.getElementById("display");
const historyList = document.getElementById("history-list");
const historyPanel = document.getElementById("history");
const menuButton = document.getElementById("menu-button");

// Create and add a clear history button inside the menu dynamically
const clearHistoryButton = document.createElement("button");
clearHistoryButton.textContent = "Clear History";
clearHistoryButton.id = "clear-history";
clearHistoryButton.style.display = "block"; // Ensure it appears correctly
clearHistoryButton.style.margin = "10px auto"; // Center it
historyPanel.appendChild(clearHistoryButton);

// Function to update the display
function updateDisplay(value) {
    display.value = value || "0";
}

// Function to handle number button clicks
function handleNumberClick(number) {
    currentInput += number;
    updateDisplay(currentInput);
}


function handleNumberClick(number) {
    currentInput += number; //shows number as one, removes comma 
    updateDisplay(formatWithCommas(currentInput));
}

// Function to format the number with commas (e.g. "1000000" -> "1,000,000")
function formatWithCommas(value) {
    value = value.replace(/[^0-9]/g, '');
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Removes commas before calculation
function removeCommas(value) {
    return value.replace(/,/g, ''); // Remove all commas
}


// Function to handle operator button clicks
function handleOperatorClick(op) {
    if (currentInput === "" && firstOperand === null) return;

    const displayOperator =
        op === "*" ? "×" : op === "/" ? "÷" : op === "-" ? "−" : op === "%" ? "%" : op;

    if (op === "%") {
        if (currentInput !== "") {
            currentInput = (parseFloat(currentInput) / 100).toString();
            currentInput = (parseFloat(removeCommas(currentInput)) / 100).toString();
            updateDisplay(currentInput);
            return;
        }
    }

    if (firstOperand === null) {
        firstOperand = parseFloat(currentInput);
    } else if (currentInput !== "") {
        firstOperand = calculate(firstOperand, parseFloat(currentInput), operator);
    }

    currentInput = "";
    operator = op;
    updateDisplay(firstOperand + ` ${displayOperator} `);
}

// Function to calculate the result
function calculateResult() {
    if (currentInput === "" || operator === null) return;
    const result = calculate(firstOperand, parseFloat(currentInput), operator);

    addToHistory(`${firstOperand} ${operator} ${currentInput} = ${result}`);
    updateDisplay(result);
    resetCalculator();
}

// Calculation function
function calculate(a, b, op) {
    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b !== 0 ? a / b : "Error";
        case "%": return a * (b / 100);
    }
}

// Add to history and store in localStorage
function addToHistory(entry) {
    history.unshift(entry);
    localStorage.setItem("history", JSON.stringify(history));

    updateHistoryList();
}

// Load history into the menu with scrolling
function updateHistoryList() {
    historyList.innerHTML = history.map((item) => `<li>${item}</li>`).join("");

    // Ensure scrolling if history is long
    historyList.style.maxHeight = "300px"; // Adjust as needed
    historyList.style.overflowY = "auto";
}

// Function to clear history
clearHistoryButton.addEventListener("click", () => {
    history = [];
    localStorage.removeItem("history");
    updateHistoryList();
});

// Toggle menu with animation
menuButton.addEventListener("click", () => {
    historyPanel.classList.toggle("hidden");
    menuButton.classList.toggle("open");
    menuButton.innerHTML = menuButton.classList.contains("open") ? "&#10006;" : "&#9776;"; // Change ☰ to X
});

// Function to reset the calculator
function resetCalculator() {
    currentInput = "";
    firstOperand = null;
    operator = null;
}

// Event listeners
document.querySelectorAll(".number-button").forEach((button) => {
    button.addEventListener("click", () => handleNumberClick(button.textContent));
});

document.querySelectorAll(".operator-button").forEach((button) => {
    button.addEventListener("click", () => {
        const op = button.textContent === "×" ? "*" :
                   button.textContent === "÷" ? "/" :
                   button.textContent === "−" ? "-" : 
                   button.textContent;
        if (button.classList.contains("equals")) {
            calculateResult();
        } else {
            handleOperatorClick(op);
        }
    });
});

document.getElementById("clear").addEventListener("click", () => {
    resetCalculator();
    updateDisplay("");
});

document.getElementById("backspace").addEventListener("click", () => {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
});

// Load existing history on page load
updateHistoryList();
