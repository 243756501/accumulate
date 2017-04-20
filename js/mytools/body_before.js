/**
 * 存放一些在标签属性上执行的函数
 */

/*限制数字类型input最大长度*/
var ipt_max_length = function(dom,length){
	var value = dom.value;
	if(value.length > length)
	dom.value = value.slice(0,length);
}
/*textarea自增和自减高度*/
var addself = function(textarea){
	window.activeobj = textarea;
	textarea.clock = setInterval(function(){
		activeobj.style.height = activeobj.scrollHeight + 'px';
	},20);
	textarea.onblur = function(){
		clearInterval(textarea.clock);
	}
}
