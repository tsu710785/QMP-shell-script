var net = require('net'),
	fs = require('fs');
var arr = [],i=0;
var client = net.connect('./qmp-sock',function(){
	client.write("{ 'execute': 'qmp_capabilities' }");

	var tryit = "0xc16a52fc";

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

	var PID=parseInt(fin)+84;

	

	if(fin!=="0xc16a52fc"){
		Process_Struct = new _obj(parseInt(fin),parseInt(fin)+300,parseInt(fin)+84,0);
		//console.log(arr);
		arr.push(Process_Struct);

		// fs.appendFile('OBJ.json',JSON.stringify(Process_Struct,null,2), function (err) {
	 //  		if (err) throw err;
		// });

		var str ="";
		str = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1xw " + fin + "'}}";
		//console.log(str);
		client.write(str);

	}
	else{
		fs.writeFileSync('OBJ.json',JSON.stringify(arr));
		client.end();
	}
	
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