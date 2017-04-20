var tap = 1;
var time = 0;
var time_count;
var voice_player, target_obj, positive_obj, positive_time, target_time, voice_time = null;
//语音播放事件
var voicePlayer = function(btn) {
		var voice_src = btn.getAttribute('voice-src');
		var id = btn.getAttribute('name');
		target_time = "voice_time_" + id;
		target_obj = "type_voice_" + id;
		if(tap == 1) {
			change_icon(true, target_obj);
			play_voice(true, voice_src);
			tap++
		} else {
			if(positive_obj!==target_obj)
			{
			play_voice(true,voice_src)
			change_icon(true,target_obj);
			}
			else
			{
			play_voice(false, voice_src)
			change_icon(false, target_obj);
			tap = 1;	
			}
		}
	}
	//播放语音，创建对象和判断对象
function play_voice(key, src) {
	//如果是不同的语音项则创建语音对象
	if(positive_obj !== target_obj) {
		if(time > 0) {
			change_target(positive_obj, positive_time);
		}
		voice_player = plus.audio.createPlayer(src);
		setTimeout(function() {
 		voice_time = voice_player.getDuration();
//			voice_time = 10;
		}, 1000)
	}
	if(key) {
		if(time > 0) {
			voice_player.resume();
			play_voice_time(true);
		} else {
			voice_player.play(function() {
				stop_voice_play(target_obj, target_time);
			}, function(err) {
				stop_voice_play(target_obj, target_time);
				mui.toast(err.message);
			});
			play_voice_time(true);
		}
	} else {
		voice_player.pause();
		play_voice_time(false);
	}
	//状态传递
	positive_obj = target_obj;
	positive_time = target_time;
}
//语音播放时间长度的处理
function play_voice_time(state) {
	if(state) {
		time_count = setInterval(function() {
			var time_left = Math.ceil(voice_time) - time;
			document.getElementById(target_time).innerHTML = apptools.timeToStr(time_left);
			time++;
		}, 1000)
	} else {
		clearInterval(time_count);
	}
}
//播放结束方法
function stop_voice_play(obj_icon, obj_time) {
	tap = 1;
	time = 0;
	//如果播放完成则清空对象
	voice_player.stop();
	voice_player = null;
	positive_obj = null;
	change_icon(false, obj_icon);
	clearInterval(time_count);
	time_count = null;
	document.getElementById(obj_time).innerHTML = "00:00";
}
//更换操作对象
function change_target(obj_icon, obj_time) {
	tap++;
	time = 0;
	voice_player.stop();
	voice_player = null;
	change_icon(false, obj_icon);
	clearInterval(time_count);
	time_count = null;
	document.getElementById(obj_time).innerHTML = "00:00";

}
//改变图标
function change_icon(key, obj) {
	if(key == true) {
		document.getElementById(obj).firstChild.classList.remove('icon-mic');
		document.getElementById(obj).firstChild.classList.add('icon-pause');
	} else {
		document.getElementById(obj).firstChild.classList.remove('icon-pause');
		document.getElementById(obj).firstChild.classList.add('icon-mic');
	}

}

var get_weibo_type = function(type){
	if(eval('typeof(type_' + type + ')') == 'undefined'){
		return eval('type_feed');
	}
	return eval('type_' + type);
}


