// Initialize variables
let budget = 0;
let totalExpense = 0;
let categories = [];
let expenses = [];

// Event listeners
document
  .querySelector(".first-upper button")
  .addEventListener("click", setBudget);
document
  .querySelector('.f-u-input[type="text"] + button')
  .addEventListener("click", addCategory);
document
  .querySelector(".remove-category")
  .addEventListener("click", removeCategory);
document
  .querySelector(".first-lower form")
  .addEventListener("submit", submitExpense);
document.querySelector("#search").addEventListener("input", handleSearch);
document
  .querySelector("#clearData")
  .addEventListener("click", clearLocalStorage);

window.onload = initialize;

// DOM elements
const selectDiv = document.querySelector(".selectcate");
const otherOpt = document.getElementById("Otherscat");
const addBtn = document.querySelector('.first-lower form input[type="submit"]');
const updateBtn = document.getElementById("updateBtn");
const removeBtn = document.querySelector(".remove-category");

updateBtn.style.display = "none";
selectDiv.style.display = "none";
removeBtn.style.display = "none";

// Function to set budget
function setBudget() {
  const budgetInput = document.querySelector('.f-u-input[type="number"]');
  const inputValue = parseFloat(budgetInput.value.trim()) || 0;

  if (inputValue >= 500) {
    budget = inputValue;
    budgetInput.value = "";
    updateAmounts();
    saveToLocalStorage();
    warning();
  } else {
    alert("Amount should be greater than or equal to 500");
  }
}

// Function to add a category
function addCategory() {
  const categoryInput = document.querySelector('.f-u-input[type="text"]');
  const newCategory = categoryInput.value.trim();

  if (newCategory !== "") {
    if (categories.includes(newCategory)) {
      alert("Category already exists.");
      return;
    }
    otherOpt.style.display = "block";
    categories.push(newCategory);
    categoryInput.value = "";
    updateCategorySelect();
    saveToLocalStorage();
  } else {
    alert("Please enter a valid category.");
  }
  otherOpt.style.display = "block";
}

// Function to remove a category
function removeCategory() {
  const removeCategoryInput = document.querySelector('.f-u-input[type="text"]');
  const removedCategory = removeCategoryInput.value.trim();

  if (removedCategory !== "") {
    const index = categories.indexOf(removedCategory);
    if (index !== -1) {
      categories.splice(index, 1);
      removeCategoryInput.value = "";
      updateCategorySelect();
      saveToLocalStorage();
    } else {
      alert("Category not found. Please enter a valid category to remove.");
    }
  } else {
    alert("Please enter a valid category to remove.");
  }
}

// Function to submit an expense
function submitExpense(event) {
  event.preventDefault();

  if (budget <= 0) {
    alert("Please set your budget before adding expenses.");
    return;
  }

  const amountInput = document.querySelector("#amount");
  const categorySelect = document.querySelector("#category");
  const dateInput = document.querySelector("#date");

  const amount = parseFloat(amountInput.value) || 0;
  const category = categorySelect.value;
  const date = dateInput.value;

  if (amount > 0 && category !== "option" && date !== "") {
    if (totalExpense + amount > budget) {
      alert("Expense exceeds the budget. Please enter a valid amount.");
      return;
    }
    expenses.push({ amount, category, date });
    totalExpense = calculateTotalExpense();

    updateAmounts();
    updateExpenseTable();
    saveToLocalStorage();

    // Clear input fields
    amountInput.value = "";
    categorySelect.value = "option";
    dateInput.value = "";
  } else {
    alert("Please enter a valid Category");
  }
}

// Function to update amounts in the UI
function updateAmounts() {
  document.querySelector("#totalAmount").value = budget;
  document.querySelector("#remainingAmount").value = budget - totalExpense;
  document.querySelector("#expenseAmount").value = totalExpense;
  warning();
}

// Function to update the category dropdown
function updateCategorySelect() {
  const select = document.querySelector("#category");
  select.innerHTML = '<option value="option">Select any category --</option>';
  categories.forEach(function (category) {
    select.innerHTML += `<option>${category}</option>`;
  });
  selectDiv.style.display = "none";
}

