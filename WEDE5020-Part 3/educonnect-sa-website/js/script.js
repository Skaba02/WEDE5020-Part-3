// EduConnect SA - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation functionality
    initNavigation();
    
    // Search functionality
    initSearch();
    
    // FAQ functionality
    initFAQ();
    
    // Contact form
    initContactForm();
    
    // Stats animation
    animateStats();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Tutor interactions
    initTutorInteractions();
    
    // Page-specific functionality
    initPageSpecific();
    
    // Loading animations
    initLoadingAnimations();
});

// Navigation Functions
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav a');
    
    // Mobile menu toggle
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Animate hamburger icon
            const icon = menuToggle.querySelector('i') || menuToggle;
            if (nav.classList.contains('active')) {
                icon.textContent = '✕';
            } else {
                icon.textContent = '☰';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i') || menuToggle;
                icon.textContent = '☰';
            }
        });
    }
    
    // Set active navigation item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Add hover effects to nav links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Search Functionality
function initSearch() {
    const searchForm = document.querySelector('.search-form form');
    const searchButton = document.querySelector('.search-form .btn');
    const subjectFilter = document.getElementById('subject');
    const locationFilter = document.getElementById('location');
    const priceFilter = document.getElementById('price-range');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSearch();
        });
    }
    
    // Real-time filtering on find-tutors page
    if (window.location.pathname.includes('find-tutors.html')) {
        const filters = [subjectFilter, locationFilter, priceFilter];
        filters.forEach(filter => {
            if (filter) {
                filter.addEventListener('change', filterTutors);
            }
        });
    }
}

function handleSearch() {
    const formData = new FormData(document.querySelector('.search-form form'));
    const searchParams = {};
    
    for (let [key, value] of formData.entries()) {
        searchParams[key] = value;
    }
    
    // Show loading state
    const searchButton = document.querySelector('.search-form .btn');
    const originalText = searchButton.textContent;
    searchButton.innerHTML = '<span class="loading"></span> Searching...';
    searchButton.disabled = true;
    
    // Simulate search delay
    setTimeout(() => {
        searchButton.innerHTML = originalText;
        searchButton.disabled = false;
        
        // If on homepage, redirect to find-tutors page with parameters
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            const params = new URLSearchParams(searchParams);
            window.location.href = `find-tutors.html?${params.toString()}`;
        } else {
            // If already on find-tutors page, filter results
            filterTutors();
            showMessage('Search completed! Results updated below.', 'success');
        }
    }, 1500);
}

