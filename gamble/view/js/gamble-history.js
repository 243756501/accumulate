			mui.init();
			var historyTd = document.getElementById("gambleTable");
			var loading = document.getElementById("loading");
			var loaded = document.getElementById("loaded");
			var postInfo = {
				'page': 1
			};
			var getGambleItem = function(data) {
				data.prize_time=apptools.getLocalTime(data.prize_time)
				var tr = document.createElement('tr');
				tr.className = "mui-text-center";
				tr.innerHTML = template('gamble_result_script', data);
				return tr;
			}
			mui.plusReady(function() {
				mui('.mui-scroll').pullToRefresh({
					down: {
						callback: function() {
							var pullObj = this;
							postInfo.page = 1;
							apptools.clearTable('gambleTable');
							gamble.getGamHistory(postInfo, function(res) {
								if(res.data) {
									for(i in res.data) {
										var tr = getGambleItem(res.data[i]);
										historyTd.appendChild(tr);
										pullObj.endPullDownToRefresh(true);
										pullObj.refresh();
										res.data.length < 10 ? pullObj.endPullUpToRefresh(true) : pullObj.endPullUpToRefresh(false);
										changePage(loaded, loading, true);
									}
								} else {
									pullObj.endPullDownToRefresh(true);
									pullObj.endPullUpToRefresh(true);
									mui.toast('历史期数获取失败...');
								}
							})
						}
					},
					up: {
						auto: true,
						callback: function() {
							var pullObj = this;
							gamble.getGamHistory(postInfo, function(res) {
								if(res.data) {
									for(i in res.data) {
										var tr = getGambleItem(res.data[i]);
										historyTd.appendChild(tr);
										res.data.length < 10 ? pullObj.endPullUpToRefresh(true) : pullObj.endPullUpToRefresh(false);
										changePage(loaded, loading, true);
										postInfo.page++;
									}
								} else {
									pullObj.endPullUpToRefresh(true);
									mui.toast('历史期数获取失败...');
								}
							})
						}
					}
				})
			})