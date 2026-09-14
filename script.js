/* =========================================================
   SMARTSPEND - SMART EXPENSE MANAGER
========================================================= */


/* ================= DATA ================= */

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [

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


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setDefaultDate();

    setupTypeButtons();

    renderDashboard();

    renderTransactions();

    generateAIInsights();

    setupGlobalSearch();

});


/* =========================================================
   STORAGE
========================================================= */

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const income =
        transactions

            .filter(t => t.type === "income")

            .reduce(
                (sum, t) =>
                    sum + Number(t.amount),
                0
            );


    const expenses =
        transactions

            .filter(t => t.type === "expense")

            .reduce(
                (sum, t) =>
                    sum + Number(t.amount),
                0
            );


    const balance =
        income - expenses;


    const savingsRate =
        income > 0
            ? (balance / income) * 100
            : 0;


    document.getElementById("income")
        .textContent =
        formatCurrency(income);


    document.getElementById("expenses")
        .textContent =
        formatCurrency(expenses);


    document.getElementById("balance")
        .textContent =
        formatCurrency(balance);


    document.getElementById("savingsRate")
        .textContent =
        Math.max(0, savingsRate).toFixed(0) + "%";


    document.getElementById("chartTotal")
        .textContent =
        formatCurrency(expenses);


    updateChart();

    updateBudget();

}


/* =========================================================
   MODAL
========================================================= */

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
    .addEventListener(
        "click",
        function (e) {

            if (e.target === this) {

                closeModal();

            }

        }
    );


/* =========================================================
   DATE
========================================================= */

function setDefaultDate() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    document.getElementById(
        "date"
    ).value = today;

}


/* =========================================================
   TYPE BUTTONS
========================================================= */

function setupTypeButtons() {

    const buttons =
        document.querySelectorAll(
            ".type-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(btn =>
                    btn.classList.remove(
                        "active"
                    )
                );


                button.classList.add(
                    "active"
                );


                const type =
                    button.dataset.type;


                document.getElementById(
                    "transactionType"
                ).value = type;


                updateCategoryForType(type);

            }
        );

    });

}


/* =========================================================
   CATEGORY
========================================================= */

function updateCategoryForType(type) {

    const category =
        document.getElementById(
            "category"
        );


    if (type === "income") {

        category.innerHTML = `

            <option value="Salary">
                Salary
            </option>

            <option value="Freelance">
                Freelance
            </option>

            <option value="Business">
                Business
            </option>

            <option value="Investment">
                Investment
            </option>

            <option value="Other">
                Other
            </option>

        `;

    }

    else {

        category.innerHTML = `

            <option value="Food">
                Food
            </option>

            <option value="Shopping">
                Shopping
            </option>

            <option value="Transport">
                Transport
            </option>

            <option value="Bills">
                Bills
            </option>

            <option value="Entertainment">
                Entertainment
            </option>

            <option value="Health">
                Health
            </option>

            <option value="Other">
                Other
            </option>

        `;

    }

}


/* =========================================================
   ADD TRANSACTION
========================================================= */

document
    .getElementById("transactionForm")
    .addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const description =
                document.getElementById(
                    "description"
                ).value.trim();


            const amount =
                Number(
                    document.getElementById(
                        "amount"
                    ).value
                );


            const category =
                document.getElementById(
                    "category"
                ).value;


            const date =
                document.getElementById(
                    "date"
                ).value;


            const type =
                document.getElementById(
                    "transactionType"
                ).value;


            if (
                !description ||
                amount <= 0 ||
                !date
            ) {

                alert(
                    "Please enter valid transaction details."
                );

                return;

            }


            transactions.unshift({

                id: Date.now(),

                description,

                amount,

                category,

                type,

                date

            });


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
                .forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


            document
                .querySelector(
                    '[data-type="expense"]'
                )
                .classList.add("active");


            updateCategoryForType(
                "expense"
            );


            closeModal();

        }
    );


/* =========================================================
   TRANSACTIONS
========================================================= */

