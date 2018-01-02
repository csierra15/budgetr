'use strict';

let MOCK_EXPENSES = {
    "expenses": [
        {
            id: "11111",
            item: "Eggs",
            quantity: "1 dozen",
            cost: 2.50,
            purchaseDate: "11/27/17",
            expected: "2 weeks (12/11/17)",
            actual: "12/08/17",
            category: "food" 
        },
        {
            id: "22222",
            item: "Milk",
            quantity: "1 gallon",
            cost: 3.50,
            purchaseDate: "11/27/17",
            expected: "2 weeks (12/11/17)",
            actual: "12/08/17",
            category: "food"   
        },
        {
            id: "33333",
            item: "Paper Towels",
            quantity: "12 rolls",
            cost: 14.75,
            purchaseDate: "11/27/17",
            expected: "2 months (1/27/18)",
            actual: "TBD",
            category: "home"
        },
        {
            id: "44444",
            item: "Heavy Cream",
            quantity: "1 quart",
            cost: 3.50,
            purchaseDate: "11/27/17",
            expected: "2 weeks (12/11/17)",
            actual: "12/08/17",
            category: "food" 
        },
        {
            id: "55555",
            item: "TV",
            quantity: "1",
            cost: 479,
            purchaseDate: "12/20/17",
            expected: "n/a",
            actual: "n/a",
            category: "electronics" 
        }
    ]
};

let MOCK_INCOME = {
    "income": [
        {
            id: "111",
            description: "payday",
            amount: 248.65
        },
        {
            id: "222",
            description: "Christmas Check",
            amount: 100
        },
        {
            id: "333",
            description: "payday",
            amount: 268.76
        }
    ]
}

let MOCK_GOALS = {
    "goals": [
        {
            id: "1111",
            goal: "Spend less than $500 this month on food"
        },
        {
            id: "2222",
            goal: "Only buy paper towels once this month"
        },
        {
            id: "3333",
            goal: "Meet 50% of purchase predictions"
        }
    ]
};

//==== INCOME ====
let income = [];

function processIncomeData(incomeData, callback) {
    income = Object.values(incomeData.income);
    callback();
}

function getIncome(callbackFn) {
    setTimeout(function(){processIncomeData(MOCK_INCOME, callbackFn)}, 100);
}

function displayIncome() {
    console.log('displayIncome ran');
    const totalIncome = income.map(income => income.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    });

    $(".incomeData").append(`<p>${totalIncome}</p>`);
}

function getAndDisplayIncome() {
    getIncome(displayIncome);
}


//===== EXPENSES ======

let expenses = [];

function processExpenseData(expenseData, callback) {
    expenses = Object.values(expenseData.expenses);
    callback();
}

function getExpenses(callbackFn) {
    setTimeout(function(){processExpenseData(MOCK_EXPENSES, callbackFn)}, 100);
}

function displayExpenses() {
    console.log('displayExpenses ran');
    const newHtml = expenses.map(expense => {
        return `<h3 class="item">${expense.item}</h3>` + 
        `<p class="cost">${expense.cost}</p>` +
        `<p class="quantity">${expense.quantity}</p>` +
        `<p class="purchaseDate">${expense.purchaseDate}</p>` +
        `<p class="category">${expense.category}</p>`
    });

    $(".expenseData").html(newHtml);
}

function getAndDisplayExpenses() {
    getExpenses(displayExpenses);
}

//==== GOALS ======
let goals = [];

function processGoalData(goalData, callback) {
    goals = Object.values(goalData.goals);
    callback();
}

function getGoals(callbackFn) {
    setTimeout(function(){processGoalData(MOCK_GOALS, callbackFn)}, 100);
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
    getGoals(displayGoals);
}

// ==== CALCULATE BUDGET (income - expenses) ====

function calculateBudget() {
    const totalExpenses = expense.map(expense => expense.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    });

    const totalIncome = income.map(income => income.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    });

    const totalBudget = totalIncome - totalExpenses;

    $(".budgetData").html(totalBudget);
}

$(function() {
    getAndDisplayIncome();
    getAndDisplayExpenses();
    getAndDisplayGoals();
    calculateBudget();
    
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
