/* =============================================================
   Demo Portal — teaching JavaScript
   -------------------------------------------------------------
   What students learn here:
   1. Describing a whole app as DATA (menu + form templates).
   2. Generating a sidebar from data.
   3. Accordion expand/collapse (dropdowns hidden until clicked).
   4. Switching views in the main area.
   5. Building forms from a field spec and validating them.
   6. Simulating a login and a form submit (front-end only).

   TEACHING NOTE:
   Nothing here talks to a server. The login password sits in this
   file, and no form actually submits data anywhere. Real apps must
   verify credentials and store data on a secure server. This project
   teaches the interface, not real security.
   ============================================================= */

/* ================= 1. MENU (as data) ================= */
const MENU = [
  { title: "General Login", login: true, items: [] },
  { title: "Registration (PAN, VAT, EXCISE)", items: [
    "Application For Business Registration",
    "Application For PPAN Registration",
    "Application For Non-Resident Investor Registration",
    "Registration Login",
  ]},
  { title: "VAT", items: [
    "VAT Return Entry", "VAT Return Login",
    "VAT Close Of Business Entry", "VAT Close of Business Login",
  ]},
  { title: "Non-Resident Person (DST/VAT)", items: [
    "Application For DST Registration", "Registration Log In",
    "VAT Return Entry", "VAT Return Login", "DST Return Entry",
  ]},
  { title: "Non-Resident Airlines", items: [
    "Application For Registration", "Registration Log In",
    "NRA VAT Return Entry", "NRA VAT Return Login",
  ]},
  { title: "Estimated Return", items: [
    "Estimated Return Entry", "Estimated Return D02 Entry", "Estimated Return Login",
  ]},
  { title: "Income Tax", items: [
    "D-01 Return Entry", "D-02 Return Entry", "D-03 Return Entry", "D-04 Return Entry",
    "Jeopardy Assessment", "Change Of Control",
    "Close Of Business D-02", "Close Of Business D-03", "Tax Return Login",
  ]},
  { title: "Excise", items: [
    "Return Entry", "Excise Return Login", "Close Of Business Entry", "Close Of Business Login",
    "Self Renew Permit", "New Permit", "Manufacturer's Login",
    "Brand Registration", "Brand Registration Login",
  ]},
  { title: "Education Service Fee", items: ["Education Service Fee Entry"] },
  { title: "Foreign Employment Service Fee", items: ["Foreign Employment Service Fee Entry"] },
  { title: "Foreign Tourism Fee", items: ["Foreign Tourism Fee Entry"] },
  { title: "Luxury Fee", items: ["Luxury Fee Entry"] },
  { title: "Skill Promotion Fee", items: ["Skill Promotion Fee Entry"] },
  { title: "Other Offices", items: ["Log In/Out"] },
];

function isLoginItem(text) { return /log\s?in/i.test(text); }

/* ================= 2. FORM TEMPLATES (as data) =================
   Each template is a list of fields. A field is:
   { name, label, type, options?, required?, full? }
   type: text | tel | email | number | date | select | textarea
   full: field spans both grid columns. */
const MONTHS = ["Baishakh","Jestha","Ashadh","Shrawan","Bhadra","Ashwin",
                "Kartik","Mangsir","Poush","Magh","Falgun","Chaitra"];
const FYEARS = ["2079/80","2080/81","2081/82","2082/83"];
const PROVINCES = ["Koshi","Madhesh","Bagmati","Gandaki","Lumbini","Karnali","Sudurpashchim"];

