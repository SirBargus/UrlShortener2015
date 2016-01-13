var angular = angular.module('app-web', ['ngRoute', 'ngCookies', 'ui.bootstrap']);

//Constantes
var addr = "http://localhost:8080";
var pages = "pages/";
//var Busqueda = "";

angular.config(function($routeProvider){
    $routeProvider
        .when("/", {
            //controller: "DashController",
            templateUrl: pages + "dashboard.html"
        })

        .when("/blank", {
            //controller: "LogInController",
            templateUrl: pages + "blank.html"
        })
        .when("/flot", {
            //controller: "PerfilController",
            templateUrl: pages + "flot.html"
        })
        .when("/forms", {
            //controller: "BuscarController"
            templateUrl: pages + "buscar.html"
        })

        .when("/grid", {
            //controller: "CompararController",
            templateUrl: pages + "comparar.html"
        })

        .when("/icons", {
            //controller: "MuestraCestaController",
            templateUrl: pages + "cesta.html"
        })

        .when("/morris", {
            templateUrl: pages + "morris.html"
        })
        .when("/notifications", {
            templateUrl: pages + "notifications.html"
        })
        .when("/panels", {
            templateUrl: pages + "panels-wells.html"
        })
        .when("/tables", {
            templateUrl: pages + "tables.html"
        })
        .when("/typography", {
            templateUrl: pages + "typogra.html"
        })
        .otherwise({ redirectTo: "/" });
});

//angular.controller("IndexController", ['$scope','$route',"$cookies", '$cookieStore','$location', function($scope,$route, $cookies,$cookieStore,$location){
//    $scope.user = {};
//    $scope.user.username = $cookies.get('username');
//    $route.reload();
//
//
//    //Función que comprueba si un usuario esta logead
//    $scope.notLogged = function() {
//        return angular.isUndefined($scope.user.username);
//    };
//
//    //Deslogeamos al usuario
//    $scope.logOut = function(){
//        $cookies.remove("username");
//        $scope.user.username= undefined;
//    };
//}]);
