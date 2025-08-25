document.addEventListener('DOMContentLoaded', () => {
    setupWaterLogger();
    setupWorkoutLogger()
});
function setupWaterLogger() {
    const logWaterButton = document.getElementById('log-water-button');
    const waterCountSpan = document.getElementById('water-count');
    let waterCount = 0;
    logWaterButton.addEventListener('click', () => {
        waterCount++;
        waterCountSpan.textContent = waterCount;
    })
}
function setupWorkoutLogger() {
    const logWorkoutButton = document.getElementById('log-workout-button')
    const workoutInput = document.getElementById('workout-input');
    const workoutList = document.getElementById('workout-list');
    logWorkoutButton.addEventListener('click', () => {
        const workoutText = workoutInput.value.trim();
        if (workoutText !== "") {
            addWorkoutToList(workoutText)
            workoutInput.value = "";
        }});
}
function addWorkoutToList(text) {
    const workoutList = document.getElementById('workout-list');
    const newListItem = document.getElementById('li');
    newListItem.textContent = text;
    workoutList.appendChild(newListItem);
}