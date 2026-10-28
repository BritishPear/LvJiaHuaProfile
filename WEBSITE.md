# Lambert 个人网站说明

网站源码位于仓库根目录：`index.html` 为入口，`assets/` 保存图片、图标、脚本与视频。所有网页资源使用相对路径。

## 获取完整视频

通过 Git 克隆源码后，请从本仓库的 Release `website-v1` 下载 `lambert-portfolio.zip`，将其中的 `lambert-portfolio/assets/videos/ama.mp4` 提取到本地仓库的 `assets/videos/ama.mp4`。AMA 原视频约 428 MB，完整 ZIP 保留其原始质量。

也可以直接下载并解压完整 ZIP，进入 `lambert-portfolio/` 文件夹运行，无需另行提取视频。

## 本地运行

用浏览器打开 `index.html`，或在该目录启动静态文件服务器，例如 `python -m http.server 8000`，再访问 `http://localhost:8000`。

本说明仅介绍源码与本地运行方式，不表示已启用在线网站托管。