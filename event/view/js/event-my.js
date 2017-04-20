mui.init();

var selfWeb;

//获取单个item
var get_event_li = function(eventMsg,type) {
	var li = document.createElement('li');
	li.className = 'event-item mui-clearfix';
	li.detail_info = eventMsg;
	if (type == 'attend') {
		li.innerHTML = parse_event_html(render, eventMsg);
	} else {
		li.innerHTML = parse_event_html(render_my, eventMsg);
	}
	return li;
};

var add_view = function(datas, listView, page) {
	listView.setAttribute('data-page', page);
	for(var index in datas) {
		listView.appendChild(get_event_li(datas[index],listView.id));
	}
}

mui.plusReady(function () {
    selfWeb = plus.webview.currentWebview();
	mui('.mui-scroll-wrapper').scroll({bounce: false});
	mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
		mui(pullRefreshEl).pullToRefresh({
			down: {
				callback: function() {
					var self = this;
					var selfList = pullRefreshEl.children[0];
					page = 1;
					var restInfo = {page: 1,lora: selfList.id};
					events.myEvent(restInfo, function(res) {
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
				auto:true,
				callback: function() {
					var self = this;
					var selfList = pullRefreshEl.children[0];
					var page = selfList.getAttribute('data-page');
					page++;
					var restInfo = {page: page,lora: selfList.id};
					events.myEvent(restInfo, function(res) {
						if(res.data) {
							add_view(res.data, selfList, page);
						}
						self.endPullUpToRefresh(!res.data||res.data.length<10);
					});
				}
			}
		});
	});
});

mui('#slider_group').on('tap','li',function(e){
	var thisLi = this;
	var eventInfo = this.detail_info;
	var thisView = e.srcElement;
	if(thisView.classList.contains('unjoin')){
		var btnArray = ['退出', '取消'];
		mui.confirm('您正在退出活动，确认？', '退出', btnArray, function(e) {
			if (e.index == 0) {
				events.quitEvent(eventInfo.id, function(res) {
					toast.info(res.info);
					if (res.code == 200) {
						thisLi.remove();
					}
				});
			}
		})
	}else if(thisView.classList.contains('delete')){
		var btnArray = ['删除', '取消'];
		mui.confirm('您正在删除活动，确认？', '删除', btnArray, function(e) {
			if (e.index == 0) {
				events.deleteEvent(eventInfo.id, function(res) {
					toast.info(res.info);
					if (res.code == 200) {
						thisLi.remove();
					}
				})
			}
		})
	}else if(thisView.classList.contains('close')){
		var btnArray = ['关闭', '取消'];
		mui.confirm('您正在关闭活动，确认？', '关闭', btnArray, function(e) {
			if (e.index == 0) {
				events.closeEvent(eventInfo.id, function(res) {
					toast.info(res.info);
					if (res.code == 200) {
						thisView.style.display = 'none';
					}
				})
			}
		})
	}else if(thisView.classList.contains('memb-btn')){
		webtools.openSingleWeb('event-member',eventInfo);
	}else{
		webtools.openDtlWeb('event',eventInfo);
	}
})

app.reloadWeb();
