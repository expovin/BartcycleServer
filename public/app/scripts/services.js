'use strict';

angular.module('confusionApp')
        .constant("baseURL","http://localhost:3000/")
//        .factory('menuFactory', ['$http', 'baseURL', function($http,baseURL) {
        .service('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {          
          var menufac = {};

                this.getDishes = function(){
                    return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
                };

    
                // implement a function named getPromotion
                // that returns a selected promotion.

                this.getPromotion = function(index){ 
                    return $resource(baseURL+"promotions/:id",null,  {'update':{method:'PUT' }});
                };                      

          //      return menufac;                    
        }])

        .factory('corporateFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var corpfac = {};

                corpfac.getLeaders = function(){
                    return $resource(baseURL+"leadership/:id",null,  {'update':{method:'PUT' }});
                };           
                return corpfac;
        }])

        .factory('feedbackFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var feedfac = {};

                feedfac.getFeedbacks = function(){
                      return $resource(baseURL+"feedback/:id",null,  {'create':{method:'PUSH'}});
                };           
                return feedfac;
        }])

;
