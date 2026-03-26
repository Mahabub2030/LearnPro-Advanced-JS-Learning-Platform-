// Initialize or Fetch User Data from LocalStorage
function loadUserProfile() {
  // 1. Get Quiz Stats
  const stats = JSON.parse(localStorage.getItem("userProgress")) || {
    quizzesCompleted: 0,
    totalScore: 0,
    lessonsViewed: 0,
  };

  // 2. Get Lessons Activity (if you stored lesson clicks)
  const completedLessons =
    JSON.parse(localStorage.getItem("completedLessons")) || [];

  // 3. Update DOM Elements
  document.getElementById("stat-quizzes").innerText = stats.quizzesCompleted;
  document.getElementById("stat-points").innerText = stats.totalScore * 10; // 10 points per correct answer
  document.getElementById("stat-lessons").innerText =
    completedLessons.length || stats.lessonsViewed;

  // 4. Calculate Progress Percentage
  // Assuming there are 10 total lessons in your platform
  const totalAvailableLessons = 10;
  const progressPercent = Math.min(
    (completedLessons.length / totalAvailableLessons) * 100,
    100,
  );

  const masteryBar = document.getElementById("mastery-bar");
  const percentText = document.getElementById("percent-text");

  // Animate the bar
  setTimeout(() => {
    masteryBar.style.width = `${progressPercent}%`;
    percentText.innerText = `${Math.round(progressPercent)}%`;
  }, 300);

  // 5. Update Rank Based on Score
  const rankBadge = document.getElementById("rank-badge");
  if (stats.totalScore > 50) {
    rankBadge.innerText = "JS Master";
    rankBadge.className =
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold";
  }

  renderActivity(completedLessons);
}

function renderActivity(lessons) {
  const list = document.getElementById("activity-list");
  if (lessons.length > 0) {
    list.innerHTML = lessons
      .map(
        (lesson) => `
            <li class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div class="bg-green-500 w-2 h-2 rounded-full"></div>
                <div class="flex-1">
                    <p class="text-sm font-bold">Completed: ${lesson.title}</p>
                    <p class="text-xs text-gray-500">${lesson.date}</p>
                </div>
                <span class="text-xs text-green-500 font-bold">+100 XP</span>
            </li>
        `,
      )
      .join("");
  }
}

// Logout functionality
document.getElementById("logout-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear your progress and logout?")) {
    localStorage.clear();
    window.location.href = "index.html";
  }
});

// Initial Load
document.addEventListener("DOMContentLoaded", loadUserProfile);