function filterTutors() {
    const tutorCards = document.querySelectorAll('.tutor-card');
    const subjectFilter = document.getElementById('subject')?.value || '';
    const locationFilter = document.getElementById('location')?.value || '';
    const priceFilter = document.getElementById('price-range')?.value || '';
    
    let visibleCount = 0;
    
    tutorCards.forEach(card => {
        let shouldShow = true;
        
        // Subject filtering
        if (subjectFilter && subjectFilter !== '') {
            const tutorSubject = card.querySelector('.tutor-subject')?.textContent || '';
            if (!tutorSubject.toLowerCase().includes(subjectFilter.toLowerCase())) {
                shouldShow = false;
            }
        }
        
        // Location filtering
        if (locationFilter && locationFilter !== '') {
            const tutorLocation = card.querySelector('.tutor-location')?.textContent || '';
            if (!tutorLocation.toLowerCase().includes(locationFilter.toLowerCase())) {
                shouldShow = false;
            }
        }
        
        // Price filtering
        if (priceFilter && priceFilter !== '') {
            const tutorPrice = card.querySelector('.tutor-price')?.textContent || '';
            const price = parseInt(tutorPrice.replace(/\D/g, ''));
            const [min, max] = priceFilter.split('-').map(p => parseInt(p));
            
            if (max) {
                if (price < min || price > max) {
                    shouldShow = false;
                }
            } else if (price < min) {
                shouldShow = false;
            }
        }
        
        // Show/hide card with animation
        if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, visibleCount * 100);
            
            visibleCount++;
        } else {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Update results count
    updateResultsCount(visibleCount);
}

function updateResultsCount(count) {
    let resultsText = document.querySelector('.results-count');
    if (!resultsText) {
        resultsText = document.createElement('div');
        resultsText.className = 'results-count';
        resultsText.style.textAlign = 'center';
        resultsText.style.margin = '2rem 0';
        resultsText.style.fontSize = '1.1rem';
        resultsText.style.color = '#666';
        
        const tutorsGrid = document.querySelector('.tutors-grid');
        if (tutorsGrid) {
            tutorsGrid.parentNode.insertBefore(resultsText, tutorsGrid);
        }
    }
    
    resultsText.textContent = `Showing ${count} tutor${count !== 1 ? 's' : ''}`;
    
    if (count === 0) {
        resultsText.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #999;">
                <h3>No tutors found matching your criteria</h3>
                <p>Try adjusting your filters or <a href="#" onclick="clearFilters()" style="color: #667eea;">clear all filters</a></p>
            </div>
        `;
    }
}

function clearFilters() {
    const filters = document.querySelectorAll('.search-form select, .search-form input');
    filters.forEach(filter => {
        if (filter.type === 'select-one') {
            filter.selectedIndex = 0;
        } else {
            filter.value = '';
        }
    });
    filterTutors();
}

// FAQ Functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmit(this);
        });
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function handleContactSubmit(form) {
    const submitButton = form.querySelector('.btn');
    const originalText = submitButton.textContent;
    
    // Validate form
    if (!validateForm(form)) {
        showMessage('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<span class="loading"></span> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        showMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        form.reset();
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Show/hide error message
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#721c24';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#f5c6cb';
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '#e1e5e9';
}

// Statistics Animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateNumber(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const suffix = element.textContent.match(/\D+$/)?.[0] || '';
        element.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Tutor Interactions
function initTutorInteractions() {
    const tutorCards = document.querySelectorAll('.tutor-card');
    
    tutorCards.forEach(card => {
        // Add contact buttons if not present
        if (!card.querySelector('.contact-tutor-btn')) {
            addContactButton(card);
        }
        
        // Add favorite functionality
        addFavoriteButton(card);
        
        // Add hover effects
        addCardHoverEffects(card);
    });
}

function addContactButton(card) {
    const cardInfo = card.querySelector('.tutor-info');
    if (cardInfo) {
        const contactBtn = document.createElement('button');
        contactBtn.className = 'btn btn-secondary contact-tutor-btn';
        contactBtn.textContent = 'Contact Tutor';
        contactBtn.style.width = '100%';
        contactBtn.style.marginTop = '1rem';
        
        contactBtn.addEventListener('click', function() {
            const tutorName = card.querySelector('.tutor-name')?.textContent || 'this tutor';
            showContactModal(tutorName);
        });
        
        cardInfo.appendChild(contactBtn);
    }
}

function addFavoriteButton(card) {
    const cardInfo = card.querySelector('.tutor-info');
    if (cardInfo) {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = '♡';
        favoriteBtn.style.position = 'absolute';
        favoriteBtn.style.top = '1rem';
        favoriteBtn.style.right = '1rem';
        favoriteBtn.style.background = 'rgba(255, 255, 255, 0.9)';
        favoriteBtn.style.border = 'none';
        favoriteBtn.style.borderRadius = '50%';
        favoriteBtn.style.width = '40px';
        favoriteBtn.style.height = '40px';
        favoriteBtn.style.cursor = 'pointer';
        favoriteBtn.style.fontSize = '1.5rem';
        favoriteBtn.style.color = '#667eea';
        favoriteBtn.style.transition = 'all 0.3s ease';
        
        card.style.position = 'relative';
        
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(this, card);
        });
        
        card.appendChild(favoriteBtn);
    }
}

function toggleFavorite(button, card) {
    const isFavorited = button.classList.contains('favorited');
    
    if (isFavorited) {
        button.innerHTML = '♡';
        button.classList.remove('favorited');
        button.style.color = '#667eea';
        showMessage('Tutor removed from favorites', 'success');
    } else {
        button.innerHTML = '♥';
        button.classList.add('favorited');
        button.style.color = '#f5576c';
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
        showMessage('Tutor added to favorites', 'success');
    }
}

function addCardHoverEffects(card) {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
    });
}

function showContactModal(tutorName) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '2000';
    
    const modalContent = document.createElement('div');
    modalContent.style.background = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '2rem';
    modalContent.style.maxWidth = '500px';
    modalContent.style.width = '90%';
    modalContent.style.maxHeight = '80%';
    modalContent.style.overflow = 'auto';
    
    modalContent.innerHTML = `
        <h2 style="color: #667eea; margin-bottom: 1rem;">Contact ${tutorName}</h2>
        <p style="margin-bottom: 2rem; color: #666;">Send a message to get started with your tutoring session.</p>
        <form class="contact-tutor-form">
            <div class="form-group" style="margin-bottom: 1rem;">
                <label>Your Name *</label>
                <input type="text" required style="width: 100%; padding: 0.8rem; border: 2px solid #e1e5e9; border-radius: 10px; margin-top: 0.5rem;">
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label>Your Email *</label>
                <input type="email" required style="width: 100%; padding: 0.8rem; border: 2px solid #e1e5e9; border-radius: 10px; margin-top: 0.5rem;">
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label>Subject *</label>
                <input type="text" required style="width: 100%; padding: 0.8rem; border: 2px solid #e1e5e9; border-radius: 10px; margin-top: 0.5rem;">
            </div>
            <div class="form-group" style="margin-bottom: 2rem;">
                <label>Message *</label>
                <textarea required style="width: 100%; padding: 0.8rem; border: 2px solid #e1e5e9; border-radius: 10px; margin-top: 0.5rem; min-height: 100px; font-family: inherit; resize: vertical;"></textarea>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button type="button" class="btn-cancel" style="background: #6c757d; color: white; padding: 0.8rem 1.5rem; border: none; border-radius: 10px; cursor: pointer;">Cancel</button>
                <button type="submit" class="btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.8rem 1.5rem; border: none; border-radius: 10px; cursor: pointer;">Send Message</button>
            </div>
        </form>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
        document.body.removeChild(modal);
    };
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    modalContent.querySelector('.btn-cancel').addEventListener('click', closeModal);
    
    // Form submission
    modalContent.querySelector('.contact-tutor-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('.btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            closeModal();
            showMessage(`Message sent to ${tutorName}! They will contact you soon.`, 'success');
        }, 2000);
    });
    
    // Focus first input
    setTimeout(() => {
        modalContent.querySelector('input').focus();
    }, 100);
}

