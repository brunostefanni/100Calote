angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
    .state('menu', {
      url: '/side-menu21',
      abstract:true,
      templateUrl: 'templates/menu.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    })
    .state('signup', {
      url: '/page8',
      templateUrl: 'templates/signup.html'      
      /*views: {
        'semMenu': {
          templateUrl: 'templates/signup.html'
        }
      }*/
    })
    .state('menu.devedores', {
      url: '/devedores',
	  cache: false,
      views: {
        'side-menu21': {		
		templateUrl: 'templates/devedores.html'
        },
		'fabContent': {
			template: '<button id="fab-add" class="button button-fab button-fab-bottom-right expanded button-positive-900 drop" ui-sref="menu.novo"><i class="icon ion-android-add-circle"></i></button>',
			controller: function ($timeout) {
				$timeout(function () {
					document.getElementById('fab-add').classList.toggle('on');
				}, 600);
			}
		}
      }
    })
    .state('menu.devendo', {
	  cache: false,
      url: '/devendo',
      views: {
        'side-menu21': {
          templateUrl: 'templates/devendo.html'
        },
		'fabContent': {}
      }
    })
	.state('menu.sobre', {
      url: '/sobre',
      views: {
        'side-menu21': {
          templateUrl: 'templates/sobre.html'
        },
		'fabContent': {}
      }
    })
	.state('menu.config', {
	  cache: false,
      url: '/config',
      views: {
        'side-menu21': {
          templateUrl: 'templates/configuracoes.html'
        },
		'fabContent': {}
      }
    })
    .state('logout', {
        cache: false,
        template: '', //A template or templateUrl is required by AngularJS, even if your controller always redirects.
        controller: 'LogoutController'
    })
    .state('detalhes', {
      url: '/detalhes',
      templateUrl: 'templates/detalhes.html'
    })
    .state('menu.novo', {
	  cache: false,
      url: '/novo',      
      views: {
        'side-menu21': {
          templateUrl: 'templates/novo.html'
        },
		'fabContent': {}
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});