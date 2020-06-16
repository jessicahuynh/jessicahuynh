+++
date = "2013-03-25T00:00:00-04:00"
title = "Custom Sidebars in WordPress (again)"
sort = "post"
kind = "page"
tags = ["sidebars","widgets","PHP"]
categories = ["WordPress"]
slug = "sidebars-again"
aliases = ["/2013/03/sidebars-again/"]
+++

I figure it would be a good idea to repost my previous entry on custom sidebars in WordPress, partly for fun, partly to remind myself. This should work for any WordPress website on custom hosting (which means not WordPress.com blogs, unfortunately, unless there’s some magical way of getting at the code the Internet has yet to discover). I will be assuming you’re working off one of the WordPress default templates or can modify as needed on your own.

## Registering
Deep in the WordPress theme files (that would be http://yourblogurl/wp-contents/themes/themefolder), there is a file called functions.php. Open it with Notepad or something similar (or you can use the built-in editor, Appearance then Editor) and search for 

	function nevermind_widgets_init() {
		register_sidebar( array(
			'name' => __( 'Main Sidebar', 'nevermind' ),
			'id' => 'sidebar-1',
			'description' => __( 'Appears on posts and pages except the optional Front Page template, which has its own widgets', 'nevermind' ),
			'before_widget' => '<aside id="%1$s" class="widget %2$s">',
			'after_widget' => '</aside>',
			'before_title' => '<h3 class="widget-title">',
			'after_title' => '</h3>',
		) );
	}

(‘nevermind’ is the name of my custom theme, because holy hell, I’m unoriginal; the default would be twentytwelve or twentyeleven)

There may be just the one, or there may be multiple bits of code like this, depending on your theme. This is actually (almost) the original snippet from the new Twenty Twelve theme. The function themename_widgets_init() initializes the little widgets you can place in your sidebar. Each register_sidebar() call does exactly what you would think it would, it registers the sidebar in question.

### What if I don’t have a functions.php file?

Check again and be sure, but if you don’t, just create a file called functions.php and stick <?php at the beginning of it, without whitespace, and follow along.

### Breaking register_sidebar() down

A good resource, if you’re familiar with coding at all, is the WordPress codex, where there are pages of information about each function you could possibly want to know. To save you a click though, here’s what the codex says:

	<?php register_sidebar( array(
		'name'          => __( 'Sidebar name', 'theme_text_domain' ),
		'id'            => 'unique-sidebar-id',
		'description'   => '',
			'class'         => '',
		'before_widget' => '<li id="%1$s" class="widget %2$s">',
		'after_widget'  => '</li>',
		'before_title'  => '<h2 class="widgettitle">',
		'after_title'   => '</h2>' 
	); ?>

### Parameters
- name – Sidebar name (default is localized ‘Sidebar’ and numeric ID).
- id – Sidebar id – Must be all in lowercase, with no spaces (default is a numeric auto-incremented ID).
 description – Text description of what/where the sidebar is. Shown on widget management screen. (Since 2.9) (default: empty)
- class – CSS class name to assign to the widget HTML (default: empty).
- before_widget – HTML to place before every widget(default: `<li id="%1$s" class="widget %2$s">`) Note: uses sprintf for variable substitution
- after_widget – HTML to place after every widget (default: `</li>\n`).
- before_title – HTML to place before every title (default: `<h2 class="widgettitle">`).
- after_title – HTML to place after every title (default: `</h2>\n`). 

This is best served with an example. Suppose you want to have a custom sidebar for your ‘about’ page that details contact information. If it were me, I’d add the following:

	<?php register_sidebar( array(
		'name'          => __( 'About Sidebar', 'whateveryourthemeis' ),
		'id'            => 'sidebar-about',
		'description'   => __( 'Appears on the About page'),
		'before_widget' => '<li id="%1$s" class="widget %2$s">',
		'after_widget'  => '</li>',
		'before_title'  => '<h3 class="about-sidebar">',
		'after_title'   => '</h3>' 
	); ?>

The bits that say `<li>` and `<h3>` will vary depending on your theme. In the Twenty Twelve theme, they’re `<aside>` and `<h3>` respectively. Change each instance to what it is for the other sidebars in your theme; this will help keep a consistent look for your sidebars. For the sidebar’s ID, make sure it is something along the lines of ‘sidebar-whateverthesidebarisabout’. This is important for later. Make sure to put this before the closing } for the themename_widgets_init() function.

Upload your new/modified functions.php file to your webhost (you can use something like Filezilla to do so). If you go now to Appearance then Widgets, you’ll see your new sidebar to the right, grouped right below with the others. You can add widgets to it, although nothing will show up yet on any of your pages. To change that, we need to create a new template file.

## Creating the template file

In your theme folder, there should also be a sidebar.php file. 

	<?php
	/**
	* The sidebar containing the main widget area.
	*
	* If no active widgets in sidebar, let's hide it completely.
	*
	* @package depends on your theme
	* @subpackage ditto
	* @since same
	*/
	?>

		<?php if ( is_active_sidebar( 'sidebar-1' ) ) : ?>
			<div id="secondary" class="widget-area" role="complementary">
				<?php dynamic_sidebar( 'sidebar-1' ); ?>
			</div><!-- #secondary -->
		<?php endif; ?>

Make sure to look at your own and substitute accordingly. Luckily, the code here is very easily to modify. In the above code, you would change the instances of ‘1’ to ‘about’ for our example, so it would look like:

	<?php if ( is_active_sidebar( 'sidebar-about' ) ) : ?>
		<div id="secondary" class="widget-area" role="complementary">
			<?php dynamic_sidebar( 'sidebar-about' ); ?>
		</div><!-- #secondary -->
	<?php endif; ?>

What this code will do is display your widgets if there are any, and display nothing if there are none for whatever reason. Upload this file too to your theme directory.

## Include

Now the fun part, building a template for you to use your sidebar on. Much of this is self-explanatory.

	<?php
	/**
	* Template Name: About
	*
	* Description: Template for the About page
	*
	* @package whatever
	* @subpackage your
	* @since theme_says
	**/


	get_header(); ?>

		<section id="primary" class="site-content right-content">
			<div id="content" role="main">

This will be the first bit of your template, you can name it whatever you like (page-whatever.php usually). The **Template Name** will be whatever you select in the drop-down menu for your Page.

This next bit is verbatim from page.php. It’s what allows the content you type when editing the post to show up in your page. You can read up on get_template_part() if you wish.

	<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'content', 'page' ); ?>
				<?php comments_template( '', true ); ?>
	<?php endwhile; // end of the loop. ?>		

The first line takes the content from content-page.php, and the second is the comments template.

To finish it up, add 

				</div><!-- #content -->
		</section><!-- #primary -->

	<?php get_sidebar('about'); ?>
	<?php get_footer(); ?>

The part in parentheses (‘about’) will change depending on the ID of your sidebar, back in the functions.php file. Now you can upload page-about.php to your webhost. If you’ve done it correctly, when you go to create a new page, you should see your new template in the template options.