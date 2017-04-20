document.write("<script language='javascript' src='../../js/mytools/net_tools.js'></script>");
/**
 * 页面图片加载器
 * 用于选择上传图片
 * 安卓4.4.4和ios8.3版本以下不支持promise,因此禁止多选模式
 * @param {Object} options 配置参数对象,参看imgLoader
 */
var ImgLoader = function(options,callback){
	callback = callback || mui.noop;
	options = options||{};
	var imgLoader = new Object();
	imgLoader = {
		imgListView: document.getElementById(options.list),				//html图片容器Id
		addBtn: document.getElementById(options.btn),					//图片添加按钮Id
		textView: document.getElementById(options.textView),			//如果要把图片添加到文本域里需得提供的文本域Id
		max: options.max || 5,							//最大上传数限制(默认值为5;-1为无限制)
		multiple: options.multiple,						//是否支持多选(默认值支持)
		maxSize:options.maxSize || 200,					//图片压缩阈值(高于此值才会压缩),单位：kb(默认值为200)
		quality:options.quality || 50,					//图片压缩的质量(1-100质量递增,默认值50)
		paths:options.paths || {},						//待上传图片(格式为关联数组)
		isRongYun:options.isRongYun || null,            //针对融云缩略图只能30k以下
	};
	var index = 0;		//添加过的图片(包括删除的图片,主要用于给图片命名)
	var imgCount = 0;	//待上传图片的数目
	var limit = 0;		//如果是多选，一次选取图片的最大数目(multiple值为true才有效)
	var osInfo = mui.os;	//手机系统信息
	//安卓4.4.4和ios8.3版本以下不支持promise，因此禁止多选模式
	if(osInfo.ios && apptools.fmtVersion(osInfo.version) < 830 || osInfo.android && apptools.fmtVersion(osInfo.version) < 444){
		imgLoader.multiple = false;
		imgLoader.max = 1;
	}

	var system = mui.os.android && imgLoader.multiple?false:true;	//android多选模式下使用h5+相册,否则图片数目限制无效
	
	//获取html上存在的待上传图片
	imgLoader.getImgItemList = function() {
		return [].slice.call(imgLoader.imgListView.querySelectorAll('.image-item'));
	};
	//添加图片
	imgLoader.addFile = function(filePath){
		var imgTmpName = 'image' + index;
		/*如果有必要则把图片添加到文本域里面*/
		if (imgLoader.textView) {
			imgLoader.textView.value = imgLoader.textView.value + '[#' + imgTmpName + '#]';
		}
		imgLoader.paths[imgTmpName] = filePath;
		index++;
		imgCount++;
		callback(imgCount);
	}
	
	//删除图片地址
	imgLoader.delFile = function(imgName){
		delete imgLoader.paths[imgName];
		imgCount --;
		imgCount = imgCount > 0?imgCount:0;
		callback(imgCount);
	}
	
	//生成一个带小X的图片html
	imgLoader.getImgItem = function(){
		var imgItem = document.createElement('div');
		imgItem.setAttribute('class', 'image-item');
		imgItem.setAttribute('data-name', 'image' + index);
		//删除图片小X按钮
		var closeButton = document.createElement('div');
		closeButton.setAttribute('class', 'image-close');
		closeButton.innerHTML = 'X';
		imgItem.appendChild(closeButton);
		//小X的点击事件
		closeButton.addEventListener('tap', function(event) {
			setTimeout(function() {
				var imgName = imgItem.getAttribute('data-name');
				imgLoader.imgListView.removeChild(imgItem);
				imgLoader.delFile(imgName);
				/*如果有必要则把文本域里面的锚点删除*/
				if (imgLoader.textView) {
					imgLoader.textView.value = imgLoader.textView.value.replace('[#'+ imgName +'#]','');
				}
			}, 0);
			return false;
		}, false);
		return imgItem;
	}
	
	//添加图片到html
	imgLoader.showImg = function(imgInfo){
		var imgItem = imgLoader.getImgItem();
		imgItem.style.backgroundImage = 'url(' + imgInfo.url + ')';
		imgLoader.imgListView.appendChild(imgItem);	//把图片渲染到页面上
		imgLoader.addFile(imgInfo.url);				//把待上传图片存起来
	}
	
	//获得一个压缩图片
	imgLoader.getImgInfo = function(imgPath,callback){
		plus.io.resolveLocalFileSystemURL(imgPath, function(entry) {
			entry.file(function(file) {
				if(file.size / 1024 > imgLoader.maxSize) {
					var dsts = IMGUPDIR+ file.name;
					//判断目标图片是否已压缩，若已经压缩过则直接使用，否则压缩
					plus.io.resolveLocalFileSystemURL(dsts, function(entry) {
						entry.file(function(file) {
							file.url = 'file://' + file.fullPath;
							callback(file);
						});
					}, function(error) {
						//目标图片没有压缩过则压缩
//						var lessen=Math.sqrt((imgLoader.maxSize*1024)/file.size)*100+'%';
                        var lessen=100+'%';
                        if(imgLoader.isRongYun!==null)
                        {
                        lessen=Math.sqrt((imgLoader.maxSize*1024*8)/(file.size*24))*100+'%';
                        dsts=IMGUPDIR+file.size+file.name;
                        }                
						plus.zip.compressImage({src: imgPath,dst: dsts,quality: imgLoader.quality,format:'jpg',width:lessen,height:lessen,overwrite:true}, function(zipImg) {
							zipImg.url = zipImg.target;
							callback(zipImg);
						}, function(err) {
							callback(null);
						})
					})
				} else {
					file.url = 'file://' + file.fullPath;
					callback(file);
				}
			});
		},function(err){
			callback(null);
		});
	}
	
	//获取一个图片promise
	imgLoader.getImgPromise = function(imgPath){
		var promise = new Promise(function(resolve, reject){
			imgLoader.getImgInfo(imgPath,function(info){
				if(info){
					resolve(info);
				}else{
					reject('图片获取失败');
				}
			});
		})
		return promise;
	}
	
	//添加图片按钮
	if(imgLoader.addBtn){
		imgLoader.addBtn.addEventListener('tap',function(e){
			limit = imgLoader.max - imgCount; 
			if(limit == 0){
				plus.nativeUI.alert('超出图片上传数目限制');
				return;
			}
			
			plus.gallery.pick(function(localPaths) {
				
				if(typeof localPaths == 'string'){	//图片单选时的处理方式
					imgLoader.getImgInfo(localPaths,function(imgInfo){
						imgLoader.showImg(imgInfo)
					}) 
				}else{	//图片多选的处理方式(需要调用ems6 的promise对象，安卓4.4.4和ios8.3以下不支持)
					var promises = localPaths.files.map(function (path) {
					  	return imgLoader.getImgPromise(path).then(function(imgInfo){
							imgLoader.showImg(imgInfo)
						});
					})
				}
			}, function(e){},{
				multiple:imgLoader.multiple,
				maximum:limit,
				system:system,
				onmaxed:function(){
					plus.nativeUI.alert('超出图片上传数目限制');
			   	}
			});
		},false)
	}
	return imgLoader;
}