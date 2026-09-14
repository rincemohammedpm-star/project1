/* =====================================================
   SMART EXPENSE MANAGER
   ===================================================== */


/* ================= DATA ================= */

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [

    {
        id: 1,
        description: "Monthly Salary",
        amount: 45000,
        category: "Salary",
        type: "income",
        date: "2026-09-01"
    },

    {
        id: 2,
        description: "Grocery Shopping",
        amount: 2400,
        category: "Food",
        type: "expense",
        date: "2026-09-03"
    },

    {
        id: 3,
        description: "Netflix Subscription",
        amount: 649,
        category: "Entertainment",
        type: "expense",
        date: "2026-09-05"
    },

    {
        id: 4,
        description: "Uber",
        amount: 350,
        category: "Transport",
        type: "expense",
        date: "2026-09-07"
    },

    {
        id: 5,
        description: "New Shoes",
        amount: 2800,
        category: "Shopping",
        type: "expense",
        date: "2026-09-09"
    },

    {
        id: 6,
        description: "Electricity Bill",
        amount: 1800,
        category: "Bills",
        type: "expense",
        date: "2026-09-10"
    }

];


let expenseChart;


/* ================= INITIALIZATION ================= */

document.addEventListener("DOMContentLoaded", () => {

    setDefaultDate();

    setupTypeButtons();

    renderDashboard();

    renderTransactions();

    generateAIInsights();

});


/* ================= LOCAL STORAGE ================= */

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


/* ================= DASHBOARD ================= */

function renderDashboard() {

    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);


    const expenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);


    const balance = income - expenses;


    const savingsRate =
        income > 0
            ? ((balance / income) * 100)
            : 0;


    document.getElementById("income").textContent =
        formatCurrency(income);

    document.getElementById("expenses").textContent =
        formatCurrency(expenses);

    document.getElementById("balance").textContent =
        formatCurrency(balance);

    document.getElementById("savingsRate").textContent =
        Math.max(0, savingsRate).toFixed(0) + "%";


    updateChart();

    updateBudget();

}


/* ================= CURRENCY ================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);

}


/* ================= MODAL ================= */

function openModal() {

    document
        .getElementById("modal")
        .classList.add("show");

}


function closeModal() {

    document
        .getElementById("modal")
        .classList.remove("show");

}


document
    .getElementById("modal")
    .addEventListener("click", function(e) {

        if (e.target === this) {
            closeModal();
        }

    });


/* ================= DEFAULT DATE ================= */

function setDefaultDate() {

    const dateInput =
        document.getElementById("date");

    const today =
        new Date().toISOString().split("T")[0];

    dateInput.value = today;

}


/* ================= TYPE SWITCH ================= */

function setupTypeButtons() {

    const buttons =
        document.querySelectorAll(".type-btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            const type =
                button.dataset.type;

            document.getElementById(
                "transactionType"
            ).value = type;

            updateCategoryForType(type);

        });

    });

}


function updateCategoryForType(type) {

    const category =
        document.getElementById("category");

    if (type === "income") {

        category.innerHTML = `
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Business">Business</option>
            <option value="Investment">Investment</option>
            <option value="Other">Other</option>
        `;

    } else {

        category.innerHTML = `
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
        `;

    }

}


/* ================= ADD TRANSACTION ================= */

document
    .getElementById("transactionForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();


        const description =
            document.getElementById("description").value.trim();


        const amount =
            Number(document.getElementById("amount").value);


        const category =
            document.getElementById("category").value;


        const date =
            document.getElementById("date").value;


        const type =
            document.getElementById("transactionType").value;


        if (!description || amount <= 0 || !date) {

            alert("Please enter valid transaction details.");

            return;

        }


        const newTransaction = {

            id: Date.now(),

            description,

            amount,

            category,

            type,

            date

        };


        transactions.unshift(newTransaction);


        saveTransactions();


        renderDashboard();

        renderTransactions();

        generateAIInsights();


        this.reset();

        setDefaultDate();


        document.getElementById(
            "transactionType"
        ).value = "expense";


        document
            .querySelectorAll(".type-btn")
            .forEach(btn => btn.classList.remove("active"));


        document
            .querySelector('[data-type="expense"]')
            .classList.add("active");


        updateCategoryForType("expense");


        closeModal();

    });


/* ================= TRANSACTIONS ================= */

