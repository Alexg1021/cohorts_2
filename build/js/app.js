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

                var data = {
                        title: projectCopy.title,
                        user: projectCopy.user._id
                };
                return $http.put('/projects/' + projectCopy._id, data)
                    .then(function(res){

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
//(function(){
//
//    'use strict';
//
//    angular.module('app')
//        .controller('ProjectsController', function(projects, Projects, $modal, Users){
//           var vm = this;
//            vm.projects = projects;
//            vm.addProject = function addProject(project) {
//
//               var modalInstance =  $modal.open({
//                    templateUrl: 'partials/projects/new.html',
//                    controller: 'NewProjectCtrl',
//                    controllerAs: 'newProject',
//                    size: 'md'
//                }).result.then(function (res){
//
//                       Projects.post(res)
//                           .then(function(res){
//                               $state.go('projects');
//                           });
//                   });
//            };
//
//
//            vm.remove = Projects.del;
//            vm.currentUser = Users.currentUser;
//        });
//}());

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJ1aS5tb2R1bGUuanMiLCJib2R5LmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL3Byb2plY3RzLXRhYmxlLmRpcmVjdGl2ZS5qcyIsImZhY3Rvcmllcy91c2VyLmZhY3RvcnkuanMiLCJmaWx0ZXJzL2RhdGUuZmlsdGVyLmpzIiwibG9naW4vbG9naW4uY29udHJvbGxlci5qcyIsInNlcnZpY2VzL3Byb2plY3RzLnNlcnZpY2UuanMiLCJzZXJ2aWNlcy91c2Vycy5zZXJ2aWNlLmpzIiwicHJvamVjdHMvYWRkLnByb2plY3QuY29udHJvbGxlci5qcyIsInByb2plY3RzL2VkaXQucHJvamVjdC5jb250cm9sbGVyLmpzIiwicHJvamVjdHMvbmV3LXByb2plY3QuY29udHJvbGxlci5qcyIsInByb2plY3RzL3Byb2plY3QuY29udHJvbGxlci5qcyIsInByb2plY3RzL3Byb2plY3RzLmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0cy91c2Vycy5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1SUEsQ0FBQSxZQUFBOztJQUVBOztJQUVBLFFBQUEsT0FBQSxPQUFBLENBQUEsYUFBQSxVQUFBO1NBQ0EsaUVBQUEsVUFBQSxnQkFBQSxvQkFBQSxlQUFBOzs7O1lBSUEsbUJBQUEsVUFBQTs7Ozs7WUFLQTtpQkFDQSxNQUFBLFNBQUE7b0JBQ0EsS0FBQTtvQkFDQSxhQUFBO29CQUNBLFlBQUE7b0JBQ0EsY0FBQTs7aUJBRUEsTUFBQSxZQUFBO29CQUNBLEtBQUE7b0JBQ0EsYUFBQTtvQkFDQSxZQUFBO29CQUNBLGNBQUE7b0JBQ0EsU0FBQTt3QkFDQSxpQkFBQSxVQUFBLE9BQUE7OzRCQUVBLE9BQUEsTUFBQTs7d0JBRUEsZ0NBQUEsVUFBQSxVQUFBLE9BQUE7OzRCQUVBLE9BQUEsU0FBQTs7O29CQUdBLE1BQUE7d0JBQ0EsZUFBQTs7O2lCQUdBLE1BQUEsbUJBQUE7b0JBQ0EsS0FBQTtvQkFDQSxhQUFBO29CQUNBLFlBQUE7b0JBQ0EsY0FBQTtvQkFDQSxTQUFBO3dCQUNBLGtEQUFBLFVBQUEsVUFBQSxjQUFBLFVBQUE7OzRCQUVBLE9BQUEsU0FBQSxLQUFBLGFBQUE7OztvQkFHQSxNQUFBO3dCQUNBLGVBQUE7OztpQkFHQSxNQUFBLHdCQUFBO29CQUNBLEtBQUE7b0JBQ0EsYUFBQTtvQkFDQSxZQUFBO29CQUNBLGNBQUE7b0JBQ0EsTUFBQTt3QkFDQSxlQUFBOzs7Ozs7OztZQVFBLGNBQUEsYUFBQSxtQkFBQSxVQUFBLFdBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBLFVBQUEsUUFBQTt3QkFDQSxJQUFBLFFBQUEsVUFBQSxJQUFBO3dCQUNBLElBQUEsTUFBQSxjQUFBLE9BQUEsUUFBQSxnQkFBQSxXQUFBLE1BQUE7d0JBQ0EsT0FBQTs7Ozs7U0FLQSxzQ0FBQSxVQUFBLFlBQUEsT0FBQSxRQUFBO1lBQ0EsV0FBQSxJQUFBLHFCQUFBLFVBQUEsT0FBQSxTQUFBO2dCQUNBLElBQUEsUUFBQSxRQUFBLFFBQUEsS0FBQSxlQUFBO29CQUNBLElBQUEsQ0FBQSxNQUFBLGNBQUE7d0JBQ0EsTUFBQTt3QkFDQSxPQUFBLEdBQUE7Ozs7OztBQzNOQSxDQUFBLFVBQUE7O0dBRUE7O0lBRUEsUUFBQSxPQUFBLFVBQUE7Ozs7O0FDSkEsQ0FBQSxVQUFBOztHQUVBOzs7SUFHQSxRQUFBLE9BQUE7U0FDQSxXQUFBLHdDQUFBLFNBQUEsT0FBQSxTQUFBO1dBQ0EsSUFBQSxLQUFBOztZQUVBLEdBQUEsVUFBQTs7O1lBR0EsU0FBQTtpQkFDQSxLQUFBLFNBQUEsU0FBQTs7b0JBRUEsR0FBQSxXQUFBLFNBQUE7Ozs7OztBQ2ZBLENBQUEsVUFBQTs7R0FFQTs7OztJQUlBLFFBQUEsT0FBQTtTQUNBLFVBQUEsZ0JBQUEsVUFBQTs7Ozs7WUFLQSxNQUFBOztnQkFFQSxVQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxVQUFBO29CQUNBLFFBQUE7Ozs7Ozs7O0FDbEJBLENBQUEsVUFBQTtHQUNBOztJQUVBLFFBQUEsT0FBQTtTQUNBLFFBQUEsUUFBQSxVQUFBO1lBQ0EsU0FBQSxLQUFBLEtBQUE7OztnQkFHQSxFQUFBLE1BQUEsTUFBQTtvQkFDQSxZQUFBO29CQUNBLFdBQUE7b0JBQ0EsT0FBQTttQkFDQSxRQUFBOzs7WUFHQSxLQUFBLFlBQUE7Z0JBQ0EsVUFBQSxTQUFBLFVBQUE7O29CQUVBLE9BQUEsS0FBQSxhQUFBLE1BQUEsS0FBQTs7OztZQUlBLE9BQUE7OztBQ3RCQSxDQUFBLFVBQUE7O0lBRUE7O0lBRUEsUUFBQSxPQUFBO1NBQ0EsT0FBQSxZQUFBLFVBQUE7WUFDQSxPQUFBLFNBQUEsV0FBQSxPQUFBOztnQkFFQSxTQUFBLFVBQUE7Z0JBQ0EsSUFBQSxJQUFBLE9BQUE7Z0JBQ0EsT0FBQSxFQUFBLE9BQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0dBLENBQUEsWUFBQTs7SUFFQTs7SUFFQSxRQUFBLE9BQUE7U0FDQSxXQUFBLHVDQUFBLFVBQUEsT0FBQSxRQUFBO1lBQ0EsSUFBQSxLQUFBO1lBQ0EsR0FBQSxRQUFBO1lBQ0EsR0FBQSxRQUFBLFNBQUEsTUFBQSxPQUFBO2dCQUNBLE1BQUEsTUFBQTtxQkFDQSxLQUFBLFNBQUEsSUFBQTt3QkFDQSxPQUFBLEdBQUE7O2dCQUVBLFNBQUEsSUFBQTs7b0JBRUEsR0FBQSxjQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVCQSxDQUFBLFVBQUE7SUFDQTs7SUFFQSxRQUFBLE9BQUE7U0FDQSxRQUFBLHlDQUFBLFNBQUEsT0FBQSxRQUFBLE1BQUE7O1lBRUEsSUFBQSxLQUFBOztZQUVBLEdBQUEsV0FBQTs7Ozs7Ozs7WUFRQSxHQUFBLE9BQUEsU0FBQSxLQUFBLFVBQUE7Z0JBQ0EsT0FBQSxFQUFBLEtBQUEsR0FBQSxVQUFBLENBQUEsS0FBQTs7O1lBR0EsR0FBQSxNQUFBLFNBQUEsS0FBQTtnQkFDQSxPQUFBLE1BQUEsSUFBQTtxQkFDQSxLQUFBLFVBQUEsSUFBQTt3QkFDQSxHQUFBLFNBQUEsT0FBQTt3QkFDQSxJQUFBLEtBQUEsUUFBQSxTQUFBLFFBQUE7NEJBQ0EsUUFBQSxPQUFBLE1BQUEsS0FBQSxRQUFBOzRCQUNBLEdBQUEsU0FBQSxLQUFBOzt3QkFFQSxPQUFBLEdBQUE7Ozs7O1lBS0EsR0FBQSxPQUFBLFNBQUEsS0FBQSxRQUFBOztnQkFFQSxPQUFBLE1BQUEsS0FBQSxjQUFBO3FCQUNBLEtBQUEsU0FBQSxJQUFBO3dCQUNBLElBQUEsS0FBQSxPQUFBLE1BQUEsS0FBQSxJQUFBLEtBQUE7O3dCQUVBLEdBQUEsU0FBQSxLQUFBLElBQUE7O3dCQUVBLE9BQUEsR0FBQSxZQUFBLENBQUEsV0FBQSxRQUFBO21CQUNBLFNBQUEsSUFBQTs7Ozs7OztZQU9BLEdBQUEsTUFBQSxTQUFBLElBQUEsWUFBQTs7Z0JBRUEsSUFBQSxPQUFBO3dCQUNBLE9BQUEsWUFBQTt3QkFDQSxNQUFBLFlBQUEsS0FBQTs7Z0JBRUEsT0FBQSxNQUFBLElBQUEsZUFBQSxZQUFBLEtBQUE7cUJBQ0EsS0FBQSxTQUFBLElBQUE7O3dCQUVBLElBQUEsSUFBQSxHQUFBLEtBQUEsWUFBQTt3QkFDQSxFQUFBLE1BQUEsR0FBQTt3QkFDQSxPQUFBLEdBQUEsbUJBQUEsQ0FBQSxXQUFBLFlBQUE7O21CQUVBLFNBQUEsSUFBQTs7Ozs7WUFLQSxHQUFBLFNBQUEsU0FBQSxPQUFBLFVBQUE7Z0JBQ0EsRUFBQSxPQUFBLEdBQUEsVUFBQSxDQUFBLEtBQUE7OztZQUdBLEdBQUEsTUFBQSxTQUFBLElBQUEsV0FBQTtnQkFDQSxPQUFBLE1BQUEsT0FBQSxlQUFBO3FCQUNBLEtBQUEsVUFBQSxLQUFBO3dCQUNBLEdBQUEsT0FBQTt3QkFDQSxPQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRUEsQ0FBQSxVQUFBO0lBQ0E7O0lBRUEsUUFBQSxPQUFBO1NBQ0EsUUFBQSxxQ0FBQSxTQUFBLE9BQUEsTUFBQSxPQUFBO2dCQUNBLElBQUEsS0FBQTs7WUFFQSxHQUFBLGNBQUE7O1lBRUEsR0FBQSxtQkFBQTs7Z0JBRUEsR0FBQSxRQUFBOztZQUVBLEdBQUEsT0FBQSxTQUFBLEtBQUEsT0FBQTtnQkFDQSxPQUFBLEVBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxLQUFBOzs7Z0JBR0EsR0FBQSxNQUFBLFNBQUEsTUFBQTtvQkFDQSxPQUFBLE1BQUEsSUFBQTt5QkFDQSxLQUFBLFVBQUEsS0FBQTs0QkFDQSxHQUFBLE1BQUEsT0FBQTs7NEJBRUEsSUFBQSxLQUFBLFFBQUEsVUFBQSxNQUFBO2dDQUNBLEdBQUEsTUFBQSxLQUFBLElBQUEsS0FBQTs7OzRCQUdBLE9BQUEsR0FBQTs7Ozs7Ozs7OztZQVVBLEdBQUEsUUFBQSxTQUFBLE1BQUEsT0FBQTtnQkFDQSxPQUFBLE1BQUEsS0FBQSxVQUFBO3FCQUNBLEtBQUEsVUFBQSxLQUFBO29CQUNBLEdBQUEsY0FBQSxJQUFBLEtBQUE7b0JBQ0EsR0FBQSxtQkFBQSxJQUFBLEtBQUE7Ozs7WUFJQSxHQUFBLGFBQUEsU0FBQSxZQUFBO2dCQUNBLE9BQUEsQ0FBQSxDQUFBLEdBQUE7Ozs7Ozs7Ozs7Ozs7QUM3Q0EsQ0FBQSxVQUFBOztJQUVBOztJQUVBLFFBQUEsT0FBQTtTQUNBLFdBQUEscUNBQUEsU0FBQSxTQUFBO1lBQ0EsSUFBQSxLQUFBO1lBQ0EsR0FBQSxVQUFBO1lBQ0EsR0FBQSxPQUFBLFNBQUE7OztBQ1JBLENBQUEsVUFBQTs7SUFFQTs7SUFFQSxRQUFBLE9BQUE7U0FDQSxXQUFBLDBEQUFBLFNBQUEsU0FBQSxVQUFBLE1BQUE7WUFDQSxJQUFBLEtBQUE7WUFDQSxHQUFBLFFBQUEsTUFBQTtZQUNBLEdBQUEsVUFBQTtZQUNBLEdBQUEsY0FBQSxFQUFBLE1BQUE7WUFDQSxHQUFBLFNBQUEsU0FBQTs7OztBQ1ZBLENBQUEsVUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQTtTQUNBLFdBQUEsd0RBQUEsU0FBQSxRQUFBLGdCQUFBLE1BQUE7WUFDQSxJQUFBLEtBQUE7WUFDQSxHQUFBLFFBQUEsTUFBQTtZQUNBLEdBQUEsVUFBQSxDQUFBLE1BQUEsRUFBQSxNQUFBLEdBQUEsT0FBQTs7O1lBR0EsR0FBQSxRQUFBLFNBQUEsT0FBQTs7Z0JBRUEsZUFBQSxNQUFBLEdBQUE7OztZQUdBLEdBQUEsVUFBQSxTQUFBLFNBQUE7O2dCQUVBLGVBQUE7Ozs7OztBQ2pCQSxDQUFBLFVBQUE7O0lBRUE7O0lBRUEsUUFBQSxPQUFBO1NBQ0EsV0FBQSw2Q0FBQSxTQUFBLFNBQUEsU0FBQTs7WUFFQSxJQUFBLEtBQUE7WUFDQSxHQUFBLFVBQUE7WUFDQSxHQUFBLE1BQUEsU0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNxQkEsQ0FBQSxZQUFBOztJQUVBOztJQUVBLFFBQUEsT0FBQTtTQUNBLFdBQUEsa0VBQUEsVUFBQSxVQUFBLFVBQUEsUUFBQSxPQUFBO1lBQ0EsSUFBQSxLQUFBO1lBQ0EsR0FBQSxXQUFBO1lBQ0EsR0FBQSxTQUFBLFNBQUE7WUFDQSxHQUFBLGNBQUEsTUFBQTs7Ozs7WUFLQSxHQUFBLGFBQUEsU0FBQSxXQUFBLFNBQUE7Z0JBQ0EsSUFBQSxnQkFBQSxPQUFBLEtBQUE7b0JBQ0EsYUFBQTtvQkFDQSxZQUFBO29CQUNBLGNBQUE7b0JBQ0EsTUFBQTttQkFDQSxPQUFBLEtBQUEsVUFBQSxLQUFBO3dCQUNBLFNBQUEsS0FBQTs7Ozs7QUNuREEsQ0FBQSxVQUFBO0dBQ0E7O0lBRUEsUUFBQSxPQUFBO1NBQ0EsV0FBQSxzQ0FBQSxTQUFBLE9BQUEsTUFBQTs7WUFFQSxJQUFBLEtBQUE7O1lBRUEsR0FBQSxRQUFBOztZQUVBLE9BQUE7Ozs7S0FJQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyhmdW5jdGlvbigpe1xuLy9cbi8vICAgICd1c2Ugc3RyaWN0Jztcbi8vXG4vLyAgICAvL3R3byB3YXlzIHRvIHVzZSBhbmd1bGFyIG1vZHVsZSAxLiBjcmVhdGluZyBhIG1vZHVsZSAyLiBhZGRpbmcgb3IgdXNpbmcgdGhlIG1vZHVsZVxuLy9cbi8vICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlcicsICdhcHAudWknLCAndWkuYm9vdHN0cmFwJ10pXG4vLyAgICAgICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKXtcbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIERlZmF1bHQgUm91dGVcbi8vICAgICAgICAgICAgICpcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9wcm9qZWN0cycpO1xuLy9cbi8vICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqXG4vLyAgICAgICAgICAgICAqIERlZmluZSBvdXIgc3RhdGVzLlxuLy8gICAgICAgICAgICAgKlxuLy8gICAgICAgICAgICAgKi9cbi8vXG4vLyAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXG4vLyAgICAgICAgICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xuLy8gICAgICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9sb2dpbi9pbmRleC5odG1sJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdsb2dpbkNvbnRyb2xsZXInXG4vLyAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgLnN0YXRlKCdwcm9qZWN0cycsIHtcbi8vICAgICAgICAgICAgICAgICAgIHVybDogJy9wcm9qZWN0cycsXG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9pbmRleC5odG1sJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdwcm9qZWN0c0NvbnRyb2xsZXInLFxuLy8gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6e1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB1c2VyczogZnVuY3Rpb24gKFVzZXJzKXtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2Vycy5nZXQoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdHM6IGZ1bmN0aW9uIChQcm9qZWN0cywgdXNlcnMpe1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9qZWN0cy5nZXQoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4vLyAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICAgIC5zdGF0ZSgndXNlcnMnLHtcbi8vICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdXNlcnMnLFxuLy8gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcHJvamVjdHMvdXNlcnMuaHRtbCcsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJzQ29udHJvbGxlcicsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndXNlcnNDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJzOiBmdW5jdGlvbiAoVXNlcnMpe1xuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2Vycy5nZXQoKTtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgIH1cbi8vXG4vLyAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgLnN0YXRlKCdwcm9qZWN0cy5hZGQnLCB7XG4vLyAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FkZCcsXG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9hZGQuaHRtbCcsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZFByb2plY3RDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhZGRQcm9qZWN0Q29udHJvbGxlcicsXG4vLyAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4vLyAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICAgIC5zdGF0ZSgndXNlcnMuYWRkJywge1xuLy8gICAgICAgICAgICAgICAgICAgIHVybDogJy9hZGQtdXNlcicsXG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9hZGQtdXNlci5odG1sJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRkVXNlckNvbnRyb2xsZXInLFxuLy8gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2FkZFVzZXJDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbi8vICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgLnN0YXRlKCdwcm9qZWN0cy5kZXRhaWwnLHtcbi8vICAgICAgICAgICAgICAgICAgICB1cmw6ICcvOnByb2plY3RJZCcsXG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9kZXRhaWwuaHRtbCcsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdwcm9qZWN0Q29udHJvbGxlcicsXG4vLyAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0OiBmdW5jdGlvbiAoUHJvamVjdHMsICRzdGF0ZVBhcmFtcywgcHJvamVjdHMpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9qZWN0cy5maW5kKCRzdGF0ZVBhcmFtcy5wcm9qZWN0SWQpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbi8vICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgLnN0YXRlKCdwcm9qZWN0cy5kZXRhaWwuZWRpdCcsIHtcbi8vICAgICAgICAgICAgICAgICAgICB1cmw6Jy9lZGl0Jyxcbi8vICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3Byb2plY3RzL2VkaXQuaHRtbCcsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRQcm9qZWN0Q29udHJvbGxlcicsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnZWRpdFByb2plY3RDb250cm9sbGVyJyxcbi8vICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbi8vICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKGZ1bmN0aW9uKCRpbmplY3Rvcil7XG4vLyAgICAgICAgICAgICAgICAgICAgcmV0dXJue1xuLy8gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbihjb25maWcpe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFVzZXJzID0gJGluamVjdG9yLmdldCgnVXNlcnMnKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKFVzZXJzLmlzTG9nZ2VkSW4oKSkgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdUb2tlbiAnICsgVXNlcnMuY3VycmVudFVzZXJUb2tlbjtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICB9O1xuLy8gICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICAgIC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIFVzZXJzLCAkc3RhdGUpe1xuLy8gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlKXtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRvU3RhdGUuZGF0YSAmJiB0b1N0YXRlLmRhdGEucmVxdWlyZXNMb2dpbil7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighVXNlcnMuaXNMb2dnZWRJbigpKSB7XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgICAgICB9KTtcbi8vXG4vLyAgICAgICAgfSk7XG4vLyAgICAvL2NvbnRyb2xsZXJzIGFyZSB0aGUgdGhpbmdzIHRoYXQgbGluayB0aGUgdmlldyhodG1sKSB3aXRoIHRoZSBkYXRhXG4vL1xuLy99KCkpO1xuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXInLCAnYXBwLnVpJywgJ3VpLmJvb3RzdHJhcCddKVxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgUm91dGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9wcm9qZWN0cycpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmluZSBvdXIgc3RhdGVzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvbG9naW4vaW5kZXguaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdsb2dpbkNvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ3Byb2plY3RzJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcHJvamVjdHMnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3Byb2plY3RzL2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncHJvamVjdHNDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcnM6IGZ1bmN0aW9uIChVc2Vycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUkVUVVJOUyBBIFBST01JU0UsIENPTlRST0xMRVIgSVMgQ0FMTEVEIFdIRU4gUFJPTUlTRSBJUyBSRVNPTFZFRFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2Vycy5nZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0czogZnVuY3Rpb24gKFByb2plY3RzLCB1c2Vycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUkVUVVJOUyBBIFBST01JU0UsIENPTlRST0xMRVIgSVMgQ0FMTEVEIFdIRU4gUFJPTUlTRSBJUyBSRVNPTFZFRFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9qZWN0cy5nZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ3Byb2plY3RzLmRldGFpbCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLzpwcm9qZWN0SWQnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3Byb2plY3RzL2RldGFpbC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncHJvamVjdENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0OiBmdW5jdGlvbiAoUHJvamVjdHMsICRzdGF0ZVBhcmFtcywgcHJvamVjdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1JFVFVSTlMgQSBQUk9KRUNUIE9CSkVDVFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9qZWN0cy5maW5kKCRzdGF0ZVBhcmFtcy5wcm9qZWN0SWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgncHJvamVjdHMuZGV0YWlsLmVkaXQnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9lZGl0JyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9lZGl0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRWRpdFByb2plY3RDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnZWRpdFByb2plY3RDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ29uZmlndXJlIHRoZSBodHRwIGludGVyY2VwdG9ycy5cbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgVXNlcnMgPSAkaW5qZWN0b3IuZ2V0KCdVc2VycycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFVzZXJzLmlzTG9nZ2VkSW4oKSkgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdUb2tlbiAnICsgVXNlcnMuY3VycmVudFVzZXJUb2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIFVzZXJzLCAkc3RhdGUpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0b1N0YXRlLmRhdGEgJiYgdG9TdGF0ZS5kYXRhLnJlcXVpcmVzTG9naW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFVc2Vycy5pc0xvZ2dlZEluKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG59KCkpOyIsIihmdW5jdGlvbigpe1xuXG4gICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnVpJywgW10pO1xuXG5cblxufSgpKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy93aGVuIHR3byBhcmd1bWVudHMgKHBhcmFtYXRlcnMpIGl0IGRlZmluZXMgdGhlIG1vZHVsZSwgd2hlbiBvbmUgaXQgaXMgdXNpbmcgaXRcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0JvZHlDb250cm9sbGVyJywgZnVuY3Rpb24oJGh0dHAsIFByb2plY3RzKXtcbiAgICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgICAgdm0ud2VsY29tZSA9ICdIZWxsbyB0aGVyZSEnO1xuXG5cbiAgICAgICAgICAgIFByb2plY3RzLmdldCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocHJvamVjdHMpe1xuICAgICAgICAgICAgICAgICAgICAvL2RlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICB2bS5wcm9qZWN0cyA9IFByb2plY3RzLnByb2plY3RzO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG59KCkpOyIsIihmdW5jdGlvbigpe1xuXG4gICAndXNlIHN0cmljdCc7XG4vL0RpcmVjdGl2ZXMgYXJlIGFsd2F5cyBkYXNoIHN5bnRheCAoYW5ndWxhci1kYXNoKSBvbiB0aGUgaHRtbCwgYnV0IGl0IGlzIGNhbWVsIGNhc2luZyBpbnNpZGUgdGhlIGRpcmVjdGl2ZVxuICAgIC8vU28sIHByb2plY3QtdGFibGUgb24gaHRtbCBhbmQgcHJvamVjdFRhYmxlIGluIGRpcmVjdGl2ZVxuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC51aScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3Byb2plY3RUYWJsZScsIGZ1bmN0aW9uKCl7XG5cblxuXG4gICAgICAgICAgICAvL0NSRUFURSBUSEUgRERPIChEaXJlY3RpdmUgRGVmaW5pdGlvbiBPYmplY3QpXG4gICAgICAgICAgICByZXR1cm57XG5cbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvZGlyZWN0aXZlcy9wcm9qZWN0LXRhYmxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgICAgIHByb2plY3RzOiAnPScsXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZTogJz0nXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuXG59KCkpOyIsIihmdW5jdGlvbigpe1xuICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdVc2VyJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGZ1bmN0aW9uIFVzZXIoZGF0YSl7XG5cbiAgICAgICAgICAgICAgICAvL2xvZGFzaCBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzICd0aGlzJyB0byBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgXy5tZXJnZSh0aGlzLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6ICcnLFxuICAgICAgICAgICAgICAgICAgICBsYXN0X25hbWU6ICcnLFxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogJydcbiAgICAgICAgICAgICAgICB9LCBkYXRhIHx8IHt9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVXNlci5wcm90b3R5cGUgPSB7XG4gICAgICAgICAgICAgICAgZnVsbE5hbWU6IGZ1bmN0aW9uIGZ1bGxOYW1lKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlyc3RfbmFtZSArICcgJyArIHRoaXMubGFzdF9uYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBVc2VyO1xuICAgICAgICB9KTtcbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnVpJylcbiAgICAgICAgLmZpbHRlcignbmljZURhdGUnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRpbWVTdGFtcCwgZm9ybWF0KXtcblxuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAnTU1NTSBEbywgWVlZWSc7XG4gICAgICAgICAgICAgICAgdmFyIG0gPSBtb21lbnQodGltZVN0YW1wKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbS5mb3JtYXQoZm9ybWF0KTtcblxuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuXG59KCkpOyIsIi8vKGZ1bmN0aW9uKCl7XG4vLyAgICd1c2Ugc3RyaWN0Jztcbi8vXG4vLyAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi8vICAgICAgICAuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCl7XG4vLyAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4vLyAgICAgICAgICAgIHZtLnVzZXIgPSB7fTtcbi8vICAgICAgICAgICAgdm0ubG9naW4gPSBMb2dpbnMucG9zdDtcbi8vICAgICAgICB9KTtcbi8vfSgpKTtcblxuLy93b3JraW5nID0gZmFsc2U7XG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uIChVc2VycywgJHN0YXRlKSB7XG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgdm0uY3JlZHMgPSB7fTtcbiAgICAgICAgICAgIHZtLmxvZ2luID0gZnVuY3Rpb24gbG9naW4oY3JlZHMpIHtcbiAgICAgICAgICAgICAgICBVc2Vycy5sb2dpbihjcmVkcylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncHJvamVjdHMnKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlcnIpe1xuXG4gICAgICAgICAgICAgICAgICAgIHZtLmxvZ2luRmFpbGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG59KCkpOyIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuc2VydmljZSgnUHJvamVjdHMnLCBmdW5jdGlvbigkaHR0cCwgJHN0YXRlLCBVc2Vycyl7XG5cbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZtLnByb2plY3RzID0gW107XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE91ciBtYWluIHByb2plY3RzIHN0b3JhZ2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7YXJyYXl9XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHZtLmZpbmQgPSBmdW5jdGlvbiBmaW5kKHByb2plY3RJZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uZmluZCh2bS5wcm9qZWN0cywge19pZDogcHJvamVjdElkfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2bS5nZXQgPSBmdW5jdGlvbiBnZXQoKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvcHJvamVjdHMnKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnByb2plY3RzLnNwbGljZSgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5kYXRhLmZvckVhY2goZnVuY3Rpb24ocHJvamVjdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdC51c2VyID0gVXNlcnMuZmluZChwcm9qZWN0LnVzZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnByb2plY3RzLnB1c2gocHJvamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5wcm9qZWN0cztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICAgIHZtLnBvc3QgPSBmdW5jdGlvbiBwb3N0KHByb2plY3Qpe1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9wcm9qZWN0cy8nLCBwcm9qZWN0KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmRhdGEudXNlciA9IFVzZXJzLmZpbmQocmVzLmRhdGEudXNlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnByb2plY3RzLnB1c2gocmVzLmRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3Byb2plY3RzJywge3Byb2plY3RJZDogcHJvamVjdC5faWR9KTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9O1xuXG5cblxuICAgICAgICAgICAgdm0ucHV0ID0gZnVuY3Rpb24gcHV0KHByb2plY3RDb3B5KXtcblxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHByb2plY3RDb3B5LnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogcHJvamVjdENvcHkudXNlci5faWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9wcm9qZWN0cy8nICsgcHJvamVjdENvcHkuX2lkLCBkYXRhKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9IHZtLmZpbmQocHJvamVjdENvcHkuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ubWVyZ2UocCwgcHJvamVjdENvcHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdwcm9qZWN0cy5kZXRhaWwnLCB7cHJvamVjdElkOiBwcm9qZWN0Q29weS5faWR9KTtcblxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycil7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZShwcm9qZWN0SWQpe1xuICAgICAgICAgICAgICAgIF8ucmVtb3ZlKHZtLnByb2plY3RzLCB7X2lkOiBwcm9qZWN0SWR9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLmRlbCA9IGZ1bmN0aW9uIGRlbChwcm9qZWN0SWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKCcvcHJvamVjdHMvJyArIHByb2plY3RJZClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0ucmVtb3ZlKHByb2plY3RJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3Byb2plY3RzJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9KTtcblxufSgpKTtcblxuXG4vL3ZtLnBvc3QgPSBmdW5jdGlvbiBwb3N0KHByb2plY3Qpe1xuLy8gICAgcmV0dXJuICRodHRwLnBvc3QoJy9wcm9qZWN0cy8nKVxuLy8gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4vLyAgICAgICAgICAgIHZtLnByb2plY3RzLnB1c2gocmVzLmRhdGEpO1xuLy9cbi8vICAgICAgICB9KTtcbi8vfTsiLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLnNlcnZpY2UoJ1VzZXJzJywgZnVuY3Rpb24oJGh0dHAsIFVzZXIsICRzdGF0ZSl7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgICAgdm0uY3VycmVudFVzZXIgPSBudWxsO1xuXG4gICAgICAgICAgICB2bS5jdXJyZW50VXNlclRva2VuID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHZtLnVzZXJzID0gW107XG5cbiAgICAgICAgICAgIHZtLmZpbmQgPSBmdW5jdGlvbiBmaW5kKHVzZXJJZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uZmluZCh2bS51c2Vycywge19pZDogdXNlcklkfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uZ2V0ID0gZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvdXNlcnMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnVzZXJzLnNwbGljZSgwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5kYXRhLmZvckVhY2goZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udXNlcnMucHVzaChuZXcgVXNlcih1c2VyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0udXNlcnM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIExvZ2luIGEgdXNlciB3aXRoIHRoZSBwcm92aWRlZCBjcmVkZW50aWFscy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcGFyYW0gY3JlZHNcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2bS5sb2dpbiA9IGZ1bmN0aW9uIGxvZ2luKGNyZWRzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9sb2dpbicsIGNyZWRzKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmN1cnJlbnRVc2VyID0gcmVzLmRhdGEudXNlcjtcbiAgICAgICAgICAgICAgICAgICAgdm0uY3VycmVudFVzZXJUb2tlbiA9IHJlcy5kYXRhLnRva2VuO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZtLmlzTG9nZ2VkSW4gPSBmdW5jdGlvbiBpc0xvZ2dlZEluKCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhdm0uY3VycmVudFVzZXI7XG4gICAgICAgICAgICAgICAgLy9kb3VibGUgZXF1YWxzIHR1cm5zIHRvIEJvb2xlYW5cbiAgICAgICAgICAgIH07XG5cblxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBHZXQgYWxsIHVzZXJzIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICB9KTtcbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FkZFByb2plY3RDb250cm9sbGVyJywgZnVuY3Rpb24oUHJvamVjdHMpe1xuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgIHZtLnByb2plY3QgPSB7fTtcbiAgICAgICAgICAgIHZtLnNhdmUgPSBQcm9qZWN0cy5wb3N0O1xuICAgICAgICB9KTtcbn0oKSk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRQcm9qZWN0Q29udHJvbGxlcicsIGZ1bmN0aW9uKHByb2plY3QsIFByb2plY3RzLCBVc2Vycyl7XG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgdm0udXNlcnMgPSBVc2Vycy51c2VycztcbiAgICAgICAgICAgIHZtLnByb2plY3QgPSBwcm9qZWN0O1xuICAgICAgICAgICAgdm0ucHJvamVjdENvcHkgPSBfLmNsb25lKHByb2plY3QpO1xuICAgICAgICAgICAgdm0udXBkYXRlID0gUHJvamVjdHMucHV0O1xuICAgICAgICB9KTtcbn0oKSk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ05ld1Byb2plY3RDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgVXNlcnMpe1xuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgIHZtLnVzZXJzID0gVXNlcnMudXNlcnM7XG4gICAgICAgICAgICB2bS5wcm9qZWN0ID0ge3VzZXI6IF8uZmlyc3Qodm0udXNlcnMpLl9pZH07XG5cblxuICAgICAgICAgICAgdm0uY2xvc2UgPSBmdW5jdGlvbiBjbG9zZSgpe1xuICAgICAgICAgICAgICAgIC8vdGhpcyBmdW5jdGlvbiBjbG9zZXMgYW5kIHNhdmVzIHRoZSBpbnB1dHRlZCBpbmZvcm1hdGlvblxuICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKHZtLnByb2plY3QpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdm0uZGlzbWlzcyA9IGZ1bmN0aW9uIGRpc21pc3MoKXtcbiAgICAgICAgICAgICAgICAvL3RoaXMgZnVuY3Rpb24gdm9pZHMgYW55IGZ1cnRoZXIgYWN0aW9uIGFuZCByZXR1cm5zIHRvIHByZXZpb3VzIHN0YXRlXG4gICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9KTtcblxufSgpKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignUHJvamVjdENvbnRyb2xsZXInLCBmdW5jdGlvbihwcm9qZWN0LCBQcm9qZWN0cyl7XG5cbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICB2bS5wcm9qZWN0ID0gcHJvamVjdDtcbiAgICAgICAgICAgIHZtLmRlbCA9IFByb2plY3RzLmRlbDtcblxuICAgICAgICB9KTtcblxufSgpKTsiLCIvLyhmdW5jdGlvbigpe1xuLy9cbi8vICAgICd1c2Ugc3RyaWN0Jztcbi8vXG4vLyAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi8vICAgICAgICAuY29udHJvbGxlcignUHJvamVjdHNDb250cm9sbGVyJywgZnVuY3Rpb24ocHJvamVjdHMsIFByb2plY3RzLCAkbW9kYWwsIFVzZXJzKXtcbi8vICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuLy8gICAgICAgICAgICB2bS5wcm9qZWN0cyA9IHByb2plY3RzO1xuLy8gICAgICAgICAgICB2bS5hZGRQcm9qZWN0ID0gZnVuY3Rpb24gYWRkUHJvamVjdChwcm9qZWN0KSB7XG4vL1xuLy8gICAgICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICAkbW9kYWwub3Blbih7XG4vLyAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9uZXcuaHRtbCcsXG4vLyAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ05ld1Byb2plY3RDdHJsJyxcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICduZXdQcm9qZWN0Jyxcbi8vICAgICAgICAgICAgICAgICAgICBzaXplOiAnbWQnXG4vLyAgICAgICAgICAgICAgICB9KS5yZXN1bHQudGhlbihmdW5jdGlvbiAocmVzKXtcbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICAgUHJvamVjdHMucG9zdChyZXMpXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3Byb2plY3RzJyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgIH07XG4vL1xuLy9cbi8vICAgICAgICAgICAgdm0ucmVtb3ZlID0gUHJvamVjdHMuZGVsO1xuLy8gICAgICAgICAgICB2bS5jdXJyZW50VXNlciA9IFVzZXJzLmN1cnJlbnRVc2VyO1xuLy8gICAgICAgIH0pO1xuLy99KCkpO1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdQcm9qZWN0c0NvbnRyb2xsZXInLCBmdW5jdGlvbiAocHJvamVjdHMsIFByb2plY3RzLCAkbW9kYWwsIFVzZXJzKSB7XG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgdm0ucHJvamVjdHMgPSBwcm9qZWN0cztcbiAgICAgICAgICAgIHZtLnJlbW92ZSA9IFByb2plY3RzLmRlbDtcbiAgICAgICAgICAgIHZtLmN1cnJlbnRVc2VyID0gVXNlcnMuY3VycmVudFVzZXI7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQWRkaW5nIGEgbmV3IHByb2plY3QuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZtLmFkZFByb2plY3QgPSBmdW5jdGlvbiBhZGRQcm9qZWN0KHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9wcm9qZWN0cy9uZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOZXdQcm9qZWN0Q3RybCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ25ld1Byb2plY3QnLFxuICAgICAgICAgICAgICAgICAgICBzaXplOiAnbWQnXG4gICAgICAgICAgICAgICAgfSkucmVzdWx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgUHJvamVjdHMucG9zdChyZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xufSgpKTsiLCIoZnVuY3Rpb24oKXtcbiAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgICAgICAuY29udHJvbGxlcignVXNlcnNDb250cm9sbGVyJywgZnVuY3Rpb24oVXNlcnMsIHVzZXJzKXtcblxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgICAgdm0udXNlcnMgPSB1c2VycztcblxuICAgICAgICAgICAgcmV0dXJuIHVzZXJzO1xuXG4gICAgICAgIH0pO1xuXG59KCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
