document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);

    // Initial opacity settings for animations
    gsap.set([
        ".fp-20yrs-txt-fade", 
        ".fp-pkg__txt-wrap"
    ], {opacity: 0});

    // Intro animations
    function setupGeneralAnimations() {
    // General (previously desktop) animations applied for all devices
    gsap.timeline({
        scrollTrigger: {
            trigger: ".fp-20yrs__section",
            start: "top 85%",
            end: "bottom 70%",
            scrub: 1,
            toggleActions: "restart pause reverse pause"
        }
    })
    .from(".fp-20yrs__wrap", { x: -window.innerWidth, ease: "power1.out", duration: 1.5 }) 
    .to(".fp-20yrs-txt-fade", { opacity: 1, duration: 1 }, "-=0.5");

    ScrollTrigger.create({
        trigger: ".fp-pkg-title__section",
        start: "top 80%",
        end: "bottom 80%",
        onEnter: () => gsap.to(".fp-pkg__txt-wrap", { opacity: 1, duration: 2 }),
        onLeaveBack: () => gsap.to(".fp-pkg__txt-wrap", { opacity: 0, duration: 1 })
    });
}

    // Bubble diagram sequence
// Bubble diagram sequence
function setupDiagramAnimation() {
    // Check if it's a mobile device
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    let startPercent = isMobile ? "top 80%" : "top 65%";
    let endPercent = isMobile ? "top 40%" : "top 15%";

    let pkgDiagramTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".fp-pkg-diagram__section",
            start: startPercent,
            end: endPercent,
            scrub: 1,
            toggleActions: "restart pause reverse pause"
        }
    });

    for (let i = 1; i <= 6; i++) {
        pkgDiagramTimeline.from(`.fp-pkg-diagram__section .fp-pkg__diagram-pt${i}-wrap .fp-pkg__circle${i}`, {
            scale: 0, duration: 3, transformOrigin: "center center"
        }, `+=0.5`)
        .from(`.fp-pkg-diagram__section .fp-pkg__diagram-pt${i}-wrap .fp-line--vert`, {
            scaleY: 0, duration: 3, transformOrigin: "top center"
        }, `-=${0.5}`)
        .from(`.fp-pkg-diagram__section .fp-pkg__diagram-pt${i}-wrap .fp-pkg__label`, {
            opacity: 0, duration: 1
        }, `-=${0.5}`);
    }
}

    // Animation for circle within the semi-circle section
    function animateCircleWithSection() {
    // Determine if the current viewport corresponds to a mobile device or a large desktop
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const isLargeDesktop = window.matchMedia("(min-width: 1440px)").matches;
    
    // Animation for '.fp-pkg__circle3' with '.fp-semcirc__section'
    ScrollTrigger.create({
        trigger: ".fp-semcirc__section",
        start: "top center",
        end: "bottom center",
        scrub: true,
        markers: false,
        onEnter: () => {
            const semcircSection = document.querySelector('.fp-semcirc__section');
            const diagramSection = document.querySelector('.fp-pkg-diagram__section');
            gsap.to(".fp-pkg__circle3", {
                y: () => {
                    const circle3 = document.querySelector('.fp-pkg__circle3');
                    const combinedHeight = diagramSection.offsetHeight + (semcircSection.offsetHeight / 2);
                    const additionalOffset = isMobile ? -10 : isLargeDesktop ? -80 : -90;
                    const totalOffset = combinedHeight - (circle3.offsetHeight / 2) + additionalOffset;
                    return totalOffset;
                },
                x: isMobile ? "-120%" : isLargeDesktop ? "-130%" : "-125%",
                scale: isMobile ? 2.5 : isLargeDesktop ? 1.5 : 1.8,
                ease: "power1.inOut",
                duration: 1
            });
        },
        onLeaveBack: (self) => {
            if (!self.isActive) {
                gsap.to(".fp-pkg__circle3", {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power1.inOut"
                });
            }
        }
    });
}

    // Sequential fade-in animations for specific divs as they come into view
    function animateSequentialFadeIns() {
    const elements = ['.fp-title--lg-italic', '.fp-semicirc__caption-up', '.fp-semicirc__caption-down'];

    elements.forEach((selector, index) => {
        let delayTime = index * 3; // Default delay time

        // Slightly increase the delay for '.fp-title--lg-italic'
        if (selector === '.fp-title--lg-italic') {
            delayTime += 2;
        }

        // Slightly reduce the delay for '.fp-semicirc__caption-down'
        if (selector === '.fp-semicirc__caption-down') {
            delayTime -= 1.75;
        }

        gsap.from(selector, {
            scrollTrigger: {
                trigger: ".fp-semcirc__section",
                start: "top bottom",
                end: "center center",
                toggleActions: "play none none reset",
            },
            opacity: 0,
            duration: 1,
            delay: delayTime,
            ease: "power1.inOut",
        });
    });
}

    // Transition of circle to middle and move down
    function centerCircleHorizontallyAndMoveDown() {
    const circle3 = document.querySelector('.fp-pkg__circle3');
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const isLargeDesktop = window.matchMedia("(min-width: 1440px)").matches;

    // Final widths of '.fp-pkg__circle3' at different breakpoints after scaling
    const finalWidths = {
        mobile: 300, // Final width for mobile
        desktop: 540, // Final width for desktop
        largeDesktop: 600, // Final width for large desktop
    };

    ScrollTrigger.create({
        trigger: ".fp-gap-title__section",
        start: "top center",
        end: "bottom center",
        scrub: 1,
        onEnter: () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight; // Get the viewport height
            let circleFinalWidth = isMobile ? finalWidths.mobile : isLargeDesktop ? finalWidths.largeDesktop : finalWidths.desktop;

            // Calculate the target X position to center the circle in the window
            // Considering the circle's current position and its final width
            const circleRect = circle3.getBoundingClientRect();
            const targetX = (viewportWidth / 2) - (circleFinalWidth / 2) - (circleRect.left + window.scrollX);
            // Adjust target Y based on whether the device is mobile, adding 100px for mobile
            const targetY = isMobile ? (viewportHeight / 2) + 10 : viewportHeight - 300; // Use half viewport height for mobile, plus an additional height

            gsap.to(circle3, {
                x: `+=${targetX}`,
                y: `+=${targetY}`, // Adjust Y based on device type
                opacity: 0, // Fade out the circle
                ease: "power1.inOut",
                duration: 1
            });
        },
        onLeaveBack: (self) => {
    if (!self.isActive) {
        // Reset the circle's position and opacity by clearing GSAP styles
        gsap.to(circle3, {
            clearProps: "all", // This removes all inline styles applied by GSAP, potentially resetting the element to its original CSS state
            ease: "power1.inOut",
            duration: 1
        });
    }
}
    });
}

    // Gap title sequence
    function animateGapTitleSection() {
    gsap.from('.fp-gap__title-wrap', {
        scrollTrigger: {
            trigger: '.fp-gap-title__section',
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            toggleActions: 'play none none reverse',
        },
        opacity: 0,
        ease: 'power1.inOut',
    });
}

    // Gap circles sequence