function renderTransactions() {

    const container =
        document.getElementById("transactionsList");


    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const category =
        document
            .getElementById("categoryFilter")
            .value;


    const filtered =
        transactions.filter(transaction => {

            const matchesSearch =
                transaction.description
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "all" ||
                transaction.category === category;


            return matchesSearch && matchesCategory;

        });


    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="insight">
                No transactions found.
            </div>
        `;

        return;

    }


    container.innerHTML =
        filtered
            .slice(0, 10)
            .map(transaction => {

                return `

                <div class="transaction">

                    <div class="transaction-left">

                        <div class="transaction-icon">
                            ${getCategoryIcon(transaction.category)}
                        </div>

                        <div>

                            <div class="transaction-name">
                                ${escapeHTML(transaction.description)}
                            </div>

                            <div class="transaction-date">
                                ${formatDate(transaction.date)}
                                · ${transaction.category}
                            </div>

                        </div>

                    </div>


                    <div
                        class="transaction-amount ${transaction.type}"
                    >
                        ${transaction.type === "expense" ? "-" : "+"}
                        ${formatCurrency(transaction.amount)}
                    </div>

                </div>

                `;

            })
            .join("");

}


/* ================= CATEGORY ICON ================= */

function getCategoryIcon(category) {

    const icons = {

        Food: "🍔",

        Shopping: "🛍️",

        Transport: "🚗",

        Bills: "💡",

        Entertainment: "🎬",

        Health: "❤️",

        Salary: "💰",

        Freelance: "💻",

        Business: "🏢",

        Investment: "📈",

        Other: "📌"

    };


    return icons[category] || "📌";

}


/* ================= DATE ================= */

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* ================= CHART ================= */

function updateChart() {

    const expenses =
        transactions.filter(
            t => t.type === "expense"
        );


    const categories = {};


    expenses.forEach(transaction => {

        if (!categories[transaction.category]) {

            categories[transaction.category] = 0;

        }

        categories[transaction.category] +=
            Number(transaction.amount);

    });


    const labels =
        Object.keys(categories);


    const values =
        Object.values(categories);


    const ctx =
        document
            .getElementById("expenseChart")
            .getContext("2d");


    if (expenseChart) {

        expenseChart.destroy();

    }


    expenseChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [

                {
                    data: values,

                    borderWidth: 0
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "68%",

            plugins: {

                legend: {

                    position: "right",

                    labels: {

                        boxWidth: 12,

                        padding: 15,

                        font: {
                            size: 11
                        }

                    }

                }

            }

        }

    });

}


/* ================= AI INSIGHTS ================= */

function generateAIInsights() {

    const container =
        document.getElementById("insightsContainer");


    const expenses =
        transactions.filter(
            t => t.type === "expense"
        );


    const income =
        transactions
            .filter(t => t.type === "income")
            .reduce(
                (sum, t) => sum + Number(t.amount),
                0
            );


    const totalExpenses =
        expenses.reduce(
            (sum, t) => sum + Number(t.amount),
            0
        );


    if (expenses.length === 0) {

        container.innerHTML = `
            <div class="insight success">

                <strong>Great start!</strong>

                No expenses have been recorded yet.
                Add some transactions to receive personalized insights.

            </div>
        `;

        return;

    }


    /* CATEGORY ANALYSIS */

    const categories = {};


    expenses.forEach(t => {

        categories[t.category] =
            (categories[t.category] || 0) +
            Number(t.amount);

    });


    const topCategory =
        Object.entries(categories)
            .sort((a, b) => b[1] - a[1])[0];


    const savings =
        income - totalExpenses;


    let insights = [];


    /* Top spending */

    insights.push({

        type: "warning",

        title: "Highest spending category",

        text:
            `${topCategory[0]} is your biggest expense category at ${formatCurrency(topCategory[1])}. Consider setting a monthly limit for this category.`

    });


    /* Savings */

    if (income > 0) {

        const savingsRate =
            (savings / income) * 100;


        if (savingsRate >= 20) {

            insights.push({

                type: "success",

                title: "Healthy savings rate",

                text:
                    `You're currently saving around ${savingsRate.toFixed(0)}% of your income. That's a strong financial habit.`

            });

        } else {

            insights.push({

                type: "warning",

                title: "Increase your savings",

                text:
                    `Your current savings rate is ${Math.max(0, savingsRate).toFixed(0)}%. Try reducing unnecessary expenses and aim for at least 20%.`

            });

        }

    }


    /* Expense analysis */

    if (totalExpenses > 10000) {

        insights.push({

            type: "warning",

            title: "Spending alert",

            text:
                `You've spent ${formatCurrency(totalExpenses)} so far. Review your recent transactions to identify expenses you can reduce.`

        });

    } else {

        insights.push({

            type: "success",

            title: "Spending looks controlled",

            text:
                `Your recorded expenses are currently ${formatCurrency(totalExpenses)}. Keep monitoring your spending consistently.`

        });

    }


    container.innerHTML =
        insights
            .map(insight => `

                <div class="insight ${insight.type}">

                    <strong>
                        ${insight.title}
                    </strong>

                    ${insight.text}

                </div>

            `)
            .join("");

}


/* ================= BUDGET ================= */

function updateBudget() {

    const budget = 30000;


    const expenses =
        transactions
            .filter(t => t.type === "expense")
            .reduce(
                (sum, t) => sum + Number(t.amount),
                0
            );


    const percentage =
        Math.min(
            (expenses / budget) * 100,
            100
        );


    document.getElementById(
        "budgetSpent"
    ).textContent =
        formatCurrency(expenses);


    document.getElementById(
        "budgetPercent"
    ).textContent =
        percentage.toFixed(0) + "%";


    document.getElementById(
        "budgetProgress"
    ).style.width =
        percentage + "%";


    const remaining =
        budget - expenses;


    document.getElementById(
        "budgetMessage"
    ).textContent =
        remaining >= 0
            ? `${formatCurrency(remaining)} remaining from your monthly budget.`
            : `You have exceeded your monthly budget by ${formatCurrency(Math.abs(remaining))}.`;


    updateCategoryBudget("Food", "foodBudget");

    updateCategoryBudget("Shopping", "shoppingBudget");

    updateCategoryBudget("Transport", "transportBudget");

    updateCategoryBudget("Bills", "billsBudget");

}


function updateCategoryBudget(
    category,
    elementId
) {

    const total =
        transactions
            .filter(
                t =>
                    t.type === "expense" &&
                    t.category === category
            )
            .reduce(
                (sum, t) => sum + Number(t.amount),
                0
            );


    document.getElementById(
        elementId
    ).textContent =
        formatCurrency(total);

}


/* ================= SECURITY ================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
