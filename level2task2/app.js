document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateStats();
    }

    function updateStats() {
        const remaining = tasks.filter(t => !t.completed).length;
        taskCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');

            li.innerHTML = `
                <div class="checkbox-custom ${task.completed ? 'checked' : ''}" onclick="toggleTask(${index})">
                    ${task.completed ? '✓' : ''}
                </div>
                <span onclick="toggleTask(${index})">${task.text}</span>
                <button class="delete-btn" onclick="deleteTask(${index})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
            taskList.appendChild(li);
        });
        updateStats();
    }

    window.toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    window.deleteTask = (index) => {
        const li = taskList.children[index];
        li.style.transform = 'translateX(20px)';
        li.style.opacity = '0';
        setTimeout(() => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }, 300);
    };

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.unshift({ text, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    }

    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    });

    renderTasks();
});
