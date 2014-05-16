var net = require('net'),async = require('async'),fs = require('fs');
var j=0;
var flag = 0; //determine which is orginal write
var anoflag = false;//try to wirte more info in one orginal write

var client = net.connect('./qmp-sock',function(){
	client.setTimeout(1200);
	client.write("{ 'execute': 'qmp_capabilities' }");
var arr = JSON.parse(fs.readFileSync('PPIDtry.json'));	

	async.eachSeries(arr,function(item, callback){
		setTimeout(function(){
			//console.log("dowrite",dowrite(item.Task_Location,item.PPID_Location));
			callback(null,client.write(dowrite(item.Task_Location,item.PPID_Location)));
		},200);
	},function(err){
		console.log(err);
	});
	client.on('timeout',function(){
		//console.log("timeout");
		client.end();
	});
});

client.on('data',function(data){
	// if(flag%2===0){
	// 	console.log("receive data",data.toString());
	// }
	fs.appendFile('finalResult.json',data.toString(), function (err) {
  			if (err) throw err;
	});

});

function dowrite(Task_Location,PPID_Location){	//get parent address' pointer +84+8
	var temp = Task_Location+84+8;
		name = Task_Location+300;
		pid = Task_Location+84;
		ppid = PPID_Location;
	var str = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1cg " + name.toString() + "'}}" +
			  "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1dw "  + pid.toString() + "'}}" +
			  "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1dw "  + ppid.toString() + "'}}";
	return str;
}
