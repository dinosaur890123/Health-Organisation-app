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
    const calorieGoalInput = document.getElementById('calorie-goal-input');
    const setCalorieGoalButton = document.getElementById('set-calorie-goal-button');
    const calorieGoalSpan = document.getElementById('calorie-goal');
    const calorieProgressText = document.getElementById('calorie-progress-text');
    const waterProgressBar = document.getElementById('water-progress-bar');
    const calorieProgressBar = document.getElementById('calorie-progress-bar');
    const sleepDisplay = document.getElementById('sleep-display');
    const logSleepButton = document.getElementById('log-sleep-button');
    const sleepInput = document.getElementById('sleep-input');
    setupWaterLogger(logWaterButton, waterCountSpan, waterGoalSpan, waterGoalInput, setGoalButton, resetWaterButton, waterProgressText, waterProgressBar);
    setupWorkoutLogger(logWorkoutButton, workoutInput, workoutList, clearWorkoutsButton);
    setupNotesSection(notesArea, saveNotesButton);
    setupCalorieTracker(foodItemInput, calorieInput, logCalorieButton, totalCaloriesSpan, calorieList, clearCaloriesButton, calorieGoalInput, setCalorieGoalButton, calorieGoalSpan, calorieProgressText, calorieProgressBar);
    setupThemeSwitcher(themeSwitcherButton);
    setupSleepTracker(sleepInput, logSleepButton, sleepDisplay);
    setupMoodTracker(moodOptions, moodDisplay)
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

function setupWaterLogger(logButton, countDisplay, goalDisplay, goalInput, setGoalButton, resetButton, progressText, progressBar) {
    let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
    let waterGoal = parseInt(localStorage.getItem('waterGoal')) || 8;
    function updateDisplay() {
        countDisplay.textContent = waterCount;
        goalDisplay.textContent = waterGoal;
        const progressPercent = Math.min((waterCount / waterGoal) * 100, 100);
        progressBar.style.width = `${progressPercent}%`;
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

function setupWorkoutLogger(button, input, list, clearButton) {
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
function setupCalorieTracker(foodInput, calInput, logButton, totalCalDisplay, list, clearButton, goalInput, setGoalButton, goalDisplay, progressText, progressBar) {
    let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
    let calorieGoal = parseInt(localStorage.getItem('calorieGoal')) || 2000;
    function updateDisplay() {
        const total = foodItems.reduce((sum, item) => sum + item.calories, 0);
        totalCalDisplay.textContent = total;
        goalDisplay.textContent = calorieGoal;
        const progressPercent = Math.min((total / calorieGoal) * 100, 100);
        progressBar.style.width = `${progressPercent}%`;
        if (total >= calorieGoal && calorieGoal > 0) {
            progressText.classList.add('goal-reached');
        } else {
            progressText.classList.remove('goal-reached');
        }
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
        updateDisplay();
    }
    setGoalButton.addEventListener('click', () => {
        const newGoal = parseInt(goalInput.value);
        if (newGoal && newGoal > 0) {
            calorieGoal = newGoal;
            localStorage.setItem('calorieGoal', calorieGoal);
            updateDisplay();
            goalInput.value = '';
        }
    });
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
function setupSleepTracker(input, logButton, display) {
    let sleepHours = parseFloat(localStorage.getItem('sleepHours')) || 0;
    function updateDisplay() {
        display.textContent = sleepHours;
    }
    logButton.addEventListener('click', () => {
        const hours = parseFloat(input.value);
        if (hours >= 0) {
            sleepHours = hours;
            localStorage.setItem('sleepHours', sleepHours);
            updateDisplay();
            input.value = '';
        }
    });
    updateDisplay();
}
function setupMoodTracker(optionsContainer, display) {
    let currentMood = localStorage.getItem('dailyMood') || 'Not logged';
    function updateDisplay() {
        display.textContent = currentMood;
        optionsContainer.querySelectorAll('.mood-button').forEach(btn => {
            if (btn.dataset.mood === currentMood) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
    optionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('mood-button')) {
            const selectedMood = e.target.dataset.mood;
            currentMood = selectedMood;
            localStorage.setItem('dailyMood', currentMood);
            updateDisplay();
        }
    });
    updateDisplay();
}