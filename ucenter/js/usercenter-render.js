//用户中心动态标签以上的script模板
usercenter_main_script = '<img class="info-bg-view" src="../../images/banan.jpg"/><div class="info-view">'+
'<img id="headimg" class="user-header mui-pull-left" onload="load(this)" src="../../images/default_avatar.jpg" data-src="{{avatar128}}"/>'+
'<div class="text-view"><div class="ucenter-name">{{nickname}}</div>'+
'<div id="follow_btn" class="follow-btn">{{if is_following}}<a style="background: #29b6f6;">'+
'<span class="icon-checkmark"></span>已关注</a>{{else}}<a id="self" style="background: #d59c2d;">'+
'<span class="icon-plus"></span>未关注</a>{{/if}}</div><div class="count"><div class="fans">'+
'<span>粉丝数</span><span>{{fans}}</span></div><div class="follows"><span>关注数</span><span>{{following}}</span>'+
'</div></div></div></div>';

//用户信息的script模板
usercenter_info_script = '<div class="user-info-page"><ul class="mui-table-view"><li class="info-nav">个人资料</li>' +
'<li class="mui-table-view-cell"><a>QQ号<span class="mui-pull-right">{{qq}}</span></a></li>' +
'<li class="mui-table-view-cell"><a>邮箱<span class="mui-pull-right">{{email||"***"}}</span></a></li>' +
'<li class="mui-table-view-cell"><span>个性签名</span><span class="mui-pull-right">{{if signature}}{{signature}}{{else}}该用户未设置个性签名{{/if}}</span></li></ul>' +
'<div class="table-part-line"></div><ul id="realinfo" class="mui-table-view">' +
'<li class="info-nav">拓展资料</li><li class="mui-table-view-cell"><a>手机号<span class="mui-pull-right">{{mobile}}</span></a></li>' +
'<li class="mui-table-view-cell"><a>住所<span class="mui-pull-right">{{province}}{{city}}{{district}}</span></a></li></ul></div>';