const FORM_TEMPLATES = {
  registrationBusiness: [
    { name:"bizName", label:"Business / Trade Name", type:"text", required:true, full:true },
    { name:"regType", label:"Registration Type", type:"select", options:["Private Firm","Partnership","Company","Other"], required:true },
    { name:"owner", label:"Owner / Proprietor Name", type:"text", required:true },
    { name:"idNo", label:"Citizenship / ID No.", type:"text", required:true },
    { name:"province", label:"Province", type:"select", options:PROVINCES },
    { name:"district", label:"District", type:"text" },
    { name:"ward", label:"Municipality / Ward", type:"text" },
    { name:"contact", label:"Contact No.", type:"tel", required:true },
    { name:"email", label:"Email", type:"email", required:true },
    { name:"activity", label:"Business Activity", type:"textarea", full:true },
  ],
  registrationPersonalPAN: [
    { name:"fullName", label:"Full Name", type:"text", required:true, full:true },
    { name:"dob", label:"Date of Birth", type:"date" },
    { name:"idNo", label:"Citizenship No.", type:"text", required:true },
    { name:"father", label:"Father's Name", type:"text" },
    { name:"address", label:"Permanent Address", type:"text", full:true },
    { name:"contact", label:"Contact No.", type:"tel" },
    { name:"email", label:"Email", type:"email" },
    { name:"occupation", label:"Occupation", type:"text" },
  ],
  registrationNonResident: [
    { name:"name", label:"Applicant / Investor Name", type:"text", required:true, full:true },
    { name:"country", label:"Country", type:"text", required:true },
    { name:"passport", label:"Passport No.", type:"text", required:true },
    { name:"kind", label:"Type", type:"select", options:["Investment","Digital Service (DST)","VAT","Airline","Other"] },
    { name:"localContact", label:"Local Contact", type:"text" },
    { name:"email", label:"Email", type:"email", required:true },
  ],
  vatReturn: [
    { name:"pan", label:"PAN", type:"text", required:true },
    { name:"name", label:"Taxpayer Name", type:"text", required:true },
    { name:"month", label:"Tax Period (Month)", type:"select", options:MONTHS, required:true },
    { name:"fy", label:"Fiscal Year", type:"select", options:FYEARS, required:true },
    { name:"sales", label:"Total Sales", type:"number" },
    { name:"purchases", label:"Total Purchases", type:"number" },
    { name:"vatOut", label:"VAT Collected (Sales)", type:"number" },
    { name:"vatIn", label:"VAT Paid (Purchases)", type:"number" },
    { name:"netVat", label:"Net VAT Payable", type:"number" },
    { name:"remarks", label:"Remarks", type:"textarea", full:true },
  ],
  incomeTaxReturn: [
    { name:"pan", label:"PAN", type:"text", required:true },
    { name:"name", label:"Taxpayer Name", type:"text", required:true },
    { name:"iy", label:"Income Year", type:"select", options:FYEARS, required:true },
    { name:"income", label:"Total Income", type:"number" },
    { name:"deductions", label:"Deductions", type:"number" },
    { name:"taxable", label:"Taxable Income", type:"number" },
    { name:"tax", label:"Tax Payable", type:"number" },
    { name:"advance", label:"Advance Tax Paid", type:"number" },
  ],
  estimatedReturn: [
    { name:"pan", label:"PAN", type:"text", required:true },
    { name:"name", label:"Taxpayer Name", type:"text", required:true },
    { name:"fy", label:"Fiscal Year", type:"select", options:FYEARS, required:true },
    { name:"turnover", label:"Estimated Turnover", type:"number" },
    { name:"income", label:"Estimated Taxable Income", type:"number" },
    { name:"tax", label:"Estimated Tax", type:"number" },
  ],
  exciseReturn: [
    { name:"pan", label:"PAN", type:"text", required:true },
    { name:"name", label:"Firm Name", type:"text", required:true },
    { name:"product", label:"Product / Commodity", type:"text" },
    { name:"month", label:"Period (Month)", type:"select", options:MONTHS },
    { name:"qty", label:"Quantity", type:"number" },
    { name:"duty", label:"Excise Duty", type:"number" },
  ],
  closeOfBusiness: [
    { name:"pan", label:"PAN", type:"text", required:true },
    { name:"name", label:"Taxpayer Name", type:"text", required:true },
    { name:"date", label:"Closure Date", type:"date", required:true },
    { name:"reason", label:"Reason", type:"textarea", full:true },
  ],
  feeReturn: [
    { name:"pan", label:"PAN", type:"text", required:true },
    { name:"name", label:"Taxpayer Name", type:"text", required:true },
    { name:"fy", label:"Fiscal Year", type:"select", options:FYEARS, required:true },
    { name:"month", label:"Period (Month)", type:"select", options:MONTHS },
    { name:"amount", label:"Amount", type:"number", required:true },
    { name:"remarks", label:"Remarks", type:"textarea", full:true },
  ],
  generic: [
    { name:"pan", label:"PAN", type:"text", required:true },
    { name:"name", label:"Taxpayer Name", type:"text", required:true },
    { name:"details", label:"Details", type:"textarea", full:true },
  ],
};

