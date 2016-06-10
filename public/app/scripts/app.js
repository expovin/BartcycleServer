'use strict';

angular.module('bartCycle', ['ui.router','ngResource','angular.filter','ui.bootstrap','ngFileUpload','naif.base64'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/home.html',
                        controller  : 'LocationController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            // route for the aboutus page
            .state('app.location', {
                url:'location',
                views: {
                    'content@': {
                        templateUrl : 'views/location.html',
                        controller  : 'LocationController'                  
                    }
                }
            })
        
            // route for the contactus page
            .state('app.category', {
                url:'category',
                views: {
                    'content@': {
                        templateUrl : 'views/category.html',
                        controller  : 'CategoryController'                  
                    }
                }
            })

            // route for the contactus page
            .state('app.results', {
                url:'results',
                views: {
                    'content@': {
                        templateUrl : 'views/results.html',
                        controller  : 'ResultsController'                  
                    }
                }
            })

            // route for the contactus page
            .state('app.personalpage', {
                url:'PersonalPage',
                views: {
                    'content@': {
                        templateUrl : 'views/PersonalPage.html',
                        controller  : 'PersonalPageController'                  
                    }
                }
            })

            // route for the contactus page
            .state('app.objdetails', {
                url:'ObjectDetails',
                views: {
                    'content@': {
                        templateUrl : 'views/objdetails.html',
                        controller  : 'ObjDettController'                  
                    }
                }
            })
    
        $urlRouterProvider.otherwise('/');
    })
;
