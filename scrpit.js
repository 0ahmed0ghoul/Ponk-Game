var score_p = document.getElementById("score");
const generate = document.getElementById("generate");
const table = document.getElementById("grid-container");
var hearts = document.getElementById("hearts");

const bonkSound = new Audio("./sounds/bonk.mp3");
const wrong_buzz = new Audio("./sounds/Wrong_Buzzer.mp3");

let btn_num = 0;
let rand;
let gameSpeed;
let score = 0;
score_p.textContent = `SCORE : ${score}`;

let highlightedButton = null;
let lastRandomIndex = -1;
var btns = [];

const inputs = document.querySelectorAll('input[type="number"].track-number');

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    const rows = document.getElementById("rows").value || 3;
    const columns = document.getElementById("columns").value || 3;

    const btns = []; // Array to store button IDs

    table.innerHTML = "";
    table.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    table.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    for (let i = 0; i < rows * columns; i++) {
      let but = document.createElement("button");
      but.setAttribute("id", `btn${i}`);
      but.style.width = "80px";
      but.style.height = "80px";
      but.style.cursor = "url('./img/hammer-up.png'), auto";
      but.style.transition = "";

      but.addEventListener("mousedown", () => {
        but.style.cursor = "url('./img/hammer-down.png'), auto";
      });

      but.addEventListener("mouseup", () => {
        but.style.cursor = "url('./img/hammer-up.png'), auto";
      });

      but.addEventListener("click", () => handleButtonClick(but)); // Add click listener

      table.appendChild(but);

      btns.push(`btn${i}`);
    }

    btn_num = rows * columns - 1;
  });
});


generate.addEventListener("click", () => {
  if (!rows || !columns) {
    alert("you must enter rows and columns!");
    return;
  }
  generate.style.display = "none";

  const parameteres = document.querySelector(".stopRestart");

  // Apply styles to the container
  parameteres.style.textAlign = "center";
  parameteres.style.display = "flex"; // Enable flexbox layout
  parameteres.style.justifyContent = "center"; // Center horizontally
  parameteres.style.alignItems = "center"; // Center vertically

  // Create and style the Pause button
  const pauseButton = document.createElement("button");
  pauseButton.textContent = "Pause";
  pauseButton.style.padding = "10px 20px";
  pauseButton.style.margin = "5px";
  pauseButton.style.cursor = "pointer";
  pauseButton.addEventListener("click", () => {
    gameRunning = !gameRunning; // Toggle the running state
    pauseButton.textContent = gameRunning ? "Pause" : "Resume";
  });
  // Create and style the Restart button
  const RestartButton = document.createElement("button");
  RestartButton.textContent = "Restart";
  RestartButton.style.padding = "10px 20px";
  RestartButton.style.margin = "5px";
  RestartButton.style.cursor = "pointer";
  RestartButton.addEventListener("click", () => {
    window.location.reload(); // Reloads the page to reset everything
  });
  // Append buttons to the container
  parameteres.appendChild(pauseButton);
  parameteres.appendChild(RestartButton);

  hearts.style.display = "block";

  document.body.style.cursor = "url('./img/hammer-up.png'), auto";
  table.style.cursor = "url('./img/hammer-up.png'), auto";

  const gameDuration =
    document.querySelector('input[type="number"]').value || 1;
  const gameSpeed =
    document.querySelectorAll('input[type="number"]')[3].value || 1000;
  inputs.forEach((input) => (input.style.display = "none"));

  bs = document.querySelector('input[type="number"]').style.display = "none";
  bs = document.querySelectorAll('input[type="number"]')[3].style.display =
    "none";
  const labels = document.querySelectorAll("#labele");
  labels.forEach((label) => {
    label.style.display = "none";
  });

  const time = document.getElementById("time");
  let minutes = parseInt(gameDuration, 10);
  let seconds = 0;
  gameRunning = true; // Start the game

  timer = setInterval(() => {
    if (!gameRunning) return; // Stop the timer if the game is over
    pauseButton.textContent = "Pause";
    time.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    if (minutes === 0 && seconds === 0) {
      clearInterval(timer);
      clearInterval(rand);
      alert(`Time's Up! Your score is ${score}`);
      gameRunning = false;
      window.location.reload();
    }
    if (seconds === 0) {
      minutes--;
      seconds = 60;
    }
    seconds--;
  }, 1000);

  let lastRandomIndex = -1;
  rand = setInterval(() => {
    if (!gameRunning) return; // Stop mole generation if the game is over

    let randomButtonIndex = Math.floor(Math.random() * btn_num);
    while (randomButtonIndex === lastRandomIndex) {
      randomButtonIndex = Math.floor(Math.random() * btn_num);
    }
    lastRandomIndex = randomButtonIndex;

    const randomButton = document.getElementById(`btn${randomButtonIndex}`);
    highlightedButton = randomButton; // Track the highlighted button

    // Create and add the mole image
    const mole = document.createElement("img");
    mole.src = "./img/mole.png";
    mole.alt = "Mole";
    mole.className = "mole";
    randomButton.appendChild(mole);

    // Remove mole after a timeout
    setTimeout(() => {
      if (randomButton.contains(mole)) {
        mole.classList.add("mole-remove"); // Trigger removal animation
        mole.addEventListener("animationend", () => {
          randomButton.removeChild(mole); // Remove after animation ends
        });
      }
      if (highlightedButton === randomButton) {
        highlightedButton = null; // Clear tracking
      }
    }, gameSpeed);
  }, gameSpeed);

  alert(
    `Starting game with:\nDuration: ${gameDuration} minutes\nDimensions: ${
      document.getElementById("rows").value
    }x${document.getElementById("columns").value}\nSpeed: ${gameSpeed}ms`
  );
});