// Page-specific functionality
function initPageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            initHomePage();
            break;
        case 'find-tutors.html':
            initFindTutorsPage();
            break;
        case 'how-it-works.html':
            initHowItWorksPage();
            break;
        case 'about.html':
            initAboutPage();
            break;
        case 'contact.html':
            initContactPage();
            break;
    }
}

function initHomePage() {
    // Auto-focus search input
    const searchInput = document.querySelector('.search-form input[type="text"]');
    if (searchInput) {
        setTimeout(() => searchInput.focus(), 500);
    }
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero h1, .hero p, .search-form');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function initFindTutorsPage() {
    // Apply URL parameters to search form
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = value;
        }
    });
    
    // Initial filter if parameters exist
    if (urlParams.toString()) {
        setTimeout(filterTutors, 500);
    }
    
    // Add sort functionality
    addSortingOptions();
}

function addSortingOptions() {
    const tutorsSection = document.querySelector('.tutors-grid')?.parentElement;
    if (!tutorsSection) return;
    
    const sortContainer = document.createElement('div');
    sortContainer.style.display = 'flex';
    sortContainer.style.justifyContent = 'space-between';
    sortContainer.style.alignItems = 'center';
    sortContainer.style.marginBottom = '2rem';
    sortContainer.style.padding = '1rem';
    sortContainer.style.background = '#f8f9fa';
    sortContainer.style.borderRadius = '10px';
    
    sortContainer.innerHTML = `
        <div style="font-weight: 600; color: #333;">Sort by:</div>
        <select id="sort-tutors" style="padding: 0.5rem; border: 2px solid #e1e5e9; border-radius: 8px; background: white;">
            <option value="relevance">Relevance</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="experience">Most Experienced</option>
        </select>
    `;
    
    tutorsSection.insertBefore(sortContainer, tutorsSection.querySelector('.tutors-grid'));
    
    document.getElementById('sort-tutors').addEventListener('change', function() {
        sortTutors(this.value);
    });
}

