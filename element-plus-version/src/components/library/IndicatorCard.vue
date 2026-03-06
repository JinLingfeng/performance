<script setup lang="ts">
import { TrendingUp, FileText, Calendar } from 'lucide-vue-next'
import type { LucideIcon } from 'lucide-vue-next'

export interface IndicatorData {
  id: string
  name: string
  dimension: string
  ruleType: string
  ruleDesc: string
  ruleCode: string
  mapField: string
  period: string
}

const props = defineProps<{
  data: IndicatorData
}>()

defineEmits<{
  (e: 'click'): void
}>()

const getDimensionIcon = (dim: string): LucideIcon => {
  switch (dim) {
    case '销售业绩': return TrendingUp
    case '产品力': return FileText
    default: return Calendar
  }
}
</script>

<template>
  <el-card 
    shadow="hover" 
    class="custom-el-card group cursor-pointer"
    @click="$emit('click')"
  >
    <div class="flex flex-col h-full">
      <div class="flex items-start justify-between mb-4">
        <div class="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
          <component :is="getDimensionIcon(props.data.dimension)" class="h-5 w-5" />
        </div>
        <el-tag size="small" effect="plain" round class="indicator-badge">
          {{ props.data.dimension }}
        </el-tag>
      </div>

      <h3 class="font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
        {{ props.data.name }}
      </h3>
      
      <p class="text-[10px] text-slate-400 font-bold mb-4 line-clamp-2 italic">
        {{ props.data.ruleDesc }}
      </p>

      <div class="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ props.data.ruleType }}</span>
        </div>
        <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">{{ props.data.period === 'month' ? '月度' : '年度' }}</span>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
:deep(.custom-el-card) {
  border-radius: 24px !important;
  border-color: #f1f5f9 !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  height: 100%;
}
:deep(.custom-el-card:hover) {
  transform: translateY(-4px);
  border-color: #e0e7ff !important;
  box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.1) !important;
}

:deep(.custom-el-card .el-card__body) {
  height: 100%;
  padding: 1.5rem !important;
  transition: background-color 0.3s;
}

:deep(.custom-el-card:hover .el-card__body) {
  background-color: #f1f5f9;
}

:deep(.custom-el-card .indicator-badge) {
  font-size: 10px !important;
  font-weight: 900 !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #4f46e5 !important;
  color: white !important;
  border: none !important;
}
</style>
