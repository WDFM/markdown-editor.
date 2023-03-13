<template>
  <div class="markdown-editor strech-parent">
    <VueMarkdownEditor
      ref="editor"
      v-model="content"
      style="height: 100%"
      left-toolbar=""
      right-toolbar=""
      :mode="mode"
      :default-show-toc="defaultShowToc"
      @change="onChange"
      @save="$emit('save', file)"
    />

    <!-- 模式切换按钮 -->
    <div class="mode-menu">
      <el-dropdown @command="command => mode = command">
        <el-icon :size="28">
          <open />
        </el-icon>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="edit">编辑模式</el-dropdown-item>
            <el-dropdown-item command="editable">编辑+预览</el-dropdown-item>
            <el-dropdown-item command="preview" divided>预览模式</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, ref, watchEffect } from "vue";
import renderer from "../../utils/renderer";
import excuteGrammerMenu from "./actions.js";
import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import Prism from "prismjs";
import hljs from "highlight.js";
import createKatexPlugin from "@kangc/v-md-editor/lib/plugins/katex/cdn";
import createTodoListPlugin from "@kangc/v-md-editor/lib/plugins/todo-list/index";
import "@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css";
import createCopyCodePlugin from "@kangc/v-md-editor/lib/plugins/copy-code/index";
import "@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css";
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';

// 模式。可选值：edit(纯编辑模式) editable(编辑与预览模式) preview(纯预览模式)。
const mode = ref("editable");
// 是否默认显示目录导航。
const defaultShowToc = ref(false);

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
  Hljs: hljs,
  extend(md) {
    // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
    // md.set(option).use(plugin);
  },
});

VueMarkdownEditor.use(createKatexPlugin());
VueMarkdownEditor.use(createTodoListPlugin());
VueMarkdownEditor.use(createCopyCodePlugin());
VueMarkdownEditor.use(createAlignPlugin());
VueMarkdownEditor.use(createLineNumbertPlugin());

defineComponent({ VueMarkdownEditor });
const props = defineProps({ file: Object });
const emit = defineEmits("save");

let content = ref("");

const onChange = (text) => {
  // console.log(text);
  props.file.tempData = text;
};

watchEffect(() => {
  if (!content.value) {
    content = ref(props.file.fileData);
    props.file.tempData = props.file.fileData;
  }
});

const editor = ref();
// 响应语法菜单
renderer.onGrammerMenu((role) => {
  excuteGrammerMenu(editor.value, role);
});
</script>

<style lang="less" scoped>
.markdown-editor {
  & :deep(.v-md-editor) {
    height: 100%;
  }

  & :deep(.v-md-editor__toolbar) {
    display: none;
  }

  & :deep(.v-md-editor__left-area-title) {
    height: 41px !important;
    line-height: 41px !important;
  }

  .mode-menu {
    position: absolute;
    right: 3vw;
    bottom: 20vh;
    z-index: 1000;
    user-select: none;
  }
}
</style>
