
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
});// end adding scrolled class to window height scroll

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
}//end of slider

  const signInForm = document.querySelector(".sign-in-form");
  const registerForm = document.querySelector(".register-form");
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Utility: Show error near input
  function showError(input, message) {
    let error = input.parentElement.querySelector(".error-message");
    if (!error) {
      error = document.createElement("div");
      error.className = "error-message";
      error.style.color = "red";
      error.style.fontSize = "0.85em";
      error.setAttribute("aria-live", "polite");
      input.parentElement.appendChild(error);
    }
    error.textContent = message;
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", error.id || "error-" + Math.random().toString(36).slice(2, 8));
  }

  // Utility: Clear error
  function clearError(input) {
    const error = input.parentElement.querySelector(".error-message");
    if (error) error.textContent = "";
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
  }

  // Save email for future login
  function saveEmail(email) {
    let emails = JSON.parse(localStorage.getItem("userEmails") || "[]");
    if (!emails.includes(email)) {
      emails.push(email);
      localStorage.setItem("userEmails", JSON.stringify(emails));
    }
  }

  // Check if email exists
  function isEmailRegistered(email) {
    const emails = JSON.parse(localStorage.getItem("userEmails") || "[]");
    return emails.includes(email);
  }

  // Generic form validator
  function validateForm(inputs) {
    let isValid = true;
    let firstInvalid = null;

    for (const { input, required, validator, errorMessage } of inputs) {
      const value = input.value.trim();

      if (required && !value) {
        showError(input, errorMessage || "This field is required.");
        firstInvalid ??= input;
        isValid = false;
      } else if (validator && !validator(value)) {
        showError(input, errorMessage);
        firstInvalid ??= input;
        isValid = false;
      } else {
        clearError(input);
      }
    }

    if (!isValid && firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.focus();
    }

    return isValid;
  }

  // Password toggler
  function setupToggleButtons() {
    document.querySelectorAll(".toggle-password").forEach(btn => {
      const targetId = btn.dataset.target;
      const passwordInput = document.getElementById(targetId);

      if (passwordInput) {
        btn.addEventListener("click", () => {
          const isHidden = passwordInput.type === "password";
          passwordInput.type = isHidden ? "text" : "password";
          btn.src = isHidden ? "sign-doc/show.svg" : "sign-doc/Hide.svg";
          btn.alt = isHidden ? "Show password" : "Hide password";
        });
      }
    });
  }

  // Sign-In form logic
  if (signInForm) {
    const emailInput = signInForm.querySelector('input[name="email"]');
    const passwordInput = signInForm.querySelector('#signin-password');

    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputs = [
        {
          input: emailInput,
          required: true,
          validator: emailPattern.test.bind(emailPattern),
          errorMessage: "Please enter a valid email address.",
        },
        {
          input: passwordInput,
          required: true,
          errorMessage: "Password cannot be empty.",
        },
      ];

      if (!validateForm(inputs)) return;

      if (!isEmailRegistered(emailInput.value.trim())) {
        showError(emailInput, "Email is not registered.");
        return;
      }

      clearError(emailInput);
      showSuccessMessage(signInForm, "Sign-in successful!");
    });

    emailInput.addEventListener("input", () => clearError(emailInput));
    passwordInput.addEventListener("input", () => clearError(passwordInput));
  }

  // Register form logic
  if (registerForm) {
    const nameInput = registerForm.querySelector('input[placeholder="Full Name"]');
    const emailInput = registerForm.querySelector('input[placeholder="Email"]');
    const passwordInput = registerForm.querySelector("#register-password");
    const confirmPassword = registerForm.querySelector("#confirm-password");
    const checkboxes = registerForm.querySelectorAll('.checkbox-container input[type="checkbox"]');

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputs = [
        { input: nameInput, required: true, errorMessage: "Full name is required." },
        {
          input: emailInput,
          required: true,
          validator: emailPattern.test.bind(emailPattern),
          errorMessage: "Please enter a valid email address.",
        },
        {
          input: passwordInput,
          required: true,
          errorMessage: "Password cannot be empty.",
        },
        {
          input: confirmPassword,
          required: true,
          validator: val => val === passwordInput.value,
          errorMessage: "Passwords do not match.",
        },
      ];

      let allChecked = true;
      checkboxes.forEach(cb => {
        const label = registerForm.querySelector(`label[for="${cb.id}"]`);
        if (!cb.checked) {
          allChecked = false;
          label.style.color = "red";
        } else {
          label.style.color = ""; // Reset
        }
      });

      if (!allChecked) {
        alert("Please agree to all the terms before registering.");
        return;
      }

      if (!validateForm(inputs)) return;

      if (isEmailRegistered(emailInput.value.trim())) {
        showError(emailInput, "Email already registered.");
        return;
      }

      saveEmail(emailInput.value.trim());
      showSuccessMessage(registerForm, "Registration successful!");
      registerForm.reset();
    });

    [nameInput, emailInput, passwordInput, confirmPassword].forEach(input => {
      input.addEventListener("input", () => clearError(input));
    });
  }

  // Add password togglers
  setupToggleButtons();

  // Show success message
  function showSuccessMessage(form, message) {
    let successMsg = form.querySelector(".success-message");
    if (!successMsg) {
      successMsg = document.createElement("div");
      successMsg.className = "success-message";
      successMsg.style.color = "green";
      successMsg.style.marginTop = "12px";
      successMsg.style.fontSize = "0.9em";
      form.appendChild(successMsg);
    }
    successMsg.textContent = message;
    successMsg.style.display = "block";
  };
