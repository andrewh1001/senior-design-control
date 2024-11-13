const upButton = document.getElementById('up');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const downButton = document.getElementById('down');
const toggleButton = document.getElementById('toggle-btn');

var click = function(e) {
    document.getElementById('result').innerHTML = this.id;
};

var start = function(e) {
    console.log(e);

    if (e.type === "click" && e.button !== 0) {
        return;
    }

    this.classList.add("active");
    document.getElementById('result').innerHTML = this.id + " pressed";
    return false;
};

var cancel = function(e) {
    this.classList.remove("active");
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
    right: false,
    space: false
};

document.addEventListener('keydown', function(e) {
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

    if (!toggleButton.disabled) {
        console.log(e.code)
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
        if(e.code == "Space") {
            keyState.space = true;
        }
        handleMovement();
    }
});

upButton.addEventListener("touchstart", () => {
    keyState.up = true;
    handleMovement();
});
upButton.addEventListener("touchend", () => {
    keyState.up = false;
    handleMovement();
});

downButton.addEventListener("touchstart", () => {
    keyState.down = true;
    handleMovement();
});
downButton.addEventListener("touchend", () => {
    keyState.down = false;
    handleMovement();
});

leftButton.addEventListener("touchstart", () => {
    keyState.left = true;
    handleMovement();
});
leftButton.addEventListener("touchend", () => {
    keyState.left = false;
    handleMovement();
});

rightButton.addEventListener("touchstart", () => {
    keyState.right = true;
    handleMovement();
});
rightButton.addEventListener("touchend", () => {
    keyState.right = false;
    handleMovement();
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
        if(e.code == "Space") {
            keyState.space = false;
        }
        handleMovement();
    }
});

function handleMovement() {
    if (keyState.left) {
        leftButton.classList.add("active");
        result.innerHTML = "Left key pressed";
        writePwmValue(0x6428);
    } else if (keyState.right) {
        rightButton.classList.add("active");
        result.innerHTML = "Right key pressed";
        writePwmValue(0x6478);
    } else if (keyState.up) {
        upButton.classList.add("active");
        result.innerHTML = "Up key pressed";
        writePwmValue(0x5050);
    } else if (keyState.down) {
        downButton.classList.add("active");
        result.innerHTML = "Down key pressed";
        writePwmValue(0xB450);
    } else if (keyState.space) {
        result.innerHTML = "STOP";
        writePwmValue(0x0050);
    }

}

const connectButton = document.getElementById('connectBleButton');
const disconnectButton = document.getElementById('disconnectBleButton');
const setPwmButton = document.getElementById('setPwmButton');
const pwmValueInput = document.getElementById('pwmValueInput');
const latestValueSent = document.getElementById('valueSent');
const bleStateContainer = document.getElementById('bleState');

var deviceName = 'ESP32';
var bleService = '19b10000-e8f2-537e-4f6c-d104768a1214';
var ledCharacteristic = '19b10002-e8f2-537e-4f6c-d104768a1214';

var bleServer;
var bleServiceFound;

// Connect Button (search for BLE Devices)
connectButton.addEventListener('click', () => {
    if (isWebBluetoothEnabled()){
        connectToDevice();
    }
});

disconnectButton.addEventListener('click', disconnectDevice);

setPwmButton.addEventListener('click', () => {
    const angle = parseInt(document.getElementById('angleInput').value);
    const speed = parseInt(document.getElementById('speedInput').value);

    if (angle >= 40 && angle <= 120 && speed >= 0 && speed <= 200) {
        writePwmValue((speed << 8) + angle);
    } else {
        console.error("Invalid values! Please enter a number between 0 and 255 for both angle and speed.");
    }
});

function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
        console.log("Web Bluetooth API is not available in this browser!");
        bleStateContainer.innerHTML = "Web Bluetooth API is not available in this browser!";
        return false;
    }
    console.log('Web Bluetooth API supported in this browser.');
    return true;
}

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

function writePwmValue(value) {
    if (bleServer && bleServer.connected) {
        bleServiceFound.getCharacteristic(ledCharacteristic)
        .then(characteristic => {
            console.log("Found the LED characteristic: ", characteristic.uuid);
            const data = new Uint16Array([value]);
            return characteristic.writeValue(data);
        })
        .then(() => {
            let angle = value & 0xFF;
            let speed = (value >> 8) & 0xFF;

            latestValueSent.innerHTML = `Speed: ${speed}, Angle: ${angle}`;
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