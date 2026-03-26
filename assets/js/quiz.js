const quizData = [
    { q: "What is the output of '2' + 2?", options: ["22", "4", "NaN", "Error"], a: "22" },
    { q: "Which method converts JSON string to object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.toObj()", "parse.JSON()"], a: "JSON.parse()" },
    { q: "What does 'DOM' stand for?", options: ["Data Object Model", "Document Object Model", "Direct Object Management", "Digital Object Mode"], a: "Document Object Model" },
    { q: "Is JavaScript single-threaded?", options: ["Yes", "No", "Only in Node.js", "Depends on OS"], a: "Yes" }
];

let currentIdx = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
let userHistory = []; // Stores correct/incorrect data

const startScreen = document.getElementById('start-screen');
const quizContainer = document.getElementById('quiz-container');
const resultScreen = document.getElementById('result-screen');
const timerEl = document.getElementById('timer');

document.getElementById('start-btn').addEventListener('click', () => {
    startScreen.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    startTimer();
    loadQuestion();
});

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
        if (timeLeft <= 0) handleAnswer(null); // Timeout = wrong
    }, 1000);
}

function loadQuestion() {
    const data = quizData[currentIdx];
    document.getElementById('current-count').innerText = `Question ${currentIdx + 1}/${quizData.length}`;
    document.getElementById('question-text').innerText = data.q;
    
    const optionsGrid = document.getElementById('options-grid');
    optionsGrid.innerHTML = '';

    data.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = "p-4 text-left border-2 dark:border-gray-700 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition font-bold";
        btn.onclick = () => handleAnswer(opt);
        optionsGrid.appendChild(btn);
    });
}

function handleAnswer(selected) {
    const correct = quizData[currentIdx].a;
    
    // Track History
    userHistory.push({
        question: quizData[currentIdx].q,
        selected: selected || "Timed Out",
        correct: correct,
        isRight: selected === correct
    });

    if (selected === correct) score += 10;
    document.getElementById('live-score').innerText = score;

    currentIdx++;
    if (currentIdx < quizData.length) {
        timeLeft = 30; // Reset timer
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    clearInterval(timerInterval);
    quizContainer.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    document.getElementById('final-stats').innerText = `Total Score: ${score} points`;
    
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = userHistory.map(h => `
        <div class="p-4 rounded-lg ${h.isRight ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} border">
            <p class="font-bold text-sm">${h.question}</p>
            <p class="text-xs mt-1">
                Your Answer: <span class="${h.isRight ? 'text-green-600' : 'text-red-600'}">${h.selected}</span> 
                ${!h.isRight ? `| Correct: <span class="text-green-600">${h.correct}</span>` : ''}
            </p>
        </div>
    `).join('');

    // Save to LocalStorage for the Profile Page
    const progress = JSON.parse(localStorage.getItem('userProgress')) || { quizzesCompleted: 0, totalScore: 0 };
    progress.quizzesCompleted++;
    progress.totalScore += (score / 10); // store as raw correct count
    localStorage.setItem('userProgress', JSON.stringify(progress));
}