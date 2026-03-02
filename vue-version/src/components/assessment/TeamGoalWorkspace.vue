<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  Send,
  CheckCircle2,
  CircleDashed,
  AlertCircle,
  FileSignature,
  ArrowRight,
  Save,
  CalendarDays,
  TrendingDown,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Define Props
interface Props {
  isLocked?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isLocked: false,
})

// Mock Data
const employees = [
  { id: 'emp-001', name: '刘小红', role: 'KA经理', avatar: 'XH', status: 'pending_set' },
  { id: 'emp-002', name: '胡凌波', role: 'KA经理', avatar: 'LB', status: 'pending_confirm' },
  { id: 'emp-003', name: '穆宏洋', role: 'KA经理', avatar: 'HY', status: 'confirmed' },
  { id: 'emp-004', name: '邱臻', role: 'KA经理', avatar: 'QZ', status: 'disputed' },
  { id: 'emp-005', name: '郑甜甜', role: 'KA经理', avatar: 'TT', status: 'pending_set' },
]

const mockIndicators = [
  {
    id: 'ind-001',
    name: '门店实际销售总额',
    nature: '越高越好',
    weight: 60,
    aggregation: '月度累加',
    source: '系统接口直连',
    targetBase: '',
  },
  {
    id: 'ind-002',
    name: '连带率考核',
    nature: '越高越好',
    weight: 20,
    aggregation: '按下达值平均',
    source: '人工填报',
    targetBase: '',
  },
  {
    id: 'ind-003',
    name: '重点客诉事件处罚',
    nature: '越低越好',
    weight: 20,
    aggregation: '单次触发',
    source: '管理扣分',
    targetBase: '0',
  },
]

type EmployeeStatus = 'pending_set' | 'pending_confirm' | 'confirmed' | 'disputed'

const searchQuery = ref('')
const selectedEmpId = ref('emp-001')
const targets = ref<Record<string, string>>({})

const getStatusUI = (status: EmployeeStatus) => {
  switch (status) {
    case 'pending_set':
      return {
        icon: CircleDashed,
        iconClass: 'text-slate-300',
        badgeText: '待设定目标',
        badgeClass: 'text-slate-500 bg-slate-50 border-slate-200',
      }
    case 'pending_confirm':
      return {
        icon: FileSignature,
        iconClass: 'text-amber-500',
        badgeText: '待员工签署',
        badgeClass: 'text-amber-600 bg-amber-50 border-amber-200',
      }
    case 'confirmed':
      return {
        icon: CheckCircle2,
        iconClass: 'text-emerald-500',
        badgeText: '已签署确认',
        badgeClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      }
    case 'disputed':
      return {
        icon: AlertCircle,
        iconClass: 'text-red-500',
        badgeText: '有异议',
        badgeClass: 'text-red-600 bg-red-50 border-red-200',
      }
    default:
      return { icon: null, iconClass: '', badgeText: '', badgeClass: '' }
  }
}

const selectedEmp = computed(() => employees.find((e) => e.id === selectedEmpId.value))

const stats = computed(() => ({
  total: employees.length,
  pendingSet: employees.filter((e) => e.status === 'pending_set').length,
  pendingConfirm: employees.filter((e) => e.status === 'pending_confirm').length,
  confirmed: employees.filter((e) => e.status === 'confirmed').length,
}))

const filteredEmployees = computed(() =>
  employees.filter((e) => e.name.includes(searchQuery.value)),
)

const handleTargetChange = (indId: string, value: string) => {
  targets.value[indId] = value
}
</script>

