mui.init();
var showTypeBtn = document.getElementById('showUserType');
var scoreShowBtn = document.getElementById('score_show_btn');
var scoreListPopover = document.getElementById('score_list_popover');
var scoreListView = document.getElementById('score_list_view');
var questionTitle = document.getElementById('title');
var scoreTitle = document.getElementById('score_title');
var scoreIpt = document.getElementById('score_ipt');
var questionContent = document.getElementById('question_content');
var sendBtn = document.getElementById('send_btn')
var scoreTypes,mainWeb;
var typeInfos = null;
var restInfo = {leixing:1,score_num:0};
var imgLoader, upImgPaths = {};

/*设置积分类型*/
var setScore = function(scoreInfo){
	apptools.setOkcolor(scoreTitle);
	scoreTitle.innerHTML = scoreInfo.title;
	restInfo.leixing = scoreInfo.id;
	restInfo.score_num = scoreInfo.amount;
}

mui.plusReady(function(){
	
	mainWeb = plus.webview.getWebviewById('nav_question');
	apptools.webBlur();
	imgLoader = new ImgLoader({
		list:'image_list',
		btn:'add_btn',
		textView:'question_content',
		paths:upImgPaths
	});

	/*获取积分数额*/
	app.getUserData(is_login(),function(res){
		if(res.data){
			var systemCfg = app.getConfig('system');
			scoreTypes = systemCfg.score_list;
			for(var index in scoreTypes){
				var scoreInfo = scoreTypes[index];
				scoreInfo.amount = res.data['score' + scoreInfo.id];
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell';
				li.data_info = scoreInfo;
				li.innerHTML = com_render_html(scoreInfo,'pop_radio');
				scoreListView.appendChild(li);
				if(index == 0){
					setScore(scoreInfo);
				}
			}
		}else{
			toast.info('积分数据获取失败');
		}
	})
	
	/*问答分类*/
	typeInfos = myStorage.getItem('question_type');
	if(typeInfos){
		typeInfos = JSON.parse(typeInfos);
		var typeArr = [];
		for(index in typeInfos){
			var navInfo = typeInfos[index];
			var pickerEle = {
				value:navInfo.id,
				text:navInfo.title
			}
			typeArr.push(pickerEle);
			if(navInfo.child){
				for(ind in navInfo.child){
  					var SepickerEle = {
      					value:navInfo.child[ind].id,
      					text:'<--' + navInfo.child[ind].title
      				}
  					typeArr.push(SepickerEle);
				}
			}
		}
		var userPicker = new mui.PopPicker();
		userPicker.setData(typeArr);
		apptools.pickerHide(userPicker,showTypeBtn);
		showTypeBtn.addEventListener('tap', function(event){
			document.activeElement.blur();
			userPicker.show(function(items){
				if(items[0].text.indexOf('<') >= 0){
					showTypeBtn.innerText = items[0].text.substring(3,items[0].text.length);
				}else{
  					showTypeBtn.innerText = items[0].text;
				}
  				showTypeBtn.setAttribute('type-id',items[0].value);
  				apptools.setOkcolor(showTypeBtn);
				//return false 可以阻止选择框的关闭
			});
		}, false);
	}
	
	/*提交按钮*/
	sendBtn.addEventListener('tap',function(e){
		var description = questionContent.value;
		var scoreAmount = scoreIpt.value;
		var title = questionTitle.value;
		var typeId = showTypeBtn.getAttribute('type-id');
		if(!apptools.checkScore(scoreAmount,restInfo.score_num)){
			return;
		}

		if(!title.trim() || !description.trim()){
			mui.alert('问题标题和内容不能为空');
			return;
		}
		if(!typeId){
			mui.alert('请选择问题分类');
			return;
		}
		var waitView = plus.nativeUI.showWaiting('提交问题...');
		/*把内容中的图片锚点替换为url*/
		UploaderTool('image').doUps(upImgPaths,function(resPaths){
			if(typeof(resPaths) == 'string'){
				waitView.close();
				mui.alert(resPaths);
				return;
			}
			send_submit(resPaths);
		});
		
		/*提交操作*/
		function send_submit(list){
			description = apptools.fmtRichText(description,list);
			restInfo = {
				typeId:showTypeBtn.getAttribute('type-id'),
				title:title,
				description:description,
				score_num:scoreAmount
			}
			question.askQuestion(restInfo,function(res){
				plus.nativeUI.closeWaiting();
				if(res.data){
					toast.info('发布成功');
					mainWeb.evalJS('add_first('+JSON.stringify(res.data)+')');
					mui.back();
				}else{
					toast.info(res.info);
				}
			})
		}
	});
});

//积分类型选择
scoreShowBtn.addEventListener('tap',function(e){
	mui('#score_list_popover').popover('toggle');
},false)
mui('#score_list_popover').on('tap','a',function(e){
	var scoreInfo = get_parent_node(this,'.mui-table-view-cell').data_info;
	setScore(scoreInfo);
	mui.trigger(scoreShowBtn,'tap');
},false)
scoreListPopover.addEventListener('hidden',function(e){
	scoreShowBtn.classList.remove('mui-active');
},false)
scoreIpt.addEventListener('input',function(){
	if(!apptools.checkScore(this.value,restInfo.score_num)){
		scoreIpt.value = '';	
	}
})