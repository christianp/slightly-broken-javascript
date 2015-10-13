var runButton = document.getElementById('run');
var codeArea = document.getElementById('code');
var outputArea = document.getElementById('output');

function isConsoleLog(node){
  return node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'console' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'log';
}

function pretend_console() {
	console.log.apply(console,arguments);
	for(var i=0;i<arguments.length;i++) {
		outputArea.innerText += arguments[i]+' ';
	}
	outputArea.innerText += '\n';
}


function madArray(node) {
	if(isConsoleLog(node)) {
		node.update('pretend_console('+node.arguments.map(function(arg){return arg.source()}).join(', ')+')');
		return;
	}
	if(node.type=='MemberExpression' && node.computed) {
		node.oldLength = node.source().length;
		var objectLength = node.object.oldLength || node.object.source().length
		node.property.update(node.property.source()+'+'+objectLength);
	}
}

function run() {
	outputArea.innerText = '';
	var code = codeArea.value;
//	console.log(code);
	localStorage.code = code;
	var newCode = falafel(code,madArray).toString();
//	console.log(newCode);
	eval(newCode);
}

runButton.onclick = run;

if(localStorage && localStorage.code!==undefined) {
	codeArea.value = localStorage.code;
}
