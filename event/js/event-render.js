var parse_event_html = function(type,info){
	template.config('escape', true);
	var doIt = template.compile(type);
	var html = doIt(info);
	return html;
}

var render = '<img onload="load(this)" src="../../images/app-logo.png" data-src="{{cover_url.thumb}}" class="mui-pull-left event-logo" />'+
			'<div class="mui-media-body">'+
				'<div class="mui-ellipsis event-title">{{title}} </div>'+
				'<p>by &nbsp;&nbsp;<a class="uid" uid="{{user.uid}}">{{user.nickname}}</a></p>'+
				'<p>{{sTime}}----{{eTime}}</p>'+
				'<p>报名截止时间:{{deadline}}</p>'+
				'{{if is_deadline == 0}}'+
					'{{if is_Attend == 0}}'+
						'<div class="join event-join-state" event_id="{{id}}" style="background: #23abf0;">我要报名'+ 
                    	'</div>'+
                    '{{else}}'+
                    	'<div class="unjoin event-join-state" event_id="{{id}}" style="background: #848484;">取消报名</div>'+ 
                    	'{{if is_pass == 0}}'+
                    		'<span class="state">未审核'+
                    		'</span>'+
                    	'{{else}}'+
                    		'<span id="stateed" class="state">已审核'+
                    		'</span>'+
                    	'{{/if}}'+
                    '{{/if}}'+
				'{{else}}'+
					'<div class="event-join-state" style="background: #000;">报名已截止'+                      	
                    '</div>'+
                '{{/if}}'+
			'</div>';

var detail_render = '<img onload="load(this)" src="../../images/mediaImages/df_big.png" data-src="{{cover_url.ori}}" style="height: 300px;width: 100%;" data-preview-src=""/>'+
						'<div class="event-detail-type">{{type_title}}</div>'+
						'{{if is_end == 0}}'+
						'<div class="event-state" style="background: #d61f39;">正在进行'+ 
                    	'</div>'+
						'{{else}}'+
						'<div class="event-state" style="background: #000;">已结束'+                      	
                    	'</div>'+
                    	'{{/if}}'+
						'<p class="mui-ellipsis event-title">{{title}}</p>'+
						'<p data-uid="{{user.uid}}" class="user-flag">by &nbsp;&nbsp;<a>{{user.nickname}}</a></p>'+
						'<p>时间：{{sTime}}---{{eTime}}</p>'+
						'<p>报名截止时间：{{deadline}}</p>'+
						'<p>地址：{{address}}</p>'+
						'<p>人数限制：{{limitCount}}人        已报名 ：{{signCount}}人        已参加：{{attentionCount}}人</p>'+			
				'{{if is_deadline == 0}}'+
					'{{if is_Attend == 0}}'+
						'<div id="join1" class="join event-join-state-1" event_id="{{id}}" style="background: #23abf0;">我要报名'+ 
                    	'</div>'+
                    '{{else}}'+
                    	'<div class="unjoin event-join-state-1" event_id="{{id}}" style="background: #848484;">取消报名'+ 
                    	'</div>'+
                    '{{/if}}'+
				'{{else}}'+
					'<div class="event-join-state-1" style="background: #000;">报名已截止'+                      	
                    '</div>'+
                '{{/if}}'+
						'<p class="mui-ellipsis-2">简介:</p>'+
						'{{#explain}}';

var comment =   '<img class="avatar-image mui-pull-left user-flag" data-uid="{{user.uid}}" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}">'+
			    '<div class="mui-media-body">'+
					'<a class="u-name"><span>{{user.nickname}}</span></a>'+
					'<div class="item-minor txt-xxs txt-color-gr">'+
						'<span class="time">{{create_time}}</span>'+
					'</div>'+
					'<p class="news-comment" style="min-height: 13px;">{{content}}</p>'+
					'<div class="mui-text-right">'+
						'<button id="reply_btn" class="comment-li-btn mui-icon mui-icon-chatbubble"></button>'+
						'<button id="delete" class="comment-li-btn mui-icon mui-icon-trash"></button>'+
					'</div>'+
				'</div>';

var render_my = '<img onload="load(this)" src="../../images/app-logo.png" data-src="{{cover_url.thumb}}" class="mui-pull-left event-logo" />'+
			'<i class="mui-icon-extra mui-icon-extra-addpeople memb-btn"></i><div class="mui-media-body">'+
				'<div class="mui-ellipsis" style="width: 80%;">{{title}} </div>'+
				'<p>by &nbsp;&nbsp;<a class="uid" uid="{{user.uid}}">{{user.nickname}}</a></p>'+
				'<p>时间：{{sTime}}----{{eTime}}</p>'+
				'<p>报名截止时间:{{deadline}}</p>'+
				'{{if is_end == 0}}'+
					'<div class="close event-join-state" style="background: #000;">提前结束</div>'+
                '{{/if}}'+
                '<div class="delete event-join-state" style="background: #23abf0;margin-left: 5px;">删除活动</div>'+ 
			'</div>';