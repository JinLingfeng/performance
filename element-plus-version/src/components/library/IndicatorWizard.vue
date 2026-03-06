<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Settings2,
  CalendarDays,
  Target,
} from 'lucide-vue-next'
import type { IndicatorData } from './IndicatorCard.vue'

const props = defineProps<{
  isOpen: boolean
  initialData: IndicatorData | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: IndicatorData): void
  (e: 'update:isOpen', value: boolean): void
}>()

const activeStep = ref(0)
const previewValue = ref(85)
const deductValue = ref(0)

const formData = ref({
  name: '',
  dimension: '销售业绩',
  mapField: '',
  period: 'month',
  ruleCode: 'STEP_90_70',
})

const internalOpen = computed({
  get: () => props.isOpen,
  set: (val) => {
    emit('update:isOpen', val)
    if (!val) emit('close')
  },
})

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      if (props.initialData) {
        formData.value = JSON.parse(JSON.stringify(props.initialData))
      } else {
        formData.value = {
          name: '',
          dimension: '销售业绩',
          mapField: '',
          period: 'month',
          ruleCode: 'STEP_90_70',
        }
      }
      activeStep.value = 0
    }
  }
)

const handleNext = () => {
  activeStep.value = 1
}

const handleBack = () => {
  activeStep.value = 0
}

const handleSave = () => {
  let ruleType = ''
  let ruleDesc = ''
  switch (formData.value.ruleCode) {
    case 'STEP_90_70':
      ruleType = '90/70阶梯制(标准型)'
      ruleDesc = '低于70%得0分，70%-90%线性得分，90%以上得满分。'
      break
    case 'STEP_80_70':
      ruleType = '80/70阶梯制(宽限型)'
      ruleDesc = '低于70%得0分，70%-80%线性得分，80%即可得满分。'
      break
    case 'STEP_100_70':
      ruleType = '100/70阶梯制(严格型)'
      ruleDesc = '低于70%得0分，70%-100%线性得分，100%以上得满分。'
      break
    case 'BUDGET_DEDUCT':
      ruleType = '预算控制(扣分型)'
      ruleDesc = 'X≤0%得满分，X＞0%每多1%扣罚1分，扣完为止。'
      break
    case 'BINARY_TASK':
      ruleType = '任务节点(二元型)'
      ruleDesc = '按期发布得满分，逾期或未发布得0分。'
      break
    case 'QUALITATIVE_100':
      ruleType = '定性测定(直接打分)'
      ruleDesc = '由主管主观打分，0-100分。'
      break
    case 'QUALITATIVE_LEVEL':
      ruleType = '定性分级'
      ruleDesc = '评定为：优秀、良好、普通、不合格。'
      break
  }

  const resultData: IndicatorData = {
    id: props.initialData?.id || Date.now().toString(),
    ...formData.value,
    ruleType,
    ruleDesc,
  }

  emit('save', resultData)
}

const stepScore = computed(() => {
  const code = formData.value.ruleCode
  let min = 70
  let max = 90
  if (code === 'STEP_80_70') max = 80
  if (code === 'STEP_100_70') max = 100

  const val = previewValue.value
  if (val < min) return 0
  if (val >= max) return 100
  return Math.round(((val - min) / (max - min)) * 100)
})

const budgetScore = computed(() => {
  return Math.max(0, 100 - deductValue.value)
})
</script>

