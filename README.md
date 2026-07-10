# jessicahuynh.info

Personal website built with the [hugo](gohugo.io) static site generator. Continuously deployed every time I push with Netlify. The static assets are built before pushing.

## To recreate locally

1. Install Hugo 0.164.0 or newer
2. Run `hugo server` from the project root to see the site locally
3. Edit the Sass source in `assets/css/styles.min.scss` and Hugo will rebuild the stylesheet automatically

The site now uses Hugo's built-in Sass support instead of the old LESS/Node-based build pipeline.
