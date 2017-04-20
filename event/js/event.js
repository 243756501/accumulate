var events = {
	/**
	 * 活动分类列表
	 */
	getEventClass:function(callback){
		callback = callback || mui.noop;
		var request = new httpRequest();
		request.get('event_type',function(res){
			callback(res);
		});
	},
	
	/**
	 * 获取活动列表
	 */
	getEventList:function(listInfo,callback){
		var state = app.getState();
		callback = callback || mui.noop;
		listInfo = listInfo || '';
		listInfo.page = listInfo.page || '';
		listInfo.type_id = listInfo.type_id || '';
		var request = new httpRequest();
		request.addData('page',listInfo.page);
		request.addData('open_id',state.open_id);
		request.addData('type_id',listInfo.type_id);
		request.get('event_list',function(res){
			callback(res);
		});
	},
	
	/**
	 * 参加活动
	 */
	joinEvent: function(joinInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		joinInfo = joinInfo || {};
		joinInfo.id = joinInfo.id || '';
		joinInfo.name = joinInfo.name || '';
		joinInfo.phone = joinInfo.phone || '';
		if (open_id == ''){
			return callback('请先登录');
		}
	
        if (joinInfo.name == '') {
            return callback('姓名不能为空');
        }
		
		var patterns = new Object();
        patterns.Phone = /^(1[3|4|5|7|8])[0-9]{9}$/;
        if (!patterns.Phone.test(joinInfo.phone)) {
            return callback('请输入正确的手机');
        }
        
		var request = new httpRequest();
		request.addData('name',joinInfo.name);
		request.addData('phone',joinInfo.phone);
		request.addData('open_id',open_id);
		request.addData('event_id',joinInfo.id);
		request.post('event_join',function(res){
			callback(res);
		})
	},
	
	/**
	 * 取消报名
	 */
	quitEvent:function(event_id,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		event_id = event_id || '';
		if (open_id == ''){
			return callback('请先登录');
		}
		var request = new httpRequest();
		request.addData('event_id',event_id);
		request.addData('open_id',open_id);
		request.delete('event_quit',function(res){
			callback(res);
		})
	},
	
	/**
	 * 发起活动
	 */
	sendEvent: function(sendInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		sendInfo = sendInfo || {} ;
		sendInfo.sTime = sendInfo.sTime || '';
		sendInfo.deadline = sendInfo.deadline || '';
		sendInfo.address = sendInfo.address || '';
		sendInfo.explain = sendInfo.explain || '';
		sendInfo.type_id = sendInfo.type_id || '';
		sendInfo.title = sendInfo.title || '';
		sendInfo.eTime = sendInfo.eTime || '';
		sendInfo.cover_id = sendInfo.cover_id || '';
		sendInfo.limitCount = sendInfo.limitCount || '';
		
		if (open_id == ''){
			return callback('请先登录');
		}
		
		var request = new httpRequest();
		request.addData('sTime',sendInfo.sTime);
		request.addData('open_id',open_id);
		request.addData('deadline',sendInfo.deadline);
		request.addData('address',sendInfo.address);
		request.addData('explain',sendInfo.explain);
		request.addData('type_id',sendInfo.type_id);
		request.addData('title',sendInfo.title);
		request.addData('eTime',sendInfo.eTime);
		request.addData('cover_id',sendInfo.cover_id);
		request.addData('limitCount',sendInfo.limitCount);
		request.post('event',function(res){
			callback(res);
		})
	},

	/**
	 * 我的活动
	 */
	myEvent: function(myInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		myInfo = myInfo || {} ;
		myInfo.lora = myInfo.lora || '';
		myInfo.page = myInfo.page || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('page',myInfo.page);
		request.addData('lora',myInfo.lora);
		request.get('event_my',function(res){
			callback(res);
		})
	},
	
	/**
	 * 参与人员列表
	 */
	getJoinUsers:function(joinedInfo,callback){
		var request = new httpRequest();
		request.addData('id',joinedInfo.id);
		request.addData('page',joinedInfo.page);
		request.addData('state',joinedInfo.state);
		request.get('event_member',function(res){
			callback(res);
		})
	},
	
	/**
	 * 审核
	 */
	auditMmb:function(joinedInfo,callback){
		var request = new httpRequest();
		request.addData('id',joinedInfo.id);
		request.addData('uid',joinedInfo.uid);
		request.addData('flag',joinedInfo.flag);
		request.post('event_audit',function(res){
			callback(res);
		})
	},
	
	/**
	 * 审核
	 */
	kickOut:function(rqstInfo,callback){
		var request = new httpRequest();
		request.addData('id',rqstInfo.id);
		request.addData('uid',rqstInfo.uid);
		request.post('event_kick',function(res){
			callback(res);
		})
	},
	
	/**
	 * 获取回复
	 */
	getComment: function(commentInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		commentInfo = commentInfo || {};
		commentInfo.row_id = commentInfo.row_id || '';
		commentInfo.page = commentInfo.page || '';
		var request = new httpRequest();
		request.addData('page',commentInfo.page);
		request.addData('row_id',commentInfo.row_id);
		request.get('event_comment',function(res){
			callback(res);
		})
	},
	
	/**
	 * 发送活动评论
	 */
	sendComment: function(sendInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		sendInfo = sendInfo || {};
		sendInfo.row_id = sendInfo.row_id || '';
		sendInfo.page = sendInfo.page || '';
		sendInfo.content = sendInfo.content || '';
		
		if (open_id == ''){
			return callback('请先登录');
		}
		
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('content',sendInfo.content);
		request.addData('row_id',sendInfo.row_id);
		request.post('event_comment',function(res){
			callback(res);
		})
	},
	
	/**
	 * 删除评论
	 */
	deleteComment: function(deleteInfo,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		deleteInfo = deleteInfo || {};
		deleteInfo.id = deleteInfo.id || '';
		deleteInfo.row_id = deleteInfo.row_id || '';
		
		if (open_id == ''){
			return callback('请先登录');
		}
		
		var request = new httpRequest();
		request.addData('id',deleteInfo.id);
		request.addData('row_id',deleteInfo.row_id);
		request.addData('open_id',open_id);
		request.delete('event_comment',function(res){
			callback(res);
		})
	},
	
	/**
	 * 删除活动
	 */
	deleteEvent: function(deleteId,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		deleteId = deleteId || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.put('event_del/'+deleteId,function(res){
			callback(res);
		})
	},
	
	/**
	 * 关闭活动
	 */
	closeEvent: function(closeId,callback){
		var open_id = app.getState().open_id || "";
		callback = callback || mui.noop;
		closeId = closeId || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.put('event_end/'+closeId,function(res){
			callback(res);
		})
	},
};

var show_category = function (data) {
    var userPicker = new mui.PopPicker();
    var $roleButton = document.getElementById('showUserType');
    var $role_id = document.getElementById('role_id');
    //默认角色赋值
    $roleButton.innerHTML = data[0].title;
    $role_id.value = data[0].id;
    var pickerData = [];
    //记录数组的下标
    var mNum=0;
    for (var item in data) {
        pickerData[mNum] = {value: data[item].id, text: data[item].title};
        mNum++;
        if (data[item].NewsSecond != null){
        	for(var i in data[item].NewsSecond){
        		pickerData[mNum] = {value: data[item].NewsSecond[i].id,text: data[item].NewsSecond[i].title};
        		mNum++;
        	}
        }
    }
    userPicker.setData(pickerData);
//  var userResult = document.getElementById('userResult');
    $roleButton.addEventListener('tap', function (event) {
        userPicker.show(function (items) {
            $role_id.value = items[0].value;
            $roleButton.innerHTML = items[0].text;
            //返回 false 可以阻止选择框的关闭
            //return false;
        	});
    	}, false);
};
