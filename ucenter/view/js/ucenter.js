mui.init();
var unRead = document.getElementById('unread_message');
var loadedHead = document.getElementById('header');
var loadedBody = document.getElementById('loaded');
var unLoadedBody = document.getElementById('unload');
var logoutBtn = document.getElementById('logoutBtn');

var loginWeb, modBotmWeb, ucWeb = null; //主面板页面
var loginBlock = true;
var preWebList = []; //缓存固定数目的子页面，以优化重复打开
var appConfig = null;

/*预载登陆页面*/
var preload_loginweb = function() {
	webtools.createRptWeb('../../account/view/login',function(web){
		loginWeb = web;
	});
};
/*登录后的操作*/
function loginEvnt(userInfo) {
	changePage(loadedBody, unLoadedBody, true);
	loadedHead.innerHTML = template('user_info_template', userInfo);
	if(loginBlock) {
		loginBlock = false;
		mui('#loaded').on('tap', 'li', function(event) {
			var targetWeb = this.getAttribute('name');
			if(targetWeb == 'message-center')unRead.style.display = 'none';
			var openType = this.getAttribute('open-type') || 'open';
			var tempWeb = plus.webview.getWebviewById(targetWeb);
			if(!tempWeb) {
				if(preWebList.length >= 3) { //最多缓存最近打开的3个页面，多余的就删除
					preWebList[0].close('none');
					preWebList.shift();
				}
				tempWeb = mui.preload({
					url: targetWeb + '.html',
					id: targetWeb
				});
				preWebList.push(tempWeb);
			}
			//处理3个社交页面使用一套统一模板来渲染
			if(openType == 'social') {
				var socailId = this.id;
				setTimeout(function() {
					var socialBodyWeb = plus.webview.getWebviewById('social-body');
					mui.fire(socialBodyWeb, 'socialChange', {
						data: socailId
					});
				}, 1500)
			}
			tempWeb.show('pop-in');
		});
	}

	if(userInfo.message_unread_count > 0) {
		unRead.innerHTML = userInfo.message_unread_count;
	} else {
		unRead.style.display = 'none';
	}
}

(function($, doc) {
	$.plusReady(function() {
		ucWeb = plus.webview.currentWebview();
		if(is_login()) {
			app.signAlaram();			
	    }
		ucWeb.setStyle({
			scrollIndicator:'none'
		});
		ucWeb.addEventListener('show',function(e){
			preload_loginweb();
		})
		modBotmWeb = plus.webview.getWebviewById('module-bottom');
		var pushout = doc.getElementById("pushout");
		var getTrans = doc.getElementById("getTrans");
		
		if(is_login()) {
			account.autoLogin(function(res) {
				if(res.code == 200) {
					console.log('自动登陆成功，open_id：' + res.data.open_id);
					loginEvnt(res.data_1);
				} else {
					changePage(loadedBody, unLoadedBody, false);
					preload_loginweb();
					toast.info(res.info);
				}
			})
		} else {
			changePage(loadedBody, unLoadedBody, false);
		}
		
		// 监听点击消息事件
		plus.push.addEventListener("click", function(msg) {
			// 判断是从本地创建还是离线推送的消息
			var tagData = JSON.parse(msg.payload);
			if(tagData.from == 'netMsg') {
				if(tagData.mod == 'weibo') {
					webtools.openDtlWeb('weibo', tagData.arg);
				}
			}
		}, false);
		// 监听在线消息事件
		plus.push.addEventListener("receive", function(msg) {
			if(!is_login() || mui.os.ios && !msg.type) { //未登录状态或者苹果本地创建的消息都屏蔽监听
				return;
			}
			//添加未读消息标示
			unRead.style.display = 'block';
			unRead.innerHTML++;
			//对透传数据的解析逻辑
			var plInfo = msg.payload;
			if(typeof(plInfo) == 'string') {
				plInfo = JSON.parse(plInfo);
			}
			var tmpData = {
				mod: plInfo.mod,
				arg: plInfo.arg,
				from: 'netMsg'
			};
			var localData = {
				title: pushType[plInfo.type],
				content: plInfo.content,
				data: tmpData
			};
			apptools.creatMsg(localData);
		}, false);

		/*注册和登陆*/
		mui('#join_view').on('tap', 'button', function(e) {
			var target = '../../account/view/' + this.id;
			webtools.openSingleWeb(target, '', 'zoom-fade-out');
		}, false);
	});
}(mui, document));

//
header.addEventListener('tap',function(e){
	if(e.target.tagName != 'IMG'){
		webtools.openSingleWeb('userinfo');
	}
})

//退出登录按钮
logoutBtn.addEventListener('tap', function(event) {
	var btnArray = ['是', '否'];
	mui.confirm('确认退出？', '注销', btnArray, function(e) {
		if(e.index == 0) {
			app.logout(function() {
				//注销时关闭预载的个人信息窗口
				for(var i in preWebList) {
					preWebList[i].close('none');
				}

				/*广播用户改变事件*/
				var allActivity = plus.webview.all();
				for(var i in allActivity) {
					mui.fire(allActivity[i], 'userChange', {
						data: false
					});
				}
				//退出登陆后预载登陆页面
				preload_loginweb();
			});
		}
	})
});

/*更换用户事件*/
window.addEventListener('userChange', function(event) {
	app.signAlaram();	
	if(event.detail.data) {
		loginEvnt(JSON.parse(myStorage.getItem('user_info')));
	} else {
		changePage(loadedBody, unLoadedBody, false);
	}
});

/*信息改变*/
window.addEventListener('ucenter-changeImg', function(event) {
	if(event.detail.change) {
		account.autoLogin(function(res) {
			if(res.code == 200) {
				var userInfo = res.data_1;
				loginEvnt(userInfo);
				var self_web = plus.webview.getWebviewById('usercenter');
				mui.fire(self_web, 'usercenter-changeImg', {
					change: true,
					uid: userInfo.uid
				})
			} else {
				changePage(loadedBody, unLoadedBody, false);
				toast.info(res.info);
			}
		})
	}
})
//进入个人主页。
app.userListener();