function sortTutors(sortBy) {
    const tutorsGrid = document.querySelector('.tutors-grid');
    const tutorCards = Array.from(tutorsGrid.children);
    
    tutorCards.sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                const ratingA = parseFloat(a.querySelector('.rating')?.textContent || '0');
                const ratingB = parseFloat(b.querySelector('.rating')?.textContent || '0');
                return ratingB - ratingA;
                
            case 'price-low':
                const priceA = parseInt(a.querySelector('.tutor-price')?.textContent.replace(/\D/g, '') || '0');
                const priceB = parseInt(b.querySelector('.tutor-price')?.textContent.replace(/\D/g, '') || '0');
                return priceA - priceB;
                
            case 'price-high':
                const priceHighA = parseInt(a.querySelector('.tutor-price')?.textContent.replace(/\D/g, '') || '0');
                const priceHighB = parseInt(b.querySelector('.tutor-price')?.textContent.replace(/\D/g, '') || '0');
                return priceHighB - priceHighA;
                
            case 'experience':
                const expA = parseInt(a.querySelector('.tutor-experience')?.textContent.replace(/\D/g, '') || '0');
                const expB = parseInt(b.querySelector('.tutor-experience')?.textContent.replace(/\D/g, '') || '0');
                return expB - expA;
                
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards with animation
    tutorCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            tutorsGrid.appendChild(card);
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function initHowItWorksPage() {
    // Animate steps on scroll
    const steps = document.querySelectorAll('.step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.3 });
    
    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
        step.style.transition = 'all 0.8s ease';
        observer.observe(step);
    });
}

function initAboutPage() {
    // Animate team members
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach((member, index) => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            member.style.transition = 'all 0.6s ease';
            member.style.opacity = '1';
            member.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Add click-to-expand functionality for team bios
    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            expandTeamMember(this);
        });
    });
}

function expandTeamMember(memberCard) {
    const name = memberCard.querySelector('.member-name')?.textContent || 'Team Member';
    const role = memberCard.querySelector('.member-role')?.textContent || '';
    
    // Sample bio data (in real app, this would come from a database)
    const bios = {
        'Sarah Johnson': 'Sarah has over 8 years of experience in educational technology and has helped thousands of students find the perfect tutors. She holds a Masters in Education from UCT.',
        'Michael Chen': 'Michael is a software engineer with a passion for education. He built the matching algorithm that connects students with their ideal tutors based on learning styles and goals.',
        'Priya Patel': 'Priya ensures our tutors meet the highest standards. With a background in psychology and education, she personally interviews and verifies every tutor on our platform.',
        'David Williams': 'David leads our customer success team, making sure every student has an excellent experience. He\'s helped resolve thousands of student queries and continuously improves our service.'
    };
    
    const bio = bios[name] || 'A dedicated member of the EduConnect SA team, committed to helping students achieve their academic goals.';
    
    showTeamMemberModal(name, role, bio);
}

