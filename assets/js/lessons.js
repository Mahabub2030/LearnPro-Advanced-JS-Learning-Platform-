// Mock Data (Real app: fetch('assets/data/lessons.json'))
const lessons = [
    {
        id: 1,
        title: "JS Basics",
        content: "<h2>Variables and Scoping</h2><p>In JS, we use <code>let</code> and <code>const</code>. Const is for values that don't change.</p>",
        starterCode: "// Try declaring a variable\nconst name = 'LearnPro';\nconsole.log('Hello ' + name);"
    },
    {
        id: 2,
        title: "Arrow Functions",
        content: "<h2>Modern Functions</h2><p>Arrow functions provide a shorter syntax and don't bind their own <code>this</code>.</p>",
        starterCode: "const greet = () => {\n  console.log('Arrow function fired!');\n};\ngreet();"
    }
];

// 1. Initialize State
const urlParams = new URLSearchParams(window.location.search);
let currentId = parseInt(urlParams.get('id')) || 1;
const currentLesson = lessons.find(l => l.id === currentId) || lessons[0];

// 2. DOM Elements
const contentArea = document.getElementById('lesson-content');
const editor = document.getElementById('code-editor');
const output = document.getElementById('console-output');
const runBtn = document.getElementById('run-btn');

// 3. Render Lesson
function renderLesson() {
    document.title = `LearnPro | ${currentLesson.title}`;
    document.getElementById('lesson-title').innerText = currentLesson.title;
    contentArea.innerHTML = currentLesson.content;
    editor.value = currentLesson.starterCode;
    
    // Update Navigation
    document.getElementById('prev-btn').onclick = () => navigate(-1);
    document.getElementById('next-btn').onclick = () => navigate(1);
    document.getElementById('prev-btn').disabled = currentId === 1;
}

function navigate(step) {
    const nextId = currentId + step;
    if (nextId > 0 && nextId <= lessons.length) {
        window.location.href = `lesson.html?id=${nextId}`;
    }
}

// 4. Code Execution Engine
runBtn.addEventListener('click', () => {
    const code = editor.value;
    output.innerHTML = ""; // Clear console

    try {
        // Capture console.log
        const originalLog = console.log;
        console.log = (...args) => {
            const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
            output.innerHTML += `<span>> ${msg}</span><br>`;
        };

        // Execute user code
        eval(code);

        // Restore console.log
        console.log = originalLog;
        
        // Track progress in localStorage
        saveProgress(currentId);

    } catch (err) {
        output.innerHTML = `<span class="text-red-500">> Error: ${err.message}</span>`;
    }
});

function saveProgress(id) {
    let completed = JSON.parse(localStorage.getItem('completedLessons')) || [];
    if (!completed.some(item => item.id === id)) {
        completed.push({ 
            id: id, 
            title: currentLesson.title, 
            date: new Date().toLocaleDateString() 
        });
        localStorage.setItem('completedLessons', JSON.stringify(completed));
    }
}

// Initial Load
renderLesson();