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

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals:{
            exp: 0,
            inc: 0
        }
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
                value: document.querySelector(DOMStrings.inputValue).value
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
            fieldsArr.forEach((element) => {
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


    var ctrlAddItem = function(){
        var input, newItem;
        input = UICtrl.getInput();

        newItem = budgetController.addItem(input.type, input.description, input.value);
        UIController.addListItem(newItem, input.type);
        UIController.clearField();
             /*get the field item OK;
               add the item to the bidget controller
               add the item to the ui
               calculate the budget
               display the budget*/
    };

    return {
      init: function(){
          console.log("Application has started.");
          setupEventListeners();
      }  
    };
})(budgetController, UIController);

controller.init();

