<template>
  <div class="actions strech-parent">
    <div class="action">
      <el-icon :size="50" color="#ccc">
        <document-add />
      </el-icon>
      新建文档
    </div>

    <div class="action">
      <el-icon :size="50" color="#ccc">
        <folder-opened />
      </el-icon>
      打开文档
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.actions {
  display: flex;
  align-items: center;
  justify-content: center;

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 15px;
  }
}
</style>
