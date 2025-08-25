document.addEventListener('DOMContentLoaded', () => {
    const logWaterButton = document.getElementById('log-water-button');
    const waterCountSpan = document.getElementById('water-count');
    const logWorkoutButton = document.getElementById('log-workout-button')
    const workoutInput = document.getElementById('workout-input');
    const workoutList = document.getElementById('workout-list');
    const waterGoalInput = document.getElementById('water-goal-input');
    const setGoalButton = document.getElementById('set-goal-button');
    const waterGoalSpan = document.getElementById('water-goal');
    setupWaterLogger(logWaterButton, waterCountSpan);
    setupWorkoutLogger(logWorkoutButton, workoutInput, workoutList);
});
function setupWaterLogger(logButton, countDisplay, goalDisplay, goalInput, setGoalButton) {
    let waterCount = 0;
    let waterGoal = 0;
    function updateDisplay() {
        countDisplay.textContent = waterCount;
        goalDisplay.textContent = waterGoal;
        if (waterCount >= waterGoal) {
            console.log("You reached your goal");
        }
    }
    setGoalButton.addEventListener('click', () => {
        const newGoal = parseInt(goalInput.value);
        if (newGoal && newGoal > 0) {
            waterGoal = newGoal;
            updateDisplay();
            goalInput.value = '';
        }
    })
    logButton.addEventListener('click', () => {
        waterCount++;
        updateDisplay();       
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
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "delete";
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', function() {
        this.parentElement.remove()
    }
    )
    newListItem.appendChild(textSpan);
    newListItem.appendChild(deleteButton);
    list.appendChild(newListItem);
}