mui.init();

var dom = {
	hisBtn: mui('#hisGambleBtn')[0], //历史期数按钮
	gamRes: mui('#gambleResult')[0], //总的押注结果容器
	gamList: mui('#gambleList')[0], //近期中奖会员列表
	gamBtn: mui('#gambleBtn')[0], //押注按钮
	gamMine: mui('#mineGam')[0], //我的押注信息
	gamMine_loaded: mui('#item2_loaded')[0], //我的投注信息登录
	gamMine_unload: mui('#item2_unload')[0], //我的投注信息未登录
	countInfo: mui('#count_info')[0], //计时提示信息
	countTime: mui('#count_time')[0], //计时倒数
	countNum: 1, //计时器计数初值
	time_count: null, //计时器对象
	time_type: null, //当前计时类型，0未开始，1进行中
}
var LasRewInfo = {
	'page': 1
}
var PerGamInfo = {}
var tool = {
	//刷新页面数据
	refreshPage:function(){
		mui('.mui-scroll').pullToRefresh().pullDownLoading();
	},
	//计时器清理
	clearcountInteval:function(){
		dom.countNum=0;
		dom.countTime.innerHTML="00:00";
		clearInterval(dom.time_count);
	},
	//计时器
	countInteval: function(time, key,distance) {
		if(key) {
			dom.time_count = setInterval(function() {
				var dvalue = time - dom.countNum;
				dom.countTime.innerHTML = apptools.timeToStr(dvalue);
				dom.countNum++;
				if(dvalue == 0) //到点了如果竞猜是结束状态就向服务端请求次数据，如果不是就计2小时
				{
					
					tool.clearcountInteval();
					if(dom.time_type==0)
					{
						tool.countInteval(distance,true);
						dom.time_type=1;
					}
					else
					{
						tool.getLatest();
					}
				}
			}, 1000);
		} else {
			tool.clearcountInteval();
		}
	},
	//改变当前计时提示信息
	changeCountState: function(now, start,distance) {
		if(now > start) {
			dom.countInfo.innerText = "本期竞猜进行中";
			var detime = distance-parseInt(now) + parseInt(start);
			if(detime<0)
			{
				tool.clearcountInteval();
				dom.countInfo.innerText="当前无竞猜进行";
				return;
			}
			dom.countTime.innerHTML = apptools.timeToStr(detime);
			dom.time_type = 1;
			tool.countInteval(detime, true,distance);
		} else {
			dom.countInfo.innerText = "距离下期竞猜";
			var detime = parseInt(start) - parseInt(now);
			dom.countTime.innerHTML = apptools.timeToStr(detime);
			dom.time_type = 0;
			tool.countInteval(detime, true,distance);
		}
	},
	//获取最新一期时间
	getLatest: function() {
		tool.clearcountInteval();
		gamble.getGamLatest(function(res) {
			if(res.data) {
				myStorage.setItem('gamble_latest',res.data);
				var gamble_start = res.data.create_time;
				var gamble_end=res.data.prize_time;
				var gamble_distance=gamble_end-gamble_start;
				var timestamp = new  Date().getTime() / 1000;
				tool.changeCountState(timestamp, gamble_start,gamble_distance);
			}
			else
			{
				if(dom.time_count)
				{
					tool.clearcountInteval();
				}
				dom.countInfo.innerText="当前无竞猜进行";
			}
		})
	},
	//清理页面
	clearAll: function() {
		dom.gamRes.innerHTML = "";
		dom.gamList.innerHTML = "";
		dom.gamMine.innerHTML = "";
	},
	creatResItem: function(data) {
		var div = document.createElement('div');
		div.className = "gamble-result-item";
		div.innerHTML = template('gamble_allRes_script', data);
		return div;
	},
	//获取当前押注
	getAllRes: function() {
		gamble.getGamResult(function(res) {
			if(res.data) {
				for(i in res.data) {
					var gamResItem = tool.creatResItem(res.data[i]);
					dom.gamRes.appendChild(gamResItem);
				}
			}
		})
	},
	creatRewItem: function(data) {
		var li = document.createElement('li');
		li.className = "gamble-li-item mui-table-view-cell";
		li.innerHTML = template('gamble_reward_script', data);
		li.uid = data.uid;
		return li;
	},
	//获取当前用户的押注信息
	getPerGamble: function() {
		if(is_login()) {
			var uid = myStorage.getItem('uid');
			PerGamInfo.id = uid;
			gamble.getPerGamble(PerGamInfo, function(res) {
				if(res.data) {
					for(i in res.data) {
						var PerGamItem = tool.creatResItem(res.data[i]);
						dom.gamMine.appendChild(PerGamItem);
					}
				}
			})
			is_login() == 1 ? changePage(dom.gamMine_loaded, dom.gamMine_unload, true) : changePage(dom.gamMine_loaded, dom.gamMine_unload, false);
		}
	}
}
var initEvent = function() {
	dom.hisBtn.addEventListener('tap', function() {
		webtools.createRptWeb('gamble-history', function(wb) {
			wb.show('pop-in', 100);
		})
	});
	window.addEventListener('userChange', function(e) {
		var islogin = e.detail.data;
		islogin == true ? changePage(dom.gamMine_loaded, dom.gamMine_unload, true) : changePage(dom.gamMine_loaded, dom.gamMine_unload, false);
	});
	dom.gamBtn.addEventListener('tap', function() {
		webtools.openSingleWeb('../../gamble/view/gamble-gam');
	});
	/*注册和登陆*/
	mui('#join_view').on('tap', 'button', function(e) {
		var target = '../../account/view/' + this.id;
		webtools.openSingleWeb(target, '', 'zoom-fade-out');
	}, false);
}
mui.plusReady(function() {
	initEvent();
	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005
	});
	mui('.mui-scroll').pullToRefresh({
		up: {
			callback: function() {
				var pullObj = this;
				LasRewInfo.page++;
				gamble.getLatestReward(LasRewInfo, function(res) {
					if(res.data) {
						for(i in res.data) {
							var li = tool.creatRewItem(res.data[i]);
							dom.gamList.appendChild(li);
							res.data.length < 10 ? pullObj.endPullUpToRefresh(true) : pullObj.endPullUpToRefresh(false);
						}
					} else {
						pullObj.endPullUpToRefresh(true);
					}
				})
			}
		},
		down: {
			callback: function() {
				var pullObj = this;
				tool.clearAll();
				tool.getAllRes();
				tool.getPerGamble();
				tool.getLatest();
				LasRewInfo.page = 1;
				gamble.getLatestReward(LasRewInfo, function(res) {
					if(res.data) {
						for(i in res.data) {
							var li = tool.creatRewItem(res.data[i]);
							dom.gamList.appendChild(li);
							pullObj.endPullDownToRefresh();
							pullObj.refresh();
							res.data.length < 10 ? pullObj.endPullUpToRefresh(true) : pullObj.endPullUpToRefresh(false);
						}
					} else {
						pullObj.endPullDownToRefresh();
						pullObj.endPullUpToRefresh(true);
					}
				})
			}
		}
	});
	mui('.mui-scroll').pullToRefresh().pullDownLoading();
})