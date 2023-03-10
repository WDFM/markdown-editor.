<template>
  <div class="markdown-editor strech-parent">
    <VueMarkdownEditor
      v-model="content"
      style="height: 100%"
      @change="onChange"
      @save="$emit('save', file)"
    />
  </div>
</template>

<script setup>
import { defineComponent, ref, watchEffect } from "vue";
import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import Prism from "prismjs";

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

defineComponent({ VueMarkdownEditor });
const props = defineProps({ file: Object });
const emit = defineEmits('save')

let content = ref("");

const onChange = (text) => {
  // console.log(text);
  props.file.tempData = text;
};

watchEffect(() => {
  if (!content.value) {
    content = ref(props.file.fileData);
    props.file.tempData = props.file.fileData
  }
});
</script>

<style lang="less" scoped>
.markdown-editor {
  & :deep(.v-md-editor) {
    height: 100%;
  }
}
</style>
