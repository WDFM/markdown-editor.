<template>
  <div class="home full-screen" v-loading="loading">
    <el-tabs
      v-model="currentFile"
      type="card"
      closable
      @tab-remove="closeFile"
      style="height: 100%"
      v-show="$store.getters.fileList.length > 0"
    >
      <el-tab-pane
        v-for="(file, index) in $store.getters.fileList"
        :name="index"
      >
        <template #label>
          <span>
            <i
              class="save-icon"
              :class="{ inactive: index !== currentFile }"
              v-if="file.tempData !== file.fileData"
            ></i>
            {{ file.name }}
          </span>
        </template>
        <!-- {{ file.fileData }}<br />{{ file.tempData }} -->
        <MarkdownEditor :file="file" @save="saveFile" />
      </el-tab-pane>
    </el-tabs>

    <EmptyActions v-show="$store.getters.fileList.length === 0" />
  </div>
</template>

<script setup>
import { defineComponent, ref, onMounted } from "vue";
import renderer from "@/utils/renderer";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import MarkdownEditor from "@/components/markdown/MarkdownEditor.vue";
import EmptyActions from "@/components/fileAction/EmptyActions.vue";

defineComponent({ MarkdownEditor, EmptyActions });

const store = useStore();
let loading = ref(false);
// 当前文件索引
let currentFile = ref(0);

// 响应打开文件菜单执行
renderer.openFileAsString().then((file) => {
  // console.log(store.getters.fileList.length);
  currentFile.value = store.getters.fileList.length - 1;
});

/**
 * 保存文件
 * @param {*} file
 */
const saveFile = (file) => {
  console.log(file);
  if (file.fileData === file.tempData) return;
  loading.value = true;
  // return new Promise((resolve, reject) => {
  return renderer
    .saveFile(file.path, file.tempData || file.fileData)
    .then((path, fileData) => {
      console.log("saved", path, fileData);
      Promise.resolve();
    })
    .catch((e) => {
      console.log("save failed! ", e);
      ElMessage.error(e);
      Promise.reject();
    })
    .finally(() => {
      loading.value = false;
    });
  // });
};

/**
 * 关闭文件
 */
const closeFile = (index) => {
  const fileList = JSON.parse(JSON.stringify(store.getters.fileList || []));

  const removeFile = () => {
    fileList.splice(index, 1);
    store.commit("setFileList", fileList);

    const currentIndex = currentFile.value;
    if (currentIndex !== index) return;
    // 更新当前文件索引
    currentFile.value = 0;
  };

  const removedFile = fileList[index];

  // 文档未做更改，直接关闭
  if (removedFile.tempData === removedFile.fileData) {
    removeFile();
    return;
  }
  ElMessageBox.confirm("文档已更新，是否保存修改？", "确认信息", {
    distinguishCancelAndClose: true,
    confirmButtonText: "保存",
    cancelButtonText: "放弃修改",
  })
    .then(() => {
      // 保存并关闭
      saveFile(removedFile).then(() => {
        removeFile();
      });
    })
    .catch((action) => {
      // 仅关闭
      if (action === "cancel") removeFile();
    });
};

/**
 * 应用打开时
 * 1.读取缓存的文件列表
 * 2.检查文件列表中的文件是否存在
 * 3.初始化vuex中的文件列表数据
 */
onMounted(() => {
  console.log("app mounted");
  renderer.syncFileList();
});
</script>

<style lang="less" scoped>
.home {
  & :deep(.el-tabs__content) {
    height: calc(100% - 41px - 15px);
  }

  & :deep(.el-tab-pane) {
    height: 100%;
  }

  .save-icon {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 5px;
    vertical-align: middle;
    border-radius: 50%;
    background-color: #409eff;

    &.inactive {
      filter: grayscale(1);
    }
  }
}
</style>
