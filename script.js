class GitHubPortfolio {
    constructor() {
        this.username = 'sh0tybumbati';
        this.repos = [];
        this.filteredRepos = [];
        this.currentFilter = 'all';
        this.searchQuery = '';

        // Featured projects with GitHub Pages
        this.featuredProjects = [
            {
                name: 'feature-creep',
                displayName: 'Feature Creep',
                description: 'A strategic deck-building game that satirizes video game development, where players manage resources and implement features while battling the real-world challenge of scope creep. Built for a game jam with React and TypeScript.',
                pagesUrl: 'https://sh0tybumbati.github.io/feature-creep/',
                tags: ['Deck Builder', 'React', 'TypeScript', 'Game Jam']
            },
            {
                name: 'life-smp-stats-tracker',
                displayName: 'Life SMP Stats Tracker',
                description: 'A comprehensive statistics dashboard tracking player performance across nine seasons of the Life Series Minecraft challenge, featuring interactive rankings, career analytics, and data visualizations for the competitive gaming community.',
                pagesUrl: 'https://sh0tybumbati.github.io/life-smp-stats-tracker/',
                tags: ['Data Viz', 'React', 'Minecraft', 'Analytics']
            },
            {
                name: 'Anglish-Word-hoard',
                displayName: 'Anglish Wordbook',
                description: 'An interactive digital dictionary exploring English words with Germanic origins, featuring advanced search, etymological tracking, and a neo-archaic design with Gothic typography that honors linguistic heritage.',
                pagesUrl: 'https://sh0tybumbati.github.io/Anglish-Word-hoard/',
                tags: ['Linguistics', 'TypeScript', 'Etymology', 'React']
            }
        ];

        this.init();
    }
    
    init() {
        this.bindEvents();
        this.renderFeaturedProjects();
        this.loadRepositories();
    }
    
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterRepositories();
        });
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                this.currentFilter = e.target.dataset.filter;
                this.filterRepositories();
            });
        });
    }
    
    async loadRepositories() {
        this.showLoading();
        
        try {
            const response = await fetch(`https://api.github.com/users/${this.username}/repos?per_page=100&sort=updated`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.repos = await response.json();
            this.filteredRepos = [...this.repos];
            
            this.hideLoading();
            this.updateStats();
            this.renderRepositories();
            
        } catch (error) {
            console.error('Error fetching repositories:', error);
            this.showError();
        }
    }
    
    updateStats() {
        const totalRepos = this.repos.length;
        const totalStars = this.repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = this.repos.reduce((sum, repo) => sum + repo.forks_count, 0);
        
        // Get unique languages
        const languages = new Set();
        this.repos.forEach(repo => {
            if (repo.language) {
                languages.add(repo.language);
            }
        });
        
        document.getElementById('totalRepos').textContent = totalRepos;
        document.getElementById('totalStars').textContent = totalStars;
        document.getElementById('totalForks').textContent = totalForks;
        document.getElementById('totalLanguages').textContent = languages.size;
    }
    
    filterRepositories() {
        this.filteredRepos = this.repos.filter(repo => {
            // Filter by language
            let matchesFilter = true;
            if (this.currentFilter !== 'all') {
                matchesFilter = repo.language && repo.language.toLowerCase() === this.currentFilter;
            }
            
            // Filter by search query
            let matchesSearch = true;
            if (this.searchQuery) {
                matchesSearch = repo.name.toLowerCase().includes(this.searchQuery) ||
                              (repo.description && repo.description.toLowerCase().includes(this.searchQuery));
            }
            
            return matchesFilter && matchesSearch;
        });
        
        this.renderRepositories();
    }
    
    renderFeaturedProjects() {
        const featuredContainer = document.getElementById('featuredProjects');
        if (!featuredContainer) return;

        featuredContainer.innerHTML = this.featuredProjects.map(project => `
            <div class="featured-card">
                <div class="featured-header">
                    <h3 class="featured-title">${project.displayName}</h3>
                    <div class="featured-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <p class="featured-description">${project.description}</p>
                <div class="featured-links">
                    <a href="${project.pagesUrl}" target="_blank" class="featured-link primary">
                        <i class="fas fa-globe"></i>
                        View Live Site
                    </a>
                    <a href="https://github.com/${this.username}/${project.name}" target="_blank" class="featured-link secondary">
                        <i class="fab fa-github"></i>
                        View Code
                    </a>
                </div>
            </div>
        `).join('');
    }

    renderRepositories() {
        const container = document.getElementById('reposGrid');
        const noResults = document.getElementById('noResults');
        
        if (this.filteredRepos.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        container.innerHTML = this.filteredRepos.map(repo => `
            <div class="repo-card">
                <div class="repo-header">
                    <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                    <span class="repo-visibility">${repo.private ? 'Private' : 'Public'}</span>
                </div>
                
                <p class="repo-description">${repo.description || 'No description available'}</p>
                
                <div class="repo-stats">
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span>${repo.stargazers_count}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-code-branch"></i>
                        <span>${repo.forks_count}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-eye"></i>
                        <span>${repo.watchers_count}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-exclamation-circle"></i>
                        <span>${repo.open_issues_count}</span>
                    </div>
                </div>
                
                <div class="repo-meta">
                    ${repo.language ? `
                        <div class="language">
                            <span class="language-dot" style="background-color: ${this.getLanguageColor(repo.language)}"></span>
                            <span>${repo.language}</span>
                        </div>
                    ` : '<div></div>'}
                    
                    <div class="updated-date">
                        Updated ${this.formatDate(repo.updated_at)}
                    </div>
                </div>
                
                <div class="repo-links">
                    <a href="${repo.html_url}" target="_blank" class="repo-link">
                        <i class="fab fa-github"></i>
                        View Code
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" class="repo-link secondary">
                            <i class="fas fa-external-link-alt"></i>
                            Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
    
    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'Java': '#b07219',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'TypeScript': '#2b7489',
            'C++': '#f34b7d',
            'C': '#555555',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'C#': '#239120',
            'Shell': '#89e051',
            'Dockerfile': '#384d54',
            'Vue': '#4FC08D',
            'React': '#61DAFB',
            'Jupyter Notebook': '#DA5B0B'
        };
        return colors[language] || '#667eea';
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'yesterday';
        } else if (diffDays < 30) {
            return `${diffDays} days ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months !== 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} year${years !== 1 ? 's' : ''} ago`;
        }
    }
    
    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('error').style.display = 'none';
        document.getElementById('reposGrid').innerHTML = '';
    }
    
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
    
    showError() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('reposGrid').innerHTML = '';
    }
}

// Initialize the portfolio when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GitHubPortfolio();
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.repo-card, .stat-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});