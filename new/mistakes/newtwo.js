var version = "v20.5";
var debugOn = false;

//HTML Definitions
var canvas = document.getElementById("canvas-container");
var cnv = document.getElementById("canvas");
var ctx = cnv.getContext("2d");
var anchor = document.getElementById("anchor");
var rb = document.getElementById("rb"), lb = document.getElementById("lb");

//START counterbalance
var directionCB = [144, 144]; //cw | ccw
var directionReal = [];

var startAngleCB = [72, 72, 72, 72]; //0 | 90 | 180 | 270
var startAngleReal = [];

var framesCB = [96, 96, 96]; //13 | 19 | 25
var framesReal = [];

var numInLastCB = [144, 144]; //1 | 2
var numInLastReal = [], numInLastGuess = [];

var sizeAlternateCB = [144, 144]; // YES | NO
var sizeAlternateReal = [];

var sizeInPenultCB = [144, 144]; //smaller | nosmaller
var sizeInPenultReal = [];

var audioCB = [48, 48, 48, 48, 48, 48]; // 4*3000,0, | 4*600,0, | 0,4*3000 | 0,4*600 | 3,6,3,6, | 6,3,6,3,
var audioReal = [];
// END counterbalance

var redrawCounterMax = 0;
var direction, startAngle, numInLast, penult, hertz, sizeAlternate;

//currentState is 0/1 if latest pressed thing is start/stop
var currentState = -1;

// degree count for cosine and sine
var x = 0;

//counters
var redrawCounter = 0, trialNumberCounter = 0;
var doBreak = false;

var soundSix = document.getElementById("600");
var soundThree = document.getElementById("3000");

document.getElementById("v").innerHTML = version;
clearScreen();

function soundOff(hz) {
  if (hz == 600) {
    soundSix.currentTime = 0;
    soundSix.play();
    debug("600hz");
  } else if (hz == 3000) {
    soundThree.currentTime = 0;
    soundThree.play();
    debug("3000hz");
  }
}

function debug(stuff) { if (debugOn) console.log(stuff); }

