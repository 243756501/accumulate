mui.init();

var flushBtn = document.getElementById("flush_btn");
var bind_list_view = document.getElementById("bind_list_view");
var thirdInfo = {qq:'QQ',weixin:'微信',sina:'新浪微博'};

/*改变绑定状态*/
var changeSt = function(view,info,status){
	view.bind_info = info;
	var textView = view.getElementsByClassName('unbind-text')[0];
	textView.style.color = status?'#47C747':'#777';
	textView.innerHTML = status?'已绑定':'未绑定';
};

/*初始化页面*/
var initLoad = function(){
	ucenter.getBindInfo(function(res){
		plus.nativeUI.closeWaiting();
		if(res.code == 200){
			for(var i in res.data){
				var syncInfo = res.data[i];
				var item = document.getElementById(syncInfo.type);
				changeSt(item,syncInfo,1);
			}
		}else{
			var views = document.getElementsByClassName("mui-table-view-cell");
			for(var i = 0; i < views.length;i++){
				changeSt(views[i],null,0);
			}
		}
	});
};

mui.plusReady(function(){
	initLoad();
});

/*列表项点击事件,绑定或者解除绑定*/
mui('#bind_list_view').on('tap','li',function(e){
	var tmpItem = this;
	var bindInfo = this.bind_info;
	var type = tmpItem.id;
	var requstInfo = {type:type};
	if(bindInfo){
		if(bindInfo.is_sync == 0){
			mui.alert(thirdInfo[type]+'登陆用户,不能解除'+thirdInfo[type]+'绑定','提示信息','确认');
		}else{
			plus.nativeUI.confirm('确认解除现有绑定',function(e){
				if(e.index == 1){
					requstInfo.bind = 'unbind';
					ucenter.setBindInfo(requstInfo,function(res){
						if(res.code == 200){
							toast.info('解除绑定成功');
							changeSt(tmpItem,null,0);
						}else{
							toast.info('解除绑定失败!');
						}
					});
				}
			},'提示信息',['取消','确认']);
		}
	}else{
		if(type == 'sina'){
			type = 'sinaweibo';
		}
		var auths = {};
		var waitView = plus.nativeUI.showWaiting();
		plus.oauth.getServices(function(services){
			for(var i in services){
				var service = services[i];
				auths[service.id] = service;
			}
			var auth = auths[type];
			auth.login(function(){
				auth.getUserInfo(function() {
					requstInfo.auth_result = JSON.stringify(auth.authResult);
					requstInfo.bind = 'bind';
					ucenter.setBindInfo(requstInfo,function(res){
						waitView.close();
						if(res.code == 200){
							changeSt(tmpItem,res.data,1);
							toast.info('绑定成功');
						}else{
							toast.info(res.info);
						}
					});
				}, function(e) {
					waitView.close();
					toast.info("获取用户信息失败");
				});
		}, function(e) {
				waitView.close();
				toast.info("登录认证失败");
			})
		}, function(e){
			waitView.close();
			toast.info('获取登陆认证失败');
		});
	}
});

flushBtn.addEventListener('tap',function(e){
	plus.nativeUI.showWaiting();
	initLoad();
})