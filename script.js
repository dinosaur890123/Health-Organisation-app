document.addEventListener('DOMContentLoaded', () => {
    const logWaterButton = document.getElementById('log-water-button');
    const waterCountSpan = document.getElementById('water-count');
    const logWorkoutButton = document.getElementById('log-workout-button')
    const workoutInput = document.getElementById('workout-input');
    const workoutList = document.getElementById('workout-list');
    const waterGoalInput = document.getElementById('water-goal-input');
    const setGoalButton = document.getElementById('set-goal-button');
    const waterGoalSpan = document.getElementById('water-goal');
    const resetWaterButton = document.getElementById('reset-water-button');
    const clearWorkoutsButton = document.getElementById('clear-workouts-button');
    const notesArea = document.getElementById('daily-notes-area');
    const saveNotesButton = document.getElementById('save-notes-button');
    const waterProgressText = document.getElementById('water-progress-text');
    const foodItemInput = document.getElementById('food-item-input');
    const calorieInput = document.getElementById('calorie-input');
    const logCalorieButton = document.getElementById('log-calorie-button');
    const totalCaloriesSpan = document.getElementById('total-calories');
    const calorieList = document.getElementById('calorie-list');
    const clearCaloriesButton = document.getElementById('clear-calories-button');
    const themeSwitcherButton = document.getElementById('theme-switcher-button');
    setupWaterLogger(logWaterButton, waterCountSpan, waterGoalSpan, waterGoalInput, setGoalButton, resetWaterButton, waterProgressText);
    setupWorkoutLogger(logWorkoutButton, workoutInput, workoutList, clearWorkoutsButton);
    setupNotesSection(notesArea, saveNotesButton);
    setupCalorieTracker(foodItemInput, calorieInput, logCalorieButton, totalCaloriesSpan, calorieList, clearCaloriesButton);
    setupThemeSwitcher(themeSwitcherButton);
});
function setupThemeSwitcher(button) {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    button.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        let theme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });
}
function saveWorkouts() {
    const workoutList = document.getElementById('workout-list');
    const workouts = [];
    workoutList.querySelectorAll('li span').forEach(item => {
        workouts.push(item.textContent);
    });
    localStorage.setItem('workouts', JSON.stringify(workouts));
}
function setupWaterLogger(logButton, countDisplay, goalDisplay, goalInput, setGoalButton, resetButton, progressText) {
    let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
    let waterGoal = parseInt(localStorage.getItem('waterGoal')) || 8;
    function updateDisplay() {
        countDisplay.textContent = waterCount;
        goalDisplay.textContent = waterGoal;
        if (waterCount >= waterGoal && waterGoal > 0) {
            progressText.classList.add('goal-reached');
        }
        else {
            progressText.classList.remove('goal-reached');
        }
    }
    setGoalButton.addEventListener('click', () => {
        const newGoal = parseInt(goalInput.value);
        if (newGoal && newGoal > 0) {
            waterGoal = newGoal;
            localStorage.setItem('waterGoal', waterGoal);
            updateDisplay();
            goalInput.value = '';
        }
    });
    logButton.addEventListener('click', () => {
        waterCount++;
        localStorage.setItem('waterCount', waterCount);
        updateDisplay();       
    });
    resetButton.addEventListener('click', () => {
        waterCount = 0;
        localStorage.setItem('waterCount', waterCount);
        updateDisplay();
    })
    updateDisplay();
}
function setupWorkoutLogger(button, input, list, clearBuutton) {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
    savedWorkouts.forEach(workoutText => {
        addWorkoutToList(workoutText, list);
    })
    button.addEventListener('click', () => {
        const workoutText = input.value.trim();
        if (workoutText !== "") {
            addWorkoutToList(workoutText, list);
            input.value = "";
            saveWorkouts();
        }});
    clearButton.addEventListener('click', () => {
        list.innerHTML = '';
        saveWorkouts();
    });
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
        saveWorkouts();
    }
    )
    newListItem.appendChild(textSpan);
    newListItem.appendChild(deleteButton);
    list.appendChild(newListItem);
}
function setupNotesSection(textarea, saveButton) {
    const savedNotes = localStorage.getItem('dailyNotes') || '';
    textarea.value = savedNotes;
    saveButton.addEventListener('click', () => {
        localStorage.setItem('dailyNotes', textarea.value);
        alert('Notes saved');
    })
};
function setupCalorieTracker(foodInput, calInput, logButton, totalCalDisplay, list, clearButton) {
    let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
    function updateTotalCalories() {
        const total = foodItems.reduce((sum, item) => sum + item.calories, 0);
        totalCalDisplay.textContent = total;
        return total;
    }
    function saveFoodItems() {
        localStorage.setItem('foodItems', JSON.stringify(foodItems));
    }
    function renderFoodList() {
        list.innerHTML = '';
        foodItems.forEach((food, index) => {
            const newListItem = document.createElement('li');
            const textSpan = document.createElement('span');
            textSpan.textContent = `${food.name} - ${food.calories} kcal`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'delete';
            deleteButton.className = "delete-button";
            deleteButton.addEventListener('click', () => {
                foodItems.splice(index, 1);
                renderFoodList();
                saveFoodItems();
            });
            newListItem.appendChild(textSpan);
            newListItem.appendChild(deleteButton);
            list.appendChild(newListItem);
        });
    updateTotalCalories();
    }
    logButton.addEventListener('click', () => {
        const foodName = foodInput.value.trim();
        const calories = parseInt(calInput.value);
        if (foodName && calories >= 0) {
            foodItems.push({name: foodName, calories: calories});
            foodInput.value = '';
            calInput.value = '';
            renderFoodList();
            saveFoodItems();
        }
    });
    clearButton.addEventListener('click', () => {
        foodItems = [];
        renderFoodList();
        saveFoodItems();
    });
    renderFoodList();
}