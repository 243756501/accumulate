mui.init({
	beforeback:function(){
		plus.webview.currentWebview().hide('pop-out');
		return false;
	}
});
			
var navList = document.getElementById('nav_list');
var sliderGroup = document.getElementById('slider_group');
var sendBtn = document.getElementById('sendQuestion');
var activeId = null;		//记录当前所在的分类id

//导航栏
var get_quetion_nav = function(navInfo){
	var navDom = document.createElement('a');
	navDom.className = 'mui-control-item';
	navDom.innerText = navInfo.title;
	navDom.setAttribute('href','#item_'+navInfo.id);
	navDom.setAttribute('data-type',navInfo.id);
	navDom.id = navInfo.id;
	return navDom;
}

//列表容器
var add_quetion_group = function(navInfo){
	var div = document.createElement('div');
	div.id = 'item_'+navInfo.id;
	div.className = 'mui-slider-item mui-control-content ';
	div.innerHTML = template('group_tplt',navInfo);
	return div;
}

var add_to_list = function(data,listView,page){
	listView.setAttribute('data-page',page);
	for (var index in data) {
		var li = get_question_li(data[index]);
		listView.appendChild(li);
	}
}

/*渲染导航栏*/
typeInfos = myStorage.getItem('question_type');
if(typeInfos){
	typeInfos = JSON.parse(typeInfos);
	for (var index in typeInfos) {
		var navInfo = typeInfos[index];
		navList.appendChild(get_quetion_nav(navInfo));
		sliderGroup.appendChild(add_quetion_group(navInfo));
	}
	mui('.mui-scroll-wrapper').scroll({
		deceleration:mui.os.ios?0.003:0.0009,
		bounce:false
	});
	/*初始化每个容器的上下拉动作*/
	mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
		mui(pullRefreshEl).pullToRefresh({
			down: {
                callback: function() {
    				var self = this;
					var selfList = pullRefreshEl.children[0];
					page = 1;
					var restInfo = {id:selfList.id,page:page};
					question.getQuestionList(restInfo, function(res) {
						if (res.data) {
							selfList.innerHTML = '';
							add_to_list(res.data,selfList,page);
	        				self.refresh(true);
						}
						self.endPullDownToRefresh();
					});
				}
            },
            up:{
            	auto:true,
            	callback:function() {
            		var self = this;
					var selfList = pullRefreshEl.children[0];
					var page = selfList.getAttribute('data-page');
					page++;
					var restInfo = {id:selfList.id,page:page};
					question.getQuestionList(restInfo, function(res) {
						if (res.data) {
							add_to_list(res.data,selfList,page);
						}
						self.endPullUpToRefresh(res.data?false:true);
					});
				}
            }
		});
	});
}

/* 提问投稿*/
question.goSendWeb(sendBtn);
/*列表项点击事件*/
mui('#slider_group').on('tap', 'li', function() {
	var questionId = this.detail_info.id;
	question.goDtWeb(questionId);
});
/*点击当前页面标题自动回到最顶部*/
mui('#nav_list').on('tap','a',function(e){
	var thisType = this.getAttribute('data-type')
	if(activeId == thisType){
		mui('#scroll_wrapper_' + thisType).scroll().scrollTo(0, 0);
	}
	activeId = thisType;
})