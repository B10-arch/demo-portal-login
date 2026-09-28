/* =============================================================
   Demo Portal — dashboard (after-login) JavaScript
   -------------------------------------------------------------
   Teaches:
   1. A simple session GUARD (redirect if not "logged in").
   2. Building a collapsible tree menu from data.
   3. Wiring up demo action links and buttons.

   TEACHING NOTE:
   The "session" is just a sessionStorage flag set by the demo
   login. It is NOT real security. A real app checks the session
   on a secure server before showing any of this.
   ============================================================= */

/* ---------- 1. Session guard ---------- */
let loggedIn = false, user = "";
try {
  loggedIn = sessionStorage.getItem("demo_logged_in") === "true";
  user = sessionStorage.getItem("demo_user") || "";
} catch (e) {}

if (!loggedIn) {
  // Not signed in: send back to the login page.
  window.location.href = "index.html";
}

/* ---------- Header date + logged-in user ---------- */
(function setDate() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const el = document.getElementById("topDate");
  if (el) el.textContent = "Date: " + d.getFullYear() + "." + pad(d.getMonth() + 1) + "." + pad(d.getDate());
})();
document.getElementById("userValue").textContent = user || "student";

/* ---------- 2. Tree menu (as data) ---------- */
const TREE = [
  { label: "Integrated Tax Menus", open: true, children: [
    { label: "General", open: true, children: [
      { label: "Taxpayer Login", leaf: true },
      { label: "Create Taxpayer Login", leaf: true },
      { label: "Forgot Password", leaf: true },
      { label: "Payment Voucher Search", leaf: true },
    ]},
    { label: "Registration (PAN, VAT, EXCISE)", children: [{ label: "Registration Login", leaf: true }] },
    { label: "VAT", children: [{ label: "VAT Return Entry", leaf: true }] },
    { label: "Non-Resident Person (DST/VAT)", children: [{ label: "DST Return Entry", leaf: true }] },
    { label: "Non-Resident Airlines", children: [{ label: "NRA VAT Return Entry", leaf: true }] },
    { label: "Estimated Return", children: [{ label: "Estimated Return Entry", leaf: true }] },
    { label: "Income Tax", children: [{ label: "D-01 Return Entry", leaf: true }] },
    { label: "Excise", children: [{ label: "Excise Return Entry", leaf: true }] },
    { label: "E-TDS", children: [{ label: "E-TDS Entry", leaf: true }] },
    { label: "Health Tax", children: [{ label: "Health Tax Entry", leaf: true }] },
    { label: "Education Tax", children: [{ label: "Education Tax Entry", leaf: true }] },
    { label: "Electronic Billing", children: [{ label: "CBMS Login", leaf: true }] },
    { label: "Education Service Fee", children: [{ label: "Education Service Fee Entry", leaf: true }] },
    { label: "Foreign Employment Service Fee", children: [{ label: "Fee Entry", leaf: true }] },
    { label: "Foreign Tourism Fee", children: [{ label: "Fee Entry", leaf: true }] },
    { label: "Luxury Fee", children: [{ label: "Fee Entry", leaf: true }] },
    { label: "Other Offices", children: [{ label: "Directory", leaf: true }] },
  ]},
];

const treeRoot = document.getElementById("tree");

function renderTree(nodes, container) {
  nodes.forEach((node) => {
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "tree__node" + (node.leaf ? " tree__leaf" : "");

    const hasKids = node.children && node.children.length;

    // Make each row keyboard-focusable and announce it as a control.
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");
    if (hasKids) row.setAttribute("aria-expanded", String(!!node.open));

    const toggle = document.createElement("span");
    toggle.className = "tree__toggle";
    toggle.textContent = hasKids ? (node.open ? "−" : "+") : "";

    const icon = document.createElement("span");
    icon.className = "tree__icon";
    icon.textContent = node.leaf ? "📄" : "📁";
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.textContent = node.label;

    row.append(toggle, icon, label);
    li.appendChild(row);

    let kids = null;
    if (hasKids) {
      kids = document.createElement("ul");
      kids.className = "tree__children";
      kids.hidden = !node.open;
      renderTree(node.children, kids);
      li.appendChild(kids);
    }

    // Shared activation for both mouse and keyboard.
    function activate() {
      if (hasKids) {
        kids.hidden = !kids.hidden;
        toggle.textContent = kids.hidden ? "+" : "−";
        row.setAttribute("aria-expanded", String(!kids.hidden));
      } else {
        document.querySelectorAll(".tree__node--active").forEach((n) => n.classList.remove("tree__node--active"));
        row.classList.add("tree__node--active");
        toast('Demo menu: "' + node.label + '" (no real page in this sample)');
      }
    }

    row.addEventListener("click", activate);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
    });

    container.appendChild(li);
  });
}
renderTree(TREE, treeRoot);

