<script setup lang="ts">
import { ref } from 'vue'
import { FileText, LayoutTemplate, Settings2 } from 'lucide-vue-next'
import IndicatorLibrary from '@/components/library/IndicatorLibrary.vue'
import TemplateList from '@/components/template/TemplateList.vue'

const activeTab = ref('library')
</script>

<template>
  <div class="p-8 h-full flex flex-col gap-6 animate-in fade-in duration-500">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
          <Settings2 class="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-black tracking-tight text-slate-900">绩效配置中心</h1>
          <p class="text-sm text-slate-500 font-medium mt-1">统一管理企业考核指标元数据与绩效评价模板</p>
        </div>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="flex-1 custom-el-tabs">
      <el-tab-pane name="library">
        <template #label>
          <div class="flex items-center gap-2">
            <FileText class="h-4 w-4" />
            <span>指标元数据库</span>
          </div>
        </template>
        <div class="py-4">
          <IndicatorLibrary />
        </div>
      </el-tab-pane>
      
      <el-tab-pane name="template">
        <template #label>
          <div class="flex items-center gap-2">
            <LayoutTemplate class="h-4 w-4" />
            <span>考核模板管理</span>
          </div>
        </template>
        <div class="py-4">
          <TemplateList />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
:deep(.custom-el-tabs .el-tabs__item) {
  font-weight: 900;
  color: #94a3b8;
  font-size: 1rem;
  height: 3rem;
}
:deep(.custom-el-tabs .el-tabs__item.is-active) {
  color: #4f46e5;
}
:deep(.custom-el-tabs .el-tabs__active-bar) {
  background-color: #4f46e5;
  height: 0.25rem;
  border-radius: 9999px;
}
:deep(.custom-el-tabs .el-tabs__nav-wrap::after) {
  background-color: #f1f5f9;
}

.animate-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
