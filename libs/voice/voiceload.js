/*删除指定文件*/
var del_file_voice = function(locaPath, callback) {
	callback = callback || mui.noop;
	plus.io.resolveLocalFileSystemURL(locaPath, function(entry) {
		entry.remove(function(entry) {
			callback(true);
			//			console.log("文件删除成功==" + locaPath);
		}, function(e) {
			callback(false);
			//			console.log("文件删除失败=" + locaPath);
		});
	});
}

//下载器
var Downloader_voice = function(netUrl, locaPath) {
		var dloader = this;
		var task = plus.downloader.createDownload(netUrl, {
			"filename": locaPath
		});
		//开始下载
		dloader.run = function(callback) {
			task.addEventListener("statechanged", function(download, status) {
				if(download.state == 4) {
					if(status == 200 && download.downloadedSize > 0) { // 下载完成 
						callback(download);
					} else {
						callback(null);
						//下载失败,取消下载任务,需删除本地临时文件,否则下次进来时会检查到图片已存在
						//download.abort();取消任务,但有时会删除文件失败,固使用delFile(locaPath)先进行删除
						del_file(locaPath);
					}
				} else if(status == 404) {
					//下载失败
					callback(null);
					download.abort();
				}
			}, false);
			task.start();
		}
		return dloader;
	}
//只需要一个网络地址和一个相对地址就可以了
var taskQueue_voice = new Array(); //下载队列
var start_key= false; //是否开启下载任务
function voice_load(obj) {
	//判断是否已经加载过，加载过则不执行这个方法
	var netUrl = obj.getAttribute('src');
	if(!netUrl || !~netUrl.indexOf('http')) return;
	//md5转码之后的路径
	var voiceName = md5(netUrl) + '.amr';
	//拼接之后为相对地址
	var locaPath = AUDIODOWNIR + voiceName;
	//判断文件路径（文件对象）是否存在,支持多种路径
	plus.io.resolveLocalFileSystemURL(locaPath, function(entry) {
		//如果存在,直接显示
		setVoice_loaded(obj, locaPath);
	}, function(e) {
		//如果不存在，则开启下载任务,推入下载队列		
		taskQueue_voice.push(obj);
		//启动下载
		if(!start_key) {
			start_key = true;
			startvoice_Task();
		}
	});
}

//启动下载
function startvoice_Task() {
	//如果没有下载任务了就关闭下载
	if(taskQueue_voice.length == 0) {
		start_key= false;
		return;
	}
	var download_obj = taskQueue_voice.shift();
	var netUrl = download_obj.getAttribute('src');
	var locaPath = AUDIODOWNIR + md5(netUrl) + '.amr';
	var loader_voice = new Downloader_voice(netUrl, locaPath);
	loader_voice.run(function(resInfo) {
		if(resInfo) {
			setVoice_loaded(download_obj,locaPath);
		    startvoice_Task();	
		} else {
			startvoice_Task();
			del_file_voice(locaPath);
		}
	})
}

//加载数据
function setVoice_loaded(obj, url) {
	obj.setAttribute("voice-src", url);
	var type=obj.getAttribute('type');
	if(type=='im')
	{
	 tool.voicePlay(obj,url);
	}
	else
	{
	 voicePlayer(obj);	
	}	
}