var app = angular.module('app-web', ['ngRoute', 'ngCookies', 'ui.bootstrap']);

//Constantes
var addr = "http://localhost:8080";
var views = "views/";
var Busqueda = "";

app.config(function($routeProvider){
	$routeProvider
		.when("/", {
			templateUrl: views + "logIn.html",
			controller: "LogInController"
		})

        .when("/log", {
            templateUrl: views + "logIn.html",
            controller: "LogInController"
        })
        .when("/sign", {
            templateUrl: views + "signUp.html",
            controller: "SignUpController"
        })

        .when("/perfil", {
            templateUrl: views + "perfil.html",
            controller: "PerfilController"
        })

        .when("/comparar", {
            templateUrl: views + "comparar.html",
            controller: "CompararController"
        });
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

	$scope.Buscar= function(){
	    Busqueda = $scope.busqueda;
	    $location.path("/buscar");
	    console.log(Busqueda);
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
    };

}]);

app.controller("SignUpController", ['$scope','$window','$http', "$cookies", "$cookieStore", "$location", function($scope,$window, $http,$cookies, $cookieStore,$location){

    $scope.user = {};
    $scope.status=true;

	$scope.update = function(user){
        if (user.pass == user.repass){
            if (user.male != null){
                user.gender=true;
            }else{
                user.gender=false;
            }
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

app.controller("PerfilController",['$scope','$http', '$cookies',function($scope, $http, $cookies){
	var send = {username: $cookies.get('username')};
	$scope.info = {};

	//Receive data comments
	$http.post(addr + "/datos", send)
		.success(function(data){
		$scope.info = data;
		    if(data.gender){
		        $scope.info.gender="Male";
		    }else{
		        $scope.info.gender="Female";
		    }

    });
}]);

app.controller("CompararController", ['$scope', "$cookies", '$cookieStore', '$http', function($scope, $cookies, $cookieStore, $http){

    $scope.product1 = {};
    $scope.product2 = {};
    $scope.noSearch1 = true;
    $scope.noSearch2 = true;

    $scope.Buscar1 = function() {
        $scope.product1.id = $scope.busqueda1;
        console.log($scope.product1);
        $http.post(addr + '/comparar', $scope.product1)
        .success(function(data){
            console.log(data);
            $scope.noSearch1 = false;
            $scope.result1 = data;
        })
        .error(function(data){
            alert("El producto no pudo encontrarse");
        })
    };

    $scope.Buscar2 = function() {
        $scope.product2.id = $scope.busqueda2;
        console.log($scope.product2);
        $http.post(addr + '/comparar', $scope.product2)
        .success(function(data){
            console.log(data);
            $scope.noSearch2 = false;
            $scope.result2 = data;
        })
        .error(function(data){
            alert("El producto no pudo encontrarse");
        })
    };

}]);
