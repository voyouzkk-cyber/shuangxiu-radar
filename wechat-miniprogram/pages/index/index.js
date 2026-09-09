const logic = require("../../utils/logic");

const HOT = ["农夫山泉", "三只松鼠", "安踏", "立白", "星巴克", "华为"];

Page({
  data: {
    query: "",
    picked: null,
    pickedVote: "",
    hits: [],
    alts: [],
    hot: HOT,
    stats: { total: 0, rest: 0, overtime: 0 },
  },

  onShow() {
    if (!logic.requireGate()) return;
    this.refresh();
  },

  onShareAppMessage() {
    return { title: "双休雷达", path: "/pages/index/index" };
  },

  onShareTimeline() {
    return { title: "双休雷达" };
  },

  goAbout() {
    wx.navigateTo({ url: "/pages/about/about" });
  },

  refresh() {
    const all = logic.listCatalog();
    const query = this.data.query;
    const picked = this.data.picked
      ? logic.decorate(all.find((b) => b.id === this.data.picked.id) || this.data.picked)
      : null;
    this.setData({
      stats: logic.stats(all),
      hits: query && !picked ? logic.searchBrands(query, all) : [],
      picked,
      alts: picked ? logic.suggestAlternatives(picked, all) : [],
      pickedVote: picked ? logic.pickedVote(picked.id) : "",
    });
  },

  onInput(e) {
    const query = e.detail.value || "";
    const all = logic.listCatalog();
    const exact = all.find((b) => b.name === query.trim() || String(b.name_en).toLowerCase() === query.trim().toLowerCase());
    let hits = logic.searchBrands(query, all);
    let picked = null;
    if (exact) picked = logic.decorate(exact);
    else if (hits.length === 1) picked = hits[0];
    this.setData({
      query,
      picked,
      hits: picked ? [] : hits,
      alts: picked ? logic.suggestAlternatives(picked, all) : [],
      pickedVote: picked ? logic.pickedVote(picked.id) : "",
    });
  },

  tapHot(e) {
    const name = e.currentTarget.dataset.name;
    const all = logic.listCatalog();
    const found = all.find((b) => b.name === name);
    if (found) this.openById(found.id);
    else this.setData({ query: name }, () => this.onInput({ detail: { value: name } }));
  },

  openBrand(e) {
    this.openById(Number(e.currentTarget.dataset.id));
  },

  openById(id) {
    const all = logic.listCatalog();
    const found = all.find((b) => b.id === id);
    if (!found) return;
    const picked = logic.decorate(found);
    this.setData({
      query: picked.name,
      picked,
      hits: [],
      alts: logic.suggestAlternatives(picked, all),
      pickedVote: logic.pickedVote(picked.id),
    });
  },

  vote(e) {
    const rest = e.currentTarget.dataset.rest === true || e.currentTarget.dataset.rest === "true";
    const next = logic.voteCatalog(this.data.picked.id, rest);
    const all = logic.listCatalog();
    this.setData({
      picked: next,
      pickedVote: logic.pickedVote(next.id),
      alts: logic.suggestAlternatives(next, all),
    });
  },

  clear() {
    this.setData({ query: "", picked: null, hits: [], alts: [], pickedVote: "" });
    this.refresh();
  },

  goDetail() {
    wx.navigateTo({ url: "/pages/detail/detail?id=" + this.data.picked.id });
  },

  goRegister() {
    wx.setStorageSync("sx-prefill-name", this.data.query || "");
    wx.setStorageSync("sx-prefill-category", "");
    wx.switchTab({ url: "/pages/register/register" });
  },
});
