mui.init();
mui('.mui-scroll-wrapper').scroll({
    bounce: false,
    indicators: true, //是否显示滚动条
});
var done = document.getElementById('done'),
	friendList = document.getElementById('at_freind_list'),
	loadView = document.getElementById('loading_page'),
	mainView = document.getElementById('pullrefresh'),
	searchBtn = document.getElementById('search_btn'),
	searchIpt = document.getElementById('search_ipt'),
	groupView = document.getElementById('group_view'),
	csBtn = document.getElementById('close_sech_btn');
	ssView = document.getElementById('search_result_view');
	sechListView = document.getElementById('sech_list_view');
var beforeWeb,thisWeb,uid = null;
var restInfo = {page:0,type:3};

mui.plusReady(function() {
	beforeWeb = plus.webview.getWebviewById('weibo-send');
	thisWeb = plus.webview.currentWebview();
	uid = is_login();
	restInfo.uid = uid;
	/*下拉刷新组件*/
    mui('.mui-scroll').pullToRefresh({
        down: {
            callback: function() {
            	changeState();
        		restInfo.page = 1;
    			var selfPull = this;
				ucenter.getUserList(restInfo, function(res) {
					if (res.code == 200 && res.data) {
						friendList.innerHTML = '';
						for (var index in res.data) {
							var li = get_friend_li(res.data[index]);
							friendList.appendChild(li);
						}
					}
					selfPull.refresh(res.data&&res.data.length>=10);
					selfPull.endPullDownToRefresh();
				});
            }
        },
        up: {
        	auto:true,
            callback: function() {
        		restInfo.page++;
        		var selfPull = this;
				ucenter.getUserList(restInfo, function(res) {
					if (res.code == 200 && res.data) {
						for (var index in res.data) {
							var li = get_friend_li(res.data[index]);
							friendList.appendChild(li);
						}
					}
					changePage(loadView,mainView,false);
        		selfPull.endPullUpToRefresh(!res.data||res.data.length<10);
				});
            }
        }
    });
});

//完成按钮功能
done.addEventListener('tap', function() {
	var checkboxArray = [].slice.call(groupView.querySelectorAll('input[type="checkbox"]'));
	var checkedValues = [];
	var checkedNames=[];
	checkboxArray.forEach(function(box) {
		if (box.checked) {
			checkedValues.push(box.getAttribute('data-uid'));
			checkedNames.push(box.getAttribute('data-name'));
		}
	});
	if (checkedValues.length > 0) {
		beforeWeb.evalJS('getfriend("' + checkedValues + '","' + checkedNames + '")');
		checkboxArray.forEach(function(box) {
			changeState();
			box.checked = false;
		});
		thisWeb.hide();
	}
}, false);

/*获取单个LI*/
var get_friend_li = function(friend) {
	var li = document.createElement('li');
	li.className = 'mui-table-view-cell mui-input-row mui-checkbox mui-left atfriend-li';
	li.friend_info = friend;
	li.innerHTML = template('friend_template', friend);
	return li;
};

//改变完成按钮的状态
var changeState = function(count){
	var value = count ? "完成(" + count + ")" : "完成";
	done.innerHTML = value;
	if (count) {
		if (done.classList.contains("mui-disabled")) {
			done.classList.remove("mui-disabled");
		}
	} else {
		if (!done.classList.contains("mui-disabled")) {
			done.classList.add("mui-disabled");
		}
	}
}

//如果有选中的值则按钮变成蓝色并显示选中的数目，如果没有则为灰色无法点击状态
mui('#group_view').on('change', 'input', function() {
	var count = groupView.querySelectorAll('input[type="checkbox"]:checked').length;
	changeState(count);
});



//搜索按钮功能
searchBtn.addEventListener('tap', function() {
	var values = searchIpt.value;
	if(!values.trim())return;
	people.getPeopleList({peopleId: 0,selectId: values}, function(res) {
		if (res.code == 200 && res.data) {
			sechListView.innerHTML = '';
			changePage(friendList,ssView,false);
			for (var index in res.data) {
				var li = get_friend_li(res.data[index]);
				sechListView.appendChild(li);
			}
		} else {
			mui.toast('查找失败');
		}
	})
});

//软键盘如果是打开状态则关闭
groupView.addEventListener('touchstart',function(e){
	loseFocus();
})

//关闭搜索结果栏
csBtn.addEventListener('tap',function(e){
	changePage(friendList,ssView,true);
	searchIpt.value = '';
})

//搜索栏获取焦点事件
function getFocus(x) {
	searchIpt.className = "diy-search";
	searchBtn.style.display = 'block';
}
//失去焦点事件
function loseFocus(x) {
	searchIpt.blur();
	searchIpt.className = "diy-search-before";
	searchBtn.style.display = 'none';
}