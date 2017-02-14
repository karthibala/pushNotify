angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

.run(function($ionicPlatform,$cordovaPush,$http) {
  $ionicPlatform.ready(function() {
    
	var androidConfig = {
	  "senderID": "1054276929471",
	  "ecb": "notificationReceived"
	};
	
	document.addEventListener("deviceready", function(){
		$cordovaPush.register(androidConfig).then(function(result) {
			alert('You are registered for get latest notification');
		  // Success
		}, function(err) {
			alert(err);
		  // Error
		})
		$cordovaPush.unregister(options).then(function(result) {
			alert(result);
		}, function(err) {
			alert(err);
		})

	}, false);
	
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  
  
	window.notificationReceived = function (notification) {
		alert(JSON.stringify(notification))
		alert(notification.event);
		switch(notification.event) {
			case 'registered':
				if (notification.regid.length > 0 ) {
					prompt("Copy to clipboard", notification.regid);
					localStorage.setItem('regId',notification.regid)
					$http.post('http://applogic.in/demo/smartedu/api/GeneralAPI/pushReg',{regId:notification.regid})     
					.success(function(data) {
						//alert("data"+data);
					}).error(function(err){		
						//alert("Err"+err);
					});
				}
				break;
			case 'message':
				localStorage.setItem("notificationMessage",notification.message);
				var token=notification.message;
				//alert(tokenNo[0]);
				//alert("General Message"+token);
				alert(token);
				break;

			case 'error':
				alert('GCM error = ' + notification.msg);
				break;

			default:
				alert('An unknown GCM event has occurred');
				break;
		}
	
	};
  
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});


