document.write("<script language='javascript' src='../../config.js'></script>");
document.write("<script language='javascript' src='../../libs/imgtools/md5.min.js'></script>");
document.write("<script language='javascript' src='../../libs/imgtools/imgload.js'></script>");
document.write('<link rel="stylesheet" href="../../css/detail.content.css" type="text/css" />'); 

var imgTools = {
	//处理图文混排的内容
	getDtlContent:function(tmpContent){
		if(tmpContent){
			tmpContent = tmpContent.replace(/href="[^"]*"/gi,'');
			var imgTextArr = tmpContent.match(/<img[^>]+>/g);
			for(var i in imgTextArr){
				var tmpText = imgTextArr[i];
				tmpText = tmpText.replace(tmpText.substring(tmpText.indexOf('img')+3,tmpText.indexOf('src')),'');
				var imgUrl = tmpText.split('"')[1];
				if(!imgUrl){
					imgUrl = tmpText.split("'")[1];
				}
				if(imgUrl && imgUrl.indexOf('http') < 0){
					imgUrl = APP_BASE.domain + imgUrl;
				}
				tmpContent = tmpContent.replace(imgTextArr[i],'<img class="detail-img" onload="load(this)" src="../../images/mediaImages/df_big.png" data-src="'+imgUrl+'" data-preview-src="'+imgUrl+'" data-preview-group="2"/>');
			}
		}
		return tmpContent;
	}
}
