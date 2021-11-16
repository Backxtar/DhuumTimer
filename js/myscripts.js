//circle start
let progressBar = document.querySelector('.e-c-progress');
let indicator = document.getElementById('e-indicator');
let pointer = document.getElementById('e-pointer');
let length = Math.PI * 2 * 100;

progressBar.style.strokeDasharray = length;

function update(value, timePercent) {
    var offset = - length - length * value / (timePercent);
    progressBar.style.strokeDashoffset = offset;
    pointer.style.transform = `rotate(${360 * value / (timePercent)}deg)`;
};

//circle ends
const displayOutput = document.querySelector('.display-remain-time')
const pauseBtn = document.getElementById('pause');
const setterBtns = document.querySelectorAll('button[data-setter]');
const fightAlert = document.getElementById('fight_alert');
var msg = new SpeechSynthesisUtterance();

let intervalTimer;
let timeLeft;
let wholeTime = 10 * 60; // manage this to set the whole time 
let isPaused = false;
let isStarted = false;


update(wholeTime, wholeTime); //refreshes progress bar
displayTimeLeft(wholeTime);

function changeWholeTime(seconds) {
    if ((wholeTime + seconds) > 0) {
        wholeTime += seconds;
        update(wholeTime, wholeTime);
    }
}

for (var i = 0; i < setterBtns.length; i++) {
    setterBtns[i].addEventListener("click", function (event) {
        var param = this.dataset.setter;
        switch (param) {
            case 'minutes-plus':
                changeWholeTime(1 * 60);
                break;
            case 'minutes-minus':
                changeWholeTime(-1 * 60);
                break;
            case 'seconds-plus':
                changeWholeTime(1);
                break;
            case 'seconds-minus':
                changeWholeTime(-1);
                break;
        }
        displayTimeLeft(wholeTime);
    });
}

function timer(seconds) { //counts time, takes seconds
    let remainTime = Date.now() + (seconds * 1000);
    displayTimeLeft(seconds);

    intervalTimer = setInterval(function () {
        timeLeft = Math.round((remainTime - Date.now()) / 1000);
        if (timeLeft < 0) {
            clearInterval(intervalTimer);
            isStarted = false;
            setterBtns.forEach(function (btn) {
                btn.disabled = false;
                btn.style.opacity = 1;
            });
            displayTimeLeft(wholeTime);
            pauseBtn.classList.remove('pause');
            pauseBtn.classList.add('play');
            return;
        }
        displayTimeLeft(timeLeft);
    }, 1000);
}
function pauseTimer(event) {
    if (isStarted === false) {

        if (wholeTime > 600) {
            let minutes = Math.floor(wholeTime/ 60);
            let seconds = wholeTime % 60;
            let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            fightAlert.innerHTML = `${displayString} ➞ Count down has STARTED!`;
        }

        timer(wholeTime);
        isStarted = true;
        this.classList.remove('play');
        this.classList.add('pause');

        setterBtns.forEach(function (btn) {
            btn.disabled = true;
            btn.style.opacity = 0.5;
        });

    } else if (isPaused) {
        this.classList.remove('play');
        this.classList.add('pause');
        timer(timeLeft);
        isPaused = isPaused ? false : true
    } else {
        this.classList.remove('pause');
        this.classList.add('play');
        clearInterval(intervalTimer);
        isPaused = isPaused ? false : true;
    }
}

function displayTimeLeft(timeLeft) { //displays time on the input
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    displayOutput.textContent = displayString;
    update(timeLeft, wholeTime);


    switch (timeLeft) {
        case 599 :
            fightAlert.innerHTML = `${displayString} ➞ FIGHT!`;
            msg.text = "FIGHT!";
            window.speechSynthesis.speak(msg);
            break
        case 580 :
            fightAlert.innerHTML = `${displayString} ➞ Green 1 to ARROW!`;
            msg.text = "Green one to ARROW!";
            window.speechSynthesis.speak(msg);
            break;
        case 570 :
            fightAlert.innerHTML = `${displayString} ➞ Green 1 goes UP!`;
            msg.text = "Green one goes UP!";
            window.speechSynthesis.speak(msg);
            break;
        case 550 :
            fightAlert.innerHTML = `${displayString} ➞ Green 2 to CIRCLE!`;
            msg.text = "Green two to CIRCLE!";
            window.speechSynthesis.speak(msg);
            break;
        case 540 :
            fightAlert.innerHTML = `${displayString} ➞ Green 2 goes UP!`;
            msg.text = "Green two goes UP!";
            window.speechSynthesis.speak(msg);
            break;
    }
}

pauseBtn.addEventListener('click', pauseTimer);


(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-46156385-1', 'cssscript.com');
ga('send', 'pageview');