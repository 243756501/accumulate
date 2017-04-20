/**
 * 自定义组件。一些通用的选择窗口
 */
var widget = {
	/**
	 * 打开积分类型选择面板
	 * @param {Object} scoreTypes
	 * @param {Function} callback
	 */
	scorePanel:function(scoreTypes,callback){
		callback = callback||mui.noop;
		scoreTypes = scoreTypes||app.getConfig('system').score_list;
		plus.nativeUI.actionSheet({
			title:"选择积分类型",
			cancel:"取消",
			buttons:scoreTypes
		}, function(e){
			callback(scoreTypes[e.index-1]);
		});
	},
	
	/**
	 * 图片剪裁插件
	 * @param {Boolean} flag 是否是长方形
	 * @param {Function} callback
	 */
	imgClip:function(flag,callback){
		window.setCover = function(res){
			callback(res);
		}
		mui.openWindow({
			url:'../../libs/widget/img-cut.html',
			id:'img-cut',
			extras:{data:flag},
			show:{autoShow:false},waiting:{autoShow:false}
		})
	}
}
