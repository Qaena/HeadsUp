var secondsRemaining;
var wordsGuessed = 0;
var intervalId;
var waitingForTipUp = false;
var usedWords = [];

init();

function init() {
  if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function") {
    document.querySelector(".permissions").classList.remove("hidden");
  }

  document.querySelector(".game").addEventListener("mousedown", () => {
    triggerNextWord();
  });
  document.querySelector(".game").addEventListener("touchstart", (event) => {
    event.preventDefault(); 
    triggerNextWord();
  });

  document.querySelector(".recap").addEventListener("mousedown", () => {
    navigate("settings");
  });
  document.querySelector(".recap").addEventListener("touchstart", (event) => {
    event.preventDefault(); 
    navigate("settings");
  });

  document.querySelector(".cancelButton").addEventListener("mousedown", () => {
    cancelRound();
  });
  document.querySelector(".cancelButton").addEventListener("touchstart", (event) => {
    event.preventDefault(); 
    cancelRound();
  });

  document.querySelector(".startButton").addEventListener("mousedown", () => {
    startRound();
  });
  document.querySelector(".startButton").addEventListener("touchstart", (event) => {
    event.preventDefault(); 
    startRound();
  });
}

function startRound() {
  secondsRemaining = 5;

  document.querySelector(".timer").innerHTML = convertSecondsToText(secondsRemaining);

  navigate("game");

  intervalId = setInterval(secondTick, 1000);
}

function secondTick() {
  secondsRemaining--;

  if (secondsRemaining == 0) {
    if (!document.querySelector(".cover").classList.contains("hidden")) { //if this is the beginning of the game cover
      secondsRemaining = document.querySelector("#timeLimit").value;
      document.querySelector(".cover").classList.add("hidden");
      displayNewWord();
    } else { //otherwise if it's the end of the game
      navigate("recap");
      clearInterval(intervalId);
    }
  }

  document.querySelector(".timer").innerHTML = convertSecondsToText(secondsRemaining);
}

function convertSecondsToText(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds - (minutes * 60);

  return remainingSeconds < 10 ? minutes + ":0" + remainingSeconds : minutes + ":" + remainingSeconds;
}

function permission () {
  if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
      DeviceMotionEvent.requestPermission()
          .then( response => {
          // (optional) Do something after API prompt dismissed.
          if ( response == "granted" ) {
              window.addEventListener( "devicemotion", (e) => {
                let acceleration = event.accelerationIncludingGravity;
                // Extract device's orientation data (e.g., pitch)
                let pitch = Math.atan2(acceleration.x, Math.sqrt(acceleration.y * acceleration.y + acceleration.z * acceleration.z));

                if (Math.abs(pitch) < 0.75) {
                  waitingForTipUp = true;
                } else if (Math.abs(pitch) > 1.1 && waitingForTipUp) {
                  if (!document.querySelector(".game").classList.contains("hidden")) {
                    triggerNextWord();
                  }
                  waitingForTipUp = false;
                }
              })

              document.querySelector(".permissions").classList.add("hidden");
          }
      })
          .catch( console.error )
  }
}

function triggerNextWord() {
  wordsGuessed++;
  document.querySelector(".wordCount").innerHTML = wordsGuessed;
  displayNewWord();
}

function displayNewWord() {
  let potentialNewWord = data.anything[Math.floor(Math.random() * data.anything.length)];

  while (usedWords.indexOf(potentialNewWord) >= 0) {
    potentialNewWord = data.anything[Math.floor(Math.random() * data.anything.length)];
  }
  usedWords.push(potentialNewWord);

  document.querySelector(".word").innerHTML = potentialNewWord;
}

function cancelRound() {
  navigate("settings");
  clearInterval(intervalId);
}

function navigate(page) {
  document.querySelectorAll(".page").forEach((pageEl) => pageEl.classList.add("hidden"));
  document.querySelector("." + page).classList.remove("hidden");
}