<template>
  <el-dialog
    v-model="internalOpen"
    :title="initialData ? '编辑指标配置' : '新增指标配置'"
    width="680px"
    class="custom-el-dialog"
    destroy-on-close
    align-center
  >
    <div class="p-2">
      <el-steps :active="activeStep" finish-status="success" align-center class="mb-8 custom-el-steps">
        <el-step title="基础信息设定" />
        <el-step title="核心规则配置" />
      </el-steps>

      <div v-show="activeStep === 0" class="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3 mb-6">
          <Settings2 class="h-5 w-5 text-indigo-500 mt-0.5" />
          <p class="text-xs text-indigo-700 font-medium leading-relaxed">
            采用向导模式配置指标元数据，配置完成后，可配置成考核目标分发汇入各个业务或职能部门的月底绩效报表中。
          </p>
        </div>

        <el-form label-position="top">
          <el-form-item label="指标名称">
            <template #label>
              <div class="flex items-center gap-2 mb-1">
                <Target class="h-4 w-4 text-slate-400" />
                <span class="font-black text-slate-700">指标名称</span>
              </div>
            </template>
            <el-input 
              v-model="formData.name" 
              placeholder="例如: 月度大单品销售达成率" 
              class="custom-el-input"
            />
          </el-form-item>

          <div class="grid grid-cols-2 gap-6 mt-4">
            <el-form-item label="所属维度分类">
              <template #label>
                <div class="flex items-center gap-2 mb-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  <span class="font-black text-slate-700">所属维度分类</span>
                </div>
              </template>
              <el-select v-model="formData.dimension" placeholder="选择所属维度" class="w-full custom-el-select">
                <el-option label="销售业绩" value="销售业绩" />
                <el-option label="产品力" value="产品力" />
                <el-option label="渠道力" value="渠道力" />
                <el-option label="市场指标" value="市场指标" />
                <el-option label="费用管理" value="费用管理" />
                <el-option label="组织力" value="组织力" />
                <el-option label="行动计划" value="行动计划" />
              </el-select>
            </el-form-item>

            <el-form-item label="考核周期">
              <template #label>
                <div class="flex items-center gap-2 mb-1">
                  <CalendarDays class="h-4 w-4 text-slate-400" />
                  <span class="font-black text-slate-700">考核周期</span>
                </div>
              </template>
              <el-select v-model="formData.period" placeholder="选择考核周期" class="w-full custom-el-select">
                <el-option label="月度" value="month" />
                <el-option label="季度" value="quarter" />
                <el-option label="年度" value="year" />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div v-show="activeStep === 1" class="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div class="space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-1.5 h-3 bg-indigo-600 rounded-full"></div>
            <span class="font-black text-slate-800">打分记分规则设定</span>
          </div>

          <el-select v-model="formData.ruleCode" class="w-full custom-el-select-heavy">
            <el-option label="90/70阶梯制 (满分90%，底线70%)" value="STEP_90_70" />
            <el-option label="80/70阶梯制 (满分80%，底线70%)" value="STEP_80_70" />
            <el-option label="100/70阶梯制 (满分100%，底线70%)" value="STEP_100_70" />
            <el-option label="预算控制 (超出扣分型)" value="BUDGET_DEDUCT" />
            <el-option label="任务节点 (完成即满分，逾期0分)" value="BINARY_TASK" />
            <el-option label="定性测定 (直接打分)" value="QUALITATIVE_100" />
            <el-option label="定性分级 (优秀/良好/普通/不合格)" value="QUALITATIVE_LEVEL" />
          </el-select>

          <!-- Preview & Simulation -->
          <div v-if="formData.ruleCode.startsWith('STEP_')" class="mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div class="flex justify-between items-center mb-6">
              <span class="text-sm font-black text-slate-700">完成率模拟: <span class="text-indigo-600 ml-1">{{ previewValue }}%</span></span>
              <el-tag :type="stepScore >= 100 ? 'success' : stepScore === 0 ? 'danger' : ''" effect="dark" class="!px-4 !h-8 !rounded-full !font-black">
                预计考核得分: {{ stepScore }} 分
              </el-tag>
            </div>
            <el-slider v-model="previewValue" :max="120" :step="1" />
            <div class="flex justify-between mt-2 px-1 text-[10px] text-slate-400 font-black uppercase tracking-tighter">
              <span>0%</span>
              <span class="text-slate-500">70% (零分线)</span>
              <span class="text-indigo-600">{{ formData.ruleCode === 'STEP_80_70' ? 80 : formData.ruleCode === 'STEP_100_70' ? 100 : 90 }}% (满分线)</span>
              <span>120%</span>
            </div>
          </div>

          <div v-else-if="formData.ruleCode === 'BUDGET_DEDUCT'" class="mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div class="flex justify-between items-center mb-6">
              <span class="text-sm font-black text-slate-700">超出预算模拟: <span class="text-orange-600 ml-1">{{ deductValue }}%</span></span>
              <el-tag :type="budgetScore >= 100 ? 'success' : budgetScore === 0 ? 'danger' : 'warning'" effect="dark" class="!px-4 !h-8 !rounded-full !font-black">
                预计考核得分: {{ budgetScore }} 分
              </el-tag>
            </div>
            <el-slider v-model="deductValue" :max="120" :step="1" class="custom-orange-slider" />
            <div class="flex justify-between mt-2 px-1 text-[10px] text-slate-400 font-black uppercase tracking-tighter">
              <span class="text-emerald-500">≤0% (满分线)</span>
              <span class="text-red-500">100% (扣完线)</span>
              <span>120%</span>
            </div>
          </div>

          <div v-else-if="formData.ruleCode === 'BINARY_TASK'" class="mt-4 p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
            <p class="text-sm font-black text-slate-500 mb-4 italic">节点达成情况快速预览</p>
            <div class="flex gap-4">
              <el-button type="success" plain class="flex-1 !h-12 !rounded-2xl !font-black">已按期完成 (100分)</el-button>
              <el-button type="danger" plain class="flex-1 !h-12 !rounded-2xl !font-black">未完成/逾期 (0分)</el-button>
            </div>
          </div>

          <div v-else class="mt-4 p-12 bg-slate-50 rounded-3xl border border-dotted border-slate-200 text-center">
             <p class="text-sm text-slate-400 font-bold italic">通用打分预设，直接由考核人在月底输入 0-100 的数值。</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between px-2 pb-2">
        <div>
          <el-button v-if="activeStep === 1" @click="handleBack" round class="!font-black group">
            <div class="flex items-center gap-1.5">
              <span>上一步</span>
            </div>
          </el-button>
        </div>
        <div class="flex gap-3">
          <el-button @click="internalOpen = false" round class="!border-none !bg-slate-100 !text-slate-500 hover:!bg-slate-200 !font-black">取消</el-button>
          <el-button 
            v-if="activeStep === 0" 
            type="primary" 
            round 
            @click="handleNext" 
            :disabled="!formData.name"
            class="!px-8 !h-12 !font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all"
          >
            下一步，选择算法规则
          </el-button>
          <el-button 
            v-else 
            type="primary" 
            round 
            @click="handleSave"
            class="!px-10 !h-12 !font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all"
          >
            发布指标元数据
          </el-button>
        </div>
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
  padding-top: 1rem !important;
  padding-bottom: 1.5rem !important;
}

