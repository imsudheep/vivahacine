document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect (Hide on Scroll Down, Show on Scroll Up)
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;
    let hideTimeout;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Handle scrolled class (background blur)
        if (currentScrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Handle show/hide logic (only if mobile menu is not active)
        var toggle = header.querySelector('.menu-toggle');
        if (!toggle || !toggle.classList.contains('active')) {
            if (currentScrollTop > lastScrollTop && currentScrollTop > scrollThreshold) {
                // Scrolling down - hide with slight delay
                if (!hideTimeout) {
                    hideTimeout = setTimeout(() => {
                        header.classList.add('nav-hidden');
                    }, 300);
                }
            } else {
                // Scrolling up or at the top - show immediately
                clearTimeout(hideTimeout);
                hideTimeout = null;
                header.classList.remove('nav-hidden');
            }
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, { passive: true });

    // 1b. Mobile Menu Toggle Logic
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.classList.toggle('no-scroll'); // We should add this class to CSS
        });

        // Close menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.classList.remove('no-scroll');
                header.classList.remove('nav-hidden');
            });
        });
    }

    // 2. Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-img, .mega-text, .section-title, .philosophy-headline, .philosophy-paragraph, .philosophy-quote, .offering-item, .journey-title, .journey-subtitle, .journey-image-stage, .social-proof-header, .testimonial-slider-container, .explore-content, .instagram-header, .instagram-stats, .instagram-filters, .instagram-grid, .instagram-cta, .final-cta-card, .final-cta-headline, .final-cta-text, .final-cta-btn, .final-cta-scarcity, .pricing-header, .pricing-card').forEach(el => {
        revealObserver.observe(el);
    });

    // Cinematic Break — Full viewport trigger
    const cinematicBreak = document.querySelector('.cinematic-break');
    if (cinematicBreak) {
        const cinematicObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.3 });
        cinematicObserver.observe(cinematicBreak);
    }

    // 3. Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // 4. Offerings Sequential Appearance Logic
    const offeringsImages = document.querySelectorAll('.floating-image');
    let currentImageIndex = 0;

    // Define 4 fixed editorial spots around the text based on viewport size
    function getSpots() {
        if (window.innerWidth <= 375) {
            return [
                { top: '-8px', left: '4px', right: 'auto', bottom: 'auto' },
                { top: '55px', left: 'auto', right: '4px', bottom: 'auto' },
                { top: 'auto', left: '4px', right: 'auto', bottom: '80px' },
                { top: 'auto', left: 'auto', right: '4px', bottom: '-8px' }
            ];
        } else if (window.innerWidth <= 480) {
            return [
                { top: '-10px', left: '5px', right: 'auto', bottom: 'auto' },
                { top: '70px', left: 'auto', right: '5px', bottom: 'auto' },
                { top: 'auto', left: '5px', right: 'auto', bottom: '100px' },
                { top: 'auto', left: 'auto', right: '5px', bottom: '-10px' }
            ];
        } else if (window.innerWidth <= 600) {
            return [
                { top: '-12px', left: '8px', right: 'auto', bottom: 'auto' },
                { top: '85px', left: 'auto', right: '8px', bottom: 'auto' },
                { top: 'auto', left: '8px', right: 'auto', bottom: '115px' },
                { top: 'auto', left: 'auto', right: '8px', bottom: '-12px' }
            ];
        } else if (window.innerWidth <= 768) {
            return [
                { top: '-15px', left: '10px', right: 'auto', bottom: 'auto' },
                { top: '100px', left: 'auto', right: '10px', bottom: 'auto' },
                { top: 'auto', left: '10px', right: 'auto', bottom: '130px' },
                { top: 'auto', left: 'auto', right: '10px', bottom: '-15px' }
            ];
        } else {
            return [
                { top: '-10%', left: '-4%', right: 'auto', bottom: 'auto' },
                { top: '8%', left: 'auto', right: '-4%', bottom: 'auto' },
                { top: 'auto', left: '-4%', right: 'auto', bottom: '5%' },
                { top: 'auto', left: 'auto', right: '-4%', bottom: '-8%' }
            ];
        }
    }

    function cycleOfferingsImages() {
        // 1. Hide all images first
        offeringsImages.forEach(img => img.classList.remove('visible'));

        // 2. Wait for fade out, then show the next one in its spot
        setTimeout(() => {
            const currentImg = offeringsImages[currentImageIndex];
            const activeSpots = getSpots();
            const spot = activeSpots[currentImageIndex];

            if (currentImg && spot) {
                // Apply the fixed spot coordinates
                currentImg.style.top = spot.top;
                currentImg.style.left = spot.left;
                currentImg.style.right = spot.right;
                currentImg.style.bottom = spot.bottom;
                
                // Show it
                currentImg.classList.add('visible');
            }

            // Move to next index for the next cycle
            currentImageIndex = (currentImageIndex + 1) % offeringsImages.length;
        }, 1200); // Wait for the 1.2s transition to finish
    }
    let offeringsInterval = null;
    if (offeringsImages.length > 0) {
        cycleOfferingsImages();
        offeringsInterval = setInterval(cycleOfferingsImages, 3500);
    }

    // 4. Portfolio Section Interaction Logic (Hover + Click/Touch Support)
    const projectItems = document.querySelectorAll('.project-item');
    const portfolioImages = document.querySelectorAll('.portfolio-img');

    if (projectItems.length > 0 && portfolioImages.length > 0) {
        function activateProject(item) {
            const project = item.getAttribute('data-project');
            
            // Update active project item class
            projectItems.forEach(pi => pi.classList.remove('active'));
            item.classList.add('active');

            // Update active image
            portfolioImages.forEach(img => {
                if (img.getAttribute('data-project') === project) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        }

        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => activateProject(item));
            item.addEventListener('click', () => activateProject(item));
        });
    }

    // 5. Journey Preview — 5-Step Timeline Interaction
    const journeyNodes = document.querySelectorAll('.journey-node');
    const journeySteps = document.querySelectorAll('.journey-step');
    const journeyImages = document.querySelectorAll('.journey-stage-img');
    const journeyFill = document.querySelector('.journey-timeline-fill');

    if (journeyNodes.length > 0 && journeySteps.length > 0 && journeyFill) {
        function setActiveJourneyStep(stepNum) {
            // Update nodes
            journeyNodes.forEach(node => {
                node.classList.toggle('active', node.getAttribute('data-step') === stepNum);
            });

            // Update step content
            journeySteps.forEach(step => {
                step.classList.toggle('active', step.getAttribute('data-step') === stepNum);
            });

            // Update images
            journeyImages.forEach(img => {
                img.classList.toggle('active', img.getAttribute('data-step') === stepNum);
            });

            // Update progress fill
            const idx = parseInt(stepNum) - 1;
            const pct = (idx / (journeyNodes.length - 1)) * 100;
            journeyFill.style.width = `${pct}%`;
        }

        journeyNodes.forEach(node => {
            node.addEventListener('click', () => {
                setActiveJourneyStep(node.getAttribute('data-step'));
            });
        });

        // Initialize
        journeyFill.style.width = '0%';
    }

    // 6. Testimonial Slider Logic (Social Proof Section)
    const slides = document.querySelectorAll('.testimonial-slide');
    const profiles = document.querySelectorAll('.author-profile');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlideIndex = 0;
    let autoSlideInterval;
    const slideDuration = 8000; // 8 seconds, perfect slow pace for emotional reading

    if (slides.length > 0) {
        function showSlide(index) {
            // Handle index bounds wrap-around
            if (index >= slides.length) {
                currentSlideIndex = 0;
            } else if (index < 0) {
                currentSlideIndex = slides.length - 1;
            } else {
                currentSlideIndex = index;
            }

            // Update slides active state
            slides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === currentSlideIndex);
            });

            // Update profiles active state
            profiles.forEach((profile, idx) => {
                profile.classList.toggle('active', idx === currentSlideIndex);
            });

            // Update navigation dots active state
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlideIndex);
            });
        }

        function nextSlide() {
            showSlide(currentSlideIndex + 1);
        }

        function prevSlide() {
            showSlide(currentSlideIndex - 1);
        }

        // Add event listeners for navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        // Add event listeners for dots
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                resetAutoSlide();
            });
        });

        // Autoplay functions
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, slideDuration);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Start autoplay initially
        startAutoSlide();

        // Pause autoplay on mouse enter, resume on mouse leave
        const sliderContainer = document.querySelector('.testimonial-slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            sliderContainer.addEventListener('mouseleave', () => {
                startAutoSlide();
            });
        }
    }

    // 7. Instagram Feed — Category Filter Pills
    const filterPills = document.querySelectorAll('.filter-pill');
    const igCards = document.querySelectorAll('.ig-card');

    if (filterPills.length > 0 && igCards.length > 0) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const filter = pill.getAttribute('data-filter');

                // Update active pill with aria-checked
                filterPills.forEach(p => {
                    p.classList.remove('active');
                    p.setAttribute('aria-checked', 'false');
                });
                pill.classList.add('active');
                pill.setAttribute('aria-checked', 'true');

                // Filter cards with a subtle stagger
                igCards.forEach((card, idx) => {
                    const category = card.getAttribute('data-category');
                    const shouldShow = filter === 'all' || category === filter;

                    if (shouldShow) {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, idx * 40);
                    } else {
                        card.style.transition = 'opacity 0.3s ease';
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });
    }

    // 8. Instagram Stats — Animated Counter
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    animateCounter(el, target);
                    statsObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => statsObserver.observe(el));
    }

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = formatNumber(target);
            }
        }

        requestAnimationFrame(update);
    }

    // ==========================================================
    // 9. Premium Swipe & Infinite Shuffle Photograph Stack (CTA Deck)
    // ==========================================================
    const photoDeck = document.querySelector('.cta-photo-deck');
    let ctaCards = Array.from(document.querySelectorAll('.cta-photo-card'));
    let isShuffling = false;

    if (photoDeck && ctaCards.length > 0) {
        // Track touch and drag gestures
        let startX = 0;
        let startY = 0;
        let deltaX = 0;
        let deltaY = 0;
        let isDragging = false;
        let activeCard = null;

        // Function to re-apply classes based on the current order in the array
        function updateDeckPositions() {
            ctaCards.forEach((card, index) => {
                // Remove all positional classes first
                card.classList.remove('pos-front', 'pos-mid-front', 'pos-mid-back', 'pos-back-left', 'pos-back-right', 'pos-hidden');
                
                // Assign classes based on current index in the circular array
                if (index === 0) {
                    card.classList.add('pos-front');
                } else if (index === 1) {
                    card.classList.add('pos-mid-front');
                } else if (index === 2) {
                    card.classList.add('pos-mid-back');
                } else if (index === 3) {
                    card.classList.add('pos-back-left');
                } else if (index === 4) {
                    card.classList.add('pos-back-right');
                } else {
                    card.classList.add('pos-hidden');
                }
            });
        }

        // Shuffle function (discard top photo, slide it down, bring next forward)
        function shuffleCard(direction = 'right', customDeltaX = null, customDeltaY = null) {
            if (isShuffling || ctaCards.length < 2) return;
            isShuffling = true;

            const topCard = ctaCards[0];
            topCard.classList.add('shuffling');

            // Determine exit angle and offset
            const exitX = customDeltaX ? customDeltaX * 2.5 : (direction === 'left' ? -350 : 350);
            const exitY = customDeltaY ? customDeltaY * 2.5 : 50;
            const exitRotate = direction === 'left' ? -25 : 25;

            // Step 1: Slide top card out elegantly
            topCard.style.transform = `translate(${exitX}px, ${exitY}px) rotate(${exitRotate}deg) scale(0.95)`;
            topCard.style.opacity = '0';

            // Step 2: While it is flying out, move it to the back of the stack array
            setTimeout(() => {
                // Remove the front card from the start of the array and push it to the end
                const shiftedCard = ctaCards.shift();
                ctaCards.push(shiftedCard);

                // Re-apply positional classes so the second card is now the front
                updateDeckPositions();

                // Strip temporary style strings so it respects pos-hidden's styling
                shiftedCard.style.transform = '';
                shiftedCard.style.opacity = '';

                // Step 3: Slide it back in elegantly at the bottom of the stack
                setTimeout(() => {
                    shiftedCard.classList.remove('shuffling');
                    isShuffling = false;
                }, 150);
            }, 300);
        }

        // Gesture binding helpers
        function getGestureCoords(e) {
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        }

        function onGestureStart(e) {
            if (isShuffling) return;

            // Only permit swipe controls on the top card
            activeCard = ctaCards[0];
            if (!activeCard) return;

            isDragging = true;
            activeCard.classList.add('dragging');

            const coords = getGestureCoords(e);
            startX = coords.x;
            startY = coords.y;
            deltaX = 0;
            deltaY = 0;
        }

        function onGestureMove(e) {
            if (!isDragging || !activeCard || isShuffling) return;

            const coords = getGestureCoords(e);
            deltaX = coords.x - startX;
            deltaY = coords.y - startY;

            // Apply interactive translation & rotation tracking the mouse/finger
            const rotation = deltaX * 0.08;
            activeCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg) scale(1.02)`;
        }

        function onGestureEnd() {
            if (!isDragging || !activeCard) return;
            isDragging = false;
            activeCard.classList.remove('dragging');

            const swipeThreshold = 80;
            
            if (Math.abs(deltaX) > swipeThreshold) {
                // A successful swipe gesture detected! Discard card
                const dir = deltaX > 0 ? 'right' : 'left';
                shuffleCard(dir, deltaX, deltaY);
            } else {
                // Short drag or simple tap/click: triggers convenient organic shuffle
                if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                    shuffleCard('right');
                } else {
                    // Dragged but let go before threshold: snap back nicely to rest
                    activeCard.classList.add('shuffling');
                    activeCard.style.transform = '';
                    setTimeout(() => {
                        activeCard.classList.remove('shuffling');
                    }, 400);
                }
            }

            activeCard = null;
        }

        // Register Mouse Drag Event Listeners on the active card deck
        photoDeck.addEventListener('mousedown', onGestureStart);
        window.addEventListener('mousemove', onGestureMove);
        window.addEventListener('mouseup', onGestureEnd);

        // Register Touch Swipe Event Listeners on the active card deck
        photoDeck.addEventListener('touchstart', onGestureStart, { passive: true });
        photoDeck.addEventListener('touchmove', onGestureMove, { passive: true });
        photoDeck.addEventListener('touchend', onGestureEnd);

        // Initialize positions initially
        updateDeckPositions();
    }

    // 10. Visibility change — pause/resume background intervals
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (offeringsInterval) clearInterval(offeringsInterval);
            if (autoSlideInterval) clearInterval(autoSlideInterval);
        } else {
            if (offeringsImages.length > 0) {
                offeringsInterval = setInterval(cycleOfferingsImages, 3500);
            }
            if (slides.length > 0) {
                startAutoSlide();
            }
        }
    });
});

