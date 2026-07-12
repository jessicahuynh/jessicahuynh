# Foundation vendor partials

These files are a direct split of the original monolithic `../foundation.scss` vendor stylesheet.

Guidelines:
- Keep import order stable in `../foundation.scss`. The order preserves the current compiled output.
- Treat files in this folder as vendor-owned unless a migration explicitly replaces or deletes a rule.
- Prefer site-owned overrides in sibling partials such as `header.scss`, `layout.scss`, and `sections.scss` instead of editing vendor rules opportunistically.

Current likely-unused or inert Foundation hooks to verify during cleanup:
- Sticky-related Foundation classes such as `.sticky` and `.sticky-container` appear to have no active template markup.
- Portfolio `data-equalizer` and `data-equalizer-watch` attributes appear inert because there is no active Foundation JS runtime.
- Other JS-oriented Foundation components in this folder should be treated as candidates for removal only after template usage is verified.
