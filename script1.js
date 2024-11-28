let expenses = [];
let monthlyBudget = 0;

const selectedCategory = document.getElementById("category");
const inputAmount = document.getElementById("amount");
const inputDate = document.getElementById("date");
const addButton = document.getElementById("add-button");
const budgetButton = document.getElementById("setBudgetButton");
const budgetAmount = document.getElementById("budgetAmount");
const transactionList = document.getElementById('transactionList');
const savingsElement = document.getElementById('savings');
const expenseChart = document.getElementById('expenseChart');

let myChart;

addButton.addEventListener("click", function() {
  const category = selectedCategory.value;
  const amount = parseFloat(inputAmount.value);
  const date = inputDate.value;

  if (category === "") {
    alert("Please select a category");
    return;
  }
  
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  
  if (date === "") {
    alert("Please select a date");
    return;
  }

  expenses.push({ category, amount, date });
  transactionData();

  // Reset input fields after adding a transaction
  inputAmount.value = '';
  inputDate.value = '';
});

budgetButton.addEventListener("click", function() {
  const newBudget = parseFloat(budgetAmount.value);
  if (isNaN(newBudget) || newBudget < 0) {
    alert("Please enter a valid budget amount");
    return;
  }
  monthlyBudget = newBudget;
  transactionData();
});

function transactionData() {
  transactionList.innerHTML = "";
  const categoryTotals = {}; 

  expenses.forEach(({ category, amount, date }) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${date} - $${amount.toFixed(2)} (${category})`;
    transactionList.appendChild(listItem);

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += amount;
  });

  const netSavings = Object.values(categoryTotals).reduce((acc, amount) => acc + amount, 0) - monthlyBudget; 
  const savingMessage = `Savings: $${netSavings.toFixed(2)} | Budget: $${monthlyBudget.toFixed(2)} | ${netSavings > 0 ? 'Overspent' : 'Within budget'}`;
  
  savingsElement.textContent = savingMessage;
  barGraph(categoryTotals);
}

function barGraph(categoryTotals) {
  const ctx = expenseChart.getContext('2d');

  
  if (myChart) {
    myChart.destroy();
  }

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Amount ($)',
        data: amounts,
        backgroundColor: 'magenta',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}




