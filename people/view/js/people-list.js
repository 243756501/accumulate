mui.init({
	pullRefresh: {
		container: "#refreshContainer", //下拉刷新容器标识
		down: {
			contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback: down_fresh //必选，刷新函数
		},
		up: {
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: up_fresh //必选，刷新函数
		}
	}
});
var numId;
var headWeb,selfWeb = null;
var mainView = document.getElementById('refreshContainer');
var userListView = document.getElementById('user_list_view');
var loadView = document.getElementById('loading_page');
var searchView = document.getElementById('search_view');
var searchListView = document.getElementById('sech_list_view');
var closeSechBtn = document.getElementById('close_sech_btn');
var allListView = document.getElementById('list_0');
var actObj = {listView:allListView,requestInfo:{peopleId:0,page:1}};		//当前活动角色列表对象

//获得一个people列表li
var get_people_li = function(peopleInfo) {
	var li = document.createElement('li');
	li.className = 'mui-table-view-cell';
	li.user_info = peopleInfo;
	var html = parse_people_html(peopleInfo,userItem);
	li.innerHTML = html;
	return li;
}

//h5+准备完毕
mui.plusReady(function(){
	selfWeb = plus.webview.currentWebview();
	headWeb = selfWeb.opener();//获取父页面
	setTimeout(function () {
        mui('#refreshContainer').pullRefresh().pulldownLoading();
    }, 500);
});

function down_fresh() {
	//获取当前下拉刷新的ul标识
	var tempUl = actObj.listView;
	if (mui.os.android) {
		mui('#refreshContainer').pullRefresh().enablePullupToRefresh();
	}
	actObj.requestInfo.page = 1;
	people.getPeopleList(actObj.requestInfo, function(res) {
		if (res.code == 200 && res.data) {
			tempUl.innerHTML = '';
			tempUl.setAttribute('data-page', 1);
			for (var index in res.data) {
				var li = get_people_li(res.data[index]);
				tempUl.appendChild(li);
			}
		} else {
			tempUl.innerHTML = '<div style="text-align: center;background: #EFEFF4;padding: 5em 0;">没有用户</div>';
			mui.toast(res.info);
		}
		changePage(loadView,mainView,false);
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
		//重置底部加载状态
		mui('#refreshContainer').pullRefresh().refresh(true);
	})
}

function up_fresh() {
	actObj.requestInfo.page++;
	//获取当前下拉刷新的ul标识
	var tempUl = actObj.listView;
	people.getPeopleList(actObj.requestInfo, function(res) {
		var length = res.data? res.data.length : 0;
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(length == 10 ? false : true);
		if (res.code == 200 && res.data) {
			for (var index in res.data) {
				var li = get_people_li(res.data[index]);
				tempUl.appendChild(li);
			}
		} else {
			actObj.requestInfo.page--;
			mui.toast(res.info);
		}
		tempUl.setAttribute('data-page',actObj.requestInfo.page);
	})
}

	//点击导航栏后传值过来或许数据
window.addEventListener('people', function(event) {
	var tmpId = event.detail.data;
	if('list_'+tmpId != actObj.listView.id && searchView.style.display != 'block'){
		mui('#refreshContainer').pullRefresh().refresh(true);
		actObj.listView.style.display = 'none';
		//新listview创建
		var tempList = document.getElementById('list_' + tmpId);
		if(!tempList){
			tempList = document.createElement('ul');
			tempList.className = 'mui-table-view mui-clearfix';
			tempList.id = 'list_' + tmpId;
			tempList.setAttribute('data-page', '1');
			userListView.appendChild(tempList);
		}
		tempList.style.display = 'block';
		actObj.requestInfo.peopleId = tmpId;
		actObj.requestInfo.page = parseInt(tempList.getAttribute('data-page'));
		actObj.listView = tempList;
		if(tempList.children.length == 0){
			changePage(loadView,mainView,true);
			mui('#refreshContainer').pullRefresh().pulldownLoading();
		}
	}else{
		window.scrollTo(0,0);
	}
});

//软键盘如果是打开状态则关闭
window.addEventListener('touchstart',function(e){
	headWeb.evalJS('loseFocus()');
})

//搜索操作
var search_people_list = function(value) {
	if(!value.trim()){
		return;
	}
	var waitView = plus.nativeUI.showWaiting();
	people.getPeopleList({peopleId:actObj.requestInfo.peopleId,selectId:value}, function(res) {
		waitView.close();
		if (res.code == 200 && res.data) {
			searchListView.innerHTML = '';
			changePage(searchView,actObj.listView,true);
			mui('#refreshContainer').pullRefresh().setStopped(true);
			mui('#refreshContainer').pullRefresh().disablePullupToRefresh();
			for (var index in res.data) {
				var li = get_people_li(res.data[index]);
				searchListView.appendChild(li);
			}
		} else {
			mui.toast('查找失败');
		}
	})
};

//关闭搜索结果栏
closeSechBtn.addEventListener('tap',function(e){
	changePage(searchView,actObj.listView,false);
	mui('#refreshContainer').pullRefresh().setStopped(false);
	mui('#refreshContainer').pullRefresh().enablePullupToRefresh();
})

//关注|取消关注事件
app.focusOn();

//点击头像进入个人主页。
app.userListener();