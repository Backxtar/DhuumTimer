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
var div = document.getElementById('alerts');
var audio = new Audio('sounds/notification.wav');
audio.volume = 0.3;
var msg = new SpeechSynthesisUtterance();
msg.lang = "en-US";

var green1 = document.getElementById('green1');
var green2 = document.getElementById('green2');
var green3 = document.getElementById('green3');
var ss = document.getElementById('ss');

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
    if (wholeTime < 600) {
        div.innerHTML = `<h2 id="fight_alert">TIMER NEEDS TO BE BIGGER THAN 10 MIN!</h2>`;
    } else {
        if (isStarted === false) {

            if (wholeTime > 600) {
                let minutes = Math.floor(wholeTime/ 60);
                let seconds = wholeTime % 60;
                let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                div.innerHTML = `<h2 id="fight_alert">${displayString} ➞ COUNTDOWN HAST STARTED!</h2>`;
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
}

function getHTML(time, green, icon) {
    const display = `<h2 id="fight_alert">${time} ➞ GREEN ${green} TO </h2>`;
    var add = null;

    switch (icon) {
        case 'arrow' :
            add = display.concat(`<img class="marks" src="images/tags/arrow_marker.png">`);
            break;
        case 'circle' :
            add = display.concat(`<img class="marks" src="images/tags/circle_marker.png">`);
            break;
        case 'heart' :
            add = display.concat(`<img class="marks" src="images/tags/heart_marker.png">`);
            break;
        case 'square' :
            add = display.concat(`<img class="marks" src="images/tags/square_marker.png">`);
            break;
        case 'star' :
            add = display.concat(`<img class="marks" src="images/tags/star_marker.png">`);
            break;
        case 'spiral' :
            add = display.concat(`<img class="marks" src="images/tags/spiral_marker.png">`);
            break;
        case 'triangle' :
            add = display.concat(`<img class="marks" src="images/tags/triangle_marker.png">`);
            break;
    } 
    return add;
}

function displayTimeLeft(timeLeft) { //displays time on the input
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    displayOutput.textContent = displayString;
    update(timeLeft, wholeTime);

    if (isStarted) {
        //6:25, 5:05, 3:45, 2:25, 1:05 SS
        switch (timeLeft) {
            case 385 :
            case 305 :
            case 225 :
            case 145 :
            case 65 :
                div.innerHTML = `<h2 id="fight_alert">${displayString} ➞ SOULSPLIT!</h2>`;
                if (ss.checked) {
                    audio.play();
                }
                break;
            case 599 :
                div.innerHTML = `<h2 id="fight_alert">${displayString} ➞ FIGHT!</h2>`;
                msg.text = "FIGHT!";
                window.speechSynthesis.speak(msg);
                break
            case 580 :
                div.innerHTML = getHTML(displayString, '1', 'arrow');
                if (green1.checked) {
                    msg.text = "Green one to ARROW!";
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 570 :
            case 480 :
            case 390 :
            case 300 :
            case 210 :
            case 120 :
            case 30 :
                div.innerHTML = `<h2 id="fight_alert">${displayString} ➞ GREEN 1 GOES UP!</h2>`;
                if (green1.checked) {
                    msg.text = "Green one goes UP!";
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 550 :
                div.innerHTML = getHTML(displayString, '2', 'circle');
                if (green2.checked) {
                    msg.text = "Green two to CIRCLE!";
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 540 :
            case 450 :
            case 360 :
            case 270 :
            case 180 :
            case 90 :
                div.innerHTML = `<h2 id="fight_alert">${displayString} ➞ GREEN 2 GOES UP!</h2>`;
                if (green2.checked) {
                    msg.text = "Green two goes UP!";
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 520 :
                div.innerHTML = getHTML(displayString, '3', 'heart');
                if (green3.checked) {
                    msg.text = "Green three to HEART!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 510 :
            case 420 :
            case 330 :
            case 240 :
            case 150 :
            case 60 :
                div.innerHTML = `<h2 id="fight_alert">${displayString} ➞ GREEN 3 GOES UP!</h2>`;
                if (green3.checked) {
                    msg.text = "Green three goes UP!";
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 490 :
                div.innerHTML = getHTML(displayString, '1', 'square');
                if (green1.checked) {
                    msg.text = "Green one to SQUARE!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 460 :
                div.innerHTML = getHTML(displayString, '2', 'star');
                if (green2.checked) {
                    msg.text = "Green two to STAR!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 430 :
                div.innerHTML = getHTML(displayString, '3', 'spiral');
                if (green3.checked) {
                    msg.text = "Green three to SPIRAL!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 400 :
                div.innerHTML = getHTML(displayString, '1', 'triangle');
                if (green1.checked) {
                    msg.text = "Green one to TRIANGLE!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 370 :
                div.innerHTML = getHTML(displayString, '2', 'arrow');
                if (green2.checked) {
                    msg.text = "Green two to ARROW!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 340 :
                div.innerHTML = getHTML(displayString, '3', 'circle');
                if (green3.checked) {
                    msg.text = "Green three to CIRCLE!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 310 :
                div.innerHTML = getHTML(displayString, '1', 'heart');
                if (green1.checked) {
                    msg.text = "Green one to HEART!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 280 :
                div.innerHTML = getHTML(displayString, '2', 'square');
                if (green2.checked) {
                    msg.text = "Green two to SQUARE!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 250 :
                div.innerHTML = getHTML(displayString, '3', 'star');
                if (green3.checked) {
                    msg.text = "Green three to STAR!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 220 :
                div.innerHTML = getHTML(displayString, '1', 'spiral');
                if (green1.checked) {
                    msg.text = "Green one to SPIRAL!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 190 :
                div.innerHTML = getHTML(displayString, '2', 'triangle');
                if (green2.checked) {
                    msg.text = "Green two to TRIANGLE!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 160 :
                div.innerHTML = getHTML(displayString, '3', 'arrow');
                if (green3.checked) {
                    msg.text = "Green three to ARROW!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 130 :
                div.innerHTML = getHTML(displayString, '1', 'circle');
                if (green1.checked) {
                    msg.text = "Green one to CIRCLE!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 100 :
                div.innerHTML = getHTML(displayString, '2', 'heart');
                if (green2.checked) {
                    msg.text = "Green two to HEART!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 70 :
                div.innerHTML = getHTML(displayString, '3', 'square');
                if (green3.checked) {
                    msg.text = "Green three to SQUARE!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 40 :
                div.innerHTML = getHTML(displayString, '1', 'star');
                if (green1.checked) {
                    msg.text = "Green one to STAR!";                
                    window.speechSynthesis.speak(msg);
                }
                break;
            case 0 :
                div.innerHTML = `<h2 id="fight_alert">${displayString} ➞ DHUUM SHOULD BE DEAD!</h2>`;
                msg.text = "DHUUM should be dead!";                
                window.speechSynthesis.speak(msg);
                break;
        }
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