// Choose which template an item should open.
function pickForm(section, item) {
  if (isLoginItem(item)) return "login";
  const t = item.toLowerCase();
  if (t.includes("close of business")) return "closeOfBusiness";
  if (section.startsWith("Registration")) {
    if (t.includes("ppan")) return "registrationPersonalPAN";
    if (t.includes("non-resident")) return "registrationNonResident";
    return "registrationBusiness";
  }
  if (section.startsWith("VAT")) return "vatReturn";
  if (section.includes("Non-Resident Person")) return t.includes("application") ? "registrationNonResident" : "vatReturn";
  if (section.includes("Non-Resident Airlines")) return t.includes("application") ? "registrationNonResident" : "vatReturn";
  if (section.includes("Estimated Return")) return "estimatedReturn";
  if (section.includes("Income Tax")) return "incomeTaxReturn";
  if (section.includes("Excise")) return (t.includes("permit") || t.includes("brand")) ? "registrationBusiness" : "exciseReturn";
  return "feeReturn"; // service-fee sections + Other Offices
}

/* ================= 3. Build the sidebar ================= */
const menuEl = document.getElementById("menu");

MENU.forEach((section) => {
  const li = document.createElement("li");
  li.className = "menu__item";

  const btn = document.createElement("button");
  btn.className = "menu__button";
  btn.setAttribute("aria-expanded", "false"); // start collapsed; expand on click
  btn.innerHTML = `<span>${section.title}</span><span class="caret">▼</span>`;
  li.appendChild(btn);

  const sub = document.createElement("ul");
  sub.className = "submenu";
  sub.hidden = true; // dropdowns hidden until header clicked

  if (section.login) {
    btn.addEventListener("click", () => { openLogin(section.title); closeSidebarOnMobile(); });
  } else {
    section.items.forEach((text) => {
      const subLi = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = text;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const type = pickForm(section.title, text);
        const label = section.title + " — " + text;
        if (type === "login") openLogin(label);
        else renderForm(label, type);
        closeSidebarOnMobile();
      });
      subLi.appendChild(a);
      sub.appendChild(subLi);
    });
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      sub.hidden = open;
    });
  }

  li.appendChild(sub);
  menuEl.appendChild(li);
});

/* ================= 4. View switching ================= */
const views = {
  welcomeView: document.getElementById("welcomeView"),
  loginView: document.getElementById("loginView"),
  formView: document.getElementById("formView"),
};
function showView(name) { Object.keys(views).forEach((k) => { views[k].hidden = k !== name; }); }

function openLogin(label) {
  document.getElementById("loginContext").textContent = label ? "Sample sign-in for: " + label : "Sign in to the sample dashboard";
  showView("loginView");
}

/* ================= 5. Dynamic form rendering ================= */
let currentFields = [];
const dynForm = document.getElementById("dynForm");
const formFields = document.getElementById("formFields");
const dynStatus = document.getElementById("dynStatus");

function fieldHTML(f) {
  const id = "f_" + f.name;
  const req = f.required ? ' <span class="req">*</span>' : "";
  let control;
  if (f.type === "textarea") {
    control = `<textarea id="${id}" name="${f.name}" class="field__input" rows="3"></textarea>`;
  } else if (f.type === "select") {
    const opts = ['<option value="">-- Select --</option>']
      .concat(f.options.map((o) => `<option value="${o}">${o}</option>`)).join("");
    control = `<select id="${id}" name="${f.name}" class="field__input">${opts}</select>`;
  } else {
    control = `<input type="${f.type}" id="${id}" name="${f.name}" class="field__input" />`;
  }
  return `<div class="field ${f.full ? "field--full" : ""}">
      <label class="field__label" for="${id}">${f.label}${req}</label>
      ${control}
      <p class="field__error" id="e_${f.name}" role="alert"></p>
    </div>`;
}

