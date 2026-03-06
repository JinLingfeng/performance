<script setup lang="ts">
import { computed } from 'vue'
import { FileText, Database, ClipboardCheck, Calendar } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  indicators: any[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
  (e: 'update:isOpen', value: boolean): void
}>()

const internalOpen = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val),
})

const getMockValues = (i: number) => {
  const mockAchieved = i === 0 ? 24500 : i === 2 ? 1 : 450
  const mockTarget = i === 0 ? 50000 : i === 2 ? 0 : 500
  const progressPercent = Math.min(
    100,
    Math.max(0, (mockAchieved / (mockTarget || 1)) * 100)
  )
  return { mockAchieved, mockTarget, progressPercent }
}
</script>

<template>
  <el-dialog
    v-model="internalOpen"
    title="员工日报填报预览"
    width="680px"
    class="custom-el-dialog"
    destroy-on-close
    align-center
  >
    <div class="px-2">
      <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3 mb-6">
        <div class="bg-indigo-600 p-1.5 rounded-lg text-white">
          <Calendar class="h-4 w-4" />
        </div>
        <p class="text-xs text-indigo-700 font-bold leading-relaxed">
          以下是根据您当前模板配置，员工在提交每日日志时看到的待办数据呈现。请确认界面交互及数据汇总逻辑正确。
        </p>
      </div>

      <div class="bg-slate-50/80 rounded-[32px] border border-slate-100 p-6 max-h-[520px] overflow-y-auto custom-scrollbar">
        <div class="space-y-6">
          <!-- Fake Context Header -->
          <div class="flex justify-between items-center pb-4 border-b border-slate-200">
            <div class="flex items-center gap-2">
              <span class="text-sm font-black text-slate-900 tracking-tight">2026年3月15日 (周日)</span>
              <span class="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-black text-slate-500 uppercase">日报待填</span>
            </div>
            <el-tag type="primary" effect="plain" round class="!font-black !text-[10px]">待提交系统</el-tag>
          </div>

          <div v-if="indicators.length === 0" class="text-center py-16">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-slate-200 border border-slate-100">
               <FileText class="h-6 w-6" />
            </div>
            <p class="text-xs text-slate-400 font-bold italic">模板当前没有任何指标，请先选取指标</p>
          </div>
          
          <div v-else class="space-y-4">
            <el-card
              v-for="(ind, i) in indicators"
              :key="ind.id"
              shadow="never"
              class="!border-slate-200 !rounded-3xl !bg-white/80 !backdrop-blur-sm"
            >
              <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
                <div class="flex items-center gap-2">
                  <div :class="[ind.dataSourceType === 'manual' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600', 'p-1.5 rounded-lg']">
                    <FileText v-if="ind.dataSourceType === 'manual'" class="h-4 w-4" />
                    <Database v-else class="h-4 w-4" />
                  </div>
                  <span class="text-sm font-black text-slate-800">{{ ind.name }}</span>
                </div>
                <el-tag
                  v-if="ind.dataSourceType !== 'manual'"
                  type="info"
                  effect="plain"
                  round
                  class="!text-[9px] !font-black !bg-slate-50"
                >
                  系统自动提取
                </el-tag>
              </div>

              <div v-if="ind.dataSourceType === 'manual'" class="space-y-3">
                <div class="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <p class="text-[10px] text-emerald-700 font-black leading-relaxed">
                    <span class="uppercase tracking-widest mr-1">📝 指引:</span>
                    {{ ind.dataSourceValue || '请输入今日实际达成数值...' }}
                  </p>
                </div>
                <el-input
                  type="number"
                  placeholder="填写今日实际完成数值"
                  class="custom-el-input-manual"
                >
                  <template #suffix>
                    <span class="text-[10px] font-black text-slate-400 mr-2">VALUE</span>
                  </template>
                </el-input>
              </div>
              
              <div v-else class="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-50">
                <div class="flex justify-between items-end mb-3">
                  <div>
                    <p class="text-[10px] text-slate-400 mb-1 font-black uppercase tracking-widest">
                      今日当前实时累计
                    </p>
                    <div class="flex items-baseline gap-2">
                      <span class="text-2xl font-black text-slate-900 tracking-tighter">
                        {{ getMockValues(i).mockAchieved.toLocaleString() }}
                      </span>
                      <span class="text-[10px] text-slate-400 font-black">
                        / {{ getMockValues(i).mockTarget.toLocaleString() }} (目标)
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-black text-indigo-600 tracking-tighter">
                      {{ getMockValues(i).progressPercent.toFixed(1) }}%
                    </div>
                  </div>
                </div>
                <el-progress 
                  :percentage="getMockValues(i).progressPercent" 
                  :stroke-width="8" 
                  :show-text="false"
                  class="custom-el-progress"
                  color="#4f46e5"
                />
              </div>
            </el-card>

            <div class="space-y-2 pt-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                今日工作总结与计划
              </label>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="工作总结与明日核心事项..."
                class="custom-el-textarea"
              />
            </div>
          </div>

          <el-button type="primary" class="!w-full !h-14 !rounded-2xl !font-black !text-base shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all mt-4">
             确认并提交今日数据
          </el-button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 px-2 pb-2">
        <el-button round @click="emit('close')" class="!border-none !bg-slate-100 !text-slate-500 hover:!bg-slate-200 !font-bold">取消预览</el-button>
        <el-button
          type="success"
          round
          @click="emit('confirm')"
          class="!px-10 !h-12 !font-black shadow-lg shadow-emerald-100"
        >
          <ClipboardCheck class="h-4 w-4 mr-2" />
          界面确认无误
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.custom-el-dialog) {
  border-radius: 40px !important;
  overflow: hidden !important;
}
:deep(.custom-el-dialog .el-dialog__header) {
  padding-top: 2.5rem !important;
  padding-left: 3rem !important;
  padding-right: 3rem !important;
  margin-bottom: 0 !important;
}
:deep(.custom-el-dialog .el-dialog__title) {
  font-size: 1.5rem !important;
  font-weight: 900 !important;
  color: #0f172a !important;
}
:deep(.custom-el-dialog .el-dialog__body) {
  padding-left: 3rem !important;
  padding-right: 3rem !important;
  padding-top: 0.5rem !important;
  padding-bottom: 2rem !important;
}

:deep(.custom-el-input-manual .el-input__wrapper) {
  border-radius: 1rem !important;
  background-color: #ffffff !important;
  box-shadow: none !important;
  border: 2px solid #d1fae5 !important;
  height: 3rem !important;
}
:deep(.custom-el-input-manual .el-input__wrapper.is-focus) {
  border-color: #34d399 !important;
  box-shadow: 0 0 0 4px rgba(209, 250, 229, 0.5) !important;
}

:deep(.custom-el-textarea .el-textarea__inner) {
  border-radius: 1rem !important;
  background-color: #ffffff !important;
  box-shadow: none !important;
  border: 2px solid #f1f5f9 !important;
  padding: 1rem !important;
  font-weight: 500 !important;
}
:deep(.custom-el-textarea .el-textarea__inner:focus) {
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 4px rgba(238, 242, 255, 0.5) !important;
}

:deep(.custom-el-progress .el-progress-bar__outer) {
  background-color: rgba(226, 232, 240, 0.5) !important;
}
</style>
