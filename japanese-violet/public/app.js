var app = angular.module('app-web', ['ngRoute', 'ngCookies', 'ui.bootstrap']);

//Constantes
var addr = "http://localhost:8080";
var views = "views/";
var Busqueda = "";

app.config(function($routeProvider){
	$routeProvider
		.when("/", {
			templateUrl: views + "home.html",
			controller: "HomeController"
		})

        .when("/log", {
            templateUrl: views + "logIn.html",
            controller: "LogInController"
        })
        .when("/sign", {
            templateUrl: views + "signUp.html",
            controller: "SignUpController"
        })
});

app.controller("IndexController", ['$scope','$route',"$cookies", '$cookieStore','$location', function($scope,$route, $cookies,$cookieStore,$location){
	$scope.user = {};
	$scope.user.username = $cookies.get('username');
	$route.reload();


	//Función que comprueba si un usuario esta logead
	$scope.notLogged = function() {
        return angular.isUndefined($scope.user.username);
    };

    //Deslogeamos al usuario
    $scope.logOut = function(){
		$cookies.remove("username");
		$scope.user.username= undefined;
	};
}]);

app.controller("LogInController", ['$scope','$window','$http', "$cookies", "$cookieStore", "$location", function($scope,$window, $http, $cookies, $cookieStore,
$location){
    $scope.form = {};

    $scope.login = function(login){
        if($scope.form.username && $scope.form.pass){
            $http.post(addr + '/login', login)
                .success(function (data) {
                    $cookies.put('username',login.username);
                    $window.location.reload();
                    $location.path("/");
                })
                .error(function (data){
                    alert("Username o contraseña incorrecta");
                });
        }
    },

    $scope.facebook = function(){
        $http.post(addr + '/login/facebook',login)
            .success(function (data) {
                $cookies.put('username',login.username);
                $window.location.reload();
                $location.path("/");
            })
            .error(function (data){
                alert("Username o contraseña incorrecta");
            });

    },


    $scope.twitter = function(){
        $http.post(addr + '/login/twitter',login)
            .success(function (data) {
                $cookies.put('username',login.username);
                $window.location.reload();
                $location.path("/");
            })
            .error(function (data){
                alert("Username o contraseña incorrecta");
            });

    },

    $scope.google = function(){
        $http.post(addr + '/login/google',login)
            .success(function (data) {
                $cookies.put('username',login.username);
                $window.location.reload();
                $location.path("/");
            })
            .error(function (data){
                alert("Username o contraseña incorrecta");
            });

    }

}]);

app.controller("SignUpController", ['$scope','$window','$http', "$cookies", "$cookieStore", "$location", function($scope,$window, $http,$cookies, $cookieStore,$location){

    $scope.user = {};
    $scope.status=true;

	$scope.update = function(user){
        if (user.pass == user.repass){
            $http.post(addr + "/signup", user)
                .success(function (data){
                    $cookies.put('username',user.username);
                    $window.location.reload();
                    $location.path("/");
                })
                .error(function (data){
                    alert("Nombre o email ya registrado.");
                });
        }else{
            alert("Las contraseñas no coinciden");
        }
    };
}]);


app.controller("HomeController", ['$scope', "$cookies", '$cookieStore', '$http','socket', function($scope, $cookies, $cookieStore, $http, $rootScope){

    $http.post(addr + '/stats', $scope.query).success(function(data){
        $scope.result = data;
    });

    socket.on('stats',function(data){
        $scope.realStat = data;
    });

    socket.on('bye',function(data){
        socket.disconnect();
    });


}]);
