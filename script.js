// Function to show clock
function realTimeClock() {
    let d = new Date();
    let s = d.getSeconds();
    let m = d.getMinutes();
    let h = d.getHours();
    let amPM = ( h < 12 ) ? "AM" : "PM";

    h = ( h > 12 ) ? h - 12 : h;
    h = ("0" + h).slice(-2);
    m = ("0" + m).slice(-2);
    s = ("0" + s).slice(-2);

    document.getElementById('clock').innerHTML = 
        h + ":" + m + " " + amPM;
    let t = setTimeout(realTimeClock, 500);
}

// Pomodoro timers start
const timer = {
    pomodoro: 1,
    shortBreak: 10,
    longBreak: 15,
    longBreakInterval: 2,
    sessions: 0,
};

function updateTimer() {
    // Prompt the user for new values for the timer properties
    const newPomodoro = prompt("Enter new value for Pomodoro (in minutes):", timer.pomodoro);
    const newShortBreak = prompt("Enter new value for Short Break (in minutes):", timer.shortBreak);
    const newLongBreak = prompt("Enter new value for Long Break (in minutes):", timer.longBreak);
    const newLongBreakInterval = prompt("Enter new value for Long Break Interval:", timer.longBreakInterval);
    const newSessions = prompt("Enter new value for Sessions:", timer.sessions);
  
    // Update the timer object properties with the new values
    timer.pomodoro = parseInt(newPomodoro) || timer.pomodoro;
    timer.shortBreak = parseInt(newShortBreak) || timer.shortBreak;
    timer.longBreak = parseInt(newLongBreak) || timer.longBreak;
    timer.longBreakInterval = parseInt(newLongBreakInterval) || timer.longBreakInterval;
    timer.sessions = parseInt(newSessions) || timer.sessions;
  
    // Display the updated timer object in the console
    console.log(timer);
}

let interval;

// Button sounds
const buttonSound = new Audio('button-sound.mp3');
const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
buttonSound.play();
const { action } = mainButton.dataset;
if (action === 'start') {
    startTimer();
} else {
    stopTimer();
}
});

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds,
    };
}

// Start timer
function startTimer() {
let { total } = timer.remainingTime;
const endTime = Date.parse(new Date()) + total * 1000;

if (timer.mode === 'pomodoro') timer.sessions++;

mainButton.dataset.action = 'stop';
mainButton.textContent = 'stop';
mainButton.classList.add('active');

interval = setInterval(function() {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
    clearInterval(interval);

    switch (timer.mode) {
        case 'pomodoro':
        if (timer.sessions % timer.longBreakInterval === 0) {
            switchMode('longBreak');
        } else {
            switchMode('shortBreak');
        }
        break;
        default:
        switchMode('pomodoro');
    }

    if (Notification.permission === 'granted') {
        const text =
        timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
        new Notification(text);
    }

    document.querySelector(`[data-sound="${timer.mode}"]`).play();

    startTimer();
    }
}, 1000);
}

function stopTimer() {
clearInterval(interval);

mainButton.dataset.action = 'start';
mainButton.textContent = 'start';
mainButton.classList.remove('active');
}

function updateClock() {
const { remainingTime } = timer;
const minutes = `${remainingTime.minutes}`.padStart(2, '0');
const seconds = `${remainingTime.seconds}`.padStart(2, '0');

const min = document.getElementById('js-minutes');
const sec = document.getElementById('js-seconds');
min.textContent = minutes;
sec.textContent = seconds;

const text =
    timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
document.title = `${minutes}:${seconds} — ${text}`;

const progress = document.getElementById('js-progress');
progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

function switchMode(mode) {
timer.mode = mode;
timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
};

document
    .querySelectorAll('button[data-mode]')
    .forEach(e => e.classList.remove('active'));
document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
document.body.style.backgroundColor = `var(--${mode})`;
document
    .getElementById('js-progress')
    .setAttribute('max', timer.remainingTime.total);

updateClock();
}

function handleMode(event) {
const { mode } = event.target.dataset;

if (!mode) return;

switchMode(mode);
stopTimer();
}

document.addEventListener('DOMContentLoaded', () => {
if ('Notification' in window) {
    if (
    Notification.permission !== 'granted' &&
    Notification.permission !== 'denied'
    ) {
    Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
        new Notification(
            'Awesome! You will be notified at the start of each session'
        );
        }
    });
    }
}

switchMode('pomodoro');
});

// Weather API Function
window.addEventListener('load', () => {
    let lon;
    let lat;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            const api = `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${lat}&lon=${lon}&appid=00bb4bd862d711b907fa4df4b0287b45`;

            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const { name } = data;
                    const { icon, description } = data.weather[0];
                    const { temp, humidity } = data.main;
                    const { speed } = data.wind;
                    console.log(name, icon, description, temp, humidity, speed);
                    
                    document.querySelector('.place').innerText = name;
                    document.querySelector('.icon').src = "https://openweathermap.org/img/wn/" + icon + ".png";
                    document.querySelector('.tempdegree').innerText = temp + "°F";
                    document.querySelector('.description').innerText = description;
                    document.querySelector('.wind').innerText = "Wind Speed: " + speed + " mph";
                })
        });
    }
});

var timerDisplay = document.getElementById("timer");
var startTime = new Date();
var timerInterval = setInterval(function() {
  var currentTime = new Date();
  var timeElapsed = Math.floor((currentTime - startTime) / 1000);
  var hours = Math.floor(timeElapsed / 3600);
  var minutes = Math.floor((timeElapsed % 3600) / 60);
  var seconds = timeElapsed % 60;
  timerDisplay.innerHTML = "Timer: " + ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
}, 1000);

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
