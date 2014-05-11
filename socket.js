var net = require('net'),
	fs = require('fs'),
	asyns = require('async');

var client = net.connect('./qmp-sock',function(){
	client.write("{ 'execute': 'qmp_capabilities' }");
	client.write("{ 'execute': 'query-status' }");
	//init_task
	// client.write("{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1xw 0xc16a5114'}}");
	// //init_task name
	// client.write("{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1cw 0xc16a5428'}}");
	// //init_task pid
	// client.write("{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1dw 0xc16a5350'}}");
	// //init_task next task
	 // client.write("{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1xw 0xc16a52fc'}}");

	// //pid=1 task
	// client.write("{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1xw 0xc16a5318'}}");
	// client.write("{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1xw 0xf603bbb8'}}");
	// for(var i=0;i<=1000;i++){
	// // 	console.log(0xc16a52fc+i);
	// 	var temp = 0xf603b6e8+i;
	//  	var str = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1dw " + temp + "'}}";
	// 	client.write(str);
	// }
	var tryit = "0xc16a52fc";
	//pid1 locate 0xf603bbb8+84
	//pid1 name 0xf603bbb8 + 300
	
	var str ="";
	str = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1xw " + tryit + "'}}";
	// console.log(str);
	client.write(str);


});


client.on('data',function(data){
	//console.log(data.toString());
	var dataToStr = data.toString();
	var fin = "";
	fin = cal_next(dataToStr);
	// console.log("fin=" ,fin);
	var PID=parseInt(fin)+84;

	// var PID_str="";
	// PID_str = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1dw " + PID_str.toString() + "'}}";
	// console.log(PID_str);
	//client.write(PID_str);
	// var temptask = parseInt(fin).toString(16);
	// 	tempname = (parseInt(fin)+300).toString(16),
	// 	temppid = (parseInt(fin)+84).toString(16),
	// 	tempppid = (parseInt(fin)+224).toString(16);
	Process_Struct = new _obj(parseInt(fin),parseInt(fin)+300,parseInt(fin)+84,parseInt(fin)+224);
		
	fs.appendFile('OBJ.json',JSON.stringify(Process_Struct,null,2), function (err) {
  		if (err) throw err;
	});


	if(fin==="0xc16a52fc"){
		client.end();
	}

	var str ="";
	str = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1xw " + fin + "'}}";
	console.log(str);

	client.write(str);

});


function cal_next(data){
	var helf_fin = data.split(":")[data.split(":").length-1];
	var fin = "";
	for (var i = 1; i < helf_fin.length-8; i++){
		fin += helf_fin[i];
	}
	return fin;
}


function _obj(task,name,pid,ppid){
	this.Task_Location = task;
	this.Name_Location = name;
	this.PID_Location = pid;
	this.PPID_Location = ppid;
}