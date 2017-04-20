mui.init();
var selfWeb = null;
var loading = document.getElementById("usercenter-loading");
var content = document.getElementById("usercenter-content");
var navList = document.getElementById('nav_list');
var sliderGroup = document.getElementById('slider_group');
var detailView = document.getElementById('info');
var info_page = document.getElementById("scroll_wrapper_0");
var activeUid = 0; //记录当前用户的uid
var navListView = document.getElementById('nav_list');
var $weibo_support, userBoardInfo;
var navLibs = {
	weibo: 'weibo',
	question: 'question',
	news: 'news'
}; //本地已经处理的看板,没有的则不予显示

//配置ajax请求参数
var weiboInfo = {
	type: 'user',
	uid: 0,
	page: 0
};
var sbInfo = {
	page: 0
};
var newsInfo = {
	page: 0
};
var ucWeb = null;

//添加滑动页面
function add_slider_group(modName) {
	var div = document.createElement('div');
	div.id = 'item_' + modName;
	div.className = 'mui-slider-item mui-control-content';
	div.innerHTML =
		'<div class="mui-scroll-wrapper">' +
		'<div class="mui-scroll">' +
		'<ul id="' + modName + '" class="mui-table-view"></ul>' +
		'</div></div>'
	return div;
}

/*用户更改事件*/
window.addEventListener('usercenterChange', function(event) {
	var tmpUid = event.detail.data;
	var loginUid = is_login();
	if(tmpUid != activeUid) {
		refresh(tmpUid);
		app.getUserInfo(tmpUid, function(res) {
			if(res.code == 200) {
				var render = template.compile(usercenter_main_script);
				detailView.innerHTML = render(res.data);
				document.getElementById('follow_btn').style.visibility = is_login() == activeUid ? 'hidden' : 'visible';
			} else {
				toast.info(res.info);
			}
			//渲染资料容器数据
			res.data.qq = (loginUid==tmpUid)&&!!(res.data.expand_info.qq)?res.data.expand_info.qq.data:'***';
			res.data.email = loginUid==tmpUid?res.data.email:'***';
			res.data.mobile = '***';
			info_page.innerHTML = render_html(res.data, 'usercenter_info_script');
			changePage(loading, content, false);
		});
	} else {
		changePage(loading, content, false);
	}
})

mui.plusReady(function() {
	mui.previewImage();
	selfWeb = plus.webview.currentWebview();
	ucWeb = selfWeb;
	selfWeb.addEventListener('hide', function(e) {
		changePage(loading, content, true);
	})
	$weibo_support = creat_weibo_support('weibo_support');

	//导航栏标签
	userBoardInfo = app.getConfig('account').user_board;
	for(var i in userBoardInfo) {
		if(userBoardInfo[i]['data-id'] == 'enable') {
			userBoardInfo = userBoardInfo[i].items;
		}
	}
	for(var index in userBoardInfo) {
		var navInfo = userBoardInfo[index];
		var navName = navInfo['data-id'].toLowerCase(); //对比本地已有的导航栏,过滤多余的
		if(navLibs[navName]) {
			var navItem = document.createElement('a');
			navItem.innerHTML = userBoardInfo[index]['title'];
			navItem.className = 'mui-control-item';
			navItem.setAttribute('href', '#item_' + navName);
			navItem.setAttribute('data-type', navName);
			navItem.id = 'nav_' + navName;
			navList.appendChild(navItem);
			//为每一个导航标签添加与之相配的页面
			sliderGroup.appendChild(add_slider_group(navName));
		}
	}
	//滑动阻尼系数
	mui('.mui-scroll-wrapper').scroll({
		deceleration: mui.os.ios ? 0.003 : 0.0009,
		bounce: false
	});

	var append_child_li = function(data, type, listView) {
		for(var index in data) {
			var tmpInfo = data[index];
			var li = append_child_li_get(tmpInfo, type);
			listView.appendChild(li);
		}
	}

	var append_child_li_get = function(info, type) {
		switch(type) {
			case 'weibo':
				{
					info.is_top = 0; //隐藏置顶微博的tips
					var li = get_weibo_li(info);
					return li;
				}
				break;
			case 'question':
				{
					var li = get_question_li(info);
					return li;
				}
				break;
			case 'news':
				{
					var li = get_news_li(info);
					return li;
				}
				break;
		}
	}

	function add_datalist_down(listView, callback) {
		var tmpType = listView.getAttribute('id');
		switch(tmpType) {
			case 'weibo':
				weiboInfo.uid = activeUid;
				weiboInfo.page = 1;
				weibo.getWeiboList(weiboInfo, function(res) {
					listView.innerHTML = "";
					append_child_li(res.data, 'weibo', listView);
					$weibo_support.bindSupport();
					callback();
				});
				break;
			case 'news':
				newsInfo.uid = activeUid;
				newsInfo.page = 1;
				news.getPersonNews(newsInfo, function(res) {
					listView.innerHTML = "";
					append_child_li(res.data, 'news', listView);
					callback();
				})
				break;
			case 'question':
				sbInfo.uid = activeUid;
				sbInfo.page = 1;
				question.getSbQuestion(sbInfo, function(res) {
					listView.innerHTML = "";
					append_child_li(res.data, 'question', listView);
					callback();
				})
				break;
		}
	}
	//根据index值判断当前页面
	function add_datalist_up(listView, callback) {
		var tmpType = listView.getAttribute('id');
		switch(tmpType) {
			case 'weibo':
				weiboInfo.uid = activeUid;
				weiboInfo.page++;
				weibo.getWeiboList(weiboInfo, function(res) {
					append_child_li(res.data, 'weibo', listView);
					$weibo_support.bindSupport();
					callback(res.data);
				});
				break;
			case 'news':
				newsInfo.uid = activeUid;
				newsInfo.page++;
				news.getPersonNews(newsInfo, function(res) {
					append_child_li(res.data, 'news', listView);
					callback(res.data);
				})
				break;
			case 'question':

				sbInfo.uid = activeUid;
				sbInfo.page++;
				question.getSbQuestion(sbInfo, function(res) {
					append_child_li(res.data, 'question', listView);
					callback(res.data);
				})
				break;
		}
	}
	

	/*初始化每个容器的上下拉动作*/
	mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
		mui(pullRefreshEl).pullToRefresh({
			down: {
				callback: function() {
					var self = this;
					var selfListView = pullRefreshEl.getElementsByClassName('mui-table-view')[0];
					add_datalist_down(selfListView, function(res) {
						self.endPullDownToRefresh();
						self.refresh(true);
					});
				}
			},
			up: {
				callback: function() {
					var self = this;
					var selfListView = pullRefreshEl.getElementsByClassName('mui-table-view')[0];
					add_datalist_up(selfListView, function(res) {
						self.endPullUpToRefresh(res ? false : true);
					});
				}
			}
		});
	});
});

