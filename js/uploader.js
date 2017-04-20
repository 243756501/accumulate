var f1 = null;
function appendFile(path) {
  
	var img = new Image();
	img.src = path; // 传过来的图片路径在这里用。
	img.onload = function() {
		var that = this;
		//生成比例 
		var w = that.width,
			h = that.height,
			scale = w / h;
		w = 480 || w; //480  你想压缩到多大，改这里
		h = w / scale;
		//生成canvas
		var canvas = document.createElement('canvas');


		var ctx = canvas.getContext('2d');


		canvas.width = w  
        canvas.height = h;

		ctx.drawImage(that, 0, 0, w, h);

		var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8); //1最清晰，越低越模糊。有一点不清楚这里明明设置的是jpeg。弹出 base64 开头的一段 data：image/png;却是png。哎开心就好，开心就好
		console.log(base64)
		f1=base64
		return base64;    
	}
}


Element.prototype.createUploader = function(option) {
	var $this = this;
	$this.option = option;
	$this.option.limit = $this.option.limit || 9;
	$this.option.title = $this.option.title || "上传图片";

	var $inputNode = document.createElement('input');
	$inputNode.setAttribute('type', 'hidden');
	$inputNode.setAttribute('name', $this.option.input_name);
	$this.appendChild($inputNode);
	$this.inputNode = $inputNode;

	$this.addEventListener('tap', function() {
		var a = [{
			title: "拍照"
		}, {
			title: "从手机相册选择"
		}];
		plus.nativeUI.actionSheet({
			title: $this.option.title,
			cancel: "取消",
			buttons: a
		}, function(b) {
			switch (b.index) {
				case 0:
					break;
				case 1:
					var c = plus.camera.getCamera();
					c.captureImage(function(sucs) {
						console.log(sucs);
						var dsts = "_doc" + sucs.substr(5, 13) + "temp.jpg";
						plus.zip.compressImage({
							src: sucs,
							dst: dsts,
							quality: 45
						}, function(s) {
							plus.io.resolveLocalFileSystemURL(s.target, function(entry) {
								entry.file(function(file) {
									console.log(JSON.stringify(file));
									$this.showImg(file);
								});
							}, function(e) {
								console.log("读取拍照文件错误：" + e.message);
							});
						}, function(err) {
					});
					}, function(er) {
						console.log("error" + JSON.stringify(er));
					}, {});
					break;
				case 2:
					plus.gallery.pick(function(path) {
						if(typeof path == 'string'){
							path = {files:[path]};
						}
						for (var i = 0; i < path.files.length; i++) {
//								console.log(path.files[i]);
							plus.io.resolveLocalFileSystemURL(path.files[i], function(entry) {
								entry.file(function(file) {
									console.log(4444);
									console.log("压缩前：" + file.size / 1024 + "KB");
									if (file.size / 1024 > 1024) {
										var dsts = "_doc" + Date.parse(new Date()) + file.fullPath;
										console.log(file.fullPath);
								        appendFile(file.fullPath);
//											plus.zip.compressImage({
//												src: file.fullPath,
//												dst: dsts,
//												quality: 40
//											}, function(s) {
//												console.log("压缩后：" + s.size / 1024 + "KB");
//												plus.io.resolveLocalFileSystemURL(s.target, function(entry) {
//													entry.file(function(file) {
//														$this.showImg(file);
//													});
//												});
//											}, function(err) {
//												console.log('相册压缩失败！');
//											})
                                     $this.showImg(file.fullPath);
									} else {
										$this.showImg(file);
									}

								});
							});
						}
					}, function() {}, {
						filter: "image",
						multiple: $this.option.multiple
					});
					break;
				default:
					break
			}
		})
	});
	// 添加文件

	$this.showImg = function(file) {
		var ids = $this.inputNode.value.split(',');
		var length = 0;
		if ($this.inputNode.value != '') {
			length = ids.length;
		}


		if (length < $this.option.limit || $this.option.limit == 1) {
			var r = new plus.io.FileReader;
			r.readAsDataURL(file); //Base64
			r.onloadend = function(evt) {
				var base64 = evt.target.result;
				var picInfo = {
					data: base64
				};
				toast.showLoading('上传图片中...');
				app.uploadPic(picInfo, function(res) {
					toast.hideLoading();
					if (typeof(res) == 'object') {
						if (res.code == 200) {

							/*把返回的图片添加到文本域里面*/
							if ($this.option.contentDom) {
								var imageInfo = {
									id: res.data.id,
									url: res.data.path
								}
								$this.option.contentDom.value = $this.option.contentDom.value + '[img' + res.data.id + ']';
								$this.option.imageArr.push(imageInfo);
							}

							if (ids.indexOf(res.data.id) == -1) {
								$this.updateAttachValue('add', res.data.id, $this.inputNode)
								var $showNode = document.getElementById($this.option.showDiv);
								var $divNode = document.createElement('div');
								$divNode.setAttribute('style', 'float: left;');
								$divNode.setAttribute('class', 'mui-col-xs-4');
								if ($this.option.limit == 1) {
									$showNode.innerHTML = '';
								}
								$showNode.appendChild($divNode);

								var $imgNode = document.createElement('img');
								$imgNode.setAttribute('src', base64);
								$imgNode.setAttribute('data-preview-src', base64);
								$imgNode.setAttribute('style', 'width: 100px; height: 100px;');
								$imgNode.setAttribute('data-preview-group', 1);
								$divNode.appendChild($imgNode);
								var $spanNode = document.createElement('span');
								$spanNode.setAttribute('class', 'mui-icon mui-icon-close img-close-btn');
								$spanNode.setAttribute('style', 'position:absolute;top:2px;right:5px;color: #F2F2F2;');
								$spanNode.setAttribute('picture_id', res.data.id);
								$spanNode.setAttribute('id', 'picture_' + res.data.id);
								$divNode.appendChild($spanNode);
								$this.bindCloseBtn(res.data.id)
								mui.previewImage();
							} else {
								toast.info('图片已在队列中');
							}
						} else {
							toast.info(res.info);
						}
					} else {
						toast.info(res.info);
					}

				})
			}
		} else {
			toast.info('超出图片数量限制');
		}
	};


	$this.updateAttachValue = function(type, attachId, obj) {
		if ($this.option.limit == 1) {

			if (type === 'add') {
				obj.value = attachId;
			} else {
				obj.value = '';
			}


			return obj.value;

		} else {
			var attachVal = obj.value;
			var attachArr = attachVal.split(',');
			var newArr = [];
			for (var i in attachArr) {
				if (attachArr[i] !== '' && attachArr[i] !== attachId.toString()) {
					newArr.push(attachArr[i]);
				}
			}
			type === 'add' && newArr.push(attachId);
			obj.value = newArr.join(',');

		}

	}

	$this.bindCloseBtn = function(picture_id) {
		document.getElementById('picture_' + picture_id).addEventListener('tap', function() {
			for (index in $this.option.imageArr) {
				if (picture_id == $this.option.imageArr[index].id) {
					$this.option.imageArr.splice(index, 1);
				}
			}
			this.parentNode.parentNode.removeChild(this.parentNode);
			$this.updateAttachValue('del', picture_id, $this.inputNode)
		});
	}
};