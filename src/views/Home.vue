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

    <EmptyActions
      v-if="$store.getters.fileList.length === 0"
      @addFile="addNewFile"
    />
  </div>
</template>

<script setup>
import { defineComponent, ref, onMounted, nextTick } from "vue";
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

// 响应菜单新建
renderer.addNewFile(() => {
  addNewFile();
});
/**
 * 新建文档
 */
const addNewFile = () => {
  let name = null;
  for (let i = 1; i <= 1000; i++) {
    const tempName = `未命名-${i}.md`;
    console.log(
      tempName,
      store.getters.fileList.some((f) => f.name === tempName)
    );
    if (!store.getters.fileList.some((f) => f.name === tempName)) {
      name = tempName;
      break;
    }
  }
  console.log(name);
  store.commit("addFile", {
    name,
    fileData: "",
  });
  nextTick(() => (currentFile.value = store.getters.fileList.length - 1));
};

/**
 * 保存文件
 * @param {*} file
 */
const saveFile = (file) => {
  // console.log(file);
  if (file.fileData === file.tempData) return;
  // 如果文件没有路径，按照新文件来保存
  if (!file.path) {
    saveNewFile(file);
    return;
  }

  loading.value = true;
  // return new Promise((resolve, reject) => {
  return renderer
    .saveFile(file.path, file.tempData || file.fileData)
    .then((path, fileData) => {
      console.log("saved", path, fileData);
      Promise.resolve();
      ElMessage.success("已保存！");
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
 * 保存新文件
 * @param {*} file
 */
const saveNewFile = (file) => {
  loading.value = true;
  renderer
    .openSaveFile(JSON.parse(JSON.stringify(file)))
    .then(() => {
      ElMessage.success("已保存！");
    })
    .catch((e) => {
      ElMessage.error(e);
    })
    .finally(() => (loading.value = false));
};
// 响应菜单保存文件
renderer.saveFileMenu(() => {
  saveFile(store.getters.fileList[currentFile.value]);
});

// 响应菜单关闭文件
renderer.closeFile(() => {
  closeFile(currentFile.value);
});

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
  & :deep(.el-tabs__header) {
    margin-bottom: 0;
  }

  & :deep(.el-tabs__content) {
    height: calc(100% - 41px);
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
