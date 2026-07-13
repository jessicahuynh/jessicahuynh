# Copilot Instructions

## Project Overview

This is a personal website ([jessicahuynh.info](https://www.jessicahuynh.info)) built with the [Hugo](https://gohugo.io/) static site generator and deployed continuously via Netlify on every push to the main branch.

## Prerequisites

- **Hugo** 0.164.0 or newer
- **dart-sass** 1.101.0 or newer (the `sass` or `dart-sass` binary must be on your `PATH`; on Windows use the `.bat` file)

## Building and Running Locally

```bash
# Serve the site locally with live reload
hugo server

# Production build (output goes to public/)
hugo build --gc --minify
```

The SCSS source files in `assets/scss/` are compiled automatically by Hugo during both `hugo server` and `hugo build`. There is no separate npm/webpack build step.

## Project Structure

```
.
├── archetypes/          # Front matter templates for new content (blog.md, portfolio.md)
├── assets/
│   └── scss/            # Sass source files
│       ├── styles.scss  # Entry point — imports all partials in order
│       └── partials/    # Individual SCSS modules (colors, fonts, layout, typography, …)
├── config.yaml          # Hugo site configuration (baseurl, menus, taxonomies, params)
├── content/             # All Markdown content
│   ├── _index.md        # Home page body
│   ├── about/
│   ├── archive/
│   ├── blog/            # Blog posts, organised by year/month or year/slug
│   ├── contact/
│   ├── portfolio/       # Portfolio project pages (one directory per project)
│   └── privacy/
├── layouts/             # Hugo HTML templates (Go html/template syntax)
│   ├── _default/        # Fallback list and term templates
│   ├── blog/            # Blog-specific list/single templates
│   ├── partials/        # Reusable template fragments (header, footer, postcard, …)
│   ├── portfolio/       # Portfolio list/single templates
│   ├── section/
│   ├── shortcodes/      # Custom Hugo shortcodes (rtl.html, rtl_link.html, c25k_table.html)
│   ├── 404.html
│   └── index.html       # Home page template
├── static/              # Files copied verbatim to the site root (fonts, images, JS)
├── netlify.toml         # Netlify build configuration and redirect rules
└── README.md
```

## Content Conventions

### Blog Posts

Create new blog posts with:

```bash
hugo new blog/<year>/<slug>.md
```

Or use a bundle (for posts with associated images):

```bash
hugo new blog/<year>/<slug>/index.md
```

Required front matter (from `archetypes/blog.md`):

```yaml
---
date: "YYYY-MM-DDTHH:MM:SS-HH:MM"
title: "Post title"
description: "One-sentence summary for SEO and post cards"
tags: ["tag1", "tag2"]
categories: ["Category"]
types: ["post"]   # one of: post | recipe | status
---
```

- `types` controls which partial is used to render the post body (`type_post.html`, `type_recipe.html`, or `type_status.html`).
- Use `<!--more-->` to set the summary cutoff for list pages.
- Blog posts are organised under `content/blog/<year>/` (flat file) or `content/blog/<year>/<slug>/` (page bundle with images).

### Portfolio Entries

Create new portfolio entries with:

```bash
hugo new portfolio/<project-slug>/index.md
```

Required front matter (from `archetypes/portfolio.md`):

```yaml
---
title: "Project name"
description: "Short description"
projects: ["Project Name"]
ongoing: true   # or false
---
```

### Taxonomies

The site uses four taxonomies configured in `config.yaml`:

| Taxonomy | Front matter key | Example values |
|----------|-----------------|----------------|
| Tag | `tags` | `["hugo", "css"]` |
| Category | `categories` | `["Web development", "Lifestyle"]` |
| Type | `types` | `["post", "recipe", "status"]` |
| Project | `projects` | `["Arabic Grammar"]` |

## Styling Conventions

- All styles are written in **SCSS** using the `@use` module system (no `@import`).
- `assets/scss/styles.scss` is the single entry point; add new partials there.
- Partials live in `assets/scss/partials/`. Name new files `_<name>.scss` and `@use` them from `styles.scss`.
- The vendor CSS framework layer is in `assets/scss/partials/foundation/`.
- Design tokens (colours, fonts) are defined in `colors.scss` and `fonts.scss`.

## Templates

- Templates use [Go's `html/template`](https://pkg.go.dev/html/template) syntax.
- Reusable fragments go in `layouts/partials/`. Call them with `{{ partial "name.html" . }}`.
- Custom shortcodes go in `layouts/shortcodes/`. Use them in Markdown as `{{< shortcode-name >}}`.

## Deployment

Netlify builds the site automatically on every push. The build command (from `netlify.toml`) downloads dart-sass, adds it to `PATH`, then runs `hugo build --gc --minify`. The output directory is `public/`.

There is no separate test suite; validate changes by running `hugo server` locally and checking the rendered output in the browser.
