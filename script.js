const upButton = document.getElementById('up');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const downButton = document.getElementById('down');
const toggleButton = document.getElementById('toggle-btn');

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

const keyState = {
    up: false,
    down: false,
    left: false,
    right: false
};

document.addEventListener('keydown', function(e) {
    // Enable/disable toggle button with "t"
    if (e.key == "t") {
        toggleButton.disabled = !toggleButton.disabled;
        if (toggleButton.disabled) {
            result.innerHTML = "Button Disabled";
            writePwmValue(0xffff);
        } else {
            result.innerHTML = "Button Enabled";
            writePwmValue(0x0000);
        }
        return;
    }

    // Handle movement keys if toggle button is enabled
    if (!toggleButton.disabled) {
        switch (e.key) {
            case "ArrowUp":
            case "w":
                keyState.up = true;
                break;
            case "ArrowDown":
            case "s":
                keyState.down = true;
                break;
            case "ArrowLeft":
            case "a":
                keyState.left = true;
                break;
            case "ArrowRight":
            case "d":
                keyState.right = true;
                break;
        }
        handleMovement();
    }
});

document.addEventListener('keyup', function(e) {
    if (!toggleButton.disabled) {
        switch (e.key) {
            case "ArrowUp":
            case "w":
                keyState.up = false;
                upButton.classList.remove("active");
                break;
            case "ArrowDown":
            case "s":
                keyState.down = false;
                downButton.classList.remove("active");
                break;
            case "ArrowLeft":
            case "a":
                keyState.left = false;
                leftButton.classList.remove("active");
                break;
            case "ArrowRight":
            case "d":
                keyState.right = false;
                rightButton.classList.remove("active");
                break;
        }
        handleMovement();
    }
});

function handleMovement() {
    // Handle simultaneous pressing of keys
    if (keyState.left && keyState.up) {
        leftButton.classList.add("active");
        upButton.classList.add("active");
        result.innerHTML = "Up and Left keys pressed";
        writePwmValue(65); // Custom PWM value for diagonal movement
    } else if (keyState.right && keyState.up) {
        rightButton.classList.add("active");
        upButton.classList.add("active");
        result.innerHTML = "Up and Right keys pressed";
        writePwmValue(115); // Custom PWM value for diagonal movement
    } else if (keyState.left && keyState.down) {
        leftButton.classList.add("active");
        downButton.classList.add("active");
        result.innerHTML = "Down and Left keys pressed";
        // Add logic here for simultaneous down + left
    } else if (keyState.right && keyState.down) {
        rightButton.classList.add("active");
        downButton.classList.add("active");
        result.innerHTML = "Down and Right keys pressed";
        // Add logic here for simultaneous down + right
    }
    // Individual key presses
    else if (keyState.left) {
        leftButton.classList.add("active");
        result.innerHTML = "Left key pressed";
        writePwmValue(0x6478);
    } else if (keyState.right) {
        rightButton.classList.add("active");
        result.innerHTML = "Right key pressed";
        writePwmValue(0x6428);
    } else if (keyState.up) {
        upButton.classList.add("active");
        result.innerHTML = "Up key pressed";
        writePwmValue(0x6450);
    } else if (keyState.down) {
        downButton.classList.add("active");
        result.innerHTML = "Down key pressed";
        writePwmValue(0x0050);
    }
}



// DOM Elements
const connectButton = document.getElementById('connectBleButton');
const disconnectButton = document.getElementById('disconnectBleButton');
const setPwmButton = document.getElementById('setPwmButton');
const pwmValueInput = document.getElementById('pwmValueInput');
const latestValueSent = document.getElementById('valueSent');
const bleStateContainer = document.getElementById('bleState');

// Define BLE Device Specs
var deviceName = 'ESP32';
var bleService = '19b10000-e8f2-537e-4f6c-d104768a1214';
var ledCharacteristic = '19b10002-e8f2-537e-4f6c-d104768a1214';

// Global Variables to Handle Bluetooth
var bleServer;
var bleServiceFound;

// Connect Button (search for BLE Devices)
connectButton.addEventListener('click', () => {
    if (isWebBluetoothEnabled()){
        connectToDevice();
    }
});

// Disconnect Button
disconnectButton.addEventListener('click', disconnectDevice);

// Set PWM Value Button
setPwmButton.addEventListener('click', () => {
    const pwmValue = parseInt(pwmValueInput.value);
    // if (pwmValue >= 0 && pwmValue <= 180) {
    //     writePwmValue(pwmValue);
    // } else {
    //     console.error("Invalid PWM value! Please enter a number between 0 and 255.");
    // }
    writePwmValue(pwmValue)
});

// Check if BLE is available in your browser
function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
        console.log("Web Bluetooth API is not available in this browser!");
        bleStateContainer.innerHTML = "Web Bluetooth API is not available in this browser!";
        return false;
    }
    console.log('Web Bluetooth API supported in this browser.');
    return true;
}

// Connect to BLE Device and Enable Notifications
function connectToDevice() {
    console.log('Initializing Bluetooth...');
    navigator.bluetooth.requestDevice({
        filters: [{ name: deviceName }],
        optionalServices: [bleService]
    })
    .then(device => {
        console.log('Device Selected:', device.name);
        bleStateContainer.innerHTML = 'Connected to device ' + device.name;
        bleStateContainer.style.color = "#24af37";
        device.addEventListener('gattservicedisconnected', onDisconnected);
        return device.gatt.connect();
    })
    .then(gattServer => {
        bleServer = gattServer;
        console.log("Connected to GATT Server");
        return bleServer.getPrimaryService(bleService);
    })
    .then(service => {
        bleServiceFound = service;
        console.log("Service discovered:", service.uuid);
        return service.getCharacteristic(ledCharacteristic);
    })
    .then(characteristic => {
        console.log("LED characteristic discovered:", characteristic.uuid);
        // No notifications for sensor characteristic, just read its value if needed
    })
    .catch(error => {
        console.log('Error: ', error);
    });
}

function onDisconnected(event) {
    console.log('Device Disconnected:', event.target.device.name);
    bleStateContainer.innerHTML = "Device disconnected";
    bleStateContainer.style.color = "#d13a30";
    connectToDevice();
}

// Write the PWM value to the ESP32 BLE Characteristic
function writePwmValue(value) {
    if (bleServer && bleServer.connected) {
        bleServiceFound.getCharacteristic(ledCharacteristic)
        .then(characteristic => {
            console.log("Found the LED characteristic: ", characteristic.uuid);
            const data = new Uint16Array([value]);
            return characteristic.writeValue(data);
        })
        .then(() => {
            latestValueSent.innerHTML = value;
            console.log("Value written to LED characteristic:", value.toString(16));
        })
        .catch(error => {
            console.error("Error writing to the LED characteristic: ", error);
        });
    } else {
        console.error("Bluetooth is not connected. Cannot write to characteristic.");
        window.alert("Bluetooth is not connected. Cannot write to characteristic. Connect to BLE first!");
    }
}

function disconnectDevice() {
    console.log("Disconnect Device.");
    if (bleServer && bleServer.connected) {
        bleServer.disconnect()
            .then(() => {
                console.log("Device Disconnected");
                bleStateContainer.innerHTML = "Device Disconnected";
                bleStateContainer.style.color = "#d13a30";
            })
            .catch(error => {
                console.log("An error occurred:", error);
            });
    } else {
        console.error("Bluetooth is not connected.");
        window.alert("Bluetooth is not connected.");
    }
}