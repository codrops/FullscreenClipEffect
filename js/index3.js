import { preloadImages, getInitialPosition, preloadFonts } from './utils.js';

Splitting();

// toggle effect button
const toggleButton = document.querySelector('button.cover__button');
// .clip element
const clipElement = document.querySelector('.clip');
// .clip element > .clip__img
const clipImage = clipElement.querySelector('.clip__img');
// .slide elements (except current)
const slides = document.querySelectorAll('.slide:not(.slide--current)');
// cover title and chars
const title = document.querySelector('.cover__title');
const titleChars = title.querySelectorAll('.char');
// true if the large image preview is open. Starts open.
let isOpen = true;
// true if animation in progress
let isAnimating = false;
let gridTimeline, previewTimeline;

// toggle effect function
const toggleEffect = () => {

    if ( isAnimating ) return;

    if ( isOpen ) {
        showSlider();
    }
    else {
        showPreview();
    }

    isOpen = !isOpen;
    
};

// effect for showing the slider
const showSlider = () => {

    isAnimating = true;
    
    gridTimeline = gsap.timeline({
        defaults: {
            duration: 1.2,
            ease: 'power4.inOut',
        },
        onComplete: () => isAnimating = false
    })
    .addLabel('start', 0)
    
    .set(clipElement, {willChange: 'clip-path'})
    .set(titleChars, {transformOrigin: '50% 0%'})
    
    // the cip element and its image
    .to(clipElement, {
        clipPath: 'inset(22% 39% round 1vw)',
    }, 'start')
    .to(clipImage, {
        scale: 0.85
    }, 'start');

    for (const [pos,slide] of slides.entries()) {
        // all the other slides/images
        const {x,y} = getInitialPosition(slide,4000);

        gridTimeline.fromTo(slide, {
            opacity: 0,
            x: x,
            y: y
        }, {
            ease: 'power4',
            delay: pos*.02,
            opacity: 1,
            x: 0,
            y: 0
        }, 'start')
    }

    // title chars
    gridTimeline
    .to(titleChars, {
        duration: 0.8,
        scaleY: 8,
        scaleX: 0.1,
        opacity: 0,
        stagger: {
            amount: 0.25,
            from: '0'
        }
    }, 'start');

};

// effect for showing the large preview image
const showPreview = () => {

    isAnimating = true;

    previewTimeline = gsap.timeline({
        defaults: {
            duration: 1.2,
            ease: 'power4.inOut',
        },
        onComplete: () => isAnimating = false
    })
    .addLabel('start', 0)
    .set(clipElement, {willChange: 'clip-path'})
    .set(clipElement, {willChange: 'clip-path'})
    .set(titleChars, {transformOrigin: '50% 100%'});
    
    for (const slide of slides) {
        const {x,y} = getInitialPosition(slide,1000);

        previewTimeline.to(slide, {
            opacity: 1,
            ease: 'power4.inOut',
            x: x,
            y: y
        }, 'start')
    };

    previewTimeline
    .to(clipImage, {
        scale: 1
    }, 'start')

    .fromTo(clipElement, {
        clipPath: 'inset(22% 39% round 1vw)'
    }, {
        clipPath: 'inset(0% 0% round 0vw)'
    }, 'start')

    // filter
    .fromTo(clipImage, {
        filter: 'brightness(100%) saturate(100%)'
    }, {
        duration: 0.4,
        ease: 'power1.in',
        filter: 'brightness(200%) saturate(200%)'
    }, 'start')
    .to(clipImage, {
        duration: 0.8,
        ease: 'power1',
        filter: 'brightness(100%) saturate(100%)'
    }, 'start+=0.4')

    // title chars
    .fromTo(titleChars, {
        scaleY: 8,
        scaleX: 0.1,
        opacity: 0,
    }, {
        duration: 0.8,
        scaleY: 1,
        scaleX: 1,
        opacity: 1,
        stagger: {
            amount: 0.25,
            from: 'end'
        }
    }, 'start');

};

// toggle effect click event
toggleButton.addEventListener('click', () => toggleEffect());

// Preload images and fonts
Promise.all([preloadImages('.slide__img'), preloadFonts('lui6fbi')]).then(() => {
    document.body.classList.remove('loading')
});