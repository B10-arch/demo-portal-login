/* =============================================================
   Demo Portal — teaching JavaScript
   -------------------------------------------------------------
   Goals for students:
   1. Read values from a form.
   2. Validate them and show friendly error messages.
   3. Simulate a login WITHOUT sending anything to a server.

   IMPORTANT (teaching note):
   This is a fake, front-end-only login. The "credentials" live
   right here in the code, so anyone can read them. Never do real
   authentication in the browser like this — real apps check
   passwords on a secure server. This file exists to teach the
   UI and validation parts only.
   ============================================================= */

// A hard-coded demo account. Front-end only, on purpose.
const DEMO_USER = { username: "student", password: "demo1234" };

// Grab the elements we need once, up front.
const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const usernameError = document.getElementById("username-error");
const passwordError = document.getElementById("password-error");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");
const toggleBtn = document.getElementById("togglePassword");

/* ---- Show / hide password ---- */
toggleBtn.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  toggleBtn.textContent = isHidden ? "Hide" : "Show";
  toggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

/* ---- Small helpers to show and clear errors ---- */
function showError(input, errorEl, message) {
  input.classList.add("is-invalid");
  errorEl.textContent = message;
}

function clearError(input, errorEl) {
  input.classList.remove("is-invalid");
  errorEl.textContent = "";
}

/* ---- Validation rules ---- */
// Returns true when everything is valid, false otherwise.
function validate() {
  let valid = true;

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Username: required, at least 3 characters.
  if (username === "") {
    showError(usernameInput, usernameError, "Username is required.");
    valid = false;
  } else if (username.length < 3) {
    showError(usernameInput, usernameError, "Username must be at least 3 characters.");
    valid = false;
  } else {
    clearError(usernameInput, usernameError);
  }

  // Password: required, at least 6 characters.
  if (password === "") {
    showError(passwordInput, passwordError, "Password is required.");
    valid = false;
  } else if (password.length < 6) {
    showError(passwordInput, passwordError, "Password must be at least 6 characters.");
    valid = false;
  } else {
    clearError(passwordInput, passwordError);
  }

  return valid;
}

// Re-validate a field as the student types, once they've seen an error.
usernameInput.addEventListener("input", () => {
  if (usernameInput.classList.contains("is-invalid")) validate();
});
passwordInput.addEventListener("input", () => {
  if (passwordInput.classList.contains("is-invalid")) validate();
});

/* ---- Handle the form submission ---- */
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the browser from reloading the page

  formStatus.textContent = "";
  formStatus.className = "form__status";

  if (!validate()) return;

  // Pretend to contact a server: disable the button briefly.
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in…";

  setTimeout(() => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    const ok = username === DEMO_USER.username && password === DEMO_USER.password;

    if (ok) {
      formStatus.textContent = "Success! Redirecting to the dashboard…";
      formStatus.classList.add("is-success");

      // Store a pretend session flag so the dashboard knows we "logged in".
      // Wrapped in try/catch because storage can be blocked in some browsers.
      try {
        sessionStorage.setItem("demo_logged_in", "true");
        sessionStorage.setItem("demo_user", username);
      } catch (e) {
        /* ignore — the demo still works without storage */
      }

      setTimeout(() => { window.location.href = "dashboard.html"; }, 800);
    } else {
      formStatus.textContent = "Incorrect username or password. Try the demo credentials below.";
      formStatus.classList.add("is-error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign in";
    }
  }, 600); // fake network delay
});

/* ---- Forgot password link (demo only) ---- */
document.getElementById("forgot").addEventListener("click", (e) => {
  e.preventDefault();
  formStatus.textContent = "This is a demo — password reset is not implemented.";
  formStatus.className = "form__status";
});
