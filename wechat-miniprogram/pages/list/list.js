const logic = require("../../utils/logic");

Page({
  data: {
    q: "",
    filter: "all",
    rows: [],
    counts: { all: 0, rest: 0, overtime: 0 },
  },

  onShow() {
    if (!logic.requireGate()) return;
    this.apply();
  },

  onShareAppMessage() {
    return { title: "双休雷达", path: "/pages/index/index" };
  },

  onQ(e) {
    this.setData({ q: e.detail.value || "" });
    this.apply();
  },

  setFilter(e) {
    this.setData({ filter: e.currentTarget.dataset.v });
    this.apply();
  },

  apply() {
    const all = logic.listCatalog().map(logic.decorate);
    const q = this.data.q.trim().toLowerCase();
    const rows = all.filter((brand) => {
      if (this.data.filter === "rest" && !brand.rest) return false;
      if (this.data.filter === "overtime" && brand.rest) return false;
      if (!q) return true;
      return (
        brand.name.toLowerCase().indexOf(q) >= 0 ||
        String(brand.name_en).toLowerCase().indexOf(q) >= 0 ||
        String(brand.aliases).toLowerCase().indexOf(q) >= 0 ||
        brand.category.indexOf(this.data.q.trim()) >= 0
      );
    });
    this.setData({
      rows,
      counts: {
        all: all.length,
        rest: all.filter((b) => b.rest).length,
        overtime: all.filter((b) => !b.rest).length,
      },
    });
  },

  open(e) {
    wx.navigateTo({ url: "/pages/detail/detail?id=" + e.currentTarget.dataset.id });
  },
});