<template>
  <div class="h-full flex flex-col bg-slate-50/30 overflow-hidden">
    <!-- Top Statistics Area -->
    <div class="px-8 pt-8 shrink-0">
      <div
        class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
      >
        <div>
          <div class="flex items-center gap-3 mb-1">
            <Badge variant="secondary" class="bg-blue-100 text-blue-700 hover:bg-blue-100">
              目标设定阶段
            </Badge>
            <h3 class="text-xl font-bold text-slate-900">2026年3月份初级销售KPI指标下发</h3>
          </div>
          <p class="text-sm text-slate-500 flex items-center mt-2">
            <CalendarDays class="h-4 w-4 mr-1.5 opacity-70" />
            当前窗口: 2026/03/01 - 2026/03/07 (截止设定时间)
          </p>
        </div>

        <div class="flex items-center gap-4 lg:gap-8 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <div class="text-center shrink-0">
            <div class="text-2xl font-bold text-slate-700">{{ stats.total }}</div>
            <div class="text-[10px] text-slate-500 font-bold mt-1 uppercase">团队成员</div>
          </div>
          <div class="h-10 w-px bg-slate-200 hidden lg:block"></div>
          <div class="text-center shrink-0">
            <div class="text-2xl font-bold text-amber-500">{{ stats.pendingConfirm }}</div>
            <div class="text-[10px] text-slate-500 font-bold mt-1 uppercase">待签署</div>
          </div>
          <div class="h-10 w-px bg-slate-200 hidden lg:block"></div>
          <div class="text-center shrink-0">
            <div class="text-2xl font-bold text-slate-400">{{ stats.pendingSet }}</div>
            <div class="text-[10px] text-slate-500 font-bold mt-1 uppercase">待设定</div>
          </div>
          <div class="h-10 w-px bg-slate-200 hidden lg:block"></div>
          <div class="text-center shrink-0">
            <div class="text-2xl font-bold text-emerald-500">{{ stats.confirmed }}</div>
            <div class="text-[10px] text-slate-500 font-bold mt-1 uppercase">已确认</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Workspace Area -->
    <div class="flex-1 p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        <!-- Left Side: Employee List -->
        <div
          class="col-span-1 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-w-0"
        >
          <div class="p-4 border-b border-slate-100 bg-slate-50/50">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                v-model="searchQuery"
                placeholder="搜索下属姓名..."
                class="pl-9 bg-white border-slate-200"
              />
            </div>
          </div>
          <div class="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
            <div
              v-for="emp in filteredEmployees"
              :key="emp.id"
              @click="selectedEmpId = emp.id"
              :class="[
                'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border',
                selectedEmpId === emp.id
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'border-transparent hover:bg-slate-50',
              ]"
            >
              <Avatar class="h-10 w-10 border border-slate-200 shadow-sm">
                <AvatarFallback
                  :class="[
                    'text-xs font-bold',
                    selectedEmpId === emp.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600',
                  ]"
                >
                  {{ emp.avatar }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span
                    :class="[
                      'font-semibold truncate',
                      selectedEmpId === emp.id ? 'text-blue-900' : 'text-slate-700',
                    ]"
                  >
                    {{ emp.name }}
                  </span>
                  <component
                    :is="getStatusUI(emp.status as EmployeeStatus).icon"
                    :class="['h-4 w-4', getStatusUI(emp.status as EmployeeStatus).iconClass]"
                  />
                </div>
                <div class="text-xs text-slate-500 truncate mt-0.5">{{ emp.role }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Target Setting Form -->
        <div
          class="col-span-1 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-w-0"
        >
          <template v-if="selectedEmp">
            <!-- Employee Detail Header -->
            <div
              class="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0"
            >
              <div class="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                <Avatar class="h-14 w-14 border border-slate-200 shadow-sm shrink-0">
                  <AvatarFallback class="bg-slate-100 text-slate-600 text-lg font-bold">
                    {{ selectedEmp.avatar }}
                  </AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <div class="flex items-center gap-3">
                    <h4 class="text-xl font-bold text-slate-900 truncate">{{ selectedEmp.name }}</h4>
                    <Badge
                      variant="outline"
                      :class="getStatusUI(selectedEmp.status as EmployeeStatus).badgeClass"
                    >
                      {{ getStatusUI(selectedEmp.status as EmployeeStatus).badgeText }}
                    </Badge>
                  </div>
                  <p class="text-sm text-slate-500 mt-1 truncate">
                    岗位角色: {{ selectedEmp.role }} · 匹配模板: 门店导购基础考核模板
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <Button variant="outline" class="bg-white text-slate-700" :disabled="props.isLocked">
                  <Save class="h-4 w-4 mr-2 shrink-0" />
                  暂存修改
                </Button>
                <Button
                  class="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  :disabled="selectedEmp.status !== 'pending_set' || props.isLocked"
                >
                  <Send class="h-4 w-4 mr-2 shrink-0" />
                  下发让其确认
                </Button>
              </div>
            </div>

            <!-- Indicators Form Area -->
            <div
              class="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar"
            >
              <div v-if="props.isLocked" class="mb-6">
                <div
                  class="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl inline-flex items-start gap-3 text-sm shadow-sm max-w-full"
                >
                  <AlertCircle class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <p class="flex-1 leading-relaxed">
                    当前不处于<b>指标设定阶段</b>。系统已自动锁定输入，您仅可浏览本期历史设定的目标基数。
                  </p>
                </div>
              </div>

              <div v-if="selectedEmp.status !== 'pending_set' && !props.isLocked" class="mb-6">
                <div
                  class="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl inline-flex items-start gap-3 text-sm shadow-sm max-w-full"
                >
                  <AlertCircle class="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p class="flex-1 leading-relaxed">
                    当前员工考核目标已下发。员工处于<b>{{
                      selectedEmp.status === 'pending_confirm' ? '待签署' : '已签署'
                    }}</b>状态时，目标不建议随意修改。如确需调整，需先撤回重新流转。
                  </p>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  v-for="(ind, index) in mockIndicators"
                  :key="ind.id"
                  class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors"
                >
                  <!-- Top bar -->
                  <div
                    class="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        class="bg-blue-100 text-blue-600 w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                      >
                        {{ index + 1 }}
                      </div>
                      <h5 class="font-bold text-slate-800">{{ ind.name }}</h5>
                      <Badge variant="secondary" class="font-normal text-[10px] ml-2">
                        {{ ind.nature }}
                      </Badge>
                    </div>
                    <div class="text-sm font-semibold text-slate-700">权重: {{ ind.weight }}%</div>
                  </div>

                  <!-- Middle config -->
                  <div class="p-5 flex flex-col md:flex-row gap-6 items-center">
                    <!-- Left: properties -->
                    <div class="flex-1 grid grid-cols-2 gap-4 text-sm w-full">
                      <div>
                        <div class="text-slate-400 text-xs mb-1">数据采集方式</div>
                        <div
                          class="font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 inline-block"
                        >
                          {{ ind.source }}
                        </div>
                      </div>
                      <div>
                        <div class="text-slate-400 text-xs mb-1">考核汇聚手段</div>
                        <div
                          class="font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 inline-block"
                        >
                          {{ ind.aggregation }}
                        </div>
                      </div>
                    </div>

                    <ArrowRight class="h-5 w-5 text-slate-300 hidden md:block shrink-0" />

                    <!-- Right: Target input component -->
                    <div
                      class="w-full md:w-[320px] shrink-0 bg-blue-50/50 rounded-xl border border-blue-100 p-4"
                    >
                      <div class="mb-2 flex items-center justify-between">
                        <span class="text-xs font-bold text-blue-800">🎯 设定本期目标基数值：</span>
                      </div>
                      <Input
                        class="h-11 bg-white border-blue-200 shadow-sm text-center font-bold text-lg focus-visible:ring-blue-500"
                        placeholder="请输入需达成的具体数值..."
                        :value="targets[ind.id] !== undefined ? targets[ind.id] : ind.targetBase"
                        @input="(e: Event) => handleTargetChange(ind.id, (e.target as HTMLInputElement).value)"
                        :disabled="selectedEmp.status !== 'pending_set' || props.isLocked"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/10">
            <TrendingUp class="h-16 w-16 mb-4 opacity-20" />
            <p>请在左侧选择需要设定目标的员工</p>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>
