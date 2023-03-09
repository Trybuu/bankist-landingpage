'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabsContainer = document.querySelector('.operations__tab-container'); // kontener
const tabs = document.querySelectorAll('.operations__tab'); // buttons
const tabsContent = document.querySelectorAll('.operations__content'); // zawartość

const nav = document.querySelector('.nav');

// ///////////////////////////////////////////////////////////////////
// Modal window

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

// ///////////////////////////////////////////////////////////////////
// Scrolling

btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// ///////////////////////////////////////////////////////////////////
// Page navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log('Z delegowania zdarzeń', e.target); // Ustawiamy nasłuchiwanie na kontener linków ale łapie nam też jego dzieci

  // Porównywanie
  if (e.target.classList.contains('nav__link')) {
    console.log('Link');
    e.preventDefault(); // Wyłącza przenoszenie do sekcji po kliknięciu w link
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  // W wewnątrz jest span na który jeśli klikniemy nic się nie wydarzy dlatego:
  // Używamy metody closest, podając dokładnie element który ma wykonywać zdarzenie
  const clicked = e.target.closest('.operations__tab');

  // Warunek, który kończy wykonytwanie funkcji gdy to w co klikniemy zwróci NULL
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(o => o.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5)); // bindujemy do funkcji handleHover this jako argument
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // pobierz wysokość nav

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  // jeżelu obiekt header zniknął z widoku dodaj klasę
  else nav.classList.remove('sticky'); // jeżeli header jest w widoku usuń klasę
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // null czyli dokument
  threshold: 0, // w jakim stopniu (w %) ma być widoczny element obserwowany czyli header aby wykonała się funkcja
  rootMargin: `-${navHeight}px`, // mówi to tyle: wykonaj funkcję stickyNav gdy threshold = 0 = header niewidoczny ale zrób to wcześniej o wysokośc nav w pixelach
});

headerObserver.observe(header); // obserwuj header, czy znika z widoku okna czy znajduję się w widoku

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return; // Jeżeli obiekt nie jest widoczny wyjdź z funkcji

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // Usuń element, który jest aktualnie widoczny z obserwowanych, powoduje to to, że funkcja nie jest na nim wykonywana ponownie
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, options) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // Dodajemy tego listenera, ponieważ przy wolnym łączu obrazek nie byłby jeszcze załadowany a już usunelibyśmy filtr rozmycia
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

// Slider
const slider = function () {
  let curSlide = 0;

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const maxSldie = slides.length - 1;
  const dotContainer = document.querySelector('.dots');

  const createDots = function () {
    // _ - to ominięcie parametru, którego nie potrzebujemy
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  slides.forEach((s, i) => (s.style.transform = `translateX(${i * 100}%)`));

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSldie;
    else curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const nextSlide = function () {
    if (curSlide === maxSldie) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };

  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    // Jeżeli true wykonaj
    e.key === 'ArrowLeft' && prevSlide(curSlide);
    e.key === 'ArrowRight' && nextSlide(curSlide);
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; // destrukturyzacja, jeśli tworzymy zmienną i przypisujemy do niej wartośc z obiektu o tej samej nazwie klucza
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();
