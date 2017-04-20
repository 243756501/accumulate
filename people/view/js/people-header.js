mui.init({
	subpages: [{
		url: 'people-list.html', //子页面HTML地址，支持本地地址和网络地址
		id: 'people-list', //子页面标志
		styles: {
			top: '145px',
			bottom: '0'
		}
	}]
});

var peopleTopNav = document.getElementById('people_top_nav');
var roundPeople = document.getElementById('neighborhood');
var searchView = document.getElementById('search_detail');
var searchBtn = document.getElementById('search_btn');
var navView = document.getElementById('slider');
var peopleId = 0;
var peopleListWeb = null;

mui.plusReady(function() {
	//获取找人角色列表
	people.getPeopleClass(function(res) {
		if (res.code == 200) {
			for (var index in res.data) {
				var peopleInfo = res.data[index];
				var nav_a = document.createElement('a');
				nav_a.className = 'mui-control-item';
				nav_a.innerText = peopleInfo.title;
				nav_a.setAttribute('data-id',peopleInfo['data-id']);
				peopleTopNav.appendChild(nav_a);
			}
			navView.style.visibility = 'visible';
		}else{
			toast.info(res.info);
		}
	});
	
});

/*导航栏点击事件*/
mui('#people_top_nav').on('tap', '.mui-control-item', function(event) {
	peopleId = this.getAttribute('data-id');
	if(!peopleListWeb){
		peopleListWeb = plus.webview.getWebviewById('people-list');
	}
	mui.fire(peopleListWeb, 'people', {data: peopleId});
})

/*软键盘上的开始按钮*/
window.addEventListener('keypress',function(event){
	if(event.keyCode == 13){
		mui.trigger(searchBtn,'tap');
	}
})

/*搜索按钮*/
searchBtn.addEventListener('tap',function(event) {
	var values = searchView.value;
	if(!peopleListWeb){
		peopleListWeb = plus.webview.getWebviewById('people-list');
	}
	peopleListWeb.evalJS('search_people_list("' + values + '")');
},false);


//input获取焦点事件
function getFocus(x) {
	searchView.className = "diy-search mui-input-clear";
	searchBtn.style.display = 'block';
}

//失去焦点事件
function loseFocus(x) {
	searchView.blur();
	searchBtn.style.display = 'none';
	searchView.value = '';
	searchView.className = "diy-search-before";
}

/*打开附近人页面*/
roundPeople.addEventListener('tap', function() {

	if (!is_login()) {
		toast.info('请先登录!');
		return;
	}

	var btnArray = ['确定', '取消'];
	mui.confirm('查看附近的人将获取你的位置信息，你的位置信息会被保留一段时间。', '提示', btnArray, function(e) {
		if (e.index == 0) {
			mui.openWindow({
				url: 'people-neighborhood-head.html',
				id: 'people-neighborhood-head',
				show: {
					aniShow: 'pop-in'
				}
			})
		}
	})
},false);