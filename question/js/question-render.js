/**
 * 模板渲染
 * @param {Object} info
 * @param {String} tmplName 模板名称
 */
var render_html = function(info,tmplName){
	template.config('escape', false);
	var rander = template.compile(eval(tmplName));
	var html = rander(info);
	return html;
}

//问答列表item
var question_item ='<p class="question-title mui-ellipsis-2">{{title}}</p><div class="mui-pull-left mui-text-center">'+
'<img class="user-header" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}">'+
'<p class="answer-count">{{answer_num}}</p></div><div class="mui-media-body">'+
'<div style="line-height: 25px;"><span class="create-time">{{create_time}}</span>'+
'<i style="color: green;" class="mui-icon {{if best_answer > 0}}mui-icon-checkmarkempty{{else}}mui-icon-help{{/if}} mui-pull-right"></i>'+
'</div><div><p class="question-content mui-ellipsis-2">{{description}}</p></div></div>';

//用户信息
var question_user = '<img id="user_head" data-uid="{{user.uid}}" class="user-flag mui-pull-left user-header" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}"/>'+
'<div class="mui-media-body"><span id="user_name">{{user.nickname}}</span>{{if user.rank_link != null}}'+
'<div id="user_rank">{{each user.rank_link as value i}}{{if value.is_show == 1}}'+
'<span class="rank-label" style="background:{{value.label_bg}};color:{{value.label_color}}">{{value.label_content}}</span>'+
'{{/if}}{{/each}}</div>{{/if}}</div>';

//问题详情
var question_detail = '<div id="question_title" class="title">{{title}}</div><div id="user_mod" class="mui-table user-mod">'+
'<div class="app-table-cell mui-col-xs-2">'+
'<img id="user_head" data-uid="{{user.uid}}" class="user-flag user-header" src="../../images/default_avatar.jpg" onload="load(this)" data-src="{{user.avatar128}}"/>'+
'</div><div class="app-table-cell mui-col-xs-8"><div id="user_name" class="mui-ellipsis">{{user.nickname}}</div>'+
'{{if user.rank_link != null}}<div id="user_rank" class="mui-ellipsis">{{each user.rank_link as value i}}{{if value.is_show == 1}}'+
'<span class="rank-label" style="background:{{value.label_bg}};color:{{value.label_color}}">{{value.label_content}}</span>'+
'{{/if}}{{/each}}</div>{{/if}}</div><div class="app-table-cell mui-col-xs-2"><div class="mui-text-center">'+
'<img class="reward-tip" src="../../images/icon/score-reward.png"/><p id="score{{leixing}}" class="reward-num">{{score_num}}</p></div></div></div>'+
'<div class="content-view"><div id="question_detail" class="question-detail">{{description}}</div><p id="create_time" class="mui-text-right">创建时间：{{create_time}}</p></div>';

//答案item
var question_answer_item = '<img data-uid="{{user.uid}}" class="user-flag mui-pull-left user-header" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{user.avatar128}}"/>'+
'<div class="mui-media-body item-right"><span>{{user.nickname}}</span>{{if user.rank_link != null}}{{each user.rank_link as value i}}'+
'<span style="background: {{value.label_bg}};color: {{value.label_color}};" class="rank-label">{{value.label_content}}</span>{{/each}}{{/if}}'+
'<p class="answer-time">{{create_time}}</p><p id="answerContent" class="mui-ellipsis-2">{{content}}</p><div>'+
'<span class="answer-time mui-pull-right"><span class="icon-point-up" style="margin-right: 10px;"> {{support}}</span><span class="icon-point-down"> {{oppose}}</span></span></div></div>';

var get_question_li = function (question){
	question.create_time = apptools.fmtUnixTime(question.create_time);
    var li = document.createElement('li');
    li.className = 'mui-table-view-cell question-item mui-media mui-clearfix';
	li.setAttribute('data-type', 'question');
    li.detail_info = question;
    var html = render_html(question,'question_item');
    li.innerHTML = html;
    return li;
};

