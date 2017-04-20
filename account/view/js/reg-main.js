mui.init({
	beforeback: function() {
		document.getElementsByClassName('mui-poppicker')[0].style.display = 'none'; //手动解决PopPicker胡乱显示的问题
		if(btnTime) btnTime.setTime(0); //清除计时按钮
		return true;
	}
});
var regBgImg = document.getElementById("reg_bgImg");
var mainContainer = document.getElementById("main_container");
var accountView = document.getElementById("account");
var accountInp = document.getElementById("accountInp");
var accountImg = document.getElementById("accountImg");
var verifyView = document.getElementById('verify_view');
var sendVerifyBtn = document.getElementById('send_verify');
var $roleButton = document.getElementById('showUserType');
var $role_id = document.getElementById('role_id');
var $roleButton_text = document.getElementById("showUserType_text");
var loginWeb, selfWeb, roleList, regType, accountConfig = null;
var userPicker, btnTime = null;
var pickerData;
var need_verify = false; //标记是否需要验证码
var exObj = {
	'change_avatar': 'reg-info-img',
	'expand_info': 'reg-info-enlarge',
	'set_tag': 'reg-info-tag'
}; //每一个值不能轻易更改
var resExobjs = [];
//监听注册类型更改事件
window.addEventListener('localReg', function(event) {
	var tmpData = event.detail.data;
	if(!regType || tmpData.type != regType) {
		regType = tmpData.type;
		var state = APP_CONFIG.account.regTypeOri[regType];
		verifyView.style.display = need_verify[regType] ? 'block' : 'none';
		if(state == "手机号") {
			accountImg.setAttribute('class', 'mui-icon input-icon mui-icon-phone')
		} else if(state == "邮箱") {
			accountImg.setAttribute('class', 'mui-icon input-icon mui-icon-email')
		} else if(state == "用户名") {
			accountImg.setAttribute('class', 'mui-icon input-icon mui-icon-person')
		}
		accountInp.placeholder = '请输入' + state;
		accountInp.value = '';
	}

	/*给角色选择器赋值*/
	if(!roleList || roleList.length != tmpData.role.length) {
		roleList = tmpData.role || [];
		//默认角色赋值
		$roleButton_text.value = roleList[0].title;
		$role_id.value = roleList[0].id;
		pickerData = [];
		for(var item in roleList) {
			pickerData[item] = {
				value: roleList[item].id,
				text: roleList[item].title
			};
		}
		userPicker.setData(pickerData);
	}
	document.getElementsByClassName('mui-poppicker')[0].style.display = 'block';

});
mui.plusReady(function() {
	if(mui.os.ios) {
		document.getElementById("iosbackBtn").style.display = "block";
	}
	selfWeb = plus.webview.currentWebview();
	userPicker = new mui.PopPicker();
	/*判断是否需要验证码*/
	accountConfig = app.getConfig('account');
	need_verify = {
		email: accountConfig.email_verify_type == 2 ? true : false,
		mobile: accountConfig.mobile_verify_type == 1 ? true : false,
	};
	//计算需要执行的注册后续步骤
	for(var i in accountConfig.reg_step) {
		if(accountConfig.reg_step[i]['data-id'] == 'enable') {
			var enableStep = accountConfig.reg_step[i]['items'];
			for(var j in enableStep) {
				resExobjs.push(exObj[enableStep[j]['data-id']]);
			}
		}
	}
	//身份选择器
	$roleButton.addEventListener('tap', function(event) {
		userPicker.show(function(items) {
			$role_id.value = items[0].value;
			$roleButton_text.value = items[0].text;
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	}, false);

	/*发送验证码*/
	sendVerifyBtn.addEventListener('tap', function() {
		var account = accountInp.value;
		if(regType == 'mobile' && !apptools.checkMobile(account)) {
			return;
		} else if(regType == 'email' && !apptools.checkEmail(account)) {
			return;
		}
		toast.showLoading('发送中');
		var restInfo = {
			account: account,
			type: regType,
			action: 'reg'
		};
		app.sendVerify(restInfo, function(res) {
			toast.info(res.info);
			if(res.code == 200 && regType != 'username') {
				btnTime = new DecTime(sendVerifyBtn, 60);
			}
			toast.hideLoading();
		})
	}, false);

	/*注册按钮*/
	document.getElementById('reg_btn').addEventListener('tap', function(event) {
		//	        	if(resExobjs.length > 0){
		//		        	webtools.openSingleWeb(resExobjs[0],resExobjs);
		//	        	}
		//	        	return;
		var regInfo = {
			invite_code: roleList[0].invite || '',
			reg_verify: regType == 'username' ? '' : document.getElementById('reg_verify').value,
			nickname: document.getElementById("nickname").value,
			password: document.getElementById("password").value,
			role: document.getElementById('role_id').value,
			reg_type: regType
		};
		regInfo[regType] = accountInp.value;
		//用户名注册验证（1.6.5版本以后已经取消的了用户名注册）
		if(regInfo.reg_type == 'username') {
			var uNameRegx = /[\w]{1,32}?$/;
			if(!uNameRegx.test(regInfo.username)) {
				mui.toast('用户名仅支持英文,数字和下划线');
				return;
			}
		}
		toast.showLoading('注册中');
		account.reg(regInfo, function(res) {
			if(typeof(res) == 'object') {
				if(res.code == 200) {
					toast.info('注册成功');
					var is_sync = myStorage.getItem('is_sync');
					var syncWeb = plus.webview.getWebviewById('sync-login');
					if(is_sync && syncWeb) {
						mui.fire(syncWeb, 'newAccount', {
							data: true
						});
						syncWeb.show('zoom-fade-out', 200);
					} else {
						//						webtools.openSingleWeb('login', '', 'zoom-fade-out');
						var loginInfo = {
							account: accountInp.value,
							password: document.getElementById("password").value,
						}
						account.login(loginInfo, function(res) {
							toast.hideLoading();
							if(res.code == 200) {
								goLg();
							} else {
								toast.info(res.info);
							}
						});
					}
					setTimeout(function() {
						plus.webview.getWebviewById('reg').close('none');
						selfWeb.close('none');
					}, 1000);
				} else {
					toast.info(res.info);
				}
			} else {
				toast.info(res);
			}
			toast.hideLoading();
		});
	}, false);

	document.getElementsByClassName('mui-poppicker')[0].style.display = 'none';
	selfWeb.addEventListener('hide', function(e) {
		if(mui.os.ios) {
			document.activeElement.blur();
		}
	})
});