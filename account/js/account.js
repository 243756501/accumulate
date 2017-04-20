/**
 * 用于添加各种登陆额外参数
 * @param {httpRequest} request
 */
var addPushData = function(request) {
	if(OPENPUSH) { //判断是否开启了推送功能
		var pushInfo = plus.push.getClientInfo();
		myStorage.setItem('push_in_notice', '1');
		var locaInfo = myStorage.getItem('user_location');
		if(locaInfo) {
			request.addData('geolocation', locaInfo);
		}
		request.addData('cid', pushInfo.clientid);
		request.addData('token', pushInfo.token);
	}
	return request;
};

//登录成功后的操作
var goLg = function() {
	var allActivity = plus.webview.all();
	for(var i in allActivity) {
		mui.fire(allActivity[i], 'userChange', { data: true });
	}
	setTimeout(function() {
		loginWeb.close();
	}, 500)
	toast.info('登录成功');
};

/**
 * 缓存用户信息到本地
 * @param {Object} res
 */
var cacheUser = function(res) {
	myStorage.setItem('uid', res.data_1.uid);
	myStorage.setItem('user_info', JSON.stringify(res.data_1));
	app.createState(res.data.open_id, res.data.auth, function() {
		var settings = app.getSettings();
		settings.autoLogin = true;
		app.setSettings(settings);
	});
};

