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