function renderTransactions() {

    const container =
        document.getElementById(
            "transactionsList"
        );


    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase();


    const category =
        document.getElementById(
            "categoryFilter"
        ).value;


    const filtered =
        transactions.filter(
            transaction => {

                const matchesSearch =
                    transaction.description
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "all" ||
                    transaction.category ===
                        category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


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

                                ${getCategoryIcon(
                                    transaction.category
                                )}

                            </div>

                            <div>

                                <div class="transaction-name">

                                    ${escapeHTML(
                                        transaction.description
                                    )}

                                </div>

                                <div class="transaction-date">

                                    ${formatDate(
                                        transaction.date
                                    )}

                                    ·

                                    ${transaction.category}

                                </div>

                            </div>

                        </div>


                        <div class="transaction-amount ${transaction.type}">

                            ${
                                transaction.type ===
                                "expense"
                                    ? "-"
                                    : "+"
                            }

                            ${formatCurrency(
                                transaction.amount
                            )}

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   CATEGORY ICON
========================================================= */

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


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date) {

    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

}


/* =========================================================
   CHART
========================================================= */

function updateChart() {

    const expenses =
        transactions.filter(
            t => t.type === "expense"
        );


    const categories = {};


    expenses.forEach(transaction => {

        categories[
            transaction.category
        ] =
            (
                categories[
                    transaction.category
                ] || 0
            ) +
            Number(transaction.amount);

    });


    const labels =
        Object.keys(categories);


    const values =
        Object.values(categories);


    const colors = [

        "#ff9d2e",

        "#3585ff",

        "#8b5cf6",

        "#ff3d91",

        "#00e5ff",

        "#00e5a0",

        "#7b8cae"

    ];


    const total =
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const categoryList =
        document.getElementById(
            "categoryList"
        );


    categoryList.innerHTML =
        labels.map(
            (label, index) => {

                const percentage =
                    total > 0
                        ? (
                            categories[label] /
                            total *
                            100
                        ).toFixed(0)
                        : 0;


                return `

                    <div class="category-item">

                        <span
                            class="category-dot"
                            style="
                                background:${colors[index % colors.length]};
                                color:${colors[index % colors.length]};
                            "
                        ></span>

                        <span class="category-name">

                            ${label}

                        </span>

                        <span class="category-percent">

                            ${percentage}%

                        </span>

                        <span class="category-value">

                            ${formatCurrency(
                                categories[label]
                            )}

                        </span>

                    </div>

                `;

            }
        ).join("");


    const ctx =
        document
            .getElementById(
                "expenseChart"
            )
            .getContext("2d");


    if (expenseChart) {

        expenseChart.destroy();

    }


    expenseChart =
        new Chart(
            ctx,
            {

                type: "doughnut",

                data: {

                    labels,

                    datasets: [

                        {

                            data: values,

                            backgroundColor:
                                labels.map(
                                    (_, i) =>
                                        colors[
                                            i %
                                            colors.length
                                        ]
                                ),

                            borderColor:
                                "#071329",

                            borderWidth: 5,

                            hoverOffset: 10

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    cutout: "70%",

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    animation: {

                        animateRotate: true,

                        duration: 1000

                    }

                }

            }
        );

}


/* =========================================================
   AI INSIGHTS
========================================================= */

function generateAIInsights() {

    const container =
        document.getElementById(
            "insightsContainer"
        );


    const expenses =
        transactions.filter(
            t => t.type === "expense"
        );


    const income =
        transactions

            .filter(
                t => t.type === "income"
            )

            .reduce(
                (sum, t) =>
                    sum + Number(t.amount),
                0
            );


    const totalExpenses =
        expenses.reduce(
            (sum, t) =>
                sum + Number(t.amount),
            0
        );


    if (!expenses.length) {

        container.innerHTML = `

            <div class="insight success">

                <strong>
                    Great start!
                </strong>

                Add transactions and SmartSpend
                will analyze your spending.

            </div>

        `;

        return;

    }


    const categories = {};


    expenses.forEach(t => {

        categories[t.category] =
            (
                categories[t.category] || 0
            ) +
            Number(t.amount);

    });


    const topCategory =
        Object.entries(categories)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )[0];


    const savings =
        income - totalExpenses;


    const savingsRate =
        income > 0
            ? savings / income * 100
            : 0;


    const insights = [];


    insights.push({

        type: "warning",

        title:
            `${topCategory[0]} is your highest spending category`,

        text:
            `You have spent ${formatCurrency(
                topCategory[1]
            )} on ${topCategory[0]}. Consider setting a limit for this category.`

    });


    if (income > 0) {

        if (savingsRate >= 20) {

            insights.push({

                type: "success",

                title:
                    "Healthy savings rate 🎯",

                text:
                    `You're saving around ${savingsRate.toFixed(
                        0
                    )}% of your income. Keep up the good work!`

            });

        }

        else {

            insights.push({

                type: "warning",

                title:
                    "Your savings could improve",

                text:
                    `Your current savings rate is ${Math.max(
                        0,
                        savingsRate
                    ).toFixed(
                        0
                    )}%. Try reducing unnecessary spending.`

            });

        }

    }


    insights.push({

        type: "success",

        title:
            "Smart spending tip 💡",

        text:
            `Review your ${topCategory[0]} expenses and try to reduce them by 10% next month.`

    });


    container.innerHTML =
        insights
            .map(
                insight => `

                    <div class="insight ${insight.type}">

                        <strong>
                            ${insight.title}
                        </strong>

                        ${insight.text}

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   BUDGET
========================================================= */

function updateBudget() {

    const budget = 30000;


    const expenses =
        transactions

            .filter(
                t => t.type === "expense"
            )

            .reduce(
                (sum, t) =>
                    sum + Number(t.amount),
                0
            );


    const percentage =
        Math.min(
            expenses / budget * 100,
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

            ? `${formatCurrency(
                remaining
            )} remaining from your monthly budget.`

            : `Budget exceeded by ${formatCurrency(
                Math.abs(remaining)
            )}.`;


    updateCategoryBudget(
        "Food",
        "foodBudget"
    );

    updateCategoryBudget(
        "Shopping",
        "shoppingBudget"
    );

    updateCategoryBudget(
        "Transport",
        "transportBudget"
    );

    updateCategoryBudget(
        "Bills",
        "billsBudget"
    );

}


/* =========================================================
   CATEGORY BUDGET
========================================================= */

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
                (sum, t) =>
                    sum + Number(t.amount),
                0
            );


    document.getElementById(
        elementId
    ).textContent =
        formatCurrency(total);

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function setupGlobalSearch() {

    const search =
        document.getElementById(
            "globalSearch"
        );


    search.addEventListener(
        "input",
        () => {

            document.getElementById(
                "searchInput"
            ).value =
                search.value;


            renderTransactions();

        }
    );


    document.addEventListener(
        "keydown",
        e => {

            if (
                (e.ctrlKey || e.metaKey) &&
                e.key.toLowerCase() === "k"
            ) {

                e.preventDefault();

                search.focus();

            }

        }
    );

}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
