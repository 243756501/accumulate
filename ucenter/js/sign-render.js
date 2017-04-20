var parse_sign_html = function(type,info){
	var doIt = template.compile(eval(type));
	var html = doIt(info);
	return html;
}

var today = '<div class="mui-col-xs-2 mui-pull-left" style="display: block;padding: 10px;">{{rank}}'+
		    	
			'</div>'+
			'<div class="mui-col-xs-6 mui-pull-left area" >'+
				'<img onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}" class="user-flag mui-pull-left avatar" data-uid="{{uid}}">'+
					'<p class="mui-ellipsis" style="padding: 10px 0 0 10px;">{{user.nickname}}</p>'+
			'</div>'+
			'<div class="mui-col-xs-4 mui-pull-right area">'+
				'<p class="mui-pull-right" style="padding: 10px 0 0 10px;">{{create_time}}</p>'+
			'</div>';

var total = '<div class="mui-col-xs-2 mui-pull-left" style="text-align: center;display: block;">'+
				'<img onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}" class="user-flag mui-pull-left avatar"  data-uid="{{uid}}">'+
			'</div>'+
			'<div class="mui-col-xs-6 mui-pull-left area">'+
				'<p class="mui-ellipsis">Top{{rank}}  {{user.nickname}}</p>'+
				'<p class="mui-ellipsis">累签{{total_check}}天</p>'+
			'</div>';
			
var con = '<div class="mui-col-xs-2 mui-pull-left" style="text-align: center;display: block;">'+
				'<img onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}" class="user-flag mui-pull-left avatar"  data-uid="{{uid}}">'+
			'</div>'+
			'<div class="mui-col-xs-6 mui-pull-left area">'+
				'<p class="mui-ellipsis">Top{{rank}}  {{user.nickname}}</p>'+
				'<p class="mui-ellipsis">连签{{con_check}}天</p>'+
			'</div>';

