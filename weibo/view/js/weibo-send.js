mui.init({
	beforeback:function(){
//		if(actAttachBarId){
//			resetAttach();
//			return false;
//		}
        var wb=plus.webview.currentWebview();
        if(textArea.value.length!==0)
        {
        	var btnArray=['否','是'];
        	mui.confirm('文字内容是否存为草稿','提醒',btnArray,function(e){
        		if(e.index==1)
        		{
        			myStorage.setItem('weiboValue',textArea.value);
        			wb.close();
        		}
        		else
        		{
        			myStorage.setItem('weiboValue','');
        			wb.close();
        		}
        	})
        	return false;
        }
	}
});
var lgWeibo,setCover;
var textArea = document.getElementById('weibo_detail');
var longView = document.getElementById('long_view');
var funView = document.getElementById('fun_view');
var crowdChooseBtn = document.getElementById("crowd_choose_btn");
var crowdView = document.getElementById("crowd_view");
var showSmileBtn = document.getElementById('show_smile');
var showImgBtn = document.getElementById('show_img');
var imgBadge = document.getElementById('img_badge');
var showRecordBtn = document.getElementById('show_record');
var recBadge = document.getElementById('rec_badge');
var showFriendBtn = document.getElementById('show_friend');
var smileView = document.getElementById('smile_view');
var imgUpView = document.getElementById('img_up_view');
var topicView = document.getElementById('topic_view');
var topicListView = document.getElementById('topic_list_view');
var imgCountView = document.getElementById('img_num');
var recordView = document.getElementById('record_view');
var locationView = document.getElementById('location_view');
var locationClsBtn = document.getElementById('location_cls_icon');
var weiboLimitView = document.getElementById('cost_tpl_title_length');
var weibo_limit;//发布内容字数限制
var imgLoader,upFilePaths,upImgPaths = {};
var screenH = document.body.clientHeight;
var selfWeb,geolocationInfo,locationSwich,crowdId,actAttachBarId = null;
var attachs = {'show_smile':smileView,'show_img':imgUpView,'show_topic':topicView,'show_record':recordView};
var sendInfo = {};
var weibo_type = 'feed';
var maxImgNum = 9,imgUpCount;
imgCountView.innerHTML = maxImgNum;
var atId,atName=[];
var atArray={};

/*录音附件开始*/
var recBtn = document.getElementById("record_btn");
var recTimeView = document.getElementById("record_time");
var recPlayBtn = document.getElementById("record_play_btn");
var recDelBtn = document.getElementById("record_del_btn");
var recStatus,recorder,recPath,recState = null;
var audioPlayer,audioState = null;
var playIcons = ['icon-pause','icon-play3'];	//播放按钮的两个图标
var recIcons = ['icon-mic','icon-pause'];		//录音按钮的两个图标
var recIcon = {rec:'icon-mic',pause:'icon-pause',play:'icon-play3'};

//录音\播放插件中央控制器
var recCtrl = function(flag){
	if(actAttachBarId == 'show_record'){
		recStatus = flag;
		if(audioState)initAudio(false);
	}
}
//初始化录音
var initRec = function (){
	recTimeView.innerText = '00:00';
	recStatus = true;
	initAudio(true);
	recorder = null;
	recPath = null;
}

//开始录音
var startRec = function (callback){
	recorder = plus.audio.getRecorder();
	recorder.record({filename:AUDIOUPDIR,format:'amr'},function (path) {
		callback(path);
	}, function (err) {
		callback(null);
	} );

	var time = 0;
	recState = setInterval(function(){
		if(!recStatus || (time > RECORDLIMIT)){
			stopRec();
		}
		time ++;
		recTimeView.innerText = apptools.timeToStr(time);
	}, 1000 );
}

