/* ============================================================
   Virtual Dog Park - script.js
   Round 2: adoption, Feed and Play.
   Progress is kept in memory only for now; saving comes in Round 3.
   ============================================================ */

const START_DAY = 1;
const START_STAGE = "Puppy";
const START_HAPPINESS = 50;
const HAPPINESS_MAX = 100;
const NAME_MAX = 20;

const BREEDS = {
  "Shiba Inu": {
    art: "assets/shiba-inu.svg",
    alt: "Illustration of a Shiba Inu",
  },
  Corgi: {
    art: "assets/corgi.svg",
    alt: "Illustration of a Corgi",
  },
  "Border Collie": {
    art: "assets/border-collie.svg",
    alt: "Illustration of a Border Collie",
  },
};

/* The adopted dog. null means "no dog yet". */
let pet = null;

/* --- elements --- */

const yearSpan = document.getElementById("year");
const adoptForm = document.getElementById("adoptForm");
const nameInput = document.getElementById("dogName");
const nameError = document.getElementById("nameError");
const petCard = document.getElementById("petCard");
const petName = document.getElementById("petName");
const petBreed = document.getElementById("petBreed");
const petImage = document.getElementById("petImage");
const statDay = document.getElementById("statDay");
const statStage = document.getElementById("statStage");
const statHappiness = document.getElementById("statHappiness");
const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const statusLine = document.getElementById("status");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* --- helpers --- */

function showError(message) {
  nameError.textContent = message;
  nameInput.setAttribute("aria-invalid", "true");
}

function clearError() {
  nameError.textContent = "";
  nameInput.removeAttribute("aria-invalid");
}

/* Draws the whole pet card from the pet object. */
function renderPet() {
  if (!pet) {
    return;
  }

  const breed = BREEDS[pet.breed];

  /* textContent, never innerHTML: a name like <script> stays plain text */
  petName.textContent = pet.name;
  petBreed.textContent = pet.breed;

  if (breed) {
    petImage.src = breed.art;
    petImage.alt = breed.alt;
  }

  statDay.textContent = pet.day;
  statStage.textContent = START_STAGE;
  statHappiness.textContent = pet.happiness;
}

/* One shared place that changes happiness, so every button obeys the same limits. */
function changeHappiness(amount) {
  if (!pet) {
    return;
  }
  pet.happiness = Math.min(HAPPINESS_MAX, pet.happiness + amount);
  renderPet();
}

/* --- adoption --- */

adoptForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const cleanName = nameInput.value.trim().slice(0, NAME_MAX);

  if (cleanName === "") {
    showError("Please type a name before adopting.");
    nameInput.focus();
    return;
  }

  clearError();

  const chosenBreed = adoptForm.querySelector('input[name="breed"]:checked').value;

  pet = {
    name: cleanName,
    breed: chosenBreed,
    day: START_DAY,
    happiness: START_HAPPINESS,
  };

  adoptForm.hidden = true;
  petCard.hidden = false;
  statusLine.textContent = pet.name + " has joined the park. Say hello!";

  renderPet();
});

/* --- care buttons --- */

feedBtn.addEventListener("click", function () {
  changeHappiness(10);
  statusLine.textContent = "You fed " + pet.name + ". Happiness +10.";
});

playBtn.addEventListener("click", function () {
  changeHappiness(10);
  statusLine.textContent = "You played fetch with " + pet.name + ". Happiness +10.";
});
