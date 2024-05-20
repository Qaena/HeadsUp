var secondsRemaining;
var intervalId;

function startButton() {
  secondsRemaining = 5;

  document.querySelector(".timer").innerHTML = convertSecondsToText(secondsRemaining);

  document.querySelector(".settingsPage").classList.add("hidden");
  document.querySelector(".gamePage").classList.remove("hidden");

  intervalId = setInterval(secondTick, 1000);
}

function secondTick() {
  secondsRemaining--;

  if (secondsRemaining == 0) {
    if (!document.querySelector(".cover").classList.contains("hidden")) { //if this is the beginning of the game cover
      secondsRemaining = document.querySelector("#timeLimit").value;
      document.querySelector(".cover").classList.add("hidden");
    } else { //otherwise if it's the end of the game

      document.querySelector(".cover").classList.remove("hidden");

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
                  document.querySelector(".orientationTest").innerHTML = pitch;

                
                  if (Math.abs(pitch) < 0.75) {
                    waitingForTipUp = true;
                  } else if (Math.abs(pitch) > 1.1 && waitingForTipUp) {
                    triggerNextWord();
                  }
              })
          }
      })
          .catch( console.error )
  } else {
      alert( "DeviceMotionEvent is not defined" );
  }
}
