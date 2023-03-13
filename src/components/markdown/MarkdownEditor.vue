<template>
  <div class="markdown-editor strech-parent">
    <VueMarkdownEditor
      ref="editor"
      v-model="content"
      style="height: 100%"
      left-toolbar=""
      right-toolbar=""
      @change="onChange"
      @save="$emit('save', file)"
    />
  </div>
</template>

<script setup>
import { defineComponent, ref, watchEffect } from "vue";
import renderer from "../../utils/renderer";
import excuteGrammerMenu from "./actions.js"
import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import Prism from "prismjs";
import hljs from "highlight.js";
import createKatexPlugin from "@kangc/v-md-editor/lib/plugins/katex/cdn";
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';

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

const editor = ref()
// 响应语法菜单
renderer.onGrammerMenu(role => {
  excuteGrammerMenu(editor.value, role)
})
</script>

<style lang="less" scoped>
.markdown-editor {
  & :deep(.v-md-editor) {
    height: 100%;
  }

  & :deep(.v-md-editor__toolbar) {
    display: none;
  }
}
</style>
