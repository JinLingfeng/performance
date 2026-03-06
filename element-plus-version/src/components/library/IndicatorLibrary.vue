<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search, FileText } from 'lucide-vue-next'
import IndicatorCard, { type IndicatorData } from '@/components/library/IndicatorCard.vue'
import IndicatorWizard from '@/components/library/IndicatorWizard.vue'

const initialIndicators: IndicatorData[] = [
  {
    id: '1',
    name: '主推大单品销售目标达成率',
    dimension: '产品力',
    ruleType: '90/70阶梯制(标准型)',
    ruleDesc: '低于70%得0分，70%-90%线性得分，90%以上得满分。',
    ruleCode: 'STEP_90_70',
    mapField: 'api_act_big_item_sales',
    period: 'month',
  },
  {
    id: '2',
    name: '新客户开发目标达成率',
    dimension: '市场指标',
    ruleType: '100/70阶梯制(严格型)',
    ruleDesc: '低于70%得0分，70%-100%线性得分，100%以上得满分甚至奖励。',
    ruleCode: 'STEP_100_70',
    mapField: 'input_new_customer_count',
    period: 'month',
  },
  {
    id: '3',
    name: '月度OT合格店打造积分达成率',
    dimension: '渠道力',
    ruleType: '80/70阶梯制(宽限型)',
    ruleDesc: '低于70%得0分，70%-80%线性得分，80%即可得满分。',
    ruleCode: 'STEP_80_70',
    mapField: 'api_ot_store_points',
    period: 'month',
  },
  {
    id: '4',
    name: 'TP费用预算达标率',
    dimension: '费用管理',
    ruleType: '预算控制(扣分型)',
    ruleDesc: '预算费用超出部分按比例倒扣分，封底为0。',
    ruleCode: 'BUDGET_DEDUCT',
    mapField: 'api_tp_budget_rate',
    period: 'month',
  },
  {
    id: '5',
    name: '月度1+3行动计划通知达标率',
    dimension: '行动计划',
    ruleType: '任务节点(二元型)',
    ruleDesc: '按期发布得满分，逾期或未发布得0分。',
    ruleCode: 'BINARY_TASK',
    mapField: 'manual_plan_push',
    period: 'month',
  },
  {
    id: '6',
    name: '跨部门协作评价',
    dimension: '组织力',
    ruleType: '定性测定(直接打分)',
    ruleDesc: '由相关部门主管直接主观打分，0-100分。',
    ruleCode: 'QUALITATIVE_100',
    mapField: 'manager_eval_score',
    period: 'month',
  },
]

const search = ref('')
const dimensionFilter = ref('all')
const ruleFilter = ref('all')
const indicators = ref<IndicatorData[]>(initialIndicators)
const isWizardOpen = ref(false)
const editingIndicator = ref<IndicatorData | null>(null)

const filtered = computed(() => {
  return indicators.value.filter((ind) => {
    const matchSearch = ind.name.includes(search.value)
    const matchDimension = dimensionFilter.value === 'all' || ind.dimension === dimensionFilter.value
    const matchRule = ruleFilter.value === 'all' || ind.ruleType.includes(ruleFilter.value)
    return matchSearch && matchDimension && matchRule
  })
})

const handleEdit = (indicator: IndicatorData) => {
  editingIndicator.value = JSON.parse(JSON.stringify(indicator))
  isWizardOpen.value = true
}

const handleAddNew = () => {
  editingIndicator.value = null
  isWizardOpen.value = true
}

const handleSave = (newInd: IndicatorData) => {
  if (editingIndicator.value) {
    indicators.value = indicators.value.map((i) =>
      i.id === newInd.id ? newInd : i
    )
  } else {
    indicators.value = [
      { ...newInd, id: Date.now().toString() },
      ...indicators.value,
    ]
  }
  isWizardOpen.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-black tracking-tight text-slate-900 border-l-4 border-indigo-600 pl-3">企业指标元数据库</h2>
        <p class="text-xs text-slate-400 font-bold mt-1 pl-4 uppercase tracking-widest">Indicator Management System</p>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <el-input
          v-model="search"
          placeholder="搜索指标名称..."
          class="!w-48 lg:!w-64 custom-el-input"
          clearable
        >
          <template #prefix>
            <Search class="h-4 w-4 text-slate-400" />
          </template>
        </el-input>

        <el-select v-model="dimensionFilter" placeholder="全部分类" class="!w-32 custom-el-select">
          <el-option label="全部分类" value="all" />
          <el-option label="销售业绩" value="销售业绩" />
          <el-option label="产品力" value="产品力" />
          <el-option label="市场指标" value="市场指标" />
          <el-option label="渠道力" value="渠道力" />
          <el-option label="费用管理" value="费用管理" />
          <el-option label="组织力" value="组织力" />
          <el-option label="行动计划" value="行动计划" />
        </el-select>

        <el-button @click="handleAddNew" type="primary" round class="!px-5 !font-black !h-10 shadow-lg shadow-indigo-100 transition-all active:scale-95">
          <Plus class="mr-1.5 h-4 w-4" />
          新建指标
        </el-button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <IndicatorCard
        v-for="ind in filtered"
        :key="ind.id"
        :data="ind"
        @click="handleEdit(ind)"
      />
      
      <div
        v-if="filtered.length === 0"
        class="col-span-full flex flex-col items-center justify-center p-20 text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl bg-white/50"
      >
        <FileText class="h-10 w-10 mb-4 text-slate-200" />
        <p class="font-bold">未找到符合条件的指标</p>
      </div>
    </div>

    <IndicatorWizard
      v-model:is-open="isWizardOpen"
      :initial-data="editingIndicator"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
:deep(.custom-el-input .el-input__wrapper) {
  border-radius: 0.75rem !important;
  background-color: white !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
}
:deep(.custom-el-input .el-input__wrapper.is-focus) {
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 4px rgba(238, 242, 255, 0.5) !important;
}

:deep(.custom-el-select .el-select__wrapper) {
  border-radius: 0.75rem !important;
  background-color: white !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
  height: 2.5rem !important;
}
:deep(.custom-el-select .el-select__wrapper.is-focused) {
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 4px rgba(238, 242, 255, 0.5) !important;
}
</style>
