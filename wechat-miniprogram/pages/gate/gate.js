Page({
  onLoad() {
    if (wx.getStorageSync("sx-disclaimer-ok") === "1") {
      wx.switchTab({ url: "/pages/index/index" });
    }
  },
  accept() {
    wx.setStorageSync("sx-disclaimer-ok", "1");
    wx.switchTab({ url: "/pages/index/index" });
  },
  goAbout() {
    wx.navigateTo({ url: "/pages/about/about" });
  },
});
