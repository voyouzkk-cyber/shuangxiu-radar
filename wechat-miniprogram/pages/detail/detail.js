const logic = require("../../utils/logic");

Page({
  data: { id: 0, brand: null, alts: [], pickedVote: "" },

  onLoad(query) {
    this.setData({ id: Number(query.id || 0) });
  },

  onShow() {
    if (!logic.requireGate()) return;
    this.load();
  },

  onShareAppMessage() {
    return { title: "双休雷达", path: "/pages/index/index" };
  },

  load() {
    const all = logic.listCatalog();
    const found = all.find((b) => b.id === this.data.id);
    if (!found) {
      this.setData({ brand: null, alts: [] });
      return;
    }
    const brand = logic.decorate(found);
    this.setData({
      brand,
      alts: logic.suggestAlternatives(brand, all),
      pickedVote: logic.pickedVote(brand.id),
    });
  },

  vote(e) {
    const rest = e.currentTarget.dataset.rest === true || e.currentTarget.dataset.rest === "true";
    logic.voteCatalog(this.data.id, rest);
    this.load();
  },

  open(e) {
    wx.redirectTo({ url: "/pages/detail/detail?id=" + e.currentTarget.dataset.id });
  },
});
