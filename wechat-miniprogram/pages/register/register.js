const logic = require("../../utils/logic");

Page({
  data: {
    name: "",
    nameEn: "",
    category: "食品饮料",
    categories: logic.CATEGORIES,
    weekendOff: null,
    note: "",
  },

  onShow() {
    if (!logic.requireGate()) return;
    const name = wx.getStorageSync("sx-prefill-name") || "";
    const category = wx.getStorageSync("sx-prefill-category") || "";
    wx.removeStorageSync("sx-prefill-name");
    wx.removeStorageSync("sx-prefill-category");
    const patch = {};
    if (name) patch.name = name;
    if (logic.CATEGORIES.indexOf(category) >= 0) patch.category = category;
    if (Object.keys(patch).length) this.setData(patch);
  },

  setName(e) { this.setData({ name: e.detail.value }); },
  setNameEn(e) { this.setData({ nameEn: e.detail.value }); },
  setNote(e) { this.setData({ note: e.detail.value }); },
  setCategory(e) { this.setData({ category: e.currentTarget.dataset.v }); },
  setRest() { this.setData({ weekendOff: true }); },
  setOver() { this.setData({ weekendOff: false }); },

  submit() {
    if (this.data.weekendOff === null) {
      wx.showToast({ title: "请选择双休或非双休", icon: "none" });
      return;
    }
    try {
      const res = logic.createBrand({
        name: this.data.name,
        name_en: this.data.nameEn,
        category: this.data.category,
        weekend_off: this.data.weekendOff,
        note: this.data.note,
      });
      wx.showToast({ title: res.ok ? "已记在这台手机" : "品牌已在库里", icon: "none" });
      wx.navigateTo({ url: "/pages/detail/detail?id=" + res.brand.id });
    } catch (err) {
      wx.showToast({ title: err.message || "登记失败", icon: "none" });
    }
  },
});
