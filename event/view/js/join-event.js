mui.init();

mui.plusReady(function() {
	var thisWeb = plus.webview.currentWebview();
	var eventId = thisWeb.eventId;
	//			console.log(eventId);
	var mButton = document.getElementById('sub');
	mButton.addEventListener('tap', function() {

		var joinInfo = {
			name: document.getElementById('name').value,
			phone: document.getElementById('phone').value,
			id: eventId
		};
		events.joinEvent(joinInfo, function(res) {
			if (res.code == 200) {
				toast.info('报名成功');
				var eventBody = plus.webview.getWebviewById('event-body');
				mui.fire(eventBody, 'eventBody', {
					id: eventId
				});
				var eventDetail = plus.webview.getWebviewById('event-detail');
				mui.fire(eventDetail, 'eventDetail', {
					id: eventId
				});
				setTimeout(function() {
					mui.back();
				}, 1000);
			} else {
				toast.info(res);
			}
		})
	}, false);
})