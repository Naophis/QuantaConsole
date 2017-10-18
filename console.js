var fs = require('fs');
var serialPort = require("serialport");
var settings = require('./settings');
var io = require('socket.io').listen(8080);
var sp;
var globalScoket;
var msg = "";

io.set('heartbeat timeout', 5000);
io.set('heartbeat interval', 5000);

io.sockets.on('connection', function (socket) {
	globalScoket = socket;
	let interval;
	// sp = new serialPort.SerialPort("COM7", {
	// 	baudrate: 230400,
	// 	parser: serialPort.parsers.readline("\n")
	// });
	// socket.on('disconnect', function () {
	// 	sp.close(function () {
	// 		log("closed");
	// 	});
	// 	clearInterval(interval);
	// });
	// sp.on('data', function (data) {
	// 	if (globalScoket) {
	// 		globalScoket.emit('message', {
	// 			message: data
	// 		}, function (res) { });
	// 	}
	// 	console.log(data);
	// });
	// interval = setInterval(function () {
	// 	sp.write('hello', function () {
	// 		console.log("send");
	// 	});
	// }, 1000);
	socket.on("update", function (res) {
		if (res) {
			readFile("output.json", function (json) {
				var savedDataList = JSON.parse(json).data;
				var head = true;

				for (var i = 0; i < savedDataList.length; i++) {
					if (savedDataList[i].id === res.id) {
						savedDataList[i] = res;
						var saveData = {
							data: savedDataList
						}
						head = false;
						writeFile("output.json", JSON.stringify(saveData, null, '\t'));
					}
				}
				if (head) {
					savedDataList.push(res);
					var saveData = {
						data: savedDataList
					}
					writeFile("output.json", JSON.stringify(saveData, null, '\t'));
				}
			});
		}
	});
	socket.on("load", function (data) {
		if (data === null) {
			readFile("output.json", function (data) {
				socket.emit('list', JSON.parse(data), function (res) {});
			});
		} else {

		}
		// console.log(data.target);
		// let key = data.target ? data.target : "10000";
		// let val = data.value; // data.value;
		// sp.write(`{${key}:${val}}`, function () {
		// 	console.log("send");
		// });
	});
});
//ファイル読み込み関数
function readFile(path, success) {
	fs.readFile(path, 'utf8', function (err, data) {
		if (err) {
			throw err;
		}
		success(data);
	});
}

function writeFile(path, data) {
	fs.writeFile(path, data, function (err) {
		if (err) {
			throw err;
		}
	});
}
log('server listening ...');

function log(data) {
	console.log(data);
}