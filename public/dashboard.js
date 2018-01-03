'use strict';

const MOCK_URL = "https://0407737f-0ddb-4a66-9b90-2e659c4a31ce.mock.pstmn.io";

function displayMonth() {
    let d = new Date();
    let month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    let n = month[d.getMonth()];

    $(".month").html(n + " Budget");
}

//==== INCOME ====
let income = [];

function processIncomeData(incomeData) {
    income = Object.values(incomeData.income);
    return income;
}

function getIncome() {
    return fetch(MOCK_URL + "/income")
        .then(data => data.json())
        .then(data => {
            income = data;
            return data;
        });
}

function displayIncome(income) {
    console.log('displayIncome ran');
    const totalIncome = income.map(income => 
        income.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    });

    $(".incomeData").append(`<p>$${totalIncome}</p>`);
}

function getAndDisplayIncome() {
    return getIncome()
        .then(income => {
            displayIncome(income);
        });
}

//===== EXPENSES ======

let expenses = [];

function processExpenseData(expenseData) {
    expenses = Object.values(expenseData.expenses);
    return expenses;
}

function getExpenses() {
    return fetch(MOCK_URL + "/expenses")
        .then(data => data.json())
        .then(data => {
            expenses = data;
            return data;
        });
}

function displayExpenses() {
    console.log('displayExpenses ran');
    const newHtml = expenses.map(expense => {
        return 
            `<tr>` +
                `<td id="item">${expense.item}</td>` + 
                `<td id="cost">$${expense.cost.toFixed(2)}</td>` +
                `<td id="quantity">${expense.quantity}</td>` +
                `<td id="purchaseDate">${expense.purchaseDate}</td>` +
                `<td id="category">${expense.category}</td>` +
            `</tr>`
    });

    $(".expenseData").append(newHtml);
}

function getAndDisplayExpenses() {
    return getExpenses()
        .then(expenses => {
            displayExpenses(expenses);
        });
}

//==== GOALS ======
let goals = [];

function processGoalData(goalData) {
    goals = Object.values(goalData.goals);
    return goals;
}

function getGoals() {
    return fetch(MOCK_URL + "/goals")
        .then(data => data.json())
        .then(data => {
            goals = data;
            return data;
        });
}

function displayGoals() {
    console.log('displayGoals ran');
    const newHtml = goals.map(goal => {
        return `
            <div id="goal">
                <p>${goal.goal}</p>
                <button id="editGoal">Edit</button>
                <button id="completeGoal">Completed</button>
            </div>`
    });

    $(".goals").html(newHtml);
}

function getAndDisplayGoals() {
    return getGoals()
        .then(goals => {
            displayGoals(goals);
        });
}

// ==== CALCULATE BUDGET (income - expenses) ====

function calculateBudget() {
    const totalExpenses = expenses.map(expense => expense.cost).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    });

    const totalIncome = income.map(income => income.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    });

    const total = totalIncome - totalExpenses;

    const totalBudget = total.toFixed(2);

    $(".budgetData").html("$" + totalBudget);
}

$(function() {
    displayMonth()
    Promise.all([
        getAndDisplayIncome(),
        getAndDisplayExpenses()
    ]).then(() => {
      calculateBudget();
    });
    getAndDisplayGoals();
    
    $('body').on('click', '#editGoal', (e) => {
        console.log('You clicked edit');
    });

    $('body').on('click', '#completeGoal', (e) => {
        console.log('You completed a goal!');
        e.preventDefault();
        $('#goal').remove();
    });
});

/*

==charts to be added later==

const DOUGHNUT_CHART = $("#displayData");
const LINE_CHART = ("#spendingOverTime");

let lineChart = new Chart(LINE_CHART, {
    type: 'line',
    data: data,
    options: options
});

let doughnutChart = new Chart(DOUGHNUT_CHART, {
    type: 'doughnut',
    data: {
        labels: ['Food', 'Entertainment', 'Emergency', 'Bills', 'Personal Care'],
        datasets: [{
            label: 'Money Spent',
            backgroundColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'],
            data: purchases
        }]

    },
    //options: {
      //  animation: {
        //    animateScale: true
        //}
    //}
});

*/
