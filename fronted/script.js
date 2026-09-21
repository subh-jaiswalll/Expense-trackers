// ================= API CONFIG =================

const API_URL = "https://expense-trackers-application.onrender.com";
// ================= TOKEN =================

const token = localStorage.getItem("token");

const landingPage = document.getElementById("landingPage");
const dashboardPage = document.getElementById("dashboardPage");

// ================= PAGE DISPLAY =================

if (token) {
  // User is logged in
  landingPage.style.display = "none";
  dashboardPage.style.display = "block";
} else {
  // User is not logged in
  landingPage.style.display = "flex";
  // dashboardPage.style.display = "none";
}

// ================= USER NAME =================

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  document.getElementById("userName").textContent = user.name;
}

// ================= TRANSACTIONS =================

let transactions = [];

// ================= FORMAT CURRENCY =================

function formatCurrency(value) {
  return (
    "₹ " +
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// ================= FORMAT DATE =================

function formatDate(date) {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

// ================= GET MONTH NAME =================

function getMonthName(date) {
  const d = new Date(date);

  const month = d.toLocaleString("en-US", {
    month: "long",
  });

  const year = d.getFullYear();

  return `${month} ${year}`;
}

// ================= DYNAMIC MONTH DROPDOWN =================

function populateMonthFilter() {
  const monthFilter = document.getElementById("monthFilter");

  monthFilter.innerHTML = "";

  // All option
  const allOption = document.createElement("option");

  allOption.value = "all";
  allOption.textContent = "All Months";

  monthFilter.appendChild(allOption);

  // Store unique months
  const months = new Set();

  transactions.forEach((transaction) => {
    months.add(getMonthName(transaction.date));
  });

  // Convert to array and sort
  const sortedMonths = Array.from(months).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  sortedMonths.forEach((month) => {
    const option = document.createElement("option");

    option.value = month;
    option.textContent = month;

    monthFilter.appendChild(option);
  });
}

// ================= GET EXPENSES =================

async function getTransactions() {
  try {
    const response = await fetch(`${API_URL}/expense`, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log("GET EXPENSE:", data);

    // ================= UNAUTHORIZED =================

    if (response.status === 401) {
      alert("Session expired. Please login again.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/fronted/login/login.html";

      return;
    }

    // ================= OTHER ERRORS =================

    if (!response.ok) {
      alert(data.message || "Failed to fetch expenses");

      return;
    }

    // ================= STORE DATA =================

    transactions = data.expenses || [];

    // ================= UPDATE MONTH DROPDOWN =================

    populateMonthFilter();

    // ================= SHOW TRANSACTIONS =================

    renderTransactions();
  } catch (error) {
    console.error("GET EXPENSE ERROR:", error);

    alert("Server error");
  }
}

// ================= RENDER TRANSACTIONS =================

function renderTransactions(selectedMonth = "all") {
  const tbody = document.getElementById("transactionBody");

  tbody.innerHTML = "";

  // ================= FILTER =================

  let filteredTransactions = transactions;

  if (selectedMonth !== "all") {
    filteredTransactions = transactions.filter((transaction) => {
      return getMonthName(transaction.date) === selectedMonth;
    });
  }

  // ================= NO DATA =================

  if (filteredTransactions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;">
          No transactions found
        </td>
      </tr>
    `;

    updateSummary(0, 0, 0);

    return;
  }

  // ================= TOTALS =================

  let balance = 0;

  let totalIncome = 0;

  let totalExpense = 0;

  // ================= TABLE =================

  filteredTransactions.forEach((transaction) => {
    const income = Number(transaction.income) || 0;

    const expense = Number(transaction.expense) || 0;

    totalIncome += income;

    totalExpense += expense;

    balance += income - expense;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        ${formatDate(transaction.date)}
      </td>

      <td>
        ${transaction.description}
      </td>

      <td>
        ${transaction.category}
      </td>

      <td class="income-value">
        ${formatCurrency(income)}
      </td>

      <td class="expense-value">
        ${formatCurrency(expense)}
      </td>

      <td class="balance-value">
        ${formatCurrency(balance)}
      </td>

      <td>
        <button
          class="delete-btn"
          onclick="deleteTransaction(${transaction.id})"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });

  // ================= TOTAL ROW =================

  const totalRow = document.createElement("tr");

  totalRow.classList.add("total-row");

  const finalBalance = totalIncome - totalExpense;

  totalRow.innerHTML = `
    <td colspan="3">
      Total
    </td>

    <td class="income-value">
      ${formatCurrency(totalIncome)}
    </td>

    <td class="expense-value">
      ${formatCurrency(totalExpense)}
    </td>

    <td class="balance-value">
      ${formatCurrency(finalBalance)}
    </td>

    <td></td>
  `;

  tbody.appendChild(totalRow);

  // ================= UPDATE SUMMARY =================

  updateSummary(totalIncome, totalExpense, finalBalance);
}

// ================= UPDATE SUMMARY =================

function updateSummary(totalIncome, totalExpense, balance) {
  document.getElementById("totalIncome").textContent =
    formatCurrency(totalIncome);

  document.getElementById("totalExpense").textContent =
    formatCurrency(totalExpense);

  document.getElementById("netBalance").textContent =
    formatCurrency(balance);

  document.getElementById("totalSavings").textContent =
    formatCurrency(balance);
}

// ================= MONTH FILTER EVENT =================

document
  .getElementById("monthFilter")
  .addEventListener("change", function () {
    const selectedMonth = this.value;

    renderTransactions(selectedMonth);
  });

// ================= DELETE TRANSACTION =================

async function deleteTransaction(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this transaction?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/expense/${id}`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log("DELETE:", data);

    // ================= UNAUTHORIZED =================

    if (response.status === 401) {
      alert("Session expired. Please login again.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/fronted/login/login.html";

      return;
    }

    // ================= ERROR =================

    if (!response.ok) {
      alert(data.message || "Failed to delete expense");

      return;
    }

    alert("Expense deleted successfully");

    // ================= REFRESH DATA =================

    getTransactions();
  } catch (error) {
    console.error("DELETE ERROR:", error);

    alert("Server error");
  }
}

// ================= SIDEBAR =================

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("show");
}

// ================= OPEN MODAL =================

function openTransactionModal() {
  document.getElementById("transactionModal").classList.add("show");

  // Set today's date
  document.getElementById("date").value = new Date()
    .toISOString()
    .split("T")[0];
}

// ================= CLOSE MODAL =================

function closeTransactionModal() {
  document.getElementById("transactionModal").classList.remove("show");
}

// ================= ADD TRANSACTION =================

document
  .getElementById("transactionForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // ================= GET FORM DATA =================

    const date = document.getElementById("date").value;

    const description =
      document.getElementById("description").value.trim();

    const category =
      document.getElementById("category").value.trim();

    const income =
      Number(document.getElementById("income").value) || 0;

    const expense =
      Number(document.getElementById("expense").value) || 0;

    // ================= VALIDATION =================

    if (income === 0 && expense === 0) {
      alert("Please enter income or expense.");

      return;
    }

    if (income > 0 && expense > 0) {
      alert("Please enter either income or expense, not both.");

      return;
    }

    // ================= POST REQUEST =================

    try {
      const response = await fetch(`${API_URL}/expense`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          date,
          description,
          category,
          income,
          expense,
        }),
      });

      const data = await response.json();

      console.log("CREATE EXPENSE:", data);

      // ================= UNAUTHORIZED =================

      if (response.status === 401) {
        alert("Session expired. Please login again.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login/login.html";

        return;
      }

      // ================= ERROR =================

      if (!response.ok) {
        alert(data.message || "Failed to create expense");

        return;
      }

      // ================= SUCCESS =================

      alert("Transaction added successfully");

      // Reset form
      this.reset();

      // Close modal
      closeTransactionModal();

      // Refresh transactions
      getTransactions();
    } catch (error) {
      console.error("CREATE ERROR:", error);

      alert("Server error");
    }
  });

// ================= CLOSE MODAL BY CLICKING OUTSIDE =================

document
  .getElementById("transactionModal")
  .addEventListener("click", function (event) {
    if (event.target === this) {
      closeTransactionModal();
    }
  });

// ================= LOGOUT =================

function logout() {
  localStorage.removeItem("token");

  localStorage.removeItem("user");

  window.location.href = "/fronted/login/login.html";
}

// ================= INITIAL LOAD =================

if (token) {
  getTransactions();
}