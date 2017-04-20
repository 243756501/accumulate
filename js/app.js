(function($, owner) {
	/**
	 *好友一键关注 
	 * @param {String} dom_class
	 */
	owner.focusOn = function(target) {
			target = target || '.follow-btn';
			mui('body').on('tap', target, function() {
				if(is_login()) {
					var toFollowUid = get_parent_node(this, '.mui-table-view-cell').user_info.uid;
					var thisBtn = this;
					var isFollow = thisBtn.getAttribute('data-follow');
					if(isFollow == 0) {
						/*加关注操作*/
						ucenter.following(toFollowUid, function(res) {
							toast.info(res.info);
							if(res.code == 200) {
								thisBtn.setAttribute('data-follow', 1);
								thisBtn.innerHTML = '<button class="li-btn"><span class="icon-user-check"></span><div style="font-size: 12px;">已关注</div></button>';
							} else {
								toast.info(res.info);
							}
						});
					} else {
						//取消关注操作
						var btnArray = ['否', '是'];
						mui.confirm('确认取消关注？', '提示信息', btnArray, function(e) {
							if(e.index == 1) {
								ucenter.unFollowing(toFollowUid, function(res) {
									if(res.code == 200) {
										thisBtn.setAttribute('data-follow', 0);
										thisBtn.innerHTML = '<button style="color:#007AFF" class="li-btn"><span class="icon-user-plus"></span><div style="font-size: 12px;">加关注</div></button>';
										toast.info('取消关注成功');
									} else {
										toast.info(res.info);
									}
								})
							}
						})
					}
				} else {
					mui.toast('需要登录后操作!');
				}
			});
		},
		/**
		 * 签到提醒
		 */
		owner.signAlaram = function() {
			setTimeout(function() {
				owner.getSignInfo(function(res) {
					if(res.code == 200) {
						if(!res.data.has_checked) {
							owner.gotoSignUp();
						}
					} else {
						toast.info(res.info);
					}
				});
			}, 2000);
		};
	/**
	 *签到提醒对话框 
	 */
	owner.gotoSignUp = function() {
		var btnArray = ['稍后提醒', '立即签到'];
		mui.confirm('今日还未签到哦！赶紧去签到吧！', '签到提醒', btnArray, function(e) {
			if(e.index == 1) {
				webtools.openSingleWeb('../../ucenter/view/sign-in-head');
			}
		});
	};
	/**
	 * 获取签到信息
	 */
	owner.getSignInfo = function(callback) {
		var request = new httpRequest();
		request.get('check', function(res) {
			callback(res);
		});
	};
	/*附件上传接口*/
	owner.uploadAttach = function(parm, callback) {
		callback = callback || $.noop;
		var request = new httpRequest();
		request.addData('type', parm.type);
		request.addData('data', parm.data);
		request.post('attachment', function(res) {
			callback(res);
		});
	};

	/**
	 * 获取模块配置
	 * @param {Array|String} modName
	 * @param {Function} callback
	 */
	owner.getModConfig = function(modName, callback) {
		callback = callback || $.noop;
		modName = modName || '';
		if(modName instanceof Array) {
			modName = modName.join();
		}
		var request = new httpRequest();
		request.addData('mod_name', modName);
		request.get('mod_config', function(res) {
			callback(res);
		});
	};

	/**
	 * 
	 * @param {Object} modName
	 * @param {Object} callback
	 */
	owner.getNavList = function(callback) {
		callback = callback || $.noop;
		var request = new httpRequest();
		request.get('nav_list', function(res) {
			callback(res);
		});
	};

	/**
	 * 获取用户信息
	 */
	owner.getUserInfo = function(uid, callback) {
		callback = callback || $.noop;
		var open_id = app.getState().open_id;
		uid = uid || '';
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.get('user/' + uid, function(res) {
			if(uid == JSON.parse(myStorage.getItem('uid'))) {
				myStorage.setItem('user_info', JSON.stringify(res.data));
				myStorage.setItem('uid', res.data.uid);
			}
			callback(res);
		})
	};

	/**
	 * 获取用户即时数据（主要用于积分此类变动频繁的数据获取）
	 */
	owner.getUserData = function(uid, callback) {
		var request = new httpRequest();
		request.addData('id', uid);
		request.get('user_data', function(res) {
			callback(res);
		});
	};

	/*获取虾米音乐的MP3地址*/
	owner.getXiamiMusic = function(musicId, callback) {
		musicId = musicId || '';
		var request = new httpRequest();
		request.addData('mid', musicId);
		request.get('music', function(res) {
			callback(res);
		});
	};

	/**
	 * 获取模块开关信息
	 */
	owner.getMod = function(callback) {
		callback = callback || $.noop;
		var request = new httpRequest();
		request.get('mod', function(res) {
			callback(res);
		})
	};

	/**
	 * 注销登录
	 * @param callback
	 * @returns {boolean}
	 */
	owner.logout = function(callback) {
		callback = callback || $.noop;
		//		console.log(myStorage.getItem('username') + myStorage.getItem('password'));
		myStorage.removeItem('password');
		myStorage.removeItem('user_info');
		myStorage.removeItem('uid');
		app.setState();
		app.setSettings();
		callback();
		return false;
	};

	owner.createState = function(open_id, auth, callback) {
		var state = owner.getState();
		state.uid = auth.uid;
		state.open_id = open_id;
		owner.setState(state);
		return callback();
	};

	/**
	 * 上传图片
	 */
	owner.uploadPic = function(picInfo, callback) {
		callback = callback || $.noop;
		picInfo = picInfo || {};
		picInfo.data = picInfo.data || '';
		var request = new httpRequest();
		request.addData('data', picInfo.data);
		request.post('picture', function(res) {
			callback(res)
		});
		return false;
	}

	owner.sendVerify = function(info, callback) {
		var open_id = app.getState().open_id || '';
		info = info || {};
		info.account = info.account || '';
		info.type = info.type || '';
		info.action = info.action || '';
		var request = new httpRequest();
		request.addData('account', info.account);
		request.addData('type', info.type);
		request.addData('action', info.action);
		request.addData('open_id', open_id);
		request.post('verify', function(res) {
			callback(res)
		});
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = myStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		myStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		myStorage.setItem('$settings', JSON.stringify(settings));
	};

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = myStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	};

	/**
	 * 获取各模块配置信息
	 * @param {String} mod
	 */
	owner.getConfig = function(mod) {
		var APPCONFIG = JSON.parse(myStorage.getItem('app_config'));
		return APPCONFIG[mod];
	};

	/**
	 * 获取积分对象
	 * @param {Array} scoreTypes
	 */
	owner.getScoreObj = function(scoreTypes) {
		scoreTypes = scoreTypes || owner.getConfig('system').score_list;
		var scoreObj = {};
		for(var i in scoreTypes) {
			scoreObj[scoreTypes[i].id] = scoreTypes[i].title;
		}
		return scoreObj;
	};

	/**
	 * 点赞
	 **/
	owner.support = function(info, callback) {
		var state = app.getState();
		info = info || {};
		callback = callback || $.noop;

		info.appname = info.appname || '';
		info.table = info.table || '';
		info.jump = info.jump || '';
		info.row = info.row || '';
		var request = new httpRequest();
		request.addData('appname', info.appname);
		request.addData('table', info.table);
		request.addData('row', info.row);
		request.addData('jump', info.jump);
		request.addData('open_id', state.open_id || '');
		request.post('support', function(res) {
			callback(res)
		});
		return false;
	};

	/**
	 * 我的点赞（指定模块、表名）
	 **/
	owner.mySupport = function(info, callback) {
		var state = app.getState();
		info = info || {};
		callback = callback || $.noop;
		info.appname = info.appname || '';
		info.table = info.table || '';
		var request = new httpRequest();
		console.log(JSON.stringify(info));
		request.addData('appname', info.appname);
		request.addData('table', info.table);
		request.addData('open_id', state.open_id || '');
		request.get('my_support', function(res) {
			callback(res)
		});
		// return false;
	};

	/**
	 * 版本信息
	 **/
	owner.versions = function(versions, callback) {
		var request = new httpRequest();
		request.addData('versions', versions);
		request.get('versions', function(res) {
			callback(res);
		});
	};
	/**
	 * 举报
	 */
	owner.report = function(info, callback) {
		var open_id = app.getState().open_id || '';
		callback = callback || mui.noop;
		var info = info || {};
		info.type = info.type || '';
		info.url = info.url || '';
		info.data = info.data || '';
		info.reason = info.reason || '';
		info.content = info.content || '';
		if(open_id == '') {
			mui.toast('未登入');
			return;
		}
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.addData('type', info.type);
		request.addData('url', info.url);
		request.addData('data', info.data);
		request.addData('reason', info.reason);
		request.addData('content', info.content);
		request.post('report', function(res) {
			callback(res);
		});
	};

	/**
	 * 获取举报类型
	 */
	owner.getResport = function(callback) {
		callback = callback || mui.noop;
		var request = new httpRequest();
		request.get('report_type', function(res) {
			callback(res);
		});
	};

	/**
	 * 分享(兼容3.3.0-，3.3.0+不要使用)
	 */
	owner.shareHref = function(href, title, content) {
		title = title.replace(/<[^>].*?>/g, "").substr(0, 30);
		content = content.replace(/<[^>].*?>/g, "").substr(0, 30);
		share.setContent(href, title, content);
	}

	/**
	 * 设备获取appName
	 * 注：必须在plusReady中调用
	 */
	owner.getAppName = function(callback) {
		plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
			var name = wgtinfo.name;
			callback(name);
		})
	}

	/**
	 * 
	 * @param {String} modName 模块名
	 * @param {Object} info 举报源数据
	 */
	owner.openReportWeb = function(modName, info) {
		mui.openWindow({
			url: '../../init/view/report.html',
			id: 'report',
			show: {
				autoShow: false
			},
			extras: {
				info: info,
				type: modName
			},
			createNew: false
		});
	}

	/**
	 * 解析微博分享的短地址
	 * @param {String} link 短地址类似/news/detail_415.html
	 * @return {Object} info 目标对象
	 */
	owner.parseShortAddress = function(link) {
		var strArr = link.split('/');
		var info = {
			mod: strArr[1],
			id: link.replace(/\D/g, '')
		};
		return info;
	}

	/**
	 * 登陆判断
	 */
	owner.loginHandle = function() {
		if(is_login()) {
			return true;
		} else {
			//Todo  后续会在这里添加一系列动作
			toast.info('登陆后操作')
			return false;
		}
	}

	/**
	 * 跳转用户中心监听器
	 * @param {String} target css选择器
	 */
	owner.userListener = function(target) {
		target = target || '.user-flag';
		mui('body').on('tap', target, function(event) {
			event.stopPropagation();
			var uid = this.getAttribute('data-uid');
			if(uid && uid > 0) {
				webtools.createRptWeb('../../ucenter/view/usercenter', function(rptWeb) {
					mui.fire(rptWeb, 'usercenterChange', {
						data: uid
					});
					rptWeb.show('pop-in', 300);
				});
			} else {
				mui.toast('不存在或者异常的用户');
			}
			return false;
		}, false)
	}

	/**
	 * 用户更改后刷新页面
	 */
	owner.reloadWeb = function() {
		window.addEventListener('userChange', function() {
			plus.webview.currentWebview().reload();
		})
	}

	/**
	 * 创建一个标准化列表item
	 * @param {Object} info 数据源
	 * @param {String} className
	 * @param {String} tagName 标签名,默认为li
	 */
	owner.createListItem = function(info, className, tagName) {
		tagName = tagName || 'li';
		var itemView = document.createElement(tagName);
		itemView.className = className;
		itemView.detail_info = info;
		return itemView;
	}

	/**
	 * 校验版本 判断升级方式
	 * 0：不用升级 1：需要先卸载老客户端再安装新版 2：覆盖安装升级  3：下载补丁升级
	 * @param {String} version 列如3.1.1格式规范的版本号
	 */
	owner.checkUpdate = function(version) {
		version = version || '';
		var oldVers = app.getVersion();
		var newArr = version.split('.');
		var oldArr = oldVers.split('.');
		if(newArr[0] != oldArr[0]) {
			return 1;
		}
		if(newArr[1] != oldArr[1]) {
			return 2;
		}
		if(newArr[2] != oldArr[2]) {
			return 3;
		}
		return 0;
	}
	/**
	 * 获取app准确版本号
	 */
	owner.getVersion = function() {
		return myStorage.getItem("app_version");
	}
	/**
	 * 更新升级  返回代码 1：成功；0：失败；-1：取消升级
	 * @param {String} patchUrl 升级包下载链接
	 * @param {Function} callback
	 */
	owner.doUpdate = function(patchUrl, callback) {
		callback = callback || mui.noop;
		var title = mui.os.ios ? '发现新数据包，是否使用？' : '发现新版本，是否升级？';
		mui.confirm(title, '升级提示', ['是', '否'], function(e) {
			if(e.index == 0) {
				var wait = plus.nativeUI.showWaiting('正在获取数据..', { back: 'none' });
				new Downloader(patchUrl).run(function(down) {
					if(down) {
						wait.setTitle('获取成功，升级中..');
						plus.runtime.install(down.filename, { force: true }, function() { //安装升级包
							wait.close();
							callback(1);
						}, function(e) {
							callback(0);
							wait.close();
							toast.info("升级失败" + e.message);
						});
					} else {
						callback(0);
						wait.close();
						toast.info('下载失败！');
					}
				})
			} else {
				callback(-1);
			}
		})
	}
	/*退出应用程序*/
	owner.quit = function() {
		if(mui.os.android) {
			plus.runtime.quit();
		}
	}
}(mui, window.app = {}));