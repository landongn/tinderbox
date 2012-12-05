var app = Ember.Application.create({

	//explicitly state our root element.
	rootElement: '#main',

	//assign the main index template for the application.
	//make sure an {{outlet}} is present in this template.
	ApplicationView: Ember.View.extend({
		templateName: 'application'
	}),
	ApplicationController: Ember.Controller.extend(),
	//######################
	//## Create an 'index' route and it's controller / view.
	//######################
	IndexController: Ember.ObjectController.extend({
		init: function () {
			console.log('init called', arguments);
		}
	}),
	IndexView: Ember.View.extend({
		templateName: 'index'
	}),

	//######################
	//## Add the "greet" route's controller and view
	//######################
	GreetController: Ember.Controller.extend(),
	GreetView: Ember.View.extend({
		templateName: 'greet'
	}),

	//######################
	//## Add the "posts" controller and view
	//######################
	SinglePostController: Ember.ObjectController.extend(),
	SinglePostView: Ember.View.extend({
		templateName: 'post'
	}),

	AllPostsController: Ember.ArrayController.extend({

	}),
	AllPostsView: Ember.View.extend({
		templateName: 'allposts'
	}),

	CreatePostView: Ember.View.extend({
		title: null,
		body: null,
		id: null,
		templateName: 'createPost'
	}),
	CratePostController: Ember.Controller.extend(),



	//configure the router to serve our app.
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

			createPost: Ember.Route.extend({
				route: '/post/create',
				connectOutlets: function(router, context){
					router.get('applicationController').connectOutlet('createPost');
				},
				createNewPost: function(postdata){
					console.log(arguments);
					console.log(this);
					app.Post.create({id: ++app.Post.lastId, title:postdata.title, body: postdata.body});
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

			allPosts: Ember.Route.extend({
				route: '/posts',
				connectOutlets: function (router) {
					router.get('applicationController').connectOutlet('allPosts', app.Post.find());
				}
			}),

			singlePost: Ember.Route.extend({
				route: '/post/:id',
				connectOutlets: function (router, context) {
					router.get('applicationController').connectOutlet('singlePost', app.Post.getSinglePost(0));
				},
				serialize: function (router, context){
					console.log(arguments);
					return {

					};
				},
				deserialize: function (router, args) {
					return app.Post.getSinglePost(args.id);
				}
			}),
			//define a few action helpers for us to navigate around the site.
			sayHello: Ember.Route.transitionTo('greet'),
			goHome: Ember.Route.transitionTo('index'),
			getPost: Ember.Route.transitionTo('singlePost'),
			getAllPosts: Ember.Route.transitionTo('allPosts'),
			addPost: Ember.Route.transitionTo('createPost')
		})
	}),
	//what happens when the application is ready to begin routing?
	ready: function () {
		//do stuff.
	}
});

app.Post = Ember.Object.extend();
app.Post.reopenClass({
	getSinglePost: function (id) {
		var post = app.Post.create({id: ++this.lastId, 'title': 'dynamic', body: 'post was created dynamically'});
		return post;
	},
	lastId: 0,
	spawned: false,
	find: function(){
		//maybe this is an API, who knows.
		if (!this.spawned) {
			this.posts.addObject(app.Post.create({id: ++this.lastId, 'title':'some title', 'body': 'some body'}));
		}
		return this.posts;
	},
	addPost: function(postdata){
		app.Post.create({id: ++this.lastId, title:postdata.title, body: postdata.body});
	},
	posts: [],
	postCount: function (){
		return this.posts.length;
	}
});
app.initialize();