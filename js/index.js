import { preloadImages, preloadFonts } from './utils.js';

Splitting();

// toggle effect button
const toggleButton = document.querySelector('button.cover__button');
// .clip element
const clipElement = document.querySelector('.clip');
// .clip element > .clip__img
const clipImage = clipElement.querySelector('.clip__img');
// .slide elements (except current)
const slides = document.querySelectorAll('.slide:not(.slide--current)');
// slides parent
const slider = document.querySelector('.slides');
// cover title and chars
const title = document.querySelector('.cover__title');
const titleChars = title.querySelectorAll('.char');
// true if the large image preview is open. Starts open.
let isOpen = true;
// true if animation in progress
let isAnimating = false;

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
    
    gsap
    .timeline({
        defaults: {
            duration: 1.2,
            ease: 'power4.inOut',
        },
        onComplete: () => isAnimating = false
    })
    .addLabel('start', 0)
    
    .set(slider, {perspective: 1000})
    .set(clipElement, {willChange: 'clip-path'})
    .set(titleChars, {transformOrigin: '50% 100%'})

    // the cip element and its image
    .to(clipElement, {
        clipPath: 'inset(22% 39% round 23vw)',
    }, 'start')
    .to(clipImage, {
        scale: .8
    }, 'start')

    // all the other slides/images
    .fromTo(slides, {
        opacity: 0,
        z: 600
    }, {
        duration: 1.4,
        ease: 'power3.inOut',
        stagger: {
            amount: 0.15,
            from: 'center'
        },
        opacity: 1,
        z: 0,
    }, 'start')

    // title chars
    .to(titleChars, {
        duration: 1,
        scaleY: 0,
        stagger: {
            amount: 0.2,
            from: 'center'
        }
    }, 'start');

};

// effect for showing the large preview image
const showPreview = () => {

    isAnimating = true;

    gsap
    .timeline({
        defaults: {
            duration: 1.2,
            ease: 'expo.inOut',
        },
        onComplete: () => isAnimating = false
    })
    .addLabel('start', 0)
    .set(clipElement, {willChange: 'clip-path'})
    .set(clipElement, {willChange: 'clip-path'})
    
    .to(slides, {
        stagger: {
            amount: 0.1,
            from: 'edges'
        },
        opacity: 0,
        z: 600
    }, 'start')

    .addLabel('clip', 'start+=0.15')

    .to(clipImage, {
        scale: 1
    }, 'clip')

    .fromTo(clipElement, {
        clipPath: 'inset(22% 39% round 23vw)'
    }, {
        clipPath: 'inset(0% 0% round 0vw)'
    }, 'clip+=0.1')

    // filter
    .fromTo(clipImage, {
        filter: 'brightness(100%) saturate(100%)'
    }, {
        duration: 0.4,
        ease: 'power1.in',
        filter: 'brightness(200%) saturate(200%)'
    }, 'clip+=0.1')
    .to(clipImage, {
        duration: 0.8,
        ease: 'power1',
        filter: 'brightness(100%) saturate(100%)'
    }, 'clip+=0.4')

    // title chars
    .to(titleChars, {
        duration: 1,
        scaleY: 1,
        stagger: {
            amount: 0.2,
            from: 'center'
        }
    }, 'clip');

};

// toggle effect click event
toggleButton.addEventListener('click', () => toggleEffect());

// Preload images and fonts
Promise.all([preloadImages('.slide__img'), preloadFonts('lui6fbi')]).then(() => {
    document.body.classList.remove('loading')
});