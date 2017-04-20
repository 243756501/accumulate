/*弹出菜单单选模板*/
var com_render_html = function(info,name){
	var rander = template.compile(eval('com_' + name));
	var html = rander(info);
	return html;
}
var com_pop_radio = '<a data-id="{{id}}" class="mui-navigate-right">{{title}}</a><p class="score-amount">{{amount}}</p>';
