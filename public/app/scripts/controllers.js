'use strict';

angular.module('bartCycle')

        .run(['$sessionStorage','$http', function($sessionStorage,$http) {
            $http.defaults.headers.common['x-access-token']=$sessionStorage.get('token');
        }])

        .controller('HeaderController', ['$scope', 'headerFactory','$modal','$sessionStorage','$state','loginFactory', 
            function($scope,headerFactory,$modal,$sessionStorage,$state,loginFactory) {

            console.log("Logged flag :" + $sessionStorage.isLogged('token'));
            $scope.isLoggedIn = $sessionStorage.isLogged('token');

            if($scope.isLoggedIn)
            {

                loginFactory.getFullname().get()
                .$promise.then(
                    function(response){
                        $scope.fullName=response.fullName;
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
                
                console.log("object:");
                console.log($scope.publishForm.object);
                $scope.publishForm.object.picFile = "";
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
                console.log('registerUser fired!');
                $scope.registrationForm.user.vt=5;
                
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



        .controller('LocationController', ['$scope',  function($scope) {
            

        }])


        .controller('ResultsController', ['$scope', '$location','resultFactory', function($scope,$location,resultFactory) {
            $scope.category = $location.search().cat;
            
                    $scope.results =  resultFactory.getObjectByCat($scope.category).query(
                    function(response) {                        
                        console.log("OK!");
                    },
                    function(response) {
                        console.log("Qui ERRORE!");
                    });

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
