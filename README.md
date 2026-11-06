# Virtual Dog Park

A small website with two parts: a dog encyclopedia of three breeds, and a virtual pet you can adopt, feed, play with and watch grow. Everything is built with plain HTML, CSS and JavaScript — no framework, no backend, no build step.

The site was made for a first-year programming lab about working with an AI coding assistant: the AI can suggest code, but the human has to read it, run it, test it and explain it.

## Features

- **Dog encyclopedia** — Shiba Inu, Corgi and Border Collie, each with a short note on size, personality and everyday care, and its own illustration.
- **Adoption** — pick a breed, type a name (1–20 characters, spaces inside the name are fine) and adopt one dog at a time.
- **Care** — `Feed` and `Play` each add 10 happiness.
- **Next Day** — moves the pet forward one day and costs 5 happiness. No real waiting involved.
- **Growth** — the dog grows through three stages, shown by a growth bar, a larger illustration, and the stage written out as text.
- **Saved progress** — the adopted dog is stored in the browser, so refreshing the page brings it back.
- **Start Over** — asks for confirmation, then deletes the saved dog and returns to the adoption form.
- **Responsive layout** — the cards stack into one column on a phone and no horizontal scrolling is needed.

## How to preview it

The page must be opened through a local web server, not by double-clicking the file. `localStorage` behaves differently on `file://` addresses, so the saved dog may not come back.

With VS Code:

1. Install the **Live Server** extension by Ritwick Dey.
2. Right-click `index.html` in the Explorer and choose **Open with Live Server**.
3. The page opens at an address such as `http://127.0.0.1:5500/index.html`.

Without VS Code, from this folder in a terminal:

```
python -m http.server 8000
```

Then open `http://127.0.0.1:8000/index.html`. Keep the same browser and the same address while testing the save feature.

## Growth and happiness rules

| Rule | Value |
| --- | --- |
| New dog | Day 1, **Puppy**, happiness 50 |
| Feed or Play | happiness +10 |
| Next Day | day +1, happiness −5 |
| Happiness range | never below 0, never above 100 |
| Day 1 | Puppy |
| Days 2–3 | Young Dog |
| Day 4 and later | Adult Dog |

## Where the progress is saved

The adopted dog lives in the browser's `localStorage` under the key `virtualDogParkPetV1`, as a small JSON object holding the name, breed, day and happiness. It is written after adoption and after every Feed, Play or Next Day action, and read back when the page loads.

A few consequences worth knowing:

- The data belongs to **one browser on one device**. Another browser, another device, or a private window starts with an empty park.
- It is **not uploaded to GitHub** and it is **not an online account**. `git push` only sends the source files.
- Only one dog is stored at a time.
- Clearing the browser's site data deletes the dog.

## Manual testing checklist

Tick these off by hand in the browser — an AI saying "it should work" is not evidence.

- [ ] Three breed entries and three illustrations display, with no broken images.
- [ ] An empty name or a name of only spaces is rejected with a message.
- [ ] A name of more than 20 characters stops at 20.
- [ ] A name containing `<` or `>` is displayed as plain text, not interpreted as HTML.
- [ ] A valid name can be adopted; the dog starts at Day 1, Puppy, happiness 50.
- [ ] `Feed` and `Play` raise happiness by 10 and stop at 100.
- [ ] `Next Day` adds a day, removes 5 happiness, and stops at 0.
- [ ] Stage changes: Day 2 is Young Dog, Day 4 is Adult Dog, and the bar and dog size change with it.
- [ ] Refreshing the page restores the same name, breed, day and happiness.
- [ ] `Start Over` → `Cancel` keeps the dog; `Start Over` → `OK` removes it and the old dog does not come back after a refresh.
- [ ] On a narrow window the cards stack and nothing is cut off.

## Illustrations

The three dog pictures in `assets/` are original SVG drawings made for this project. They are not photographs and not taken from other websites, so there is no licence question.

## Files

```
virtual-dog-park/
├── index.html      page structure and content
├── style.css       layout, colours and the responsive rules
├── script.js       adoption, care, growth and storage logic
├── assets/
│   ├── shiba-inu.svg
│   ├── corgi.svg
│   └── border-collie.svg
├── README.md
└── .gitignore
```

## Git history

The project was built in round-based commits, so each working version can be found again:

```
chore: initialize virtual dog park
feat: add dog encyclopedia
feat: add virtual dog adoption and care
feat: add dog growth and saved progress
style: redraw shiba and corgi illustrations so the breeds read differently
docs: finish instructions and final review
```
