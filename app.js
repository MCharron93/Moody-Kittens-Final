/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
let currentKitten = {}

//Variables
let affectionCount = 5
let counter = [1, -1, -2, -1];
let treats = [1, 2, 4];

/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()
  let form = event.target

  let kittenName = form.name.value
  
  if(kittenName === ""){
    alert("You must name your cat!");
  }

  currentKitten = kittens.find(kitten => kitten.name == kittenName)

  if(currentKitten){
    alert("You cannot add the same cat twice! Please pick a different name.")
  }

  if(!currentKitten && kittenName != ""){
    let newKitten = {
      id: generateId(),
      name: kittenName,
      mood: "Tolerant",
      affection: affectionCount,
    }

    kittens.push(newKitten)
  }
  
  saveKittens()
  form.reset()
  drawKittens()
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  drawKittens()
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let kittenData = JSON.parse(window.localStorage.getItem("kittens"))

  if(kittenData){
    kittens = kittenData
  }

}

function clearKittens(){
  let clear = confirm("This will clear all kittens, would you like to proceed?")

  if(clear){
    kittens = []
  }

}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  
  let template = ""
  
  kittens.forEach(kittens => {
    template += `
    <div class="kitten-card m-1 mt-2 mb-2 p-2">
    <div id="${kittens.id}" class="kitten ${kittens.mood}">
    <img src="https://robohash.org/${kittens.name}?set=set4" height="100">
    <div class="d-flex align-items-center flex-wrap">
    ${kittens.name}
    </div>
    <p class="mt-1 mb-1">Mood: ${kittens.mood}
    </p>
    <p class="mt-1 mb-1">Affection: ${kittens.affection}
    </p>
    <p class="d-flex align-items-center space-between">
    <button class="btn-cancel" onclick="pet('${kittens.id}')">Pet</button>
    <button onclick="catnip('${kittens.id}')">Catnip</button>
    </p>
    </div>
    </div>
    `
  })
  
  document.getElementById("kittens").innerHTML = template
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(k => k.id == id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  let kitten = findKittenById(id)

  let i = Math.floor(Math.random() * counter.length)
  let petCount = counter[i]

  kitten.affection += petCount

  if(kitten.affection == 7){
    kitten.affection = 6
  }
  else if(kitten.affection == -1){
    kitten.affection = 0
  }

  setKittenMood(kitten)
  saveKittens()
  drawKittens()
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let kitten = findKittenById(id)

  let i = Math.floor(Math.random() * treats.length)
  let treatAmount = treats[i]

  kitten.affection += treatAmount

  if(kitten.affection >= 7){
    kitten.affection = 6
  }

  setKittenMood(kitten)
  saveKittens()
  drawKittens()
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {

  if(kitten.affection >= 4 && kitten.affection <= 5){
    kitten.mood = "Tolerant"
  }
  else if(kitten.affection <= 3 && kitten.affection >= 1){
    kitten.mood = "Angry"
  }
  else if(kitten.affection >= 6){
    kitten.mood = "Happy"
  }
  else if(kitten.affection <= 0){
    kitten.mood = "Gone"
    alert("Your kitten has ran away, please select another kitten.")
  }

  saveKittens()
  drawKittens()
}

/*function changeMood(){
  let currentMoodElem = document.getElementsByClassName("kitten-tolerant")

  currentMoodElem.classList.remove("kitten-tolerant")
}*/

function getStarted() {
  document.getElementById("welcome").remove();
  drawKittens();
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}


loadKittens()