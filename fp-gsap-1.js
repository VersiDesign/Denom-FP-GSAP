document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);

    // Initial opacity settings for animations
    gsap.set([
        ".fp-20yrs-txt-fade", 
        ".fp-pkg__txt-wrap"
    ], {opacity: 0});

    // Setup general animations for the page
    function setupGeneralAnimations(isMobile) {
        if (isMobile) {
            // Mobile-specific animations
            gsap.timeline()
                .from(".fp-20yrs__wrap", { x: -window.innerWidth, ease: "power1.out", duration: 1.5, delay: 1 })
                .to(".fp-20yrs-txt-fade", { opacity: 1, duration: 1 }, "-=0.5")
                .to(".fp-pkg__txt-wrap", { opacity: 1, duration: 1 }, "+=0.5");
        } else {
            // Desktop animations
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
    }

    // Setup diagram animation
    function setupDiagramAnimation(startPoint) {
        let pkgDiagramTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".fp-pkg-diagram__section",
                start: startPoint,
                end: "bottom bottom",
                scrub: 1,
                toggleActions: "restart pause reverse pause"
            }
        });

        for (let i = 1; i <= 6; i++) {
            pkgDiagramTimeline.from(`.fp-pkg-diagram__section .fp-pkg__diagram-pt${i}-wrap .fp-pkg__circle${i}`, {
                scale: 0, duration: 2, transformOrigin: "center center"
            }, `+=0.5`)
            .from(`.fp-pkg-diagram__section .fp-pkg__diagram-pt${i}-wrap .fp-pkg__diagram-arrow, .fp-pkg-diagram__section .fp-pkg__diagram-pt${i}-wrap .fp-pkg__label`, {
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
            delayTime += 2; // Adjust this value as needed to slightly delay the fade-in
        }

        // Slightly reduce the delay for '.fp-semicirc__caption-down'
        if (selector === '.fp-semicirc__caption-down') {
            delayTime -= 1.5; // Adjust this value as needed to reduce the delay
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
                // Reset the circle's position and opacity when scrolling back
                gsap.to(circle3, {
                    x: 0,
                    y: 0, // Reset Y position as well
                    opacity: 1, // Reset opacity to fully visible
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
    // Set initial opacity for all elements
    gsap.set([".fp-gap__circle-wrap--left", ".fp-gap__circle-wrap--right", ".fp-gap__txt-wrap", ".fp-circle-txt"], { opacity: 0 });

    // Initialize the timeline with ScrollTrigger for '.fp-gap__section'
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".fp-gap-title__section",
            start: "top center",
            end: "top -20%",
            scrub: 1
        },
        delay: 5 // Delay the start of the timeline
    });

    // Fade in circles together
    tl.to([".fp-gap__circle-wrap--left", ".fp-gap__circle-wrap--right"], { opacity: 1, duration: 3, ease: "power1.inOut" })
      // Start moving circles outwards, but slow down their movement
      .to(".fp-gap__circle-wrap--left", { x: "-=70vw", duration: 10, ease: "power1.inOut" }, "<")
      .to(".fp-gap__circle-wrap--right", { x: "+=70vw", duration: 10, ease: "power1.inOut" }, "<")
      // Fade in text inside circles
      .to(".fp-circle-txt", { opacity: 1, duration: 1, ease: "power1.inOut" }, "2")
      // Fade in '.fp-gap__txt-wrap' when the circles are midway through their movement
      .to(".fp-gap__txt-wrap", { opacity: 1, duration: 2, ease: "power1.inOut" }, "3");
}

    // Curved arrows sequence
    function animateArrowsSection() {
    // Target elements
    const leftArrow = '.fp-arrow--left';
    const rightArrow = '.fp-arrow--right';
    const textWrap = '.fp-arrows__txt-wrap';

    // ScrollTrigger for the entire sequence
    gsap.timeline({
        scrollTrigger: {
            trigger: '.fp-arrows__section',
            start: 'top 70%',
            end: 'top center',
            scrub: 1,
            toggleActions: 'play none none reverse',
        }
    })
    // Fade in and rotate left arrow
    .from(leftArrow, {
        rotation: -90,
        opacity: 0,
        ease: 'power1.inOut',
    }, 0)

    // Fade in and rotate right arrow
    .from(rightArrow, {
        rotation: 90,
        opacity: 0,
        ease: 'power1.inOut',
    }, 0)

    // Fade in the text wrap in sync with the arrows
    .from(textWrap, {
        opacity: 0,
        ease: 'power1.inOut',
    }, 0.5);
}

    // Claims Ticker sequence
    function ClaimsTicker() {
    const tickerItems = document.querySelectorAll('.fp-claims__ticker > div');
    const tickerHeight = document.querySelector('.fp-claims__ticker').offsetHeight;

    tickerItems.forEach((item, index) => {
        // Calculate the stagger delay based on index
        const staggerDelay = index * (5 / tickerItems.length); // Adjust the time according to the number of items

        gsap.timeline({
            repeat: -1, // Loop indefinitely
            repeatDelay: staggerDelay,
            defaults: {ease: "none"}
        })
        .fromTo(item, {y: tickerHeight, opacity: 0.5}, {y: -item.offsetHeight / 2, opacity: 1, duration: 2.5}) // First half: Move up and fade to 1
        .to(item, {y: -item.offsetHeight, opacity: 0.5, duration: 2.5}); // Second half: Continue moving up and fade back to 0.5
    });
}

    // Function to initialize all animations
    function setupAnimations() {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        setupGeneralAnimations(isMobile);
        setupDiagramAnimation(isMobile ? "top 80%" : "top 60%");
        animateCircleWithSection();
        animateSequentialFadeIns();
        centerCircleHorizontallyAndMoveDown();
        animateGapTitleSection();
        animateGapSection();
        animateArrowsSection();
        ClaimsTicker();
    }

    setupAnimations(); // Call to initialize animations on page load
});
