/**
 * Created by Administrator on 15-8-26.
 */


var support = function() {
	var $this = this;

	$this.picker = '';
	$this.option = {};
	//  $this.list = [];
	$this.create = function(picker, opt) {
		$this.option = opt;
		$this.picker = picker;
		//      $this.getMySupport();
	};
	//console.log(JSON.stringify($this));
	//  $this.getMySupport = function(){
	//      app.mySupport({appname:$this.option.appname,table:$this.option.table},function(res){
	//          $this.list = res.data || [];
	//      });
	//      //return true;
	//  };
	$this.bindSupport = function() {

		var $picker = document.getElementsByClassName($this.picker);
		for (var i = 0; i < $picker.length; i++) {
			var row_id = $picker[i].getAttribute('row-id');
			//          if(typeof($this.list) == 'undefined' ||  $this.list.length == null || $this.list.length == 0){
			//              $this.getMySupport();
			//          }
			//          if(typeof($this.list) != 'undefined' &&  $this.list.length != null && $this.list.length != 0){
			//              if( $this.list.indexOf(row_id) != -1){
			//                  $picker[i].getElementsByTagName('i')[0].style.color = 'red';
			//              }
			//          }
			var is_bind_event = $picker[i].getAttribute('is_bind_event');
			if (is_bind_event == 0 || is_bind_event == null) {

				$picker[i].addEventListener('tap', function(event) {
					event.stopPropagation();
					if (is_login()) {
						/**
						 * 暂时解决点赞冲突的问题。
						 */
						try{
							is_bind_event = this.children[0].children[0].getAttribute('is_bind_event')||this.getAttribute('is_bind_event');
						}catch(e){
							is_bind_event = this.getAttribute('is_bind_event');
						}
						if (is_bind_event != 1) {

							this.setAttribute('is_bind_event', 1);
							var $thisbtn = this;
							var row_id = $thisbtn.getAttribute('row-id');
							console.log(this.getAttribute('row-id'))
							var appname = $this.option.appname;
							var table = $this.option.table;
							var jump = $this.option.jump;
							var info = {
								appname: appname,
								table: table,
								row: row_id,
								jump: jump
							};

							app.support(info, function(res) {
								if (res.code == 200) {
									$thisbtn.getElementsByTagName('i')[0].style.color = 'red';
									//                          if($this.list.length>0){
									//                              $this.list.push(row_id);
									//                          }else{
									//                              $this.list = [row_id];
									//                          }
									toast.info(res.info);
									if ($thisbtn.getElementsByTagName('span').length) {
										var $span = $thisbtn.getElementsByTagName('span')[0];
										$span.innerHTML = parseInt($span.innerText) + 1;
									}
								}else{
									toast.info(res.info);
								}
							})
						} else {
							toast.info('不能重复点赞');
						}
					} else {
						toast.info('请先登录');
					}

				},false)

			}
		}
	}
};