//停止录音
var stopRec = function (){
	recorder.stop();
	clearInterval(recState);
	recState = null;
}
//播放和删除按钮的显示开关
var playViewSwich = function (toggle){
	recPlayBtn.style.display = toggle?'inline-block':'none';
	recDelBtn.style.display = toggle?'inline-block':'none';
}
//播放按钮的图标切换(不用toggle是为了避免状态混乱
var playBtnToggle = function(toggle){
	if(toggle){
		recPlayBtn.classList.remove(recIcon.pause);
		recPlayBtn.classList.add(recIcon.play);
	}else{
		recPlayBtn.classList.remove(recIcon.play);
		recPlayBtn.classList.add(recIcon.pause);
	}
}
//录音按钮的图标切换(不用toggle是为了避免状态混乱
var recBtnToggle = function(view,toggle){
	if(toggle){
		view.classList.remove(recIcon.pause);
		view.classList.add(recIcon.rec);
	}else{
		view.classList.remove(recIcon.rec);
		view.classList.add(recIcon.pause);
	}
}
//初始化音频播放器
var initAudio = function(flag){
	if(audioState > 0){
		audioPlayer.stop();
		playBtnToggle(true);
	}
	playViewSwich(!flag);
	audioPlayer = null;
	audioState = 0;
}
//录音按钮
recBtn.addEventListener('tap',function(e){
	var iconView = this.getElementsByTagName('i')[0];
	if(iconView.classList.contains('icon-mic')){
		initRec();
		recBtnToggle(iconView,false);
		apptools.hideDom(recBadge);
		startRec(function(path){
			console.log( "录音完成："+ path );
			if(path){
				recPath = path;
				playViewSwich(true);
				recBtnToggle(iconView,true);
				apptools.showDom(recBadge);
			}else{
				stopRec();
				mui.toast('录音失败');
			}
		});
	}else{
		stopRec();
	}

})
//播放按钮
recPlayBtn.addEventListener('tap',function(e){
	if(recPath){
		if(recPlayBtn.classList.contains(recIcon.play)){
			if(!audioState){
				audioPlayer = plus.audio.createPlayer(recPath);
			}
			playBtnToggle(false);
			if(audioState == 2){
				audioPlayer.resume();
			}else{
				audioState = 1;
				audioPlayer.play(function(){
					playBtnToggle(true);
					audioState = 0;
				},function(err){
					console.log('播放失败');
					playBtnToggle(true);
					audioState = -1;
				});
			}
		}else{
			playBtnToggle(true);
			audioPlayer.pause();
			audioState = 2;
		}
	}
})
//删除录音按钮
recDelBtn.addEventListener('tap',function(e){
	apptools.delFile(recPath);
	apptools.hideDom(recBadge);
	initRec();
})

/*录音附件结束*/

//重置附件栏
function resetAttach(){
	if(actAttachBarId){
		//重置录音插件
		recCtrl(false);
		document.getElementById(actAttachBarId).classList.remove('mui-active');
		apptools.hideDom(attachs[actAttachBarId]);
		actAttachBarId = null;
	}
}
/*附件工具按钮切换功能*/
mui('#tools_bar').on('tap','.attach-bar',function(e){
	document.activeElement.blur();
	var targetId = this.id;
	//插件小窗口的切换
	if(attachs[targetId]){
		if(actAttachBarId != targetId){
			resetAttach();
			apptools.showDom(attachs[targetId]);
			actAttachBarId = targetId;
		}else{
			resetAttach();
			return false;
		}
	}else{
		resetAttach();
	}
},false)

document.getElementById("content_body").addEventListener('tap',function(e){
	smileView.style.display = 'none';
})