var parse_weibo_html = function(weibo) {
	var long_weibo_render = function(weibo){
		if(weibo.type == 'long_weibo'){
			var richStr = weibo.long_weibo.long_content;
			weibo.cover = weibo.long_weibo.cover||apptools.getCover(richStr)[0];
			if(weibo.hideOperation==1){
				weibo.type = 'long_weibo_dtl';
				weibo.long_weibo.long_content = imgTools.getDtlContent(richStr);
			}
		}
	}
	template.config('escape', false)
	
	if(weibo.type == 'repost') {
		if(weibo.sourceWeibo.type == null) {
			weibo_type = template.compile(eval('type_null'));
		} else {
			var source = template.compile(get_weibo_type(weibo.sourceWeibo.type));
			long_weibo_render(weibo.sourceWeibo);
			weibo.sourceWeibo.fetchContent = source(weibo.sourceWeibo);
		}
	}
	long_weibo_render(weibo);

	var weibo_type = template.compile(get_weibo_type(weibo.type));
	//简单处理话题
	//Todo
	if(weibo.topic_info) {
		var topicText = '';
		for(var index in weibo.topic_info) {
			topicText = topicText +'<div class="base-topic-label">'+'#' + weibo.topic_info[index].name + '#'+'</div>';
		}
		var topicContent = template.compile(type_feed);
		var topicType=topicContent(weibo);
		weibo.content = topicText + topicType;
	}
	
	var html_type = weibo_type(weibo);
	var render = template.compile(base);
	weibo.fetchContent = html_type;
	var html = render(weibo);
	return html;
}
base = '{{if is_top == 1}}<img  class="top-tip-img" src="../../images/tips_icon/weibo_top.png"/>{{/if}}<div class="weibo-info-view">' +
	'<div class="weibo-info-view-top">' +
	'<img id="{{user.uid}}" data-uid="{{user.uid}}" class="user-flag avatar mui-pull-left" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}">' +
	'<div class="mui-media-body" style="padding: 5px">' +
	'<div class="weibo-item-top">' +
	'<span>{{user.nickname}}</span><div class="txt-xxs"><span class="time" style="color:#eec47f">{{create_time}}</span><span class="from">来自{{from}}</span></div></div></div>' +
	'{{if is_first==1}}<div class="first-send"></div>{{/if}}' +
	'{{if is_weibo_main}}<i class="mui-icon mui-icon-arrowdown arrow-weibo"></i>{{/if}}</div>' +
	'<div class="weibo_content">{{fetchContent}}</div></div>' +
	'<div class="weibo-alltrends-location">{{if geolocation}}<i class="mui-icon mui-icon-location"></i><span>{{geolocation.address}}</span>{{/if}}</div>'+
	'{{if hideOperation != 1 }}<div class="weibo-tool-view" row-id="{{id}}">' +
	'<div class="li-bottom-btn repostWeibo"><div class="bottom-btn"><i class="diy-icon icon-forward2"></i><span>{{repost_count}}</span></div></div>' +
	'<div class="replyWeibo li-bottom-btn"><div class="bottom-btn"><i class="diy-icon icon-bubble2"></i><span>{{comment_count}}</span></div></div>' +
	'<div class="weibo_support li-bottom-btn" row-id="{{id}}"><div class="bottom-btn"><i {{if is_support == 1}}style="color: red;" is_bind_event="{{is_support}}"{{/if}} class="diy-icon icon-heart">' +
	'</i><span>{{support_count}}</span></div></div></div>{{/if}}';

/*长微博列表模板*/
type_long_weibo = '<div class="title mui-ellipsis-2"><span class="base-tag-1">文章</span>{{long_weibo.title}}</div><div class="mui-card-content">'+
	'{{if long_weibo.cover}}<img class="long-cover" onload=load(this) src="../../images/mediaImages/df_big.png" data-src="{{cover}}"/>{{/if}}'+
	'<p class="base-ellipsis-4 base-content-1">{{content}}</p><div class="all-lab">查看全文</div></div>';
/*长微博详情模板*/
type_long_weibo_dtl = '<div class="title mui-ellipsis-2">{{long_weibo.title}}</div><div class="mui-card-content">'+
	'{{if long_weibo.cover}}<img class="long-cover" onload=load(this) src="../../images/mediaImages/df_big.png" data-src="{{long_weibo.cover}}" data-preview-src="{{long_weibo.cover}}" data-preview-group="{{2}}"/>{{/if}}'+
	'<p class="base-ellipsis-4 base-content-1">{{long_weibo.long_content}}</p></div>';

type_redbag = '<p class="weiboContent" id="weiboContent_{{id}}">{{content.parseContent()}}</p>' +
	'<div class="repost_content" style="background-color: #eee;padding: 5px 10px;">' +
	'<div style="font-size:13px;">来自网站的分享</div>' +
	'</div>';

type_video = '<p class="weiboContent" id="weiboContent_{{id}}">{{content.parseContent()}}</p>' +
	'<div class="repost_content" style="background-color: #eee;padding: 5px 10px;">' +
	'<div style="font-size:13px;">来自网站的视频分享</div>' +
	'</div>';

type_xiami = '<p class="weiboContent" id="weiboContent_{{id}}">{{content.parseContent()}}</p>' +
	'<div class="repost_content" style="background-color: #eee;padding: 5px 10px;">' +
	'<div class="music-view mui-media"><img class="mui-pull-left" onload="load(this)" src="../../images/mediaImages/weibo_df.png" data-src="{{data.cover}}" style="width: 5em;height: 5em;">' +
	'<div class="mui-media-body"><div data-weiboid="{{id}}" class="music-contro">' +
	'<img id="music_contro_{{id}}_{{data.id}}" data-music-id="{{data.id}}" src="../../images/mediaImages/play.png"/></div>' +
	'<div class="music-text-info"><div class="mui-ellipsis">{{data.title}} - {{data.author}}</div></div>' +
	'<div id="music_progres_{{id}}_{{data.id}}" class="music-progress"></div><audio id="{{id}}_{{data.id}}"></audio></div>' +
	'</div></div>';

