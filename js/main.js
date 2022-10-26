const siteBody = document.querySelector(".site-body");
const enterGameSection = document.querySelector("#enter-game");
const enterGameForm = document.querySelector(".enter-game-form");
const chooseLevelSelect = document.querySelector(".choose_level-select");
const chooseTimeSelect = document.querySelector(".choose_time-select");
const enterGameBtn = document.querySelector(".enter-game-btn");
const aboutGameBtn = document.querySelector(".about-game-btn");
const aboutGameBox = document.querySelector(".game-introduce-box");
const aboutCloseBtn = document.querySelector(".about-game-close-btn");

const mainGameSection = document.querySelector("#main-game-box");
const gameScoreCountText = document.querySelector(".game-score-count");
const gameUserChosenLevelText = document.querySelector(
  ".game-user-chosen-level-text"
);
const gameTimeText = document.querySelector(".game-time-text");
const gameQuestionText = document.querySelector(".game-question-text");
const gameCardList = document.querySelector(".game-card-list");
const gameCardItemBox = document.querySelector(".game-card-box");

const gameOverModal = document.querySelector(".game-over-modal");
const gameErrorCounterText = document.querySelector(
  ".game-modal-error-counter"
);
const gameOverModalText = document.querySelector(".game-modal-text-game-over");
const gameOverModalScoreCounter = document.querySelector(
  ".game-modal-score-counter"
);

const gameWinModal = document.querySelector(".game-win-modal");
const gameWinModalScoreText = document.querySelector(".game-win-score-counter");
const gameWinModalErrorText = document.querySelector(".game-win-error-counter");

const cardRulesTemplate = document.querySelector(".game-card-template").content;

let sortedData = [];
let levelData = [];

let gameScoreCount = 0;
let gameErrorCounter = 0;
gameScoreCountText.textContent = `Score: ${gameScoreCount}`;

// ! Form before enter game
enterGameForm.addEventListener("submit", (evt) => {
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
  const gameEasyLevel = roadSymbol.slice(0, 31);
  sortedData = gameEasyLevel.map((item) => item.id);
  return gameEasyLevel;
}

// ! Choose level by select and slice 0 to 51
function selectedMediumLevel(roadSymbol) {
  const gameMediumLevel = roadSymbol.slice(0, 51);
  sortedData = gameMediumLevel.map((item) => item.id);
  return gameMediumLevel;
}

// ! Choose level by select and slice 0 to array's length
function selectedHardLevel(roadSymbol) {
  const gameHardLevel = roadSymbol;
  sortedData = gameHardLevel.map((item) => item.id);
  return gameHardLevel;
}

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

  seconds = seconds < 10 ? "0" + seconds : seconds;
  gameTimeText.textContent = `${minutes}:${seconds}`;
  globalTime--;
}

// ! Main Array roadSymbol is Generated
roadSymbolGenerated = roadSymbol
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);

// ! Game's question randomizer
function gameQuestionRandom(generatedQuestion) {
  const randomIndex = Math.floor(Math.random() * sortedData.length);
  let selectedId = sortedData[randomIndex];

  let selectedObject = generatedQuestion.find((item) => item.id == selectedId);

  gameQuestionText.dataset.questionId = selectedObject.id;
  gameQuestionText.textContent = selectedObject.symbol_title;
}

// ! Main creating element and appenchild
function cardRender(cardRules) {
  gameCardList.innerHTML = "";

  const cardRulesFragment = document.createDocumentFragment();

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
    gameOverModal.classList.remove("d-flex");
    // gameWinModalErrorText.textContent = `You made ${gameErrorCounter} mistakes`;
    gameWinModalScoreText.textContent = `Your score is ${gameScoreCount}`;
    setTimer(0);
  }
  gameQuestionRandom(cardRules);
  gameCardList.appendChild(cardRulesFragment);
}

// ! Event delegation
gameCardList.addEventListener("click", (evt) => {
  if (evt.target.matches(".game-card-item")) {
    const cardId = Number(evt.target.dataset.cardId);
    let findedItem = evt.target;

    // ! Check, If correct answer or not
    if (cardId == gameQuestionText.dataset.questionId) {
      let megaSortedData = sortedData.filter((item) => item !== cardId);
      sortedData = [...megaSortedData];
      gameScoreCount += 2;
      gameScoreCountText.textContent = `Score: ${gameScoreCount}`;
      // findedItem.style.backgroundColor = "green";
      cardRender(levelData);
      alert("Topdingiz");
    } else {
      gameScoreCount--;
      gameErrorCounter++;
      gameScoreCountText.textContent = `Score: ${gameScoreCount}`;

      findedItem.style.backgroundColor = "red";
      setTimeout(() => {
        findedItem.style.backgroundColor = "transparent";
      }, 5000);

      if (gameErrorCounter == 5) {
        gameOverModal.classList.add("d-flex");
        siteBody.classList.add("site-body--on");
        gameOverModalScoreCounter.textContent = `Your score is ${gameScoreCount}`;
        gameErrorCounterText.textContent = `You made a total of  ${gameErrorCounter} mistakes `;
      }
    }
  }
});

aboutGameBtn.addEventListener("click", () => {
  aboutGameBox.classList.add("d-block");
});

aboutCloseBtn.addEventListener("click", () => {
  aboutGameBox.classList.remove("d-block");
});
