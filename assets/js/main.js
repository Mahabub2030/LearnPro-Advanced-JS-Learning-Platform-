// --- Theme Toggle Logic ---
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

// --- Mock Data (Usually from lessons.json) ---
const lessons = [
  {
    id: 1,
    title: "JS Basics",
    topic: "Variables",
    difficulty: "Beginner",
    desc: "Learn let, const, and var.",
  },
  {
    id: 2,
    title: "Functions",
    topic: "Scope",
    difficulty: "Intermediate",
    desc: "Understanding closures and hoisting.",
  },
  {
    id: 3,
    title: "Async JS",
    topic: "Promises",
    difficulty: "Advanced",
    desc: "Mastering Async/Await and Fetch.",
  },
];

// --- Render Lessons ---
const lessonContainer = document.getElementById("lesson-container");

function displayLessons(data) {
  lessonContainer.innerHTML = data
    .map(
      (lesson) => `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-transparent hover:border-yellow-500 transition-all">
            <span class="text-xs font-bold text-yellow-600 uppercase">${lesson.difficulty}</span>
            <h4 class="text-xl font-bold mt-2">${lesson.title}</h4>
            <p class="text-gray-500 dark:text-gray-400 mt-2 mb-4">${lesson.desc}</p>
            <a href="lesson.html?id=${lesson.id}" class="text-yellow-500 font-semibold hover:underline">Start Learning →</a>
        </div>
    `,
    )
    .join("");
}

// Initial Render
displayLessons(lessons);

// --- Search Functionality ---
document.getElementById("searchBar").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = lessons.filter(
    (l) =>
      l.title.toLowerCase().includes(term) ||
      l.topic.toLowerCase().includes(term),
  );
  displayLessons(filtered);
});
