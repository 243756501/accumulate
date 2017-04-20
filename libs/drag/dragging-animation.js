var tap_animation = function(targetdom) {
	var pointX = 0;
	var pointY = 0;
	document.getElementById(targetdom).addEventListener('drag', function(e) {
		pointX = e.detail.deltaX;
		pointY = e.detail.deltaY;
	})
	$(window).load(function() {
		var tl = new TimelineMax({
				paused: true
			}),
			tlback = new TimelineMax({
				paused: true
			})
		tl
			.set('.home', {
				className: '+=active'
			})
			.set('.item', {
				scale: 1
			}) // fix for a bug when on of the item was appearing at 0.5 scale
			.to('.home', 0.1, {
				scale: 1.2,
				yoyo: true,
				repeat: 1
			})
			//控制主按钮点击时移动位置
			.to('.home', 0.3, {
				x: 0,
				y: 0,
				ease: Elastic.easeOut.config(1, 0.5)
			}, 0)
			//子菜单出现的起点
			.staggerFrom('.item', 0.4, {
				left: pointX - 10,
				top: pointY + 20,
				autoAlpha: 0,
				scale: 1,
				ease: Elastic.easeOut.config(1, 1)
			}, 0.1);

		tlback
			.set('.home', {
				className: '-=active'
			})
			//回收到哪个店
			.staggerTo('.item', 0.7, {
				left: pointX - 10,
				top: pointY + 20,
				autoAlpha: 0,
				scale: 1,
				ease: Elastic.easeOut.config(1, 0.5)
			}, 0.1)
			.to('.home', 0.3, {
				x: 0,
				y: 0,
				ease: Power2.easeOut
			}, 0.5);

		$(document).on('click', '.home:not(.active)', function(e) {
			event.preventDefault();
			tl.play(0);
		});
		$(document).on('click', '.home.active', function(e) {
			event.preventDefault();
			TweenMax.to($(this), 0.05, {
				scale: 1.5,
				yoyo: true,
				repeat: 1,
				onComplete: function() {
					tlback.play(0)
				}
			});
		});

		$(document).on('click', '.item', function(e) {
			event.preventDefault();
			TweenMax.to($(this), 0.1, {
				scale: 1.5,
				yoyo: true,
				repeat: 1,
				onComplete: function() {
					tlback.play(0)
				}
			});
			//这里的定时800毫秒是根据动画的时间来得出的700毫秒的返回和100毫秒的渐变
			var targetId = this.id;

			if(targetId){
				if(targetId=="weibo-send"){
					if(app.loginHandle()){
						plus.webview.create('../../weibo/view/weibo-send.html','weibo-send',null,{});
					}
				}else if(targetId =='send_long'){
					if(app.loginHandle()){
						plus.webview.create('../../weibo/view/weibo-send.html','weibo-send',null,{data:{type:'long'}});
					}
				}else{
					setTimeout(function(){
						webtools.createRptWeb(targetId , function(e) {
							e.show('pop-in', WEBTRANSTIME);
						});						
					},800)
				}
			}else{
				mui.toast('该功能暂未开放敬请期待！');
				return;
			}
		});

	});
}