function animateGapSection() {
    // Check if it's a mobile device
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Set initial opacity for all elements
    gsap.set([".fp-gap__circle-wrap--left", ".fp-gap__circle-wrap--right", ".fp-gap__txt-wrap", ".fp-circle-txt"], { opacity: 0 });

    // Initialize the timeline with ScrollTrigger for '.fp-gap__section'
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".fp-gap-title__section",
            start: "top center",
            end: "top -20%",
            scrub: 1
        }
    });

    // Fade in circles together
    tl.to([".fp-gap__circle-wrap--left", ".fp-gap__circle-wrap--right"], { opacity: 1, duration: 3, ease: "power1.inOut" })
      // Start moving circles outwards, but slow down their movement
      .to(".fp-gap__circle-wrap--left", { x: "-=70vw", duration: 10, ease: "power1.inOut" }, "<")
      .to(".fp-gap__circle-wrap--right", { x: "+=70vw", duration: 10, ease: "power1.inOut" }, "<")
      // Fade in text inside circles
      .to(".fp-circle-txt", { opacity: 1, duration: 1, ease: "power1.inOut" }, "2")
      // Fade in '.fp-gap__txt-wrap' when the circles are midway through their movement
      // Add conditional delay for mobile devices
      .to(".fp-gap__txt-wrap", { opacity: 1, duration: 2, ease: "power1.inOut" }, isMobile ? "5" : "3");
}

    // Curved arrows sequence
    function animateArrowsSection() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const timelineStart = isMobile ? 2 : 0; // Start later on mobile

    gsap.timeline({
        scrollTrigger: {
            trigger: '.fp-arrows__section',
            start: 'top 70%',
            end: 'top center',
            scrub: 1,
            toggleActions: 'play none none reverse',
        }
    })
    .from('.fp-arrow--left', {
        rotation: -90,
        opacity: 0,
        ease: 'power1.inOut',
    }, timelineStart) // Use timelineStart for mobile adjustment
    .from('.fp-arrow--right', {
        rotation: 90,
        opacity: 0,
        ease: 'power1.inOut',
    }, timelineStart) // Use timelineStart for mobile adjustment
    .from('.fp-arrows__txt-wrap', {
        opacity: 0,
        ease: 'power1.inOut',
    }, timelineStart + 0.5); // Adjust based on timelineStart
}

    // Claims Ticker sequence
