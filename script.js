let transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];


let moneyChart;

let trendChart;


/* ELEMENTS */

const button =
    document.querySelector("#addButton");

const resetButton =
    document.querySelector("#resetButton");

const nameInput =
    document.querySelector("#nameInput");

const amountInput =
    document.querySelector("#amountInput");

const typeInput =
    document.querySelector("#typeInput");

const categoryInput =
    document.querySelector("#category");

const dateInput =
    document.querySelector("#dateInput");

const monthInput =
    document.querySelector("#monthInput");

const balanceDisplay =
    document.querySelector("#balance");

const incomeDisplay =
    document.querySelector("#income");

const expensesDisplay =
    document.querySelector("#expenses");

const transactionList =
    document.querySelector("#transactionList");

const categoryList =
    document.querySelector("#categoryList");

const searchInput =
    document.querySelector("#searchInput");



/* TODAY */

const today =
    new Date()
        .toISOString()
        .split("T")[0];


dateInput.value =
    today;


/* CURRENT MONTH */

monthInput.value =
    today.substring(0, 7);



/* SAVE */

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}



/* FORMAT MONEY */

function formatMoney(amount) {

    return Number(amount)
        .toLocaleString("en-IN");

}



/* UPDATE DISPLAY */

function updateDisplay() {

    let balance = 0;

    let income = 0;

    let expenses = 0;

    let categoryTotals = {};


    transactionList.innerHTML = "";


    const selectedMonth =
        monthInput.value;



    /* MONTH FILTER */

    const monthlyTransactions =
        transactions.filter(
            function (transaction) {

                if (!transaction.date) {

                    return true;

                }

                return transaction.date
                    .startsWith(selectedMonth);

            }
        );



    /* CALCULATE */

    monthlyTransactions.forEach(
        function (transaction) {

            const amount =
                Number(transaction.amount);


            if (
                transaction.type === "Income"
            ) {

                income += amount;

                balance += amount;

            }

            else {

                expenses += amount;

                balance -= amount;


                const category =
                    transaction.category ||
                    "Other";


                if (
                    categoryTotals[category]
                ) {

                    categoryTotals[category]
                        += amount;

                }

                else {

                    categoryTotals[category]
                        = amount;

                }

            }

        }
    );



    /* SEARCH */

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredTransactions =
        monthlyTransactions.filter(
            function (transaction) {

                return (

                    transaction.name
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    transaction.type
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    (
                        transaction.category ||
                        "Other"
                    )
                        .toLowerCase()
                        .includes(searchText)

                );

            }
        );



    /* HISTORY */

    if (
        filteredTransactions.length === 0
    ) {

        transactionList.innerHTML =
            "<p>No matching transactions.</p>";

    }

    else {

        filteredTransactions.forEach(
            function (transaction) {

                const originalIndex =
                    transactions.indexOf(
                        transaction
                    );


                const element =
                    document.createElement("div");


                const formattedDate =
                    transaction.date ||
                    "No date";


                element.innerHTML = `

                    <div class="${
                        transaction.completed
                            ? "completed"
                            : ""
                    }">

                        <span class="${
                            transaction.type === "Income"
                                ? "income"
                                : "expense"
                        }">

                            ${
                                transaction.name
                            }

                            —

                            ₹${
                                formatMoney(
                                    transaction.amount
                                )
                            }

                            —

                            ${
                                transaction.type
                            }

                            —

                            ${
                                transaction.category ||
                                "Other"
                            }

                        </span>


                        <span class="transaction-date">

                            📅 ${formattedDate}

                        </span>

                    </div>


                    <div>

                        <button class="edit-btn">
                            ✏️
                        </button>


                        <button class="complete-btn">

                            ${
                                transaction.completed
                                    ? "☑️"
                                    : "✅"
                            }

                        </button>


                        <button class="delete-btn">
                            🗑️
                        </button>

                    </div>

                `;


                transactionList.appendChild(
                    element
                );



                /* EDIT */

                element
                    .querySelector(".edit-btn")
                    .addEventListener(
                        "click",
                        function () {

                            const newName =
                                prompt(
                                    "Enter new transaction name:",
                                    transaction.name
                                );


                            if (
                                newName === null ||
                                newName.trim() === ""
                            ) {

                                return;

                            }


                            const newAmount =
                                prompt(
                                    "Enter new amount:",
                                    transaction.amount
                                );


                            if (
                                newAmount === null
                            ) {

                                return;

                            }


                            const amount =
                                Number(newAmount);


                            if (
                                !Number.isFinite(amount) ||
                                amount <= 0
                            ) {

                                alert(
                                    "Please enter a valid amount."
                                );

                                return;

                            }


                            transaction.name =
                                newName.trim();


                            transaction.amount =
                                amount;


                            saveTransactions();

                            updateDisplay();

                        }
                    );



                /* COMPLETE */

                element
                    .querySelector(".complete-btn")
                    .addEventListener(
                        "click",
                        function () {

                            transaction.completed =
                                !transaction.completed;


                            saveTransactions();

                            updateDisplay();

                        }
                    );



                /* DELETE */

                element
                    .querySelector(".delete-btn")
                    .addEventListener(
                        "click",
                        function () {

                            const confirmDelete =
                                confirm(
                                    "Delete this transaction?"
                                );


                            if (
                                !confirmDelete
                            ) {

                                return;

                            }


                            transactions.splice(
                                originalIndex,
                                1
                            );


                            saveTransactions();

                            updateDisplay();

                        }
                    );

            }
        );

    }



    /* CATEGORY */

    categoryList.innerHTML = "";


    const categories =
        Object.keys(categoryTotals);


    if (
        categories.length === 0
    ) {

        categoryList.innerHTML =
            "<p>No expenses yet.</p>";

    }

    else {

        categories.forEach(
            function (category) {

                const element =
                    document.createElement("div");


                const percentage =
                    (
                        categoryTotals[category] /
                        expenses
                    ) * 100;


                element.innerHTML = `

                    <div class="category-name">

                        <span>
                            ${category}
                        </span>

                        <span>
                            ₹${
                                formatMoney(
                                    categoryTotals[category]
                                )
                            }
                        </span>

                    </div>


                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width:${percentage}%"
                        >
                        </div>

                    </div>

                `;


                categoryList.appendChild(
                    element
                );

            }
        );

    }



    /* MAIN CHART */

    updateMoneyChart(
        income,
        expenses
    );


    /* TREND CHART */

    updateTrendChart();



    /* SUMMARY */

    balanceDisplay.textContent =
        "₹" + formatMoney(balance);


    incomeDisplay.textContent =
        "₹" + formatMoney(income);


    expensesDisplay.textContent =
        "₹" + formatMoney(expenses);

}



