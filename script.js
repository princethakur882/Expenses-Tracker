let budget = 0;
let totalExpense = 0;
let categories = [];
let expenses = [];

document
  .querySelector(".first-upper button")
  .addEventListener("click", setBudget);

document
  .querySelector('.f-u-input[type="text"] + button')
  .addEventListener("click", addCategory);

document
  .querySelector(".first-lower form")
  .addEventListener("submit", submitExpense);

window.onload = initialize;

function setBudget() {
  budget =
    parseFloat(document.querySelector('.f-u-input[type="number"]').value) || 0;
  updateAmounts();
  saveToLocalStorage();
}

function addCategory() {
  let categoryInput = document.querySelector('.f-u-input[type="text"]');
  categories.push(categoryInput.value);
  categoryInput.value = "";
  updateCategorySelect();
  saveToLocalStorage();
}

function submitExpense(event) {
  event.preventDefault();
  let amount = parseFloat(document.querySelector("#amount").value) || 0;
  let category = document.querySelector("#category").value;
  let date = document.querySelector("#date").value;

  if (amount > 0 && category !== "option1" && date !== "") {
    expenses.push({ amount, category, date });
    totalExpense = calculateTotalExpense();
    updateAmounts();
    updateExpenseTable();
    saveToLocalStorage();

    document.querySelector("#amount").value = "";
    document.querySelector("#category").value = "option1";
    document.querySelector("#date").value = "";
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
  let select = document.querySelector("#category");
  select.innerHTML = '<option value="option1">Select any category --</option>';
  categories.forEach(function (category) {
    select.innerHTML += `<option>${category}</option>`;
  });
}

function updateExpenseTable() {
  let table = document.querySelector("table");
  table.innerHTML = `
    <tr>
      <th>Amount</th>
      <th>Category</th>
      <th>Date</th>
      <th>Action</th>
    </tr>
  `;
  expenses.forEach(function (expense, index) {
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
  let editedAmount = prompt("Enter the new amount:", expenses[index].amount);
  if (editedAmount !== null) {
    expenses[index].amount = parseFloat(editedAmount) || 0;
    totalExpense = calculateTotalExpense();
    updateAmounts();
    updateExpenseTable();
    saveToLocalStorage();
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


