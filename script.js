document.addEventListener('DOMContentLoaded', () => {
    const logWaterButton = document.getElementById('log-water-button');
    const waterCountSpan = document.getElementById('water-count');
    const logWorkoutButton = document.getElementById('log-workout-button')
    const workoutInput = document.getElementById('workout-input');
    const workoutList = document.getElementById('workout-list');
    setupWaterLogger(logWaterButton, waterCountSpan);
    setupWorkoutLogger(logWorkoutButton, workoutInput, workoutList);
});
function setupWaterLogger(button, display) {
    let waterCount = 0;
    button.addEventListener('click', () => {
        waterCount++;
        display.textContent = waterCount;
    })
}
function setupWorkoutLogger(button, input, list) {
    button.addEventListener('click', () => {
        const workoutText = input.value.trim();
        if (workoutText !== "") {
            addWorkoutToList(workoutText, list);
            input.value = "";
        }});
}
function addWorkoutToList(text, list) {
    const newListItem = document.createElement('li');
    newListItem.textContent = text;
    list.appendChild(newListItem);
}