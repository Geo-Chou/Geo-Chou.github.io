# Home page repo
deploy from academic-homepage style

## 编写项目页

在 `_projects/` 新建 Markdown 文件即可，默认使用 `project` layout 并隐藏导航栏。
正文每个 `##` 二级标题自动开启一张 card，直到下一个 `##`；`###` 及以下标题留在同一张 card 中。首个 `##` 前的引言会单独显示为一张 card。
正文支持常规 Markdown 标题、段落、图片、列表和链接，不需要编写卡片 HTML。
Abstract 也写在正文中，使用 `## Abstract`；移动整个章节即可调整它与 Demo、结果等卡片的顺序。

| Front matter 字段 | 用途 |
| --- | --- |
| `title` | 项目详情页和列表卡片标题 |
| `summary` / `cover` | 列表卡片简介与封面；`cover` 同时作为正文视频的默认 poster |
| `venue` / `year` | 标题上方的会议与年份 |
| `authors` | 作者姓名列表，链接与加粗复用 `_data/authors.yml` |
| `affiliations` | 机构文字 |
| `links` | 资源名称与 URL，按名称自动匹配图标 |
| `citation` | 多行 BibTeX，显示引用区与标题区入口 |
| `hide_navbar: false` | 为此项目恢复导航栏 |

这些可选区块省略后不显示。正文中可用 `[Demo Video](#demo-video)` 或 `[BibTeX](#citation)` 链接到对应区块。

### 正文插入视频与分卡

视频链接独占一段，自动显示为播放器，默认使用 front matter 中的 `cover` 作为 poster：

```markdown
## Demo Video

这里写视频说明。

[Demo Video](https://media.geo-zhou.com/Demo_RadPose_anonymous.mp4)

## Abstract

这里写摘要，显示在 Demo 后面。

## Qualitative results

这里开始另一张 card。

### Seen environment

![结果图](/assets/images/projects/2026radpose/seen_1.png)
```

视频可以放在正文任意位置，也可插入多个。支持以 `.mp4`、`.webm`、`.ogv`、`.ogg` 结尾的视频文件链接（可以带查询参数）。嵌在句子中的链接仍作为普通链接。
无需视频专用 front matter、抽帧工具或额外生成命令。未设置 `cover` 时使用浏览器默认视频预览。
分卡和视频展示由项目页脚本完成；禁用 JavaScript 时仍可阅读正文并点击视频链接。

### 资源链接

最简写法是 `Code: https://github.com/example/project`；需要控制打开方式时：

```yaml
links:
  Paper:
    url: /publications/2026/2027-pub-wacv.html
    target: _self
  Code: https://github.com/Geo-Chou/RadPose
  Slides: /assets/files/slides.pdf
  Poster: /assets/files/poster.pdf
```

Slides / Poster 可以任选一个或同时使用，将示例路径换成实际文件地址即可。
当前链接默认在新标签页打开。Paper/Publication、Code/GitHub、Data、Checkpoint/Model、Demo、Video、Slides、Poster 会自动匹配图标，其他名称使用通用外链图标。
尚未发布的资源可暂用 `https://blank`，会显示为不可点击的 Coming soon 按钮。

