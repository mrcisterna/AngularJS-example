# AngularJS-example
This is a little project to show some of my skills as front-end software developer.

There is a login page and after that a CRUD screen for customer/s -> products

Data is adquired consulting a RESTful service at localhost:8080

AngularJS UI, controllers, directives and services was used for demostration.

root  __
		|__Content (Third party css files)
		|__css	(Own css files)
			|__ app.css (My custom css file)
		|__fonts (Necessary fonts)
		|__img (images)
		|__js	(My own javascript files)
		|	|__controllers
		|	|	|__customers
		|	|	|	|__customersController.js (AngularJS controller for customer info management)
		|	|	|__security
		|	|		|__loginController.js (AngularJS controller for login)
		|	|__directives
		|	|	|__directives.js (My own several custom helper directives)
		|	|	|__footable.js (My own custom directive for JQuery Footable)
		|	|__services
		|		|__securityService (AngularJS service for app security)
		|		|__restfulService (AngularJS service for restfull invocation)
		|			
		|__Scripts (Javascript libraries)
		|__tpl (Website templates)
		|__app.html (Main template)
		|	|__ 404 (404 template/s folder)
		|	|__ about (about template/s folder)
		|	|__ blank (blank template/s folder)
		|	|__ content (header and other templates folder)
		|	|__ customers (customers templates folder)
		|	|__ error (error template/s folder)
		|	|__ security (login and other security templates folder)
		|	|__ app.html (Main template)
		|	|__ app.js (Main view container template)
		|__ index.html (Main start app)


