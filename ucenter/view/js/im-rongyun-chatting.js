mui.init({
	beforeback: function() {
		imMainWeb.evalJS('getUnreadCount()');
		tool.showHide(attachs[dom.activeId], false);
		return true;
	},
	gestureConfig: {
		tap: true, //默认为true
		doubletap: true, //默认为false
		longtap: true, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold: true, //默认为false，不监听
		release: true //默认为false，不监听
	}
});
//初始化对象变量
var dom = {
	sendBtn: mui('#sendBtn')[0],
	clearBtn: mui('#setting')[0],
	expressBtn: mui('#chatExpression')[0],
	recordBtn: mui('#recordBtn')[0],
	recordTxt: mui('#recordText')[0],
	recordConfirm: mui('#recordConfirm')[0],
	recordDelete: mui('#recordDelete')[0],

	sendtxt: mui('#sendTxt')[0],
	chatName: mui('#chatName')[0],
	toolView: mui('#imchatTool')[0],
	voiceView: mui('#imchatTool_voice')[0],
	expressView: mui('#imchatTool_expression')[0],
	otherView: mui('#imchatTool_other')[0],
	voiceCount: mui('#voiceCount')[0],
	chatList: mui('#chatList')[0],

	activeId: null,
	targetId: null,
	Isfirst: true,
	record: [],
	tgUser: null,
	conversation: null,
	imageObject: null,
	base64: null,
	imgurl: null,
	IntervalObj: null,
	recordObj: null,
	recordPath: null,
	isOk: 1,
	voiceBase64: null,
	voiceUrl: null,
	duration: 0,
	time: 0,
	playState: 0,
	playingObj: null,
	playAimObj: null,
	audioObj: null,
	voiceIconSelfArray: ['../../images/icon/icon-im-voice-self-one.png', '../../images/icon/icon-im-voice-self-two.png', '../../images/icon/icon-im-voice-self-three.png'],
	voiceIconArray: ['../../images/icon/icon-im-voice-one.png', '../../images/icon/icon-im-voice-two.png', '../../images/icon/icon-im-voice-three.png'],
	voiceIconInterval: null,
	posLatitude:null,
	posLongitude:null,
	posPoi:null,
}
//工具栏映射对象
var attachs = {
	'chatVoice': dom.voiceView,
	'chatExpression': dom.expressView,
	'chatOther': dom.otherView
};
//消息类型
var msgType_attachs = {
	'text': 'TextMessage',
	'image': 'ImageMessage',
	'voice': 'VoiceMessage',
	'location':'LocationMessage',
}
//tap等监听事件初始化
var initEvent = function(currentWeb, mainWeb, plus) {
	//工具栏icon点击事件
	mui('#imchatNav').on('tap', '.mui-icon', function() {
		document.activeElement.blur();
		dom.targetId = this.id;
		if(dom.targetId == "chatPictrue") {
			//todo访问本地相册
			tool.showHide(attachs[dom.activeId], false);
			tool.galleryImgSelect();
			return;
		}
		if(dom.activeId !== dom.targetId) {
			tool.toolViewClick();
		} else {
			tool.showHide(attachs[dom.targetId], dom.Isfirst)
			dom.Isfirst = !dom.Isfirst;
		}
		dom.activeId = dom.targetId;
	}, false)
	//监听input内是否有值来觉得按钮是否可以被点击
	//		dom.sendtxt.addEventListener('input', function(e) {
	//			this.value.length != 0 ? dom.sendBtn.disabled = "" : dom.sendBtn.disabled = true;
	//		});
	/*软键盘上的确认按钮*/
	window.addEventListener('keypress', function(event) {
		if(event.keyCode == 13) {
			mui.trigger(ui.footerRight, 'tap');
		}
	});
	//顶部右侧清空按钮
	dom.clearBtn.addEventListener('tap', function() {
		plus.nativeUI.actionSheet({
			cancel: '取消',
			buttons: [{
				title: '清空消息'
			}]
		}, function(e) {
			switch(e.index) {
				case 1:
					dom.record = [];
					dom.chatList.innerHTML = "";
					break;
				default:
					break;
			}
		});
	});
	currentWeb.addEventListener('show', function() {
		dom.chatList.style.visibility = 'visible';
		mainWeb.evalJS('read_msg()');
	});
	currentWeb.addEventListener('tap', function() {
		dom.chatList.style.visibility = "hide";
		if(mui.os.ios) {
			document.activeElement.blur();
		}
	});
	//监听当工具栏显示的时候，点击输入框，则隐藏工具栏
	dom.sendtxt.addEventListener('tap', function() {
		tool.showHide(attachs[dom.activeId], false);
	});
	//发送按钮点击事件
	dom.sendBtn.addEventListener('tap', function() {
		tool.sendMsgType(msgType_attachs['text']);
	}, false);
	//内容变化监听器
	window.addEventListener('con_change', function(e) {
		var tmpData = e.detail.data;
		var msgList = tmpData.msgList;
		dom.tgUser = tmpData.tgUser || dom.tgUser;
		var isdownMsg = tmpData.isdownMsg;
		if(!dom.conversation || dom.conversation.targetId != tmpData.convs.targetId) {
			dom.conversation = tmpData.convs;
			dom.chatName.innerHTML = dom.tgUser.name;
			dom.chatList.innerHTML = "";
			dom.record = [];
		}
		if(msgList.length > 0) {
			if(isdownMsg) {
				for(var i = msgList.length; i > 0; i--) {
					tool.pushRecord(msgList[i], dom.tgUser, isdownMsg);
				}
			} else {
				for(var i in msgList) {
					tool.pushRecord(msgList[i], dom.tgUser, isdownMsg);
				}
			}
			tool.bindChatList(mainWeb, !isdownMsg);
		}
	});
	dom.recordBtn.addEventListener('hold', function(e) {
		if(dom.recordPath !== '') {
			tool.resetRecord();
		}
		dom.recordTxt.innerText = "松开结束录音";
		tool.startRecord(function(voiceObj) {
			dom.recordPath = voiceObj.path;
			dom.recordState = 1;
			dom.duration = voiceObj.duration;
			console.log(dom.recordPath + " " + dom.duration);
		})
	});
	dom.recordBtn.addEventListener('release', function(e) {
		dom.recordTxt.innerText = "按住说话";
		tool.endRecord();
	});
	dom.recordDelete.addEventListener('tap', function() {
		mui.toast('录音删除...');
		tool.resetRecord();
	});
	dom.recordConfirm.addEventListener('tap', function() {
		//将音频文件转成base64
		UploaderTool('voice').getBase64(dom.recordPath, function(filebase) {
			dom.voiceBase64 = filebase.data;
			UploaderTool().doUp64(filebase, function(res) {
				dom.voiceUrl = res.data.path;
				tool.sendMsgType(msgType_attachs['voice']);
				tool.showHide(dom.voiceView, false);
				tool.resetRecord();
			})
		})
	});
	//用户更改事件
	window.addEventListener('userChange', function(e) {
		userInfo = JSON.parse(myStorage.getItem('user_info'));
		dom.chatList.innerHTML = "";
		dom.record = [];
	})
	//聊天列表语音消息点击事件
	mui('#chatList').on('tap', '.im-voice-btn', function(e) {
		voice_load(this);
	});
	//其他工具点击事件(位置等)
	mui('#imchatTool_other').on('tap', '.chat-other-li', function() {
		var type = this.id;
		switch(type) {
			case 'other_location':
				var btnArray = ['确定', '取消'];
				mui.confirm('是否向好友发送您的位置信息', '定位', btnArray, function(e) {
					if(e.index == 0) {
						tool.getLocation(function(position) {
							console.log(JSON.stringify(position));
							dom.posLongitude=position.coords.longitude;
							dom.posLatitude=position.coords.latitude;
							dom.posPoi=position.addresses;
							tool.sendMsgType(msgType_attachs['location']);
							tool.showHide(dom.otherView,false);
						});
					} else {
					}
				});
				break;
			default:
				break;
		}
	});
	//位置分享信息点击事件
	mui('#chatList').on('tap','.chat-item-location',function(){
		var longitude,latitude,aimUserPic,aimUserName,sender=null;
		longitude=this.getAttribute('longitude');
		latitude=this.getAttribute('latitude');
		aimPoi=this.getAttribute('aimpoi');
		sender=this.getAttribute('sender');
		aimUserName=dom.chatName.innerHTML;
        var data={
            longitude:longitude,
			latitude:latitude,
			aimPoi:aimPoi,
			aimUserName:aimUserName,
			sender:sender
	    }
        webtools.openSingleWeb('im-rongyun-chat-map',data,'','')
    });
}
//辅助方法
var tool = {
	//定位服务
	getLocation: function(callback) {
		plus.geolocation.getCurrentPosition(function(postion) {
			//执行了
			callback(postion);
		}, function(err) { mui.toast('获取位置信息失败...') });
	},
	//语音消息开始播放
	startPlay: function(voicePath, obj) {
		dom.playState = 1;
		dom.playingObj = dom.playAimObj;
		dom.audioObj = plus.audio.createPlayer(voicePath);
		tool.voiceIconStart(obj, true);
		dom.audioObj.play(function() { tool.endPlay(obj); }, function(err) { tool.endPlay(obj); });
	},
	//语音消息结束播放
	endPlay: function(obj) {
		dom.audioObj.stop();
		dom.audioObj = null;
		dom.playState = 0;
		tool.voiceIconStart(obj, false);
	},
	//语音消息播放icon动画
	voiceIconStart: function(obj, sw) {
		var childNodesVal;
		var IsSelf = obj.getAttribute('self');
		var timeCount = 0;
		IsSelf == 'true' ? childNodesVal = 1 : childNodesVal = 0;
		if(sw) {
			dom.voiceIconInterval = setInterval(function() {
				if(timeCount < 3) {
					childNodesVal == 1 ? obj.childNodes[1].setAttribute('src', dom.voiceIconSelfArray[timeCount]) : obj.childNodes[0].setAttribute('src', dom.voiceIconArray[timeCount]);
					timeCount++;
					if(timeCount == 3) {
						timeCount = 0;
					}
				}
			}, 500);
		} else {
			clearInterval(dom.voiceIconInterval);
			childNodesVal == 1 ? obj.childNodes[1].setAttribute('src', '../../images/icon/icon-im-voice-self.png') : obj.childNodes[0].setAttribute('src', '../../images/icon/icon-im-voice.png');
		}
	},
	//音频播放
	voicePlay: function(obj, path) {
		//播放状态0开始/结束，1播放中
		dom.playAimObj = obj;
		if(dom.playState == 0) {
			tool.startPlay(path, dom.playAimObj);
		} else {
			tool.endPlay(dom.playingObj);
			tool.startPlay(path, dom.playAimObj);
		}

	},
	//重置状态方法
	resetRecord: function() {
		tool.showHide(dom.recordConfirm, false);
		tool.showHide(dom.recordDelete, false);
		dom.voiceCount.innerHTML = "00:00";
		dom.time = 0;
		if(dom.recordPath !== "") {
			apptools.delFile(dom.recordPath);
			dom.recordPath = "";
		}
	},
	//结束录音
	endRecord: function(callback) {
		dom.recordObj.stop();
		clearInterval(dom.IntervalObj);
		if(dom.time > 30) {
			return;
		}
		tool.showHide(dom.recordConfirm, true);
		tool.showHide(dom.recordDelete, true);
	},
	//开始录音
	startRecord: function(callback) {
		dom.recordObj = plus.audio.getRecorder();
		dom.IntervalObj = setInterval(function() {
			dom.time++;
			dom.voiceCount.innerHTML = apptools.timeToStr(dom.time);
			if(dom.time > 30) {
				tool.resetRecord();
				dom.time = 1;
				mui.toast('录音时间过长，请保持在30s内...');
			}
		}, 1000);
		dom.recordObj.record({
			filename: AUDIOUPDIR,
			format: 'amr'
		}, function(path) {
			var voiceObj = {
				path: path,
				duration: dom.time
			};
			callback(voiceObj);
		}, function(err) {
			console.log('录音失败...');
		})
	},
	//单个dom显示和隐藏
	showHide: function(dom, key) {
		if(dom != null) {
			key == true ? dom.style.display = "block" : dom.style.display = "none";
		}
	},
	//两个dom显示和隐藏
	switchHide: function(showdom, hidedom) {
		showdom.style.display = "block";
		hidedom.style.display = "none";
	},
	//工具栏点击事件方法
	toolViewClick: function() {
		if(dom.activeId !== null) {
			tool.switchHide(attachs[dom.targetId], attachs[dom.activeId]);
			tool.resetRecord();
		} else {
			tool.showHide(attachs[dom.targetId], true);
		}
	},
	//显示软键盘
	showKeyboard: function() {
		if(mui.os.ios) {
			var webView = plus.webview.currentWebview().nativeInstanceObject();
			webView.plusCallMethod({
				"setKeyboardDisplayRequiresUserAction": false
			});
		} else {
			var Context = plus.android.importClass("android.content.Context");
			var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
			var main = plus.android.runtimeMainActivity();
			var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
			imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
			//var view = ((ViewGroup)main.findViewById(android.R.id.content)).getChildAt(0);
			imm.showSoftInput(main.getWindow().getDecorView(), InputMethodManager.SHOW_IMPLICIT);
			//alert("ll");
		}
	},
	bindChatList: function(isScroll) {
		dom.chatList.innerHTML = template('chatList_template', {
			'record': dom.record
		});
		mui('.mui-scroll-wrapper').scroll().reLayout();
		mui('.mui-scroll-wrapper').scroll().scrollToBottom();
//		console.log(dom.chatList.offsetHeight);
	},
	//发送信息
	sendMsg: function(inMainWeb, msg) {
		dom.expressView.style.display = "none";
		imMainWeb.evalJS('send_msg(' + JSON.stringify(msg) + ')');
	},
	pushRecord: function(msg, tgUser, isdownMsg) {
		msg.timeAt = apptools.friendlyDate(msg.sentTime);
;		msg.sender = 'other';
		if(msg.messageDirection == 1) {
			msg.sender = 'self';
			msg.uid = userInfo.uid;
			msg.head = userInfo.avatar128;
		} else {
			msg.uid = tgUser.uid;
			msg.head = tgUser.head;
		}
		if(isdownMsg) {
			dom.record.unshift(msg);
		} else {
			dom.record.push(msg);
		}
	},
	//发送信息
	sendPicInfo: function() {
		if(dom.isOk == 2) {
			tool.sendMsgType(msgType_attachs['image']);
			dom.isOk = 1;
		} else {
			dom.isOk++;
		}
	},

	//选择图片
	galleryImgSelect: function() {
		plus.gallery.pick(function(success) {
			var path = success.files[0];
			//var bitmap = new plus.nativeObj.Bitmap("64");
			var imgLoader = new ImgLoader({
				maxSize: 30,
				quality: 50,
				isRongYun: true,
			});
			var imgLoader2 = new ImgLoader();
			imgLoader.getImgInfo(path, function(zipImg) {
				var zipPath = zipImg.url;
				if((zipImg.size / 1024) > 45) {
					zipPath = "../../images/img_error.png";
				}
				imgLoader2.getImgInfo(path, function(zipImg) {
					var zipPath = zipImg.url;
					UploaderTool('image').getBase64(zipPath, function(fileBase) {
						UploaderTool().doUp64(fileBase, function(res) {
							dom.imgurl = res.data.path; //网络大图地址
							tool.sendPicInfo();
						})
					})
				})
				UploaderTool('image').getBase64(zipPath, function(fileBase) {
					dom.base64 = fileBase.data;
					tool.sendPicInfo();
				})
			})

		}, function(error) {}, {
			filter: "image",
			multiple: true,
			maximum: 1,
			system: false,
			onmaxed: function() {
				plus.nativeUI.alert('最多只能选择1张图片');
			}
		});
	},
	//发送信息内容分类
	sendMsgType: function(Msgtype) {
		var imMainWeb = plus.webview.getWebviewById('nav_im');
		var tempContent = dom.sendtxt.value.replace(new RegExp('\n', 'gm'), '<br/>');
		if(Msgtype == 'TextMessage') {
			if(tempContent == '') {
				return;
			}
			tool.sendMsg(imMainWeb, {
				sender: 'self',
				conversationType: 1,
				messageType: Msgtype,
				content: tempContent.trim(),
				targetId: dom.conversation.targetId,
				uid: userInfo.uid,
				head: userInfo.head,
			});
		} else if(Msgtype == 'ImageMessage') {
			tool.sendMsg(imMainWeb, {
				sender: 'self',
				conversationType: 1,
				targetId: dom.conversation.targetId,
				messageType: Msgtype,
				uid: userInfo.uid,
				head: userInfo.head,
				content: dom.base64,
				imageUri: dom.imgurl,
			})
		} else if(Msgtype == 'VoiceMessage') {
			console.log('发送语音消息')
			tool.sendMsg(imMainWeb, {
				sender: 'self',
				conversationType: 1,
				targetId: dom.conversation.targetId,
				messageType: Msgtype,
				uid: userInfo.uid,
				head: userInfo.head,
				content: dom.voiceBase64,
				duration: dom.duration,
				extra: dom.voiceUrl
			});
		} else if(Msgtype=='LocationMessage')
		{
			console.log('发送位置消息');
			tool.sendMsg(imMainWeb,{
				sender:'self',
				conversationType:1,
				targetId:dom.conversation.targetId,
				messageType:Msgtype,
				uid:userInfo.uid,
				head:userInfo.head,
				content:dom.posLatitude,
				latitude:dom.posLatitude,
				longitude:dom.posLongitude,
				poi:dom.posPoi,
				extra:dom.posLatitude
			});
		}
		document.activeElement.blur();
		dom.sendtxt.value = "";
	},
}

mui.plusReady(function() {
	template.config('escape', false); //编码不输出html字符
	var chatWeb = plus.webview.currentWebview();
	imMainWeb = plus.webview.getWebviewById('nav_im'); //im主页面所有im任务都在这个页面执行
	initEvent(chatWeb, imMainWeb, plus);
	userInfo = JSON.parse(myStorage.getItem('user_info'));
	dom.expressBtn.createExpression({
		target: dom.sendtxt,
		showDiv: dom.expressView
	});
	mui.previewImage();
});