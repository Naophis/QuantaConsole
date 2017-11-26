var socket = io.connect('http://localhost:8080');

riot.compile(function () {

    route('/', function () {
        riot.mount('main', 'home');
    });
    route('/home', function () {
        riot.mount('main', 'home');
    });
    route('/home2', function () {
        riot.mount('main', 'home2');
    });
    route.start(true);

})