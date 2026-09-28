/* =============================================================
   Demo Portal — teaching JavaScript
   -------------------------------------------------------------
   What students learn here:
   1. Describing a whole menu as DATA (an array of objects).
   2. Generating the sidebar from that data with a loop.
   3. Accordion expand/collapse.
   4. Switching "views" in the main area.
   5. Validating a form and simulating a login (front-end only).

   TEACHING NOTE:
   The login is FAKE. The password sits in this file for anyone to
   read. Real apps must verify passwords on a secure server. This
   project teaches the interface, not real security.
   ============================================================= */

/* ---------- 1. The full menu, described as data ----------
   Each section has a `title` and a list of `items`.
   "General Login" opens the login form.
   Any item whose text contains "Login" or "Log In" also opens it. */
const MENU = [
  { title: "General Login", login: true, items: [] },

  { title: "Registration (PAN, VAT, EXCISE)", items: [
    "Application For Business Registration",
    "Application For PPAN Registration",
    "Application For Non-Resident Investor Registration",
    "Registration Login",
  ]},

  { title: "VAT", items: [
    "VAT Return Entry",
    "VAT Return Login",
    "VAT Close Of Business Entry",
    "VAT Close of Business Login",
  ]},

  { title: "Non-Resident Person (DST/VAT)", items: [
    "Application For DST Registration",
    "Registration Log In",
    "VAT Return Entry",
    "VAT Return Login",
    "DST Return Entry",
  ]},

  { title: "Non-Resident Airlines", items: [
    "Application For Registration",
    "Registration Log In",
    "NRA VAT Return Entry",
    "NRA VAT Return Login",
  ]},

  { title: "Estimated Return", items: [
    "Estimated Return Entry",
    "Estimated Return D02 Entry",
    "Estimated Return Login",
  ]},

  { title: "Income Tax", items: [
    "D-01 Return Entry",
    "D-02 Return Entry",
    "D-03 Return Entry",
    "D-04 Return Entry",
    "Jeopardy Assessment",
    "Change Of Control",
    "Close Of Business D-02",
    "Close Of Business D-03",
    "Tax Return Login",
  ]},

  { title: "Excise", items: [
    "Return Entry",
    "Excise Return Login",
    "Close Of Business Entry",
    "Close Of Business Login",
    "Self Renew Permit",
    "New Permit",
    "Manufacturer's Login",
    "Brand Registration",
    "Brand Registration Login",
  ]},

  { title: "Education Service Fee", items: [
    "Education Service Fee Entry",
  ]},

  { title: "Foreign Employment Service Fee", items: [
    "Foreign Employment Service Fee Entry",
  ]},

  { title: "Foreign Tourism Fee", items: [
    "Foreign Tourism Fee Entry",
  ]},

  { title: "Luxury Fee", items: [
    "Luxury Fee Entry",
  ]},

  { title: "Skill Promotion Fee", items: [
    "Skill Promotion Fee Entry",
  ]},

  { title: "Other Offices", items: [
    "Log In/Out",
  ]},
];

// Decide whether a menu item should open the login form.
function isLoginItem(text) {
  return /log\s?in/i.test(text); // matches "Login", "Log In", "Log In/Out"
}

/* ---------- 2. Build the sidebar from the data ---------- */
const menuEl = document.getElementById("menu");

MENU.forEach((section) => {
  const li = document.createElement("li");
  li.className = "menu__item";

  // Section header button
  const btn = document.createElement("button");
  btn.className = "menu__button";
  btn.setAttribute("aria-expanded", "true"); // start expanded, like the reference
  btn.innerHTML = `<span>${section.title}</span><span class="caret">▼</span>`;
  li.appendChild(btn);

  const sub = document.createElement("ul");
  sub.className = "submenu";

  if (section.login) {
    // "General Login": the header itself opens the login form
    btn.addEventListener("click", () => {
      openLogin(section.title);
      closeSidebarOnMobile();
    });
    sub.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  } else {
    // Build the sub-links
    section.items.forEach((text) => {
      const subLi = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = text;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (isLoginItem(text)) {
          openLogin(section.title + " — " + text);
        } else {
          openPlaceholder(section.title, text);
        }
        closeSidebarOnMobile();
      });
      subLi.appendChild(a);
      sub.appendChild(subLi);
    });

    // Header toggles this section open/closed
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      sub.hidden = open;
    });
  }

  li.appendChild(sub);
  menuEl.appendChild(li);
});

/* ---------- 3. View switching in the main area ---------- */
const views = {
  welcomeView: document.getElementById("welcomeView"),
  loginView: document.getElementById("loginView"),
  placeholderView: document.getElementById("placeholderView"),
};
function showView(name) {
  Object.keys(views).forEach((key) => { views[key].hidden = key !== name; });
}
function openLogin(contextLabel) {
  document.getElementById("loginContext").textContent = contextLabel
    ? "Sample sign-in for: " + contextLabel
    : "Sign in to the sample dashboard";
  showView("loginView");
}
function openPlaceholder(section, item) {
  document.getElementById("placeholderTitle").textContent = section + " — " + item;
  document.getElementById("placeholderText").textContent =
    "This is a placeholder page. In a real portal, choosing “" + item +
    "” would open its own form. Here it just shows this demo message.";
  showView("placeholderView");
}

/* ---------- Header date + mobile menu ---------- */
(function setDate() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  document.getElementById("topDate").textContent =
    "Date: " + d.getFullYear() + "." + pad(d.getMonth() + 1) + "." + pad(d.getDate());
})();

const sidebar = document.getElementById("sidebar");
document.getElementById("menuToggle").addEventListener("click", () => {
  sidebar.classList.toggle("is-open");
});
function closeSidebarOnMobile() {
  if (window.innerWidth <= 760) sidebar.classList.remove("is-open");
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

toggleBtn.addEventListener("click", () => {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  toggleBtn.textContent = hidden ? "Hide" : "Show";
  toggleBtn.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
});

function showError(input, el, msg) { input.classList.add("is-invalid"); el.textContent = msg; }
function clearError(input, el) { input.classList.remove("is-invalid"); el.textContent = ""; }

function validate() {
  let ok = true;
  const u = usernameInput.value.trim();
  const p = passwordInput.value;
  if (u === "") { showError(usernameInput, usernameError, "Username is required."); ok = false; }
  else if (u.length < 3) { showError(usernameInput, usernameError, "Username must be at least 3 characters."); ok = false; }
  else { clearError(usernameInput, usernameError); }

  if (p === "") { showError(passwordInput, passwordError, "Password is required."); ok = false; }
  else if (p.length < 6) { showError(passwordInput, passwordError, "Password must be at least 6 characters."); ok = false; }
  else { clearError(passwordInput, passwordError); }
  return ok;
}

usernameInput.addEventListener("input", () => { if (usernameInput.classList.contains("is-invalid")) validate(); });
passwordInput.addEventListener("input", () => { if (passwordInput.classList.contains("is-invalid")) validate(); });

form.addEventListener("submit", (e) => {
  e.preventDefault();
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
      } catch (err) { /* storage may be blocked; demo still works */ }
      setTimeout(() => { window.location.href = "dashboard.html"; }, 800);
    } else {
      formStatus.textContent = "Incorrect username or password. Try the demo credentials below.";
      formStatus.classList.add("is-error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign in";
    }
  }, 600);
});