:deep(.custom-el-steps .is-finish .el-step__line) {
  background-color: #4f46e5 !important;
}
:deep(.custom-el-steps .is-finish .el-step__icon) {
  border-color: #4f46e5 !important;
  color: #4f46e5 !important;
}
:deep(.custom-el-steps .el-step__title) {
  font-weight: 900 !important;
  font-size: 0.75rem !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  background-color: white !important;
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 4px rgba(238, 242, 255, 0.5) !important;
}

:deep(.custom-el-select .el-select__wrapper) {
  border-radius: 1rem !important;
  background-color: #f8fafc !important;
  box-shadow: none !important;
  border: 2px solid transparent !important;
  height: 3rem !important;
}
:deep(.custom-el-select .el-select__wrapper.is-focused) {
  background-color: white !important;
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 4px rgba(238, 242, 255, 0.5) !important;
}

:deep(.custom-el-select-heavy .el-select__wrapper) {
  border-radius: 1rem !important;
  background-color: #eef2ff !important;
  box-shadow: none !important;
  border: 2px solid #e0e7ff !important;
  height: 3.5rem !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}
:deep(.custom-el-select-heavy .el-select__placeholder) {
  font-weight: 900;
  color: #4338ca;
}

:deep(.custom-orange-slider .el-slider__bar) {
  background-color: #f97316 !important;
}
:deep(.custom-orange-slider .el-slider__button) {
  border-color: #f97316 !important;
}

.animate-in {
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
