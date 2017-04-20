mui.init();
var title_btn = document.getElementById("weibo_alltrends_title");
var title_txt = document.getElementById("weibo_menu")
var popovers = document.getElementById("popover");
var menu_icon = document.getElementById("weibo_menu_icon");
var weiboList = document.getElementById('weiboList');
var weiboHeadWeb, $weibo_support = null;
var loading = document.getElementById('loading_page');
var mainview = document.getElementById('pullrefresh');
var drag = document.getElementById("draggable");
var alltrend_community = document.getElementById("alltrend_community");
var topShowBtn = document.getElementById('top_show_btn');
var weiboTopList = document.getElementById('weiboTopList');
var show = document.getElementById('showTop');
var hide = document.getElementById('hideTop');
var weiboStorage = {};
var key = 1;
//配置微博的ajax请求参数
var weiboInfo = {
	page: 0,
	type: 'all'
};
var weibo_class_info = {
	name: '全站微博',
	uri: 'all',
};
var weiboTopInfo = {
		type: 'top'
	}
	//刷新置顶微博
var add_top_weibo = function() {
	weibo.getWeiboList({
		type: 'top'
	}, function(res) {
		myStorage.setItem('weibo_top_cache', JSON.stringify(res.data));
		weiboTopList.innerHTML = '';
		add_weibo_li(res.data, weiboTopList);
	})
}
	//发表微博后添加到首位置
var add_weibo_to_list = function(weibo) {
	var li = get_weibo_li(weibo, true);
	weiboList.insertBefore(li, weiboList.childNodes[0]);
	$weibo_support.bindSupport();
};
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
});

mui.plusReady(function() {
	//获取置顶微博的缓存数据
	weiboStorage.top = myStorage.getItem('weibo_top_cache');
	if(weiboStorage.top) {
		topCache = JSON.parse(weiboStorage.top);
		add_weibo_li(topCache, weiboTopList);
		$weibo_support.bindSupport();
		changePage(loading, mainview, false);
	} else {
		add_top_weibo();
	}
	/*置顶微博的显示和隐藏*/
	topShowBtn.addEventListener("tap", function() {
		var status = show.style.display == "block";
		weiboTopList.style.display = status ? "block" : "none";
		changePage(hide, show, status);
	});
	mui('#pullrefresh').pullToRefresh({
		down: {
			callback: function() {
				weiboInfo.page = 1;
				var selfPull = this;
				weibo.getWeiboList(weiboInfo, function(res) {
					weiboList.innerHTML = '';
					add_weibo_li(res.data, weiboList);
					add_top_weibo();
					$weibo_support.bindSupport();
					//重置底部加载状态
					selfPull.refresh(res.data&&res.data.length>=10);
					selfPull.endPullDownToRefresh();

				})
			}
		},
		up: {
			auto: true,
			callback: function() {
				weiboInfo.page++;
				var selfPull = this;
				weibo.getWeiboList(weiboInfo, function(res) {
					add_weibo_li(res.data, weiboList);
					selfPull.endPullUpToRefresh(!res.data||res.data.length<10);
					$weibo_support.bindSupport();
					changePage(mainview, loading, true);
					drag.style.display = "block";
				});
			}
		}
	})

	weiboHeadWeb = plus.webview.getWebviewById('nav_weibo');
	weiboHeadWeb.addEventListener('hide', function(e) {
			pauseMusic();
		})
		// 初始化点赞
	$weibo_support = creat_weibo_support('weibo_support');
	mui.previewImage();
});
weibo.ext_weibo_listener('#pullrefresh');
title_btn.addEventListener('tap', function() {
	if(key == 1) {
		popovers.setAttribute('class', 'animated fadeInDown');
		menu_icon.setAttribute('class', 'mui-icon mui-icon-arrowup');
		document.getElementById("popover").style.display = "block";
		drag.style.display = "none";
		key++;
	} else {
		popovers.setAttribute('class', 'animated fadeOutUp');
		menu_icon.setAttribute('class', 'mui-icon mui-icon-arrowdown');
		mui('.mui-popover').popover('toggle', popovers);
		drag.style.display = "block";
		key = 1;
	}
})

//语音播放
mui('#pullrefresh').on('tap', '.weibo-content-voice-btn', function(event) {
	event.stopPropagation();
	voice_load(this);
})

var xiamiMusicObj = new XiamiMusicObj('#pullrefresh'); //实例化虾米音乐播放对象
//功能按钮
weibo.operation('#pullrefresh');
//点击头像进入个人主页
app.userListener();
linkUrl('#mui-scroll'); //打开外链网址
window.addEventListener('userChange', function(event) {
	mui('#pullrefresh').pullToRefresh().pullDownLoading();
	getUser_Community();
})
	// 初始化点赞
$weibo_support = creat_weibo_support('weibo_support');
//点击动画事件
tap_animation('draggable');
//启动滑动事件
dragging('#draggable');

var current_item = "all";
//popover状态监听
mui('#popover').on('tap', '.popover-weibo-item', function(event) {
	event.stopPropagation();
	var change_item = this.id;
	var title = this.getAttribute('name');
	title_txt.innerHTML = title;
	if(change_item !== current_item) {
		weiboInfo.type = change_item;
		current_item = change_item;
		mui.trigger(title_btn, 'tap');
		mui('#pullrefresh').pullToRefresh().pullDownLoading();
	}
})
	//监听tab切换事件时，隐藏popover
window.addEventListener('popover-hide', function(e) {
	var popover_key = e.detail.popover_key;
	var popover_className = popovers.getAttribute('class');
	if(popover_key && popover_className == 'animated fadeInDown') {
		mui.trigger(title_btn, 'tap')
	}
})

//popover隐藏方法，提高用户体验
popovers.addEventListener('tap', function(event) {
	//因为不清楚为什么event.stopPropagation();没有阻止事件冒泡，所以手动判断
	var tap_target = event.target.localName;
	if(tap_target !== 'div') return;
	mui.trigger(title_btn, 'tap');
})

var Info = {
		flag: "follow",
		page: "1"
	}
	//获取登录用户圈子信息，判断是否为登录的状态
getUser_Community();

function getUser_Community() {
	weibo.getCommunity(Info, function(res) {
		if(is_login() !== 0) {
			alltrend_community.innerHTML = "";
			for(var i in res.data) {
				var li = document.createElement('li');
				li.className = "mui-table-view-cell alltrend-community-li  mui-clearfix";
				li.detailInfo = res.data[i];
				li.setAttribute('id', 'community_' + res.data[i].id);
				var html = template('weibo_popover_community', res.data[i]);
				li.innerHTML = html;
				alltrend_community.appendChild(li);
			}
		}
	})
}
mui('#alltrend_community').on('tap', 'li', function(e) {
	var crowdInfo = this.detailInfo;
	webtools.createRptWeb('weibo-crowd-weibo', function(web) {
		mui.fire(web, 'crowdChange', {
			data: crowdInfo
		});
		web.show('pop-in', WEBTRANSTIME);
	})
})