//文本域获得焦点事件,用于处理附件栏的自动隐藏
textArea.addEventListener('focus',function(e){
	resetAttach();
})
window.addEventListener('resize',function(e){
	if(screenH >document.body.clientHeight){
		apptools.hideDom(funView);
	}else{
		apptools.showDom(funView);
	}
})
//打开好友
showFriendBtn.addEventListener('tap',function(e){
	webtools.createRptWeb('weibo-atfriend',function(rptWeb){
		rptWeb.show('slide-in-right',WEBTRANSTIME);
	});
})
//选择圈子按钮
crowdChooseBtn.addEventListener('tap',function(e){
	resetAttach();
	webtools.createRptWeb('weibo-crowd-choose',function(rptWeb){
		rptWeb.show('pop-in',WEBTRANSTIME);
	});
})
//圈子选择事件
var getCrowdWeb = function(crowdInfo){
	crowdView.style.display = 'inline-block';
	crowdView.innerHTML = crowdInfo.title;
	crowdId = crowdInfo.id;
	crowdView.addEventListener('tap',function(e){
		this.style.display = 'none';
		crowdId = null;
	})
}
//话题选择事件
mui('#topic_list_view').on('tap','.base-topic-label',function(e){
	var topicNmae = this.innerText;
	if(~textArea.value.indexOf(topicNmae)){
		textArea.value = textArea.value.replace(topicNmae,'');
		this.classList.remove('base-ok-label');
	}else{
		this.classList.add('base-ok-label');
		textArea.value = textArea.value + topicNmae + ' ';
	}
	textArea.focus();
	mui.trigger(textArea,'input');
})
document.getElementById("topic_trigger").addEventListener('tap',function(e){
	if(textArea.setSelectionRange) {
    	textArea.focus();
    	setTimeout(function () {
		    textArea.setSelectionRange(textArea.value.length-2,textArea.value.length-2);
		},10)
  	}
})
//添加地址信息
locationView.addEventListener('tap',function(e){
	var textView = this.getElementsByTagName('p')[0];
	locationSwich = locationClsBtn.classList.contains('mui-hidden');
	textView.innerHTML = locationSwich?geolocationInfo.addresses:'分享所在的位置';
	locationClsBtn.classList.toggle('mui-hidden');
	textView.classList.toggle('base-ok-color');
})
//@选择好友
var getfriend = function(checkedValues,checkedNames) {
	var HTML = [];
	atArray={};
    atId=checkedValues.split(",");
    atName=checkedNames.split("/");
	for (i = 0; i < atId.length; i++) {
        HTML.push(" "+'@'+atName[i]+" ");
        atArray[" "+'@'+atName[i]+" "]=atId[i];
	}
    textArea.value = textArea.value + HTML.toString(); 
	mui.trigger(textArea,'input');
}

