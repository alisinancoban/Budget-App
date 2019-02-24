var budgetController = (function(){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
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
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expensesContainer: ".expenses__list"
    }
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //will be either exp or inc
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value) 
            }  
        },
        getDOMStrings: function(){
            return DOMStrings;
        },
        addListItem: function(obj, type){
            var html, newHtml, element;
            if(type === "inc"){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else{
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);          
        },
        clearField: function(){
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ", "+ DOMStrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(element => {
                element.value = ""; 
            });
            fieldsArr[0].focus();
        }
    };
})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function(){
        var DOM = UIController.getDOMStrings();

        document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function(event){ 
            if(event.keyCode === 13 || event.which === 13 /*for old browser*/){
                ctrlAddItem(); 
            }
        });
    };

    var updateBudget = function(){
        //calculate budget
        budgetCtrl.calculateBudget();
        //return the budget
        var budget = budgetCtrl.getBudget();
        //display the budget on the UI
        console.log(budget);
    };

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
    };

    return {
      init: function(){
          console.log("Application has started.");
          setupEventListeners();
      }  
    };
})(budgetController, UIController);

controller.init();

