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
            actual: "12/08/17"   
        },
        {
            id: "22222",
            item: "Milk",
            quantity: "1 gallon",
            cost: "$3.50",
            purchaseDate: "11/27/17",
            expected: "2 weeks (12/11/17)",
            actual: "12/08/17"   
        },
        {
            id: "33333",
            item: "Paper Towels",
            quantity: "12 rolls",
            cost: "$14.75",
            purchaseDate: "11/27/17",
            expected: "2 months (1/27/18)",
            actual: "TBD"   
        },
        {
            id: "44444",
            item: "Heavy Cream",
            quantity: "1 quart",
            cost: "$3.50",
            purchaseDate: "11/27/17",
            expected: "2 weeks (12/11/17)",
            actual: "12/08/17"   
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

import Chart from 'chart.js';
var myChart = new Chart(ctx, {...});

let purchases = [];
let goals = [];

function processPurchaseData(purchaseData, callback) {
    purchases = Object.values(purchaseData.purchases);
    callback();
}

function getPurchases(callbackFn) {
    setTimeout(function(){processPurchaseData(MOCK_PURCHASES, callbackFn)}, 100);
}

function displayPurchases(data) {
    console.log('displayPurchases ran');
    const tableData = purchases.map(purchase => {`
        <tr>
            <td class="item-data">${purchase.item}</td>
            <td class="quantity-data">${purchase.quantity}</td>
            <td class="cost-data">${purchase.cost}</td>
            <td class="date-data">${purchase.purchaseDate}</td>
            <td class="buy-next-data">${purchase.expected}</td>
            <td class="bought-data">${purchase.actual}</td>
        </tr>
    `});

    $('.table-data').append(tableData);
    console.log(tableData)
}

function getAndDisplayPurchases() {
    getPurchases(displayPurchases);
}

function getGoals(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_GOALS)}, 100);
}

$(function() {
    getAndDisplayPurchases()
});
