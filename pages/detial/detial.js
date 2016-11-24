var app = getApp();
var setTitle = function() {
	wx.setNavigationBarTitle({
		title: '查看详情'
	});
};
var setStatus = function(status) {

	if (status) {
		this.setData({
			baoMin: 'hide',
			baoMinChengGong: ''
		});
	} else {
		this.setData({
			baoMin: '',
			baoMinChengGong: 'hide'
		});
	}
};
Page({
	data: {
		disabled: true
	},
	onLaunch:function(){
		wx.showNavigationBarLoading();
	},
	onShow: function() {
		setTitle();
		
	},
	tel: function(e) {
		var phoneNumber = e.target.dataset.tel;
		
		if (!phoneNumber) {
			return;
		}
		wx.makePhoneCall({
			phoneNumber: phoneNumber
		});
	},
	join: function(e) {
		var id = e.target.dataset.id;

		
		var _this = this;
		//调用应用实例的方法获取全局数据
		app.getUserInfo(function(userInfo) {
			console.log(userInfo);
			wx.request({
				url: app.globalData.domain + 'api/wxapp/baomin?id=' + id,
				data: {
					nickName: userInfo.nickName,
					avatarUrl: userInfo.avatarUrl,
					time: app.globalData.getTime()
				},
				method: 'GET',
				success: function(res) {
					setStatus.call(_this, true);
					wx.showToast({
						title: '报名成功',
						icon: 'success',
						duration: 2000
					});
				},
				fail: function() {},
				complete: function() {}
			});
		});
	},
	onLoad: function(options) {

		var _this = this;

		wx.request({
			url: app.globalData.domain + 'api/wxapp/get?id=' + options.id,
			data: {
				time: app.globalData.getTime()
			},
			method: 'GET',
			success: function(res) {
				res.data.map((e)=>{
					if(e._id==options.id){
						_this.setData(e);
					}
				})
				wx.hideNavigationBarLoading();
			}
		});
		//avatarUrl
		wx.request({
			url: app.globalData.domain + 'api/wxapp/activity-user?id=' + options.id,
			data: {
				time: app.globalData.getTime()
			},
			method: 'GET',
			success: function(res) {

				_this.setData({
					users: res.data
				});
				
			}
		});

		app.getUserInfo(function(userInfo) {
			wx.request({
				url: app.globalData.domain + 'api/wxapp/activity-user?id=' + options.id,
				data: {
					time: app.globalData.getTime()
				},
				success: function(res) {
					if (res && res.data && res.data.length) {
						res.data.forEach(function(item) {
							if (item.name === userInfo.nickName) {
								setStatus.call(_this, true);
							}
						});
					}
				}
			});
		});

		setStatus.call(_this, false);
		setTitle();
	}
});