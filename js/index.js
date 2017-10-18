var socket = io.connect('http://localhost:8080');

var app = angular.module('myApp', []);

app.controller('HelloWorldController', ['$scope', function ($scope) {

    $scope.paramList = [];

    $scope.load = function (id) {
        let target = $.isNumeric(id) ? id : null;
        socket.emit("load", id);
    }
    $scope.update = function (id) {
        console.log(id);
        var map = $scope.paramList.filter(function (param) {
            return param.id === id;
        });

        socket.emit("update", {
            id: map[0].id,
            name: map[0].name,
            value: map[0].value,
        });

    }
    socket.on("list", function (res) {
        $scope.paramList = res.data;
        let tmpLength = res.data.length;
        $scope.paramList.push({
            id: tmpLength,
            isNew: true
        });
        $scope.$apply();
    });

    $scope.load();

}]);