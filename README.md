<div align="center">
  <img src="build/icon.svg" width="80" alt="薪动图标">
  <h1>薪动 · Payday Clock</h1>
  <p><strong>每一秒，都算数。</strong><br>看着收入一点点增长，也记得把下班后的时间留给自己。</p>
  <p><strong>简体中文</strong> · <a href="README.en.md">English</a></p>
  <p><a href="https://github.com/SamsurTee/payday-clock/releases/latest">下载桌面版</a> · <a href="#三步开始薪动">使用图解</a> · <a href="https://github.com/SamsurTee/payday-clock/issues">反馈建议</a></p>
  <p>Windows · macOS · 浏览器 &nbsp; / &nbsp; 离线可用 &nbsp; / &nbsp; MIT 开源</p>
</div>

---

上班时偶尔想知道：**“今天的努力，已经换来了多少收入？”**

薪动把薪资和排班变成一个实时更新的小面板：今天赚了多少、每秒进账多少、距离下班还有多久。设置一次，之后打开就能看。午休时让数字歇一歇，下班后把时间还给生活。

![薪动桌面主界面：今日已赚、下班倒计时、工作进度和本月估算](docs/images/dashboard.png)

<p align="center"><sub>macOS 版实际截图 · 示例月薪 ¥12,000，09:00–18:00，午休 1 小时，周一至周五工作。所有截图均使用示例数据。</sub></p>

## 桌面上的一点小动力

| 你关心的 | 薪动帮你看见 |
| --- | --- |
| 今天的努力值多少 | 今日已赚金额与每秒收入，实时更新 |
| 什么时候轮到自己的时间 | 下班倒计时与今日工作进度 |
| 我的排班不一样 | 月薪／日薪／时薪，自定义工时、午休和工作日 |
| 想放在屏幕角落 | 默认置顶的专注小窗，主窗口与小窗同步设置 |
| 这个月大概能赚多少 | 本月累计与预计收入，明确标注排班估算 |
| 薪资不想告诉别人 | 无账号、无广告、无遥测，配置只保存在本机 |

## 下载，打开，就能用

无需安装 Node.js，也不需要注册账号。

