---
date: "2020-06-24T22:06:47-04:00"
tags: ["hugo", "covid-19"]
categories: ["Web development"]
types: ["post"]
kind: page
title: Taxonomies in Hugo
description: An exploration of how Hugo's taxonomies work, how to create default pages for them, and uses beyond categories and tags
---

It's been quite a while since I've touched my site but stay-at-home makes for strange decision making. I'm doing some cleanup of the design, fixing broken links, and generally making it more efficient (minifying, dropping dependencies since I'm already deployed on a CDN, that sort of thing). One of the changes I just finished was fixing up my links to the post type, categories, and tags, which all make use of Hugo's taxonomies.

## Taxonomies overview

For Hugo, taxonomies are groupings of content. You get categories and tags out-of-the-box, but can define your own. On my website, I have the default categories and tags, along with type and project. You can also remove taxonomies entirely if desired.

The [documentation page on taxonomies](https://gohugo.io/content-management/taxonomies/) is pretty good, so I don't want to repeat that content so much as provide use cases for a portfolio with a blog and talk about how it's implemented on my website.

## How taxonomies work in Hugo

A _taxonomy_ is the classification and contains _terms_ (think of them as keys) and _values_ assigned to terms. For example, within ["categories"](/categories), we have the term ["Web development"](/categories/web-development).

Starting in 0.73.0, Hugo uses the above terminology and matching page kinds; in the past the page kind of a taxonomy was called "terms" and terms were a "terminology list". I'll be using the new terminology and page kinds throughout this post.

To add more taxonomoies beyond the default, you can configure them in your site config file (the example here is YAML):

```yaml {linenos=table}
taxonomies:
  project: projects
  tag: tags
  category: categories
  type: types
```

You need to specify `categories` and `tags` if you want them if you do specify your own taxonomies.

If you don't want any taxonomies, you can disable the relevant kinds:

```yaml {linenos=table}
disableKinds:
  - taxonomy
  - term
```

## Implementation on jessicahuynh.info

### In content pages

As I mentioned, I added projects and types in addition to the default taxonomies. For blog posts like this one, I use categories, tags, and types. For example, this post has the following bit in the YAML header:

```yaml {linenos=table}
tags: ["hugo", "covid-19"]
categories: ["Web development"]
types: ["post"]
```

Each post can only have one type, but it's in a list so that the _types_ term can be easily referenced on the blog layout pages (more on that later).

The project type I use for index.md in different portfolio pages, e.g. `project: "Arabic Grammar"`. I used the singular because I didn't need to reference it outside of portfolio pages.

Both the singular and plural are fine to be used when compiling the taxonomy and terms layout pages.

### In templates and layouts

My blog has breakdowns by type/category/tag at `https://www.jessicahuynh.info/<plural_taxonomy>`. There is also an alternative view of my portfolio at [https://www.jessicahuynh.info/projects](https://www.jessicahuynh.info/projects) that I don't link to outside of this post. All were automatically generated.

I also reference taxonomies in the blog sidebar (bottom bar in mobile).

#### Taxonomy and term pages

In the `layouts` directory of Hugo, in the `_default` folder, I have `taxonomy.html` and `term.html` that generates these pages. The former lists all terms in a given taxonomy and the latter lists all pages tagged with a particular term in YAML.

In `taxonomy.html`, the `{{ .Title }}` is (if you haven't set `pluralizeListTitles` in the config to `False`) the plural of the taxonomy. You can range over all the terms in that taxonomy with `{{ range .Data.Terms }}`. In my case, I list alphabetically and also point out the count of pages tagged with that term.

```html {linenos=table}
<ul>
  {{ range .Data.Terms.Alphabetical }}
    <li><a href="{{ .Page.Permalink }}">{{ .Page.Title }}</a> ({{ .Count }})</li>
  {{ end }}
</ul>
```

In `term.html`, you can range over the pages tagged with that term with `{{ range .Data.Pages }}`. I also put in a link to the taxonomy and some information about the page (a partial here because it's used on portfolio pages as well).

```html {linenos=table}
<p>See all <a href="/{{ .Data.Plural }}">{{ .Data.Plural }}</a>.</p>
<ul>
  {{ range .Data.Pages }}
    {{ partial "postli.html" . }}
  {{ end }}
</ul>
```

`postli.html` contents:

```html {linenos=table}
<li>
  <a href="/archive/#{{ .Date.Format "2006" }}"><span class="label reddish"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;{{ .Date.Format "Mon, Jan 2, 2006" }}</span></a>                    
  <a href="{{ .Permalink }}">{{ .Title }}</a>: 
  {{ .Description }}
</li>
```

#### Blog bar

The archive links are generated by looping over the years in posts and then directly linking to the [archive](/archive) page; they're not created by referencing specified Hugo taxonomies.

To be able to easily range over categories and types, I specify all the possible ones in the site config file:

```yaml {linenos=table}
params:
  subtitle: "/hwɪn/"
  categories: ["Lifestyle","Web development"]
  types: ["post","status","recipe"]
```

This way, we can easily range in the blog bar template and link to the appropriate term template page:

```html {linenos=table}
<ul>
  {{ range .Site.Params.categories }}		
    <li><a href="/categories/{{ . | urlize }}">{{ . }}</a></li>
  {{ end }}
</ul>
```

The upside of this approach is that you can get appropriate capitalization and remove hyphens in between words, or avoid referencing pages, which is what would appear if we just ranged over `.Site.Taxonomies`, like we do for tags:

```html {linenos=table}
<ul>
  {{ range $name, $t := .Site.Taxonomies.tags  }}
    <li><a href="/tags/{{ $name | urlize }}">{{ $name }}</a></li>
  {{ end }}
</ul>
```

For tags, I care less about how they're formatted, so ranging over `.Site.Taxonomies.tags` is sufficient and requires less maintenance. I don't plan to have many post types or categories, so manual upkeep is sufficient.

#### Post metadata

Every blog post, regardless of type, has a listing of metadata, including the date, how long the post takes to read, post type, category, and tags.

Since the type, category, and any tags are specified in the YAML header, I can then easily range using `.Params` and create clickable links to the relevant taxonomy term page.

```go {linenos=table}
{{ range .Params.types }}
  <a href="{{ "/types/" | absURL }}{{ . | urlize }}">
    <span class="orangish label">
      <i class="fa fa-archive" aria-hidden="true"></i>
      &nbsp;{{ . }}
    </span>
  </a>
{{ end }}

{{ range .Params.categories }}
  <a href="{{ "/categories/" | absURL }}{{ . | urlize }}">
    <span class="reddish label">
      <i class="fa fa-folder-open" aria-hidden="true"></i>
      &nbsp;{{ . }}
    </span>
  </a>
{{ end }}

{{ range .Params.tags }}
  <a href="{{ "/tags/" | absURL }}{{ . | urlize }}">
    <span class="transparent label">
      <i class="fa fa-tag" aria-hidden="true"></i>
      &nbsp;{{ . }}
    </span>
  </a>
{{ end }}
```

I plan to stop using Font Awesome's icons at some point and replace with SVGs but the concept will remain the same.

#### Portfolio single pages

Since I used the singular taxonomy term name in the content markdown page, I use that value when ranging over the pages in the `portfolio` content folder and then comparing. I use this for determining whether a particular project has associated content pages and list them if so. The actual determination of what is a project is already done by creating content pages under `portfolio`.

To establish if a project has posts, I use the following bit of templating:

```go {linenos=table}
{{ $.Scratch.Set "hasPostsAbout" "false" }}
{{ $p := .Params.project }}
{{ range .Site.Pages }}
  {{if in .Params.projects $p }}
    {{ $.Scratch.Set "hasPostsAbout" "true" }}
  {{ end }}
{{ end }}
```

`$.Scratch.Set` is used for setting template variables. If `hasPostsAbout` is `true`, I then create the section that lists posts. By default it is false.

This does require ranging through `.Site.Pages` and checking all of them for their `project`. This would be inefficient in a traditional programming context, but with static site generation and Hugo specifically, this isn't an issue since only the generated HTML pages will be deployed.
