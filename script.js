const upButton = document.getElementById('up');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const downButton = document.getElementById('down');

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

    document.getElementById('result').innerHTML = this.id;
};

var start = function(e) {
    console.log(e);

    if (e.type === "click" && e.button !== 0) {
        return;
    }

    longpress = false;

    this.classList.add("longpress");
    id = this.id
    if (presstimer === null) {
        presstimer = setTimeout(function() {
            document.getElementById('result').innerHTML = id + " long pressed";
            longpress = true;
        }, 1000);
    }

    return false;
};

upButton.addEventListener("mousedown", start);
upButton.addEventListener("touchstart", start);
upButton.addEventListener("click", click);
upButton.addEventListener("mouseout", cancel);
upButton.addEventListener("touchend", cancel);
upButton.addEventListener("touchleave", cancel);
upButton.addEventListener("touchcancel", cancel);

downButton.addEventListener("mousedown", start);
downButton.addEventListener("touchstart", start);
downButton.addEventListener("click", click);
downButton.addEventListener("mouseout", cancel);
downButton.addEventListener("touchend", cancel);
downButton.addEventListener("touchleave", cancel);
downButton.addEventListener("touchcancel", cancel);

leftButton.addEventListener("mousedown", start);
leftButton.addEventListener("touchstart", start);
leftButton.addEventListener("click", click);
leftButton.addEventListener("mouseout", cancel);
leftButton.addEventListener("touchend", cancel);
leftButton.addEventListener("touchleave", cancel);
leftButton.addEventListener("touchcancel", cancel);

rightButton.addEventListener("mousedown", start);
rightButton.addEventListener("touchstart", start);
rightButton.addEventListener("click", click);
rightButton.addEventListener("mouseout", cancel);
rightButton.addEventListener("touchend", cancel);
rightButton.addEventListener("touchleave", cancel);
rightButton.addEventListener("touchcancel", cancel);
