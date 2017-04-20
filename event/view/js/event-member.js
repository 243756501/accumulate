mui.init({gestureConfig:{doubletap: true}});

var selfWeb,eventInfo;
var titleView = document.getElementById("title_view");
var popView = document.getElementById("mmb_pop");
var delBtn = document.getElementById("del_btn");
var joinView = document.getElementById("1");
var auditView = document.getElementById("0");
var attentionCount = document.getElementById("attention_count");
var auditTip = document.getElementById("audit_tip");

//参与人数
var setCount = function(count){
	count = count||0;
	eventInfo.attentionCount = eventInfo.attentionCount>0?eventInfo.attentionCount:0;
	count = count + parseInt(eventInfo.attentionCount);
	count = count<0?0:count;
	attentionCount.innerHTML = '('+ count+')';
}

//待审核提示图标
var setTip = function(){
	apptools.toggleDom(auditTip,auditView.children.length >0);
}

//获取单个item
var get_item = function(info) {
	var li = app.createListItem(info,'mui-table-view-cell');
	li.innerHTML = template('user_tpl',info);
	return li;
};

var add_view = function(datas, listView, page) {
	listView.setAttribute('data-page', page);
	for(var index in datas) {
		listView.appendChild(get_item(datas[index],listView.id));
	}
	if(listView.id!=1)setTip();
}

mui.plusReady(function () {
    selfWeb = plus.webview.currentWebview();
    eventInfo = selfWeb.data;
    titleView.innerHTML = eventInfo.title;
    setCount();
    
	mui('.mui-scroll-wrapper').scroll({bounce: false});
	mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
		mui(pullRefreshEl).pullToRefresh({
			down: {
				callback: function() {
					var self = this;
					var selfList = pullRefreshEl.children[0];
					page = 1;
					var restInfo = {page: 1,id:eventInfo.id,state: selfList.id};
					events.getJoinUsers(restInfo, function(res) {
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
					var restInfo = {page: page,id:eventInfo.id,state: selfList.id};
					events.getJoinUsers(restInfo, function(res) {
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
	var liView  = this;
	var tmpInfo = this.detail_info;
	var eventName = e.srcElement.getAttribute('data-event');
	if(eventName == 'check'){
		plus.nativeUI.actionSheet({
			title:"审核申请",
			cancel:"取消",
			buttons:[{title:"同意"},{title:"拒绝"}]
		}, function(e){
			var rstInfo = {id:eventInfo.id,uid:tmpInfo.user.uid};
			if(e.index > 0){
				rstInfo.flag = e.index == 1?1:0;
				events.auditMmb(rstInfo,function(res){
					toast.info(res.info);
					auditView.removeChild(liView);
					setTip();
					if(e.index == 1 && res.code == 200){
						setCount(1);
						mui('#scroll_wrapper_0 .mui-scroll').pullToRefresh().pullDownLoading();
					}
				})
			}
		});
	}else{
		popView.detail_info = tmpInfo;
		popView.innerHTML = template('pop_tpl',tmpInfo);
		mui("#mmb_pop").popover('toggle');
	}
})

//移除
mui('#mmb_pop').on('tap','#del_btn',function(e){
	var tmpInfo = get_parent_node(this,'.mmb-pop').detail_info;
	mui.confirm('是否取消【'+tmpInfo.user.nickname+'】的参加资格？','移除提示',['是', '否'],function(e){
		if(e.index == 0){
			mui("#mmb_pop").popover('toggle');
			var rstInfo= {id:eventInfo.id,uid:tmpInfo.user.uid};
			events.kickOut(rstInfo,function(res){
				toast.info(res.info);
				if(res.code == 200){
					setCount(-1);
					mui('#scroll_wrapper_0 .mui-scroll').pullToRefresh().pullDownLoading();
				}
			})
		}
	})
})

//双击tabbar回到顶部
mui('#slider_bar').on('doubletap','a',function(e){
	var str = this.getAttribute('href');
	mui(str+' .mui-scroll-wrapper').scroll().scrollTo(0,0,100);
})