/* ---------- 3. Action links (demo) ---------- */
const ACTIONS = [
  "KYT", "Verification", "Request For Filing Date Extension", "Transactions", "ATR",
  "Payment Voucher", "Request For Amendment", "Refund Bill Entry", "Add Withholdee PAN In ETDS",
  "Application For Loan", "Tax Clearance", "Add PSO/PSP", "Check Tax Clearance",
  "Print Excise Permit", "Zero VAT Return", "Paid Voucher List", "Preparation of Annex 10",
  "VAT Sales and Purchase Register Upload", "Audit Response", "Audit Notice", "Change Password",
];

const linksWrap = document.getElementById("actionLinks");
ACTIONS.forEach((name, i) => {
  const a = document.createElement("a");
  a.href = "#";
  a.textContent = name;
  a.addEventListener("click", (e) => { e.preventDefault(); openAction(name); });
  linksWrap.appendChild(a);
  if (i < ACTIONS.length - 1) {
    const sep = document.createElement("span");
    sep.className = "sep";
    sep.textContent = "|";
    linksWrap.appendChild(sep);
  }
});

const actionPanel = document.getElementById("actionPanel");
const actionTitle = document.getElementById("actionPanelTitle");
const actionBody = document.getElementById("actionPanelBody");

function openAction(name) {
  actionTitle.textContent = name;
  if (name === "Change Password") {
    actionBody.innerHTML = `
      <form id="pwForm" class="form" novalidate>
        <div class="field"><label class="field__label" for="pwOld">Current Password</label>
          <input type="password" id="pwOld" class="field__input" /></div>
        <div class="field"><label class="field__label" for="pwNew">New Password</label>
          <input type="password" id="pwNew" class="field__input" /></div>
        <div class="field"><label class="field__label" for="pwConf">Confirm New Password</label>
          <input type="password" id="pwConf" class="field__input" /></div>
        <button type="submit" class="btn btn--primary" style="max-width:220px">Update (demo)</button>
        <p class="form__status" id="pwStatus" role="status"></p>
      </form>`;
    document.getElementById("pwForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const oldp = document.getElementById("pwOld").value;
      const np = document.getElementById("pwNew").value;
      const cf = document.getElementById("pwConf").value;
      const st = document.getElementById("pwStatus");
      if (!oldp || !np || !cf) { st.className = "form__status is-error"; st.textContent = "All fields are required."; return; }
      if (np.length < 6) { st.className = "form__status is-error"; st.textContent = "New password must be at least 6 characters."; return; }
      if (np !== cf) { st.className = "form__status is-error"; st.textContent = "New passwords do not match."; return; }
      st.className = "form__status is-success"; st.textContent = "✔ Password updated (demo). Nothing was saved.";
    });
  } else {
    actionBody.innerHTML = `This is a demo action. In a real portal, “<strong>${name}</strong>” would open its own page. Here it just shows this message.`;
  }
  actionPanel.hidden = false;
  actionPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ---------- 4. Buttons: logout, clear cache, pay ---------- */
function logout() {
  try { sessionStorage.removeItem("demo_logged_in"); sessionStorage.removeItem("demo_user"); } catch (e) {}
  window.location.href = "index.html";
}
document.getElementById("logoutBtn").addEventListener("click", logout);

document.getElementById("clearCache").addEventListener("click", () => toast("Cache cleared (demo)."));
document.getElementById("clearCache2").addEventListener("click", () => toast("Cache cleared (demo)."));
document.getElementById("payVat").addEventListener("click", () => toast("VAT due is 0 — nothing to pay (demo)."));

const menuToggleBtn = document.getElementById("menuToggle");
menuToggleBtn.addEventListener("click", () => {
  const open = document.getElementById("sidebar").classList.toggle("is-open");
  menuToggleBtn.setAttribute("aria-expanded", String(open));
});

/* ---------- Tiny toast helper ---------- */
let toastTimer = null;
function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}
