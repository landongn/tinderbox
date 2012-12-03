var app = Ember.Application.create({

	//explicitly state our root element.
	rootElement: '#main',

	//assign the main index template for the application.
	//make sure an {{outlet}} is present in this template.
	ApplicationView: Ember.View.extend({
		templateName: 'application'
	}),
	ApplicationController: Ember.Controller.extend(),
	//Create a controller (logic)
	IndexController: Ember.ObjectController.extend({
		init: function () {
			console.log('init called', arguments);
		}
	}),
	//and it's view.
	IndexView: Ember.View.extend({
		templateName: 'index'
	}),

	GreetController: Ember.Controller.extend(),
	GreetView: Ember.View.extend({
		templateName: 'greet'
	}),
	//configure the router to serve our view.
	Router: Ember.Router.extend({
		//the absolute root of the router.  all application routing is
		//handled within the root of this route.
		root: Ember.Route.extend({

			//define a single route in the application.
			index: Ember.Route.extend({
				//the actual URL
				route: '/',
				//called prior to connectOutlets. Do visual transition here if necessary.
				enter: function(router){
					console.log("entered root view");
				},
				//fired when the route (not the view!) is exited.
				exit: function() {

				},
				//what to do when this route is initialized, typically setting up a controller (context)
				//and passing that to the router.
				connectOutlets: function(router){
					console.log('root view rendered');
					router.get('applicationController').connectOutlet('index');
				},
				//deserialize the passed URL into an object (params) and pass it to the view.
				//what you do with that data (call an API, etc) should be called on the views controller.
				deserialize: function(router, params) {
					console.log("deserializing: ", params);
				},
				//serializes the URL and saves any data (api? localstorage? uri frags? up to you.)
				serialize: function(router){
					console.log('serializing app state');
					return {};
				}
			}),

			//another route in the application
			greet: Ember.Route.extend({
				route: '/hello',
				enter: function(router){
					console.log('entered greet');
				},
				connectOutlets: function(router, context) {
					router.get('applicationController').connectOutlet('greet');
					console.log("connected to the greet route.");
				}
			}),
			//define a few action helpers for us to navigate around the site.
			sayHello: Ember.Route.transitionTo('greet'),
			goHome: Ember.Route.transitionTo('index')
		})
	}),
	//what happens when the application is ready to begin routing?
	ready: function () {
		//do stuff.
	}
});
app.initialize();