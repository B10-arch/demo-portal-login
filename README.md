# Demo Portal — Teaching Sample

A small, front-end-only **e-services portal demo** built for teaching students
the basics of HTML, CSS, and JavaScript. It shows a common portal layout: a top
bar, a left sidebar menu, and a main content area with a sign-in form.

> ⚠️ **This is a teaching sample.** It is not a real portal and is not affiliated
> with any organization or government service. The national emblem and any real
> agency name from the reference layout have been removed on purpose. It does no
> real authentication — never enter a real password.

## What it teaches

- Building a **sidebar menu from data** (an array in JavaScript)
- **Accordion** expand/collapse behaviour
- Switching between **views** in a single page
- Structuring an accessible **login form** in HTML
- **CSS** layout with variables, a responsive sidebar, and focus states
- **JavaScript** form validation with inline error messages
- A simulated login flow and a protected dashboard page

## Files

| File | Purpose |
|------|---------|
| `index.html` | The portal: top bar, sidebar menu, main area, and login form |
| `dashboard.html` | The page shown after a successful demo login |
| `css/styles.css` | All styling, commented for students |
| `js/app.js` | The menu, view switching, and the fake login, commented |

## Demo credentials

Open **General Login** in the sidebar, then sign in with:

- **Username:** `student`
- **Password:** `demo1234`

## Run it locally

Plain static HTML, so any static server works:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
# or
npx serve .
```

## Teaching note: why real logins are different

This demo checks the password **in the browser**, where anyone can read it in
`js/app.js`. Real applications must verify credentials on a **secure server**,
store passwords **hashed**, and use HTTPS, rate limiting, and CSRF protection.
Use this project to teach the interface, not the security model.

## License

Free to use for teaching.
