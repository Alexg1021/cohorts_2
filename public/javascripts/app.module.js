//(function(){
//
//    'use strict';
//
//    //two ways to use angular module 1. creating a module 2. adding or using the module
//
//    angular.module('app', ['ui.router', 'app.ui', 'ui.bootstrap'])
//        .config(function($stateProvider, $urlRouterProvider, $httpProvider){
//            /**
//             *
//             * Default Route
//             *
//             */
//            $urlRouterProvider.otherwise('/projects');
//
//            /**
//             *
//             * Define our states.
//             *
//             */
//
//            $stateProvider
//                .state('login', {
//                    url: '/login',
//                    templateUrl: 'partials/login/index.html',
//                    controller: 'LoginController',
//                    controllerAs: 'loginController'
//                })
//                .state('projects', {
//                   url: '/projects',
//                    templateUrl: 'partials/projects/index.html',
//                    controller: 'ProjectsController',
//                    controllerAs: 'projectsController',
//                    resolve:{
//                        users: function (Users){
//                            debugger;
//
//                            return Users.get();
//                        },
//                        projects: function (Projects, users){
//
//                            return Projects.get();
//                        }
//                    },
//                    data: {
//                        requiresLogin: true
//                    }
//                })
//                .state('users',{
//                    url: '/users',
//                    templateUrl: 'partials/projects/users.html',
//                    controller: 'UsersController',
//                    controllerAs: 'usersController',
//                    resolve: {
//                        users: function (Users){
//
//                            return Users.get();
//
//                        },
//                        data: {
//                            requiresLogin: true
//                        }
//                    }
//
//                })
//                .state('projects.add', {
//                    url: '/add',
//                    templateUrl: 'partials/projects/add.html',
//                    controller: 'AddProjectController',
//                    controllerAs: 'addProjectController',
//                    data: {
//                        requiresLogin: true
//                    }
//                })
//                .state('users.add', {
//                    url: '/add-user',
//                    templateUrl: 'partials/projects/add-user.html',
//                    controller: 'AddUserController',
//                    controllerAs: 'addUserController',
//                    data: {
//                        requiresLogin: true
//                    }
//                })
//                .state('projects.detail',{
//                    url: '/:projectId',
//                    templateUrl: 'partials/projects/detail.html',
//                    controller: 'ProjectController',
//                    controllerAs: 'projectController',
//                    resolve: {
//                        project: function (Projects, $stateParams, projects) {
//                            return Projects.find($stateParams.projectId);
//                        }
//                    },
//                    data: {
//                        requiresLogin: true
//                    }
//                })
//                .state('projects.detail.edit', {
//                    url:'/edit',
//                    templateUrl: 'partials/projects/edit.html',
//                    controller: 'EditProjectController',
//                    controllerAs: 'editProjectController',
//                    data: {
//                        requiresLogin: true
//                    }
//                });
//
//                $httpProvider.interceptors.push(function($injector){
//                    return{
//                        request: function(config){
//                            var Users = $injector.get('Users');
//                            if(Users.isLoggedIn()) config.headers.Authorization = 'Token ' + Users.currentUserToken;
//                            return config;
//                        }
//                    };
//                })
//                .run(function ($rootScope, Users, $state){
//                    $rootScope.$on('$stateChangeStart', function(event, toState){
//
//                        if(toState.data && toState.data.requiresLogin){
//                            if(!Users.isLoggedIn()) {
//
//                                event.preventDefault();
//                                $state.go('login');
//                            }
//                        }
//                    });
//                });
//
//        });
//    //controllers are the things that link the view(html) with the data
//
//}());


(function () {

    'use strict';

    angular.module('app', ['ui.router', 'app.ui', 'ui.bootstrap'])
        .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
            /**
             * Default Route.
             */
            $urlRouterProvider.otherwise('/projects');

            /**
             * Define our states.
             */
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'partials/login/index.html',
                    controller: 'LoginController',
                    controllerAs: 'loginController'
                })
                .state('projects', {
                    url: '/projects',
                    templateUrl: 'partials/projects/index.html',
                    controller: 'ProjectsController',
                    controllerAs: 'projectsController',
                    resolve: {
                        users: function (Users) {
                            //RETURNS A PROMISE, CONTROLLER IS CALLED WHEN PROMISE IS RESOLVED
                            return Users.get();
                        },
                        projects: function (Projects, users) {
                            //RETURNS A PROMISE, CONTROLLER IS CALLED WHEN PROMISE IS RESOLVED
                            return Projects.get();
                        }
                    },
                    data: {
                        requiresLogin: true
                    }
                })
                .state('projects.detail', {
                    url: '/:projectId',
                    templateUrl: 'partials/projects/detail.html',
                    controller: 'ProjectController',
                    controllerAs: 'projectController',
                    resolve: {
                        project: function (Projects, $stateParams, projects) {
                            //RETURNS A PROJECT OBJECT
                            return Projects.find($stateParams.projectId);
                        }
                    },
                    data: {
                        requiresLogin: true
                    }
                })
                .state('projects.detail.edit', {
                    url: '/edit',
                    templateUrl: 'partials/projects/edit.html',
                    controller: 'EditProjectController',
                    controllerAs: 'editProjectController',
                    data: {
                        requiresLogin: true
                    }
                });

            /**
             * Configure the http interceptors.
             */

            $httpProvider.interceptors.push(function ($injector) {
                return {
                    request: function (config) {
                        var Users = $injector.get('Users');
                        if (Users.isLoggedIn()) config.headers.Authorization = 'Token ' + Users.currentUserToken;
                        return config;
                    }
                };
            });
        })
        .run(function ($rootScope, Users, $state) {
            $rootScope.$on('$stateChangeStart', function (event, toState) {
                if (toState.data && toState.data.requiresLogin) {
                    if (!Users.isLoggedIn()) {
                        event.preventDefault();
                        $state.go('login');
                    }
                }
            });
        });
}());