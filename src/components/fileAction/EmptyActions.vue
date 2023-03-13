<template>
  <div class="actions strech-parent">
    <div class="action" @click="$emit('addFile')">
      <el-icon :size="50">
        <document-add />
      </el-icon>
      <span>新建文档</span>
    </div>

    <div class="action" @click="openFile">
      <el-icon :size="50">
        <folder-opened />
      </el-icon>
    <span>打开文档</span>
    </div>
  </div>
</template>

<script setup>
import renderer from '@/utils/renderer.js'

defineEmits('addFile')

const openFile = () => {
  renderer.openFileMenu()
}
</script>

<style lang="less" scoped>
.actions {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  user-select: none;

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 15px;
    color: #409EFC;
    filter: grayscale(1);
    opacity: 0.5;
    cursor: pointer;

    span {
      margin-top: 10px;
    }

    &:hover {
      filter: grayscale(0);
      opacity: 0.8;
    }
  }
}
</style>
