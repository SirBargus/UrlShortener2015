var angular = angular.module('app-web', ['ngRoute', 'ngCookies', 'ui.bootstrap']);

//Constantes
var addr = "http://localhost:8080";
var views = "pages/";
var Busqueda = "";

angular.config(function($routeProvider){
    $routeProvider
        .when("/", {
            templateUrl: views + "dashboard.html",
            //controller: "DashController"
        })

        .when("/blank", {
            templateUrl: views + "blank.html",
            //controller: "LogInController"
        })
        .when("/flot", {
            templateUrl: views + "flot.html",
            //controller: "PerfilController"
        })
        .when("/forms", {
            templateUrl: views + "buscar.html",
            //controller: "BuscarController"
        })

        .when("/grid", {
            templateUrl: views + "comparar.html",
            //controller: "CompararController"
        })

        .when("/icons", {
            templateUrl: views + "cesta.html",
            //controller: "MuestraCestaController",
        })

        .when("/morris", {
            templateUrl: views + "morris.html"
        })
        .when("/notifications", {
            templateUrl: views + "notifications.html"
        })
        .when("/panels", {
            templateUrl: views + "panels-wells.html"
        })
        .when("/tables", {
            templateUrl: views + "tables.html"
        })
        .when("/typography", {
            templateUrl: views + "typogra.html"
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
