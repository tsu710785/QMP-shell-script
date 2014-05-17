#Cloud Security Assignment 1
=========


I use NodeJS in this assignment, but its asynchronous figure seems to make thing more complicated.

So I decide to seperate this task into 4 parts.
The first one `find_task&name&pid.js` is to find every task,name,pid location and store it.
The second one `find_ppid.js` is to find ppid for every task.
The third one `returnResult.js` is to print the original output from Qemu.
And the last one `Deal_str.js` extract the infomation we need and record it in the JSON file.

In order to make thing easily, I make a `MakeFile` including all files.
In linux, you only need to execute `make` instruction, and the thing will be done.
Following is my code, and I'll explain how I design.

I use the `net` module in NodeJS to implement the socket programming.

##find_task&name&pid.js
```
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
```
I also use `async` module to deal with the callback, making it return correctly.
`setTimeout()`and`callback()`is defined by this module.
`fs.writeFileSync()` writes data we want into JSON file.
```
function dowrite(Task_Location){	
	var temp = Task_Location+84+8;//get parent address' pointer +84+8
	var str = "{ 'execute':'human-monitor-command','arguments':{'command-line':'x/1dw " + temp.toString() + "'}}";
	return str;
}
```
This fuction is to add offset and make a request string.
`client.wirte()` sends data though socket and receives data by `client.on()`
```
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
```
Variable flag is to judge weather this respond we wants or not.
Because another callback will return though this.
We find that only the even counts response we want, so we use mod(餘數) to implement that.

```
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
```
`cal_next()`is to get string and `_obj()` is and array constructor.
##find_ppid.js
Basically this is very similiar with first one, and purpose of this is to find ppid for everyone.
**Cause we find ppid is the tast adress adds 92. And this will point to top of ppid's stackframe**
After find ppid, we also store it into the JSON we created a while ago.
```
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
```
##returnResult.js
First two only deal with JSON file. And now we have name, task, pid, ppid of every process.
And we can start talk with Android now.
We ask for those I mentioned above.
As same as the first two js, we also write the result into a JSON file.
```
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
```
##Deal_str.js
Final, we read the JSON we get at the thrid step, using a regular expression to make the infomation we want clearly and record the result in the `FinalResult.json`.
```
var fs = require('fs');
var arr = fs.readFileSync('finalResult.json').toString();
var FinalArr =[];
arr = arr.replace(/'/gi,"").replace(/\\r\\n/gi,"").replace(/(\{)(")(r)(e).*?:.*?(:)/gi,"").replace(/\\\\.*?(00)\"/gi,"").replace(/\"/gi,"").replace(/\s/gi,"").replace(/\}/gi,"\n");
var arr2 = arr.substring(98).split('\n');
for (var i = 0; i < arr2.length-1; i=i+3) {
	Process_Struct = new _obj(arr2[i],arr2[i+1],arr2[i+2]);
	FinalArr.push(Process_Struct);
};
fs.writeFileSync('finalResult.json',JSON.stringify(FinalArr));

function _obj(name,pid,ppid){
	this.name = name;
	this.pid = pid;
	this.ppid = ppid;
}
```
