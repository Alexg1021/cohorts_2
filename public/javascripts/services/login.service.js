//(function(){
//    'use strict';
//
//    angular.module('app')
//        .service('Logins', function(Users){
//
//            var vm = this;
//
//            vm.post = function post(user){
//
//                return $http.post('/login', user)
//                    .then(function(res){
//                        res.data.user = Users.find(res.data.user);
//
//                        //$state.go('projects');
//                    }, function(err){
//                    });
//            };
//
//        });
//}());
//
