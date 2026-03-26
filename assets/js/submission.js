document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('problem-form');
    const list = document.getElementById('submissions-list');
    const postCount = document.getElementById('post-count');

    // 1. Load existing submissions
    let submissions = JSON.parse(localStorage.getItem('userSubmissions')) || [];

    function renderSubmissions() {
        if (submissions.length === 0) {
            list.innerHTML = `<div class="text-center py-20 opacity-50"><p>No problems submitted yet. Be the first!</p></div>`;
            postCount.innerText = "0 Posts";
            return;
        }

        postCount.innerText = `${submissions.length} Posts`;
        list.innerHTML = submissions.map((sub, index) => `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 animate-fadeIn">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-xl font-bold text-yellow-600 dark:text-yellow-500">${sub.title}</h4>
                        <p class="text-xs text-gray-400">Posted on ${sub.date} by Student</p>
                    </div>
                    <button onclick="deletePost(${index})" class="text-gray-400 hover:text-red-500 transition">🗑️</button>
                </div>
                <p class="text-gray-700 dark:text-gray-300 mb-4">${sub.description}</p>
                ${sub.code ? `
                    <div class="relative">
                        <pre class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono"><code>${escapeHTML(sub.code)}</code></pre>
                        <span class="absolute top-2 right-2 text-[10px] uppercase bg-gray-700 px-2 py-1 rounded text-gray-400">JavaScript</span>
                    </div>
                ` : ''}
                <div class="mt-4 flex gap-4 border-t dark:border-gray-700 pt-4">
                    <button class="text-sm font-bold flex items-center gap-1 hover:text-yellow-500">💬 0 Answers</button>
                    <button class="text-sm font-bold flex items-center gap-1 hover:text-blue-500">👍 Upvote</button>
                </div>
            </div>
        `).reverse().join(''); // Reverse to show newest first
    }

    // 2. Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newSubmission = {
            title: document.getElementById('prob-title').value,
            description: document.getElementById('prob-desc').value,
            code: document.getElementById('prob-code').value,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            id: Date.now()
        };

        submissions.push(newSubmission);
        localStorage.setItem('userSubmissions', JSON.stringify(submissions));
        
        form.reset();
        renderSubmissions();
    });

    // Helper: Prevent HTML injection in code blocks
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[m];
        });
    }

    // Delete post function (global so button can call it)
    window.deletePost = (index) => {
        if(confirm("Delete this post?")) {
            // Since we reversed the display, index needs careful handling or filter by ID
            const reversedIndex = submissions.length - 1 - index;
            submissions.splice(reversedIndex, 1);
            localStorage.setItem('userSubmissions', JSON.stringify(submissions));
            renderSubmissions();
        }
    };

    renderSubmissions();
});