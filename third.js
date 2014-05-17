var net = require('net'),async = require('async'),fs = require('fs');

var string = "";

var client = net.connect('./qmp-sock',function(){
	client.setTimeout(1200);
	client.write("{ 'execute': 'qmp_capabilities' }");
var arr = JSON.parse(fs.readFileSync('finalResult.json'));	

	async.eachSeries(arr,function(item, callback){
		setTimeout(function(){
			callback(null,client.write(dowrite(item.Task_Location,item.PPID_Location)));
		},200);
	},function(err){
		console.log(err);
	});
	client.on('timeout',function(){
		client.end();
	});
});

client.on('data',function(data){
	string+=data.toString();
	fs.writeFileSync('finalResult.json',string);
});

function dowrite(Task_Location,PPID_Location){	//get parent address' pointer +84+8
	var temp = Task_Location+84+8;
		name = Task_Location+300;
		pid = Task_Location+84;
		ppid = PPID_Location;
	var str = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/4cw " + name.toString() + "'}}" +
			  "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1dw "  + pid.toString() + "'}}" +
			  "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1dw "  + ppid.toString() + "'}}";
	return str;
}
