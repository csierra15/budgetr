'use strict';

//===== TRANSACTIONS ======

let transactions = [];

function processTransactionData(transactionData) {
    transactions = Object.values(transactionData.transactions);
    return expenses;
}

function getTransactions() {
    return fetch('/transactions')
        .then(data => data.json())
        .then(data => {
            transactions = data;
            return data;
        });
}

function displayTransactions() {
    const newHtml = transactions.map(transaction => {
        let amount = parseFloat(transaction.amount).toFixed(2);
        let date = moment(transaction.date).format('L')
        return `
            <tr class="transaction" data-trans_id="${transaction.id}">` +
                `<td class="change-text description" contenteditable="false">${transaction.description}</td>` + 
                `<td class="change-text amount" contenteditable="false">$${amount}</td>` +
                `<td class="change-text date" contenteditable="false">${date}</td>` +
                `<td class="change-text category">${transaction.category}</td>` +
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
    let amount = $('#amount-input').val().replace("$", "");
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
    $.ajax({
        method: 'POST',
        url: '/transactions',
        contentType: 'application/JSON',
        data: JSON.stringify(newTransaction),
        success: transaction => {
            transactions.push(transaction);
            getAndDisplayTransactions();
            calculateBudget();
        },
        error: (err) => {
            $('#new-trans-section').append(`<p>Couldn't add transaction :(</p>`);
        }
    });
}

function deleteTransaction(trans_id) {
    $.ajax({
        method: 'DELETE',
        url: `/transactions/${trans_id}`,
        success: function() {
            calculateBudget();
        },
        error: err => {
            console.log('err')
        }
    })
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
            $('#new-trans-section input').val('');
            $('#select-category').val('0');
            $('#new-trans-btn').show();
        }
    });
}

function handleTransactionDelete() {
    $('table').on('click', '.remove-trans-btn', e => {
        e.preventDefault();
        let trans_id = $(e.target).closest('.transaction').data('trans_id');
        $(e.target).closest('tr').remove();
        deleteTransaction(trans_id);
    });
}

function calculateBudget() {
    const totalExpenses = transactions.filter(transaction => transaction.category != 'income').map(transaction => transaction.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    }, 0);
    const totalIncome = transactions.filter(transaction => transaction.category === 'income').map(transaction => transaction.amount).reduce((a, b) => {
        return parseFloat(a) + parseFloat(b);
    }, 0);
    let total = totalIncome - totalExpenses;
    let totalBudget = total.toFixed(2);

    $(".budget-data").html("$" + totalBudget);
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
            goals.push(newGoal);
            getAndDisplayGoals();
        },
        error: (err) => {
            console.log(err);
            $('#new-goal-section').append(`<p>Couldn't add goal :(</p>`);
        }
    });
}

function updateGoal(id, goal) {
    $.ajax({
        method: 'PUT',
        url: `/goals/${id}`,
        contentType: 'application/JSON',
        dataType: 'JSON',
        data: JSON.stringify({id: id, goal: goal}),
        success: function() {
            getAndDisplayGoals();
        },
        error: err => {
            console.log(err);
            $('.goals').closest().append(`<p>Couldn't update goal :(</p>`);
        }
    });
}

function deleteGoal(id){
    console.log(`deleting goal ${id}`);
    $.ajax({
        method: 'DELETE',
        url: `/goals/${id}`,
        error: err => {
            console.log(err);
        }
    })
}

function handleNewGoal() {
    $('#submit-goal-btn').on('click', e => {
        e.preventDefault();
        addGoal();
        $('#new-goal-section').hide();
        $('#new-goal-section input[type="text"]').val('');
    })
}

function handleUpdateGoal() {
    $('.goals').on('click', '.update-goal-btn', e => {
        let id = $(e.target).closest('.goals').data('goal_id');
        let goal = $('#goal_' + id).val();
        let edited_goal = goals.find(goal => goal.id == id);
        edited_goal.goal = goal;
        updateGoal(id, goal);
        $('.editable').removeClass('editable');
    });
}
 
function handleDeleteGoal() {
    $('.goals').on('click', '.complete-goal', e => {
        e.preventDefault();
        let id = $(e.target).closest('.goals').data('goal_id');
        deleteGoal(id);
        $(e.target).closest('.goals').remove();
    });
}

$(function() {

    $('.total-budget-section').hide();
    $('.goal-section').hide();
    $('#new-goal-section').hide();
    $('.transaction-section').hide();
    $('#new-trans-section').hide();
    $('#select-cat-message').hide();
    $('#footer').hide();

    $(window).scroll(() => {
        $('#footer').show();
    })

    $('#show-demo-btn').on('click', e => {
        $('.total-budget-section').show();
        $('.goal-section').show();
        $('.transaction-section').show();
        $('#show-demo-btn').hide();
        $('#about-section').hide();

        Promise.all([
            getAndDisplayTransactions()
        ]).then(() => {
            calculateBudget();
        });
        getAndDisplayGoals();
     });

    $('#new-trans-btn').on('click', e => {
        e.preventDefault();
        $('#new-trans-section').show();
        $('#new-trans-btn').hide();
    });

    $('#cancel-trans-btn').on('click', e => {
        $('#new-trans-section').hide();
        $('#new-trans-btn').show();
    });

    $('#new-goal-btn').on('click', e => {
        e.preventDefault();
        $('#new-goal-section').show();
    });

    $('#cancel-goal-btn').on('click', e => {
        $('#new-goal-section').hide();
    });

    $('.goals').on('click', '.edit-goal-btn', e => {
        e.preventDefault();
        $('.editable').removeClass('.editable');
        $(e.target).closest('.goals').addClass('editable');
    });

    $(function() {
        handleNewTransaction();
        handleTransactionDelete();
        handleNewGoal();
        handleUpdateGoal();
        handleDeleteGoal();
    });
});