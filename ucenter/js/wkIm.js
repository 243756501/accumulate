var wkIm = {
	
	
	/**
	 * 获取悟空IM凭证
	 */
	getIMToken:function(callback){
		var open_id = app.getState().open_id || "";
		var request = new httpRequest();
		request.addData('open_id', open_id);
		request.get('IMToken', function(res) {
			callback(res);
		});
	},
	
	
	
	/**
	 * 批量获取用户简单数据
	 */
	getUserInfos:function(userArr,callback){
		userArr = userArr ||'';
		var request = new httpRequest();
		request.addData('id', userArr);
		request.get('user_list', function(res) {
			callback(res);
		});
	},
	
}

/*认证悟空IM服务器*/
var wkim_login =function(change){
	if(change){
		wkIm.getIMToken(function(res){
			if(res.code == 200){
				var wkimAuthInfo = res.data;
				myStorage.setItem('wkim_token_info',JSON.stringify(wkimAuthInfo));
		    	WKim.auth.login(wkimAuthInfo).then(function (token){});
			}else{
				toast.info('获取im服务器证书失败');
			}
		});
	}else{
		var wkimTKinfo = JSON.parse(myStorage.getItem('wkim_token_info'));
		WKim.auth.login(wkimTKinfo).then(function (token){});
	}
};

/*悟空会话对象*/
var wk_conversion = {

    /**
     * 创建会话
     * @method create
     * @param {object} options
     * @return {promise}
     */
    create: function (openid, callback) {
        var title = '[' + WKim.auth.getOpenId() + ']与[' + openid + ']的聊天';
        if (typeof openid == 'object') {
            if (openid.length > 1) {
                title = '群聊';
            }
        } else {
            openid = [openid];
        }

        // 例如
        var options = {
            openIds: openid,
            title: title, // 仅群聊有效
            icon: "11", // 仅群聊有效
            map: {"a": "123"},
            tag: 0
        };

        WKim.conversation.create(options).then(function (Conv) {
            callback(Conv);
            // 得到会话实例Conv，可使用其成员方法
        });
        // return '';
    },

    /**
     * 删除会话
     * @param cid
     * @param callback
     */
    remove: function (cid, callback) {
        WKim.conversation.remove(cid).then(function (res) {
            callback(res)
        });

    },


    /**
     * 获取会话列表
     * @method list
     * @param {long} cursor 游标位置
     * @param {int} count 数量
     * @return {object} convList
     * @return {promise}
     */
    getList: function (cursor, count, callback) {
        WKim.conversation.list(cursor, count).then(function (convList) {
            callback(convList);
        });
    },


    /**
     * 获取一个会话对象
     * @method get
     * @param {string} cid conversationId
     * @return {object} conv instance
     * @return {promise}
     */
    getConv: function (cid, callback) {
        WKim.conversation.get(cid).then(function (Conv) {
            callback(Conv);
            //
        });
    }


};