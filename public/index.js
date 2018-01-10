'use strict';

const MOCK_URL = "http://localhost:8080";

function displayMonth() {
    $(".month").prepend(moment().format('MMMM YYYY'));
}

//==== INCOME ====
/*let income = [];

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

function calcIncome(income) {
    console.log('displayIncome ran');
    const totalIncome = income.map(income => 
        income.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    });

    /*const date = moment().subtract(10, 'days').calendar();
    const incomeTable = income.map(income => {
        return `
            <tr>` + 
                `<td class="item">${income.description}</td>` +
                `<td class="amount">$${income.amount.toFixed(2)}</td>` +
                `<td class="purchaseDate">${date}</td>` +
                `<td class="category">income</td>` +
            `</tr>`
    });
    $(".expense-data").append(incomeTable);
}

function getAndDisplayIncome() {
    return getIncome()
        .then(income => {
            calcIncome(income);
        });
}*/

//===== TRANSACTIONS ======

let transactions = [];

function processTransactionData(transactionData) {
    transactions = Object.values(transactionData.transactions);
    return expenses;
}
// GET /expenses - return list of transactions for current month
// GET /expenses/:date - return list of transactions for selected month

function getTransactions() {
    return fetch(MOCK_URL + "/transactions")
        .then(data => data.json())
        .then(data => {
            transactions = data;
            return data;
        });
}

function displayTransactions() {
    console.log('displayTransactions ran');
    const newHtml = transactions.map(transaction => {
        let amount = parseFloat(transaction.amount).toFixed(2);
        return `
            <tr>` +
                `<td class="description">${transaction.description}</td>` + 
                `<td class="amount">$${amount}</td>` +
                `<td class="purchaseDate">${transaction.date}</td>` +
                `<td class="category">${transaction.category}</td>` +
            `</tr>`
    });

    $(".expense-data tbody").html(newHtml);
}

function getAndDisplayTransactions() {
    return getTransactions()
        .then(transactions => {
            displayTransactions(transactions);
        });
}

function addTransaction() {
    let description = $('#description-input').val();
    let amount = $('#amount-input').val();
    let date = $('#date-input').val();
    let category;

    let categoryInput = $('#select-category').val();
    if(categoryInput === '+'){
        category = 'income';
    }else if (categoryInput === '-'){
        category = 'expense';
    }
    const newTransaction = 
        {description: description,
        amount: amount,
        date: date,
        category: category};
    console.log(newTransaction);
    $.ajax({
        type: 'POST',
        url: MOCK_URL + '/transactions',
        contentType: 'application/JSON',
        data: JSON.stringify(newTransaction),
        success: transaction => {
            console.log(transaction);
            transactions.push(transaction);
            displayTransactions();
            calculateBudget();
        },
        error: (err) => {
            $('#new-trans-section').append(`<p>Couldn't add transaction :(</p>`);
        }
    });
}

//===== GOALS ======
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
            <div class="goals" data-goal_id="${goal.id}">
                <div class="goal-display">
                    <p>${goal.goal}</p>
                    <button class="edit-goal-btn">Edit</button>
                    <button class="complete-goal">Completed</button>
                </div>
                <div class="goal-form">
                    <input type="text" value="${goal.goal}" id="goal_${goal.id}"/>
                    <button type="submit" class="update-goal-btn">Save</button>
                </div>
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

function addGoal() {
    let goal= $('#goal-input').val();

    $.ajax({
        type: 'POST',
        url: MOCK_URL + '/goals',
        contentType: 'application/JSON',
        data: JSON.stringify({goal: goal}),
        success: newGoal => {
            console.log(newGoal);
            goals.push(newGoal);
            displayGoals();
        },
        error: (err) => {
            $('#new-goal-section').append(`<p>Couldn't add goal :(</p>`);
        }
    });
}

function updateGoals() {
    //update server with PUT endpoint
}

function deleteGoal(){

}

// ==== CALCULATE BUDGET (income - expenses) ====

function calculateBudget() {
    const totalExpenses = transactions.filter(transaction => transaction.category != 'income').map(transaction => transaction.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    });

    const totalIncome = transactions.filter(transaction => transaction.category === 'income').map(income => income.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    });

    const total = totalIncome - totalExpenses;

    const totalBudget = total.toFixed(2);

    $(".budget-data").html("$" + totalBudget);
}

$(function() {

    $('#login').hide();
    $('#register').hide();
    $('#new-trans-section').hide();
    $('#new-goal-section').hide();
    $('#select-cat-message').hide();

    $('#login-btn').on('click', e => {
        e.preventDefault();
        $('#login').show();
    });

    $('#register-btn').on('click', e => {
        e.preventDefault();
        $('#register').show();
    });

    $('#new-trans-btn').on('click', e => {
        e.preventDefault();
        $('#new-trans-section').show();
    });

    $('.trans-form').submit( e => {
        if($('#select-category').val() === '0'){
            $('#select-cat-message').show();
            e.preventDefault();
        }else{
            e.preventDefault();
            addTransaction();
            $('#select-cat-message').hide();
            $('#new-trans-section').hide();
        }
    });

    $('#cancel-trans-btn').on('click', e => {
        $('#new-trans-section').hide();
    });

    $('#new-goal-btn').on('click', e => {
        e.preventDefault();
        $('#new-goal-section').show();
    });

    $('#submit-goal-btn').on('click', e => {
        e.preventDefault();
        addGoal();
        $('#new-goal-section').hide();
    })

    $('#cancel-goal-btn').on('click', e => {
        $('#new-goal-section').hide();
    });

    displayMonth()
    Promise.all([
        getAndDisplayTransactions()
    ]).then(() => {
      calculateBudget();
    });
    getAndDisplayGoals();
  
    $('.goals').on('click', '.complete-goal', e => {
        console.log('You completed a goal!');
        e.preventDefault();
        $(e.target).closest('.goals').remove();
    });

    $('.goals').on('click', '.edit-goal-btn', e => {
        console.log('You completed a goal!');
        e.preventDefault();
        $('.editable').removeClass('.editable');
        $(e.target).closest(".goals").addClass('editable');
    });

    $('.goals').on('click', '.update-goal-btn', e => {
        //1. save the goal locally
        let goal_id = $(e.target).closest('.goals').data('goal_id');
        let new_goal = $('#goal_' + goal_id).val();
        //1.5 validate
        console.log(goal_id, new_goal);
        let edited_goal = goals.find(goal => goal.id == goal_id);
        //1.6 make sure that you did find the goal
        edited_goal.goal = new_goal;
        displayGoals();
        //2. send this change to the server
        //3. remove the form
        $('.editable').removeClass('editable');
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
