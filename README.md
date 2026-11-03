# 薪动 · 每一秒，都算数

一个开源、离线的中文薪资时钟。实时查看今天赚了多少钱、每秒收入与下班倒计时。支持 Windows、macOS，也可以直接在浏览器使用。首次打开即可配置，薪资信息只保存在本机。

<img src="build/icon.svg" width="88" alt="薪动图标">

## 下载桌面版

从 [GitHub Releases](https://github.com/SamsurTee/payday-clock/releases/latest) 下载：

| 系统 | 文件 | 使用方式 |
| --- | --- | --- |
| Windows x64 | `Payday-Clock-1.0.0-windows-x64-portable.exe` | 双击启动，无需安装 Node.js 或浏览器 |
| macOS Apple Silicon（M 系列） | `Payday-Clock-1.0.0-mac-arm64.zip` | 解压，将「薪动.app」拖入「应用程序」后打开 |
| macOS Intel | `Payday-Clock-1.0.0-mac-x64.zip` | 解压，将「薪动.app」拖入「应用程序」后打开 |

桌面专注小窗默认置顶；`⌘/Ctrl + Shift + T` 切换当前窗口置顶状态。Windows 按 Alt 可显示菜单栏。

首版没有商业代码签名证书和 Apple 公证；macOS 包使用本地 ad-hoc 签名，下载后可能触发系统安全提示。Windows 包也可能出现未知发布者提示。请核对仓库来源及 Release 附带的 SHA-256 校验值，再按系统提供的安全设置选择是否允许打开。不要关闭系统整体安全保护。

Apple Silicon 版已在 macOS 实际验证启动、配置保存、实时收入与专注小窗；两个 Mac 包均通过签名完整性检查。Windows 版本在 macOS 上交叉构建，尚未在 Windows 实机进行交互验收。

## 功能

- 月薪、日薪、时薪，人民币／美元／港币显示。
- 自定义上下班时间、午休与每周工作日。
- 每秒动态收入、下班倒计时、今日工作进度。
- 本月累计及预计收入，明确标注排班估算口径。
- 桌面置顶专注小窗；支持主窗口与小窗同步配置。
- 无账号、无广告、无遥测、无云端上传，离线可用。

## 使用

1. 打开 `index.html`，配置月薪 / 日薪 / 时薪、币种、上下班时间、午休与每周工作日。
2. 保存后查看实时收入、下班倒计时、工作进度、本月估算和时薪。
3. 点击「打开专注小窗」打开精简窗口。桌面版默认置顶；网页版使用普通浏览器弹窗。
4. 点击「薪资设置」随时修改；点击「怎么算的？」查看计算口径。

网页版由纯本地 HTML / CSS / JavaScript 构成，无远程字体、第三方页面脚本或网络请求。设置存储于 localStorage；部分浏览器限制直接打开本地文件时的存储，网页版建议通过固定本地地址使用：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

然后访问 http://127.0.0.1:8765 。保持同一个浏览器和地址，配置会保留。直接打开文件与本地服务的设置不共享。

桌面版和网页版的设置也不共享。桌面版数据目录为 macOS 的 `~/Library/Application Support/PaydayClock` 或 Windows 的 `%APPDATA%/PaydayClock`。首次使用桌面版请重新填写设置。

## 本地开发与打包

安装当前受支持的 Node.js LTS，然后运行：

```sh
npm ci
npm test
npm start
```

在 macOS 上生成 Apple Silicon 和 Intel 版本：

```sh
npm run dist:mac
```

在 Windows 上生成免安装 EXE：

```sh
npm run dist:win
```

在 macOS 上交叉构建 Windows EXE（跳过 Windows PE 图标及版本资源编辑）：

```sh
npm run dist:win:cross
```

产物位于 `dist/`。若项目在 iCloud／同步文稿文件夹内，签名出现 Finder 元数据错误，可在构建命令后加 `-- -c.directories.output=/private/tmp/payday-clock-dist`，将产物输出到非同步目录。macOS App 需在 macOS 上构建。包版本锁定在 `package-lock.json`，不需要提供任何 GitHub 或签名密钥就能本地构建。未来若配置正式签名／公证，请通过安全的环境变量或证书存储注入，勿提交密钥。

## 计算规则

- 月薪除以当月所选工作日数量，或自定义固定计薪天数，得到日薪。
- 每日工作秒数 = 下班时间 − 上班时间 − 午休。支持同日班次。
- 今日已赚 = 当天已过的有效工作秒数 × 每秒收入，休息日为零，下班后封顶。
- 倒计时为距离下班的自然时间（包含尚未结束的午休）；上班前显示距离上班的倒计时。
- 本月累计默认已过的排班工作日全部完成工作，加上今日已赚。修改设置会重算，数据不是打卡记录。
- 所有数字使用输入薪资的口径，不自动扣税、不换汇；不自动识别节假日、调休、请假及加班。
- 页面根据本机当前时间推算，关闭页面后重新打开不会从零开始；更改系统时钟或时区会改变计算结果。

## 文件与验证

- `index.html` / `styles.css`：界面、响应式布局及设置表单。
- `calculator.js`：独立的薪资与排班计算。
- `app.js`：实时刷新、本机存储及小窗。
- `tests/calculator.test.cjs`：工作日、午休、边界、计薪方式及校验测试。
- `desktop/`：Electron 桌面窗口、置顶、单实例与本地页面访问限制。
- `build/`：原创图标资源。

运行 `npm test` 执行测试。

## 开源许可与贡献

采用 [MIT License](LICENSE)，允许使用、修改、再发布和商业使用，请保留版权及许可声明。欢迎通过 Issue 反馈问题，或提交 Pull Request。请勿在反馈中上传真实薪资、个人资料或本机数据目录。

本项目独立实现，未使用参考图片中的程序源码或素材。Electron 等依赖保留各自的开源许可证，发行包附有其相关许可文件。
