<script setup lang="ts">
import { ref } from 'vue'
import { FileText, LayoutTemplate, Settings2 } from 'lucide-vue-next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import IndicatorLibrary from '@/components/library/IndicatorLibrary.vue'
import TemplateList from '@/components/template/TemplateList.vue'

const activeTab = ref('library')
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-100">
          <Settings2 class="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-black tracking-tight text-slate-900">绩效配置中心</h1>
          <p class="text-sm text-slate-500">统一管理企业考核指标元数据与绩效评价模板</p>
        </div>
      </div>
    </div>

    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full grid-cols-2 h-14 bg-slate-100/50 p-1.5 rounded-2xl shadow-inner border border-slate-200/60 backdrop-blur-sm">
        <TabsTrigger
          value="library"
          class="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-sm transition-all duration-300"
        >
          <FileText class="h-4 w-4 mr-2 text-blue-600" />
          指标元数据库
        </TabsTrigger>
        <TabsTrigger
          value="template"
          class="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-sm transition-all duration-300"
        >
          <LayoutTemplate class="h-4 w-4 mr-2 text-purple-600" />
          考核模板管理
        </TabsTrigger>
      </TabsList>

      <div class="mt-8">
        <TabsContent value="library" class="m-0 focus-visible:outline-none">
          <IndicatorLibrary />
        </TabsContent>
        
        <TabsContent value="template" class="m-0 focus-visible:outline-none">
          <TemplateList />
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>

<style scoped>
.animate-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
