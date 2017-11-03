var socket = io.connect('http://localhost:8080');

var app = angular.module('myApp', []);

app.controller('HelloWorldController', ['$scope', function ($scope) {

    $scope.paramList = [];

    $scope.load = function (id) {
        let target = $.isNumeric(id) ? id : null;
        socket.emit("load", id);
    }
    $scope.connect = function (id) {
        let target = $.isNumeric(id) ? id : null;
        socket.emit("load", id);
    }
    $scope.disconnect = function (id) {
        let target = $.isNumeric(id) ? id : null;
        socket.emit("disconnect", id);
    }

    $scope.connect = function () {
        socket.emit("myconnect");
    }

    $scope.disconnect = function () {
        socket.emit("mydisconnect");
    }
    $scope.update = function (id) {
        var map = $scope.paramList.filter(function (param) {
            return param.id === id;
        });
        if ($.isNumeric(map[0].value) &&
            !$.isNumeric(map[0].name &&
                typeof map[0].name === "string" &&
                map[0].name.length > 0)) {
            socket.emit("update", {
                id: map[0].id,
                name: map[0].name,
                value: map[0].value,
            });
            $.toast({
                text: "send",
                showHideTransition: 'slide', // It can be plain, fade or slide
                bgColor: 'blue', // Background color for toast
                textColor: '#eee', // text color
                allowToastClose: false, // Show the close button or not
                hideAfter: 1000, // `false` to make it sticky or time in miliseconds to hide after
                stack: 5, // `fakse` to show one stack at a time count showing the number of toasts that can be shown at once
                textAlign: 'center', // Alignment of text i.e. left, right, center
                position: 'top-center' // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values to position the toast on page
            });
        } else {
            $.toast({
                text: "invalid",
                showHideTransition: 'slide', // It can be plain, fade or slide
                bgColor: 'red', // Background color for toast
                textColor: '#eee', // text color
                allowToastClose: false, // Show the close button or not
                hideAfter: 1000, // `false` to make it sticky or time in miliseconds to hide after
                stack: 5, // `fakse` to show one stack at a time count showing the number of toasts that can be shown at once
                textAlign: 'center', // Alignment of text i.e. left, right, center
                position: 'top-center' // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values to position the toast on page
            });
        }

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