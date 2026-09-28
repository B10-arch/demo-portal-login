# Demo Portal — Teaching Login

A small, front-end-only **demo login page** built for teaching students the
basics of HTML, CSS, and client-side form validation.

> ⚠️ **This is a teaching sample.** It is not affiliated with any real
> organization or government service, and it does no real authentication.
> Never enter a real password. Never use this pattern for real login security.

## What it teaches

- Structuring an accessible login form in **HTML**
- Styling with plain **CSS** (variables, focus states, dark mode)
- **JavaScript** form validation with inline error messages
- A show/hide password toggle
- A simulated login flow and a protected dashboard page

## Files

| File | Purpose |
|------|---------|
| `index.html` | The login page |
| `dashboard.html` | The page shown after a successful demo login |
| `css/styles.css` | All styling, commented for students |
| `js/app.js` | Validation and the fake login, commented for students |

## Demo credentials

- **Username:** `student`
- **Password:** `demo1234`

## Run it locally

It is plain static HTML, so any static server works:

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node
npx serve .
```

Then open http://localhost:8000

## Teaching note: why real logins are different

This demo checks the password **in the browser**, where anyone can read it in
`js/app.js`. Real applications must verify credentials on a **secure server**,
store passwords **hashed**, and use protections like HTTPS, rate limiting, and
CSRF tokens. Use this project to teach the interface, not the security model.

## License

Free to use for teaching.
