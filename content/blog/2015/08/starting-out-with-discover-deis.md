+++
categories = ["Web development"]
date = "2015-08-04T12:00:00-04:00"
variety = "post"
kind = "page"
tags = ["jbs"]
projects = ["Discover Deis"]
title = "Starting out with Discover Deis"
aliases = ["/2015/08/starting-out-discover-deis/"]
description = "About the planning process for Discover Deis and the early stages of the JBS"
+++

For the past nine weeks, I’ve been a member of the [Voice, Mobile, and Web Application Development Justice Brandeis Semester](https://sites.google.com/a/brandeis.edu/jbs-2015-cosi/), a program that helped us learn exactly what it seems like we should. Now that it’s over and done with, I’d like to look back on exactly how we got our app to where it is and some steps in the future we can take, because it’d be nice to make this a much more official app and fill out the empty spots in our already extensive database.

## Brandeis Voice Tour

The program was nine weeks long, with the first five weeks devoted to classes (and working on our group project on Wednesdays) and the last four devoted to solely working on our project. The first two Wednesdays were devoted to team building with all the members of the JBS, followed by team formation and getting out the minimum viable product (MVP).

When the group was originally formed, we were going to do hands-free navigation of public transportation. After some discussion, we switched to a voice tour app for Brandeis, partly because there was a higher chance of people getting to use it, and partly because hands-free navigation of public transit has already been done by larger groups than us.

### Data collection and point-in-polygon testing

At this stage, we knew that there were about 150 or so buildings on campus. The question of how to detect what buildings the user was in or near came up, and the original thought was to start off with JSON objects (with one location per object), with a field that was an array of coordinates. In this array, we’d have four coordinates, and if your current location was less than this point but greater than this point, you’d be inside.

A better way soon came up. I came across an [implementation of point-in-polygon testing in C](http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html) and decided to convert it to JavaScript. The way this works is that a ray is cast from the point (in this case your current location) through the polygon (the building’s vertices). If this ray intersects an odd number of times, you’re inside the location. If not, you’re outside.

	pointIncluded: function(vertices, current) {
		included = false;
		numVert = vertices.length;

		// create arrays of the x and y coordinates of the polygon
		var xArray = [];
		for (var i = 0; i &lt; numVert; i++) {
			xArray.push(vertices[i].x);
		}		
		var yArray = [];
		for (var i = 0; i &lt; numVert; i++) {
			yArray.push(vertices[i].y);
		}

		for (var i = 0, j = numVert - 1; i &lt; numVert; j = i++) { if ((yArray[i] &gt;= current.y) != (yArray[j] &gt;= current.y) &amp;&amp;
				(current.x &lt;= (xArray[j] - xArray[i]) * (current.y - yArray[i]) / (yArray[j] - yArray[i]) + xArray[i])) {
				included = !included;

			}
		}
		
		return included;
	},

The relevant bit is the third for-loop.

### Grabbing the distance

So that’s all well and good, but if you’re not in a location, it’d be nice to know how close you are to the closest location. To that end, we used a distance algorithm for coordinates (it’s not very interesting so I won’t show it; it’s in the GitHub if you’re really curious) that returns the distance between two points. In the interest of time and convenience, I wrote it so that the point of the location that is passed to the distance function is just the first element in that array of coordinates.

### Routing

We initially tried it out on a set of about six locations on campus and the distance finding and point-in-polygon worked pretty well and this was the MVP we submitted after the first week as a group.

The next step was to route between locations and our first intuition (because I already had a bad feeling about having to get intersections’ coordinate data) was to write paths between each location that we had that was connected. Tianci found an implementation of single source, shortest path in JavaScript and we had routing working between our six locations.

## Switching to a navigation app

Throughout this process, part of the JBS was that we list features we would like in our app and do sprints and stories (as part of agile development, although I can’t say that many of the groups adhered very strictly to it) revolving around it. One issue we kept running into was feature bloat, wanting to add things like events nearby and classes at a location, along with a lot of arguing over what exactly would be on the home page. I was a big fan of a map and buttons and Ziyu thought that achievements and a profile would be good, to keep people coming back.

And I think the main issue, looking back on it, was that we all wanted something that people would use a lot. While tour apps are cool, they’re not something you use more than twice at most in your life. Adding events and achievements and such were a way to keep people coming back, or so the thinking went.

It was the discussions/arguments over the home page that really brought this to light, because ideally you want the home page to reflect the primary purpose. For the first round of user feedback with the fellow members of this JBS, there was a lot of confusion about our home page design (just a carousel of images of different ‘types’ of tours) and a lot of people wanting to use it for navigation, which at the time was just a secondary purpose of the app. After all, if you can route between locations when you create your own tour, why not surface that as a separate function for people?

I think it was pretty clear at this point that navigation was a much better thing to work on, but we all had an inkling of the amount of data to collect and that put us off for a bit. We had another discussion and decided to focus on the self-guided tour and fixed tours with written descriptions, dropping the create your own tour feature.

Of course, as these things go, after that we had a discussion about maybe doing an informational app, since that would be more useful than a tour app and we’d be collecting mostly the same data. By this point, we had about fifty or so buildings in our set.

And then someone went “since everyone in the first user feedback wanted to use it to navigate, and everyone we talked to would like a navigation app, let’s do a navigation app!” And I think next post, I’ll talk about some of the structure behind that and how we collected our data.
