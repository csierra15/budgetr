'use strict';

let MOCK_PURCHASES = {
    "purchases": [
        {
            id: "11111",
            item: "Eggs",
            quantity: "1 dozen",
            cost: "$2.50",
            purchaseDate: "11/27/17",
            expected: "2 weeks (12/11/17)",
            actual: "12/08/17",
            category: "food"   
        },
        {
            id: "22222",
            item: "Milk",
            quantity: "1 gallon",
            cost: "$3.50",
            purchaseDate: "11/27/17",
            expected: "2 weeks (12/11/17)",
            actual: "12/08/17",
            category: "food"   
        },
        {
            id: "33333",
            item: "Paper Towels",
            quantity: "12 rolls",
            cost: "$14.75",
            purchaseDate: "11/27/17",
            expected: "2 months (1/27/18)",
            actual: "TBD",
            category: "home"
        },
        {
            id: "44444",
            item: "Heavy Cream",
            quantity: "1 quart",
            cost: "$3.50",
            purchaseDate: "11/27/17",
            expected: "2 weeks (12/11/17)",
            actual: "12/08/17",
            category: "food" 
        },
        {
            id: "55555",
            item: "TV",
            quantity: "1",
            cost: "$479",
            purchaseDate: "12/20/17",
            expected: "n/a",
            actual: "n/a",
            category: "electronics" 
        }
    ]
};

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

let purchases = [];

//===== PURCHASES ======

function processPurchaseData(purchaseData, callback) {
    purchases = Object.values(purchaseData.purchases);
    callback();
}

function getPurchases(callbackFn) {
    setTimeout(function(){processPurchaseData(MOCK_PURCHASES, callbackFn)}, 100);
}

function displayPurchases() {
    console.log('displayPurchases ran');
    const options = purchases.map(purchase => {
        return `<h3 class="item">${purchase.item}</h3>` + 
        `<p class="cost">${purchase.cost}</p>` +
        `<p class="quantity">${purchase.quantity}</p>` +
        `<p class="purchaseDate">${purchase.purchaseDate}</p>` +
        `<p class="category">${purchase.category}</p>`
    });

    $(".purchaseData").html(options);
}

function getAndDisplayPurchases() {
    getPurchases(displayPurchases);
}

//==== GOAL ======
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
    const options = goals.map(goal => {
        return `<p>${goal.goal}</p>`
    });

    $(".goals").html(options);
}

function getAndDisplayGoals() {
    getGoals(displayGoals);
}

$(function() {
    getAndDisplayPurchases();
    getAndDisplayGoals();
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
