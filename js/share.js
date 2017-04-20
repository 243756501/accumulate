/**
 * 分享服务对象,需要plusready(对象名share因为兼容,首字母没有大写)
 * @param {Object} triggerId
 * @param {Object} option
 */
var share = function(triggerId,option) {
 	if (share.prototype._singletonInstance) {
    	return share.prototype._singletonInstance;
 	}
  	share.prototype._singletonInstance = this;
  	option = option||{};
	this.options = {
		href:option.href||'',
		title:option.title||'',		//消息标题
		des:option.des||'',			//消息简介
		thumbs:option.thumbs, 	//Array 缩略图组(每张图大小不要超过20KB)
	};
	this.trigger = triggerId||'shares';		//触发控件id
  	this.shares = null;						//Array,运行环境支持的分享服务列表
  	this.shareBts = null;					//Array,actionsheet分享服务选择按钮
	this.init();
}
share.prototype.init = function(){
	var self = this;
  	self.updateSerivces();
	document.getElementById(this.trigger).addEventListener('tap', function() {
		self.shares&&self.shareBts?self.showView():toast.info('获取分享服务失败');
	},false);
}

//打开actionsheet
share.prototype.showView = function(){
	var self = this;
	// 弹出分享列表
	self.shareBts.length > 0 ? plus.nativeUI.actionSheet({
		cancel: '取消',
		buttons: self.shareBts
	}, function(e) {
		(e.index > 0) && self.shareAction(self.shareBts[e.index - 1], true);
	}) : plus.nativeUI.alert('当前环境无法支持分享链接操作!');
}

/**
 * 分享操作
 * @param {JSON} sb 分享操作对象sb.server为分享通道对象(plus.share.ShareService)
 * @param {Boolean} bh 是否分享链接
 */
share.prototype.shareAction = function(sb, bh) {
	var self = this;
	if(!sb || !sb.server) {
		mui.alert("无效的分享服务！");
		return;
	}
	var msg = {
		content: apptools.htmlStr(self.options.des).substr(0,30),	//过滤掉html标签,并取最多30个字符
		extra: {
			scene: sb.ex
		}
	};
	if(bh) {	//分享链接
		msg.href = self.options.href, 		//QQ分享的链接必须是‘http’开头,否则会失败
		msg.title = apptools.htmlStr((self.options.title));
		msg.thumbs = self.options.thumbs||["_www/images/app-logo.png"];
	} else {
		//Todo
	}
	//发送分享
	if(sb.server.authenticated) {
		self.sendMsg(msg, sb.server);
	} else {
		console.log("请求\""+sb.server.description+"\"分享授权...");
		sb.server.authorize(function() {
			self.sendMsg(msg, sb.server);
		}, function(e) {
			plus.nativeUI.toast("认证授权失败" );
		});
	}
}
//发送分享消息
share.prototype.sendMsg = function(msg, server) {
	server.send(msg, function() {
//		console.log("分享到\"" + server.description + "\"成功！ ");
	}, function(e) {
		console.log(JSON.stringify(e))
		plus.nativeUI.toast("分享到\"" + server.description + "\"失败");
	});
}

//更新分享服务
share.prototype.updateSerivces = function(){
	var self = this;
	plus.share.getServices(function(servers){
		self.shareBts = [];
		self.shares = servers;
		for(var i in servers){
			var info = servers[i];
			if(info.nativeClient){
				if(info.id == 'weixin'){
					self.shareBts.push({title: '分享到微信好友',ex:'WXSceneSession',server:info});
					self.shareBts.push({title: '分享到微信朋友圈',ex:'WXSceneTimeline',server:info});
				}else{
					self.shareBts.push({title: '分享到'+info.description,server: info});
				}
			}
		}
	});
}
//设置分享信息
share.prototype.setContent = function(href, hrefTitle, hrefDes,thumbs) {
	this.options.href = href;
	this.options.title = hrefTitle;
	this.options.des = hrefDes;
	this.options.thumbs = thumbs;
}