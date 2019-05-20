let size = [ // 字体大小
  "normal",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px"
];

let fonts = [ // 字体
  "SimSun",
  "SimHei",
  "Microsoft-YaHei",
  "KaiTi",
  "FangSong",
  "Arial",
  "Times-New-Roman",
  "sans-serif"
];
// 配置项
var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
    ["blockquote", "code-block"], //引用，代码块
  
    [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
    [{ list: "ordered" }, { list: "bullet" }], //列表
    [{ script: "sub" }, { script: "super" }], // 上下标
    [{ indent: "-1" }, { indent: "+1" }], // 缩进
    [{ direction: "rtl" }], // 文本方向
  
    [{ size: size }], // 字体大小 注册流程和配置流程是否有冲突
    [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
  
    [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
    [{ font: fonts }], //把上面定义的字体数组放进来
  
    [{ align: [] }], //对齐方式
  
    ["clean"], //清除字体样式
    ["link", "image", "video"] //上传图片、上传视频
  ];

export const editorData = {
    fonts,
    size,
    toolbarOptions
}
