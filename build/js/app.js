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
        .config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $httpProvider) {
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
                        users: ["Users", function (Users) {
                            //RETURNS A PROMISE, CONTROLLER IS CALLED WHEN PROMISE IS RESOLVED
                            return Users.get();
                        }],
                        projects: ["Projects", "users", function (Projects, users) {
                            //RETURNS A PROMISE, CONTROLLER IS CALLED WHEN PROMISE IS RESOLVED
                            return Projects.get();
                        }]
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
                        project: ["Projects", "$stateParams", "projects", function (Projects, $stateParams, projects) {
                            //RETURNS A PROJECT OBJECT
                            return Projects.find($stateParams.projectId);
                        }]
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

            $httpProvider.interceptors.push(["$injector", function ($injector) {
                return {
                    request: function (config) {
                        var Users = $injector.get('Users');
                        if (Users.isLoggedIn()) config.headers.Authorization = 'Token ' + Users.currentUserToken;
                        return config;
                    }
                };
            }]);
        }])
        .run(["$rootScope", "Users", "$state", function ($rootScope, Users, $state) {
            $rootScope.$on('$stateChangeStart', function (event, toState) {
                if (toState.data && toState.data.requiresLogin) {
                    if (!Users.isLoggedIn()) {
                        event.preventDefault();
                        $state.go('login');
                    }
                }
            });
        }]);
}());
(function(){

   'use strict';

    angular.module('app.ui', []);



}());(function(){

    'use strict';

    angular.module('app.ui', []);



}());
(function(){

   'use strict';

    //when two arguments (paramaters) it defines the module, when one it is using it
    angular.module('app')
        .controller('BodyController', ["$http", "Projects", function($http, Projects){
           var vm = this;

            vm.welcome = 'Hello there!';


            Projects.get()
                .then(function(projects){
                    //debugger;
                    vm.projects = Projects.projects;
                });

        }]);

}());
(function(){

   'use strict';
//Directives are always dash syntax (angular-dash) on the html, but it is camel casing inside the directive
    //So, project-table on html and projectTable in directive

    angular.module('app.ui')
        .directive('projectTable', function(){



            //CREATE THE DDO (Directive Definition Object)
            return{

                restrict: 'E',
                templateUrl: 'partials/directives/project-table.html',
                scope: {
                    projects: '=',
                    remove: '='
                }

            };
        });


}());
(function(){
   'use strict';

    angular.module('app')
        .factory('User', function(){
            function User(data){

                //lodash function that attaches 'this' to properties
                _.merge(this, {
                    first_name: '',
                    last_name: '',
                    email: ''
                }, data || {});
            }

            User.prototype = {
                fullName: function fullName(){

                    return this.first_name + ' ' + this.last_name;
                }
            };

            return User;
        });
}());
(function(){

    'use strict';

    angular.module('app.ui')
        .filter('niceDate', function(){
            return function(timeStamp, format){

                format = format || 'MMMM Do, YYYY';
                var m = moment(timeStamp);
                return m.format(format);


            };
        });


}());
//(function(){
//   'use strict';
//
//    angular.module('app')
//        .controller('LoginController', function (){
//            var vm = this;
//            vm.user = {};
//            vm.login = Logins.post;
//        });
//}());

//working = false;

(function () {

    'use strict';

    angular.module('app')
        .controller('LoginController', ["Users", "$state", function (Users, $state) {
            var vm = this;
            vm.creds = {};
            vm.login = function login(creds) {
                Users.login(creds)
                    .then(function(res){
                        $state.go('projects');
                    },
                function(err){
                    vm.loginFailed = true;
                });
            };
        }]);
}());
(function(){

    'use strict';

    angular.module('app')
        .controller('AddProjectController', ["Projects", function(Projects){
            var vm = this;
            vm.project = {};
            vm.save = Projects.post;
        }]);
}());
(function(){

    'use strict';

    angular.module('app')
        .controller('EditProjectController', ["project", "Projects", "Users", function(project, Projects, Users){
            var vm = this;
            vm.users = Users.users;
            vm.project = project;
            vm.projectCopy = _.clone(project);
            vm.update = Projects.put;
        }]);
}());

