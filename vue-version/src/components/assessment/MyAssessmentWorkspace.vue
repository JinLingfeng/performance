<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  AlertCircle,
  FileSignature,
  CheckCircle2,
  Calculator,
  ArrowRight,
  Wallet,
  Target,
  TrendingUp,
  Award,
  ChevronLeft,
  CalendarDays,
  Clock,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Define Props
interface Props {
  isLocked?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isLocked: false,
})

// ========== Mock Data ==========
const cycleList = [
  {
    id: 'cycle-2026-03',
    title: '2026年3月份初级销售KPI考核',
    period: '2026-03-01 ~ 2026-03-31',
    status: 'pending_confirm' as const,
    totalScore: null,
    grade: null,
  },
  {
    id: 'cycle-2026-02',
    title: '2026年2月份初级销售KPI考核',
    period: '2026-02-01 ~ 2026-02-28',
    status: 'finished' as const,
    totalScore: 82.3,
    grade: 'B',
  },
  {
    id: 'cycle-2026-01',
    title: '2026年1月份初级销售KPI考核',
    period: '2026-01-01 ~ 2026-01-31',
    status: 'finished' as const,
    totalScore: 91.5,
    grade: 'A',
  },
  {
    id: 'cycle-2025-12',
    title: '2025年12月份初级销售KPI考核',
    period: '2025-12-01 ~ 2025-12-31',
    status: 'finished' as const,
    totalScore: 76.8,
    grade: 'B',
  },
]

