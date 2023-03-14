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
    
    gsap.timeline({
        defaults: {
            duration: 1.2,
            ease: 'power4.inOut',
        },
        onComplete: () => isAnimating = false
    })
    .addLabel('start', 0)
    
    .set(slider, {perspective: 1000})
    .set(clipElement, {willChange: 'clip-path'})
    .set(titleChars, {transformOrigin: '0% 50%'})
    
    // the cip element and its image
    .fromTo(clipElement, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    }, {
        clipPath: 'polygon(39% 0%, 61% 0%, 61% 100%, 39% 100%)',
    }, 'start')
    .to(clipImage, {
        scale: 1.25
    }, 'start')

    .set(slides, {
        transformOrigin: (position,_,arr) => position < arr.length/2 ? '100% 50%' : '0% 50%',
        rotationY: (position,_,arr) => position < arr.length/2 ? -60 : 60,
        scale: 1,
    }, 'start')
    // all the other slides/images
    .to(slides, {
        duration: 0.7,
        ease: 'expo',
        opacity: .7,
        rotationY: 0,
        stagger: {
            amount: 0.2,
            from: 'center'
        }
    }, 'start+=0.45')

    // title chars
    .to(titleChars, {
        duration: 1,
        scaleX: 0,
        stagger: {
            amount: 0.3,
            from: '0'
        }
    }, 'start');

};

// effect for showing the large preview image
const showPreview = () => {

    isAnimating = true;

    gsap.timeline({
        defaults: {
            duration: 1,
            ease: 'expo',
        },
        onComplete: () => isAnimating = false
    })
    .addLabel('start', 0)
    .set(clipElement, {willChange: 'clip-path'})
    .set(clipElement, {willChange: 'clip-path'})
    
    // all the other slides/images
    .to(slides, {
        opacity: 0,
        scale: .8,
    }, 'start')

    .to(clipImage, {
        scale: 1
    }, 'start')

    .fromTo(clipElement, {
        clipPath: 'polygon(39% 0%, 61% 0%, 61% 100%, 39% 100%)'
    }, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
    }, 'start+=0.1')

    // filter
    .fromTo(clipImage, {
        filter: 'brightness(100%) saturate(100%)'
    }, {
        duration: 0.2,
        ease: 'none',
        filter: 'brightness(200%) saturate(200%)'
    }, 'start+=0.1')
    .to(clipImage, {
        duration: 0.8,
        ease: 'power1',
        filter: 'brightness(100%) saturate(100%)'
    }, 'start+=0.3')

    // title chars
    .to(titleChars, {
        scaleX: 1,
        stagger: {
            amount: 0.15,
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