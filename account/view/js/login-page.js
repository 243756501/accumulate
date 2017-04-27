(function($, doc) {
	$.init();
	doc.getElementById("app_name").innerHTML = APP_CONFIG.app.name;
	var username_text = doc.getElementById("account");
	var password_text = doc.getElementById("password");
	var login_btn = doc.getElementById("login_btn");
	var around_btn = doc.getElementById('around_btn');
	var main_contain=doc.getElementById('login_background');
	var bgImg=doc.getElementById("login_bgImg");
	$.plusReady(function() {
		apptools.webBlur();
		loginWeb = plus.webview.currentWebview();
		var oauthArea = doc.querySelector('.oauth-area');
		var settings = app.getSettings();
		var state = app.getState();
		var plusCfg = app.getConfig('plus');
		//检查 "登录状态" 开始
		if(settings.autoLogin && state.open_id && false) {
			toast.info('自动登录');
		} else {
			//第三方登录
			var authBtns = ['qihoo', 'weixin', 'sinaweibo', 'qq']; //配置业务支持的第三方登录
			var auths = {};
			var syncInfo = null;
			if(plusCfg.sync_login) {
				plus.oauth.getServices(function(services) {
					for(var i in services) {
						var service = services[i];
						auths[service.id] = service;
						if(~authBtns.indexOf(service.id) && ~plusCfg.sync_login.indexOf(service.id)) {
							var isInstalled = account.isInstalled(service.id);
							var btn = document.createElement('div');
							//如果微信未安装，则为不启用状态
							btn.setAttribute('class', 'oauth-btn' + (!isInstalled && service.id === 'weixin' ? (' disabled') : ''));
							btn.authId = service.id;
							btn.style.backgroundImage = 'url("../../images/' + service.id + '.png")';
							oauthArea.appendChild(btn);
						}
					}

					$(oauthArea).on('tap', '.oauth-btn', function() {
						var type = this.authId;
						var auth = auths[type];
						var waiting = plus.nativeUI.showWaiting();
						console.log('开始登陆');
						auth.login(function() {
							auth.getUserInfo(function() {
								syncInfo = {
									auth_result: JSON.stringify(auth.authResult),
									user_info: JSON.stringify(auth.userInfo),
									type: type
								};
								//请求同步信息
								account.oauth(syncInfo, function(res) {
									waiting.close();
									if(res.code == 200) { //已经同步登陆过
										cacheUser(res);
										goLg();
									} else if(res.code == 202) { //第一次同步登陆
										mui('#pop_view').popover('toggle');
									} else { //同步登陆失败
										toast.info(res.info);
									}
								})

							}, function(e) {
								plus.nativeUI.toast("获取用户信息失败");
							});
						}, function(e) {
							waiting.close();
							plus.nativeUI.toast("登录认证失败");
						});
					});

					/*选择登陆方式*/
					mui('#pop_view').on('tap', 'li', function(e) {
						mui('#pop_view').popover('toggle');
						if(this.id == 'bind') {
							webtools.openSingleWeb('sync-login', syncInfo, 'zoom-fade-out');
						} else {
							account.sync(syncInfo, function(res) {
								toast.hideLoading()
								if(res.code == 200) {
									cacheUser(res);
									goLg();
								} else {
									toast.info(res.info);
								}
							});
						}
					})
				}, function(e) {
					oauthArea.style.display = 'none';
					plus.nativeUI.toast("获取登录认证失败");
				});
			}
		}
		//检查 "登录状态/锁屏状态" 结束
		username_text.value = myStorage.getItem('username');
		//登录按钮
		login_btn.addEventListener('tap', function(event) {
			toast.showLoading('正在登录');
			var loginInfo = {
				account: username_text.value,
				password:password_text.value,
			};
			account.login(loginInfo, function(res) {
				toast.hideLoading();
				myStorage.setItem('userInfo_all',JSON.stringify(res));
				if(res.code == 200) {
					goLg();
				} else {
					toast.info(res.info);
				}
			});
		});
		$.enterfocus('.login-page-maincontent input', function() {
			$.trigger(login_btn, 'tap');
		});
		//注册和忘记密码按钮
		$('body').on('tap', '.user-event', function(e) {
			var tagId = this.id;
			webtools.openSingleWeb(tagId, null, 'zoom-fade-out');
		}, false)
		around_btn.addEventListener('tap', function(event) {
				loginWeb.hide('zoom-fade-in');
			})
		var screenH = document.body.clientHeight;
		window.addEventListener('resize', function(e) {
			document.getElementById("bgm_view").style.display = document.body.clientHeight < screenH ? 'none' : 'block';
		})
	   //退出程序处理逻辑：1秒内，连续两次按返回键，则退出应用；
//		apptools.exitApp();
	})	
}(mui, document));