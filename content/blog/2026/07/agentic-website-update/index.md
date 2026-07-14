---
date: "2026-07-10T22:20:12-04:00"
tags: ["hugo", "AI"]
categories: ["Web development"]
types: ["post"]
title: Agentic Website Update
description: How I finally got around to updating this website
---

Six years between posts is *probably* not breaking a world record for time between blog updates but it might be close. I've made a number of fixes/improvements (most notably, fixing the RSS feed and category/tag pages and adding the [privacy policy]({{< relref "/privacy" >}})) but before that, I had to bring how the site is laid out up to date and in line with the latest version of Hugo.

Last time I touched this site, I was on Hugo 0.79.0 and there was a toolchain set up to do LESS preprocessing. We are now on Hugo 0.164.0, which includes built-in [Dart Sass](https://sass-lang.com/dart-sass/) preprocessing via the binary. Bringing things six years and 85 versions into the future seemed both annoying and not exactly fun, so I decided to see what would happen with agentic coding.<!--more-->

## What are you talking about?

Agentic coding is when the AI assistant uses agents to help plan then write/modify code without much human intervention. Anthropic has a decent [high level overview](https://claude.com/blog/introduction-to-agentic-coding). Instead of just asking questions about my outdated codebase, can I prod an assistant into changing it for me?

## At work

I've used Cursor to plan changes, iterate, and then implement, along with its tab autocomplete functionality. I always used the format with the chat in the sidebar and reviewed all code changes myself---after all, "a computer can never be held accountable, therefore a computer must never make a management decision" :smiley:

My experience was that Cursor (on auto mode) was very good at the tab autocomplete[^1] and, when planning, poking holes in my plans. With implementation, it nailed CRUD-like work (sometimes I would have to go back and tell it to reuse an existing function or implement something in a certain way; I might have been able to improve on this with better AGENTS.md or context). A lot of my work was AI/ML research and later productization, where it would fall down more. Implementing something small and standard like {{<abbr "BIC" "Bayesian Information Criterion" >}} it could do, but at the time, it was faster and easier to implement my own classes when productizing novel work.

I have also built prototype websites at work (featuring React frontend, Python backend, and Postgres and Neo4j as databases), and Cursor was shockingly good once I set up my `package.json` and wrote some example endpoints and React components.

## Playing with GitHub Copilot

I figured therefore that I could at least give agentic coding a shot to avoid doing the grunt work. Hugo isn't the most popular static site generator, but it's not unused. Certainly it'd be able to go through the documentation and all version updates faster than me.

I wanted to try some different assistants: since I already had VS Code, I decided to give [GitHub Copilot in VS Code](https://github.com/features/copilot/ai-code-editor) a go; it comes with some free credits anyway. I considered Claude since people think so highly of it, but no tab completion was a no-go for me. I didn't really look at Codex but that has the same issue.

### Upgrading the site

In Ask mode, I started off with:

>I have a very old hugo project in this repo (version 0.73) and would like to upgrade to hugo 0.164.0, the current latest. I'm thinking of just saving my content files somewhere temporarily and starting from scratch with a new hugo project. Go through my project structure - do you think this is the best plan of action? How hard would it be to maintain all existing backlinks (still using netlify to push) and port over the styling?

It routed to MAI-Code-1-Flash and recommended doing an in-place upgrade. I was also interested in getting rid of the dependency on `lessc` and after some back and forth, came up with the following plan:

{{< expand "Hugo and Sass migration plan" >}}
Migration plan for upgrading Hugo, moving to Sass, and preserving the current site

1. Prepare and protect the current site
- Use the existing "main" branch to do work in.
- Keep the existing site on master as a fallback while doing work on main.
- Back up or preserve the current versions of content, layouts, static assets, config, and Netlify config before making changes.

2. Upgrade Hugo first
- Update the Hugo version in netlify.toml from 0.73.0 to 0.164.0.
- Verify that local Hugo is 0.164.0.
- Run a local build and fix any issues that appear.
- Focus first on the home page, blog listings, single posts, portfolio pages, archive page, menus, and metadata.

3. Preserve URLs and backlinks
- Keep the current URL structure as stable as possible.
- Preserve any existing aliases and redirects already defined in netlify.toml.
- Add or keep redirects for any old paths that may change during the migration.
- Verify that old URLs still resolve correctly after the upgrade.
- If any pages change output paths, add explicit redirects so backlinks do not break.

4. Replace LESS with Hugo-native Sass
- Stop using the old LESS pipeline from package.json.
- Create a Sass entry point in a Hugo assets location such as assets/scss.
- Convert the existing styles from the LESS structure under static/less into Sass.
- Keep the same visual structure at first and only refactor styling as needed.
- For the initial migration, keep the stylesheet output path and filename stable so the site continues to reference the same CSS asset and templates do not need to change unnecessarily.
- Introduce hashed or fingerprinted asset names only in a later phase, if desired.
- Update the site to reference the generated CSS output from Hugo’s Sass build rather than the old LESS-generated file.

5. Remove old Node-based tooling
- Once the Sass workflow is working in Hugo, remove the old Node-based CSS pipeline.
- Remove the dependency on package.json if it is no longer needed.
- Delete or stop using the old LESS-related build scripts and related packages.
- Make sure the site still builds locally with Hugo alone.
- Ensure netlify.toml and README.md no longer assume any Node-based CSS build.

6. Verify the full site
- Build the site locally and inspect the generated output.
- Check homepage rendering, blog pages, portfolio pages, archive page, menus, navigation, metadata, RSS output, and redirects.
- Compare the upgraded site visually against the old one and fix any regressions.

7. Update deployment and documentation
- Update netlify.toml so the deployment uses the new Hugo version and build behavior.
- Update README.md to describe the new setup.

Recommended order of execution
1. Upgrade Hugo
2. Preserve URLs and backlinks
3. Move to Sass
4. Remove old package tooling
5. Verify locally

Expected difficulty
- Hugo upgrade: moderate
- Backlink preservation: manageable
- Sass migration: moderate
- Removing package.json: straightforward once the Hugo-based workflow is working

**Key goal**: 
The goal is not to redesign the site, but to modernize it without changing the user-facing experience or breaking old links.
{{< /expand >}}

After hitting implement, it crunched through the codebase in a few minutes and according to the chat history used 38.3 credits. I had to update how the stylesheet was being linked in the header manually:

```go {linenos=table}
{{ with resources.Get "scss/styles.scss" }}
    {{ $opts := dict
    "enableSourceMap" hugo.IsDevelopment
    "outputStyle" (cond hugo.IsDevelopment "expanded" "compressed")
    "targetPath" "css/styles.css"
    "transpiler" "dartsass"
    "vars" site.Params.styles
    }}
    {{ with . | css.Sass $opts }}
    {{ if hugo.IsDevelopment }}
        <link rel="stylesheet" href="{{ .RelPermalink }}">
    {{ else }}
        {{ with . | fingerprint }}
        <link rel="stylesheet" href="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}" crossorigin="anonymous">
        {{ end }}
    {{ end }}
    {{ end }}
{{ end }}
```

After that was all working locally, I then decided to switch over to the Hugo asset pipeline for stylesheets (Copilot had decided to just link the already compiled CSS under `/assets` when importing). It was faster to just fix the SCSS imports and delete the now unneeded assets myself.

Doing it this way frankly was probably the only way I would be making these changes this decade. Your proof that it worked is that the copyright at the bottom no longer says 2020 :grin:

### Refactoring animations

I also decided to give improving the accordions (collapsing navigation) and hamburger menu a go, since these are very standard design patterns. By this point I decided to shell out ten whole US dollars for the month to get access to some better models (I still used auto mode but it's the thought that counts?)

My prompt was deliberately vague:

>In scripts.js, I have some plain javascript functions to animate various toggles. I would like these toggles to be smoother (right now, the animation appears, although janky, when the collapsed content is being collapsed and not when it's being opened; it doesn't animate for the hamburger menu at all). I do not want to add any javascript libraries, just to use plain javascript
>
>I would also like the div containig the table of contents side bar, when present, to be sticky; does this require javascript or can this be implemented purely in CSS?

I was asked if I wanted the hamburger to be animated too (sure, why not) and what screen sizes I wanted the sticky TOC bar (just desktop, keep mobile behavior the same).

I hit implement on the plan and GPT-5.3-Codex actually one-shot it! The sticky TOC bar was just plain CSS as I expected and the accordions were updated to use transitions instead of swapping DOM nodes and properties. Chevron and hamburger icons were morphed in just plain CSS.

{{< figure caption="An animation of this site's mobile view, showing the animated hamburger and table of contents accordion" alt="Animated menu and table of contents" src="mobile_view_capture.gif" >}}

The only change I remember making manually was fixing the color of the "MENU" text on mobile.

## copilot-instructions.md

For fun, I also decided to make use of the Copilot web agent and have it generate instructions (really something more like a README). You can view it in [my repo under .github/copilot-instructions.md](https://github.com/jessicahuynh/jessicahuynh/blob/main/.github/copilot-instructions.md).

## No more scut work for me

I'm still poking through the Hugo docs to see all the new features I can implement (there are footnotes now!!) and doing most of the CSS myself, but doing the boring stuff with an LLM was great.

The plan is to make use of these 1500 credits over the next month to do some of the scut work that I've been putting off for six years so I can actually do some writing[^2] and implementing features, like the fancy `details` accordion up above.

After all that's done, I might keep Copilot---paying $10/month for fancy autocomplete is not the worst financial decision I've made. I don't plan to get into letting agents do everything without reviewing the code (i.e., staying away from "vibe coding"), so the value prop for Claude/Codex isn't there for me. Even when I was working on a greenfield web app at work, I still preferred to plan and execute in stages.

[^1]: I looked at the company Cursor usage dashboard once, I was middling at agent usage but at the top of the tab usage rankings :smiling_face_with_tear:
[^2]: All words on this blog are grade-AAA, 100% organic, written by me. Although I'm sure some think an LLM pass over would be an improvement&hellip;
