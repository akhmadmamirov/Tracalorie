//Storage Controller
const StorageCtrl = (function(){
    //Public Methods
    return {
        storeItem: function(item){
            let items;
            //Check if there are any items in ls
            if (localStorage.getItem("items") === null){
                items = []
                //Push New Item
                items.push(item)
                //Set Ls
                localStorage.setItem("items", JSON.stringify(items))
            }else{
                //Get What is already in
                items = JSON.parse(localStorage.getItem("items")); 
                //Push New Item
                items.push(item)
                //Set Ls
                localStorage.setItem("items", JSON.stringify(items))
            }
        },
        getItemsFromStorage: function(){
            let items = []
            if (localStorage.getItem("items") === null){
                 items = []
            }else{
                items = JSON.parse(localStorage.getItem("items"))
            }
            return items; 
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem("items"))

            items.forEach(function(item, index){
                if (item.id === updatedItem.id){
                    items.splice(index, 1, updatedItem)
                }
            }); 
            //Set Ls
            localStorage.setItem("items", JSON.stringify(items))

        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem("items"))

            items.forEach(function(item, index){
                if (id === item.id){
                    items.splice(index, 1)
                }
            }); 
            //Set Ls
            localStorage.setItem("items", JSON.stringify(items))

        },
        clearItemsFromStorage: function(){
            localStorage.removeItem("items")
        }
    }
 })();





