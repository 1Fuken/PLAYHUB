// Sélection des éléments de la page
const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainButton = document.querySelector(".play-again");

let currentWord;
let normalizedWord;
let correctLetters = [];
let wrongGuessCount = 0;
const maxGuess = 6;

// Fonction pour normaliser les lettres (remplace les accents)
const normalizeLetter = (letter) => letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Choisir un mot au hasard et l'afficher sous forme de tirets
const getRandomWord = () => {
    const { word } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    normalizedWord = normalizeLetter(word); // Stocke la version normalisée du mot
    console.log(word); // Debug : voir le mot dans la console

    // Affichage des lettres avec les tirets pour les mots composés
    wordDisplay.innerHTML = word.split("").map(letter => 
        letter === "-" ? `<li class="letter guessed">${letter}</li>` : `<li class="letter"></li>`
    ).join("");
}

// Afficher le résultat du jeu
const gameOver = (win) => {
    setTimeout(() => {
        gameModal.classList.add("show");
        const resultText = win ? "Vous avez gagné !" : "Game Over!";
        const resultGif = win ? "../images/victory.gif" : "../images/lost.gif";
        gameModal.querySelector("h4").innerText = resultText;
        gameModal.querySelector("img").src = resultGif;
        gameModal.querySelector("p").innerHTML = win ? `Vous avez trouvé le mot : <b>${currentWord}</b>` : `Le mot à trouver était : <b>${currentWord}</b>`;
    }, 300);
}

// Mettre à jour le jeu après chaque tentative
const initGame = (button, clickedLetter) => {
    const normalizedClickedLetter = normalizeLetter(clickedLetter);

    if (normalizedWord.includes(normalizedClickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (normalizeLetter(letter) === normalizedClickedLetter) {
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

    // Vérification de la victoire : ne pas compter les "-" dans la condition de victoire
    const guessedLettersCount = wordDisplay.querySelectorAll(".letter.guessed").length;
    const totalLettersCount = [...currentWord].filter(letter => letter !== "-").length;

    if (wrongGuessCount === maxGuess) return gameOver(false);
    if (guessedLettersCount === totalLettersCount) return gameOver(true);
}

// Réinitialiser le jeu
const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    guessesText.innerText = `0 / ${maxGuess}`;
    hangmanImage.src = "../images/hangman-0.png";
    gameModal.classList.remove("show");
    keyboardDiv.querySelectorAll("button").forEach(button => button.disabled = false);
    getRandomWord();
}

// Créer les boutons pour chaque lettre de l'alphabet
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

// Ajouter l'événement au bouton "Rejouer"
playAgainButton.addEventListener("click", resetGame);

// Choisir un mot au hasard au début du jeu
getRandomWord();