// Global variables to track game state
let remainingHearts = 3;
let gameRunning = false; // Flag to track if the game is active

function handleButtonClick(button) {
  if (!gameRunning) return; // Prevent actions if the game is not running

  const GameOver = new Audio("./sounds/Game_Over.mp3");
  GameOver.volume = 1;

  if (button === highlightedButton) {
    bonkSound.currentTime = 0;
    bonkSound.play();
    button.style.backgroundColor = "green"; // Correct button clicked
    score++;
    score_p.textContent = `SCORE : ${score}`;

    setTimeout(() => {
      button.style.backgroundColor = "";
    }, 500); // Reset color
  } else {
    wrong_buzz.currentTime = 0;
    wrong_buzz.play();
    button.style.backgroundColor = "red"; // Wrong button clicked
    setTimeout(() => {
      button.style.backgroundColor = "";
    }, 500); // Reset color

    if (remainingHearts === 1) {
      const heart = document.getElementById(`h${remainingHearts}`);
      hearts.removeChild(heart); // Remove the heart from the DOM
      remainingHearts--; // Decrease remaining hearts
      endGame(GameOver); // Stop the game when hearts are gone
    } else {
      const heart = document.getElementById(`h${remainingHearts}`);
      hearts.removeChild(heart); // Remove the heart from the DOM
      remainingHearts--; // Decrease remaining hearts
    }
  }
}

function endGame(gameOverSound) {
  gameRunning = false; // Mark the game as no longer running

  clearInterval(rand); // Stop mole generation
  clearInterval(timer); // Stop the timer

  try {
    gameOverSound.currentTime = 0;
    gameOverSound
      .play()
      .then(() => {
        setTimeout(() => {
          alert("Game Over!");
          window.location.reload();
        }, 2000); // Allow sound to finish before reloading
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
        alert("Game Over!");
        window.location.reload();
      });
  } catch (error) {
    console.error("Audio play failed:", error);
    alert("Game Over!");
    endGameCleanup();
    window.location.reload();
  }
}

function endGameCleanup() {
  // Re-enable inputs and the generate button
  generate.disabled = false;
  inputs.forEach((input) => (input.disabled = false));
}
