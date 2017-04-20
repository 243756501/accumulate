/*消息模板渲染*/
var render_message = function(info,tpltName){
	template.config('escape', false);
	var rander = template.compile(eval(tpltName));
	var html = rander(info);
	return html;
}
//公告消息模板
var msg_announce = '<h5 class="announce-time">{{create_time}}</h5><div class="mui-card">'+
'<div class="mui-card-header">{{content.title}}</div><div class="mui-card-content">'+
'<div class="mui-card-content-inner"><div class="mui-text-center">{{if sample_img}}'+
'<img class="sample-img"onload="load(this)"data-src="{{sample_img}}"src="../../images/mediaImages/df_big.png"/>{{/if}}'+
'</div><div class="mui-ellipsis-2 announce-text">{{sample_content}}</div></div></div>'+
'<div class="mui-card-footer">查看详情<i class="mui-icon mui-navigate-right"></i></div></div>';
//微博动态消息模板
var msg_weibo = '<div class="top-view"><img data-uid="{{content.user.uid}}"onload="load(this)"data-src="{{content.user.avatar128}}"class="user-flag base-cir base-img-small mui-pull-left"src="../../images/default_avatar.jpg"><div class="mui-media-body msg-right"><div><span class="mui-ellipsis"style="">{{content.user.nickname}}</span><p class="base-text-small"><span class="small-left">{{create_time}}</span><span class="from">来自微博</span></p></div><p class="msg-weibo-reply-btn">回复</p></div></div>'+
'<div class="msg-content mui-ellipsis-3">{{content.content.keyword1}}</div><div class="msg-link-view"><img class="mui-pull-left base-img-mid"onload="load(this)"data-src="{{sample_img}}"src="../../images/app-logo.png"><div class="mui-media-body msg-right"><div class="mui-ellipsis">{{content.content.keyword2}}</div><p class="mui-ellipsis-2 msg-link-content">{{content.content.keyword3}}</p></div></div>';
//最简陋的通用消息模板
var msg_tplt = '<img class="base-img-small mui-pull-left user-flag"onload="load(this)" data-uid="{{content.user.uid}}" src="../../images/default_avatar.jpg"data-src="{{content.user.avatar128}}"><p class="mui-pull-right">{{create_time}}</p><div class="mui-media-body"><div class="mui-ellipsis-2">{{content.title}}</div><p class="mui-ellipsis base-content-1">{{content.content}}</p></div>';
