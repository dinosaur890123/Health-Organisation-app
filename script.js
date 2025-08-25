document.addEventListener('DOMContentLoaded', () => {
    const logWaterButton = document.getElementById('log-water-button');
    const waterCountSpan = document.getElementById('water-count');
    const logWorkoutButton = document.getElementById('log-workout-button')
    const workoutInput = document.getElementById('workout-input');
    const workoutList = document.getElementById('workout-list');
    setupWaterLogger(logWaterButton, waterCountSpan);
    setupWorkoutLogger(logWorkoutButton, workoutInput, workoutList)
});
function setupWaterLogger(button, display) {
    let waterCount = 0;
    logWaterButton.addEventListener('click', () => {
        waterCount++;
        waterCountSpan.textContent = waterCount;
    })
}
function setupWorkoutLogger(button, input, list) {
    logWorkoutButton.addEventListener('click', () => {
        const workoutText = workoutInput.value.trim();
        if (workoutText !== "") {
            addWorkoutToList(workoutText)
            input.value = "";
        }});
}
function addWorkoutToList(text) {
    const newListItem = document.getElementById('li');
    newListItem.textContent = text;
    list.appendChild(newListItem);
}