mui.plusReady(function () {
	
	var selfWeb = plus.webview.currentWebview();
	var weiboValue=myStorage.getItem('weiboValue');
	if(weiboValue!==null)
	{
		textArea.value=weiboValue;
	}
	geolocationInfo = JSON.parse(myStorage.getItem('user_location'));
	if(!geolocationInfo||!geolocationInfo.addresses){
		locationView.style.display = 'none';
	}
		//图片上传插件
	imgLoader = new ImgLoader({
		list:'image_list',
		btn:'add_btn',
		paths:upImgPaths,
		max:maxImgNum
	},function(count){
		imgUpCount = count;
		imgCountView.innerHTML = maxImgNum - imgUpCount;
		imgBadge.innerHTML = imgUpCount;
		if(imgUpCount > 0){
			apptools.showDom(imgBadge);
		}else{
			apptools.hideDom(imgBadge);
		}
	});
	//接受传值
	locaData = selfWeb.data||{};

	if(locaData.type == 'long'){ //发布长微博
		apptools.showDom(longView);
		showRecordBtn.style.display = 'none';
		imgLoader.textView = textArea;
		lgWeibo = {
			title:document.getElementById("long_title"),
			cover:document.getElementById("long_cover")
		}
		lgWeibo.cover.addEventListener('tap',function(e){
			widget.imgClip(true,function(info){
				lgWeibo.cover.src = info.imgStr;
				sendInfo.cover = info.id;
			});
		})
		//文本域获得焦点事件,用于处理附件栏的自动隐藏
		lgWeibo.title.addEventListener('focus',function(e){
			resetAttach();
		})
	}
	if(locaData.flag == 'crowd'){
		getCrowdWeb(locaData.data);
	}
	
	selfWeb.show('slide-in-right',WEBTRANSTIME);
	selfWeb.setStyle({
		'softinputMode': 'adjustResize'
	});

    showSmileBtn.createExpression({target:textArea,showDiv: smileView});
	
	weibo_limit = 200||app.getConfig('weibo').weibo_max||1000;
	textArea.maxLength = weibo_limit;
	textArea.oninput = function(e){
		var rem = weibo_limit - textArea.value.length;
		if(rem < 0){
			weiboLimitView.style.color = 'red';
		}else{
			weiboLimitView.style.color = '#8f8f94';
		}
		weiboLimitView.innerHTML = '还可以输入'+ rem + '字';
	}
	//

    //发布微博
    var send_weibo = function(){
        var waitView = plus.nativeUI.showWaiting('发布中...');
		UploaderTool(weibo_type).doUps(upFilePaths,function(resPaths){
			if(typeof(resPaths) == 'string'){
				waitView.close();
				mui.alert(resPaths);
				return;
			}
			var attach_ids = [];

			for(var name in resPaths){
				attach_ids.push(resPaths[name].id);
			}
			var sendText = textArea.value;
			if(locaData.type == 'long'){
				sendText = apptools.fmtRichText(sendText,resPaths);
			}
            sendText=apptools.atCompile(sendText);
            sendText=apptools.newlineCompile(sendText);
	        sendInfo.contents= sendText;
	        sendInfo.from= get_from();
	        sendInfo.extra= JSON.stringify({"attach_ids": attach_ids.toString()});
	        sendInfo.type= weibo_type;
	        sendInfo.crowd_id= crowdId;
	        sendInfo.geolocation= locationSwich?JSON.stringify(geolocationInfo):'';

	        weibo.sendWeibo(sendInfo, function (res) {
	        	waitView.close();
	            if (res.data) {
	                mui.toast('发布成功');
	                var weiboMain = plus.webview.getWebviewById('nav_weibo');
	                weiboMain.evalJS('add_weibo_to_list('+JSON.stringify(res.data)+')');
	                textArea.value="";
	                mui.back();
	            } else {
	                mui.toast(res.info);
	            }
	        })
		});
    };
    
    /*发送按钮*/
    document.getElementById('send_btn').addEventListener('tap', function () {
    	resetAttach();
        if (app.loginHandle()) {
            if(locaData.type == 'long'){
            	weibo_type = 'long_weibo';
            	if (!lgWeibo.title.value.trim()) {
	                mui.alert("标题不能为空");
	                return;
	            }
            	if (lgWeibo.title.value.length >100) {
	                mui.alert("标题长度不能高于100");
	                return;
	            }
            	if (textArea.value.length < 50) {
	                mui.alert("内容长度不能低于50");
	                return;
	            }
            	upFilePaths = upImgPaths;
	        	sendInfo.title = lgWeibo.title.value;
            	send_weibo();
            }else{
	            if (!textArea.value.trim()) {
	                mui.alert("发布内容不能为空。");
	                return;
	            }
	            if(textArea.value.length > weibo_limit){
	            	mui.alert("发布内容长度超出限制");
	                return;
	            }
		        if(recPath && imgUpCount > 0){
		        	weibo_type = 'image';
		        	mui.confirm('声音和图片不支持同时发布，请选择保留发布哪项？','发布提示',['声音','图片','取消'],function(e){
		        		if(e.index == 2){
		        			return;
		        		}else if(e.index == 0){
		        			weibo_type = 'voice';
		        			upFilePaths = {'rec':recPath};
		        		}
						send_weibo();
		        	})
		        }else{
		        	if(recPath){
		        		weibo_type = 'voice';
		        		upFilePaths = {'rec':recPath};
		        	}else if(imgUpCount >0){
	      			    upFilePaths = upImgPaths;
		        		weibo_type = 'image';
		        	}
		        	send_weibo();
		        }
            }
        }
    }, false);
    /*推荐话题*/
   //TODO 获取的res使用数据库保存下来
	weibo.getHotTopic({type:'hot'},function(res){
		for(var index in res.data){
			var topicInfo =  res.data[index];
			if(topicInfo.name.trim()){
				var item = document.createElement('div');
				item.className = 'base-topic-label mui-ellipsis';
				item.innerHTML = '#' +topicInfo.name + '#';
		   		topicListView.appendChild(item);
			}
		}
	})
});