function showTeamMemberModal(name, role, bio) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '2000';
    
    const modalContent = document.createElement('div');
    modalContent.style.background = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '2rem';
    modalContent.style.maxWidth = '500px';
    modalContent.style.width = '90%';
    modalContent.style.textAlign = 'center';
    
    modalContent.innerHTML = `
        <div class="member-avatar" style="width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold;">
            ${name.charAt(0)}
        </div>
        <h2 style="color: #333; margin-bottom: 0.5rem;">${name}</h2>
        <p style="color: #667eea; font-weight: 600; margin-bottom: 1.5rem;">${role}</p>
        <p style="color: #666; line-height: 1.6; margin-bottom: 2rem;">${bio}</p>
        <button class="btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.8rem 2rem; border: none; border-radius: 10px; cursor: pointer;">Close</button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    const closeModal = () => {
        document.body.removeChild(modal);
    };
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    modalContent.querySelector('.btn').addEventListener('click', closeModal);
}

function initContactPage() {
    // Add map placeholder interaction
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            showMessage('Interactive map would open here in the full application.', 'success');
        });
    }
    
    // Add office hours highlight
    addOfficeHoursHighlight();
}

function addOfficeHoursHighlight() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();
    
    const isOpen = (currentDay >= 1 && currentDay <= 5) && (currentHour >= 8 && currentHour < 17);
    
    const statusElement = document.createElement('div');
    statusElement.style.padding = '1rem';
    statusElement.style.borderRadius = '10px';
    statusElement.style.marginBottom = '2rem';
    statusElement.style.textAlign = 'center';
    statusElement.style.fontWeight = '600';
    
    if (isOpen) {
        statusElement.style.background = '#d4edda';
        statusElement.style.color = '#155724';
        statusElement.innerHTML = '🟢 We\'re currently open! Contact us now for immediate assistance.';
    } else {
        statusElement.style.background = '#fff3cd';
        statusElement.style.color = '#856404';
        statusElement.innerHTML = '🟡 We\'re currently closed. We\'ll respond to your message during business hours (Mon-Fri, 8AM-5PM).';
    }
    
    const contactSection = document.querySelector('.contact-form');
    if (contactSection) {
        contactSection.parentNode.insertBefore(statusElement, contactSection);
    }
}

// Loading Animations
function initLoadingAnimations() {
    // Add loading animation to buttons on click
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type !== 'submit' && !this.classList.contains('contact-tutor-btn')) {
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.pointerEvents = 'none';
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    });
}

// Utility Functions
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    messageElement.style.position = 'fixed';
    messageElement.style.top = '100px';
    messageElement.style.right = '20px';
    messageElement.style.zIndex = '2000';
    messageElement.style.minWidth = '300px';
    messageElement.style.maxWidth = '500px';
    messageElement.style.padding = '1rem 1.5rem';
    messageElement.style.borderRadius = '10px';
    messageElement.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
    messageElement.style.transform = 'translateX(100%)';
    messageElement.style.transition = 'transform 0.3s ease';
    messageElement.style.fontWeight = '500';
    
    if (type === 'success') {
        messageElement.style.background = '#d4edda';
        messageElement.style.color = '#155724';
        messageElement.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        messageElement.style.background = '#f8d7da';
        messageElement.style.color = '#721c24';
        messageElement.style.border = '1px solid #f5c6cb';
    }
    
    document.body.appendChild(messageElement);
    
    // Animate in
    setTimeout(() => {
        messageElement.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        messageElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 300);
    }, 4000);
    
    // Click to dismiss
    messageElement.addEventListener('click', () => {
        messageElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 300);
    });
}

// Intersection Observer for animations
function createAnimationObserver() {
    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });
}

// Initialize scroll-triggered animations
function initScrollAnimations() {
    const observer = createAnimationObserver();
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.feature-card, .stat-card, .tutor-card, .team-member');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        
        observer.observe(element);
    });
    
    // Define animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        .bounce {
            animation: bounce 2s infinite;
        }
    `;
    document.head.appendChild(style);
}