const personalIndicators = [
  {
    id: 'ind-001',
    name: '门店实际销售总额',
    nature: '越高越好',
    weight: 60,
    aggregation: '月度累加',
    source: 'BI系统',
    targetBase: '250,000',
  },
  {
    id: 'ind-002',
    name: '新品上架计划达成率',
    nature: '越高越好',
    weight: 20,
    aggregation: '按下达值平均',
    source: 'BI系统',
    targetBase: '12 个SKU',
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

const resultIndicators = [
  {
    id: 'r-001',
    name: '季均客单价达标率',
    nature: '定量计算',
    weight: 20,
    targetValue: '150',
    actualValue: '135',
    unit: '元',
    systemScore: 85,
    finalScore: 85,
    ruleType: '90/70阶梯制(标准型)',
    supervisorComment: null,
  },
  {
    id: 'r-002',
    name: '新品上架计划达成率',
    nature: '定量计算',
    weight: 10,
    targetValue: '12',
    actualValue: '11',
    unit: '个SKU',
    systemScore: 92,
    finalScore: 92,
    ruleType: '100/70阶梯制(严格型)',
    supervisorComment: null,
  },
  {
    id: 'r-003',
    name: '主推大单品销售目标达成率',
    nature: '定量计算',
    weight: 15,
    targetValue: '80,000',
    actualValue: '57,600',
    unit: '元',
    systemScore: 71,
    finalScore: 71,
    ruleType: '90/70阶梯制(标准型)',
    supervisorComment: null,
  },
  {
    id: 'r-004',
    name: '月度销售额KPI',
    nature: '定量计算',
    weight: 15,
    targetValue: '150,000',
    actualValue: '117,000',
    unit: '元',
    systemScore: 78,
    finalScore: 78,
    ruleType: '80/70阶梯制(宽限型)',
    supervisorComment: null,
  },
  {
    id: 'r-005',
    name: '价值观考核',
    nature: '定性评分',
    weight: 15,
    targetValue: null,
    actualValue: null,
    unit: null,
    systemScore: null,
    finalScore: 88,
    ruleType: '定性测定(直接打分)',
    supervisorComment:
      '小明在本月表现出色，积极参与团队建设活动，能主动协助新同事融入团队，价值观践行良好。',
  },
  {
    id: 'r-006',
    name: '工作态度与主动性',
    nature: '定性评分',
    weight: 15,
    targetValue: null,
    actualValue: null,
    unit: null,
    systemScore: null,
    finalScore: 82,
    ruleType: '定性测定(直接打分)',
    supervisorComment:
      '工作态度端正，遇到问题能积极寻求解决方案。但跨部门沟通时偶有拖延，建议下月加强主动性。',
  },
  {
    id: 'r-007',
    name: '客户投诉处理满意度',
    nature: '综合评估',
    weight: 10,
    targetValue: null,
    actualValue: null,
    unit: null,
    systemScore: null,
    finalScore: 75,
    ruleType: '定性测定(直接打分)',
    supervisorComment:
      '本月处理了3起客诉事件，其中1起处理时效偏长，客户反馈一般。需加强对紧急客诉的响应速度。',
  },
]


const selectedCycleId = ref<string | null>(null)
const confirmStatus = ref<Record<string, 'pending_confirm' | 'confirmed'>>({})

const selectedCycle = computed(() => cycleList.find((c) => c.id === selectedCycleId.value))

const currentStatus = computed(() => {
  if (!selectedCycleId.value) return 'pending_confirm'
  return (
    confirmStatus.value[selectedCycleId.value] ||
    cycleList.find((c) => c.id === selectedCycleId.value)?.status ||
    'pending_confirm'
  )
})

const handleConfirm = (cycleId: string) => {
  confirmStatus.value[cycleId] = 'confirmed'
}

const quantitativeResults = computed(() => resultIndicators.filter((i) => i.nature === '定量计算'))
const qualitativeResults = computed(() => resultIndicators.filter((i) => i.nature !== '定性评分')) // Fixed filter
</script>

<template>
  <div class="h-full flex flex-col bg-slate-50/30 overflow-hidden">
    <!-- Cycle List View -->
    <template v-if="!selectedCycle">
      <div class="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
        <div class="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">我的考核目标与结果</h2>
          <p class="text-sm text-slate-500 mt-1">
            李小明 (工号: 00192) · 查阅您参与的所有考核周期的目标与最终评价结果。
          </p>
        </div>

        <div class="grid gap-4">
          <Card
            v-for="cycle in cycleList"
            :key="cycle.id"
            class="shadow-sm border-slate-200 hover:border-blue-200 transition-all cursor-pointer group hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500"
            @click="selectedCycleId = cycle.id"
          >
            <CardContent
              class="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div class="flex items-center gap-4 min-w-0">
                <div
                  :class="[
                    'h-12 w-12 rounded-xl flex flex-col items-center justify-center font-bold leading-tight shrink-0 transition-colors',
                    cycle.status === 'pending_confirm'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-blue-50 text-blue-600',
                  ]"
                >
                  <CalendarDays class="h-5 w-5" />
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                      {{ cycle.title }}
                    </h3>
                    <Badge
                      v-if="cycle.status === 'pending_confirm'"
                      variant="outline"
                      class="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      待确认目标
                    </Badge>
                    <Badge
                      v-else
                      variant="outline"
                      class="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      已结案
                    </Badge>
                  </div>
                  <p class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Clock class="h-3 w-3" /> {{ cycle.period }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-4 shrink-0 px-2 lg:px-0 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 mt-1 lg:mt-0">
                <div v-if="cycle.totalScore !== null" class="flex items-center gap-3">
                  <div class="text-right">
                    <div class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">综合评分</div>
                    <div class="text-xl font-black text-slate-800 leading-none mt-0.5">{{ cycle.totalScore }}</div>
                  </div>
                  <div
                    :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg shadow-sm border border-white/50',
                      cycle.grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                      cycle.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                      cycle.grade === 'C' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700',
                    ]"
                  >
                    {{ cycle.grade }}
                  </div>
                </div>
                <div v-else class="text-sm font-medium text-amber-600 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <AlertCircle class="h-4 w-4" /> 需要签署目标
                </div>
                <ArrowRight
                  class="h-5 w-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </template>

    <!-- Cycle Detail View -->
    <template v-else>
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Back button + Header -->
        <div class="px-6 pt-6 flex items-center gap-3 animate-in fade-in duration-300">
          <Button
            variant="ghost"
            size="sm"
            @click="selectedCycleId = null"
            class="text-slate-500 hover:text-slate-900 -ml-2 hover:bg-slate-100 rounded-lg"
          >
            <ChevronLeft class="h-4 w-4 mr-1" /> 返回列表
          </Button>
        </div>

        <div class="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          <div
            class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500"
          >
            <div class="flex items-center gap-4 w-full md:w-auto">
              <div
                :class="[
                  'h-12 w-12 rounded-xl flex flex-col items-center justify-center font-bold leading-tight shrink-0',
                  selectedCycle.status === 'pending_confirm'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-blue-50 text-blue-600',
                ]"
              >
                <CalendarDays class="h-5 w-5" />
              </div>
              <div class="min-w-0">
                <h3 class="text-xl font-bold text-slate-900 truncate">{{ selectedCycle.title }}</h3>
                <p class="text-sm text-slate-500 mt-1">
                  李小明 (工号: 00192) · 角色: 区域销售
                </p>
              </div>
            </div>
            <div
              v-if="selectedCycle.status === 'pending_confirm' && currentStatus === 'pending_confirm'"
              class="w-full md:w-auto"
            >
              <Button
                size="lg"
                class="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100 font-bold text-base px-8 h-12 rounded-xl border-b-4 border-red-800 active:border-b-0 transition-all"
                @click="handleConfirm(selectedCycle.id)"
                :disabled="props.isLocked"
              >
                <FileSignature class="mr-2 h-5 w-5" />
                我已完整阅读，确认签署
              </Button>
            </div>
          </div>

          <!-- Tabs -->
          <Tabs defaultValue="goals" class="w-full animate-in fade-in duration-700 delay-150">
            <TabsList class="grid w-full grid-cols-2 h-14 bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
              <TabsTrigger
                value="goals"
                class="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-sm transition-all duration-300"
              >
                <Target class="h-4 w-4 mr-2" />
                考核指标设定 (目标)
              </TabsTrigger>
              <TabsTrigger
                value="results"
                class="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-sm transition-all duration-300"
              >
                <Award class="h-4 w-4 mr-2" />
                最终考核结果 (闭案)
              </TabsTrigger>
            </TabsList>

            <!-- ========== Tab 1: 考核目标 ========== -->
            <TabsContent value="goals" class="mt-8 space-y-8 pb-10">
              <div
                v-if="selectedCycle.status === 'pending_confirm' && currentStatus === 'pending_confirm'"
                class="bg-red-50 border-l-4 border-l-red-500 border-y border-r border-y-red-100 border-r-red-100 p-6 rounded-r-2xl shadow-sm flex items-start gap-5 animate-in slide-in-from-top-4 duration-500 active-notice"
              >
                <div class="bg-red-100 p-3 rounded-2xl shrink-0 shadow-sm">
                  <AlertCircle class="h-6 w-6 text-red-600" />
                </div>
                <div class="flex-1">
                  <h4 class="text-red-900 font-black text-lg">待确认：本月绩效核心目标</h4>
                  <div class="mt-3 text-red-800/80 text-sm leading-relaxed space-y-3">
                    <p>上级主管已正式下发考核基数。请核对下方各项指标权重与目标值是否属实。</p>
                    <div class="bg-white/40 p-3 rounded-lg border border-red-200/50 flex items-center gap-2 text-xs font-bold text-red-600">
                      <Wallet class="h-4 w-4" /> 提醒：确认签署后将作为周期末计分的唯一法律基础。
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="currentStatus === 'confirmed'"
                class="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl shadow-sm flex items-center justify-between animate-in zoom-in-95 duration-500"
              >
                <div class="flex items-center gap-5">
                  <div class="bg-emerald-100 p-3 rounded-full shadow-sm">
                    <CheckCircle2 class="h-7 w-7 text-emerald-600" />
                  </div>
                  <div>
                    <h4 class="text-emerald-900 font-black text-lg">签署生效：年度/月度目标契约已达成</h4>
                    <p class="text-emerald-700/70 text-sm mt-1">签署摘要加密存证：SHA-256 (0x7F...3B91)，请全力以赴！</p>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <h4 class="font-black text-slate-800 flex items-center gap-3 pb-3 border-b-2 border-slate-100">
                  <Calculator class="h-5 w-5 text-blue-600" />
                  本期考核指标明细
                </h4>
                <div class="grid gap-4">
                  <Card
                    v-for="(ind, index) in personalIndicators"
                    :key="ind.id"
                    class="shadow-sm border-slate-200 overflow-hidden relative group hover:border-blue-300 transition-all duration-300"
                  >
                    <div
                      :class="[
                        'absolute left-0 top-0 bottom-0 w-1.5 transition-colors',
                        currentStatus === 'confirmed' || selectedCycle.status === 'finished'
                          ? 'bg-emerald-400'
                          : 'bg-amber-400',
                      ]"
                    />
                    <CardContent class="p-0 pl-1.5">
                      <div class="p-6 flex flex-col md:flex-row gap-8 items-center">
                        <div class="flex-1 space-y-4 w-full">
                          <div class="flex items-center gap-3">
                            <Badge variant="outline" class="h-6 w-6 rounded-full flex items-center justify-center p-0 font-bold bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              {{ index + 1 }}
                            </Badge>
                            <h5 class="text-lg font-black text-slate-800 leading-none group-hover:text-blue-900">
                              {{ ind.name }}
                            </h5>
                            <Badge variant="secondary" class="font-medium text-[10px] px-2 py-0 border-none bg-slate-100 text-slate-500">
                              {{ ind.nature }}
                            </Badge>
                          </div>
                          <div class="flex flex-wrap gap-3">
                            <div class="flex items-center bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/50 text-xs font-medium">
                              <span class="text-slate-400 mr-2">汇聚逻辑</span>
                              <span class="text-slate-700">{{ ind.aggregation }}</span>
                            </div>
                            <div class="flex items-center bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/50 text-xs font-medium">
                              <span class="text-slate-400 mr-2">源端系统</span>
                              <span class="text-slate-700">{{ ind.source }}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="w-full md:w-[260px] shrink-0 bg-blue-50/50 rounded-2xl border border-blue-100/50 p-5 relative overflow-hidden group-hover:bg-blue-50 group-hover:border-blue-200 transition-all">
                          <div class="flex justify-between items-center mb-4 relative z-10">
                            <span class="text-[10px] font-bold text-blue-800 uppercase tracking-widest opacity-60">考核基数</span>
                            <Badge variant="outline" class="bg-white/80 backdrop-blur shadow-sm text-blue-700 border-blue-200/50 font-black">
                             权重 {{ ind.weight }}%
                            </Badge>
                          </div>
                          <div class="text-3xl font-black text-blue-900 tracking-tight transition-transform duration-300 group-hover:scale-105">
                            {{ ind.targetBase || '待设定' }}
                          </div>
                          <Target class="absolute -right-2 -bottom-2 h-16 w-16 text-blue-100/30 rotate-12" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <!-- ========== Tab 2: 考核结果 ========== -->
            <TabsContent value="results" class="mt-8 space-y-8 pb-10">
              <div v-if="selectedCycle.status === 'finished'" class="space-y-10 animate-in fade-in duration-700">
                <!-- Score Dashboard Card -->
                <div class="relative overflow-hidden group rounded-2xl">
                  <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-1000" />
                  <div class="absolute inset-0 opacity-10 pointer-events-none">
                    <TrendingUp class="absolute -left-10 -bottom-10 h-64 w-64 rotate-12" />
                    <Award class="absolute -right-10 -top-10 h-64 w-64 -rotate-12" />
                  </div>
                  
                  <CardContent class="p-8 text-white relative z-10">
                    <div class="flex flex-col md:flex-row items-center justify-between gap-10">
                      <div class="flex items-center gap-6">
                        <div class="bg-white/10 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-white/20">
                          <Award class="h-12 w-12 text-blue-100" />
                        </div>
                        <div>
                          <div class="text-blue-100/70 font-black text-xs uppercase tracking-[0.2em] mb-1">综合考核得分</div>
                          <div class="text-7xl font-black tracking-tighter leading-none shadow-sm drop-shadow-md transition-transform duration-300 hover:translate-x-1">
                            {{ selectedCycle.totalScore }}
                          </div>
                        </div>
                      </div>
                      
                      <div class="grid grid-cols-3 md:flex md:items-center gap-4 lg:gap-10 w-full md:w-auto">
                        <div class="bg-black/10 backdrop-blur rounded-2xl p-4 flex-1 text-center border border-white/5">
                          <div class="text-2xl font-black">{{ quantitativeResults.length }}</div>
                          <div class="text-[10px] text-white/50 font-bold mt-1 uppercase">定量</div>
                        </div>
                        <div class="bg-black/10 backdrop-blur rounded-2xl p-4 flex-1 text-center border border-white/5">
                          <div class="text-2xl font-black">{{ qualitativeResults.length }}</div>
                          <div class="text-[10px] text-white/50 font-bold mt-1 uppercase">定性</div>
                        </div>
                        <div class="bg-white/15 backdrop-blur rounded-2xl p-4 flex-1 text-center border border-white/20 shadow-xl scale-110">
                          <div class="text-4xl font-black text-white leading-none">{{ selectedCycle.grade }}</div>
                          <div class="text-[10px] text-blue-100/70 font-bold mt-1 uppercase">等第</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <!-- Quantitative Details -->
                <div class="space-y-5">
                  <div class="flex items-center gap-3">
                    <div class="bg-blue-100 p-2 rounded-xl">
                        <Calculator class="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 class="text-xl font-black text-slate-900">系统业绩测算明细</h4>
                  </div>
                  <div class="grid gap-4">
                    <Card v-for="(ind, index) in quantitativeResults" :key="ind.id" class="border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                      <CardContent class="p-6">
                        <div class="flex items-center justify-between mb-6">
                          <div class="flex items-center gap-3">
                            <span class="h-7 w-7 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg text-sm font-black">{{ index + 1 }}</span>
                            <h5 class="font-black text-slate-800 text-lg">{{ ind.name }}</h5>
                            <Badge variant="secondary" class="bg-slate-100 text-slate-500 font-bold text-[10px] h-5">{{ ind.nature }}</Badge>
                          </div>
                          <div class="text-right">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">占比权重</div>
                            <div class="text-lg font-black text-slate-700 leading-none mt-1">{{ ind.weight }}%</div>
                          </div>
                        </div>
                        
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div class="bg-slate-50/80 border border-slate-100 p-4 rounded-xl group-hover:bg-white group-hover:shadow-inner transition-all">
                            <div class="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-tighter">目标参考</div>
                            <div class="font-black text-slate-900">{{ ind.targetValue }}</div>
                          </div>
                          <div class="bg-slate-50/80 border border-slate-100 p-4 rounded-xl group-hover:bg-white group-hover:shadow-inner transition-all">
                            <div class="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-tighter">业务实际</div>
                            <div class="font-black text-slate-900">{{ ind.actualValue }}</div>
                          </div>
                          <div class="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                            <div class="text-[10px] font-black text-blue-400 mb-2 uppercase tracking-tighter">系统原始分</div>
                            <div class="font-black text-blue-600 text-2xl leading-none">{{ ind.systemScore }}</div>
                          </div>
                          <div class="bg-gradient-to-br from-indigo-50 to-blue-100 border border-blue-200 p-4 rounded-xl shadow-sm scale-105">
                            <div class="text-[10px] font-black text-blue-800 mb-2 uppercase tracking-tighter">最终核算分</div>
                            <div class="font-black text-indigo-700 text-3xl leading-none drop-shadow-sm">{{ ind.finalScore }}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div v-else class="flex flex-col items-center justify-center py-20 text-slate-400 animate-in zoom-in-95 duration-1000">
                <div class="relative bg-slate-50 p-10 rounded-full mb-6 shadow-inner">
                   <Clock class="h-16 w-16 opacity-30 animate-spin-slow" />
                   <Target class="h-8 w-8 text-blue-400 absolute top-2 right-2 opacity-50" />
                </div>
                <h4 class="text-xl font-black text-slate-800 tracking-tight">绩效大盘尚未正式“结案”</h4>
                <p class="text-sm mt-3 font-medium max-w-xs text-center leading-relaxed">请耐心等待周期进入<b>评分公示期</b>或<b>归档阶段</b>。届时我们将为您解密最终得分与等级。</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 10s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.active-notice {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 0.4) 10px,
    transparent 10px,
    transparent 20px
  );
}

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
