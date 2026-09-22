# 双休雷达 / Weekend Rest Radar

**中文** · 查日常品牌有没有被登记为「双休」。拍包装上的商标，或直接搜品牌名；再决定买不买。

**English** · Look up whether everyday brands are listed as having weekends off. Snap the logo on packaging, or search by name — then decide whether to buy.

本仓库含网页版（React）源码，以及可离线用的微信小程序草稿（`wechat-miniprogram/`）。

This repo holds the web app (React) source and an offline WeChat mini-program draft (`wechat-miniprogram/`).

---

## 这是什么 / What it is

| 中文 | English |
| --- | --- |
| **网页**：查品牌、看同类、登记与投票（写入公共库后，后来打开网页的人都能看到） | **Web**：search brands, see peers, register & vote (shared after write) |
| **微信小程序草稿**：名单在本地 `data/brands.js`，查询/筛选在手机完成，不调用服务器 | **Mini-program draft**：local brand list; query/filter on device; no server |

## 原则 / Principles

- 不收集姓名、手机号、微信号、位置，不设账号 / No names, phones, WeChat IDs, location, or accounts
- 不对任何公司作指控，也不号召抵制 / No accusations or boycott calls
- 同一公司不同岗位、时期、地区可能不同，条目可能不准 / Entries may be wrong across roles/regions/times
- 请勿在说明里填写姓名、工号、电话或内部资料 / Do not put personal or internal details in notes

## 本地跑网页 / Run the web app locally

需要 Node.js。在仓库根目录 / Requires Node.js at the repo root:

```bash
npm install
npm run dev
```

开发服务默认在 `0.0.0.0:8080`（以项目脚本为准）。

Dev server defaults to `0.0.0.0:8080` (see project scripts).

## 微信小程序 / WeChat mini-program

见 / See [`wechat-miniprogram/README.md`](./wechat-miniprogram/README.md)。

## 仓库命名 / Repo naming

| 显示名 Display | 仓库 slug |
| --- | --- |
| 双休雷达 / Weekend Rest Radar | `shuangxiu-radar`（由 Grok Build 自动名 `beacon-cosmic-falcon-heart` 改来） |

仓库默认**私有**。Default: **private**.

## 署名 / Credit

个人作品备忘工具，非实名举报平台。

A personal memo tool — not a real-name tip line.
