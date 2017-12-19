let MOCK_PURCHASES = {
    "purchases": [
        {
            id: "11111",
            item: "Eggs",
            quantity: "1 dozen",
            cost: "$2.50",
            datePurchased: "11/27/17",
            expected: "2 weeks (12/11/17)",
            actual: "12/08/17"   
        },
        {
            id: "22222",
            item: "Milk",
            quantity: "1 gallon",
            cost: "$3.50",
            datePurchased: "11/27/17",
            expected: "2 weeks (12/11/17)",
            actual: "12/08/17"   
        },
        {
            id: "33333",
            item: "Paper Towels",
            quantity: "12 rolls",
            cost: "$14.75",
            datePurchased: "11/27/17",
            expected: "2 months (1/27/18)",
            actual: "TBD"   
        },
        {
            id: "44444",
            item: "Heavy Cream",
            quantity: "1 quart",
            cost: "$3.50",
            datePurchased: "11/27/17",
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

function getPurchases(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_PURCHASES)}, 100);
}

function getGoals(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_GOALS)}, 100);
}

function displayPurchases(data) {
    for(index in data.purchases) {
        $('#display-table').html(`
            <tr>
                <td class="item-data">Eggs</td>
                <td class="quantity-data">1 dozen</td>
                <td class="cost-data">$3.50</td>
                <td class="date-data">11/21/17</td>
                <td class="buy-next-data">12/01/17</td>
            </tr>
            `);
    }
}
