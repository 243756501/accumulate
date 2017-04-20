var render_html = function(info,tmplName){
	template.config('escape', false);
	var rander = template.compile(eval(tmplName));
	var html = rander(info);
	return html;
}
var news_item = '<img class="news-item-img mui-pull-left" onload="load(this)" src="../../images/app-logo.png" data-src="{{if !cover_url}}../../images/topicavatar.png{{else}}{{cover_url.thumb}}{{/if}}">'+
'<div class="mui-media-body"><div class="news-title mui-ellipsis">{{title}}'+
'</div><p style="min-height: 42px;" class="mui-ellipsis-2">{{description}}</p>'+
'</div><div class="news-bottom-list"><div class="mui-grid-view"><div class="mui-pull-left mui-col-xs-6">{{create_time}}</div>'+
'<div class="mui-pull-right mui-col-xs-6"><span class="mui-pull-right"><i class="icon-bubbles4"></i>{{comment}}</span>'+
'<span class="mui-pull-right" style="margin-right: 30px;"><i class="icon-fire"></i>{{view}}</span></div></div></div>';

//获得一个news列表li
var get_news_li = function(newsInfo) {
	var li = document.createElement('li');
	li.className = 'news-item mui-media';
	li.setAttribute('data-type', 'news');
	li.detail_info = newsInfo;
	li.setAttribute('data-id',newsInfo.id);
	var html = render_html(newsInfo,'news_item');
	li.innerHTML = html;
	return li;
};