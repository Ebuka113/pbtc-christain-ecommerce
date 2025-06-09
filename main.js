
// adding scrolled class to window height scroll
const nav = document.querySelector("nav");
const mobileNav = document.querySelector("nav.mobile-nav");
const menuIcon = document.querySelector(".menu-icon");
const closeIcon = document.querySelector(".mobile-menu-container .close-icon");
const mobileMenuContainer = document.querySelector(".mobile-menu-container");




window.addEventListener("scroll", () => {
    if (window.pageYOffset > 60) {
        nav.classList.add("scrolled");
        mobileNav.classList.add("scrolled")
    } else {
        nav.classList.remove("scrolled");
        mobileNav.classList.remove("scrolled")
    }
});

// end adding scrolled class to window height scroll


menuIcon.addEventListener("click", () => {
  mobileMenuContainer.classList.add("active")
});

closeIcon.addEventListener("click", () => {
  mobileMenuContainer.classList.remove("active")
});



//start of slider
// Get references to the slider and indicator elements
const slider = document.getElementById('slider-wrapper2');
const dots = document.querySelectorAll('.dot');

// Track the current slide (starts at 0)
let currentSlide = 0;

// Go to a specific slide when a dot is clicked
function goToSlide(slideIndex) {
  currentSlide = slideIndex;

// Calculate how much to move the slider (100% per card)
  const cardWidth = slider.querySelector('.card-info2').offsetWidth;
  const scrollAmount = cardWidth * slideIndex;

  // Slide the wrapper to show the chosen card
  slider.style.transform = `translateX(-${scrollAmount}px)`;

  // Update which dot is active
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === slideIndex);
  });

}

//end of slider