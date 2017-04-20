/**
 * Created by Administrator on 15-8-26.
 */

	/**
	  * @param {外部容器} groupView
	  */
	var actvMusObj = {			//正在播放的音乐对象
		audioDom:null,			//音频dom
		progresDom:null,		//进度条dom
		controDom:null,			//控制按钮dom
		iconDom:null			//状态图标
	};
	var pauseMusic = function(){
		if(actvMusObj.audioDom && actvMusObj.audioDom.played){
			actvMusObj.audioDom.pause();
		}
	}
	var XiamiMusicObj = function(groupView){
		
		
		mui(groupView).on('tap','.music-contro',function(e){
			var weiboId = this.getAttribute('data-weiboid');
			playMusic(this,weiboId);
		})
		
		var musOop;
		
		var playMusic = function(contro,id){
			var block = true;
			var weiboId = id;
			var musiContro = contro.children[0];
			var musicId = musiContro.getAttribute('data-music-id');
			if(actvMusObj.audioDom && actvMusObj.audioDom.id != weiboId + '_' + musicId){
				actvMusObj.audioDom.pause();
			}
			actvMusObj.progresDom = document.getElementById('music_progres_' + weiboId + '_' + musicId);
			actvMusObj.audioDom = document.getElementById(weiboId + '_' + musicId);
			var view = get_parent_node(contro,'.music-view');
			if(actvMusObj.audioDom.src == ''){
				app.getXiamiMusic(musicId,function(res){
					if(res.code == 200){
						var musicUrl = res.data.src;
						actvMusObj.audioDom.src = musicUrl;
						actvMusObj.audioDom.play();
					}else{
						toast.info('获取音乐地址失败!');
					}
				})
				
				actvMusObj.audioDom.addEventListener('pause',function(e){		//音乐暂停事件监听器低版本手机系统不会自动产生这个事件
					clearInterval(musOop);
					document.getElementById("music_contro_" + this.id).src = '../../images/mediaImages/play.png';
					document.getElementById("music_progres_" + this.id).setAttribute('data-rate',this.currentTime/this.duration*100);
				})
				actvMusObj.audioDom.addEventListener('play',function(e){		//音乐播放事件监听器
					document.getElementById("music_contro_" + this.id).src = '../../images/mediaImages/pause.png';
					console.log(this.id + '开始播放');
					var progresBar = document.getElementById('music_progres_' + this.id);
					var musicTime = this.duration || 0;
					console.log(musicTime);
					if(musicTime > 0){
						var oopRate = 100/musicTime;
						var tempCount = Number(progresBar.getAttribute('data-rate'));
						var oopCount = tempCount == 100?0:tempCount;
						musOop = setInterval(function(){
							oopCount += oopRate;
							if(oopCount >= 100){
								clearInterval(musOop);
							}
							progresBar.style.width = oopCount + "%";
						},1000)
					}
				})
				
				/*得到音乐长度*/
				actvMusObj.audioDom.addEventListener('durationchange',function(e){
					var musicTime = actvMusObj.audioDom.duration;
					if(block && musicTime > 0){
						block = false;
						var oopRate = 100/musicTime;
						var oopCount = 0;
						musOop = setInterval(function(){
							oopCount += oopRate;
							if(oopCount >= 100){
								clearInterval(musOop);
							}
							actvMusObj.progresDom.style.width = oopCount + "%";
						},1000)
					}
				})
				
			}
			if (actvMusObj.audioDom.paused) {
				actvMusObj.audioDom.play();
				musiContro.src = '../../images/mediaImages/pause.png'
			}else{
				actvMusObj.audioDom.pause();
				musiContro.src = '../../images/mediaImages/play.png';
			}
		}
	}
	
