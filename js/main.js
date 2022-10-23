let siteBody = document.querySelector(".site-body");

let enterGameSection = document.querySelector("#enter-game");
let enterGameForm = document.querySelector(".enter-game-form");

let chooseLevelSelect = document.querySelector(".choose_level-select");
let chooseTimeSelect = document.querySelector(".choose_time-select");
let enterGameBtn = document.querySelector(".enter-game-btn");

let mainGameSection = document.querySelector("#main-game-box");

let gameScoreCountText = document.querySelector(".game-score-count");
let gameUserChosenLevelText = document.querySelector(
  ".game-user-chosen-level-text"
);
let gameTimeText = document.querySelector(".game-time-text");

let gameQuestionText = document.querySelector(".game-question-text");
let gameCardList = document.querySelector(".game-card-list");
let gameCardItemBox = document.querySelector(".game-card-box");

let gameOverModal = document.querySelector(".game-over-modal");
let gameErrorCounterText = document.querySelector(".game-modal-error-counter");
let gameOverModalText = document.querySelector(".game-modal-text-game-over");
let gameOverModalScoreCounter = document.querySelector(
  ".game-modal-score-counter"
);

let gameWinModal = document.querySelector(".game-win-modal");
let gameWinModalScoreText = document.querySelector(".game-win-score-counter");
let gameWinModalErrorText = document.querySelector(".game-win-error-counter");
// let gameOverModalBtn = document.querySelector(".game-over-modal-btn");

let cardRulesTemplate = document.querySelector(".game-card-template").content;

let sortedData = [];

let levelData = [];

let gameScoreCount = 0;
let gameErrorCounter = 0;
gameScoreCountText.textContent = `Score: ${gameScoreCount}`;
// ! Timer count down
let globalTime = 0;
function setTimer(startTime) {
  globalTime = startTime * 60;
  setInterval(updateCountDown, 1000);
}
// ! Timer count down's continue
function updateCountDown() {
  const minutes = Math.floor(globalTime / 60);
  let seconds = globalTime % 60;

  if (seconds === 10 && minutes === 0) {
    gameTimeText.classList.add("game-time-text--over");
  }

  if (seconds === 0 && minutes === 0) {
    gameOverModal.classList.add("d-flex");
    gameOverModalText.textContent = `Time is out`;
    gameOverModalScoreCounter.textContent = `Your score is ${gameScoreCount}`;
    siteBody.classList.add("site-body--on");
    return;
  }

  //   gameOverModalBtn.addEventListener("click", () => {
  //     gameOverModal.classList.add("d-none");
  //     enterGameSection.classList.remove("d-none");
  //     mainGameSection.classList.remove("d-block");
  //   });

  seconds = seconds < 10 ? "0" + seconds : seconds;
  gameTimeText.textContent = `${minutes}:${seconds}`;
  globalTime--;
}

// ! Form before enter game
enterGameBtn.addEventListener("click", (evt) => {
  evt.preventDefault();
  enterGameSection.classList.add("d-none");
  mainGameSection.classList.add("d-block");

  if (chooseLevelSelect.value === "easy") {
    gameUserChosenLevelText.textContent = `You chose ${chooseLevelSelect.value} level`;
    levelData = selectedEasyLevel(roadSymbolGenerated);
    cardRender(levelData);
  } else if (chooseLevelSelect.value === "medium") {
    gameUserChosenLevelText.textContent = `You chose ${chooseLevelSelect.value} level`;
    levelData = selectedMediumLevel(roadSymbolGenerated);
    cardRender(levelData);
  } else if (chooseLevelSelect.value === "hard") {
    gameUserChosenLevelText.textContent = `You chose ${chooseLevelSelect.value} level`;
    levelData = selectedHardLevel(roadSymbolGenerated);
    cardRender(levelData);
  } else {
    mainGameSection.classList.remove("d-block");
    enterGameSection.classList.remove("d-none");
  }

  if (
    chooseTimeSelect.value !== "5" &&
    chooseTimeSelect.value !== "10" &&
    chooseTimeSelect.value !== "15"
  ) {
    mainGameSection.classList.remove("d-block");
    enterGameSection.classList.remove("d-none");
  }

  startMinutes = Number(chooseTimeSelect.value);
  setTimer(startMinutes);
});