type_null = '<p class="weiboContent" id="weiboContent_{{id}}">{{content.parseContent()}}</p>' +
	'<div class="repost_content" style="background-color: #eee;padding: 5px 10px;">' +
	'<div style="font-size:13px;">原微博已被删除</div>' +
	'</div>';

type_feed = '<p class="weiboContent" id="weiboContent_{{id}}">{{content.parseContent()}}</p>';

type_link = '<p class="weiboContent" id="weiboContent_{{id}}">{{content.parseContent()}}</p>' +
	'<div class="link-view" data-type="{{type}}" data-link="{{data.site_link}}">' +
	'<img class="mui-pull-left link-img" onload="load(this)" data-src="{{data.img}}" src="../../images/app-logo.png">' +
	'<div class="mui-media-body link-text-view"><div class="mui-ellipsis link-title">{{data.title}}' +
	'</div><p class="mui-ellipsis link-content">{{data.description||data.content}}</p></div></div>';

type_share = type_link;
type_repost = '<p class="weiboContent" id="weiboContent_{{id}}">{{content.parseContent()}}</p>' +
	'<div class="repost_content" style="background-color: #eee;padding: 5px 10px;">' +
	'<span style="font-size: 15px">@{{sourceWeibo.user.nickname}}：</span>' +
	'<div style="font-size:13px;">{{sourceWeibo.fetchContent}}</div>' +
	'</div>';

type_image = '<p class="weiboContent" id="weiboContent_{{id}}">{{content.parseContent()}}</p>' +
	'<div class="weibo-img-list">' +
	'{{if attach.image}}' +
	'<ul>' +
	'{{each attach.image.thumb as imageUrl i}}' +
	'<li>' +
	'<img onload="load(this)" src="../../images/mediaImages/weibo_df.png" data-src="{{imageUrl}}" data-preview-src="{{attach.image.ori[i]}}" data-preview-group="{{id}}" class="weibo-list-img-{{if image_count == 1}}one{{else}}more{{/if}}" />' +
	'</li>' +
	'{{/each}}' +
	'</ul>' +
	'{{/if}}' +
	'</div>';
type_voice = '<p class="weiboContent" id="weiboContent_{{id}}">{{content.parseContent()}}</p>' +
	'<div id="voice_box" class="weibo-content-voice">' +
	'<div id="type_voice_{{id}}" name="{{id}}" class="weibo-content-voice-btn" src="{{attach.voice}}" voice-src="">' +
	'<i class="voice-img icon-mic"></i></div>' +
	'<div class="weibo-content-time-show">' +
	'<span id="voice_time_{{id}}" class="voice-time">00:00</span></div></div>'

repost_view = '<a href="javascript:">' +
	'<img class="mui-media-object mui-pull-left module-icon" src="{{if image}} {{image.thumb[0]}}  {{else}} {{user.avatar128}} {{/if}}" style="width: 60px;height: 60px;">' +
	'<div class="mui-media-body" style="margin-left: 10px;float: left;width: 220px"><span>{{user.nickname}}</span>' +
	'<p class="mui-ellipsis-2">{{content.slice(0,30).parseContent()}}</p>' +
	'</div></a>';

weibo_comment = '<img id="{{user.uid}}" class="user-flag avatar mui-pull-left" data-uid="{{user.uid}}" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}">'+
	'<div class="mui-media-body"><i class="mui-icon mui-icon-chatbubble reply-btn"></i>' +
	'<p><span class="user-flag" data-uid="{{user.uid}}">{{user.nickname}}</span></p>' +
	'<div class="txt-xxs"><span class="time">{{create_time}}</span></div>' +
	'<p class="weibo-comment">{{content.parseContent()}}</p></div>';

weibo_support_list = '<img id="{{uid}}" class="user-flag mui-pull-left" data-uid="{{uid}}" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{avatar128}}">' +
	'<div class="mui-media-body" style="font-size:12px;">{{nickname||"匿名"}}</div>';

/*获取单个微博LI*/
var get_weibo_li = function(weibo, is_index) {
	var li = document.createElement('li');
	li.className = 'weibo-item mui-media';
	li.setAttribute('id', 'weibo_' + weibo.id);
	li.setAttribute('data-type', 'weibo');
	weibo.create_time = apptools.fmtUnixTime(weibo.create_time, true);
	li.detail_info = weibo;
	weibo.is_weibo_main = is_index || false;
	var html = parse_weibo_html(weibo);
	li.innerHTML = html;
	return li;
};



							
								
									
										
											
										
									
									
										
											
										
					