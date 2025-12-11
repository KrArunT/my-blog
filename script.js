document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Icons
    const moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    const sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.innerHTML = theme === 'light' ? moonIcon : sunIcon;
    }

    // Load Blog Posts
    loadPosts();

    async function loadPosts() {
        const postGrid = document.getElementById('postGrid');
        try {
            const response = await fetch('posts.json');
            const posts = await response.json();

            // Clear loading state if any
            postGrid.innerHTML = '';

            posts.forEach((post, index) => {
                const article = document.createElement('article');
                article.className = 'post-card';
                article.style.animationDelay = `${(index + 1) * 0.1}s`;

                article.innerHTML = `
                    <div class="post-meta">${post.date} • ${post.readTime}</div>
                    <h2 class="post-title">${post.title}</h2>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <a href="${post.link}" class="btn-read" target="_blank" rel="noopener noreferrer"> Read Article → </a>

                `;
                postGrid.appendChild(article);
            });
        } catch (error) {
            console.error('Error loading posts:', error);
            postGrid.innerHTML = '<p class="error-msg">Failed to load posts.</p>';
        }
    }
});
