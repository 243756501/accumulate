var cat = {
	/**
	 * 获取类目
	 */
	getType:function(restInfo,callback){
		var request = new httpRequest();
		request.get('cat_type', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 获取分类信息列表数据
	 */
	getCatList:function(restInfo,callback){
		restInfo = restInfo || '';
		restInfo.id = restInfo.id || '';
		var request = new httpRequest();
		request.addData('id',restInfo.id);
		request.addData('page',restInfo.page);
		request.get('cat_list', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 获取分类信息详情
	 */
	getCatDetail:function(restInfo,callback){
		var open_id = app.getState().open_id ||'';
		restInfo = restInfo || '';
		restInfo.id = restInfo.id || '';
		var request = new httpRequest();
		request.addData('id',restInfo.id);
		request.addData('open_id',open_id);
		request.get('cat_detail', function(res) {
			callback(res);
		});
	},
	
	/**
	 * 获取分类信息的评论
	 */
	getCatComm:function(restInfo,callback){
		var open_id = app.getState().open_id || '';
		restInfo = restInfo || '';
		restInfo.id = restInfo.id || '';
		restInfo.page = restInfo.page || '';
		restInfo.method = restInfo.method || '';
		restInfo.content = restInfo.content || '';
		var request = new httpRequest();
		if(restInfo.method == 'get'){
			request.addData('page',restInfo.page);
			request.get('cat_reply/' + restInfo.id, function(res) {
				callback(res);
			});
		}else if(restInfo.method == 'post'){
			request.addData('open_id',open_id);
			request.addData('content',restInfo.content);
			request.post('cat_reply/' + restInfo.id, function(res) {
				callback(res);
			});
		}else{
			request.addData('open_id',open_id);
			request.delete('cat_reply/' + restInfo.id, function(res) {
				callback(res);
			});
		}
	},
	
	/**
	 * 收藏/取消收藏操作
	 */
	favCat:function(restInfo,callback){
		var open_id = app.getState().open_id || '';
		restInfo = restInfo || '';
		restInfo.id = restInfo.id || '';
		restInfo.method = restInfo.method || '';
		var request = new httpRequest();
		request.addData('id',restInfo.id);
		request.addData('open_id',open_id);
		if(restInfo.method == 'post'){
			request.post('cat_fav', function(res) {
				callback(res);
			});
		}else{
			request.delete('cat_fav', function(res) {
				callback(res);
			});
		}
	},
	
	
	/**
	 *获取 个人分类信息
	 */
	getUserCat:function(restInfo,callback){
		var open_id = app.getState().open_id || '';
		restInfo = restInfo || '';
		var request = new httpRequest();
		request.addData('entity_id',restInfo.id);
		request.addData('page',restInfo.page);
		request.addData('open_id',open_id);
		request.get(restInfo.port, function(res) {
			callback(res);
		});
	},
	
	
	/**
	 *获取分类信息推荐数据
	 */
	getRecomList:function(restInfo,callback){
		restInfo = restInfo || '';
		restInfo.type = restInfo.type || '';
		restInfo.page = restInfo.page || '';
		var request = new httpRequest();
		request.addData('type',restInfo.type);
		request.addData('page',restInfo.page);
		request.get('cat_recom', function(res) {
			callback(res);
		});
	},
	
	
	/**
	 *获取 个人分类信息
	 */
	getCatCenter:function(callback){
		var open_id = app.getState().open_id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.get('cat_center', function(res) {
			callback(res);
		});
	},
	
		
	/**
	 *发布分类信息(官方并未使用此功能)
	 */	
	sendCat:function(restInfo,callback){
		var open_id = app.getState().open_id || '';
		var request = new httpRequest();
		request.addData('open_id',open_id);
		request.addData('entity_id',restInfo.entity_id);
		request.addData('title',restInfo.title);
		request.addData('expirydate',restInfo.expirydate);
		request.addData('place',restInfo.place);
		request.addData('contactnumber',restInfo.contactnumber);
		request.addData('contacts',restInfo.contacts);
		request.addData('details',restInfo.details);
		request.addData('photo',restInfo.photo);
		request.post('cat_send', function(res) {
			callback(res);
		});
	},
};

var catDetailWeb = null;
/**
 * 打开详情页面
 * @param {Object} catId
 */
var openCatWeb = function(catId){
	if(!catDetailWeb){
		catDetailWeb = plus.webview.getWebviewById('cat-detail');
	}
	mui.fire(catDetailWeb,'catChange',{data:catId});
	catDetailWeb.show('slide-in-right');
}

/**
 * 权限验证
 * @param {String} group
 * @param {String} content
 */
var checkCatPms = function(gid,content){
	if(!gid || gid != 0){
		var readGroup = gid.split(',')
	  	var userInfo = JSON.parse(myStorage.getItem('user_info'));
		if(!userInfo || (!apptools.checkPms(userInfo.user_group,readGroup) && !userInfo.is_admin)){
			toast.info(content);
			return false;
		}
	}
	return true;
};