// ! Choose level by select and slice 0 to 31
function selectedEasyLevel(roadSymbol) {
  let gameEasyLevel = roadSymbol.slice(0, 31);
  sortedData = gameEasyLevel.map((item) => item.id);
  console.log(gameEasyLevel);
  return gameEasyLevel;
}
// ! Choose level by select and slice 0 to 51
function selectedMediumLevel(roadSymbol) {
  let gameMediumLevel = roadSymbol.slice(0, 51);
  sortedData = gameMediumLevel.map((item) => item.id);
  console.log(gameMediumLevel);
  return gameMediumLevel;
}
// ! Choose level by select and slice 0 to array's length
function selectedHardLevel(roadSymbol) {
  let gameHardLevel = roadSymbol;
  sortedData = gameHardLevel.map((item) => item.id);
  console.log(gameHardLevel);
  return gameHardLevel;
}

// ! Main Array roadSymbol is Generated
roadSymbolGenerated = roadSymbol
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);

// ! Game's question randomizer
function gameQuestionRandom(generatedQuestion) {
  console.log(sortedData);
  let randomIndex = Math.floor(Math.random() * sortedData.length);
  let selectedId = sortedData[randomIndex];

  let selectedObject = generatedQuestion.find((item) => item.id == selectedId);

  gameQuestionText.dataset.qestionId = selectedObject.id;
  gameQuestionText.textContent = selectedObject.symbol_title;
  console.log("Selected question", selectedObject);
}

// ! Main creating element and appenchild
function cardRender(cardRules) {
  gameCardList.innerHTML = "";

  let cardRulesFragment = document.createDocumentFragment();

  for (let gameCardRules of cardRules) {
    let cloneCardRulesTemplate = cardRulesTemplate.cloneNode(true);

    cloneCardRulesTemplate.querySelector(".game-card-item").dataset.cardId =
      gameCardRules.id;
    cloneCardRulesTemplate.querySelector(".game-card-img").src =
      gameCardRules.symbol_img;

    cardRulesFragment.appendChild(cloneCardRulesTemplate);
  }

  // ! Winner modal
  if (sortedData.length == 0) {
    gameWinModal.classList.add("d-flex");
    // gameWinModalErrorText.textContent = `You made ${gameErrorCounter} mistakes`;
    gameWinModalScoreText.textContent = `Your score is ${gameScoreCount}`;
  }
  gameQuestionRandom(cardRules);
  gameCardList.appendChild(cardRulesFragment);
}

// ! Event delegation
gameCardList.addEventListener("click", (evt) => {
  if (evt.target.matches(".game-card-item")) {
    let cardId = Number(evt.target.dataset.cardId);
    console.log(cardId);
    let findedItem = evt.target;
    findedItem.style.backgroundColor = "red";
    setTimeout(() => {
      findedItem.style.backgroundColor = "transparent";
    }, 5000);
    // ! Check, If correct answer or not
    if (cardId == gameQuestionText.dataset.qestionId) {
      let megaSortedData = sortedData.filter((item) => item !== cardId);
      sortedData = [...megaSortedData];
      gameScoreCount += 2;
      gameScoreCountText.textContent = `Score: ${gameScoreCount}`;
      // findedItem.classList.add("game-card-box--off");
      cardRender(levelData);
      //   findedItem.style.backgroundColor = "green";
      alert("Topdingiz");
    } else {
      //   findedItem.classList.add("game-card-box--off");
      gameScoreCount--;
      gameErrorCounter++;
      gameScoreCountText.textContent = `Score: ${gameScoreCount}`;

      if (gameErrorCounter == 5) {
        gameOverModal.classList.add("d-flex");
        siteBody.classList.add("site-body--on");
        gameOverModalScoreCounter.textContent = `Your score is ${gameScoreCount}`;
        gameErrorCounterText.textContent = `You made a total of  ${gameErrorCounter} mistakes `;
      }
    }
  }
});