//Item Controller
const ItemCtrl = (function(){
    //Item Constructor
    const Item  = function(id, name,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }


    //Data Structure / State
    const data = {
        // items: [
        //     // {id: 0, name: "Steak Dinner", calories: 1200},
        //     // {id: 1, name: "Cookies", calories: 400},
        //     // {id: 2, name: "Eggs", calories: 300},

        // ], 
        items : StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }


    //Public Methods
    return  {
        getItems: function(){
            return data.items
        },
        logData: function(){
            return data
        },
        addItem: function(name, calories){
            let ID;
            //Generate Id
            if (data.items.length > 0){
                ID = data.items.length
            }
            else{
                ID = 0;
            }

            //Calories to Int
            calories = parseInt(calories);

            //Create New item
            newItem = new Item(ID, name, calories)
            //Add it to the Data Structure
            data.items.push(newItem);

            return newItem

        },
        deleteItem: function(id){
            //Get Ids
            const ids = data.items.map(function(item){
                return item.id;
            })  
            //Get Index
            const index = ids.indexOf(id)

            //Remove item
            data.items.splice(index,1)
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getTotalCalories: function(){
            let total = 0;
            //Loop through items and add cals
            data.items.forEach(item => total += item.calories)
            //Set total cal in data structure
            data.totalCalories = total; 
         
            //Return tota
            return data.totalCalories;
        },
        getItembyId: function(id){
            let found = null;
            //Loop through items
            data.items.forEach((item) => {
                if (item.id === id){
                    found = item; 
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            //Calories to Number
            calories = parseInt(calories);

            let found = null;
            
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found
        },
        getCurrentItem: function(){
            return data.currentItem
        },
        clearAllItems: function(){
            data.items = []
        }
    }
})()



//UI Controller
const UICtrl = (function(){
    //UI Selectors
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        clearBtn: '.clear-btn',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: '.total-calories'
    }

    //Public Methods
    return {
        populateItemList: function(items){
            let html = ''

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        </li> `; 
            })
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        deleteListItem: function(id){
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput ).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
         },
        clearEditState: function(){
            UICtrl.clearInput()
            //Hide Buttons
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";

        },
        showEditState: function(){ 
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";

        },
        getSelectors: function(){
            return UISelectors
        },
        addListItem: function(item){
            //Show the List
            document.querySelector(UISelectors.itemList).style.display = "block";
            //Create li element
            const li = document.createElement('li')
            //Add Class
            li.className = 'collection-item';
            //Add id
            li.id = `item-${item.id}`
            //Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li)
        }, 
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn Node to an Array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
              const itemId = listItem.getAttribute('id');

              if (itemId === `item-${item.id}`){
                  document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                  <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                  </a>`;
            }
            })
        },
        clearInput: function(){
            //Get Input Fields
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        showTotalCalories: function(total){
            //Get Total Calories from HTML
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node to an array
            listItems = Array.from(listItems);

            listItems.forEach(item => item.remove())
        }
    
    } 
})()

//App Controller
const App = (function(ItemCtrl,StorageCtrl, UICtrl){
    //Load Event Listeners
    const loadEventListeners = function(){
        //Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add an event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit)

        //Disable submit on enter
        document.addEventListener('keypress', function(e){
            if (e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })

        //Edit Icon click event
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

        //Delete Item Submit
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

        //Update  item event
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

        //Back  item event
        document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState);

        //Clear  items event
        document.querySelector(UISelectors.clearBtn).addEventListener("click",clearAllItemsClick);
    }

    //Add Item submit
    const itemAddSubmit = function(e){
        //get form input from UI Cotroller
        const input = UICtrl.getItemInput();
        
         //Check for name and calories
         if (input.name !== '' && input.calories !== ''){
            //Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);   
            //Add Item to the List
            UICtrl.addListItem(newItem);
            //Get Total Colories
            const totalCalories =  ItemCtrl.getTotalCalories();
            //Add total calories to Ui
            UICtrl.showTotalCalories(totalCalories)

            //Store in Local Storage
             StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();

         }
        e.preventDefault();
    }

    //Update item submit
    const itemUpdateSubmit = function(e){
        //Get Item input
        const input  = UICtrl.getItemInput();

        //update Item
        const udpatedItem =  ItemCtrl.updateItem(input.name, input.calories)
        UICtrl.updateListItem(udpatedItem);

        //Get Total Colories
        const totalCalories =  ItemCtrl.getTotalCalories();
        //Add total calories to Ui
        UICtrl.showTotalCalories(totalCalories)
         
        //Update Local Storage
        StorageCtrl.updateItemStorage(udpatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //Click edit Item
    const itemEditClick = function(e){
        if (e.target.classList.contains("edit-item")){
            //Get list item id
            const listId = e.target.parentNode.parentNode.id;
            //Break into an array
            const listIdArray = listId.split("-");
            //Get the actual id
            const id = parseInt(listIdArray[1])
           
            //Get Item 
            const itemtoEdit = ItemCtrl.getItembyId(id);

            //Set current item
            ItemCtrl.setCurrentItem(itemtoEdit);

            //Add Item to form
             UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    //Delete Item Submit
    const itemDeleteSubmit = function(e){
        //get Current Item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from Data Structure
        ItemCtrl.deleteItem(currentItem);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Get Total Colories
        const totalCalories =  ItemCtrl.getTotalCalories();
        //Add total calories to Ui
        UICtrl.showTotalCalories(totalCalories)
        // Delete from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //Clear all items
    const clearAllItemsClick = function(){
        //Delete all items from the dataStructure
        ItemCtrl.clearAllItems(); 
        UICtrl.hideList();
        //Clear All from the UI 
        UICtrl.removeItems();
        //Get Total Colories
        const totalCalories =  ItemCtrl.getTotalCalories();
        //Add total calories to Ui
        UICtrl.showTotalCalories(totalCalories)
        //Clear From Local Storage
        StorageCtrl.clearItemsFromStorage();

        UICtrl.clearEditState();
    }
    //Public Methods
    return {
        init: function(){
            //Clear state / set initial set
            UICtrl.clearEditState();

            // Fetch items from the Data Structure
            const items = ItemCtrl.getItems();
            if (items.length === 0){
                //Hide List Border
                UICtrl.hideList()
            }else{
                //Populate list with Items
                UICtrl.populateItemList(items)
            }
            //Load Event Listeners
            loadEventListeners()
    
        }
    }
})(ItemCtrl,StorageCtrl, UICtrl)

//Initialize App
App.init()