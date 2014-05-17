var net = require('net'),async = require('async'),fs = require('fs');
var i=0;
var flag = 0; //determine which is orginal write
var arr = JSON.parse(fs.readFileSync('finalResult.json'));
var arr2 = [];

var client = net.connect('./qmp-sock',function(){
	client.setTimeout(1200);
	client.write("{ 'execute': 'qmp_capabilities' }");

	async.eachSeries(arr,function(item, callback){
		setTimeout(function(){
			//console.log("dowrite",dowrite(item.Task_Location));
			callback(null,client.write(dowrite(item.Task_Location)));
		},200);
		fs.writeFileSync('finalResult.json',JSON.stringify(arr2));

	},function(err){
		//console.log(err);
	});

	client.on('timeout',function(){
		//console.log("timeout");
		client.end();
	});

});


client.on('data',function(data){

	var dataToStr = data.toString();
		var fin = "";
		fin = cal_next(dataToStr);

		var fin_int_forppid = parseInt(fin);
		//console.log(fin);
		fin_int_forppid = fin_int_forppid+572;

	var str_PPID = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1dw " + fin_int_forppid.toString()+ "'}}";

	if(flag%2===1){
		arr.PPID_Location = fin_int_forppid;

		Process_Struct = new _obj(arr[i].Task_Location,arr[i].Name_Location,arr[i].PID_Location,fin_int_forppid);
		arr2.push(Process_Struct);

		i=i+1;
		client.write(str_PPID);
	}
	flag = flag +1;
	
});


function cal_next(data){
	var helf_fin = data.split(":")[data.split(":").length-1];
	var fin = "";
	for (var i = 1; i < helf_fin.length-8; i++){
		fin += helf_fin[i];
	}
	return fin;
}



function dowrite(Task_Location){	//get parent address' pointer +84+8
	var temp = Task_Location+84+8;
	var str = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1dw " + temp.toString() + "'}}";
	return str;
}

function _obj(task,name,pid,ppid){
	this.Task_Location = task;
	this.Name_Location = name;
	this.PID_Location = pid;
	this.PPID_Location = ppid;
}