(function(){
    'use strict';

    angular.module('app')
        .controller('NewProjectCtrl', ["$scope", "$modalInstance", "Users", function($scope, $modalInstance, Users){
            var vm = this;
            vm.users = Users.users;
            vm.project = {user: _.first(vm.users)._id};


            vm.close = function close(){
                //this function closes and saves the inputted information
                $modalInstance.close(vm.project);
            };

            vm.dismiss = function dismiss(){
                //this function voids any further action and returns to previous state
                $modalInstance.dismiss();
            };

        }]);

}());
(function(){

    'use strict';

    angular.module('app')
        .controller('ProjectController', ["project", "Projects", function(project, Projects){

            var vm = this;
            vm.project = project;
            vm.del = Projects.del;

        }]);

}());
(function () {

    'use strict';

    angular.module('app')
        .controller('ProjectsController', ["projects", "Projects", "$modal", "Users", function (projects, Projects, $modal, Users) {
            var vm = this;
            vm.projects = projects;
            vm.remove = Projects.del;
            vm.currentUser = Users.currentUser;

            /**
             * Adding a new project.
             */

            vm.addProject = function addProject(project) {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/projects/new.html',
                    controller: 'NewProjectCtrl',
                    controllerAs: 'newProject',
                    size: 'md'
                }).result.then(function (res) {
                        Projects.post(res);
                    });
            };
        }]);
}());
(function(){
   'use strict';

    angular.module('app')
        .controller('UsersController', ["Users", "users", function(Users, users){

            var vm = this;

            vm.users = users;

            return users;

        }]);

}());
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

(function(){
    'use strict';

    angular.module('app')
        .service('Projects', ["$http", "$state", "Users", function($http, $state, Users){

            var vm = this;

            vm.projects = [];
            /**
             * Our main projects storage
             *
             * @type {array}
             *
             */

            vm.find = function find(projectId){
              debugger;
                return _.find(vm.projects, {_id: projectId});
            };

            vm.get = function get(){
                return $http.get('/projects')
                    .then(function (res){
                        vm.projects.splice(0);
                        res.data.forEach(function(project){
                            project.user = Users.find(project.user);
                            vm.projects.push(project);
                        });
                        return vm.projects;
                    });
            };


            vm.post = function post(project){

                return $http.post('/projects/', project)
                    .then(function(res){
                        res.data.user = Users.find(res.data.user);

                        vm.projects.push(res.data);

                        $state.go('projects', {projectId: project._id});
                }, function(err){
                });
            };

            vm.put = function put(projectCopy){
              debugger;

                var data = {
                        title: projectCopy.title,
                        user: projectCopy.user._id
                };


                return $http.put('/projects/' + projectCopy._id, data)
                    .then(function(res){

                      debugger;

                        var p = vm.find(projectCopy._id);
                        _.merge(p, projectCopy);
                        $state.go('projects.detail', {projectId: projectCopy._id});

                }, function(err){

                });
            };

            vm.remove = function remove(projectId){
                _.remove(vm.projects, {_id: projectId});
            };

            vm.del = function del(projectId) {
                return $http.delete('/projects/' + projectId)
                    .then(function (res) {
                        vm.remove(projectId);
                        $state.go('projects');
                    });
            };

        }]);

}());


//vm.post = function post(project){
//    return $http.post('/projects/')
//        .then(function(res){
//            vm.projects.push(res.data);
//
//        });
//};