function animateClaimsTicker() {
    const tickerItems = document.querySelectorAll('.fp-claims__ticker > div');
    const ticker = document.querySelector('.fp-claims__ticker');
    const duration = 5; // Total duration for one cycle of a single item

    tickerItems.forEach((item, index) => {
        // Calculate the stagger delay based on index
        const staggerDelay = (duration / tickerItems.length) * index;

        gsap.timeline({
            repeat: -1, // Infinite loop
            delay: staggerDelay, // Staggered start for each item
            onRepeat: function() {
                // This function resets the item to the bottom of the container
                this.set(item, { y: ticker.offsetHeight });
            }
        })
        .fromTo(item, 
            { y: ticker.offsetHeight }, 
            { y: -item.offsetHeight, duration: duration, ease: "none" }
        );
    });
}

    // Claims title fade in
    function animateClaimsTitle() {

  gsap.from(".fp-claims__title-wrap", {
    scrollTrigger: {
      trigger: ".fp-claims__section",
      start: "top 50%",
      end: "top 20%",
      scrub: 1,
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    duration: 0.5,
    ease: "power1.inOut"
  });
}

// Floating bubbles
function animateBubble(bubble, delay = 0) {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    gsap.set(bubble, { x: `+=${window.innerWidth}px` });

    const travelDuration = isMobile ? gsap.utils.random(10, 25) : gsap.utils.random(15, 45);
    const yRange = isMobile ? gsap.utils.random(200, -100) : gsap.utils.random(420, -190);

    // Horizontal movement with delay
    const moveHorizontally = () => {
        gsap.fromTo(bubble, 
            { x: window.innerWidth }, 
            { x: -bubble.offsetWidth, 
              duration: travelDuration, 
              ease: "none",
              delay: delay, // Apply the stagger delay here
              onComplete: moveHorizontally
            });
    };

    // Vertical movement with random Y position and delay
    gsap.to(bubble, {
        y: `+=${yRange}`, 
        duration: () => gsap.utils.random(5, 10),
        ease: "sine.inOut",
        repeat: -1, 
        yoyo: true,
        delay: delay // Apply the stagger delay here
    });

    const innerCircle = bubble.querySelector('.fp-circle__empty--rl');
    gsap.to(innerCircle, {
        scale: () => gsap.utils.random(0.6, 1.6),
        opacity: () => gsap.utils.random(0.3, 1),
        duration: () => gsap.utils.random(5, 18),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay // Apply the stagger delay here
    });

    // Delay only applies to the first cycle of the animation
    if (delay > 0) {
        setTimeout(moveHorizontally, delay * 1000); // Convert seconds to milliseconds
    } else {
        moveHorizontally(); // Start immediately if no delay
    }
}

// Apply the animation to each bubble
function animateAllBubbles() {
    const bubbles = document.querySelectorAll('.fp-bubbles__circle-wrap--bbl-1, .fp-bubbles__circle-wrap--bbl-2, .fp-bubbles__circle-wrap--bbl-3, .fp-bubbles__circle-wrap--bbl-4, .fp-bubbles__circle-wrap--bbl-5, .fp-bubbles__circle-wrap--bbl-6');
    bubbles.forEach(bubble => {
        // Generate a random start delay for each bubble, e.g., between 0 and x seconds
        const startDelay = gsap.utils.random(0, 10, false);
        animateBubble(bubble, startDelay);
    });
}

    // Stat counter sequences
function statCounterAnimation({ counterSelector, triggerSelector, includePlus, animationDuration, startPercent, decimalPlaces = 1 }) {
    const counter = document.querySelector(counterSelector);
    const targetValue = parseFloat(counter.getAttribute('data-target'));
    let formatCounter = value => `${includePlus ? '+' : ''}${value.toFixed(decimalPlaces)}%`;

    // Set the initial value
    counter.innerHTML = formatCounter(startPercent);

    ScrollTrigger.create({
        trigger: triggerSelector,
        start: 'top 70%',
        end: "bottom top",
        onEnter: () => {
            gsap.to({}, {
                duration: animationDuration,
                onUpdate: function () {
                    let currentValue = gsap.utils.interpolate(startPercent, targetValue, this.progress());
                    counter.innerHTML = formatCounter(currentValue);
                }
            });
        },
        onLeaveBack: () => {
            counter.innerHTML = formatCounter(startPercent); // Reset to initial value
        }
    });
}

    // Stats section fade in
    function animateStatsSection() {
    // Target the .fp-stats__section and its children
    const statsSection = gsap.timeline({
        scrollTrigger: {
            trigger: '.fp-stats__section',
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
            reverse: true,
        },
    });

    // Fade in the title with specificity to avoid affecting other elements with the same class
    statsSection.from('.fp-stats__section .fp-title--italic', { 
        autoAlpha: 0, 
        duration: 0.5, 
        ease: 'power1.inOut' 
    });

    // Fade in and slide up each column one by one
    statsSection.from('.fp-stats__section .fp-stats__col', { 
        autoAlpha: 0, 
        y: 50, // Moves up from 50 pixels below
        duration: 0.5, 
        ease: 'power1.out', 
        stagger: 0.2 
    });
}

    // Bars sequence
    function animateBarsSection() {
    // Trigger for fading in the section with scrub
    gsap.timeline({
        scrollTrigger: {
            trigger: '.fp-bars__section',
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
            reverse: true,
        }
    }).from('.fp-bars__section', { 
        autoAlpha: 0, 
        duration: 0.5, 
        ease: 'power1.inOut'
    });

    // Directly scale up the .fp-bars__bar-max when the section enters the viewport
    ScrollTrigger.create({
        trigger: '.fp-bars__section',
        start: 'top 70%',
        onEnter: () => {
            gsap.from('.fp-bars__bar-max', {
                width: '0%',
                duration: 2.9,
                ease: 'power3.Out'
            });
        }
    });
}

    // Function to initialize all animations
    function setupAnimations() {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        setupGeneralAnimations();
        setupDiagramAnimation();
        animateCircleWithSection();
        animateSequentialFadeIns();
        centerCircleHorizontallyAndMoveDown();
        animateGapTitleSection();
        animateGapSection();
        animateArrowsSection();
        animateClaimsTicker();
        animateClaimsTitle();
        animateAllBubbles();
        animateStatsSection();
        animateBarsSection();

        statCounterAnimation({
          counterSelector: '#kantarCounter',
          triggerSelector: '.fp-stats__section',
          includePlus: false,
          animationDuration: 3,
          startPercent: 0,
          decimalPlaces: 0
        });

        statCounterAnimation({
          counterSelector: '#gartnerCounter',
          triggerSelector: '.fp-stats__section',
          includePlus: false,
          animationDuration: 3,
          startPercent: 0,
          decimalPlaces: 0
        });

        statCounterAnimation({
          counterSelector: '#pwcCounter',
          triggerSelector: '.fp-stats__section',
          includePlus: false,
          animationDuration: 3,
          startPercent: 0,
          decimalPlaces: 0
        });

        statCounterAnimation({
          counterSelector: '#barCounter',
          triggerSelector: '.fp-bars__section',
          includePlus: true,
          animationDuration: 2,
          startPercent: 0,
          decimalPlaces: 0
        });

        statCounterAnimation({
          counterSelector: '#case-ww1-Counter',
          triggerSelector: '.fp-case__stats',
          includePlus: false,
          animationDuration: 3,
          startPercent: 0,
          decimalPlaces: 1
        });

        statCounterAnimation({
          counterSelector: '#case-ww2-Counter',
          triggerSelector: '.fp-case__stats',
          includePlus: false,
          animationDuration: 3,
          startPercent: 0,
          decimalPlaces: 0
        });

        statCounterAnimation({
          counterSelector: '#case-ww3-Counter',
          triggerSelector: '.fp-case__stats',
          includePlus: false,
          animationDuration: 3,
          startPercent: 0,
          decimalPlaces: 0
        });

    }

    setupAnimations(); // Call to initialize animations on page load
});
