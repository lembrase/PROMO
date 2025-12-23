// Amazon Pro - Main JavaScript File

class AmazonPro {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initScrollAnimations();
        this.initCounterAnimations();
        this.initFlashSaleTimer();
        this.initMobileMenu();
        this.initBackToTop();
        this.initNewsletterForm();
        this.initCategoryCards();
        this.initProgressBars();
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            this.handleNavbarScroll();
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            this.observer.observe(el);
        });
    }

    initScrollAnimations() {
        // Add animation classes to elements
        const animatedElements = [
            { selector: '.category-card', animation: 'fade-in' },
            { selector: '.stat-item', animation: 'slide-in-left' },
            { selector: '.flash-product', animation: 'slide-in-right' },
            { selector: '.newsletter-content', animation: 'fade-in' }
        ];

        animatedElements.forEach(({ selector, animation }) => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add(animation);
                el.style.transitionDelay = `${index * 0.1}s`;
                this.observer.observe(el);
            });
        });
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        };

        // Animate counters when they come into view
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    initFlashSaleTimer() {
        const timer = document.getElementById('flash-timer');
        if (!timer) return;

        // Set end time (12 hours from now for demo)
        const endTime = new Date().getTime() + (12 * 60 * 60 * 1000);

        const updateTimer = () => {
            const now = new Date().getTime();
            const timeLeft = endTime - now;

            if (timeLeft > 0) {
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            } else {
                // Timer expired
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
            }
        };

        // Update timer every second
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }
    }

    initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    initNewsletterForm() {
        const form = document.querySelector('.newsletter-form');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = form.querySelector('input[type="email"]').value;
                const checkbox = form.querySelector('input[type="checkbox"]');
                const button = form.querySelector('button[type="submit"]');
                
                // Validate form
                if (!email || !checkbox.checked) {
                    this.showNotification('Veuillez remplir tous les champs', 'error');
                    return;
                }

                // Simulate form submission
                button.innerHTML = '<div class="loading"></div> Envoi...';
                button.disabled = true;

                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i> Inscrit !';
                    button.classList.add('form-success');
                    
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-paper-plane"></i> S\'abonner';
                        button.classList.remove('form-success');
                        button.disabled = false;
                        form.reset();
                    }, 2000);
                }, 1500);

                this.showNotification('Merci de vous être abonné à notre newsletter !', 'success');
            });
        }
    }

    initCategoryCards() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });

            // Add click tracking for analytics
            const link = card.querySelector('.btn-category');
            if (link) {
                link.addEventListener('click', (e) => {
                    const categoryName = card.querySelector('h3').textContent;
                    this.trackEvent('category_click', {
                        category: categoryName,
                        url: link.href
                    });
                });
            }
        });
    }

    animateCardHover(card, isHover) {
        const image = card.querySelector('.category-image img');
        const badge = card.querySelector('.discount-badge');
        
        if (isHover) {
            // Add hover animations
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
            if (badge) {
                badge.style.transform = 'scale(1.1)';
                badge.style.background = 'linear-gradient(135deg, #ff9900 0%, #ffb84d 100%)';
            }
        } else {
            // Remove hover animations
            if (image) {
                image.style.transform = 'scale(1)';
            }
            if (badge) {
                badge.style.transform = 'scale(1)';
                badge.style.background = 'linear-gradient(135deg, #ff9900 0%, #ffb84d 100%)';
            }
        }
    }

    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress');
        
        const animateProgressBar = (progressBar) => {
            const width = progressBar.style.width;
            progressBar.style.width = '0%';
            
            setTimeout(() => {
                progressBar.style.width = width;
            }, 300);
        };

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBar(entry.target);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close handlers
        const closeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        };

        closeBtn.addEventListener('click', closeNotification);
        setTimeout(closeNotification, 5000); // Auto close after 5 seconds
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking (placeholder)
        console.log(`Event: ${eventName}`, data);
        
        // Here you would integrate with your analytics service
        // Example: gtag('event', eventName, data);
    }

    handleResize() {
        // Handle responsive adjustments
        const isMobile = window.innerWidth <= 768;
        
        // Adjust animations for mobile
        if (isMobile) {
            document.querySelectorAll('.floating-cards .card').forEach(card => {
                card.style.animation = 'none';
            });
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Enhanced E-commerce Features
class EcommerceFeatures {
    constructor() {
        this.cart = [];
        this.wishlist = [];
        this.init();
    }

    init() {
        this.initProductSearch();
        this.initPriceTracking();
        this.initComparisonTool();
        this.initQuickView();
    }

    initProductSearch() {
        // Add search functionality
        const searchHTML = `
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="product-search" placeholder="Rechercher des produits...">
                    <button class="search-btn">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div class="search-results" id="search-results"></div>
            </div>
        `;

        // Add search styles
        const searchStyles = `
            .search-container {
                position: relative;
                max-width: 400px;
                margin: 2rem auto;
            }
            .search-box {
                display: flex;
                background: white;
                border-radius: 25px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .search-box input {
                flex: 1;
                border: none;
                padding: 12px 20px;
                font-size: 16px;
                outline: none;
            }
            .search-btn {
                background: var(--primary-color);
                border: none;
                color: white;
                padding: 12px 20px;
                cursor: pointer;
                transition: background 0.3s;
            }
            .search-btn:hover {
                background: var(--primary-dark);
            }
            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                max-height: 300px;
                overflow-y: auto;
                z-index: 1000;
                display: none;
            }
            .search-result-item {
                padding: 12px 20px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                transition: background 0.3s;
            }
            .search-result-item:hover {
                background: #f8f9fa;
            }
        `;

        // Add to page
        const style = document.createElement('style');
        style.textContent = searchStyles;
        document.head.appendChild(style);

        // Insert search into hero section
        const heroSection = document.querySelector('.hero-content');
        if (heroSection) {
            heroSection.insertAdjacentHTML('beforeend', searchHTML);
        }

        // Add search functionality
        const searchInput = document.getElementById('product-search');
        const searchResults = document.getElementById('search-results');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                if (query.length > 2) {
                    this.performSearch(query, searchResults);
                } else {
                    searchResults.style.display = 'none';
                }
            });
        }
    }

    performSearch(query, resultsContainer) {
        // Mock search results (in real app, this would be an API call)
        const mockResults = [
            'iPhone 14 Pro',
            'Samsung Galaxy S23',
            'MacBook Air M2',
            'Sony WH-1000XM4',
            'Nintendo Switch OLED',
            'PlayStation 5',
            'Xbox Series X',
            'iPad Pro 12.9"',
            'AirPods Pro',
            'Amazon Echo Dot'
        ].filter(item => item.toLowerCase().includes(query));

        if (mockResults.length > 0) {
            resultsContainer.innerHTML = mockResults.map(result => 
                `<div class="search-result-item">${result}</div>`
            ).join('');
            resultsContainer.style.display = 'block';
        } else {
            resultsContainer.innerHTML = '<div class="search-result-item">Aucun résultat trouvé</div>';
            resultsContainer.style.display = 'block';
        }
    }

    initPriceTracking() {
        // Add price tracking badges to products
        document.querySelectorAll('.flash-product').forEach(product => {
            const priceInfo = product.querySelector('.price');
            if (priceInfo) {
                const trackBtn = document.createElement('button');
                trackBtn.className = 'price-track-btn';
                trackBtn.innerHTML = '<i class="fas fa-bell"></i> Suivre le prix';
                trackBtn.addEventListener('click', () => {
                    this.trackPrice(product);
                });
                priceInfo.appendChild(trackBtn);
            }
        });

        // Add styles
        const trackStyles = `
            .price-track-btn {
                background: none;
                border: 1px solid var(--primary-color);
                color: var(--primary-color);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                margin-left: 8px;
                transition: all 0.3s;
            }
            .price-track-btn:hover {
                background: var(--primary-color);
                color: white;
            }
        `;

        const style = document.createElement('style');
        style.textContent = trackStyles;
        document.head.appendChild(style);
    }

    trackPrice(product) {
        const productName = product.querySelector('h4').textContent;
        const btn = product.querySelector('.price-track-btn');
        
        // Simulate price tracking
        btn.innerHTML = '<i class="fas fa-check"></i> Prix suivi';
        btn.style.background = '#10b981';
        btn.style.color = 'white';
        btn.style.borderColor = '#10b981';

        // Show notification
        if (window.amazonPro) {
            window.amazonPro.showNotification(`Vous suivez maintenant le prix de: ${productName}`, 'success');
        }

        // Reset after 3 seconds (for demo)
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-bell"></i> Suivre le prix';
            btn.style.background = 'none';
            btn.style.color = 'var(--primary-color)';
            btn.style.borderColor = 'var(--primary-color)';
        }, 3000);
    }

    initComparisonTool() {
        // Add comparison checkboxes to products
        document.querySelectorAll('.flash-product').forEach(product => {
            const compareBtn = document.createElement('button');
            compareBtn.className = 'compare-btn';
            compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i> Comparer';
            compareBtn.addEventListener('click', () => {
                this.addToComparison(product);
            });
            
            const productInfo = product.querySelector('.product-info');
            if (productInfo) {
                productInfo.appendChild(compareBtn);
            }
        });

        // Add comparison bar
        const comparisonBar = document.createElement('div');
        comparisonBar.className = 'comparison-bar';
        comparisonBar.innerHTML = `
            <div class="comparison-content">
                <span class="comparison-count">0 produit(s) sélectionné(s)</span>
                <button class="compare-now-btn" disabled>Comparer</button>
                <button class="clear-comparison">Vider</button>
            </div>
        `;
        document.body.appendChild(comparisonBar);

        // Add styles
        const compareStyles = `
            .compare-btn {
                background: none;
                border: 1px solid #6b7280;
                color: #6b7280;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 8px;
                width: 100%;
                transition: all 0.3s;
            }
            .compare-btn:hover {
                background: #6b7280;
                color: white;
            }
            .compare-btn.active {
                background: var(--primary-color);
                border-color: var(--primary-color);
                color: white;
            }
            .comparison-bar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--secondary-color);
                color: white;
                padding: 1rem;
                transform: translateY(100%);
                transition: transform 0.3s;
                z-index: 1000;
                box-shadow: 0 -4px 16px rgba(0,0,0,0.2);
            }
            .comparison-bar.visible {
                transform: translateY(0);
            }
            .comparison-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 1200px;
                margin: 0 auto;
            }
            .compare-now-btn, .clear-comparison {
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 8px;
            }
            .compare-now-btn:disabled {
                background: #6b7280;
                cursor: not-allowed;
            }
        `;

        const style = document.createElement('style');
        style.textContent = compareStyles;
        document.head.appendChild(style);

        this.comparisonProducts = [];
        this.updateComparisonBar();
    }

    addToComparison(product) {
        const productName = product.querySelector('h4').textContent;
        const btn = product.querySelector('.compare-btn');
        
        if (btn.classList.contains('active')) {
            // Remove from comparison
            this.comparisonProducts = this.comparisonProducts.filter(p => p !== productName);
            btn.classList.remove('active');
            btn.innerHTML = '<i class="fas fa-balance-scale"></i> Comparer';
        } else {
            // Add to comparison
            if (this.comparisonProducts.length < 3) {
                this.comparisonProducts.push(productName);
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-check"></i> Ajouté';
            } else {
                if (window.amazonPro) {
                    window.amazonPro.showNotification('Vous pouvez comparer jusqu\'à 3 produits maximum', 'error');
                }
                return;
            }
        }
        
        this.updateComparisonBar();
    }

    updateComparisonBar() {
        const bar = document.querySelector('.comparison-bar');
        const count = document.querySelector('.comparison-count');
        const compareBtn = document.querySelector('.compare-now-btn');
        
        if (count) {
            count.textContent = `${this.comparisonProducts.length} produit(s) sélectionné(s)`;
        }
        
        if (compareBtn) {
            compareBtn.disabled = this.comparisonProducts.length < 2;
        }
        
        if (bar) {
            if (this.comparisonProducts.length > 0) {
                bar.classList.add('visible');
            } else {
                bar.classList.remove('visible');
            }
        }
    }

    initQuickView() {
        // Add quick view buttons to products
        document.querySelectorAll('.flash-product').forEach(product => {
            const quickViewBtn = document.createElement('button');
            quickViewBtn.className = 'quick-view-btn';
            quickViewBtn.innerHTML = '<i class="fas fa-eye"></i> Aperçu rapide';
            quickViewBtn.addEventListener('click', () => {
                this.showQuickView(product);
            });
            
            const productImage = product.querySelector('.product-image');
            if (productImage) {
                productImage.appendChild(quickViewBtn);
            }
        });

        // Add styles
        const quickViewStyles = `
            .quick-view-btn {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                opacity: 0;
                transition: all 0.3s;
                z-index: 10;
            }
            .flash-product:hover .quick-view-btn {
                opacity: 1;
            }
            .quick-view-btn:hover {
                background: rgba(0,0,0,0.9);
                transform: translate(-50%, -50%) scale(1.05);
            }
        `;

        const style = document.createElement('style');
        style.textContent = quickViewStyles;
        document.head.appendChild(style);
    }

    showQuickView(product) {
        const productName = product.querySelector('h4').textContent;
        const productPrice = product.querySelector('.new-price').textContent;
        const productImage = product.querySelector('.product-image img').src;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="quick-view-content">
                <button class="quick-view-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="quick-view-body">
                    <div class="quick-view-image">
                        <img src="${productImage}" alt="${productName}">
                    </div>
                    <div class="quick-view-info">
                        <h2>${productName}</h2>
                        <div class="quick-view-price">
                            <span class="price">${productPrice}</span>
                        </div>
                        <div class="quick-view-description">
                            <p>Découvrez ce produit exceptionnel avec des caractéristiques de haute qualité. Profitez de notre offre spéciale pour une durée limitée.</p>
                        </div>
                        <div class="quick-view-actions">
                            <a href="https://www.amazon.fr" target="_blank" class="btn btn-primary">
                                <i class="fas fa-shopping-cart"></i> Acheter sur Amazon
                            </a>
                            <button class="btn btn-secondary add-to-wishlist">
                                <i class="fas fa-heart"></i> Ajouter aux favoris
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            .quick-view-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                animation: fadeIn 0.3s forwards;
            }
            .quick-view-content {
                background: white;
                border-radius: 12px;
                max-width: 800px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                transform: scale(0.8);
                animation: modalIn 0.3s forwards;
            }
            .quick-view-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                z-index: 10;
            }
            .quick-view-body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
            }
            .quick-view-image img {
                width: 100%;
                height: 300px;
                object-fit: cover;
                border-radius: 8px;
            }
            .quick-view-info h2 {
                margin-bottom: 1rem;
                font-size: 1.8rem;
            }
            .quick-view-price .price {
                font-size: 2rem;
                font-weight: 800;
                color: var(--primary-color);
            }
            .quick-view-description {
                margin: 1.5rem 0;
                color: var(--text-light);
                line-height: 1.6;
            }
            .quick-view-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            @keyframes modalIn {
                to { transform: scale(1); }
            }
            @media (max-width: 768px) {
                .quick-view-body {
                    grid-template-columns: 1fr;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = modalStyles;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // Close modal handlers
        const closeBtn = modal.querySelector('.quick-view-close');
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s forwards';
            modal.querySelector('.quick-view-content').style.animation = 'modalOut 0.3s forwards';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Add to wishlist handler
        const wishlistBtn = modal.querySelector('.add-to-wishlist');
        wishlistBtn.addEventListener('click', () => {
            this.addToWishlist(productName);
            wishlistBtn.innerHTML = '<i class="fas fa-check"></i> Ajouté aux favoris';
            wishlistBtn.style.background = '#10b981';
            wishlistBtn.style.borderColor = '#10b981';
        });
    }

    addToWishlist(productName) {
        this.wishlist.push(productName);
        if (window.amazonPro) {
            window.amazonPro.showNotification(`${productName} ajouté aux favoris !`, 'success');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    window.amazonPro = new AmazonPro();
    
    // Initialize e-commerce features
    window.ecommerceFeatures = new EcommerceFeatures();
    
    // Add loading complete class
    document.body.classList.add('loaded');
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
    
    // Initialize service worker for offline functionality (optional)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AmazonPro, EcommerceFeatures };
}