// Advanced search functionality
function initAdvancedSearch() {
    const searchForm = document.querySelector('.search-form');
    if (!searchForm) return;
    
    // Add advanced search toggle
    const advancedToggle = document.createElement('button');
    advancedToggle.type = 'button';
    advancedToggle.className = 'advanced-toggle';
    advancedToggle.textContent = 'Advanced Search';
    advancedToggle.style.background = 'none';
    advancedToggle.style.border = 'none';
    advancedToggle.style.color = '#667eea';
    advancedToggle.style.cursor = 'pointer';
    advancedToggle.style.textDecoration = 'underline';
    advancedToggle.style.marginTop = '1rem';
    
    // Advanced search fields
    const advancedFields = document.createElement('div');
    advancedFields.className = 'advanced-fields';
    advancedFields.style.display = 'none';
    advancedFields.style.marginTop = '1rem';
    advancedFields.style.padding = '1rem';
    advancedFields.style.background = '#f8f9fa';
    advancedFields.style.borderRadius = '10px';
    
    advancedFields.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Availability</label>
                <select name="availability">
                    <option value="">Any time</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="evenings">Evenings</option>
                </select>
            </div>
            <div class="form-group">
                <label>Experience Level</label>
                <select name="experience">
                    <option value="">Any experience</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Teaching Method</label>
                <select name="method">
                    <option value="">Any method</option>
                    <option value="online">Online only</option>
                    <option value="in-person">In-person only</option>
                    <option value="both">Both online & in-person</option>
                </select>
            </div>
            <div class="form-group">
                <label>Language</label>
                <select name="language">
                    <option value="">Any language</option>
                    <option value="english">English</option>
                    <option value="afrikaans">Afrikaans</option>
                    <option value="zulu">Zulu</option>
                    <option value="xhosa">Xhosa</option>
                </select>
            </div>
        </div>
    `;
    
    searchForm.appendChild(advancedToggle);
    searchForm.appendChild(advancedFields);
    
    // Toggle functionality
    let isAdvancedVisible = false;
    advancedToggle.addEventListener('click', () => {
        isAdvancedVisible = !isAdvancedVisible;
        
        if (isAdvancedVisible) {
            advancedFields.style.display = 'block';
            advancedToggle.textContent = 'Hide Advanced Search';
            
            // Animate in
            advancedFields.style.opacity = '0';
            advancedFields.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                advancedFields.style.transition = 'all 0.3s ease';
                advancedFields.style.opacity = '1';
                advancedFields.style.transform = 'translateY(0)';
            }, 10);
        } else {
            advancedFields.style.opacity = '0';
            advancedFields.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                advancedFields.style.display = 'none';
            }, 300);
            advancedToggle.textContent = 'Advanced Search';
        }
    });
}

// Lazy loading for tutor images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-form input[type="text"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.contact-modal');
            modals.forEach(modal => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            });
        }
        
        // Alt + H for home
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            window.location.href = 'index.html';
        }
        
        // Alt + F for find tutors
        if (e.altKey && e.key === 'f') {
            e.preventDefault();
            window.location.href = 'find-tutors.html';
        }
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        // Show performance warning if load time is slow
        if (loadTime > 3000) {
            setTimeout(() => {
                showMessage('Page loaded slowly. Please check your internet connection.', 'error');
            }, 1000);
        }
    });
    
    // Monitor scroll performance
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        
        scrollTimer = setTimeout(() => {
            // Scroll performance logic here
            const scrollTop = window.pageYOffset;
            const header = document.querySelector('header');
            
            if (header) {
                if (scrollTop > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                    header.style.backdropFilter = 'blur(15px)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.backdropFilter = 'blur(10px)';
                }
            }
        }, 16); // 60fps
    }, { passive: true });
}

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    // Original initialization
    initNavigation();
    initSearch();
    initFAQ();
    initContactForm();
    animateStats();
    initSmoothScrolling();
    initTutorInteractions();
    initPageSpecific();
    initLoadingAnimations();
    
    // Enhanced features
    initScrollAnimations();
    initAdvancedSearch();
    initLazyLoading();
    initKeyboardShortcuts();
    initPerformanceMonitoring();
    
    // Add loading complete indicator
    setTimeout(() => {
        document.body.classList.add('loaded');
        const loadingStyles = document.createElement('style');
        loadingStyles.textContent = `
            body.loaded * {
                animation-play-state: running !important;
            }
        `;
        document.head.appendChild(loadingStyles);
    }, 100);
});

// Export functions for potential external use
window.EduConnectSA = {
    showMessage,
    filterTutors,
    clearFilters,
    showContactModal,
    sortTutors
};