var parse_people_html = function(info,type){
	var render = template.compile(type);
	var html = render(info);
	return html;
}


var userItem = '<img onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{avatar128}}" data-uid="{{uid}}" class="user-flag mui-pull-left avatar">'+
'<div class="mui-media-body"><div class="mui-pull-left mui-col-xs-9"><div style="margin-right: 5px;float: left;">{{title}}</div>'+
'<div class="u-name mui-ellipsis">{{nickname}}</div><p style="white-space:nowrap">{{if rank_link}}{{each rank_link as value i}}{{if value.is_show == 1}}'+
'{{if !value.label_content}}<img class="rank-icon" src="{{value.logo_url}}"/>{{else}}'+
'<span class="label-badge rank-label" style="background:{{value.label_bg}} !important;color:{{value.label_color}} !important;font-size：15px">{{value.label_content}}</span>'+
'{{/if}}{{/if}}{{/each}}{{/if}}</p><div><p class="mui-ellipsis-2">{{if signature}}{{signature}}{{else}}该用户还没有个性签名！{{/if}}</p>'+
'<span>粉丝：{{fans}}</span> <span>关注：{{following}}</span></div></div><div data-follow="{{is_following?1:0}}" class="follow-btn mui-pull-left mui-col-xs-3">{{if !is_following}}'+
'<button style="color:#007AFF" class="li-btn"><span class="icon-user-plus"></span><div style="font-size: 12px;">加关注</div></button>{{else}}'+
'<button class="li-btn"><span class="icon-user-check"></span><div style="font-size: 12px;">已关注</div></button>{{/if}}</div></div>';

var near = '<img onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}" style="width: 50px;height: 50px;" data-uid="{{user.uid}}" class="mui-pull-left user-flag" />'+
	'<div class="mui-media-body">'+
		'<p class="mui-ellipsis event-title">{{user.nickname}} </p>'+
		'<p>{{distance}}米以内 &nbsp;&nbsp;'+
			'<a class="uid" uid="{{user.uid}}"></a>'+
		'</p>'+
	'</div>';
