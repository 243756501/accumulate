/**
 * Created by 駿濤(xit@ourstu.com) on 15-10-26.
 * modify by 泰伦  on 15-10-29.
 */

/*默认的导航栏加载模块是用于第一次安装程序调用,可以通过改变数组里open的状态来关闭或者打开模块*/
/*网站默认拥有的模块*/
var netMods = {
	Gamble:{name: 'gamble', adm_open:true, open:false, first_mod:false, image: '../../images/custom.png', title: '竞猜', des: '竞猜',href:'../../gamble/view/gamble-main.html',icon:'icon-feed3'},
    Weibo:{name: 'weibo', adm_open:true, open:false, first_mod:true, image: '../../images/weibo.png', title: '微博', des: '微博',href:'../../weibo/view/weibo-main.html',icon:'icon-leaf2'},
    Forum:{name: 'forum', adm_open:true, open:false, first_mod:false, image: '../../images/forum.png', title: '论坛', des: '论坛',href:'../../forum/view/forum-head.html',icon:'icon-feed22'},
    News:{name: 'news', adm_open:true, open:false, first_mod:false, image: '../../images/news.png', title: '资讯', des: '资讯',href:'../../news/view/news-main.html',icon:'icon-file-text2'},
    Event:{name: 'event', adm_open:true, open:false, first_mod:false, image: '../../images/event.png', title: '活动', des: '活动',href:'../../event/view/event-main.html',icon:'icon-flag2'},
    Question:{name: 'question', adm_open:true, open:false, first_mod:false, image: '../../images/question.png', title: '问答', des: '问答',href:'../../question/view/question-main.html',icon:'icon-question2'},
	People:{name: 'people', adm_open:true, open:false, first_mod:false, image: '../../images/people.png', title: '找人', des: '找人',href:'../../people/view/people-header.html',icon:'icon-search2'},
	Shop:{name: 'shop', adm_open:true, open:false, first_mod:false,image: '../../images/shop.png',title:'商城',des:'商城',href:'../../shop/view/shop-head.html',icon:'icon-cart'},
	Store:{name: 'store', adm_open:true, open:false, first_mod:false, image: '../../images/store.png', title: '微店', des: '微店',href:'../../store/view/store-main-head.html',icon:'icon-gift2'},
	Issue:{name: 'issue', adm_open:true, open:false, first_mod:false, image: '../../images/issue.png', title: '专辑', des: '专辑',href:'../../issue/view/issue-main.html',icon:'icon-newspaper'},
	Group:{name: 'group', adm_open:true, open:false, first_mod:false, image: '../../images/group.png', title: '群组', des: '群组',href:'../../group/view/group-index-head.html',icon:'icon-users'},
	Cat:{name: 'cat', adm_open:true, open:false, first_mod:false, image: '../../images/cat.png', title: '分类信息', des: '分类信息',href:'../../cat/view/cat-main.html',icon:'icon-feed3'},
	custom:{name: 'custom', adm_open:true, open:false, first_mod:false, image: '../../images/custom.png', title: '自定义', des: '自定义',href:'../../embed/view/embed-main.html',icon:'icon-feed3'},
};

/*APP特有的模块*/
var appMods = {
  	module:{name: 'module', adm_open:true, open:true, first_mod:false, image: '../../images/qq.png', title: '应用', des: '活动',href:'../../init/view/module-main.html',icon:'icon-paragraph-justify'},
  	im:{name: 'im', adm_open:true, open:true, first_mod:false, image: '../../images/qq.png', title: '会话', des: '会话',href:'../../ucenter/view/im-rongyun-main.html',icon:'icon-bubbles'},
    ucenter:{name: 'ucenter', adm_open:true, open:true, first_mod:false, image: '../../images/qq.png', title: '我', des: '问答',href:'../../ucenter/view/ucenter.html',icon:'icon-user2'}
};

//导航信息解析
var get_mod = function(navInfo){
	var resultInfo = {},modInfo;
	if(navInfo.name){
		modInfo = netMods[navInfo.name];
		resultInfo.name = modInfo.name;
	}else{
		resultInfo.name = navInfo.type + navInfo.id;
		modInfo = netMods[navInfo.type]
	}
	resultInfo.adm_open = modInfo.adm_open;
	resultInfo.first_mod = modInfo.first_mod;
	resultInfo.image = modInfo.image;
	resultInfo.href = modInfo.href;
	resultInfo.icon = modInfo.icon;
	resultInfo.type = navInfo.type;
	resultInfo.target = navInfo.target;
	resultInfo.url = navInfo.url;
	resultInfo.open = navInfo.open;
	resultInfo.title = navInfo.title;
	resultInfo.des = navInfo.remark;
	return resultInfo;
}

var openOutWeb = function(dataInfo){
	mui.openWindow({
		url:dataInfo.href,id:'embed-main',waiting:{autoShow: false},
		show:{duration: WEBTRANSTIME},extras:{data:dataInfo}
	})
}

var module_default = [
    ['weibo', 1],
    ['news', 0],
    ['event', 1],
    ['question', 1],
    ['forum', 1],
];


/*导航栏模板*/
var rander_nav = function(navInfo){
	var render = template.compile(nav);
	var navItem = document.createElement('a');
	navItem.id = 'nav_'+navInfo.name;
	navItem.className = 'mui-tab-item module-tab';
	navItem.detail_info = navInfo;
	navItem.innerHTML = render(navInfo);
	return navItem;
};
var nav ='<img class="nav-icon mui-icon" name="{{icon}}" src="../../images/{{icon}}.png"/>'+
	'{{if name == "im"}}<span id="im_bdg" class="message-point"></span>{{/if}}'+
	'<span class="mui-tab-label">{{title}}</span>';

var module = {
    _set: function (sort) {
        sort = sort || {};
        myStorage.setItem('$module_sort', JSON.stringify(sort));
    },
    _get: function () {
        var sort = myStorage.getItem('$module_sort') || "{}";
        return JSON.parse(sort);
    }
};


/*推送功能类型与标题的预设*/
var pushType = {
	os_send:'您的好友发布了一条新微博',
	os_reply:'您的微博有新回复',
	os_forward:'您的一条微博被转发',
	os_at:'有人在微博@你',
	os_w_support:'您获得了一个点赞'
};
