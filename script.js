let budget = 0;
let totalExpense = 0;
let categories = [];
let expenses = [];

document.querySelector(".first-upper button").addEventListener("click", setBudget);
document.querySelector('.f-u-input[type="text"] + button').addEventListener("click", addCategory);
document.querySelector(".first-lower form").addEventListener("submit", submitExpense);
document.querySelector("#search").addEventListener("input", handleSearch);

window.onload = initialize;

function setBudget() {
  const budgetInput = document.querySelector('.f-u-input[type="number"]');
  budget = parseFloat(budgetInput.value) || 0;
  budgetInput.value = ""; 
  updateAmounts();
  saveToLocalStorage();
}

function addCategory() {
  const categoryInput = document.querySelector('.f-u-input[type="text"]');
  const newCategory = categoryInput.value.trim();
  
  if (newCategory !== "") {
    categories.push(newCategory);
    categoryInput.value = ""; 
    updateCategorySelect();
    saveToLocalStorage();
  } else {
    alert("Please enter a valid category.");
  }
}

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

  if (amount > 0 && category !== "option1" && date !== "") {
    expenses.push({ amount, category, date });
    totalExpense = calculateTotalExpense();
    updateAmounts();
    updateExpenseTable();
    saveToLocalStorage();

    amountInput.value = "";
    categorySelect.value = "option1";
    dateInput.value = "";
  } else {
    alert("Please fill in all the fields correctly.");
  }
}

function updateAmounts() {
  document.querySelector("#totalAmount").value = budget;
  document.querySelector("#remainingAmount").value = budget - totalExpense;
  document.querySelector("#expenseAmount").value = totalExpense;
}

function updateCategorySelect() {
  const select = document.querySelector("#category");
  select.innerHTML = '<option value="option1">Select any category --</option>';
  categories.forEach(function (category) {
    select.innerHTML += `<option>${category}</option>`;
  });
}

function updateExpenseTable(filteredExpenses = expenses) {
  const table = document.querySelector("table");
  table.innerHTML = `
    <tr>
      <th>Amount</th>
      <th>Category</th>
      <th>Date</th>
      <th>Action</th>
    </tr>
  `;
  filteredExpenses.forEach(function (expense, index) {
    table.innerHTML += `
      <tr>
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
        <td>
          <button onclick="editExpense(${index})">Edit</button>
          <button onclick="deleteExpense(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function editExpense(index) {
  const editedAmount = prompt("Enter the new amount:", expenses[index].amount);
  if (editedAmount !== null) {
    let editedCategory = prompt("Enter the new category:", expenses[index].category);

    if (editedCategory !== null && editedCategory.trim() !== "") {
      expenses[index].amount = parseFloat(editedAmount) || 0;
      expenses[index].category = editedCategory.trim();
      totalExpense = calculateTotalExpense();
      updateAmounts();
      updateExpenseTable();
      saveToLocalStorage();
    } else {
      alert("Category cannot be empty. Please enter a valid category.");
    }
  }
}

function deleteExpense(index) {
  if (confirm("Are you sure you want to delete this expense?")) {
    totalExpense -= expenses[index].amount;
    expenses.splice(index, 1);
    updateAmounts();
    updateExpenseTable();
    saveToLocalStorage();
  }
}

function calculateTotalExpense() {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}



function handleSearch() {
  const searchTerm = document.querySelector("#search").value.toLowerCase();
  const filteredExpenses = expenses.filter((expense) =>
    expense.category.toLowerCase().includes(searchTerm)
  );

  updateExpenseTable(filteredExpenses);
}


function saveToLocalStorage() {
  localStorage.setItem("budget", budget);
  localStorage.setItem("totalExpense", totalExpense);
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function initialize() {
  budget = parseFloat(localStorage.getItem("budget")) || 0;
  totalExpense = parseFloat(localStorage.getItem("totalExpense")) || 0;
  categories = JSON.parse(localStorage.getItem("categories")) || [];
  expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  updateAmounts();
  updateCategorySelect();
  updateExpenseTable();
}
