// Variable to keep track of the selected row for editing
let selectRows = null;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// On form submission
function onSubmit() {
    event.preventDefault();
    let formData = getFormData();

    if (selectRows === null) {
        insertNewData(formData);
        transactions.push(formData);
    } else {
        updateNewData(formData);
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));
    calculateTotals();
    resetForm();
}

// Get data from the form
function getFormData() {
    let formData = {};
    formData['desc'] = document.getElementById('desc').value;
    formData['amount'] = parseFloat(document.getElementById('amount').value);
    formData['type'] = document.querySelector('input[name="type"]:checked').value; // Get the selected type
    return formData;
}

// Insert new data into the table
function insertNewData(data) {
    let table = document.getElementById('storedList').getElementsByTagName('tbody')[0];
    let newRow = table.insertRow(table.length);

    newRow.insertCell(0).innerText = data.desc;
    newRow.insertCell(1).innerText = `$${Math.abs(data.amount)}`;
    newRow.insertCell(2).innerText = data.type;

    let cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<button onClick="onEdit(this)">Edit</button> <button class="delete" onClick="onDelete(this)">Delete</button>`;
}

// Edit an existing entry
function onEdit(td) {
    selectRows = td.parentElement.parentElement;
    document.getElementById('desc').value = selectRows.cells[0].innerText;
    document.getElementById('amount').value = selectRows.cells[1].innerText.replace('$', '');

    // Set the type (income or expense) based on the current row's data
    let type = selectRows.cells[2].innerText;
    document.querySelector(`input[name="type"][value="${type}"]`).checked = true;
}

// Update the selected row
function updateNewData(formData) {
    selectRows.cells[0].innerText = formData.desc;
    selectRows.cells[1].innerText = `$${Math.abs(formData.amount)}`;
    selectRows.cells[2].innerText = formData.amount >= 0 ? 'income' : 'expense';

    let rowIndex = selectRows.rowIndex - 1;
    transactions[rowIndex] = formData;
    selectRows = null;
}

// Delete an entry
function onDelete(td) {
    if (confirm("Are you sure you want to delete this entry?")) {
        let row = td.parentElement.parentElement;
        let index = row.rowIndex - 1;
        transactions.splice(index, 1);
        document.getElementById('storedList').deleteRow(row.rowIndex);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        calculateTotals();
    }
}

// Filter transactions based on user selection
function filterTransactions() {
    let filter = document.querySelector('input[name="filter"]:checked').value;
    let tbody = document.getElementById('storedList').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    let filteredTransactions = transactions.filter(transaction => {
        if (filter === 'all') return true;
        return transaction.type === filter;
    });

    filteredTransactions.forEach(transaction => insertNewData(transaction));
}

// Calculate and display total income, total expenses, and net balance
function calculateTotals() {
    let totalIncome = 0, totalExpenses = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += Math.abs(transaction.amount);
        } else {
            totalExpenses += Math.abs(transaction.amount);
        }
    });

    document.getElementById('total-income').innerText = `Income: $${totalIncome}`;
    document.getElementById('total-expenses').innerText = `Expenses: $${totalExpenses}`;
    document.getElementById('net-balance').innerText = `Net Balance: $${totalIncome - totalExpenses}`;
}

// Load data from localStorage on page load
window.onload = function() {
    transactions.forEach(transaction => insertNewData(transaction));
    calculateTotals();
}

// Reset the form
function resetForm() {
    document.getElementById('desc').value = '';
    document.getElementById('amount').value = '';
    selectRows = null;
}