var account = {
	/**
	 * 用户登录
	 **/
	login: function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		if(!loginInfo.account.trim() || !loginInfo.password.trim()) {
			callback({ info: '账号和密码不能为空' });
			return;
		}
		var request = new httpRequest();
		request.addData('username', loginInfo.account);
		request.addData('password', loginInfo.password);
		request = addPushData(request);
		request.post('authorization', function(res) {
			if(res.code == 200) {
				myStorage.setItem('username', loginInfo.account);
				myStorage.setItem('password', loginInfo.password);
				cacheUser(res);
			}
			callback(res);
		});
		return false;
	},

	/**
	 * 自动登录(使用open_id登陆)
	 **/
	autoLogin: function(callback) {
		callback = callback || $.noop;
		var openId = app.getState().open_id || '';
		if(!openId) {
			callback({ info: '自动登陆失败' });
			return;
		}
		var request = new httpRequest();
		request.addData('open_id', openId);
		request = addPushData(request);
		request.post('authorization', function(res) {
			callback(res);
			if(res.code == 200) cacheUser(res);
		});
		return false;
	},

	/**
	 * 获取同步授权信息
	 **/
	oauth: function(info, callback) {
		info = info || {};
		info.auth_result = info.auth_result || '';
		info.user_info = info.user_info || '';
		info.bind_info = info.bind_info || '';
		info.type = info.type || '';

		var request = new httpRequest();
		request.addData('auth_result', info.auth_result);
		request.addData('user_info', info.user_info);
		request.addData('type', info.type);
		request = addPushData(request);
		request.post('oauth', function(res) {
			callback(res)
		});
	},

	/**
	 * 同步绑定
	 **/
	sync: function(info, callback) {
		info = info || {};
		info.auth_result = info.auth_result || '';
		info.user_info = info.user_info || '';
		info.bind_info = info.bind_info || '';
		info.type = info.type || '';
		info.username = info.username || '';
		info.password = info.password || '';

		var request = new httpRequest();
		request.addData('auth_result', info.auth_result);
		request.addData('user_info', info.user_info);
		request.addData('bind_info', info.bind_info);
		request.addData('type', info.type);
		request.addData('username', info.username);
		request.addData('password', info.password);
		request = addPushData(request);
		request.post('oauth_sync', function(res) {
			callback(res)
		});
	},

	/**
	 * 新用户注册
	 **/
	reg: function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.username = regInfo.username || '';
		regInfo.password = regInfo.password || '';
		regInfo.nickname = regInfo.nickname || '';
		regInfo.invite_code = regInfo.invite_code || '';
		regInfo.email = regInfo.email || '';
		regInfo.mobile = regInfo.mobile || '';
		regInfo.reg_verify = regInfo.reg_verify || '';
		regInfo.reg_type = regInfo.reg_type || '';
		regInfo.role = regInfo.role || '';

		var reg_config = app.getConfig('account');
		if(!reg_config) {
			console.log('注册配置信息获取炸掉啦,启动备用配置!');
			reg_config = APP_CONFIG.account.reg_config;
		}
		var nickname_min = reg_config.nickname_min;
		var nickname_max = reg_config.nickname_max;

		var username_min = reg_config.username_min;
		var username_max = reg_config.username_max;

		var email_verify = reg_config.email_verify_type;
		var mobile_verify = reg_config.mobile_verify_type;

		if(regInfo.reg_type == 'username') {
			if(regInfo.username.length < username_min || regInfo.username.length > username_max) {
				return callback('用户名长度在' + username_min + '-' + username_max + '之间');
			}
		}

		if(regInfo.nickname.length < nickname_min || regInfo.nickname.length > nickname_max) {
			return callback('昵称长度在' + nickname_min + '-' + nickname_max + '之间');
		}

		if(regInfo.reg_type == 'email' || regInfo.reg_type == 'mobile') {
			if((regInfo.reg_type == 'email' && email_verify == 2) || (regInfo.reg_type == 'mobile' && mobile_verify == 1)) {
				if(regInfo.reg_verify == '') {
					return callback('验证码不能为空');
				}
			}
		}

		var patterns = new Object();
		patterns.Password = /^\w{6,20}$/;
		patterns.Email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		patterns.Phone = /^(1[3|4|5|7|8])[0-9]{9}$/;

		if(!patterns.Password.test(regInfo.password)) {
			return callback('密码格式错误,需要6-20位非特殊字符');
		}
		if(regInfo.reg_type == 'email') {
			if(!patterns.Email.test(regInfo.email)) {
				return callback('请输入正确的邮箱');
			}
		}

		if(regInfo.reg_type == 'mobile') {
			if(!patterns.Phone.test(regInfo.mobile)) {
				return callback('请输入正确的手机');
			}
		}

		if(regInfo.password.length < 6) {
			return callback('密码不少于6个字节');

		}

		var request = new httpRequest();
		request.addData('invite_code', regInfo.invite_code);
		request.addData('username', regInfo.username);
		request.addData('email', regInfo.email);
		request.addData('mobile', regInfo.mobile);
		request.addData('nickname', regInfo.nickname);
		request.addData('password', regInfo.password);
		request.addData('reg_verify', regInfo.reg_verify);
		request.addData('reg_type', regInfo.reg_type);
		request.addData('role', regInfo.role);
		request = addPushData(request);
		request.post('account', function(res) {
			callback(res)
		});
		return false;
	},

	/**
	 * 密码操作
	 **/
	handlePassword: function(requestInfo, callback) {
		var openId = app.getState().open_id || '';
		var request = new httpRequest();
		request.addData('open_id', openId);
		request.addData('account', requestInfo.account);
		request.addData('action', requestInfo.action);
		request.addData('type', requestInfo.type);
		request.addData('verify', requestInfo.verify);
		request.addData('password', requestInfo.password);
		request.addData('old_password', requestInfo.old_password);
		request.put('password', function(res) {
			callback(res);
		});
	},

	/**获取本地是否安装客户端
	 * 
	 * @param {String} id
	 */
	isInstalled: function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	},
};

var reg = {
	/**
	 * 验证注册邀请码
	 * @param {Object} inviteCode
	 * @param {Object} callback
	 */
	checkInviteCode: function(inviteCode, callback) {
		inviteCode = inviteCode || '';
		var request = new httpRequest();
		request.addData('code', inviteCode);
		request.get('check_code', function(res) {
			callback(res);
		});
	},

	/**
	 * 获取注册角色列表
	 */
	getRole: function(callback) {
		var request = new httpRequest();
		request.get('role', function(res) {
			callback(res);
		});
	}
};

var ucenterWeb, eventWeb, shopWeb, groupWeb, weiboWeb, loginWeb = null;