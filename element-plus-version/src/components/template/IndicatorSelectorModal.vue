<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add', selected: any[]): void
  (e: 'update:isOpen', value: boolean): void
}>()

// Mock data for library indicators
const mockLibraryIndicators = [
  {
    id: 'IND-001',
    name: '主推大单品销售目标达成率',
    dimension: '产品规格指标',
    ruleType: '90/70阶梯制(标准型)',
    ruleCode: 'STEP_90_70',
  },
  {
    id: 'IND-002',
    name: '新客网点开拓数量',
    dimension: '渠道拓展指标',
    ruleType: '每家奖励制',
    ruleCode: 'PER_COUNT_BONUS',
  },
  {
    id: 'IND-003',
    name: '客户拜访/巡店频率合格率',
    dimension: '日常动作评估',
    ruleType: '达标任务制',
    ruleCode: 'BINARY_TASK',
  },
  {
    id: 'IND-004',
    name: '重点商品退换货率控制',
    dimension: '质量售后指标',
    ruleType: '超标扣分制',
    ruleCode: 'DEDUCT_EXCEED',
  },
  {
    id: 'IND-005',
    name: '门店利润目标达成',
    dimension: '财务指标',
    ruleType: '100/70阶梯制',
    ruleCode: 'STEP_100_70',
  },
  {
    id: 'IND-006',
    name: '月度营销活动执行到位率',
    dimension: '运营企划指标',
    ruleType: '定性主观打分',
    ruleCode: 'QUALITATIVE_100',
  },
  {
    id: 'IND-007',
    name: '促销费用预算超支控制率',
    dimension: '财务指标',
    ruleType: '预算控制减分',
    ruleCode: 'BUDGET_DEDUCT',
  },
]

const search = ref('')
const selectedIds = ref<string[]>([])

const internalOpen = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val),
})

const filteredIndicators = computed(() => {
  return mockLibraryIndicators.filter(
    (ind) => ind.name.includes(search.value) || ind.dimension.includes(search.value)
  )
})

const handleToggle = (id: string) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((i) => i !== id)
  } else {
    selectedIds.value.push(id)
  }
}

const handleConfirm = () => {
  const selectedItems = mockLibraryIndicators.filter((ind) =>
    selectedIds.value.includes(ind.id)
  )
  emit('add', selectedItems)
  selectedIds.value = [] // reset
  emit('close')
}

const handleCancel = () => {
  selectedIds.value = []
  emit('close')
}
</script>

<template>
  <el-dialog
    v-model="internalOpen"
    title="从企业指标库选取指标"
    width="640px"
    class="custom-el-dialog"
    destroy-on-close
    align-center
  >
    <div class="px-2">
      <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3 mb-6">
        <div class="bg-indigo-600 p-1.5 rounded-lg text-white">
          <Search class="h-4 w-4" />
        </div>
        <p class="text-xs text-indigo-700 font-bold leading-relaxed">
          搜索并勾选您想加入到当前考核模板中的指标，加入后您可以在模板中配置它们的权重与数据来源。
        </p>
      </div>

      <el-input
        v-model="search"
        placeholder="搜索指标名称或归属维度..."
        class="mb-6 custom-el-input"
        clearable
      >
        <template #prefix>
          <Search class="h-4 w-4 text-slate-400" />
        </template>
      </el-input>

      <div class="border border-slate-100 rounded-[24px] overflow-hidden bg-white">
        <div class="bg-slate-50 px-5 py-3 flex justify-between items-center">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">可选指标库列表</span>
          <el-tag effect="dark" round class="!bg-indigo-600 !border-none !text-[10px] !font-black !px-3">
            已选 {{ selectedIds.length }} 项指标
          </el-tag>
        </div>

        <div class="max-h-[360px] overflow-y-auto custom-scrollbar p-3 space-y-2">
          <div
            v-for="ind in filteredIndicators"
            :key="ind.id"
            @click="handleToggle(ind.id)"
            :class="[
              'flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 group',
              selectedIds.includes(ind.id)
                ? 'bg-indigo-50/50 border-indigo-200'
                : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100',
            ]"
          >
            <div
              :class="[
                'flex items-center justify-center h-6 w-6 rounded-full border-2 transition-all shrink-0',
                selectedIds.includes(ind.id)
                  ? 'bg-indigo-600 border-indigo-600 scale-110'
                  : 'bg-white border-slate-200 group-hover:border-slate-300',
              ]"
            >
              <CheckCircle2
                v-if="selectedIds.includes(ind.id)"
                class="h-4 w-4 text-white"
              />
            </div>
            
            <div class="flex flex-col flex-1 pl-1">
              <span
                :class="[
                  'font-black text-sm tracking-tight',
                  selectedIds.includes(ind.id) ? 'text-indigo-900' : 'text-slate-700',
                ]"
              >
                {{ ind.name }}
              </span>
              <div class="flex items-center gap-3 mt-1.5">
                <el-tag
                  effect="plain"
                  round
                  class="!text-[9px] !font-black !h-5 !px-2 !bg-white"
                  :type="selectedIds.includes(ind.id) ? 'primary' : 'info'"
                >
                  {{ ind.dimension }}
                </el-tag>
                <div class="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  <div class="w-1 h-1 rounded-full bg-slate-300"></div>
                  计分方式: {{ ind.ruleType }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredIndicators.length === 0" class="text-center py-16">
            <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-200">
              <Search class="h-6 w-6" />
            </div>
            <p class="text-slate-400 font-bold text-sm italic">未找到对应的指标项</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 px-2 pb-2">
        <el-button round @click="handleCancel" class="!border-none !bg-slate-100 !text-slate-500 hover:!bg-slate-200 !font-bold">取消</el-button>
        <el-button
          type="primary"
          round
          @click="handleConfirm"
          class="!px-8 !h-12 !font-black shadow-lg shadow-indigo-100"
          :disabled="selectedIds.length === 0"
        >
          确认加入考核模板 ({{ selectedIds.length }})
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.custom-el-dialog) {
  border-radius: 32px !important;
  overflow: hidden !important;
}
:deep(.custom-el-dialog .el-dialog__header) {
  padding-top: 2rem !important;
  padding-left: 2.5rem !important;
  padding-right: 2.5rem !important;
  margin-bottom: 0 !important;
}
:deep(.custom-el-dialog .el-dialog__title) {
  font-size: 1.5rem !important;
  font-weight: 900 !important;
  color: #0f172a !important;
}
:deep(.custom-el-dialog .el-dialog__body) {
  padding-left: 2.5rem !important;
  padding-right: 2.5rem !important;
  padding-top: 0.5rem !important;
  padding-bottom: 1.5rem !important;
}

:deep(.custom-el-input .el-input__wrapper) {
  border-radius: 1rem !important;
  background-color: #f8fafc !important;
  box-shadow: none !important;
  border: 2px solid transparent !important;
  height: 3rem !important;
  transition: all 0.3s;
}
:deep(.custom-el-input .el-input__wrapper.is-focus) {
  background-color: #ffffff !important;
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 4px rgba(238, 242, 255, 0.5) !important;
}
</style>
