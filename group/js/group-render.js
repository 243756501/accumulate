var post_render = function(postInfo) {
	var post_type = 'base';
	if (postInfo.top_post) {
		post_type = 'top';
	}
	var rander = template.compile(eval(post_type + '_post'));
	var html = rander(postInfo);
	return html;
}

/*回复模板*/
var post_detail_render = function(commentInfo) {
	template.config('escape', false);
	var rander = template.compile(post_comment);
	var html = rander(commentInfo);
	return html;
}

/*回复模板*/
var comment_detail_render = function(commentInfo) {
	template.config('escape', false);
	var rander = template.compile(comment_info);
	var html = rander(commentInfo);
	return html;
}

/*楼中楼回复获取方法*/
var post_lzl_render = function(lzlCommentInfo) {
	var rander = template.compile(lzl_comment);
	var html = rander(lzlCommentInfo);
	return html;
}


/*普通帖子列表项模板*/
var base_post = '<div><p class="question-title mui-ellipsis-2"style="margin:5px 0px"><a>[{{forum.title}}] </a>{{title}}</p>' +
	'<div class="create-time mini-box"><span>{{create_time}}</span></div>' +
	'<div class="mini-box mui-text-right"><span style="margin-right: 1em;"><span>阅读</span>' +
	'<span class="count-style">{{view_count}}</span></span><span><span>回复</span><span class="count-style">{{reply_count}}</span></span></div></div></div>'

/*置顶帖子列表项模板*/
var top_post = '<div><p class="question-title mui-ellipsis-2"style="margin:5px 0px"><i class="mui-icon top-post">置顶</i><a>[{{forum.title}}] </a>{{title}}</p>' +
	'<div class="create-time mini-box"><span>{{create_time}}</span></div>' +
	'<div class="mini-box mui-text-right"><span style="margin-right: 1em;"><span>阅读</span>' +
	'<span class="count-style">{{view_count}}</span></span><span><span>回复</span><span class="count-style">{{reply_count}}</span></span></div></div></div>'

/*帖子评论模板*/
var post_comment = '<img class="forum-header mui-pull-left" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}"><div class="mui-media-body">{{user.nickname}}' +
	'{{if user.rank_link.length > 0}}{{each user.rank_link as value i}}<span style="background: {{value.label_bg}};color: {{value.label_color}};" class="rank-label">{{value.title}}</span>{{/each}}{{/if}}' +
	'{{if is_landlord == 1}}<span class="louzhu-text">楼主</span>{{/if}}<span id="report_group_comment"style="font-size:12px;margin-right:18px;float:right">举报</span><p style="font-size: 12px;" class="mui-ellipsis"><span style="margin-right: 8px;">' +
	'{{floor}}</span><span>{{create_time}}</span><span id="floor_reply_btn" class="mui-table-view-cell floor-reply">回复</span></p>' +
	'<div class="post-content">{{content}}</div><ul id="{{id}}"{{if lzl_reply_count > 0}}style="display: block;"{{else}}style="display: none;"{{/if}} class="lzl-comment-list">{{each toReplyList as value i}}' +
	'<li id="{{value.id}}" class="lzl-comment"><span class="mui-ellipsis-3"><a style="margin-right: 5px;">{{value.user.nickname}}</a>' +
	'{{if value.is_landlord == 1}}<span class="louzhu-text">楼主</span>{{/if}}' +
	'<span>：</span><span class="lzl_content">{{value.content.parseContent()}}</span></span><span style="font-size: 10px;">{{value.ctime}}</span>' +
	'</li>{{/each}}</ul><div id="more_btn_{{id}}" lzl-count="{{lzl_reply_count}}" class="more-btn" style="font-size: 12px;text-align: right;color: #007aff;display: {{if lzl_reply_count > 3}}block">更多{{lzl_reply_count-3}}条回复{{else}}none">暂无更多回复{{/if}}</div></div>'

/*渲染回复内容模板*/
var comment_info = '<img class="forum-header mui-pull-left" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}"><div class="mui-media-body">{{user.nickname}}' +
	'{{if user.rank_link.length > 0}}{{each user.rank_link as value i}}<span style="background: {{value.label_bg}};color: {{value.label_color}};" class="rank-label">{{value.title}}</span>{{/each}}{{/if}}' +
	'{{if is_landlord == 1}}<span class="louzhu-text">楼主</span>{{/if}}<p style="font-size: 12px;" class="mui-ellipsis"><span style="margin-right: 8px;">' +
	'{{floor}}</span><span>{{create_time}}</span><span id="floor_reply_btn" class="mui-table-view-cell floor-reply">回复</span></p>' +
	'<p class="post-content">{{content}}</p><ul id="{{id}}" class="lzl-comment-list"></ul>' +
	'<div id="more_btn_{{id}}" lzl-count="{{lzl_reply_count}}" class="more-btn" style="font-size: 12px;text-align: right;color: #007aff;display: {{if lzl_reply_count > 3}}block">更多{{lzl_reply_count-3}}条回复{{else}}none">暂无更多回复{{/if}}</div></div>'

/*帖子楼中楼模板模板*/
var lzl_comment = '<span class="mui-ellipsis-3"><a style="margin-right: 5px;">{{user.nickname}}</a>' +
	'{{if is_landlord == 1}}<span class="louzhu-text">楼主</span>{{/if}}<span>：</span><span class="lzl_content">{{content.parseContent()}}</span></span><span style="font-size: 10px;">{{ctime}}</span>'

var parse_group_html = function(type, info) {
	template.config('escape', true);
	var doIt = template.compile(type);
	var html = doIt(info);
	return html;
}
var my_group = '<div>' +
	'<img src="../../images/icon.jpg" data-src="{{logo}}" onload="load(this)" class="group-img" />' +
	'<div class="mui-media-body" style="padding-left: 15px;">' +
	'<p class="mui-ellipsis group-item-title" style="margin-bottom: 8px;">{{title}}</p>' +
	'<p class="group-item-content" style="height:42px">{{detail}}</p>' +
	'<span class="group-span" style="padding-top:0px;display:inline;float:left;">帖子:{{post_count}}</span>' +
	'<span class="group-span" style="padding-top:0px;display:inline;float:right;">成员:{{member_count}}</span>' +
	'</div>' +
	'</div>';

var menu = '<li id="{{0}}" class="mui-table-view-cell"><a class="mui-navigate-right">全部群组</a></li>' +
	'{{each data as value i }}' +
	'<li id="{{data[i].id}}"  class="mui-table-view-cell"><a class="mui-navigate-right">{{data[i].title}}</a></li>' +
	'{{if data[i].GroupSecond != null}}' +
	'{{each data[i].GroupSecond as value j}}' +
	'<li id="{{data[i].GroupSecond[j].id}}" class="mui-table-view-cell" style="padding-left:25px"><a  class="mui-navigate-right">{{data[i].GroupSecond[j].title}}</a></li>' +
	'{{/each}}' +
	'{{/if}}' +
	'{{/each}}';