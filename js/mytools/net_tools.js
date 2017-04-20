//下载器
var Downloader = function(netUrl, locaPath) {
	if(mui.os.ios) {
		netUrl = netUrl.replace(/http:\/\//, 'https://');
	}
	var task = plus.downloader.createDownload(netUrl, {
		"filename": locaPath
	});
	
	//错误回调
	var errBack = function(callback){
		task.abort();
		callback(null);
		apptools.delFile(locaPath);
	}
	//开始下载
	this.run = function(callback){
		var intval = setInterval(function(){
			if(task.state == 0){
				errBack(callback);
			}
			clearInterval(intval);
		},1500)
		task.addEventListener("statechanged", function(download, status){
			if(download.state == 4) {
				if(status == 200 && download.downloadedSize > 0) {
					callback(download);
				}else{
					errBack(callback);
				}
			} else if(status == 404) {
				//下载失败
				errBack(callback);
			}
		}, false);
		task.start();
	}
}

/**
 * 文件上传器
 * 支持单文件或者多文件的base64码上传
 */
var UploaderTool = function(atchType) {
	var own = this;
	own.type = atchType && atchType == 'voice' ? 'voice' : 'image';
	var fileBase;
	/**
	 * 转base64
	 * @param {String} path 本地路径
	 */
	own.getBase64 = function(path,callback) {
			callback = callback || mui.noop;
			plus.io.resolveLocalFileSystemURL(path, function(entry) {
				entry.file(function(file) {
					var reader = new plus.io.FileReader();
					reader.onloadend = function(evrnt) {
						// Get base64 data
						fileBase = {
							data: evrnt.target.result,
							type: own.type
						};
						callback(fileBase)
					};
					reader.readAsDataURL(file);
				})
			}, function(err) {
				console.log('文件路径错误')
			})		
		}
		/*
		 * base64上传
		 */
	    own.doUp64 = function(fileBase,callback) {
			app.uploadAttach(fileBase, function(res) {
				callback(res);
				console.log('返回的网络地址：'+JSON.stringify(res))
			});
		}
		/**
		 * 上传
		 * @param {String} path 本地路径
		 * @param {Function} callback
		 */
	own.doUp = function(path, callback) {
		callback = callback || mui.noop;
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			entry.file(function(file) {
				var reader = new plus.io.FileReader();
				reader.onloadend = function(evrnt) {
					// Get base64 data
					var fileBase = {
						data: evrnt.target.result,
						type: own.type
					};
					app.uploadAttach(fileBase, function(res) {
						callback(res);
						console.log(JSON.stringify(res));
					});
				};
				reader.readAsDataURL(file);
			})
		}, function(err) {
			callback({
				info: '文件路径错误,请重新选择'
			});
		})
	};
	/**
	 * 获取一个上传promise(多文件上传使用)
	 * ps:安卓4.4.4和ios8.3以下不支持
	 */
	own.getUpPromise = function(upFile) {
		var promise = new Promise(function(resolve, reject) {
			own.doUp(upFile.path, function(res) {
				if(res.code == 200) {
					var netData = {};
					netData[upFile.name] = res.data;
					resolve(netData);
				} else {
					reject(res.info);
				}
			});
		})
		return promise;
	};

	/**
	 * 单文件或者多文件上传(支持地址重复的情况)
	 * ps:安卓4.4.4和ios8.3以下不支持
	 * @param {Object} paths 待上传的文件集合（关联数组对象）,允许重复的地址值
	 * @param {Object} callback
	 */
	own.doUps = function(paths, callback) {
		callback = callback || mui.noop;
		var explain = {}; //解释器
		var resPaths = {}; //上传成功接收的网络地址
		var upPaths = []; //真正需要上传的地址（剔除了重复的地址）
		outloop: for(var name in paths) {
			var path = paths[name];
			if(upPaths.length != 0) {
				for(var i in upPaths) {
					if(path == upPaths[i].path) {
						explain[name] = upPaths[i].name;
						break outloop;
					}
				}
			}
			explain[name] = 'p' + name;
			upPaths.push({
				name: 'p' + name,
				path: path
			});
		}

		/*若只有一个文件则使用传统的方式上传,否则也使用poromise*/
		if(upPaths.length == 1) {
			for(var name in paths) {
				own.doUp(upPaths[0].path, function(res) {
					if(res.code == 200) {
						resPaths[name] = res.data;
						callback(resPaths);
					} else {
						callback(res.info);
					}
				})
			}
		} else if(upPaths.length > 1) {
			/*批量上传,如果有一个上传失败,都判定为失败*/
			Promise.all(upPaths.map(function(upFile) {
				return own.getUpPromise(upFile);
			})).then(function(resList) {
				var fileList = {};
				for(var i in resList) {
					mui.extend(fileList, resList[i]);
				}
				for(var name in explain) {
					resPaths[name] = fileList[explain[name]];
				}
				callback(resPaths);
			}).catch(function(err) {
				callback(err);
			})
		} else {
			callback(null);
		}
	};
	return this;
};