'use strict';

angular.module('bartCycle')
//        .constant("baseURL","http://localhost:3000/")
        .constant("baseURL","http://bartcycle.mybluemix.net/")
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

        .factory('resultFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var resfac = {};

                resfac.getObjectByCat = function(cat){
                    return $resource(baseURL+"objs/category/"+cat,null, {'update':{method:'PUT' }});
                };       

                resfac.getObjectDetails = function(){
                    var r=  $resource(baseURL+"objs/get/:objId",null, {'update':{method:'PUT' }});

                    return r;

                };     

                resfac.getObject = function(){
                    return $resource(baseURL+"objs/get/:objId",null, {'update':{method:'PUT' }});

                }

                return resfac;
        }])

        .factory('userFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var usrfac = {};

                usrfac.getUsers = function(){
                      return $resource(baseURL+"users/register",null,  {'create':{method:'PUSH'}});
                }; 

                return usrfac;
        }])

        .factory('objectFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var usrfac = {};

                usrfac.publishNewObject = function(){
                      return $resource(baseURL+"objs/publish",null,  {'create':{method:'PUSH'}});
                }; 

                usrfac.modifyObj = function(NewState){
                    return $resource(baseURL+"objs/update/:objId",null,  {'update':{method:'PUT' }});
                }

                usrfac.deleteObj = function(){
                    return $resource(baseURL+"objs/update/:objId",null,  {'update':{method:'PUT' }});
                }

                return usrfac;
        }])


        .factory('loginFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var catfac = {};

                catfac.doLogin = function(email,pwd){
                      var r = $resource(baseURL+"users/login",null,  {'create':{method:'PUSH'}});
                    //  r.save({username: email,password: pwd});
                      return r
                };       

                catfac.getFullname = function(){
                    return $resource(baseURL+"users/whoami",null,  {'get':{method:'GET', isArray: false}});

                }   

                catfac.getMyObjects = function(){
                    return $resource(baseURL+"users/:uid/objects",null,  {'get':{method:'GET', isArray: false}});

                }  

                return catfac;
        }])


        .factory('categoryFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var catfac = {};

                catfac.getCategories = function(){
                      var resource = $resource(baseURL+"cat",null,  {'create':{method:'PUSH'}});
                      return resource;
                };      


                return catfac;
        }])

        .factory('headerFactory',['$resource', 'baseURL', function($resource,baseURL) {          
    
            var headfac = {};

                headfac.getObjectByKw = function(){
                      return $resource(baseURL+"objs/kw/:kw",null,  {'create':{method:'PUSH'}});
                };           
                return headfac;
        }])

        .factory('$sessionStorage',['$window', function($window) {

            var Mylogs = $window.sessionStorage['logs'];
            var stat = {};


            return {
                store: function (key, value) {
                    $window.sessionStorage[key] = JSON.stringify(value);
                },
                get: function (key) {
                    var token = $window.sessionStorage[key];
                    console.log(token);
                    if(token == undefined)
                        return {};

                    console.log(token);
                    return JSON.parse($window.sessionStorage[key]);
                },
                isLogged : function(key){
                    var token = $window.sessionStorage[key];
                    if(token == undefined)
                        return false;
                    else
                        return true;

                },
                delete(key){
                    $window.sessionStorage.removeItem(key);
                }
            }

        }])




;
