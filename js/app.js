/* =============================================================
   Demo Portal — teaching JavaScript
   -------------------------------------------------------------
   What students learn here:
   1. Building a menu from data (an array of objects).
   2. Accordion (expand/collapse) behaviour.
   3. Switching between "views" in the main area.
   4. Validating a form and simulating a login (front-end only).

   TEACHING NOTE:
   The login below is FAKE. The password is right here in the code
   for anyone to read. Real apps must check passwords on a secure
   server. This project teaches the interface, not real security.
   ============================================================= */

/* ---------- 1. The menu, described as data ---------- */
// Each item has a label and a list of sample sub-links.
// The first item ("General Login") is special: it opens the login form.
const MENU = [
  { label: "General Login", login: true, links: [] },
  { label: "Registration (PAN, VAT, EXCISE)", links: ["New Registration", "Check Status", "Update Details"] },
  { label: "VAT", links: ["File VAT Return", "VAT Payment", "VAT Credit"] },
  { label: "Non-Resident Person (DST/VAT)", links: ["Register", "File Return"] },
  { label: "Non-Resident Airlines", links: ["Register", "Monthly Return"] },
  { label: "Estimated Return", links: ["Submit Estimate", "Revise Estimate"] },
  { label: "Income Tax", links: ["File Income Tax", "Advance Tax", "Tax Clearance"] },
  { label: "Excise", links: ["Excise Registration", "Excise Return"] },
  { label: "Education Service Fee", links: ["File Return", "Payment"] },
  { label: "Foreign Employment Service Fee", links: ["File Return", "Payment"] },
  { label: "Foreign Tourism Fee", links: ["File Return", "Payment"] },
  { label: "Luxury Fee", links: ["File Return", "Payment"] },
  { label: "Skill Promotion Fee", links: ["File Return", "Payment"] },
  { label: "Other Offices", links: ["Directory", "Contact"] },
];

/* ---------- 2. Build the menu in the sidebar ---------- */
const menuEl = document.getElementById("menu");

MENU.forEach((item, index) => {
  const li = document.createElement("li");
  li.className = "menu__item";

  // The clickable section header
  const btn = document.createElement("button");
  btn.className = "menu__button";
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = `<span>${item.label}</span><span class="caret">▼</span>`;
  li.appendChild(btn);

  // The submenu list (hidden until expanded)
  const sub = document.createElement("ul");
  sub.className = "submenu";
  sub.hidden = true;

  if (item.login) {
    // "General Login" opens the login view directly
    btn.addEventListener("click", () => {
      closeAllMenus();
      showView("loginView");
      closeSidebarOnMobile();
    });
  } else {
    // Other items expand to show sample sub-links
    item.links.forEach((linkText) => {
      const subLi = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = linkText;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        openPlaceholder(item.label, linkText);
        closeSidebarOnMobile();
      });
      subLi.appendChild(a);
      sub.appendChild(subLi);
    });

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      closeAllMenus();
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        sub.hidden = false;
      }
    });
  }

  li.appendChild(sub);
  menuEl.appendChild(li);
});

// Collapse every open menu section
function closeAllMenus() {
  document.querySelectorAll(".menu__button").forEach((b) => b.setAttribute("aria-expanded", "false"));
  document.querySelectorAll(".submenu").forEach((s) => (s.hidden = true));
}

/* ---------- 3. Switch which view is visible in the main area ---------- */
const views = {
  welcomeView: document.getElementById("welcomeView"),
  loginView: document.getElementById("loginView"),
  placeholderView: document.getElementById("placeholderView"),
};

function showView(name) {
  Object.keys(views).forEach((key) => {
    views[key].hidden = key !== name;
  });
}

function openPlaceholder(section, link) {
  document.getElementById("placeholderTitle").textContent = section + " — " + link;
  document.getElementById("placeholderText").textContent =
    "This is a placeholder page. In a real portal, choosing this would open the " +
    link + " screen. Here it just shows this demo message.";
  showView("placeholderView");
}

/* ---------- Mobile menu toggle ---------- */
const sidebar = document.getElementById("sidebar");
document.getElementById("menuToggle").addEventListener("click", () => {
  sidebar.classList.toggle("is-open");
});
function closeSidebarOnMobile() {
  if (window.innerWidth <= 720) sidebar.classList.remove("is-open");
}

/* ---------- 4. The login form (front-end only) ---------- */
const DEMO_USER = { username: "student", password: "demo1234" };

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const usernameError = document.getElementById("username-error");
const passwordError = document.getElementById("password-error");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");
const toggleBtn = document.getElementById("togglePassword");

// Show / hide password
toggleBtn.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  toggleBtn.textContent = isHidden ? "Hide" : "Show";
  toggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

function showError(input, errorEl, message) {
  input.classList.add("is-invalid");
  errorEl.textContent = message;
}
function clearError(input, errorEl) {
  input.classList.remove("is-invalid");
  errorEl.textContent = "";
}

// Returns true only when both fields pass their rules.
function validate() {
  let valid = true;
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (username === "") {
    showError(usernameInput, usernameError, "Username is required."); valid = false;
  } else if (username.length < 3) {
    showError(usernameInput, usernameError, "Username must be at least 3 characters."); valid = false;
  } else {
    clearError(usernameInput, usernameError);
  }

  if (password === "") {
    showError(passwordInput, passwordError, "Password is required."); valid = false;
  } else if (password.length < 6) {
    showError(passwordInput, passwordError, "Password must be at least 6 characters."); valid = false;
  } else {
    clearError(passwordInput, passwordError);
  }
  return valid;
}

usernameInput.addEventListener("input", () => {
  if (usernameInput.classList.contains("is-invalid")) validate();
});
passwordInput.addEventListener("input", () => {
  if (passwordInput.classList.contains("is-invalid")) validate();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  formStatus.className = "form__status";

  if (!validate()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in…";

  setTimeout(() => {
    const ok = usernameInput.value.trim() === DEMO_USER.username &&
               passwordInput.value === DEMO_USER.password;

    if (ok) {
      formStatus.textContent = "Success! Redirecting to the dashboard…";
      formStatus.classList.add("is-success");
      try {
        sessionStorage.setItem("demo_logged_in", "true");
        sessionStorage.setItem("demo_user", usernameInput.value.trim());
      } catch (e) { /* storage may be blocked; demo still works */ }
      setTimeout(() => { window.location.href = "dashboard.html"; }, 800);
    } else {
      formStatus.textContent = "Incorrect username or password. Try the demo credentials below.";
      formStatus.classList.add("is-error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign in";
    }
  }, 600);
});