function clearScreen() {
  ctx.clearRect(0, 0, 1000, 600);
  ctx.fillStyle = 'rgb(152,152,152)';
  ctx.fillRect(0,0,1000,600);

  ctx.strokeStyle = 'rgb(0,0,255)';
  ctx.fillStyle = 'rgb(0,0,255)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(300, 300, 3, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function circle(angle, radius, hz) {
  debug("drawing circle");
  soundOff(hz);
  ctx.strokeStyle = 'rgb(255,255,255)';
  ctx.fillStyle = 'rgb(255,255,255)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  var a = 200;
  ctx.arc(a * Math.cos(angle * Math.PI / 180) + 300, a * Math.sin(angle * Math.PI / 180) + 300, radius, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function alterCanvas() {
  if (currentState == 0) {
    clearTimeout(window.canvasTimer);
    x = 0;
  }
  
  redraw();
  
  currentState = 0;

  function redraw() {
    if (trialNumberCounter < 288) {
      doBreak = (trialNumberCounter == 95 || trialNumberCounter == 191);
      var size = 20;
      if (redrawCounter == 0) {
        redrawCounterMax = 0;
        direction = "";
        numInLast = 0;
        startAngle = 45;
        penult = "";
        hertz = "";
        sizeAlternate = "";

        debug("-----------------");
        debug("TRIAL "+ (trialNumberCounter+1));

        //Initialize audio
        while (hertz == "") {
          var randomNumber = Math.floor(Math.random() * 6);
          if (randomNumber == 0 && audioCB[0] > 0) {
            hertz = "3333-";
            audioCB[0]--;
          } else if (randomNumber == 1 && audioCB[1] > 0) {
            hertz = "6666-";
            audioCB[1]--;
          } else if (randomNumber == 2 && audioCB[2] > 0) {
            hertz = "-3333";
            audioCB[2]--;
          } else if (randomNumber == 3 && audioCB[3] > 0) {
            hertz = "-6666";
            audioCB[3]--;
          } else if (randomNumber == 4 && audioCB[4] > 0) {
            hertz = "3636";
            audioCB[4]--;
          } else if (randomNumber == 5 && audioCB[5] > 0) {
            hertz = "6363";
            audioCB[5]--;
          }
        }
        debug("AU: " + audioCB.join(" | "));
        
        //Initialize redrawCounterMax
        while (redrawCounterMax == 0) {
          var randomNumberRd = Math.floor(Math.random() * 3);
          if (randomNumberRd == 0 && framesCB[0] > 0) {
            redrawCounterMax = 13;
            framesCB[0]--;
          } else if (randomNumberRd == 1 && framesCB[1] > 0) {
            redrawCounterMax = 19;
            framesCB[1]--;
          } else if (randomNumberRd == 2 && framesCB[2] > 0) {
            redrawCounterMax = 25;
            framesCB[2]--;
          }
        }
        debug("RC: " + framesCB.join(" | "));

        //Initialize direction
        while (direction == "") {
          var randomDirectionNumber = Math.floor(Math.random() * 2);
          if (randomDirectionNumber == 0 && directionCB[0] > 0) {
            direction = "cw";
            directionCB[0]--;
          } else if (randomDirectionNumber == 1 && directionCB[1] > 0) {
            direction = "ccw";
            directionCB[1]--;
          }
        }

        //Initialize sizeAlternate
        while (sizeAlternate == "") {
          var randomsizeAlternateNumber = Math.floor(Math.random() * 2);
          if (randomsizeAlternateNumber == 0 && sizeAlternateCB[0] > 0) {
            sizeAlternate = "true";
            sizeAlternateCB[0]--;
          } else if (randomsizeAlternateNumber == 1 && sizeAlternateCB[1] > 0) {
            sizeAlternate = "false";
            sizeAlternateCB[1]--;
          }
        }


        debug("DI: " + directionCB.join(" | "));

        //Initialize startAngle
        while (startAngle == 45) {
          var randomNumberSA = Math.floor(Math.random() * 4);
          if (randomNumberSA == 0 && startAngleCB[0] > 0) {
            startAngle = 0;
            startAngleCB[0]--;
          } else if (randomNumberSA == 1 && startAngleCB[1] > 0) {
            startAngle = 90;
            startAngleCB[1]--;
          } else if (randomNumberSA == 2 && startAngleCB[2] > 0) {
            startAngle = 180;
            startAngleCB[2]--;
          } else if (randomNumberSA == 3 && startAngleCB[3] > 0) {
            startAngle = 270;
            startAngleCB[3]--;
          }
        }
        x = startAngle;

        debug("SA: " + startAngleCB.join(" | "));

        //init numInLast
        while (numInLast == 0) {
          var randomNumberInLast = Math.floor(Math.random() * 2);
          if (randomNumberInLast == 0 && numInLastCB[0] > 0) {
            numInLast = 1;
            numInLastCB[0]--;
          } else if (randomNumberInLast == 1 && numInLastCB[1] > 0) {
            numInLast = 2;
            numInLastCB[1]--;
          }
        }

        debug("LF: " + numInLastCB.join(" | "));

        //init penultimate
        while (penult == "") {
          var randomNumberPenult = Math.floor((Math.random() * 2));
          if (randomNumberPenult == 0 && sizeInPenultCB[0] > 0) {
            penult = "smallerinpenult";
            sizeInPenultCB[0]--;
          }
          else if (randomNumberPenult == 1 && sizeInPenultCB[1] > 0) {
            penult = "nosmallerinpenult";
            sizeInPenultCB[1]--;
          }
        }

        debug("SP: " + sizeInPenultCB.join(" | "));
        
        directionReal.push(direction);
        startAngleReal.push(startAngle);
        numInLastReal.push(numInLast);
        framesReal.push(redrawCounterMax);
        sizeInPenultReal.push(penult);
        audioReal.push(hertz);
        sizeAlternateReal.push(sizeAlternate);
        
      } else if (redrawCounter < (redrawCounterMax - 2)) {
        clearScreen();
      } else if (redrawCounter == redrawCounterMax - 2) {
        clearScreen();
        if (penult == "smallerinpenult") size = 4;
      } else if (redrawCounter == redrawCounterMax - 1) {
        if (numInLast != 2) {
          clearScreen();
          debug("CLEARING SCREEN BECAUSE ONLY ONE IN LAST");
        }
      } 
      if (redrawCounter <= redrawCounterMax - 1) {
        if (direction == "cw") {
          x += 15;
        } else {
          x -= 15;
        }
      }
      var aud = 0;

      // FIRST FOUR
      if (hertz[4] == "-" && redrawCounter <= 3) {
        if (hertz[redrawCounter] == "6") aud = 600;
        if (hertz[redrawCounter] == "3") aud = 3000;
      }

      // LAST FOUR
      if (hertz[0] == "-" && (redrawCounter >= redrawCounterMax - 4)) {
        var chSum = 5 - (redrawCounterMax - redrawCounter);
        debug("CHSUM: " + chSum);
        debug("hertz[chSum]: " + hertz[chSum] );
        if (hertz[chSum] == "6") aud = 600;
        if (hertz[chSum] == "3") aud = 3000;
      }

      // ALTERNATORS
      if (hertz.length == 4) {
        if (hertz[0] == 3) {
          if (redrawCounter % 2 == 0) { //EVEN
            aud = 3000;
          } else {
            aud = 600;
          }
        } else {
          if (redrawCounter % 2 == 0) { //EVEN
            aud = 600;
          } else {
            aud = 3000;
          }
        }
      }

      //SIZE ALTERNATE
      if (sizeAlternate == "true") {
        if (redrawCounter % 2 == 0) {
          size = 20;
        } else {
          size = 4;
        }
      }

      circle(x, size, aud);

      redrawCounter++;
      
      if (redrawCounter == redrawCounterMax) {
        setTimeout(clearScreen, 80);
        trialNumberCounter++;
        redrawCounter = 0;
        setTimeout(stopButton, 500);
      } else {
        window.canvasTimer = setTimeout(redraw, 80);
      }
      
    } else {
      doneSend();
    }
  }
}

function startButton() {
  
  anchor.onclick = "";
  alterCanvas();
}

function stopButton() {
  currentState = 1;
  clearTimeout(window.canvasTimer);
  getUserInput();
}

function getUserInput() {
  rb.style.display = "block";
  lb.style.display = "block";
  canvas.style.display = "none";
  window.tooLong = setTimeout(doTimeout, 4000);
}

function checkGuess() {
  rb.style.display = "none";
  lb.style.display = "none";
  canvas.style.display = "inline";
  clearTimeout(window.tooLong);
  if (doBreak) alert ("You've just completed 96 trials. Take a break, and press OK when you are finished.");
  setTimeout(startButton, 1000);
}

function doTimeout() {
  numInLastGuess.push(0);
  checkGuess();
}

function pushGuess(guessVal) {
  numInLastGuess.push(guessVal);
  checkGuess();
}

function doneSend() {
  var currentDate = getDateString();
  var message = [
    [currentDate], 
    [
      "Trial Number",
      "Actual # of circles in last frame",
      "Guessed # of circles in last frame",
      "Direction",
      "Start Angle (degrees)",
      "Frames",
      "Size in penultimate frame",
      "Audio",
      "Size alternation"
    ]
  ];

  for (var i = 0; i < 288; i++) {
    message.push(
      [
        i+1,
        numInLastReal[i],
        numInLastGuess[i],
        directionReal[i],
        startAngleReal[i],
        framesReal[i],
        sizeInPenultReal[i],
        audioReal[i],
        sizeAlternateReal[i]
      ]
    );
  }

  var csvRows = [];

  for(var row in message) {
      csvRows.push(message[row].join(','));
  }
  
  var csvString   = csvRows.join("\n");
  var a           = document.createElement("a");
  a.href          = "data:attachment/csv," +  encodeURIComponent(csvString);
  a.target        = "_blank";
  var resultName  = window.prompt("Name for results file?", currentDate);
  if (resultName == null) resultName = currentDate;
  a.download = resultName + ".csv";

  document.body.appendChild(a);
  a.click();
  alert("Finished! Your results have been downloaded.");
}

function getDateString() {
  var now = new Date();
  var format = "{Y}-{M}-{D}";
  var Month = "";
  Month = now.getMonth() + 1;
  if(Month<10) { Month = "0"+Month; }
  format = format.replace(/\{M\}/g,Month);
  var Mday = "";
  Mday = now.getDate();
  if(Mday<10) { Mday = "0"+Mday; }
  format = format.replace(/\{D\}/g,Mday);
  var Year = "";
  Year = now.getFullYear();
  format = format.replace(/\{Y\}/g,Year);
  return format;
}

function textsizer(e) {
    var evtobj = window.event? event : e //distinguish between IE's explicit event object (window.event) and Firefox's implicit.
    var unicode = evtobj.charCode? evtobj.charCode : evtobj.keyCode
    var actualkey = String.fromCharCode(unicode)
    if (actualkey == "z" && lb.style.display == "block")
        pushGuess(1);
    if (actualkey == "m" && rb.style.display == "block")
        pushGuess(2);
}

document.onkeypress = textsizer;
