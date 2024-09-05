// Select the buttons by their ID
const upButton = document.getElementById('up');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const downButton = document.getElementById('down');

// Add event listeners to each button
upButton.addEventListener('click', () => {
    console.log('Up button pressed');
});

leftButton.addEventListener('click', () => {
    console.log('Left button pressed');
});

rightButton.addEventListener('click', () => {
    console.log('Right button pressed');
});

downButton.addEventListener('click', () => {
    console.log('Down button pressed');
});
