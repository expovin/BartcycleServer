'use strict';

angular.module('bartCycle')

        .run(['$sessionStorage','$http', function($sessionStorage,$http) {
            $http.defaults.headers.common['x-access-token']=$sessionStorage.get('token');
        }])

        .controller('HeaderController', ['$scope', 'headerFactory','$modal','$sessionStorage','$state','loginFactory', 'userFactory',
            function($scope,headerFactory,$modal,$sessionStorage,$state,loginFactory,userFactory) {

            console.log("Logged flag :" + $sessionStorage.isLogged('token'));
            $scope.isLoggedIn = $sessionStorage.isLogged('token');

            if($scope.isLoggedIn)
            {

                loginFactory.getFullname().get()
                .$promise.then(
                    function(response){
                        $scope.fullName=response.firstname+" "+response.lastname;
                        $scope.image=response.img;
                    },
                    function(response) {
                        console.log("Errore! Non sei autenticato... cancello il token");
                        $sessionStorage.delete('token');
                        $state.reload();
                    }
                );

            }

            $scope.Publish = function(){
                console.log("Register");
                $modal.open({
                  templateUrl: 'views/ModalPublish.html',
                  controller: 'PublishController',
                  windowClass: 'app-modal-login',
                  scope: $scope
                });
            }


            $scope.addServer = function() {
                    $scope.ObjsByKw =  headerFactory.getObjectByKw().get({kw:$scope.activeLayer})
                    .$promise.then(
                        function(response){
                            console.log('Ok');
                        },
                        function(response) {
                            console.log("Errore!");
                        }
                    );
            }

            $scope.login = function(){
                $modal.open({
                  templateUrl: 'views/ModalLogin.html',
                  controller: 'LoginController',
                  windowClass: 'app-modal-login',
                  scope: $scope
                });
                
            }

            $scope.logout = function(){
                $sessionStorage.delete('token');
                $state.reload();
            }

            $scope.register = function(){
                console.log("Register");
                $modal.open({
                  templateUrl: 'views/ModalRegister.html',
                  controller: 'RegisterController',
                  windowClass: 'app-modal-login',
                  scope: $scope
                });
            }

                        
        }])

        .controller('LoginController', ['$window','$scope','loginFactory','$sessionStorage','$modalInstance','$modal',  
            function($window,$scope,loginFactory,$sessionStorage,$modalInstance,$modal) {   

            $scope.doLogin = function() {
                console.log($scope.email);

                    loginFactory.doLogin().save({ username: $scope.email, password : $scope.pwd },$scope.ticket, function(user, putResponseHeaders){
                        $scope.token = user.token;
                        $sessionStorage.store('token',$scope.token);
                        $modalInstance.close();

                        $window.location.reload()

                    });
            }

            $scope.cancel = function () {
                console.log("Cancel");
                $modalInstance.dismiss('cancel');
            }

            $scope.register = function(){
                console.log("Register");
                $modal.open({
                  templateUrl: 'views/ModalRegister.html',
                  controller: 'RegisterController',
                  windowClass: 'app-modal-login',
                  scope: $scope
                });
            }
            

        }])

        .controller('PublishController', ['$scope','userFactory','categoryFactory','objectFactory','$modalInstance','Upload','$timeout',
          function($scope,userFactory,categoryFactory,objectFactory,$modalInstance,Upload,$timeout) {
            console.log("PublishController fired!");

            $scope.categories =  categoryFactory.getCategories().query(
                function(response) {                        
                    console.log("OK!");
                },
                function(response) {
                    console.log("Qui ERRORE!");
            });

            $scope.publishNewObject = function(){                
                $scope.publishForm.object.state = "Published";
                console.log($scope.picFile);
                $scope.publishForm.object["picFile"] = $scope.picFile.base64;
                console.log($scope.object);
                objectFactory.publishNewObject().save($scope.publishForm.object, function(){
                    console.log("Object Published!");
                    $modalInstance.dismiss('cancel');
                });
            }



            $scope.uploadPic = function(file) {
            file.upload = Upload.upload({
              url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
              data: {username: $scope.username, file: file},
            });

            file.upload.then(function (response) {
              $timeout(function () {
                file.result = response.data;
              });
            }, function (response) {
              if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
              // Math.min is to fix IE which reports 200% sometimes
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            }


        }])

        .controller('RegisterController', ['$scope','userFactory','$modalInstance',  function($scope,userFactory,$modalInstance) {

            $scope.registerUser = function() {
                $scope.registrationForm.user.vt=5;
                $scope.registrationForm.user.img = $scope.picFile.base64;

                console.log($scope.registrationForm.user);
                
                userFactory.getUsers().save($scope.registrationForm.user, function(){
                    console.log("User Created!");
                    $modalInstance.dismiss('cancel');
                });

            }

        }])

        .controller('ObjDettController', ['$scope', 'resultFactory','$location', function($scope,headerFactory,$location) {
            $scope.idObj = $location.search().id;

                    headerFactory.getObjectDetails().get({objId:$scope.idObj})
                    .$promise.then(
                        function(response){
                            console.log("get all details");
                            console.log(response.title);
                            $scope.ObjsDetails = response;
                        },
                        function(response) {
                            console.log("Errore!");
                        }
                    );
                        
        }])


        .controller('PersonalPageController', ['$scope','loginFactory','objectFactory','$state',  function($scope,loginFactory,objectFactory,$state) {
            console.log("In Personal Page!");

            $scope.unpublish = function (objId) {
                console.log("Oggetto da spubblicare : "+objId);
                objectFactory.modifyObj().update({ 'objId': objId},{"state":"Unpublished"});
                $state.reload();
            }

            $scope.publish = function (objId) {
                console.log("Oggetto da Pubblicare : "+objId);
                objectFactory.modifyObj().update({ 'objId': objId},{"state":"Published"});
                $state.reload();
            }

            loginFactory.getFullname().get()
                    .$promise.then(
                        function(response){
                            console.log("get all user details");
                            console.log(response);
                            $scope.User = response;
                            loginFactory.getMyObjects().get({uid:response._id})
                                .$promise.then(
                                    function(response){
                                        $scope.UserMyObjects = response.objectsId;
                                        
                                    },
                                    function(response) {
                                        console.log("Errore!");
                                    }
                                );

                        },
                        function(response) {
                            console.log("Errore!");
                        }
                    );
            


        }])


        .controller('LocationController', ['$scope',  function($scope) {



        }])


        .controller('ResultsController', ['$scope', '$location','resultFactory','$sessionStorage','$state', function($scope,$location,resultFactory,$sessionStorage,$state) {
            $scope.category = $location.search().cat;
            
                    $scope.results =  resultFactory.getObjectByCat($scope.category).query(
                    function(response) {                        
                        console.log("OK!");
                    },
                    function(response) {
                        console.log("Qui ERRORE!");
                    });

                    $scope.isLoggedin = $sessionStorage.isLogged('token');

                    $scope.getObject = function(objId) {
                        console.log("Get it! " + objId);
                        resultFactory.getObject().update({ 'objId': objId},null,function(response){
                            if(response.code > 50)
                                alert(response.message);
                            $state.reload();
                            

                            
                        });    
                    }
                    

        }])



        // implement the IndexController and About Controller here

        .controller('CategoryController', ['$scope','categoryFactory', function($scope,categoryFactory) {
            

                     $scope.categories =  categoryFactory.getCategories().query(
                    function(response) {                        
                        console.log("OK!");
                    },
                    function(response) {
                        console.log("Qui ERRORE!");
                    });

        }])

    

;
