'use strict';

///////////////////////////////////////
// Modal window
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const navLinkAll = document.querySelectorAll('.nav__link');
const tabs = document.querySelectorAll('.operations__tabs');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function () {
  seciton1.scrollIntoView({ behavior: 'smooth' });
});

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
header.after(message);

///////////
// Remove the cookie banner
//1. add event listener to the button
message
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function (e) {
    //2. when clicked add hidden class to the whole div
    message.classList.add('hidden');
  });

////////////////////////////////////
// SECTIONS REVEAL
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  // that is taking the first element of the array,
  // the array itself has multiple values
  //   const [entry] = entries;
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');

    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//////////
// Lazy loading images
// Images have the biggest impact on websites loading time.
// Instead of big real pictures, preset their small, blurred versions.
// And once the user scrolls to the image it will be replaced with the real one.
// Loading it only if necessary.
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////////
// NAVIGATION
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// give fade out effect to nav links
// give event listener of mousehover to links

// to make it dry refactor
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    navLinkAll.forEach(el => {
      if (link !== el) el.style.opacity = `${this}`;
    });
  }
};

navLinks.addEventListener('mouseover', handleHover.bind(0.5));
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     // give fade out effect to everything in the nav but the hovered link
//     // Doesn't work because the parents opacity overrides the childs one.
//     // navLinks.style.opacity = '0.5';
//     // link.style.opacity = '1';
//     // instead use for each:
//     navLinkAll.forEach(el => {
//       if (link !== el) el.style.opacity = '0.5';
//     });
//     // After making a solution look at how can you simplify, improve it. How can you make it DRY.
//   }
navLinks.addEventListener('mouseout', handleHover.bind(1));

///////////
//sticky navigation
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// // 1. add sticky class to nav when pass certain point
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

/////////////////////////////////////
//Tabbed component

//1. add event listeners to tabs container
tabsContainer.addEventListener('click', function (e) {
  //remove from the past one
  document
    .querySelector('.operations__tab--active')
    .classList.remove('operations__tab--active');

  document
    .querySelector('.operations__content--active')
    .classList.remove('operations__content--active');

  // add to the new one
  if (e.target.classList.contains('operations__tab')) {
    e.target.classList.toggle('operations__tab--active');

    //add active content based on n
    document
      .querySelector(`.operations__content--${e.target.dataset.tab}`)
      .classList.add('operations__content--active');
  }
});

//////////////////////////////////
// SLIDER
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  /////// FUNCTIONS
  // create dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    //select all and remove active class
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    // find the active slide and add active class to it
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Go to slide function
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //Positioning the slides

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //Implementing the right button
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Adding right/ left keys
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider();
