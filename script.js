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
    const moodOptions = document.querySelector('.mood-options');
    const moodDisplay = document.getElementById('mood-display');
    const toastNotification = document.getElementById('toast-notification');
    const greetingSpan = document.getElementById('greeting');
    const confettiCanvas = document.getElementById('confetti-canvas');
    let triggerConfetti = () => {};
    if (confettiCanvas) {
        triggerConfetti = setupConfetti(confettiCanvas);
    }
    setupWaterLogger(logWaterButton, waterCountSpan, waterGoalSpan, waterGoalInput, setGoalButton, resetWaterButton, waterProgressText, waterProgressBar, triggerConfetti);
    setupWorkoutLogger(logWorkoutButton, workoutInput, workoutList, clearWorkoutsButton);
    setupNotesSection(notesArea, saveNotesButton, toastNotification);
    setupCalorieTracker(foodItemInput, calorieInput, logCalorieButton, totalCaloriesSpan, calorieList, clearCaloriesButton, calorieGoalInput, setCalorieGoalButton, calorieGoalSpan, calorieProgressText, calorieProgressBar, triggerConfetti);
    setupThemeSwitcher(themeSwitcherButton);
    setupSleepTracker(sleepInput, logSleepButton, sleepDisplay);
    setupMoodTracker(moodOptions, moodDisplay);
    setupGreeting(greetingSpan);
});
function setupGreeting(greetingElement) {
    const now = new Date();
    const hour = now.getHours();
    let greeting;
    if (hour < 12) {
        greeting = 'Good morning';
    } else if (hour < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening'
    }
    greetingElement.textContent = greeting;
}
function setupConfetti(canvas) {
    const ctx = canvas.getContext('2d');
    let pieces = [];
    let animationFrameId;
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    function createPieces() {
        const pieceCount = 150;
        pieces = [];
        for (let i = 0; i < pieceCount; i++) {
            pieces.push({
                x: canvas.width * Math.random(),
                y: -20,
                r: 5 + Math.random() * 5,
                d: 5 + Math.random() * 10,
                color: `hsl(${Math.random() * 360}, 90%, 60%)`,
                tilt: Math.random() * 10 - 5,
                tiltAngle: 0,
                tiltAngleIncrement: Math.random() * 0.1 + 0.05,
                velocity: { x: Math.random() * 6 - 3, y: Math.random() * 5 + 2 }
            });
        }
    }
    function update() {
        for (let i = pieces.length - 1; i >= 0; i--) {
            const p = pieces[i];
            p.y += p.velocity.y;
            p.x += p.velocity.x;
            p.tiltAngle += p.tiltAngleIncrement;
            p.tilt = Math.sin(p.tiltAngle) * 15;
            if (p.y > canvas.height) {
                pieces.splice(i, 1);
            }
        }
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            ctx.beginPath();
            ctx.lineWidth = p.r / 2;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            ctx.stroke();
        });
    }
    function animate() {
        if (pieces.length === 0) {
            cancelAnimationFrame(animationFrameId);
            canvas.style.display = 'none';
            return;
        }
        update();
        draw();
        animationFrameId = requestAnimationFrame(animate);
    }
    window.addEventListener('resize', resizeCanvas);
    return () => {
        resizeCanvas();
        createPieces();
        canvas.style.display = 'block';
        animate();
    }
}
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

function setupWaterLogger(logButton, countDisplay, goalDisplay, goalInput, setGoalButton, resetButton, progressText, progressBar, triggerConfetti) {
    let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
    let waterGoal = parseInt(localStorage.getItem('waterGoal')) || 8;
    function updateDisplay(checkGoal = false) {
        if (checkGoal && waterCount >= waterGoal && (waterCount - 1 < waterGoal)) {
            triggerConfetti();
        }
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
            updateDisplay(true);
            goalInput.value = '';
        }
    });
    logButton.addEventListener('click', () => {
        waterCount++;
        localStorage.setItem('waterCount', waterCount);
        updateDisplay(true);
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
function setupNotesSection(textarea, saveButton, toast) {
    const savedNotes = localStorage.getItem('dailyNotes') || '';
    textarea.value = savedNotes;
    saveButton.addEventListener('click', () => {
        localStorage.setItem('dailyNotes', textarea.value);
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    })
};
function setupCalorieTracker(foodInput, calInput, logButton, totalCalDisplay, list, clearButton, goalInput, setGoalButton, goalDisplay, progressText, progressBar, triggerConfetti) {
    let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
    let calorieGoal = parseInt(localStorage.getItem('calorieGoal')) || 2000;
    function updateDisplay(checkGoal = false) {
        const total = foodItems.reduce((sum, item) => sum + item.calories, 0);
        if (checkGoal && total >= calorieGoal) {
            const previousTotal = total - (foodItems[foodItems.length - 1]?.calories || 0);
            if (previousTotal < calorieGoal) {
                triggerConfetti();
            }
        }
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
    function renderFoodList(checkGoal = false) {
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
        updateDisplay(checkGoal);
    }
    setGoalButton.addEventListener('click', () => {
        const newGoal = parseInt(goalInput.value);
        if (newGoal && newGoal > 0) {
            calorieGoal = newGoal;
            localStorage.setItem('calorieGoal', calorieGoal);
            updateDisplay(true);
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
            renderFoodList(true);
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

