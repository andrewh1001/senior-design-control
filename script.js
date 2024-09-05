// Select the buttons by their ID
const upButton = document.getElementById('up');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const downButton = document.getElementById('down');

var result = "None"
// Add event listeners to each button
upButton.addEventListener('click', () => {
    console.log('Up button pressed');
    result = "up";
    document.getElementById('result').innerHTML = result;
});

leftButton.addEventListener('click', () => {
    console.log('Left button pressed');
    result = "left";
    document.getElementById('result').innerHTML = result;
});

rightButton.addEventListener('click', () => {
    console.log('Right button pressed');
    result = "right";
    document.getElementById('result').innerHTML = result;
});


downButton.addEventListener('click', () => {
    console.log('Down button pressed');
    result = "down";
    document.getElementById('result').innerHTML = result;
});

var node = document.getElementsByTagName("p")[0];
var longpress = false;
var presstimer = null;
var longtarget = null;

var cancel = function(e) {
    if (presstimer !== null) {
        clearTimeout(presstimer);
        presstimer = null;
    }

    this.classList.remove("longpress");
};

var click = function(e) {
    if (presstimer !== null) {
        clearTimeout(presstimer);
        presstimer = null;
    }

    this.classList.remove("longpress");

    if (longpress) {
        return false;
    }

    alert("press");
};

var start = function(e) {
    console.log(e);

    if (e.type === "click" && e.button !== 0) {
        return;
    }

    longpress = false;

    this.classList.add("longpress");

    if (presstimer === null) {
        presstimer = setTimeout(function() {
            alert("long click");
            longpress = true;
        }, 1000);
    }

    return false;
};

node.addEventListener("mousedown", start);
node.addEventListener("touchstart", start);
node.addEventListener("click", click);
node.addEventListener("mouseout", cancel);
node.addEventListener("touchend", cancel);
node.addEventListener("touchleave", cancel);
node.addEventListener("touchcancel", cancel);
