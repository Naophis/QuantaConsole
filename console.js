var fs = require('fs');
var serialPort = require("serialport");
var settings = require('./settings');
var io = require('socket.io').listen(8080);
var sp;
var globalScoket;
var msg = "";

io.set('heartbeat timeout', 5000);
io.set('heartbeat interval', 5000);

let firstConnect = true;
io.sockets.on('connection', function (socket) {
	globalScoket = socket;
	try {
		if (firstConnect) {
			sp = new serialPort.SerialPort("COM3", {
				baudrate: 230400,
				parser: serialPort.parsers.readline("\n")
			});
			firstConnect = false;
		}
	} catch (e) {
		console.log(e)
	}
	socket.on('disconnect', function () {
		sp.close(function () {
			log("closed");
			firstConnect = true;
		});
	});
	socket.on('mydisconnect', function () {
		sp.close(function () {
			log("closed");
			firstConnect = true;
		});
	});
	socket.on('myconnect', function () {
		if (firstConnect) {
			sp = new serialPort.SerialPort("COM3", {
				baudrate: 230400,
				parser: serialPort.parsers.readline("\n")
			});
			firstConnect = false;
		}
	});
	sp.on('data', function (data) {
		// if (globalScoket) {
		// 	globalScoket.emit('message', {
		// 		message: data
		// 	}, function (res) { });
		// }
		console.log("response = \t"+data);
	});
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
						console.log(`{${res.id}:${res.value}}`);
						sp.write(`{${res.id}:${res.value}}`, function () {});
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
		}
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