function renderForm(title, type) {
  currentFields = FORM_TEMPLATES[type] || FORM_TEMPLATES.generic;
  document.getElementById("formTitle").textContent = title;
  formFields.innerHTML = `<div class="form-grid">${currentFields.map(fieldHTML).join("")}</div>`;
  dynStatus.textContent = "";
  dynStatus.className = "form__status";
  showView("formView");
}

// Clear a field's error as soon as the user fixes it.
dynForm.addEventListener("input", (e) => {
  const el = e.target;
  if (el.classList && el.classList.contains("is-invalid") && el.value.trim()) {
    el.classList.remove("is-invalid");
    const err = document.getElementById("e_" + el.name);
    if (err) err.textContent = "";
  }
});

dynForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  currentFields.forEach((f) => {
    if (!f.required) return;
    const el = dynForm.elements[f.name];
    const err = document.getElementById("e_" + f.name);
    if (!el || !el.value.trim()) {
      if (el) el.classList.add("is-invalid");
      if (err) err.textContent = f.label + " is required.";
      ok = false;
    } else {
      el.classList.remove("is-invalid");
      if (err) err.textContent = "";
    }
  });
  if (!ok) {
    dynStatus.className = "form__status is-error";
    dynStatus.textContent = "Please fill the required fields marked *.";
    return;
  }
  dynStatus.className = "form__status is-success";
  dynStatus.textContent = "✔ Demo submitted. Nothing was saved or sent anywhere.";
  dynForm.reset();
});

/* ================= Header date + mobile menu ================= */
(function setDate() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  document.getElementById("topDate").textContent =
    "Date: " + d.getFullYear() + "." + pad(d.getMonth() + 1) + "." + pad(d.getDate());
})();

const sidebar = document.getElementById("sidebar");
const menuToggleBtn = document.getElementById("menuToggle");
menuToggleBtn.addEventListener("click", () => {
  const open = sidebar.classList.toggle("is-open");
  menuToggleBtn.setAttribute("aria-expanded", String(open));
});
function closeSidebarOnMobile() { if (window.innerWidth <= 760) sidebar.classList.remove("is-open"); }

/* ================= 6. Login form (front-end only) ================= */
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

function showErr(input, el, msg) { input.classList.add("is-invalid"); el.textContent = msg; }
function clearErr(input, el) { input.classList.remove("is-invalid"); el.textContent = ""; }

function validateLogin() {
  let ok = true;
  const u = usernameInput.value.trim(), p = passwordInput.value;
  if (u === "") { showErr(usernameInput, usernameError, "Username is required."); ok = false; }
  else if (u.length < 3) { showErr(usernameInput, usernameError, "Username must be at least 3 characters."); ok = false; }
  else clearErr(usernameInput, usernameError);
  if (p === "") { showErr(passwordInput, passwordError, "Password is required."); ok = false; }
  else if (p.length < 6) { showErr(passwordInput, passwordError, "Password must be at least 6 characters."); ok = false; }
  else clearErr(passwordInput, passwordError);
  return ok;
}

usernameInput.addEventListener("input", () => { if (usernameInput.classList.contains("is-invalid")) validateLogin(); });
passwordInput.addEventListener("input", () => { if (passwordInput.classList.contains("is-invalid")) validateLogin(); });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formStatus.textContent = ""; formStatus.className = "form__status";
  if (!validateLogin()) return;
  submitBtn.disabled = true; submitBtn.textContent = "Signing in…";
  setTimeout(() => {
    const ok = usernameInput.value.trim() === DEMO_USER.username && passwordInput.value === DEMO_USER.password;
    if (ok) {
      formStatus.textContent = "Success! Redirecting to the dashboard…";
      formStatus.classList.add("is-success");
      try {
        sessionStorage.setItem("demo_logged_in", "true");
        sessionStorage.setItem("demo_user", usernameInput.value.trim());
      } catch (err) {}
      setTimeout(() => { window.location.href = "dashboard.html"; }, 800);
    } else {
      formStatus.textContent = "Incorrect username or password. Try the demo credentials below.";
      formStatus.classList.add("is-error");
      submitBtn.disabled = false; submitBtn.textContent = "Sign in";
    }
  }, 600);
});
