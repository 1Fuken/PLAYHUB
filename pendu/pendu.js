const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainButton = document.querySelector(".play-again");

let currentWord;
let correctLetters = [];
let wrongGuessCount = 0;
const maxGuess = 6;

const getRandomWord = () => {
    const { word } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    console.log(word);
    const wordElement = document.querySelector(".word");
    if (wordElement) {
        wordElement.innerText = word;
    }
    wordDisplay.innerHTML = word.split("").map(() => '<li class="letter"></li>').join("");
}

const gameOver = (win) => {
    setTimeout(() => {
        gameModal.classList.add("show");
        const resultText = win ? "Vous avez gagné !" : "Game Over!";
        const resultGif = win ? "../images/victory.gif" : "../images/lost.gif"; // Chemin du gif de victoire
        gameModal.querySelector("h4").innerText = resultText;
        gameModal.querySelector("img").src = resultGif;
        gameModal.querySelector("p").innerHTML = win ? `Vous avez trouvé le mot: <b>${currentWord}</b>` : `Le mot à trouver était: <b>${currentWord}</b>`;
    }, 300);
}

const initGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll(".letter")[index].innerText = letter;
                wordDisplay.querySelectorAll(".letter")[index].classList.add("guessed");
            }
        });
    } else {    
        wrongGuessCount++;
        hangmanImage.src = `../images/hangman-${wrongGuessCount}.png`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuess}`;

    if (wrongGuessCount === maxGuess) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
}

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    guessesText.innerText = `0 / ${maxGuess}`;
    hangmanImage.src = "../images/hangman-0.png";
    gameModal.classList.remove("show");
    keyboardDiv.querySelectorAll("button").forEach(button => button.disabled = false);
    getRandomWord();
}

// Création des boutons de A à Z
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

// Attacher l'événement au bouton "Rejouer"
playAgainButton.addEventListener("click", resetGame);

getRandomWord();