var weibo = {

	/**
	 * 获取微博
	 * @param {Object} info
	 * @param {Object} callback
	 */
	getWeiboList: function(weiboInfo, callback) {
		var open_id = app.getState().open_id || '';
		weiboInfo = weiboInfo || {};
		weiboInfo.type = weiboInfo.type || '';
		weiboInfo.uid = weiboInfo.uid || '';
		weiboInfo.crowd_id = weiboInfo.crowd_id || '';
		weiboInfo.topic_id = weiboInfo.topic_id || '';
		weiboInfo.page = weiboInfo.page || '';
		var request = new httpRequest();
		request.addData('type', weiboInfo.type);
		request.addData('crowd_id', weiboInfo.crowd_id);
		request.addData('topic_id', weiboInfo.topic_id);
		request.addData('uid', weiboInfo.uid);
		request.addData('page', weiboInfo.page);
		request.addData('open_id', open_id);
		request.get('weibo', function(res) {
			callback(res);
		});
	},

	/**
	 * 设置微博置顶
	 * @param {Object} info
	 * @param {Object} callback
	 */
	setTop: function(id, callback) {
		var state = app.getState();
		callback = callback || $.noop;
		id = id || '';
		var open_id = state.open_id || '';
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.put('weibo_top/' + id, function(res) {
			callback(res);
		});
	},
	/**
	 * 设置微博删除
	 * @param {Object} info
	 * @param {Object} callback
	 */
	deleteWeibo: function(id, callback) {
		var state = app.getState();
		callback = callback || $.noop;
		id = id || '';
		var open_id = state.open_id || '';
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.delete('weibo/' + id, function(res) {
			callback(res);
		});
	},

	/**
	 * 获取微博评论列表
	 * @param {object} requstInfo
	 * @param {Object} callback
	 */
	getWeiboCommentList: function(requstInfo, callback) {
		callback = callback || mui.noop;
		requstInfo.weiboId = requstInfo.weiboId || '';
		requstInfo.page = requstInfo.page || '';
		var request = new httpRequest();
		request.addData('page', requstInfo.page);
		request.get('weibo_comment/' + requstInfo.weiboId, function(res) {
			callback(res);
		});
	},

	/**
	 * 获取热门话题列表
	 */
	getHotTopic: function(requstInfo, callback) {
		callback = callback || mui.noop;
		requstInfo.type = requstInfo.type || "";
		requstInfo.page = requstInfo.page || "";
		var request = new httpRequest();
		request.addData('page', requstInfo.page);
		request.addData('type', requstInfo.type);
		request.get('weibo_topic', function(res) {
			callback(res);
		});
	},
	/**
	 *获取单个话题数据
	 */
	getTopicInfo: function(topic_id, callback) {
		callback = callback || mui.noop;
		topic_id = topic_id || "";
		var request = new httpRequest();
		request.get('weibo_topic/' + topic_id, function(res) {
			callback(res);
		});
	},
	/**
	 *获取指定话题的微博列表
	 */
	getWeiboInTopic: function(restInfo, callback) {
		var open_id = app.getState().open_id;
		callback = callback || mui.noop;
		restInfo.topic_id = restInfo.topic_id || "";
		restInfo.page = restInfo.page || "";
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.addData('page', restInfo.page);
		request.get('weibo_topic_list/' + restInfo.topic_id, function(res) {
			callback(res);
		});
	},


	/**
	 * 发送微博评论
	 * @param {Object} info
	 * @param {Object} callback
	 */
	sendComment: function(commentInfo, callback) {
		callback = callback || $.noop;
		commentInfo = commentInfo || {};
		commentInfo.contents = commentInfo.contents || '';
		commentInfo.weibo_id = commentInfo.weibo_id || '';
		commentInfo.to_comment_id = commentInfo.to_comment_id || '';
		commentInfo.method = 'POST';
		commentInfo.open_id = commentInfo.open_id || '';
		var request = new httpRequest();
		request.addData('content', commentInfo.contents);
		request.addData('weibo_id', commentInfo.weibo_id);
		request.addData('to_comment_id', commentInfo.to_comment_id);
		request.addData('open_id', commentInfo.open_id);
		request.post('weibo_comment', function(res) {
			callback(res);
		});
		return false;
	},


	/**
	 * 发送微博
	 * @param {Object} sendInfo 发送数据
	 * @param {Object} callback 回调
	 */
	sendWeibo: function(sendInfo, callback) {
		callback = callback || $.noop;
		sendInfo = sendInfo || {};
		sendInfo.contents = sendInfo.contents || '';
		sendInfo.from = sendInfo.from || '';
		sendInfo.extra = sendInfo.extra || '';
		sendInfo.type = sendInfo.type || 'feed';
		sendInfo.crowd_id = sendInfo.crowd_id || '';
		var request = new httpRequest();
		request.addData('content', sendInfo.contents);
		request.addData('title', sendInfo.title);
		request.addData('cover', sendInfo.cover);
		request.addData('from', sendInfo.from);
		request.addData('type', sendInfo.type);
		request.addData('extra', sendInfo.extra);
		request.addData('crowd_id', sendInfo.crowd_id);
		request.addData('geolocation', sendInfo.geolocation);
		request.post('weibo', function(res) {
			callback(res);
		});
		return false;
	},

	/**
	 * 发送转发
	 * @param {Object} sendInfo 发送数据
	 * @param {Object} callback 回调
	 */
	sendRepost: function(sendInfo, callback) {
		var state = app.getState();
		callback = callback || $.noop;
		sendInfo = sendInfo || {};
		sendInfo.content = sendInfo.content || '';
		sendInfo.from = sendInfo.from || '';
		sendInfo.open_id = state.open_id || '';
		sendInfo.source_id = sendInfo.source_id || '';
		sendInfo.weibo_id = sendInfo.weibo_id || '';
		sendInfo.becomment = sendInfo.becomment || '';

		if (sendInfo.contents == '') {
			return callback('微博不能为空');
		}
		var request = new httpRequest();
		request.addData('content', sendInfo.content);
		request.addData('from', sendInfo.from);

		request.addData('open_id', sendInfo.open_id);
		request.addData('source_id', sendInfo.source_id);
		request.addData('weibo_id', sendInfo.weibo_id);
		request.addData('becomment', sendInfo.becomment);

		request.post('repost', function(res) {
			callback(res);
		});
		return false;
	},

	/**
	 * 点赞列表
	 **/
	getSupportList: function(info, callback) {

		info = info || {};
		callback = callback || $.noop;
		info.appname = info.appname || '';
		info.table = info.table || '';
		info.row = info.row || '';
		info.page = info.page || '';
		var request = new httpRequest();
		request.addData('appname', info.appname);
		request.addData('table', info.table);
		request.addData('row', info.row);
		request.addData('page', info.page);
		request.get('support_list', function(res) {
			callback(res);
		});
	},

	/**
	 * 获取单条微博
	 */
	getSimpleWeibo: function(id, callback) {
		var open_id = app.getState().open_id;
		var id = id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.get('weibo/' + id, function(res) {
			callback(res);
		});
	},

	bindEvent: function() {
		//weibo.bindLazyLoad();
		weibo.bindSupport();
	},
	bindSupport: function() {
		$weibo_support.bindSupport();
	},
	
	/*处理link和share类型微博的跳转事件*/
	ext_weibo_link:function(){
		//打开sharehe和link跳转页面
		mui('#mui-scroll').on('tap', '.link-view', function(event) {
			event.stopPropagation();
			var thisType = this.getAttribute('data-type');
			var thisLink = this.getAttribute('data-link');
			if(thisType == 'link'){
				plus.runtime.openURL(thisLink,function(err){});
			}else{
				var tgtInfo = app.parseShortAddress(thisLink);
				if(tgtInfo.mod == 'news'){
					webtools.openDtlWeb('news',tgtInfo.id);
				}
			}
		},false);
	},
	//获取圈子列表
    getCrowdType:function(callback){
		var request = new httpRequest();
		request.get('weibo_crowd_type', function(res) {
			callback(res);
		});
    },
	//获取圈子列表
    getCommunity:function(commInfo,callback){
		var request = new httpRequest();
		request.addData('flag', commInfo.flag);
		request.addData('page', commInfo.page);
		request.get('weibo_crowd', function(res) {
			callback(res);
		});
    },
    
	//获取圈子详细信息
    getCrowdInfo:function(crowdId,callback){
		var request = new httpRequest();
		request.addData('id', crowdId);
		request.get('weibo_crowd_info', function(res) {
			callback(res);
		});
    },
    
	//关注圈子
    handleCrowd:function(requestInfo,callback){
		var request = new httpRequest();
		request.addData('id', requestInfo.id);
		request.addData('flag', requestInfo.flag);
		request.post('weibo_crowd', function(res) {
			callback(res);
		});
    },
    
	//获取圈子成员
    getCrowdUser:function(requestInfo,callback){
		var request = new httpRequest();
		request.addData('id', requestInfo.id);
		request.addData('page', requestInfo.page);
		request.addData('flag', requestInfo.flag);
		request.get('weibo_crowd_member', function(res) {
			callback(res);
		});
    },
    
	//圈子成员的添加和移除
    manageCrowdUser:function(requestInfo,callback){
		var request = new httpRequest();
		request.addData('id', requestInfo.id);
		request.addData('uid', requestInfo.uid);
		request.addData('flag', requestInfo.flag);
		request.post('weibo_crowd_member', function(res) {
			callback(res);
		});
    },
    
	//圈子贡献值修改
    setCrowdScore:function(requestInfo,callback){
		var request = new httpRequest();
		request.addData('id', requestInfo.id);
		request.addData('uid', requestInfo.uid);
		request.addData('score', requestInfo.score);
		request.put('weibo_crowd_score', function(res) {
			callback(res);
		});
    },
    
	//提升/撤销圈子管理员
    setCrowdAdmin:function(requestInfo,callback){
		var request = new httpRequest();
		request.addData('id', requestInfo.id);
		request.addData('uid', requestInfo.uid);
		request.addData('flag', requestInfo.flag);
		request.put('weibo_crowd_admin', function(res) {
			callback(res);
		});
    },
    
	//圈子所有权转移
    setCrowdAuth:function(requestInfo,callback){
		var request = new httpRequest();
		request.addData('id', requestInfo.id);
		request.addData('uid', requestInfo.uid);
		request.put('weibo_crowd_auth', function(res) {
			callback(res);
		});
    },
    
	//审核新成员
    checkCrowdMember:function(requestInfo,callback){
		var request = new httpRequest();
		request.addData('id', requestInfo.id);
		request.addData('uid', requestInfo.uid);
		request.addData('flag', requestInfo.flag);
		request.post('weibo_crowd_check', function(res) {
			callback(res);
		});
    },
    
	//处理圈子邀请
    checkCrowdInvite:function(requestInfo,callback){
		var request = new httpRequest();
		request.addData('id', requestInfo.id);
		request.addData('flag', requestInfo.flag);
		request.post('weibo_crowd_invite', function(res) {
			callback(res);
		});
    },
    
	//创建圈子
    createCrowd:function(rstInfo,callback){
		var request = new httpRequest();
		request.addData('type', rstInfo.type);
		request.addData('title', rstInfo.title);
		request.addData('logo', rstInfo.logo);
		request.post('weibo_crowd_create', function(res) {
			callback(res);
		});
    },
    
    
	//解散圈子
    delCrowd:function(rstInfo,callback){
		var request = new httpRequest();
		request.addData('id', rstInfo.id);
		request.addData('verify', rstInfo.verify);
		request.delete('weibo_crowd_del', function(res) {
			callback(res);
		});
    },
    
	//圈子信息修改
    setCrowdInfo:function(requestInfo,callback){
		var request = new httpRequest();
		request.addData('id', requestInfo.id);
		request.addData('title', requestInfo.title);
		request.addData('logo', requestInfo.logo);
		request.addData('intro', requestInfo.intro);
		request.addData('notice', requestInfo.notice);
		request.addData('type', requestInfo.type);
		request.addData('allow', requestInfo.allow);
		request.addData('visible', requestInfo.visible);
		request.addData('join_type', requestInfo.join_type);
		request.addData('pay', requestInfo.score);
		request.addData('pay_type', requestInfo.pay_type);
		request.put('weibo_crowd', function(res) {
			callback(res);
		});
    },
	
	/**
	 * @description 注册微博列表页面通用事件监听器
	 * @param {String} container 外部容器的Id或者类名
	 */
	ext_weibo_listener:function(container){
		
		this.ext_weibo_link();
		//打开微博详情页面
		mui(container).on('tap', '.weibo-item', function(event) {
			if(event.target.tagName == "IMG"){
				return;
			}
			var weiboInfo = this.detail_info;
			webtools.openDtlWeb('weibo',weiboInfo.id);
		},false);
		
		//打开微博详情页面
		mui(container).on('tap', '.replyWeibo', function(event) {
			event.stopPropagation();
			var weiboInfo = get_parent_node(this, '.weibo-item').detail_info;
			webtools.openDtlWeb('weibo',weiboInfo.id);
		},false);
		
		// 打开转发原微博页面
		mui(container).on('tap', '.weibo_content .repost_content p', function(event) {
			event.stopPropagation();
			var weiboInfo = get_parent_node(this, '.weibo-item').detail_info.sourceWeibo;
			webtools.openDtlWeb('weibo',weiboInfo.id);
		},false);
		
		//打开转发页面
		mui(container).on('tap', '.repostWeibo', function(event) {
			event.stopPropagation();
			if(app.loginHandle()){
				pauseMusic();
				var weiboInfo = get_parent_node(this, '.weibo-item').detail_info
				webtools.openSingleWeb('../../weibo/view/weibo-repost',weiboInfo);
			}
		},false);
	},

	//actionSheet功能框
	operation:function(container){
		container = container||'body';
		mui(container).on('tap', '.mui-icon-arrowdown', function(event) {
			pauseMusic();
			event.stopPropagation();
			var li = get_parent_node(this, '.weibo-item');
			var id = li.detail_info.id;
			var info = li.detail_info;
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: [{
					title: "删除"
				}, {
					title: "举报"
				}]
			}, function(e) {
				switch(e.index) {
					case 1:
						toast.showLoading('删除中');
						weibo.deleteWeibo(id, function(res) {
							toast.hideLoading();
							if(res.code == 200) {
								var first = myStorage.removeItem("weibo_first_page");
								toast.info('删除微博成功');
								li.parentNode.removeChild(li)
							} else {
								mui.toast(res.info);
							}
						});
						break;
					case 2:
						app.openReportWeb('weibo', info);
						break;
				}
			});
		});
	},
};

/*把微博li添加到list*/
var add_weibo_li = function(arrData, list) {
	for(var index in arrData) {
		var li = get_weibo_li(arrData[index], true);
		list.appendChild(li);
	}
}

//微博点赞
var creat_weibo_support = function(btn){
	var $weibo_support = new support();
	    $weibo_support.create(btn, {
        appname: 'Weibo',
        table: 'weibo',
        jump: 'weibo/index/weiboDetail'
    });
    return $weibo_support;
}