| 你的电脑 | 下载 v1.0.0 | 打开方式 |
| --- | --- | --- |
| Windows x64 | [免安装 EXE](https://github.com/SamsurTee/payday-clock/releases/download/v1.0.0/Payday-Clock-1.0.0-windows-x64-portable.exe) | 下载后双击 |
| Mac · Apple Silicon（M 系列） | [下载 App ZIP](https://github.com/SamsurTee/payday-clock/releases/download/v1.0.0/Payday-Clock-1.0.0-mac-arm64.zip) | 解压，将「薪动.app」拖入「应用程序」 |
| Mac · Intel | [下载 App ZIP](https://github.com/SamsurTee/payday-clock/releases/download/v1.0.0/Payday-Clock-1.0.0-mac-x64.zip) | 解压，将「薪动.app」拖入「应用程序」 |

[查看最新版本与 SHA-256 校验文件 →](https://github.com/SamsurTee/payday-clock/releases/latest)

<details>
<summary>首次打开提示未知发布者／未验证应用？</summary>

首版没有商业代码签名证书和 Apple 公证；macOS 包使用 ad-hoc 签名。请核对仓库来源及 Release 附带的 SHA-256 校验值，再按系统提供的安全设置决定是否允许打开，无需关闭系统整体安全保护。

Apple Silicon 版已实际验证启动、配置保存、实时收入和专注小窗；两个 Mac 包均通过签名完整性检查。Windows EXE 在 macOS 上交叉构建，尚未进行 Windows 实机交互验收。

</details>

## 三步开始薪动

### 01 · 告诉它，你的工作节奏

首次打开会弹出设置；之后点击右上角 **「薪资设置」** 随时修改。

1. 选择月薪、日薪或时薪，填入金额与币种。月薪可按当月排班工作日或固定计薪天数折算。
2. 填写上下班时间。需要扣除午休时，打开开关并填写午休起止时间。
3. 勾选每周工作日，点击 **「保存，开始薪动 →」**。

<img src="docs/images/settings.png" width="900" alt="操作图：薪资类型与金额、上下班时间、午休开关、工作日选择，以及底部保存按钮">

### 02 · 看见今天一点点的收获

保存后，主面板会自动更新。对照上方主界面截图：

| 看哪里 | 代表什么 |
| --- | --- |
| 左上「今日已赚」 | 当天已过的有效工作时间对应的收入；小数显示到四位 |
| 右上「距离下班还有」 | 距离下班的自然时间，包含尚未结束的午休；上班前改为上班倒计时 |
| 收入卡片底部进度条 | 已完成的有效工作时长占当天计薪时长的比例 |
| 左下「本月累计」 | 默认已过排班日均完成工作，加上今天已赚的估算金额 |

午休期间暂停计薪，下班后当日收入封顶，休息日不累计当天收入。关闭页面后再打开，会按当前时间重新计算。

### 03 · 放到角落，继续做自己的事

点击倒计时下方的 **「打开专注小窗」**，保留收入、进度与倒计时。桌面版小窗默认置顶。

<p align="center"><img src="docs/images/focus.png" width="360" alt="专注小窗实际截图：收入与下班倒计时纵向排列，右上角仍可打开设置"></p>

- **切换置顶：** macOS 按 `⌘ + Shift + T`；Windows 按 `Ctrl + Shift + T`，作用于当前窗口。
- **调整设置：** 小窗右上角同样可以进入「薪资设置」。
- **收起小窗：** 点击窗口关闭按钮，主窗口仍可继续使用。Windows 按 `Alt` 可显示菜单栏。

## 每一秒是怎么算的？

```text
日薪 = 月薪 ÷ 当月排班工作日数（或自定义固定计薪天数）
每秒收入 = 日薪 ÷ 每日有效工作秒数
今日已赚 = 今天已经过的有效工作秒数 × 每秒收入
```

**举个例子：** 月薪 ¥12,000，当月 21 个工作日，每天计薪 8 小时，约等于日薪 ¥571.43、时薪 ¥71.43、每秒 ¥0.0198。完成 4 小时有效工作后，今日已赚约 ¥285.71。内部计算使用完整精度，显示时四舍五入。

按日计薪时直接使用填写的日薪；按小时计薪时，每秒收入为时薪 ÷ 3600。

<details>
<summary>查看估算边界与排班规则</summary>

- 支持同日班次；午休不计薪，非工作日今日收入为零，下班后不继续累计。
- 本月累计默认本月已过的排班日均已完成工作，修改设置会重算；不是实际打卡或工资到账记录。
- 固定计薪天数与当月排班天数不同，本月预计可能与输入的月薪不同。
- 不自动处理法定节假日、调休、请假、加班、税费或汇率。人民币／美元／港币选项用于显示币种，不进行换汇。
- 按本机时间推算；修改系统日期、时间或时区会改变结果。

</details>

## 数据留在哪里？

配置保存在本机 `localStorage`，不上传。桌面主窗口和小窗共享设置；桌面版、网页版、不同浏览器与设备之间不自动同步。

| 平台 | 桌面版数据目录 |
| --- | --- |
| macOS | `~/Library/Application Support/PaydayClock` |
| Windows | `%APPDATA%/PaydayClock` |

清理应用数据或浏览器站点数据会清除配置。更换打开方式后，首次使用需重新填写设置。

## 网页版与开发

<details>
<summary>只想用浏览器打开？</summary>

下载源码后，双击 `index.html` 即可使用。部分浏览器限制本地文件存储；也可以在项目目录运行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

然后访问 <http://127.0.0.1:8765>。网页版无需安装项目依赖，使用原生 HTML、CSS 和 JavaScript。浏览器小窗属于普通弹窗，不保证系统置顶。

</details>

<details>
<summary>本地开发、测试与桌面打包</summary>

安装受支持的 Node.js LTS 后：

```sh
git clone https://github.com/SamsurTee/payday-clock.git
cd payday-clock
npm ci
npm test
npm start
```

| 构建目标 | 命令 |
| --- | --- |
| macOS Apple Silicon + Intel（需在 Mac 执行） | `npm run dist:mac` |
| Windows 免安装 EXE（在 Windows 执行） | `npm run dist:win` |
| 在 Mac 交叉构建 Windows EXE | `npm run dist:win:cross` |

产物位于 `dist/`。交叉构建会跳过 Windows PE 图标与版本资源编辑。若 iCloud／同步文件夹的 Finder 元数据导致签名失败，可在构建命令后加 `-- -c.directories.output=/private/tmp/payday-clock-dist`，输出到非同步目录。

依赖锁定于 `package-lock.json`，本地构建无需 GitHub 或签名密钥。未来配置正式签名／公证时，请使用安全环境变量或证书存储，不要提交密钥。

| 文件 | 职责 |
| --- | --- |
| `index.html` / `styles.css` | 主面板、响应式布局与设置表单 |
| `calculator.js` | 独立计薪与排班逻辑 |
| `app.js` | 实时显示、本机存储与小窗交互 |
| `desktop/` | Electron 窗口、置顶、单实例和导航限制 |
| `tests/` | 计薪边界及本地页面访问规则测试 |
| `docs/images/` | 使用示例数据拍摄的真实应用截图 |

当前 10 项自动化测试通过，覆盖午休、上下班边界、周末、跨月、计薪类型、输入校验和桌面导航限制。

</details>

## 一起把它做得更顺手

遇到问题可以 [提一个 Issue](https://github.com/SamsurTee/payday-clock/issues)，也欢迎提交 Pull Request。反馈时说明系统、应用版本和复现步骤即可；截图中的真实薪资请先遮盖。

项目采用 [MIT License](LICENSE)，允许使用、修改、分发及商业使用，请保留版权与许可声明。独立实现，未使用参考程序的源码或素材；Electron 等依赖保留各自许可证。

---

<p align="center">认真生活，慢慢进账。<br><sub>好好工作，也好好休息。</sub></p>
