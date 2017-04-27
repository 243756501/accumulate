mui.init({
	beforeback: function() {
		var wb = plus.webview.getWebviewById('nav_gamble');
		wb.evalJS('tool.refreshPage()');
	}
});
var dom = {
	unload: mui('#unload')[0], //加载页面
	load: mui('#loaded')[0], //主体页面
	gamCost: mui('#gamCost')[0], //需要消耗的总积分
	costPrice: mui('#costPrice')[0], //每注消耗积分数
	rechBtn: mui('#rechBtn')[0], //积分充值按钮
	exchBtn: mui('#exchBtn')[0], //积分商城按钮
	userInfo: mui('#userInfo')[0], //用户信息容器
	gamArea: mui('#gambleArea')[0], //押注区
	gamSubmit: mui('#gamSubmit')[0], //投注按钮
};
var postInfo = {}
var postGamInfo = {};
var tool = {
	//拉取数据
	refreshPage: function() {
		tool.pileUserInfo();
		tool.pileGamArea();
		changePage(dom.load, dom.unload, true);
	},
	//生成向服务器端发送数据的数组
	addDataToArray: function(key, value) {
		postGamInfo[key] = parseInt(value);
	},

	creatResItem: function(data) {
		var div = document.createElement('div');
		div.className = "gamble-result-item";
		div.id = data.id;
		div.innerHTML = template('gamble_area_item', data);
		return div;
	},
	//渲染押注区数据
	pileGamArea: function() {
		gamble.getGamType(function(res) {
			if(res.data) {
				for(i in res.data) {
					var div = tool.creatResItem(res.data[i]);
					dom.gamArea.appendChild(div);
				}
				mui('.mui-numbox').numbox();
			}
		})
	},
	//渲染用户信息
	pileUserInfo: function() {
		gamble.gamUserInfo(function(res) {
			dom.userInfo.innerHTML = template('gamble_userInfo_script', res.data);
			var gamConfig = myStorage.getItem('gamble_latest');
			dom.costPrice.innerHTML = gamConfig.unit_price;
			var scoreType = gamConfig.score_type;
			var systemCfg = app.getConfig('system');
			scoreTypes = systemCfg.score_list;
			for(var i in scoreTypes) {
				if(scoreTypes[i].id == scoreType) {
					mui('#scoreType')[0].innerHTML = scoreTypes[i].title;
				}
			}
		})
	}
};
var initEvent = function() {
	mui('body').on('tap', '.num-btn', function() {
		var timeNum = 0;
		mui.each(document.querySelectorAll('.mui-input-numbox'), function(index, item) {
			var itemValue = parseInt(item.value);
			if(itemValue < 0) {
				mui.toast('押注值不能小于0倍');
				item.value = 0;
				return;
			}
			timeNum = timeNum + itemValue;
			tool.addDataToArray(item.id, itemValue);
		})
		dom.gamCost.innerHTML = timeNum * (parseInt(dom.costPrice.innerHTML));
	});
	dom.exchBtn.addEventListener('tap', function() {
		webtools.openSingleWeb('../../shop/view/shop-head');
	});
	dom.rechBtn.addEventListener('tap', function() {
		webtools.openSingleWeb('../../ucenter/view/score')
	});
	window.addEventListener('userChange', function() {
		tool.pileUserInfo();
	});
	dom.gamSubmit.addEventListener('tap', function() {
		var hasScore = parseInt(('#scoreType')[0].innerHTML);
		var needScore = parseInt(dom.gamCost.innerHTML);
		if(hasScore < needScore) {
			mui.toast('您的积分不足！');
			return;
		}
		postInfo.gambleArray = postGamInfo;
		gamble.userGamble(postInfo, function(res) {
			if(res.data) {
				tool.pileUserInfo();
				mui.alert('恭喜您押注成功！', '积分竞猜', function() {
					mui.back();
				});
			} else {
				mui.alert('押注失败！请查看当期竞猜状态！', '积分竞猜');
			}
		})

	})
};
mui.plusReady(function() {
	initEvent();
	tool.refreshPage();
});