(function(){
    'use strict';

    angular.module('app')
        .service('Users', ["$http", "User", "$state", function($http, User, $state){
                var vm = this;

            vm.currentUser = null;

            vm.currentUserToken = null;

                vm.users = [];

            vm.find = function find(userId){
                return _.find(vm.users, {_id: userId});
            };

                vm.get = function get() {
                    return $http.get('/users')
                        .then(function (res) {
                            vm.users.splice(0);

                            res.data.forEach(function (user) {
                                vm.users.push(new User(user));
                            });

                            return vm.users;
                        });
                };

            /**
             * Login a user with the provided credentials.
             *
             * @param creds
             * @returns {*}
             */
            vm.login = function login(creds) {
                return $http.post('/login', creds)
                    .then(function (res) {
                    vm.currentUser = res.data.user;
                    vm.currentUserToken = res.data.token;
                    });
            };

            vm.isLoggedIn = function isLoggedIn(){
                return !!vm.currentUser;
                //double equals turns to Boolean
            };



            /**
             *
             * Get all users from the database
             */

        }]);
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJ1aS5tb2R1bGUuanMiLCJib2R5LmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL3Byb2plY3RzLXRhYmxlLmRpcmVjdGl2ZS5qcyIsImZhY3Rvcmllcy91c2VyLmZhY3RvcnkuanMiLCJmaWx0ZXJzL2RhdGUuZmlsdGVyLmpzIiwibG9naW4vbG9naW4uY29udHJvbGxlci5qcyIsInByb2plY3RzL2FkZC5wcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0cy9lZGl0LnByb2plY3QuY29udHJvbGxlci5qcyIsInByb2plY3RzL25ldy1wcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0cy9wcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0cy9wcm9qZWN0cy5jb250cm9sbGVyLmpzIiwicHJvamVjdHMvdXNlcnMuY29udHJvbGxlci5qcyIsInNlcnZpY2VzL3Byb2plY3RzLnNlcnZpY2UuanMiLCJzZXJ2aWNlcy91c2Vycy5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1SUEsQ0FBQSxZQUFBOztJQUVBOztJQUVBLFFBQUEsT0FBQSxPQUFBLENBQUEsYUFBQSxVQUFBO1NBQ0EsaUVBQUEsVUFBQSxnQkFBQSxvQkFBQSxlQUFBOzs7O1lBSUEsbUJBQUEsVUFBQTs7Ozs7O1lBTUE7aUJBQ0EsTUFBQSxTQUFBO29CQUNBLEtBQUE7b0JBQ0EsYUFBQTtvQkFDQSxZQUFBO29CQUNBLGNBQUE7O2lCQUVBLE1BQUEsWUFBQTtvQkFDQSxLQUFBO29CQUNBLGFBQUE7b0JBQ0EsWUFBQTtvQkFDQSxjQUFBO29CQUNBLFNBQUE7d0JBQ0EsaUJBQUEsVUFBQSxP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LFFBQUE7O1lBRUEsT0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQTtTQUNBLFFBQUEseUNBQUEsU0FBQSxPQUFBLFFBQUEsTUFBQTs7WUFFQSxJQUFBLEtBQUE7O1lBRUEsR0FBQSxXQUFBOzs7Ozs7OztZQVFBLEdBQUEsT0FBQSxTQUFBLEtBQUEsVUFBQTtjQUNBO2dCQUNBLE9BQUEsRUFBQSxLQUFBLEdBQUEsVUFBQSxDQUFBLEtBQUE7OztZQUdBLEdBQUEsTUFBQSxTQUFBLEtBQUE7Z0JBQ0EsT0FBQSxNQUFBLElBQUE7cUJBQ0EsS0FBQSxVQUFBLElBQUE7d0JBQ0EsR0FBQSxTQUFBLE9BQUE7d0JBQ0EsSUFBQSxLQUFBLFFBQUEsU0FBQSxRQUFBOzRCQUNBLFFBQUEsT0FBQSxNQUFBLEtBQUEsUUFBQTs0QkFDQSxHQUFBLFNBQUEsS0FBQTs7d0JBRUEsT0FBQSxHQUFBOzs7OztZQUtBLEdBQUEsT0FBQSxTQUFBLEtBQUEsUUFBQTs7Z0JBRUEsT0FBQSxNQUFBLEtBQUEsY0FBQTtxQkFDQSxLQUFBLFNBQUEsSUFBQTt3QkFDQSxJQUFBLEtBQUEsT0FBQSxNQUFBLEtBQUEsSUFBQSxLQUFBOzt3QkFFQSxHQUFBLFNBQUEsS0FBQSxJQUFBOzt3QkFFQSxPQUFBLEdBQUEsWUFBQSxDQUFBLFdBQUEsUUFBQTttQkFDQSxTQUFBLElBQUE7Ozs7WUFJQSxHQUFBLE1BQUEsU0FBQSxJQUFBLFlBQUE7Y0FDQTs7Z0JBRUEsSUFBQSxPQUFBO3dCQUNBLE9BQUEsWUFBQTt3QkFDQSxNQUFBLFlBQUEsS0FBQTs7OztnQkFJQSxPQUFBLE1BQUEsSUFBQSxlQUFBLFlBQUEsS0FBQTtxQkFDQSxLQUFBLFNBQUEsSUFBQTs7c0JBRUE7O3dCQUVBLElBQUEsSUFBQSxHQUFBLEtBQUEsWUFBQTt3QkFDQSxFQUFBLE1BQUEsR0FBQTt3QkFDQSxPQUFBLEdBQUEsbUJBQUEsQ0FBQSxXQUFBLFlBQUE7O21CQUVBLFNBQUEsSUFBQTs7Ozs7WUFLQSxHQUFBLFNBQUEsU0FBQSxPQUFBLFVBQUE7Z0JBQ0EsRUFBQSxPQUFBLEdBQUEsVUFBQSxDQUFBLEtBQUE7OztZQUdBLEdBQUEsTUFBQSxTQUFBLElBQUEsV0FBQTtnQkFDQSxPQUFBLE1BQUEsT0FBQSxlQUFBO3FCQUNBLEtBQUEsVUFBQSxLQUFBO3dCQUNBLEdBQUEsT0FBQTt3QkFDQSxPQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUVBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQTtTQUNBLFFBQUEscUNBQUEsU0FBQSxPQUFBLE1BQUEsT0FBQTtnQkFDQSxJQUFBLEtBQUE7O1lBRUEsR0FBQSxjQUFBOztZQUVBLEdBQUEsbUJBQUE7O2dCQUVBLEdBQUEsUUFBQTs7WUFFQSxHQUFBLE9BQUEsU0FBQSxLQUFBLE9BQUE7Z0JBQ0EsT0FBQSxFQUFBLEtBQUEsR0FBQSxPQUFBLENBQUEsS0FBQTs7O2dCQUdBLEdBQUEsTUFBQSxTQUFBLE1BQUE7b0JBQ0EsT0FBQSxNQUFBLElBQUE7eUJBQ0EsS0FBQSxVQUFBLEtBQUE7NEJBQ0EsR0FBQSxNQUFBLE9BQUE7OzRCQUVBLElBQUEsS0FBQSxRQUFBLFVBQUEsTUFBQTtnQ0FDQSxHQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUE7Ozs0QkFHQSxPQUFBLEdBQUE7Ozs7Ozs7Ozs7WUFVQSxHQUFBLFFBQUEsU0FBQSxNQUFBLE9BQUE7Z0JBQ0EsT0FBQSxNQUFBLEtBQUEsVUFBQTtxQkFDQSxLQUFBLFVBQUEsS0FBQTtvQkFDQSxHQUFBLGNBQUEsSUFBQSxLQUFBO29CQUNBLEdBQUEsbUJBQUEsSUFBQSxLQUFBOzs7O1lBSUEsR0FBQSxhQUFBLFNBQUEsWUFBQTtnQkFDQSxPQUFBLENBQUEsQ0FBQSxHQUFBOzs7Ozs7Ozs7Ozs7S0FZQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyhmdW5jdGlvbigpe1xuLy9cbi8vICAgICd1c2Ugc3RyaWN0Jztcbi8vXG4vLyAgICAvL3R3byB3YXlzIHRvIHVzZSBhbmd1bGFyIG1vZHVsZSAxLiBjcmVhdGluZyBhIG1vZHVsZSAyLiBhZGRpbmcgb3IgdXNpbmcgdGhlIG1vZHVsZVxuLy9cbi8vICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlcicsICdhcHAudWknLCAndWkuYm9vdHN0cmFwJ10pXG4vLyAgICAgICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKXtcbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIERlZmF1bHQgUm91dGVcbi8vICAgICAgICAgICAgICpcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9wcm9qZWN0cycpO1xuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIERlZmluZSBvdXIgc3RhdGVzLlxuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKi9cbi8vXG4vLyAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXG4vLyAgICAgICAgICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xuLy8gICAgICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9sb2dpbi9pbmRleC5odG1sJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdsb2dpbkNvbnRyb2xsZXInXG4vLyAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgLnN0YXRlKCdwcm9qZWN0cycsIHtcbi8vICAgICAgICAgICAgICAgICAgIHVybDogJy9wcm9qZWN0cycsXG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9pbmRleC5odG1sJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdwcm9qZWN0c0NvbnRyb2xsZXInLFxuLy8gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6e1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB1c2VyczogZnVuY3Rpb24gKFVzZXJzKXtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2Vycy5nZXQoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdHM6IGZ1bmN0aW9uIChQcm9qZWN0cywgdXNlcnMpe1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9qZWN0cy5nZXQoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4vLyAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICAgIC5zdGF0ZSgndXNlcnMnLHtcbi8vICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdXNlcnMnLFxuLy8gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcHJvamVjdHMvdXNlcnMuaHRtbCcsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJzQ29udHJvbGxlcicsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndXNlcnNDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJzOiBmdW5jdGlvbiAoVXNlcnMpe1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2Vycy5nZXQoKTtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgLnN0YXRlKCdwcm9qZWN0cy5hZGQnLCB7XG4vLyAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FkZCcsXG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9hZGQuaHRtbCcsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZFByb2plY3RDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhZGRQcm9qZWN0Q29udHJvbGxlcicsXG4vLyAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4vLyAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICAgIC5zdGF0ZSgndXNlcnMuYWRkJywge1xuLy8gICAgICAgICAgICAgICAgICAgIHVybDogJy9hZGQtdXNlcicsXG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9hZGQtdXNlci5odG1sJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRkVXNlckNvbnRyb2xsZXInLFxuLy8gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2FkZFVzZXJDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbi8vICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgLnN0YXRlKCdwcm9qZWN0cy5kZXRhaWwnLHtcbi8vICAgICAgICAgICAgICAgICAgICB1cmw6ICcvOnByb2plY3RJZCcsXG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9kZXRhaWwuaHRtbCcsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdwcm9qZWN0Q29udHJvbGxlcicsXG4vLyAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0OiBmdW5jdGlvbiAoUHJvamVjdHMsICRzdGF0ZVBhcmFtcywgcHJvamVjdHMpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9qZWN0cy5maW5kKCRzdGF0ZVBhcmFtcy5wcm9qZWN0SWQpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbi8vICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgLnN0YXRlKCdwcm9qZWN0cy5kZXRhaWwuZWRpdCcsIHtcbi8vICAgICAgICAgICAgICAgICAgICB1cmw6Jy9lZGl0Jyxcbi8vICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3Byb2plY3RzL2VkaXQuaHRtbCcsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRQcm9qZWN0Q29udHJvbGxlcicsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnZWRpdFByb2plY3RDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbi8vICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKGZ1bmN0aW9uKCRpbmplY3Rvcil7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJue1xuLy8gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbihjb25maWcpe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFVzZXJzID0gJGluamVjdG9yLmdldCgnVXNlcnMnKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKFVzZXJzLmlzTG9nZ2VkSW4oKSkgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdUb2tlbiAnICsgVXNlcnMuY3VycmVudFVzZXJUb2tlbjtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICB9O1xuLy8gICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICAgIC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIFVzZXJzLCAkc3RhdGUpe1xuLy8gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRvU3RhdGUuZGF0YSAmJiB0b1N0YXRlLmRhdGEucmVxdWlyZXNMb2dpbil7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighVXNlcnMuaXNMb2dnZWRJbigpKSB7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgfSk7XG4vLyAgICAvL2NvbnRyb2xsZXJzIGFyZSB0aGUgdGhpbmdzIHRoYXQgbGluayB0aGUgdmlldyhodG1sKSB3aXRoIHRoZSBkYXRhXG4vL1xuLy99KCkpO1xuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXInLCAnYXBwLnVpJywgJ3VpLmJvb3RzdHJhcCddKVxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgUm91dGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9wcm9qZWN0cycpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmluZSBvdXIgc3RhdGVzLlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9sb2dpbi9pbmRleC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2xvZ2luQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgncHJvamVjdHMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9wcm9qZWN0cycsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcHJvamVjdHMvaW5kZXguaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0c0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdwcm9qZWN0c0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyczogZnVuY3Rpb24gKFVzZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9SRVRVUk5TIEEgUFJPTUlTRSwgQ09OVFJPTExFUiBJUyBDQUxMRUQgV0hFTiBQUk9NSVNFIElTIFJFU09MVkVEXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJzLmdldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3RzOiBmdW5jdGlvbiAoUHJvamVjdHMsIHVzZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9SRVRVUk5TIEEgUFJPTUlTRSwgQ09OVFJPTExFUiBJUyBDQUxMRUQgV0hFTiBQUk9NSVNFIElTIFJFU09MVkVEXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb2plY3RzLmdldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgncHJvamVjdHMuZGV0YWlsJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvOnByb2plY3RJZCcsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcHJvamVjdHMvZGV0YWlsLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvamVjdENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdwcm9qZWN0Q29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IGZ1bmN0aW9uIChQcm9qZWN0cywgJHN0YXRlUGFyYW1zLCBwcm9qZWN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUkVUVVJOUyBBIFBST0pFQ1QgT0JKRUNUXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb2plY3RzLmZpbmQoJHN0YXRlUGFyYW1zLnByb2plY3RJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdwcm9qZWN0cy5kZXRhaWwuZWRpdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2VkaXQnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3Byb2plY3RzL2VkaXQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0UHJvamVjdENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdlZGl0UHJvamVjdENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDb25maWd1cmUgdGhlIGh0dHAgaW50ZXJjZXB0b3JzLlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBVc2VycyA9ICRpbmplY3Rvci5nZXQoJ1VzZXJzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVXNlcnMuaXNMb2dnZWRJbigpKSBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ1Rva2VuICcgKyBVc2Vycy5jdXJyZW50VXNlclRva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgVXNlcnMsICRzdGF0ZSkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvU3RhdGUuZGF0YSAmJiB0b1N0YXRlLmRhdGEucmVxdWlyZXNMb2dpbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIVVzZXJzLmlzTG9nZ2VkSW4oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAudWknLCBbXSk7XG5cblxuXG59KCkpOyhmdW5jdGlvbigpe1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC51aScsIFtdKTtcblxuXG5cbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vd2hlbiB0d28gYXJndW1lbnRzIChwYXJhbWF0ZXJzKSBpdCBkZWZpbmVzIHRoZSBtb2R1bGUsIHdoZW4gb25lIGl0IGlzIHVzaW5nIGl0XG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdCb2R5Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRodHRwLCBQcm9qZWN0cyl7XG4gICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZtLndlbGNvbWUgPSAnSGVsbG8gdGhlcmUhJztcblxuXG4gICAgICAgICAgICBQcm9qZWN0cy5nZXQoKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHByb2plY3RzKXtcbiAgICAgICAgICAgICAgICAgICAgLy9kZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgICAgICAgdm0ucHJvamVjdHMgPSBQcm9qZWN0cy5wcm9qZWN0cztcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxufSgpKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgJ3VzZSBzdHJpY3QnO1xuLy9EaXJlY3RpdmVzIGFyZSBhbHdheXMgZGFzaCBzeW50YXggKGFuZ3VsYXItZGFzaCkgb24gdGhlIGh0bWwsIGJ1dCBpdCBpcyBjYW1lbCBjYXNpbmcgaW5zaWRlIHRoZSBkaXJlY3RpdmVcbiAgICAvL1NvLCBwcm9qZWN0LXRhYmxlIG9uIGh0bWwgYW5kIHByb2plY3RUYWJsZSBpbiBkaXJlY3RpdmVcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAudWknKVxuICAgICAgICAuZGlyZWN0aXZlKCdwcm9qZWN0VGFibGUnLCBmdW5jdGlvbigpe1xuXG5cblxuICAgICAgICAgICAgLy9DUkVBVEUgVEhFIERETyAoRGlyZWN0aXZlIERlZmluaXRpb24gT2JqZWN0KVxuICAgICAgICAgICAgcmV0dXJue1xuXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2RpcmVjdGl2ZXMvcHJvamVjdC10YWJsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0czogJz0nLFxuICAgICAgICAgICAgICAgICAgICByZW1vdmU6ICc9J1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cblxufSgpKTsiLCIoZnVuY3Rpb24oKXtcbiAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuZmFjdG9yeSgnVXNlcicsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBmdW5jdGlvbiBVc2VyKGRhdGEpe1xuXG4gICAgICAgICAgICAgICAgLy9sb2Rhc2ggZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyAndGhpcycgdG8gcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIF8ubWVyZ2UodGhpcywge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgbGFzdF9uYW1lOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6ICcnXG4gICAgICAgICAgICAgICAgfSwgZGF0YSB8fCB7fSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFVzZXIucHJvdG90eXBlID0ge1xuICAgICAgICAgICAgICAgIGZ1bGxOYW1lOiBmdW5jdGlvbiBmdWxsTmFtZSgpe1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpcnN0X25hbWUgKyAnICcgKyB0aGlzLmxhc3RfbmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gVXNlcjtcbiAgICAgICAgfSk7XG59KCkpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC51aScpXG4gICAgICAgIC5maWx0ZXIoJ25pY2VEYXRlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0aW1lU3RhbXAsIGZvcm1hdCl7XG5cbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJ01NTU0gRG8sIFlZWVknO1xuICAgICAgICAgICAgICAgIHZhciBtID0gbW9tZW50KHRpbWVTdGFtcCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0uZm9ybWF0KGZvcm1hdCk7XG5cblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cblxufSgpKTsiLCIvLyhmdW5jdGlvbigpe1xuLy8gICAndXNlIHN0cmljdCc7XG4vL1xuLy8gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4vLyAgICAgICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uICgpe1xuLy8gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuLy8gICAgICAgICAgICB2bS51c2VyID0ge307XG4vLyAgICAgICAgICAgIHZtLmxvZ2luID0gTG9naW5zLnBvc3Q7XG4vLyAgICAgICAgfSk7XG4vL30oKSk7XG5cbi8vd29ya2luZyA9IGZhbHNlO1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdMb2dpbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoVXNlcnMsICRzdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgIHZtLmNyZWRzID0ge307XG4gICAgICAgICAgICB2bS5sb2dpbiA9IGZ1bmN0aW9uIGxvZ2luKGNyZWRzKSB7XG4gICAgICAgICAgICAgICAgVXNlcnMubG9naW4oY3JlZHMpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3Byb2plY3RzJyk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9naW5GYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG59KCkpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdBZGRQcm9qZWN0Q29udHJvbGxlcicsIGZ1bmN0aW9uKFByb2plY3RzKXtcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICB2bS5wcm9qZWN0ID0ge307XG4gICAgICAgICAgICB2bS5zYXZlID0gUHJvamVjdHMucG9zdDtcbiAgICAgICAgfSk7XG59KCkpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdFZGl0UHJvamVjdENvbnRyb2xsZXInLCBmdW5jdGlvbihwcm9qZWN0LCBQcm9qZWN0cywgVXNlcnMpe1xuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgIHZtLnVzZXJzID0gVXNlcnMudXNlcnM7XG4gICAgICAgICAgICB2bS5wcm9qZWN0ID0gcHJvamVjdDtcbiAgICAgICAgICAgIHZtLnByb2plY3RDb3B5ID0gXy5jbG9uZShwcm9qZWN0KTtcbiAgICAgICAgICAgIHZtLnVwZGF0ZSA9IFByb2plY3RzLnB1dDtcbiAgICAgICAgfSk7XG59KCkpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdOZXdQcm9qZWN0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIFVzZXJzKXtcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICB2bS51c2VycyA9IFVzZXJzLnVzZXJzO1xuICAgICAgICAgICAgdm0ucHJvamVjdCA9IHt1c2VyOiBfLmZpcnN0KHZtLnVzZXJzKS5faWR9O1xuXG5cbiAgICAgICAgICAgIHZtLmNsb3NlID0gZnVuY3Rpb24gY2xvc2UoKXtcbiAgICAgICAgICAgICAgICAvL3RoaXMgZnVuY3Rpb24gY2xvc2VzIGFuZCBzYXZlcyB0aGUgaW5wdXR0ZWQgaW5mb3JtYXRpb25cbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSh2bS5wcm9qZWN0KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLmRpc21pc3MgPSBmdW5jdGlvbiBkaXNtaXNzKCl7XG4gICAgICAgICAgICAgICAgLy90aGlzIGZ1bmN0aW9uIHZvaWRzIGFueSBmdXJ0aGVyIGFjdGlvbiBhbmQgcmV0dXJucyB0byBwcmV2aW91cyBzdGF0ZVxuICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSk7XG5cbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Byb2plY3RDb250cm9sbGVyJywgZnVuY3Rpb24ocHJvamVjdCwgUHJvamVjdHMpe1xuXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgdm0ucHJvamVjdCA9IHByb2plY3Q7XG4gICAgICAgICAgICB2bS5kZWwgPSBQcm9qZWN0cy5kZWw7XG5cbiAgICAgICAgfSk7XG5cbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignUHJvamVjdHNDb250cm9sbGVyJywgZnVuY3Rpb24gKHByb2plY3RzLCBQcm9qZWN0cywgJG1vZGFsLCBVc2Vycykge1xuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgIHZtLnByb2plY3RzID0gcHJvamVjdHM7XG4gICAgICAgICAgICB2bS5yZW1vdmUgPSBQcm9qZWN0cy5kZWw7XG4gICAgICAgICAgICB2bS5jdXJyZW50VXNlciA9IFVzZXJzLmN1cnJlbnRVc2VyO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEFkZGluZyBhIG5ldyBwcm9qZWN0LlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHZtLmFkZFByb2plY3QgPSBmdW5jdGlvbiBhZGRQcm9qZWN0KHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9uZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOZXdQcm9qZWN0Q3RybCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ25ld1Byb2plY3QnLFxuICAgICAgICAgICAgICAgICAgICBzaXplOiAnbWQnXG4gICAgICAgICAgICAgICAgfSkucmVzdWx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgUHJvamVjdHMucG9zdChyZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xufSgpKTsiLCIoZnVuY3Rpb24oKXtcbiAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignVXNlcnNDb250cm9sbGVyJywgZnVuY3Rpb24oVXNlcnMsIHVzZXJzKXtcblxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgICAgdm0udXNlcnMgPSB1c2VycztcblxuICAgICAgICAgICAgcmV0dXJuIHVzZXJzO1xuXG4gICAgICAgIH0pO1xuXG59KCkpOyIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuc2VydmljZSgnUHJvamVjdHMnLCBmdW5jdGlvbigkaHR0cCwgJHN0YXRlLCBVc2Vycyl7XG5cbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZtLnByb2plY3RzID0gW107XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE91ciBtYWluIHByb2plY3RzIHN0b3JhZ2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7YXJyYXl9XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHZtLmZpbmQgPSBmdW5jdGlvbiBmaW5kKHByb2plY3RJZCl7XG4gICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmZpbmQodm0ucHJvamVjdHMsIHtfaWQ6IHByb2plY3RJZH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZ2V0ID0gZnVuY3Rpb24gZ2V0KCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3Byb2plY3RzJylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5wcm9qZWN0cy5zcGxpY2UoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHByb2plY3Qpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3QudXNlciA9IFVzZXJzLmZpbmQocHJvamVjdC51c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5wcm9qZWN0cy5wdXNoKHByb2plY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0ucHJvamVjdHM7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuXG4gICAgICAgICAgICB2bS5wb3N0ID0gZnVuY3Rpb24gcG9zdChwcm9qZWN0KXtcblxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvcHJvamVjdHMvJywgcHJvamVjdClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5kYXRhLnVzZXIgPSBVc2Vycy5maW5kKHJlcy5kYXRhLnVzZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5wcm9qZWN0cy5wdXNoKHJlcy5kYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdwcm9qZWN0cycsIHtwcm9qZWN0SWQ6IHByb2plY3QuX2lkfSk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLnB1dCA9IGZ1bmN0aW9uIHB1dChwcm9qZWN0Q29weSl7XG4gICAgICAgICAgICAgIGRlYnVnZ2VyO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogcHJvamVjdENvcHkudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiBwcm9qZWN0Q29weS51c2VyLl9pZFxuICAgICAgICAgICAgICAgIH07XG5cblxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9wcm9qZWN0cy8nICsgcHJvamVjdENvcHkuX2lkLCBkYXRhKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwID0gdm0uZmluZChwcm9qZWN0Q29weS5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5tZXJnZShwLCBwcm9qZWN0Q29weSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3Byb2plY3RzLmRldGFpbCcsIHtwcm9qZWN0SWQ6IHByb2plY3RDb3B5Ll9pZH0pO1xuXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0ucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKHByb2plY3RJZCl7XG4gICAgICAgICAgICAgICAgXy5yZW1vdmUodm0ucHJvamVjdHMsIHtfaWQ6IHByb2plY3RJZH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZGVsID0gZnVuY3Rpb24gZGVsKHByb2plY3RJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoJy9wcm9qZWN0cy8nICsgcHJvamVjdElkKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5yZW1vdmUocHJvamVjdElkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncHJvamVjdHMnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xuXG59KCkpO1xuXG5cbi8vdm0ucG9zdCA9IGZ1bmN0aW9uIHBvc3QocHJvamVjdCl7XG4vLyAgICByZXR1cm4gJGh0dHAucG9zdCgnL3Byb2plY3RzLycpXG4vLyAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbi8vICAgICAgICAgICAgdm0ucHJvamVjdHMucHVzaChyZXMuZGF0YSk7XG4vL1xuLy8gICAgICAgIH0pO1xuLy99O1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5zZXJ2aWNlKCdVc2VycycsIGZ1bmN0aW9uKCRodHRwLCBVc2VyLCAkc3RhdGUpe1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZtLmN1cnJlbnRVc2VyID0gbnVsbDtcblxuICAgICAgICAgICAgdm0uY3VycmVudFVzZXJUb2tlbiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB2bS51c2VycyA9IFtdO1xuXG4gICAgICAgICAgICB2bS5maW5kID0gZnVuY3Rpb24gZmluZCh1c2VySWQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmZpbmQodm0udXNlcnMsIHtfaWQ6IHVzZXJJZH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZtLmdldCA9IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3VzZXJzJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS51c2Vycy5zcGxpY2UoMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVzZXJzLnB1c2gobmV3IFVzZXIodXNlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLnVzZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBMb2dpbiBhIHVzZXIgd2l0aCB0aGUgcHJvdmlkZWQgY3JlZGVudGlhbHMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHBhcmFtIGNyZWRzXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdm0ubG9naW4gPSBmdW5jdGlvbiBsb2dpbihjcmVkcykge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbG9naW4nLCBjcmVkcylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICB2bS5jdXJyZW50VXNlciA9IHJlcy5kYXRhLnVzZXI7XG4gICAgICAgICAgICAgICAgICAgIHZtLmN1cnJlbnRVc2VyVG9rZW4gPSByZXMuZGF0YS50b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5pc0xvZ2dlZEluID0gZnVuY3Rpb24gaXNMb2dnZWRJbigpe1xuICAgICAgICAgICAgICAgIHJldHVybiAhIXZtLmN1cnJlbnRVc2VyO1xuICAgICAgICAgICAgICAgIC8vZG91YmxlIGVxdWFscyB0dXJucyB0byBCb29sZWFuXG4gICAgICAgICAgICB9O1xuXG5cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogR2V0IGFsbCB1c2VycyBmcm9tIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgfSk7XG59KCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