/* MONEY CHART */

function updateMoneyChart(
    income,
    expenses
) {

    const canvas =
        document.querySelector(
            "#moneyChart"
        );


    if (moneyChart) {

        moneyChart.destroy();

    }


    moneyChart =
        new Chart(
            canvas,
            {

                type: "doughnut",


                data: {

                    labels: [
                        "Income",
                        "Expenses"
                    ],


                    datasets: [

                        {

                            data: [
                                income,
                                expenses
                            ],

                            backgroundColor: [
                                "#22c55e",
                                "#ef4444"
                            ],

                            borderWidth: 0

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                color: "white"

                            }

                        }

                    }

                }

            }
        );

}



/* MONTHLY TREND */

function updateTrendChart() {

    const monthlyExpenses = {};


    transactions.forEach(
        function (transaction) {

            if (
                transaction.type !== "Expense"
            ) {

                return;

            }


            if (!transaction.date) {

                return;

            }


            const month =
                transaction.date.substring(
                    0,
                    7
                );


            if (
                monthlyExpenses[month]
            ) {

                monthlyExpenses[month]
                    += Number(
                        transaction.amount
                    );

            }

            else {

                monthlyExpenses[month] =
                    Number(
                        transaction.amount
                    );

            }

        }
    );


    const months =
        Object.keys(monthlyExpenses)
            .sort();


    const values =
        months.map(
            function (month) {

                return monthlyExpenses[
                    month
                ];

            }
        );


    const labels =
        months.map(
            function (month) {

                const parts =
                    month.split("-");


                return (
                    parts[1] +
                    "/" +
                    parts[0]
                );

            }
        );



    const canvas =
        document.querySelector(
            "#trendChart"
        );


    if (trendChart) {

        trendChart.destroy();

    }


    trendChart =
        new Chart(
            canvas,
            {

                type: "line",


                data: {

                    labels: labels,


                    datasets: [

                        {

                            label:
                                "Monthly Expenses",

                            data:
                                values,

                            tension:
                                0.3,

                            fill:
                                false,

                            borderWidth:
                                3,

                            pointRadius:
                                5

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,


                    scales: {

                        x: {

                            ticks: {

                                color:
                                    "white"

                            }

                        },


                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                color:
                                    "white",

                                callback:
                                    function (
                                        value
                                    ) {

                                        return "₹" +
                                            formatMoney(
                                                value
                                            );

                                    }

                            }

                        }

                    },


                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    "white"

                            }

                        }

                    }

                }

            }
        );

}



/* ADD TRANSACTION */

button.addEventListener(
    "click",
    function () {

        const name =
            nameInput.value.trim();


        const amount =
            Number(
                amountInput.value
            );


        const type =
            typeInput.value;


        const category =
            categoryInput.value;


        const date =
            dateInput.value;



        if (
            name === ""
        ) {

            alert(
                "Please enter a transaction name."
            );

            return;

        }


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            alert(
                "Please enter a valid amount."
            );

            return;

        }


        if (
            date === ""
        ) {

            alert(
                "Please select a date."
            );

            return;

        }



        transactions.push({

            name:
                name,

            amount:
                amount,

            type:
                type,

            category:
                category,

            date:
                date,

            completed:
                false

        });



        saveTransactions();



        nameInput.value =
            "";

        amountInput.value =
            "";


        updateDisplay();

    }
);



/* SEARCH */

searchInput.addEventListener(
    "input",
    function () {

        updateDisplay();

    }
);



/* MONTH CHANGE */

monthInput.addEventListener(
    "change",
    function () {

        updateDisplay();

    }
);



/* RESET ALL DATA */

resetButton.addEventListener(
    "click",
    function () {

        if (
            transactions.length === 0
        ) {

            alert(
                "There is no data to delete."
            );

            return;

        }


        const confirmation =
            confirm(
                "⚠️ Are you sure you want to delete ALL transactions?\n\nThis cannot be undone."
            );


        if (
            !confirmation
        ) {

            return;

        }


        transactions = [];


        localStorage.removeItem(
            "transactions"
        );


        updateDisplay();


        alert(
            "All transaction data has been cleared."
        );

    }
);



/* LOAD */

updateDisplay();