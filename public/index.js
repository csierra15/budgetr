'use strict';

function displayMonth() {
    $(".month").prepend(moment().format('MMMM YYYY'));
}

//===== TRANSACTIONS ======

let transactions = [];

function processTransactionData(transactionData) {
    transactions = Object.values(transactionData.transactions);
    return expenses;
}

// GET /expenses/:date - return list of transactions for selected month

function getTransactions() {
    return fetch('/transactions')
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
        let date = moment(transaction.date).format('L')
        return `
            <tr class="transaction" data-trans_id="${transaction.id}">` +
                `<td class="description" contenteditable="true">${transaction.description}</td>` + 
                `<td class="amount" contenteditable="true">$${amount}</td>` +
                `<td class="purchaseDate" contenteditable="true">${date}</td>` +
                `<td class="category" contenteditable="true">${transaction.category}</td>` +
                `<td class="remove-tr"><button class="remove-trans-btn">x</button></td>` +
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
        method: 'POST',
        url: '/transactions',
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

function updateTransaction(trans_id) {
    $.ajax({
        method: 'PUT',
        url: '/transactions/${trans_id}',
        contentType: 'application/JSON',
        data: '',
        success: function() {
            displayTransactions();
        },
        error: err => {
            console.log(err);
        }
    });
}

function deleteTransaction(trans_id) {
    $.ajax({
        method: 'DELETE',
        url: '/transactions/${trans_id}',
        data: '${trans_id}',
        success: console.log('Transaction ${trans_id} successfully deleted'),
        error: err => {
            console.log('err')
        }
    })
}

//===== GOALS ======
let goals = [];

function processGoalData(goalData) {
    goals = Object.values(goalData.goals);
    return goals;
}

function getGoals() {
    return fetch('/goals')
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
                <div class="edit-goal-form">
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
    let goal = $('#goal-input').val();

    $.ajax({
        method: 'POST',
        url: '/goals',
        contentType: 'application/JSON',
        data: JSON.stringify({goal: goal}),
        success: newGoal => {
            console.log(newGoal);
            goals.push(newGoal);
            displayGoals();
        },
        error: (err) => {
            console.log(err);
            $('#new-goal-section').append(`<p>Couldn't add goal :(</p>`);
        }
    });
}

function updateGoal(new_goal, goal_id) {
    console.log('Updating goal');
    $.ajax({
        method: 'PUT',
        url: '/goals/${goal_id}',
        success: function() {
            displayGoals();
        },
        error: err => {
            console.log(err);
            $('.goals').closest().append(`<p>Couldn't update goal :(</p>`);
        }
    })
}

function deleteGoal(goal_id){
    console.log('deleting goal ${goal_id}');
    $.ajax({
        method: 'DELETE',
        url: '/goals/${goal_id}',
        success: function() {
            displayGoals();
        },
        error: err => {
            console.log(err);
        }
    })
}

// ==== CALCULATE BUDGET (income - expenses) ====

function calculateBudget() {
    const totalExpenses = transactions.filter(transaction => transaction.category != 'income').map(transaction => transaction.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    });
    const totalIncome = transactions.filter(transaction => transaction.category === 'income').map(transaction => transaction.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    });
    let total = totalIncome - totalExpenses;
    let totalBudget = total.toFixed(2);

    $(".budget-data").html("$" + totalBudget);
}

function handleNewTransaction() {
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
}

function handleTransactionUpdate() {

}

function handleTransactionDelete() {
    $('table').on('click', '.remove-trans-btn', e => {
        e.preventDefault();
        let trans_id = $(e.target).closest('.transaction').data('trans_id');
        console.log('You clicked delete transaction');
        $(e.target).closest('tr').remove();
        deleteTransaction(trans_id);
    });
}

function handleNewGoal() {
    $('#submit-goal-btn').on('click', e => {
        e.preventDefault();
        addGoal();
        $('#new-goal-section').hide();
    })
}

function handleUpdateGoal() {
    $('.goals').on('click', '.update-goal-btn', e => {
        //1. save the goal locally
        let goal_id = $(e.target).closest('.goals').data('goal_id');
        let new_goal = $('#goal_' + goal_id).val();
        console.log(goal_id, new_goal);
        let edited_goal = goals.find(goal => goal.id == goal_id);
        console.log(edited_goal);
        edited_goal.goal = new_goal;
        addGoal(new_goal, goal_id);
        $('.editable').removeClass('editable');
    });
}
 
function handleDeleteGoal() {
    $('.goals').on('click', '.complete-goal', e => {
        console.log('You completed a goal!');
        e.preventDefault();
        let goal_id = $(e.target).closest('.goals').data('goal_id');
        deleteGoal(goal_id);
        $(e.target).closest('.goals').detach();
    });
}

$(function() {

    let loggedIn;

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

    $('#cancel-trans-btn').on('click', e => {
        $('#new-trans-section').hide();
    });

    $('#new-goal-btn').on('click', e => {
        e.preventDefault();
        $('#new-goal-section').show();
    });

    $('#cancel-goal-btn').on('click', e => {
        $('#new-goal-section').hide();
    });

    if(loggedIn === true) {
        displayMonth()
        Promise.all([
            getAndDisplayTransactions()
        ]).then(() => {
        calculateBudget();
        });
        getAndDisplayGoals();
    }

    $('.goals').on('click', '.edit-goal-btn', e => {
        e.preventDefault();
        $('.editable').removeClass('.editable');
        $(e.target).closest('.goals').addClass('editable');
    });

    $(function() {
        handleNewTransaction();
        handleTransactionUpdate();
        handleTransactionDelete();
        handleNewGoal();
        handleUpdateGoal();
        handleDeleteGoal();
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
*/
