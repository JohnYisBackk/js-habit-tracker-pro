// =============================================
// 1. DOM ELEMENTS
// =============================================

const habitForm = document.getElementById("habitForm");
const habitInput = document.getElementById("habitInput");
const habitCategory = document.getElementById("habitCategory");
const habitsList = document.getElementById("habitsList");

const progressPercent = document.getElementById("progressPercent");
const completedHabits = document.getElementById("completedHabits");
const activeHabits = document.getElementById("activeHabits");
const totalHabits = document.getElementById("totalHabits");

const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const progressRing = document.querySelector(".progress-ring");
const filterTabs = document.querySelector(".filter-tabs");

// =============================================
// 2. HABITS DATA / STATE
// =============================================

let habits = [];
let currentFilter = "all";

// =============================================
// 3. LOAD HABITS FROM LOCAL STORAGE
// =============================================

function loadHabits() {
  const storedHabits = localStorage.getItem("habits");

  if (storedHabits) {
    habits = JSON.parse(storedHabits);
  } else {
    habits = [];
  }
}

// =============================================
// 4. SAVE HABITS TO LOCAL STORAGE
// =============================================

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// =============================================
// 5. ADD HABIT
// =============================================

habitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = habitInput.value.trim();
  const category = habitCategory.value;

  if (!title) return;

  const newHabit = {
    id: Date.now(),
    title: title,
    category: category,
    completed: false,
  };

  habits.push(newHabit);

  saveHabits();
  renderHabits();
  updateStats();

  habitInput.value = "";
  habitCategory.value = "Health";
});

// =============================================
// 6. RENDER HABITS
// =============================================

function renderHabits() {
  let filteredHabits = habits;

  if (currentFilter === "active") {
    filteredHabits = habits.filter((habit) => !habit.completed);
  }

  if (currentFilter === "completed") {
    filteredHabits = habits.filter((habit) => habit.completed);
  }

  if (filteredHabits.length === 0) {
    habitsList.innerHTML = `
    <div class="empty-state">
        <h3>No habits found</h3>
        <p>Add a new habit or change your current filter.</p>
      </div>
    `;
    return;
  }

  let html = "";

  filteredHabits.forEach((habit) => {
    html += `
      <article class="habit-item ${habit.completed ? "completed" : ""}">
        <button 
          class="habit-check-btn"
          data-id="${habit.id}"
          data-action="toggle"
        >
          ✓
        </button>

        <div class="habit-info">
          <span class="habit-category">${habit.category}</span>
          <h3 class="habit-title">${habit.title}</h3>
        </div>

        <div class="habit-actions">
          <button 
            class="habit-action-btn danger"
            data-id="${habit.id}"
            data-action="delete"
          >
            Delete
          </button>
        </div>
      </article>
    `;
  });

  habitsList.innerHTML = html;
}

// =============================================
// 7. FILTER HABITS
// =============================================

filterTabs.addEventListener("click", (e) => {
  const tab = e.target.closest(".filter-tab");

  if (!tab) return;

  const filter = tab.dataset.filter;

  currentFilter = filter;

  const allTabs = document.querySelectorAll(".filter-tab");
  allTabs.forEach((t) => t.classList.remove("active"));

  tab.classList.add("active");

  renderHabits();
});

// =============================================
// 8. TOGGLE COMPLETE
// =============================================

function toggleHabit(id) {
  const habit = habits.find((habit) => habit.id === id);

  if (!habit) return;

  habit.completed = !habit.completed;

  saveHabits();
  renderHabits();
  updateStats();
}

// =============================================
// 9. DELETE HABIT
// =============================================

function deleteHabit(id) {
  habits = habits.filter((habit) => habit.id !== id);

  saveHabits();
  renderHabits();
  updateStats();
}

// =============================================
// 10. CLEAR COMPLETED
// =============================================
clearCompletedBtn.addEventListener("click", () => {
  habits = habits.filter((habit) => !habit.completed);

  saveHabits();
  renderHabits();
  updateStats();
});

// =============================================
// 11. HABITS LIST EVENTS
// =============================================

habitsList.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "toggle") {
    toggleHabit(id);
  }

  if (action === "delete") {
    deleteHabit(id);
  }
});

// =============================================
// 12. UPDATE STATS
// =============================================

function updateStats() {
  const total = habits.length;
  const completed = habits.filter((habit) => habit.completed).length;
  const active = habits.filter((habit) => !habit.completed).length;

  let percent = 0;

  if (total > 0) {
    percent = Math.round((completed / total) * 100);
  }

  totalHabits.textContent = total;
  completedHabits.textContent = completed;
  activeHabits.textContent = active;
  progressPercent.textContent = `${percent}%`;

  progressRing.style.background = `
   radial-gradient(circle, rgba(14, 18, 26, 1) 58%, transparent 59%),
    conic-gradient(var(--accent-primary) ${percent * 3.6}deg, rgba(255, 255, 255, 0.06) 0deg)
  `;
}

// =============================================
// 14. INIT APP
// =============================================

loadHabits();
renderHabits();
updateStats();
