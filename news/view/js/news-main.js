mui.init();
var navList = document.getElementById("nav_list");
var slideGroup = document.getElementById("nm_slider_group");
var slideIndicator = document.getElementById("nm_slider_indicator");
var firstTopNav = document.getElementById('nav_list');
var positiveList = document.getElementById('news_0');
var news_refresh = document.getElementById('news_refresh');
var NewsWrite = document.getElementById("NewsWrite");
var popovers = document.getElementById("popover");
var shakeBtn = document.getElementById("shakeBtn");
var ShakeState = 0;
var targetList = null;
var pullObj = null;
var MAX = 30;
var shakeArray = [];
var shakeloadingKey = true;
var NewsPostInfo = {
	newsType: 0,
	page: 1
}
mui.plusReady(function() {

	var cw = plus.webview.currentWebview();
	/*loading的加载和显示*/
	var changePage = function(loading) {
			document.getElementById('loading_page').style.display = loading ? 'block' : 'none';
			document.getElementById('pullrefresh').style.display = loading ? 'none' : 'block';
		}
		/*添加数据*/
	var addDataToList = function(data) {
			var li = document.createElement('li');
			li.className = "mui-media mui-table-view-cell";
			li.detail_info = data;
			li.setAttribute('data-id', data.id);
			li.innerHTML = template('nm_listitem_script', data);
			return li;
		}
		/*获取数据*/
	var getNewsList = function() {
			news.getNewsList(NewsPostInfo, function(res) {
				if(res.data) {
					for(var index in res.data) {
						var li = addDataToList(res.data[index]);
						positiveList.appendChild(li);
						pushShakeArray(res.data[index].id);
					}
				} else {
					mui.toast(res.info);
				}
				changePage(false);
			});
		}
		/*添加随机推荐资讯id*/
	var pushShakeArray = function(dataId) {
			if(shakeArray.indexOf(dataId) == -1) {
				shakeArray.push(dataId);
			}
		}
		/*popovers状态判断*/
	var loadingStatusListener = function(callback) {
		if(popovers.style.display !== "none") {
			callback(true);
		} else {
			callback(false);
		}
	}

	getNewsList();
	//获取nav标签组,同时创建对应列表容器
	news.getNewsClass(0, function(res) {
		if(res.data !== null) {
			for(var i = 0; i < res.data.length; i++) {
				var a = document.createElement('a');
				var data = res.data[i];
				a.className = "mui-control-item";
				a.id = data.id;
				a.setAttribute('data-type', data)
				a.innerHTML = data.title;
				navList.appendChild(a);

				var ul = document.createElement('ul');
				ul.className = 'mui-table-view';
				ul.id = 'news_' + data.id;
				ul.setAttribute('data-page', 1);
				ul.style.display = 'none';
				document.getElementById('pullrefresh').appendChild(ul);
			}
		}
	});
	//获取热门资讯
	news.getRecommendNewsList(0, function(res) {
		if(res.data) {
			for(var i = 0; i < res.data.length; i++) {
				var div = document.createElement('div');
				div.className = "mui-slider-item";
				div.id = res.data[i].id;
				var html = template("hotNews_script", res.data[i]);
				div.innerHTML = html;
				slideGroup.appendChild(div);
				var div_Indicator = document.createElement('div');
				if(i == 0) {
					div_Indicator.className = "mui-indicator mui-active";
				} else {
					div_Indicator.className = "mui-indicator";
				}
				slideIndicator.appendChild(div_Indicator);
			}
			mui('#sliderImage').slider({
				interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
			});
		}
	});
	mui(news_refresh).pullToRefresh({
		down: {
			callback: function() {
				pullObj = this;
				NewsPostInfo.page = 1;
				positiveList.setAttribute('data-page', 1);
				news.getNewsList(NewsPostInfo, function(res) {
					if(res.data) {
						positiveList.innerHTML = "";
						for(var i = 0; i < res.data.length; i++) {
							var li = addDataToList(res.data[i]);
							positiveList.appendChild(li);
							pushShakeArray(res.data[i].id);
						}
						pullObj.endPullDownToRefresh();
						pullObj.refresh(true);
						pullObj.endPullUpToRefresh(false);
					} else {
						pullObj.endPullDownToRefresh();
						pullObj.refresh(false);
						pullObj.endPullUpToRefresh(true);
					}
				})

			}
		},
		up: {
			callback: function() {
				pullObj = this;
				NewsPostInfo.page = positiveList.getAttribute('data-page');
				news.getNewsList(NewsPostInfo, function(res) {
					if(res.data) {
						for(var i = 0; i < res.data.length; i++) {
							var li = addDataToList(res.data[i]);
							positiveList.appendChild(li);
							pushShakeArray(res.data[i].id);
						}
						NewsPostInfo.page++;
						positiveList.setAttribute('data-page', NewsPostInfo.page);
						pullObj.endPullUpToRefresh(false);
					} else {
						pullObj.endPullUpToRefresh(true);
					}
				});
			}
		}
	})
	shakeBtn.addEventListener('tap', function() {
			if(ShakeState == 0) {
				shakeBtn.src = "../../images/icon/icon-shake-end.png";
				ShakeState = 1;
				mui.toast('摇一摇功能关闭');
			} else {
				shakeBtn.src = "../../images/icon/icon-shake.png";
				ShakeState = 0;
				mui.toast('摇一摇功能开启')
			}
		})
		//添加列表项的点击事件
	mui('#pullrefresh').on('tap', 'li', function(event) {
		var newsInfo = this.detail_info;
		webtools.openDtlWeb('news', newsInfo.id);
	});

	mui('#nav_list').on('tap', 'a', function(e) {
		changePage(true);
		positiveList.style.display = 'none';
		mui('#scroll_wrapper').scroll().scrollTo(0, 0, 200);
		NewsPostInfo.newsType = this.id;
		targetList = document.getElementById("news_" + this.id);
		targetList.style.display = "block";
		positiveList = targetList;
		NewsPostInfo.page = 1;
		if(pullObj) {
			pullObj.refresh(true);
		}
		if(targetList.innerHTML == "") {
			getNewsList();
		} else {
			changePage(false);
		}
	});

	NewsWrite.addEventListener('tap', function() {
		if(app.loginHandle()) {
			webtools.openSingleWeb('send-news');
		}
	});
	//热门推荐点击事件
	mui('#nm_slider_group').on('tap', 'div', function(e) {
			var id = this.id;
			webtools.openDtlWeb('news', id);
		})
		//摇一摇推荐
	plus.accelerometer.watchAcceleration(function(success) {
		if(cw.isVisible()) {
			if((Math.abs(success.xAxis) + Math.abs(success.yAxis) + Math.abs(success.zAxis)) > MAX) {
				if(ShakeState == 0) {
					if(shakeloadingKey) {
						shakeloadingKey = false;
						plus.device.vibrate(500);
						var newsId = shakeArray[Math.floor(Math.random() * shakeArray.length)];
						mui('.mui-popover').popover('toggle');
						setTimeout(function() {
							loadingStatusListener(function(res) {
								if(res == true) {
									mui('.mui-popover').popover('toggle');
									webtools.openDtlWeb('news', newsId);
									shakeloadingKey = true;
								}
							});
						}, 2000);
					} else {
						mui.toast("亲，您慢点摇");
					}
				}
			}

		}
	}, function(error) {}, {
		frequency: 100
	});
})

//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('#scroll_wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});