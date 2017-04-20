mui.init();

var selfWeb;
var headView = document.getElementById("header");
var navList = document.getElementById("nav_list");
var sliderGroup = document.getElementById("slider_group");

//导航
var get_nav = function(navInfo) {
	var navDom = document.createElement('a');
	navDom.className = 'mui-control-item';
	navDom.innerHTML = navInfo.title;
	navDom.setAttribute('href', '#item_' + navInfo.id);
	navDom.setAttribute('data-type', navInfo.id);
	navDom.setAttribute('data-pid', navInfo.pid);
	navDom.id = navInfo.id;
	return navDom;
}

//列表容器
var get_group = function(navInfo) {
	var div = document.createElement('div');
	div.id = 'item_' + navInfo.id;
	div.className = 'mui-slider-item mui-control-content';
	div.innerHTML = template('group_tplt', navInfo);
	return div;
}

var add_view = function(datas, listView, page) {
	listView.setAttribute('data-page', page);
	for(var index in datas) {
		var info = datas[index];
		var item = app.createListItem(info, 'mui-table-view-cell event-item mui-clearfix');
		item.innerHTML = parse_event_html(render,info);
		listView.appendChild(item);
	}
}
mui.plusReady(function () {
    selfWeb = plus.webview.currentWebview();
	//导航栏
	events.getEventClass(function(res) {
		if (res.code == 200 && res.data) {
			//存储以供发送页面使用
			myStorage.setItem('event_send_category',JSON.stringify(res.data));
			for(index in res.data) {
				var navInfo = res.data[index];
				navList.appendChild(get_nav(navInfo));
				sliderGroup.appendChild(get_group(navInfo));
			}
			mui('.mui-scroll-wrapper').scroll({bounce: false});
			mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
				mui(pullRefreshEl).pullToRefresh({
					down: {
						callback: function() {
							var self = this;
							var selfList = pullRefreshEl.children[0];
							page = 1;
							var restInfo = {
								type_id: selfList.id,
								page: page
							};
							events.getEventList(restInfo, function(res) {
								if(res.data) {
									selfList.innerHTML = '';
									add_view(res.data, selfList, page);
									self.refresh(res.data&&res.data.length>=10);
								}
								self.endPullDownToRefresh();
							});
						}
					},
					up: {
						callback: function() {
							var self = this;
							var selfList = pullRefreshEl.children[0];
							var page = selfList.getAttribute('data-page');
							page++;
							var restInfo = {
								type_id: selfList.id,
								page: page
							};
							events.getEventList(restInfo, function(res) {
								if(res.data) {
									add_view(res.data, selfList, page);
								}
								self.endPullUpToRefresh(!res.data||res.data.length<10);
							});
						}
					}
				});
			});
			mui('#scroll_wrapper_0 .mui-scroll').pullToRefresh().pullUpLoading();
		}else{
			toast.info(res.info);
		}
	});
})

headView.addEventListener('tap', function(e) {
	if(app.loginHandle()){
		var eventName = e.srcElement.getAttribute('data-event');
		if(eventName=='send'){
			webtools.openSingleWeb('send-event');
		}else if(eventName=='my_event'){
			webtools.openSingleWeb('event-my');
		}
	}
	return false;
}, false);
//监听导航条的滚动事件
document.querySelector('.mui-slider').addEventListener('slide', function(event) {
	var listViews = mui('.mui-scroll .mui-table-view');
	var index = event.detail.slideNumber;
	if(listViews[index].children.length == 0){
		mui(listViews[index].parentNode).pullToRefresh().pullUpLoading();
	}
})

window.addEventListener('userChange', function(event) {
	selfWeb.reload();
});

/**
 * 列表项目点击事件
 */
mui('#slider_group').on('tap', '.event-item', function(e) {
	var info = this.detail_info;
	webtools.openDtlWeb('event',info);
});

/**
 * 报名参加
 */
mui('#slider_group').on('tap', '.join', function(e) {
	var info = get_parent_node(this,'li').detail_info;
	webtools.openSingleWeb('join-event',info.id);
	return false;
});

mui('#slider_group').on('tap', '.unjoin', function(e) {
	toast.showLoading();
	var $this = this;
	var event_id = $this.getAttribute('event_id');
	var btnArray = ['残忍退出', '留下'];
	mui.confirm('您正在退出活动，确认？', '退出', btnArray, function(e) {
		if (e.index == 0) {
			events.quitEvent(event_id, function(res) {
				toast.hideLoading();
				if (res.code == 200) {
					$this.setAttribute('class', 'join event-join-state');
					$this.style.background = "#23abf0";
					$this.innerHTML = '我要报名';
					$this.nextSibling.style.display = 'none';
					$this.parentNode.parentNode.detail_info.is_Attend = 0;
				} else {
					toast.info(res.info);
				}
			});
		} else {
			toast.hideLoading();
		}
	})
	return false;
});
