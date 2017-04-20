document.write("<script language='javascript' src='../../libs/imgtools/md5.min.js'></script>");
document.write("<script language='javascript' src='../../js/mytools/net_tools.js'></script>");
//设置背景图时,去掉图片灰色边框,第一次使用请检查路径是否正确!!
var img_translate="../../images/translate.png";

var taskQueue = new Array(); //下载队列
var isStartTask = false; //是否开启下载任务
//var IMGDOWNDIR = '_downloads/images/';//图片缓存目录,已移到config.js里面
var ZIPTAG = 'zip_';	//压缩文件标记
var zipSize = 50*1024;//压缩阈值，默认50kb
var zipQuality = 50;//压缩质量(1-100质量递增,默认值50)

/**
 * 通过设置src默认图,来触发onload的方法,如果本地不存在,则联网下载,保存至本地,
 * 所以src默认图,必须设置,否则无法触发onload;
 * 图片高于预设阈值会被压缩,
 * 缺点:图片的压缩很消耗性能,没有缓存的多图列表滚动的时候可能会有点卡,得等到图片加载完就好了
 * 格式如下:
 * <img src='默认图片' data-src='网络地址' onload='load(this)'/>
 */
function load(obj) {
	if(obj.getAttribute('data-loaded')) return;
	var image_url = obj.getAttribute('data-src');
	if (!image_url || !~image_url.indexOf('http')) return;
	//本地缓存路径
	if(mui.os.ios){
		image_url = image_url.replace(/http:\/\//,'https://');
	}
	var imgName = ZIPTAG + md5(image_url) + '.jpg';
	var imgZipPath = IMGDOWNDIR + imgName;
	var sdZipPath = plus.io.convertLocalFileSystemURL(imgZipPath); //SD卡绝对路径
	//temp用于判断图片文件是否存在(此种方式比plus.io.resolveLocalFileSystemURL快十倍以上)
	var temp = new Image();
	var ori_check = false;
	temp.src = sdZipPath;
	temp.onload = function(e) {
//		console.log('已存在,直接显示==' + temp.src);
		setLoaded(obj,temp.src);
	};
	temp.onerror = function() {
		if(ori_check){
//			console.log('不存在==开始下载' + temp.src);
			obj.setAttribute('img-name', imgName);
			taskQueue.push(obj);
		}else{
			ori_check = true;
			temp.src = sdZipPath.replace(ZIPTAG,'');
		}
		//启动下载
		if (!isStartTask) {
			isStartTask = true;
			startTask();
		}
	};
}

/*图片处理失败回调*/
function errBack(errInfo){
	startTask();
	console.log(JSON.stringify(errInfo));
}
/**
 * 图片任务下载 
 * 递归调用方式保持只有一个downloader在下载,避免批量创建downloader手机发烫
 */
function startTask() {	
	if (taskQueue.length == 0) {
		isStartTask = false;
		return;
	}
	//从任务集合中取一个任务
	var obj = taskQueue.shift();
	var image_url = obj.getAttribute('data-src');
	var imgName = obj.getAttribute('img-name');
	var imgZipPath = IMGDOWNDIR + imgName;
	var locaOriPath = IMGDOWNDIR + imgName.replace(ZIPTAG,'');
	var sdOriPath = plus.io.convertLocalFileSystemURL(locaOriPath); //SD卡绝对路径
	//检查是否已经下载过,避免downloader文件存在时无回调,手机发烫;
	var temp = new Image();
	temp.src = sdOriPath;
	//图片压缩,复制,渲染处理
	function dealImg(locaPath){
		//ios不能识别plus.io.convertLocalFileSystemURL转化的绝对地址，除非在前面加上file：//前缀
		//也可以识别如_downloads/开始的相对地址
		plus.io.resolveLocalFileSystemURL(locaPath, function(entry){
			entry.file(function(imgFile){
				if(imgFile.size > zipSize){	//高于阈值需要压缩图片后显示
					plus.zip.compressImage({
						src: locaPath, dst: imgZipPath,
						quality:zipQuality, overwrite:true,width:'100%'
					}, function(zipImg) {
						setLoaded(obj,zipImg.target);
						startTask();
					},errBack)
				}else{	//低于压缩阈值的图片直接显示
					setLoaded(obj,imgFile.fullPath);
					startTask();
				}
			},errBack)
		},errBack);
	}
	temp.onload = function(e) {
		//已下载则跳过
		dealImg(locaOriPath);
	};
	temp.onerror = function() {		
		var loader = new Downloader(image_url,locaOriPath);
		loader.run(function(resInfo){
			if(resInfo && resInfo.totalSize){
				dealImg(resInfo.filename);
			}else{
				startTask();
				apptools.delFile(locaOriPath);
			}
		});
	};
}

/*给<img>设置背景,标志加载成功*/
function setLoaded(obj,bg_url) {
	if (obj.getAttribute("data-loaded")) return;
//	obj.classList.add("img-opacity");
	obj.setAttribute("data-loaded", true);//标记成功
	obj.setAttribute("src",bg_url);
}