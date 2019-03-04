var budgetController = (function(){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calculatePercentage = function(totalIncome){
        this.percentage = totalIncome == 0 ? -1 : Math.round((this.value / totalIncome) * 100);
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income  = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(element =>{
            sum += element.value;
        });

        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, desc, val){
            var newItem, ID;

            ID = data.allItems[type].length > 0 ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;
            
            if(type === "exp"){
                newItem = new Expense(ID,desc,val);
            }
            else if(type == "inc"){
                newItem = new Income(ID,desc,val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function(){
            //calculate total income
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate the budget
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the percentage of income that we spent
            data.percentage = data.totals.inc == 0 ? 0 : Math.round((data.totals.exp / data.totals.inc) * 100);
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(element => {
                element.calculatePercentage(data.totals.inc);
            });
        },
        deleteItem: function(type, id){
            var index, deleteItemIDs;
            deleteItemIDs = data.allItems[type].map(i => i.id);
            index = deleteItemIDs.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }                
        },   
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },   
        getPercentages: function(){
            var allPercentages = data.allItems.exp.map(e => e.percentage);
            return allPercentages;

        },
        
        testing: function(){
            console.log(data);
        }
    };
})();

var UIController = (function(){

    var DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dataLabel: '.budget__title--month'


    };
    var formatNumber = function(num, type){
        var numSplit, int, dec, type;
        num = Math.abs(num).toFixed(2);
        numSplit = num.split(".");
        int = numSplit[0];

        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };
    return {
        addListItem: function(obj, type){
            var html, newHtml, element;
            if(type === "inc"){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else{
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);          
        },
        changeType: function(){

        },
        clearField: function(){
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ", "+ DOMStrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(element => {
                element.value = ""; 
            });
            fieldsArr[0].focus();
        },
        deleteListItem: function(selectorID){
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        displayBudget: function(obj){
            var type;
            type = obj.budget > 0 ? 'inc' : 'exp'; 
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, type);
            document.querySelector(DOMStrings.percentageLabel).textContent = 
                obj.percentage > 0 ? obj.percentage + "%" : "---";
        },
        displayPercentages: function(percentages){
            var fields;
            fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

            var nodeListForEach = function(list, callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            };
            nodeListForEach(fields, function(current, index){
                
                current.textContent = percentages[index] > 0 ?  percentages[index] + '%' : "---";
            });
        },
        displayMonth: function(){
            const monthNames = ["January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"];
            const now = new Date();
            document.querySelector(DOMStrings.dataLabel).textContent = monthNames[now.getMonth()];
        },
        getDOMStrings: function(){
            return DOMStrings;
        },
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //will be either exp or inc
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value) 
            };  
        }
    };
})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    var ctrlAddItem = function(){
        var input, newItem;
        //get the field input data
        input = UICtrl.getInput();
        if(input.description.length <= 3 || isNaN(input.value) || input.value < 0){
            alert("Invalid value");
            return;
        }
        //add the item to the budget controller
        newItem = budgetController.addItem(input.type, input.description, input.value);
        //add the item to the UI
        UIController.addListItem(newItem, input.type);
        //clear the fields
        UIController.clearField();
        //calculate and update budget
        updateBudget();
        updatePercentages();
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitId, type, ID;
        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);
        if(itemID){
            splitId = itemID.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            budgetCtrl.deleteItem(type, ID);
            UICtrl.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }
    };

    var setupEventListeners = function(){
        var DOM = UIController.getDOMStrings();

        document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function(event){ 
            if(event.keyCode === 13 || event.which === 13 /*for old browser*/){
                ctrlAddItem(); 
            }
        });

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changeType);
    };

    var updateBudget = function(){
        //calculate budget
        budgetCtrl.calculateBudget();
        //return the budget
        var budget = budgetCtrl.getBudget();
        //display the budget on the UI
        UIController.displayBudget(budget);
    };

    var updatePercentages = function(){
        budgetCtrl.calculatePercentages();
        var percentages = budgetCtrl.getPercentages();
        UICtrl.displayPercentages(percentages);
    };

    return {
      init: function(){
          console.log("Application has started.");
          UICtrl.displayMonth();
          UICtrl.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
          });
          setupEventListeners();
      }  
    };
})(budgetController, UIController);

controller.init();

