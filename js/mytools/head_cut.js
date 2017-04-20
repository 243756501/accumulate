 
 /**头像上传插件
  * 使用cropper框架,用到了jquery
  */
document.write("<script language='javascript' src='../../libs/cropper/jquery-2.1.0.js'></script>");
document.write("<script language='javascript' src='../../libs/cropper/cropper.min.js'></script>");
document.write('<link rel="stylesheet" href="../../libs/cropper/cropper.min.css" type="text/css" />'); 

 var myHeadCut = function(options,callback){
 	var own = new Object();
 	own.trigger = options.trigger;	//触发器(必须
 	own.tagImg = options.img;		//剪裁所得图片的放置容器
 	own.callback = callback || $.noop;
 	own.init = function(){
 		var tmplate = '<div id="cut_view"><img id="img_view" src=""/>'+
 		'<nav class="mui-bar mui-bar-tab"><a id="imageCancel"class="mui-tab-item">'+
 		'<span class="mui-icon icon-cross"></span><span class="mui-tab-label">取消</span></a>'+
 		'<a id="imageRote"class="mui-tab-item"><span class="mui-icon icon-loop2"></span>'+
 		'<span class="mui-tab-label">旋转</span></a><a id="imageReset"class="mui-tab-item">'+
 		'<span class="mui-icon icon-shrink"></span><span class="mui-tab-label">重置</span></a>'+
 		'<a id="imageSave"class="mui-tab-item"><span class="mui-icon icon-checkmark"></span>'+
 		'<span class="mui-tab-label">确认</span></a></nav></div>'
 		var popView = document.createElement('div');
 		popView.id = 'pop_view';
 		popView.className = 'mui-popover';
 		popView.style.top = '0';
 		popView.style.width = '100%';
 		popView.innerHTML = tmplate;
 		document.body.appendChild(popView);
 		own.cutView = document.getElementById("cut_view");
 		own.cutImgView = document.getElementById("img_view");
 		own.saveBtn = document.getElementById("imageSave");
 		own.cancelBtn = document.getElementById("imageCancel");
 	};
 	own.init();
		//给头像设置监听事件
	own.trigger.addEventListener('tap', function(e) {
		own.cutView.style.height = document.body.scrollHeight +'px';
		plus.gallery.pick(function(path) {
			mui('#pop_view').popover('toggle');
			own.imgCut(path);
		}, function(err) {
		}, {
			filter: "image"
		});
	})
 	
	//照片裁剪类
	own.imgCut = function(path) {
		own.cutImgView.src = path;
		//图片加载成功后再初始化剪裁控件,避免失败
		own.cutImgView.onload = function(e) {
			$('#img_view').cropper({
			checkImageOrigin: true,
			aspectRatio: 1 / 1,
			autoCropArea: 0.5,
			zoom: -0.2
			});
		};
	}

	//确认剪裁操作
	own.saveBtn.addEventListener('tap',function(){
		var waitView = plus.nativeUI.showWaiting();
		var $image = $('#img_view');
		var dataURL = $image.cropper("getCroppedCanvas");
		var base64Data = dataURL.toDataURL("image/jpeg", 0.5);//图片base64数据,可直接用于页面渲染

		ucenter.setAvatar(base64Data,function(res){
			waitView.close();
			if(res.code == 200){
				own.callback(res);
				own.tagImg.src = base64Data;
				own.tagImg.setAttribute('data-cut',1);
				toast.info('操作成功');
				mui.trigger(own.cancelBtn,'tap');
			}else{
				toast.info(res.info);
			}
		});
	});
	
	//取消剪裁操作
	own.cancelBtn.addEventListener('tap',function(){
		own.cutImgView.src = '';
		mui('#pop_view').popover('hide');
		$('#img_view').cropper('destroy');
	});
	
	//旋转照片
	document.getElementById('imageRote').addEventListener('tap',function(){
		$("#img_view").cropper('rotate', 90);
	});
	//重置选择区域
	document.getElementById('imageReset').addEventListener('tap',function(){
		$("#img_view").cropper('crop');
	});
 }