// Function to update the expense table
function updateExpenseTable(filteredExpenses = expenses) {
  const table = document.querySelector("table");
  table.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Amount</th>
      <th>Category</th>
      <th>Action</th>
    </tr>
  `;
  filteredExpenses.forEach(function (expense, index) {
    table.innerHTML += `
      <tr>
        <td>${expense.date}</td>
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td>
          <button onclick="editHandle(${index})">Edit</button>
          <button onclick="deleteExpense(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
  warning();
}

// Function to handle edit operation
function editHandle(index) {
  const row = document.querySelectorAll("table tr")[index + 1];
  row.classList.add("editing");

  const cells = row.querySelectorAll("td");
  const myDate = cells[0].textContent;
  const spendAmount = cells[1].textContent;
  const myCategory = cells[2].textContent;

  document.querySelector("#date").value = myDate;
  document.querySelector("#amount").value = spendAmount;
  document.querySelector("#category").value = myCategory;

  addBtn.style.display = "none";
  updateBtn.style.display = "block";
}

// Event listener for "Others" category
otherOpt.addEventListener("click", function (e) {
  e.preventDefault();
  otherOpt.style.display = "none";
  selectDiv.style.display = "block";
  updateAmounts();
});

// Event listener for update button
updateBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Retrieve values from the form
  const myDate = document.querySelector("#date").value;
  const spendAmount = parseFloat(document.querySelector("#amount").value) || 0;
  const myCategory = document.querySelector("#category").value;

  const row = document.querySelector("table tr.editing");

  if (!row) {
    alert("No row selected for update");
    return;
  }

  // Update totalExpense and expenses array
  const oldAmount = parseFloat(row.querySelectorAll("td")[1].textContent);
  const newTotalExpense = totalExpense - oldAmount + spendAmount;

  if (newTotalExpense > budget) {
    alert("Expense exceeds the budget. Please enter a valid amount.");
    return;
  }

  totalExpense = newTotalExpense;
  expenses[row.rowIndex - 1] = {
    amount: spendAmount,
    category: myCategory,
    date: myDate,
  };

  // Recalculate totalExpense and update UI
  updateExpenseTable();
  updateAmounts();
  saveToLocalStorage();

  // Clear input fields and remove editing class
  document.querySelector("#date").value = "";
  document.querySelector("#amount").value = "";
  document.querySelector("#category").value = "";
  row.classList.remove("editing");

  addBtn.style.display = "block";
  updateBtn.style.display = "none";
  otherOpt.style.display = "block";
});

// Function to delete an expense
function deleteExpense(index) {
  if (confirm("Are you sure you want to delete this expense?")) {
    totalExpense -= expenses[index].amount;
    expenses.splice(index, 1);
    updateAmounts();
    updateExpenseTable();
    saveToLocalStorage();
  }
}

// Function to calculate total expense
function calculateTotalExpense() {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

// Function to handle search input
function handleSearch() {
  const searchTerm = document.querySelector("#search").value.toLowerCase();
  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(searchTerm) ||
      expense.amount.toString().includes(searchTerm) ||
      expense.date.toLowerCase().includes(searchTerm)
  );
  updateExpenseTable(filteredExpenses);
}

// Function to update warning based on remaining amount
function warning() {
  const remainingAmountElement = document.getElementById("remainingAmount");

  if (remainingAmountElement.value < 100) {
    remainingAmountElement.classList.add("warningRed");
  } else {
    remainingAmountElement.classList.remove("warningRed");
  }
}


// Function to save data to local storage
function saveToLocalStorage() {
  localStorage.setItem("budget", budget);
  localStorage.setItem("totalExpense", totalExpense);
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateAmounts();
}

// Function to initialize data from local storage
function initialize() {
  budget = parseFloat(localStorage.getItem("budget")) || 0;
  totalExpense = parseFloat(localStorage.getItem("totalExpense")) || 0;
  categories = JSON.parse(localStorage.getItem("categories")) || [
    "Food",
    "Rent",
    "Shopping",
  ];
  expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  updateAmounts();
  updateCategorySelect();
  updateExpenseTable();
}

// Function to clear local storage
function clearLocalStorage() {
  localStorage.clear();
  location.reload();
}
