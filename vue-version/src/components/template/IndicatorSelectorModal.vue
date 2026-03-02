<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, CheckCircle2 } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

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
  <Dialog v-model:open="internalOpen">
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>从企业指标库选取指标</DialogTitle>
        <DialogDescription>
          搜索并勾选您想加入到当前考核模板中的指标，加入后您可以在模板中配置它们的权重与数据来源。
        </DialogDescription>
      </DialogHeader>

      <div class="flex items-center gap-3 py-4">
        <div class="relative flex-1">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="搜索指标名称或归属维度..."
            class="pl-9"
            v-model="search"
          />
        </div>
      </div>

      <div class="border rounded-md">
        <div
          class="bg-slate-50 border-b px-4 py-2 flex justify-between text-xs font-semibold text-slate-500"
        >
          <span>可选指标列表</span>
          <span>已选 {{ selectedIds.length }} 项</span>
        </div>
        <ScrollArea class="h-[300px]">
          <div class="p-2 space-y-1">
            <div
              v-for="ind in filteredIndicators"
              :key="ind.id"
              @click="handleToggle(ind.id)"
              :class="[
                'flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all border',
                selectedIds.includes(ind.id)
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200',
              ]"
            >
              <div
                :class="[
                  'flex items-center justify-center h-5 w-5 rounded-full border',
                  selectedIds.includes(ind.id)
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-slate-300',
                ]"
              >
                <CheckCircle2
                  v-if="selectedIds.includes(ind.id)"
                  class="h-3.5 w-3.5 text-white"
                />
              </div>
              <div class="flex flex-col flex-1 pl-1">
                <span
                  :class="[
                    'font-medium',
                    selectedIds.includes(ind.id) ? 'text-blue-900' : 'text-slate-700',
                  ]"
                >
                  {{ ind.name }}
                </span>
                <div class="flex gap-2 mt-1">
                  <Badge
                    variant="outline"
                    class="text-[10px] bg-white h-4 font-normal text-slate-500"
                  >
                    {{ ind.dimension }}
                  </Badge>
                  <span class="text-[10px] text-slate-400">计分: {{ ind.ruleType }}</span>
                </div>
              </div>
            </div>
            <div v-if="filteredIndicators.length === 0" class="text-center py-10 text-slate-500 text-sm">
              未找到对应的指标项
            </div>
          </div>
        </ScrollArea>
      </div>

      <DialogFooter class="mt-4">
        <Button variant="outline" @click="handleCancel">取消</Button>
        <Button
          @click="handleConfirm"
          class="bg-blue-600 hover:bg-blue-700 text-white"
          :disabled="selectedIds.length === 0"
        >
          确认添加 ({{ selectedIds.length }})
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
