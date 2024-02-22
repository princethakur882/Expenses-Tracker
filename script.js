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
  .querySelector(".remove-category")
  .addEventListener("click", removeCategory);
document
  .querySelector(".first-lower form")
  .addEventListener("submit", submitExpense);
document.querySelector("#search").addEventListener("input", handleSearch);

window.onload = initialize;

const selectDiv = document.querySelector(".selectcate");
const otherOpt = document.getElementById("Otherscat");
const addBtn = document.querySelector('.first-lower form input[type="submit"]');
const updateBtn = document.getElementById("updateBtn");

updateBtn.style.display = "none";
selectDiv.style.display = "none";


function setBudget() {
  const budgetInput = document.querySelector('.f-u-input[type="number"]');
  const inputValue = budgetInput.value.trim();

  if (inputValue !== "" && parseFloat(inputValue) >= 500) {
    budget = parseFloat(inputValue) || 0;
    budgetInput.value = "";
    updateAmounts();
    saveToLocalStorage();
  } else {
    alert("Amount should be greater than or equal to 500");
  }
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
    expenses.push({ amount, category, date });
    totalExpense = calculateTotalExpense();
    updateAmounts();
    updateExpenseTable();
    saveToLocalStorage();

    amountInput.value = "";
    categorySelect.value = "option";
    dateInput.value = "";
  } else {
    alert("Please enter a valid Category");
  }
}

function updateAmounts() {
  document.querySelector("#totalAmount").value = budget;
  document.querySelector("#remainingAmount").value = budget - totalExpense;
  document.querySelector("#expenseAmount").value = totalExpense;
}

function updateCategorySelect() {
  const select = document.querySelector("#category");
  select.innerHTML = '<option value="option">Select any category --</option>';
  categories.forEach(function (category) {
    select.innerHTML += `<option>${category}</option>`;

    selectDiv.style.display = "none";
  });
}

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
}


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

otherOpt.addEventListener("click", function(e){
  e.preventDefault();

  otherOpt.style.display = "none";
  selectDiv.style.display = "block";


});


updateBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const myDate = document.querySelector("#date").value;
  const spendAmount = parseFloat(document.querySelector("#amount").value);
  const myCategory = document.querySelector("#category").value;

  const row = document.querySelector("table tr.editing");

  if (!row) {
    alert("No row selected for update");
    return;
  }

  const cells = row.querySelectorAll("td");
  cells[0].textContent = myDate;
  cells[1].textContent = spendAmount;
  cells[2].textContent = myCategory;

  document.querySelector("#date").value = "";
  document.querySelector("#amount").value = "";
  document.querySelector("#category").value = "";

  row.classList.remove("editing");
  
  addBtn.style.display = "block";
  updateBtn.style.display = "none";
  otherOpt.style.display = "block";
  
  updateAmounts();
  updateExpenseTable(index);
  saveToLocalStorage();
});


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
  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(searchTerm) ||
      expense.amount.toString().includes(searchTerm) ||
      expense.date.toLowerCase().includes(searchTerm)
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

document.querySelector("#clearData").addEventListener("click", clearLocalStorage);

function clearLocalStorage() {
  localStorage.clear();
  location.reload();
}

