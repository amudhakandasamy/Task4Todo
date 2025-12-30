// DOM Elements
const transactionForm = document.getElementById('transaction-form');
const entriesList = document.getElementById('entries-list');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const netBalanceEl = document.getElementById('net-balance');
const typeInput = document.getElementById('type');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const entryIdInput = document.getElementById('entry-id');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const filterRadios = document.querySelectorAll('input[name="filter"]');

// Initialize transactions array from local storage or empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// To format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'        
    }).format(amount);
};

// Function to add or update a transaction 
function addOrUpdateTransaction(e) {
    e.preventDefault(); // Prevents the default HTML form refresh the page).

    const type = typeInput.value;
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const id = entryIdInput.value;

    if (!description || amount <= 0) {
        alert('Please enter valid description and amount.');
        return;
    }

    if (id) {
        // Update existing entry
        const index = transactions.findIndex(t => t.id === parseInt(id));
        if (index > -1) {
            transactions[index] = { ...transactions[index], type, description, amount };
        }
        submitBtn.textContent = 'Add Entry';
    } else {
        // Add new entry
        const newTransaction = {
            id: Date.now(), // Use timestamp as unique ID
            type,
            description,
            amount
        };
        transactions.push(newTransaction);
    }
    saveTransactions();
    resetForm();
    renderTransactions();
}

// Function to delete a transaction (CRUD - Delete)
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions();
    renderTransactions();
}

// Function to load transaction into form for editing (CRUD - Update part 1)
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        typeInput.value = transaction.type;
        descriptionInput.value = transaction.description;
        amountInput.value = transaction.amount;
        entryIdInput.value = transaction.id;
        submitBtn.textContent = 'Update Entry';
        window.scrollTo(0, 0); // Scroll to top to see the form
    }
}

// Function to render transactions to the DOM (CRUD - Read)
function renderTransactions() {
    entriesList.innerHTML = '';
    const currentFilter = document.querySelector('input[name="filter"]:checked').value;

    const filteredTransactions = transactions.filter(t => {
        if (currentFilter === 'all') return true;
        return t.type === currentFilter;
    });

    filteredTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add('entry-item', transaction.type);
        li.innerHTML = `
            <div class="entry-details">
                <span class="entry-description">${transaction.description}</span>
                <span class="entry-amount">${formatCurrency(transaction.amount)}</span>
            </div>
            <div class="entry-actions">
                <button onclick="editTransaction(${transaction.id})" class="edit-btn">Edit</button>
                <button onclick="deleteTransaction(${transaction.id})" class="delete-btn">Delete</button>
            </div>
        `;
        entriesList.appendChild(li);
    });

    updateSummary();
}

// Function to update total income, expenses, and balance
function updateSummary() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    totalIncomeEl.textContent = formatCurrency(totalIncome);
    totalExpensesEl.textContent = formatCurrency(totalExpenses);
    netBalanceEl.textContent = formatCurrency(netBalance);
 
}

// Function to save transactions to local storage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to reset the form fields
function resetForm() {
    transactionForm.reset();    
    entryIdInput.value = '';
    submitBtn.textContent = 'Add Entry';
}

// Event Listeners
transactionForm.addEventListener('submit', addOrUpdateTransaction);
resetBtn.addEventListener('click', resetForm);

filterRadios.forEach(radio => {
    radio.addEventListener('change', renderTransactions);
});

// Initial render when the page loads
document.addEventListener('DOMContentLoaded', renderTransactions);
