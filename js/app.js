document.addEventListener('DOMContentLoaded', function() {
  let linkToken;  // Global variable to store the link token
  let publicToken;  // Global variable to store the public token
  let accessToken;  // Updated: global variable for access token


  const openLinkButton = document.getElementById('openLink');
  const loader = document.getElementById('loader');
  const expenseForm = document.getElementById('expense-form');
  const table = document.getElementById('transactionsTable');


  const getTransactionsButton = document.getElementById('getTransactions');
  
  getTransactionsButton.addEventListener('click', async () => {
    if (!publicToken) {
        console.error('Public token is not set.');
        return;
    }

    // Exchange public token for access token
    const response1 = await fetch('/api/set_access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `public_token=${publicToken}`,
    });

    const data1 = await response1.json();
    loader.style.display = 'flex';  // Show loader
    const response2 = await fetch('/api/info', { method: 'POST' });
    const data2 = await response2.json();
    const getResults = document.getElementById('getResults');
    getResults.textContent = JSON.stringify(data2, null, 2);  // Display GET results
    getTransactionsButton.disabled = false;  // Enable the "Get Transactions" button after the access token is obtained
    accessToken = data1.access_token;  // Updated: store access token in global variable
    console.log(accessToken);  // Logging the access token to console, remove this in production code
      
    const response = await fetch(`/api/transactions?access_token=${accessToken}`, { method: 'GET' });
    const data = await response.json();

    loader.style.display = 'none';  // Hide loader

    if (data && Array.isArray(data.transactions)) {
      
        const transactionsTable = document.getElementById('transactionsTable').getElementsByTagName('tbody')[0];
        //transactionsTable.innerHTML = "";  // Clear the existing rows

        data.transactions.forEach(transaction => {
            const newRow = transactionsTable.insertRow();
            
            const dateCell = newRow.insertCell();
            dateCell.textContent = transaction.date;

            const nameCell = newRow.insertCell();
            nameCell.textContent = transaction.name;

            const amountCell = newRow.insertCell();
            amountCell.textContent = transaction.amount;

            const categoryCell = newRow.insertCell();
            if (transaction.category) {
              categoryCell.textContent = transaction.category.join(', ');
            } else {
              categoryCell.textContent = 'N/A'; // or any other placeholder for missing data
            }

            const merchantCell = newRow.insertCell();
            merchantCell.textContent = transaction.merchant_name;

            const paymentChannelCell = newRow.insertCell();
            paymentChannelCell.textContent = transaction.payment_channel;
        });
    } else {
        console.error('No transactions data received');
    }
    });
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const expenseName = document.getElementById('expenseName').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        const merchant = document.getElementById('merchant').value;
        const paymentChannel = document.getElementById('paymentChannel').value;

        const response = await fetch('/api/add_expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expenseName, amount, category, date, merchant, paymentChannel })
        });

        if (response.ok) {
            const newRow = table.tBodies[0].insertRow();

            const dateCell = newRow.insertCell();
            dateCell.textContent = date;

            const nameCell = newRow.insertCell();
            nameCell.textContent = expenseName;

            const amountCell = newRow.insertCell();
            amountCell.textContent = amount;

            const categoryCell = newRow.insertCell();
            categoryCell.textContent = category;

            const merchantCell = newRow.insertCell();
            merchantCell.textContent = merchant;

            const paymentChannelCell = newRow.insertCell();
            paymentChannelCell.textContent = paymentChannel;

            console.log('Expense added successfully to the table!');
        } else {
            console.error('Failed to add the expense!');
        }
    });
});
