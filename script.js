/* ============================================================
   Virtual Dog Park - script.js
   Round 3: growth, saved progress and Start Over.

   Where the data lives:
   The adopted dog is one plain JavaScript object. After every
   action it is written to the browser's localStorage under the
   key "virtualDogParkPetV1", and read back when the page loads.
   localStorage belongs to the browser on this device only, so
   refreshing the page keeps the dog and clearing site data does not.
   ============================================================ */

const STORAGE_KEY = "virtualDogParkPetV1";

const START_DAY = 1;
const START_HAPPINESS = 50;
const HAPPINESS_MIN = 0;
const HAPPINESS_MAX = 100;
const HAPPINESS_PER_CARE = 10;
const HAPPINESS_PER_DAY = -5;
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

/* The one and only growth rule. Every screen asks this function. */
function stageFor(day) {
  if (day <= 1) {
    return "Puppy";
  }
  if (day <= 3) {
    return "Young Dog";
  }
  return "Adult Dog";
}

const STAGE_CLASS = {
  Puppy: "stage-puppy",
  "Young Dog": "stage-young",
  "Adult Dog": "stage-adult",
};

const STAGE_PROGRESS = {
  Puppy: 33,
  "Young Dog": 66,
  "Adult Dog": 100,
};

/* The adopted dog. null means "no dog yet". */
let pet = null;

/* --- elements --- */

const yearSpan = document.getElementById("year");
const adoptForm = document.getElementById("adoptForm");
const nameInput = document.getElementById("dogName");
const nameError = document.getElementById("nameError");
const petCard = document.getElementById("petCard");
const petVisual = document.getElementById("petVisual");
const petName = document.getElementById("petName");
const petBreed = document.getElementById("petBreed");
const petImage = document.getElementById("petImage");
const statDay = document.getElementById("statDay");
const statStage = document.getElementById("statStage");
const statHappiness = document.getElementById("statHappiness");
const growthFill = document.getElementById("growthFill");
const growthLabel = document.getElementById("growthLabel");
const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const nextDayBtn = document.getElementById("nextDayBtn");
const startOverBtn = document.getElementById("startOverBtn");
const statusLine = document.getElementById("status");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* --- messages --- */

function showError(message) {
  nameError.textContent = message;
  nameInput.setAttribute("aria-invalid", "true");
}

function clearError() {
  nameError.textContent = "";
  nameInput.removeAttribute("aria-invalid");
}

function say(message) {
  statusLine.textContent = message;
}

/* --- saving and loading --- */

function savePet() {
  if (!pet) {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
  } catch (error) {
    say("This browser blocked local storage, so progress will not survive a refresh.");
  }
}

function loadPet() {
  let saved = null;

  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }

  if (!saved) {
    return null;
  }

  try {
    const parsed = JSON.parse(saved);

    const looksValid =
      parsed &&
      typeof parsed.name === "string" &&
      parsed.name.trim() !== "" &&
      typeof BREEDS[parsed.breed] === "object" &&
      Object.prototype.hasOwnProperty.call(BREEDS, parsed.breed) &&
      Number.isFinite(parsed.day) &&
      Number.isFinite(parsed.happiness);

    if (!looksValid) {
      return null;
    }

    return {
      name: parsed.name.slice(0, NAME_MAX),
      breed: parsed.breed,
      day: Math.max(1, Math.round(parsed.day)),
      happiness: Math.min(HAPPINESS_MAX, Math.max(HAPPINESS_MIN, Math.round(parsed.happiness))),
    };
  } catch (error) {
    return null;
  }
}

function forgetPet() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    /* nothing to clean up if storage is unavailable */
  }
}

/* --- drawing --- */

function renderPet() {
  if (!pet) {
    return;
  }

  const breed = BREEDS[pet.breed];
  const stage = stageFor(pet.day);

  /* textContent, never innerHTML: a name like <b>Buddy</b> stays plain text */
  petName.textContent = pet.name;
  petBreed.textContent = pet.breed;

  if (breed) {
    petImage.src = breed.art;
    petImage.alt = stage + " " + pet.breed + " named " + pet.name;
  }

  statDay.textContent = pet.day;
  statStage.textContent = stage;
  statHappiness.textContent = pet.happiness;

  /* growth is shown twice: the bar, and the text above it */
  growthLabel.textContent = stage;
  growthFill.style.width = STAGE_PROGRESS[stage] + "%";

  petVisual.classList.remove("stage-puppy", "stage-young", "stage-adult");
  petVisual.classList.add(STAGE_CLASS[stage]);
}

function showPetCard() {
  adoptForm.hidden = true;
  petCard.hidden = false;
  renderPet();
}

function showAdoptForm() {
  petCard.hidden = true;
  adoptForm.hidden = false;
  nameInput.value = "";
  clearError();
  say("");
}

/* --- actions --- */

/* One shared place that changes happiness, so every button obeys the same limits. */
function changeHappiness(amount) {
  if (!pet) {
    return;
  }
  pet.happiness = Math.max(HAPPINESS_MIN, Math.min(HAPPINESS_MAX, pet.happiness + amount));
  renderPet();
  savePet();
}

function nextDay() {
  if (!pet) {
    return;
  }
  pet.day = pet.day + 1;
  pet.happiness = Math.max(HAPPINESS_MIN, Math.min(HAPPINESS_MAX, pet.happiness + HAPPINESS_PER_DAY));
  renderPet();
  savePet();
  say("Day " + pet.day + ". " + pet.name + " is now a " + stageFor(pet.day) + ".");
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

  savePet();
  showPetCard();
  say(pet.name + " has joined the park. Say hello!");
});

feedBtn.addEventListener("click", function () {
  if (!pet) {
    return;
  }
  changeHappiness(HAPPINESS_PER_CARE);
  say("You fed " + pet.name + ". Happiness +10.");
});

playBtn.addEventListener("click", function () {
  if (!pet) {
    return;
  }
  changeHappiness(HAPPINESS_PER_CARE);
  say("You played fetch with " + pet.name + ". Happiness +10.");
});

nextDayBtn.addEventListener("click", nextDay);

startOverBtn.addEventListener("click", function () {
  if (!pet) {
    return;
  }

  const sure = window.confirm(
    "Start over? " + pet.name + " will be deleted from this browser. Cancel keeps your dog."
  );

  if (!sure) {
    say("Okay, " + pet.name + " stays.");
    return;
  }

  forgetPet();
  pet = null;
  showAdoptForm();
  say("Saved progress deleted. You can adopt a new dog.");
});

/* --- start up: bring back a saved dog, if there is one --- */

pet = loadPet();

if (pet) {
  showPetCard();
  say("Welcome back. " + pet.name + " is still here on day " + pet.day + ".");
} else {
  showAdoptForm();
}
