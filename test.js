var net = require('net'),
	fs = require('fs'),
	async = require('async');
	var client = net.connect('./qmp-sock',function(){
		client.write("{ 'execute': 'qmp_capabilities' }");
	var arr = JSON.parse(fs.readFileSync('OBJ.json'));
	// async.forEach(arr,function(arr,next){
	// 	console.log(arr.Name_Locationi);
	// 	var str = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1cw " + (arr.Name_Location).toString() + "'}}";
	// 	client.write(str);
	// 	next();
	// });
	
		// for (var i = 0; i < arr.length; i++) {
		// 	var str = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1cw " + (arr[i].Name_Location).toString() + "'}}";
		// 	client.write(str);
		// };
		//console.log(arr[0].Name_Location,arr[0].PID_Location);
		
		//console.log(str);
		//var tryy = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1cw 0xf603b814'}}"
		
	});


	client.on('data',function(data){
		console.log(data.toString());
		var dataToStr = data.toString();
		var fin = "";
		fin = cal_next(dataToStr);
		console.log(fin);
		fs.appendFileSync('name.json',fin);
	});


function cal_next(data){
	var helf_fin = data.split(":")[data.split(":").length-1];
	var fin = "";
	for (var i = 1; i < helf_fin.length-8; i++){
		fin += helf_fin[i];
	}
	return fin;
}


