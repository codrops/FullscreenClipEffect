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
// cover title and chars
const title = document.querySelector('.cover__title');
const titleChars = title.querySelectorAll('.char');
gsap.set(titleChars, {
    x: (position,_,arr) => (position - Math.floor(arr.length/2)) * 80
})
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
    
    .set(clipElement, {willChange: 'clip-path'})
    
    // the cip element and its image
    .to(clipElement, {
        clipPath: 'inset(22% 39% round 23vw)',
    }, 'start')
    .to(clipImage, {
        scale: 1.2
    }, 'start')

    .set(slides, {
        transformOrigin: (position,_,arr) => position < arr.length/2 ? '100% 50%' : '0% 50%',
        x: (position,_,arr) => {
            let newposition = position < arr.length/2 ? position : position + 1;
            return 800*(newposition-arr.length/2);
        },
        scaleX: 5,
        skewX: (position,_,arr) => position < arr.length/2 ? 25 : -25,
    }, 'start')
    // all the other slides/images
    .fromTo(slides, {
        opacity: 0,
    }, {
        duration: 1.4,
        stagger: {
            amount: 0.1,
            from: 'center'
        },
        opacity: 1,
        x: 0,
        scaleX: 1,
        skewX: 0
    }, 'start')

    // title chars
    .to(titleChars, {
        duration: 1.4,
        x: 0,
        stagger: {
            grid: 'auto',
            amount: 0.1,
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
        x: (position,_,arr) => {
            let newposition = position < arr.length/2 ? position : position + 1;
            return 800*(newposition-arr.length/2);
        },
        scaleX: 2,
        skewX: (position,_,arr) => position < arr.length/2 ? 25 : -25
    }, 'start')

    .to(clipImage, {
        scale: 1
    }, 'start+=0.15')

    .fromTo(clipElement, {
        clipPath: 'inset(22% 39% round 23vw)'
    }, {
        clipPath: 'inset(0% 0% round 0vw)'
    }, 'start+=0.25')

    // filter
    .fromTo(clipImage, {
        filter: 'brightness(100%) saturate(100%)'
    }, {
        duration: 0.4,
        ease: 'power1.in',
        filter: 'brightness(200%) saturate(200%)'
    }, 'start+=0.25')
    .to(clipImage, {
        duration: 0.8,
        ease: 'power1',
        filter: 'brightness(100%) saturate(100%)'
    }, 'start+=0.65')

    // title chars
    .to(titleChars, {
        duration: 1.4,
        x: (position,_,arr) => (position - Math.floor(arr.length/2)) * 80
        
    }, 'start+=0.15');

};

// toggle effect click event
toggleButton.addEventListener('click', () => toggleEffect());

// Preload images and fonts
Promise.all([preloadImages('.slide__img'), preloadFonts('lui6fbi')]).then(() => {
    document.body.classList.remove('loading')
});