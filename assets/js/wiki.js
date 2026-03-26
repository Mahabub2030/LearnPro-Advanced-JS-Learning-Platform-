// Function to load the 100-article database
async function initWiki() {
    try {
        const response = await fetch('assets/data/wiki.json');
        const articles = await response.json();
        
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('article');

        if (articleId) {
            renderSingleArticle(articles, articleId);
        } else {
            renderArchiveGrid(articles);
        }
    } catch (error) {
        console.error("Error loading the Wiki library:", error);
    }
}

// 1. Render the List View (The Library)
function renderArchiveGrid(articles) {
    const container = document.getElementById('wiki-content');
    container.innerHTML = `
        <h1 class="text-4xl font-black mb-8">JS Encyclopedia</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${articles.map(art => `
                <a href="?article=${art.id}" class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:border-yellow-500 border-2 border-transparent transition">
                    <span class="text-xs font-bold text-yellow-500">${art.category}</span>
                    <h3 class="text-xl font-bold mt-1">${art.title}</h3>
                    <p class="text-sm text-gray-500 mt-2">Read more →</p>
                </a>
            `).join('')}
        </div>
    `;
}

// 2. Render the Content View (The Page)
function renderSingleArticle(articles, id) {
    const article = articles.find(a => a.id === id);
    const container = document.getElementById('wiki-content');

    if (!article) {
        container.innerHTML = "<h1>Article Not Found</h1><a href='wiki.html'>Back to Library</a>";
        return;
    }

    container.innerHTML = `
        <nav class="mb-8 text-sm text-gray-400">
            <a href="wiki.html" class="hover:text-yellow-500">Library</a> / ${article.category}
        </nav>
        <article class="prose prose-lg dark:prose-invert max-w-none">
            <h1 class="text-5xl font-black text-yellow-500 mb-6">${article.title}</h1>
            <div class="flex gap-2 mb-8">
                ${article.tags.map(t => `<span class="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-bold">${t}</span>`).join('')}
            </div>
            <div class="leading-relaxed text-gray-700 dark:text-gray-300">
                ${article.content}
            </div>
        </article>
        <div class="mt-20 pt-10 border-t dark:border-gray-800">
            <a href="wiki.html" class="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold">Back to All Articles</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initWiki);