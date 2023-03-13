/**
 * 自定义菜单操作
 */
function customAction(editor, prefix = "", suffix = "", placeholder = "请输入文本") {
  if (!editor) return
  editor.insert(function (selected) {
    const content = selected || placeholder;

    return {
      text: `${prefix}${content}${suffix}`,
      selected: content,
    };
  });
}

/**
 * 提示信息
 */
function tipAction(editor, type) {
  const prefix = `::: ${type}\n`;
  const suffix = "\n:::";
  const placeholder = "请输入文本";
  customAction(editor, prefix, suffix, placeholder)
}

/**
 * 响应语法菜单操作，执行对应方法
 * @param {*} editor
 * @param {*} role
 */
export default function excuteGrammerMenu(editor, role) {
  const toolbars = editor.toolbars;
  console.log(editor);
  console.log(toolbars);
  if (!toolbars) return;

  if (role.startsWith("tip")) {
    tipAction(editor, role.split("-")[1]);
    return;
  }

  switch (role) {
    // "标题1"
    case "h1":
      toolbars.h.menus[0].action(editor);
      break;
    // "标题2"
    case "h2":
      toolbars.h.menus[1].action(editor);
      break;
    // "标题3"
    case "h3":
      toolbars.h.menus[2].action(editor);
      break;
    // "标题4"
    case "h4":
      toolbars.h.menus[3].action(editor);
      break;
    // "标题5"
    case "h5":
      toolbars.h.menus[4].action(editor);
      break;
    // "标题6"
    case "h6":
      toolbars.h.menus[5].action(editor);
      break;
    // "粗体"
    case "bold":
      toolbars.bold.action(editor);
      break;
    // "斜体"
    case "italic":
      toolbars.italic.action(editor);
      break;
    // "删除线"
    case "strikethrough":
      toolbars.strikethrough.action(editor);
      break;
    // "引用"
    case "quote":
      toolbars.quote.action(editor);
      break;
    // "无序列表"
    case "ul":
      toolbars.ul.action(editor);
      break;
    // "有序列表"
    case "ol":
      toolbars.ol.action(editor);
      break;
    // "表格"
    case "table":
      toolbars.table.action(editor);
      break;
    // "分割线"
    case "hr":
      toolbars.hr.action(editor);
      break;
    // "链接"
    case "link":
      toolbars.link.action(editor);
      break;
    // "插入图片"
    case "image-link":
      toolbars.image.menus[0].action(editor);
      break;
    case "upload-image":
      toolbars.image.menus[1].action(editor);
      break;
    // "代码块"
    case "code":
      toolbars.code.action(editor);
      break;

    // 数学公式
    case "katex":
      customAction(editor, "$$", "$$", "\sum_{i=1}^n a_i=0")
      break;
    // 流程图
    // case "mermaid":
    //   break;
    // 待办
    case "todo":
      customAction(editor, "- [x] ", "", "任务列表")
      break;
  }
}
