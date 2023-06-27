import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://mental-load-list-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const loadListInDB = ref(database, "mentalloadlist")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const loadListEl = document.getElementById("load-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(loadListInDB, inputValue)
    notificationListAdd(inputValue)
    clearInputFieldEl()
})

onValue(loadListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearLoadListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToLoadListEl(currentItem)
        }    
    } else {
        loadListEl.innerHTML = "No items here... yet"
    }
})

function clearLoadListEl() {
    loadListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToLoadListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("mouseover", function() {
    newEl.textContent = 'Click to Remove'})

    newEl.addEventListener("mouseout", function() {
        newEl.textContent = itemValue})
    

    newEl.addEventListener("click", function() {
        
        let exactLocationOfItemInDB = ref(database, `mentalloadlist/${itemID}`)
        notificationListRemove(itemValue)
        remove(exactLocationOfItemInDB)
  
    })
    
    loadListEl.append(newEl)
}

// Checking if the browser supports the Notification API
if ("Notification" in window) {
    // Requesting permission to display notifications
    Notification.requestPermission()
      .catch(error => {
        console.error("Error requesting notification permission:", error);
      });
  }
  
  
  function notificationListAdd(item) {
    new Notification("New Item Added", {
      body: "A new item, ${item.value} has been added to the mental load list!",
      icon: "/favicon-32x32.png"
    });
  }

  function notificationListRemove(item) {
    new Notification("New Item Removed", {
      body: "A ${item.value}, has been removed from the mental load list!",
      icon: "/favicon-32x32.png"
    });
  }
  