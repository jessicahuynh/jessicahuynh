---
kind: page
types: ["status"]
categories: ["jessicahuynh.info"]
tags: ["hugo"]
date: "2017-03-21T11:32:11-04:00"
title: Continuous Deployment
description: Moving to a new build pipeline using Hugo pushed to a GitHub repo, then deployed via Netlify
---

tl;dr: switched continuous deployment hosting providers due to laziness and stinginess<!--more-->

When Aerobatic got rid of its Bitbucket add-on and got rid of the free tier, I decided to switch over to [Netlify](https://www.netlify.com/), which still has a free tier (and naturally, I'm cheap) and is more known for static site hosting anyway. One of the reasons I chose Aerobatic in the first place was its continuous deployment---I could push to a git repo and have Aerobatic build my site for me, and then deploy it atomically, which I preferred to running the `hugo` command, getting a `public/` directory with the output, and then having to push up either a separate branch or have it in master. Netlify also has a really nice CDN.

I also moved over from Bitbucket to GitHub, not because Bitbucket is bad (it's really nice and free private repos are great), but to keep all my code together in the vain hope that someone will look at my GitHub repos and hire me.