//重置数据
function refresh(tmpUid) {
	activeUid = tmpUid;
	weiboInfo.page = 0;
	weiboInfo.uid = tmpUid;
	sbInfo.page = 0;
	newsInfo.page = 0;
	mui('.mui-slider').slider().gotoItem(0);
	var listViews = mui('.mui-scroll .mui-table-view');
	for(var i = 0; i < listViews.length; i++) {
		listViews[i].innerHTML = "";
	}
}

//关注||取消关注事件
mui('#info').on('tap', '.follow-btn', function(event) {
	$this = this;
	var flag = $this.firstElementChild.innerText;
	if(flag == '未关注') {
		var uid = activeUid;
		ucenter.following(uid, function(res) {
			if(res.code == 200) {
				toast.info('关注成功');
				$this.firstElementChild.innerHTML = "已关注";
				$this.firstElementChild.setAttribute('background', '#29b6f6');
				$this.firstElementChild.setAttribute('class', 'icon-checkmark');
			} else if(res.info == 'open_id错误') {
				toast.info('未登录');
			} else {
				toast.info(res.info);
			}
		})
	} else if(flag == '已关注') {
		ucenter.unFollowing(uid, function(res) {
			if(res.code == 200) {
				toast.info('取消关注成功');
				$this.firstElementChild.innerHTML = "未关注";
				$this.firstElementChild.setAttribute('background', '#d59c2d');
				$this.firstElementChild.setAttribute('class', 'icon-plus');
			} else {
				toast.info(res.info);
			}
		})
	} else {
		toast.info('无法关注自己');
	}
})

//事件集
weibo.ext_weibo_listener('.mui-content');
mui('.mui-content').on('tap', '.news-item', function(e) {
	var info = this.detail_info;
	webtools.openDtlWeb('news', info.id);
}, false)
mui('.mui-content').on('tap', '.question-item', function(e) {
		var info = this.detail_info;
		webtools.openDtlWeb('question', info.id);
	}, false)
	//监听导航条的滚动事件
document.querySelector('.mui-slider').addEventListener('slide', function(event) {
	var listViews = mui('.mui-scroll .mui-table-view');
	var index = event.detail.slideNumber;
	if(index > 0) {
		index--;
		if(listViews[index].children.length == 0) {
			pullRefreshView = listViews[index].parentNode;
			mui(pullRefreshView).pullToRefresh().pullUpLoading();
		}
	}
})

window.addEventListener('usercenter-changeImg',function(event){
	var uid=event.detail.uid;
	if(event.detail.change)
	{
		app.getUserInfo(uid, function(res) {
			if(res.code == 200) {
				var render = template.compile(usercenter_main_script);
				detailView.innerHTML = render(res.data);
				document.getElementById('follow_btn').style.visibility = is_login() == activeUid ? 'hidden' : 'visible';
			} else {
				toast.info(res.info);
			}
			//渲染资料容器数据
			info_page.innerHTML = render_html(res.data, 'usercenter_info_script');
			changePage(loading, content, false);
		});
	}
})