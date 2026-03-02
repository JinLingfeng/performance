<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  Trash2,
  Calendar,
  Eye,
  TrendingUp,
  Filter,
  ArrowRight,
  Calculator,
  ChevronRight,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import IndicatorSelectorModal from '@/components/template/IndicatorSelectorModal.vue'
import DailyReportPreviewModal from '@/components/template/DailyReportPreviewModal.vue'

const router = useRouter()

// Mock data for initial selected indicators
const initialSelectedIndicators = [
  {
    id: '1',
    name: '主推大单品销售目标达成率',
    dimension: '产品力',
    ruleType: '90/70阶梯制(标准型)',
    ruleCode: 'STEP_90_70',
    weight: 30,
    dataSourceType: 'api', // 'api' or 'manual'
    dataSourceValue: 'api_act_big_item_sales',
  },
  {
    id: '2',
    name: '新客户开发目标达成率',
    dimension: '市场指标',
    ruleType: '100/70阶梯制(严格型)',
    ruleCode: 'STEP_100_70',
    weight: 30,
    dataSourceType: 'manual',
    dataSourceValue: 'input_new_customer_count',
  },
  {
    id: '3',
    name: '重点商品退换货率控制',
    dimension: '质量售后指标',
    ruleType: '超标扣分制(达标满分)',
    ruleCode: 'DEDUCT_EXCEED',
    weight: 40,
    dataSourceType: 'api',
    dataSourceValue: 'api_return_rate',
  },
]

const templateInfo = ref({
  name: '',
  description: '',
  applyTo: 'all',
  period: 'month',
})

const indicators = ref(initialSelectedIndicators)
const isModalOpen = ref(false)
const isPreviewOpen = ref(false)
const hasPreviewed = ref(false)

const handleAddIndicators = (selected: any[]) => {
  const existingIds = indicators.value.map((ind) => ind.id)
  const newIndicators = selected
    .filter((ind) => !existingIds.includes(ind.id))
    .map((ind) => ({
      id: ind.id,
      name: ind.name,
      dimension: ind.dimension,
      ruleType: ind.ruleType,
      ruleCode: ind.ruleCode,
      weight: 0,
      dataSourceType: 'api',
      dataSourceValue: '',
    }))

  indicators.value = [...indicators.value, ...newIndicators]
}

const totalWeight = computed(() =>
  indicators.value.reduce((sum, ind) => sum + (ind.weight || 0), 0)
)
const isWeightValid = computed(() => totalWeight.value === 100)

const handleWeightChange = (id: string, newWeight: string) => {
  const weight = parseInt(newWeight) || 0
  indicators.value = indicators.value.map((ind) =>
    ind.id === id ? { ...ind, weight } : ind
  )
}

const handleSourceTypeChange = (id: string, type: string) => {
  indicators.value = indicators.value.map((ind) =>
    ind.id === id ? { ...ind, dataSourceType: type, dataSourceValue: '' } : ind
  )
}

const handleSourceValueChange = (id: string, value: string) => {
  indicators.value = indicators.value.map((ind) =>
    ind.id === id ? { ...ind, dataSourceValue: value } : ind
  )
}

const removeIndicator = (id: string) => {
  indicators.value = indicators.value.filter((ind) => ind.id !== id)
}

const goBack = () => router.push('/template')

const colors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-pink-500',
]
const lightColors = [
  'bg-blue-50 text-blue-600',
  'bg-emerald-50 text-emerald-600',
  'bg-amber-50 text-amber-600',
  'bg-purple-50 text-purple-600',
  'bg-pink-50 text-pink-600',
]
const textColors = [
  'text-blue-600',
  'text-emerald-600',
  'text-amber-600',
  'text-purple-600',
  'text-pink-600',
]

const handleConfirmPreview = () => {
  isPreviewOpen.value = false
  hasPreviewed.value = true
}

const handlePublish = () => {
  if (!isWeightValid.value) {
    alert('请先确保权重合计为100%!')
    return
  }
  if (!hasPreviewed.value) {
    alert('请先点击【日报界面预览】确认最终下发到员工的界面无误!')
    return
  }
  alert('发布成功！')
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto px-4 xl:px-8 pb-20">
    <!-- Header / Action Bar -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md pb-4 pt-2 -mt-2"
    >
      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8 text-slate-500 hover:text-slate-900"
          @click="goBack"
        >
          <ArrowLeft class="h-4 w-4" />
        </Button>
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-900">新建考核模板</h1>
          <div class="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <Badge
              variant="outline"
              class="font-normal text-[10px] h-4 bg-amber-50 text-amber-600 border-amber-200"
            >
              草稿中
            </Badge>
            <span>未保存更改</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Button
          variant="outline"
          class="relative bg-white hover:bg-slate-50 text-blue-600 border-blue-200"
          @click="isPreviewOpen = true"
        >
          <Eye class="mr-2 h-4 w-4" />
          日报界面预览
          <span
            v-if="!hasPreviewed"
            class="absolute -top-1 -right-1 flex h-3 w-3 rounded-full bg-red-500 animate-pulse border-2 border-white"
          />
        </Button>
        <Button variant="outline" class="bg-white hover:bg-slate-50 text-slate-700">
          <Save class="mr-2 h-4 w-4" />
          保存草稿
        </Button>
        <Button
          :class="[
            'shadow-sm',
            isWeightValid && hasPreviewed
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed',
          ]"
          @click="handlePublish"
        >
          <Send class="mr-2 h-4 w-4" />
          正式发布并启用
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- Left Column: Editor -->
      <div class="xl:col-span-3 space-y-6">
        <!-- Basic Info Card -->
        <Card class="shadow-sm border-slate-200">
          <CardHeader class="pb-4">
            <CardTitle class="text-base font-semibold">1. 基础信息配置</CardTitle>
            <CardDescription>设置该模板的基本定义和适用范围。</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="tpl-name" class="text-slate-700 font-semibold">模板名称 <span class="text-red-500">*</span></Label>
              <Input
                id="tpl-name"
                placeholder="输入如: 2025年业务一部区域经理月度考核版"
                v-model="templateInfo.name"
              />
            </div>
            <div class="space-y-2">
              <Label for="tpl-desc" class="text-slate-700 font-semibold">摘要说明</Label>
              <Textarea
                id="tpl-desc"
                placeholder="简要描述该模板的考核重点与适用人群..."
                class="resize-none h-20"
                v-model="templateInfo.description"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="text-slate-700 font-semibold">标准考评频次</Label>
                <Select v-model:model-value="templateInfo.period">
                  <SelectTrigger class="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">按月度考核</SelectItem>
                    <SelectItem value="quarter">按季度考核</SelectItem>
                    <SelectItem value="half_year">按半年度考核</SelectItem>
                    <SelectItem value="year">按年度考核</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label class="text-slate-700 font-semibold">默认适用范围</Label>
                <Select v-model:model-value="templateInfo.applyTo">
                  <SelectTrigger class="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全公司通用</SelectItem>
                    <SelectItem value="dept_sales">仅限销售部门</SelectItem>
                    <SelectItem value="dept_func">仅限职能部门</SelectItem>
                    <SelectItem value="level_manager">管理层专用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Indicator Setup Card -->
        <Card class="shadow-sm border-slate-200">
          <CardHeader class="pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle class="text-base font-semibold">
                2. 考核项权重与数据来源设置
              </CardTitle>
              <CardDescription class="mt-1">
                从指标库中挑选对应的指标并分配权重(总和需等于100%)。
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              class="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 shrink-0"
              @click="isModalOpen = true"
            >
              <Plus class="h-4 w-4 mr-1.5" />
              选取考核指标
            </Button>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div
                v-if="indicators.length === 0"
                class="flex flex-col items-center justify-center p-8 text-slate-500 border border-dashed border-slate-200 rounded-lg bg-slate-50/50"
              >
                <Calendar class="h-8 w-8 mb-3 text-slate-300" />
                <p class="text-sm">尚未添加任何指标</p>
                <Button
                  size="sm"
                  variant="link"
                  class="text-blue-600 h-auto p-0 mt-2"
                  @click="isModalOpen = true"
                >
                  马上从库中选取
                </Button>
              </div>
              <div
                v-else
                v-for="(ind, index) in indicators"
                :key="ind.id"
                class="relative bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group"
              >
                <!-- Left colored border -->
                <div :class="['absolute left-0 top-0 bottom-0 w-1.5', colors[index % colors.length]]" />

                <div class="p-5 pl-6">
                  <!-- Top Section -->
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div class="flex items-center gap-3">
                      <div
                        :class="[
                          'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                          lightColors[index % lightColors.length],
                        ]"
                      >
                        <TrendingUp class="h-5 w-5" />
                      </div>
                      <div>
                        <h3 class="text-lg font-bold text-slate-900">{{ ind.name }}</h3>
                        <div
                          class="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500 font-medium"
                        >
                          <span>性质: 数值</span>
                          <div class="w-px h-3 bg-slate-300" />
                          <Badge
                            variant="outline"
                            class="font-normal border-slate-200 bg-slate-50 h-5 px-1.5 text-[10px]"
                          >
                            {{ ind.dimension }}
                          </Badge>
                          <div class="w-px h-3 bg-slate-300" />
                          <span :class="textColors[index % textColors.length]">
                            权重: {{ ind.weight }}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <div class="flex items-center">
                        <Input
                          type="number"
                          :model-value="ind.weight"
                          @update:model-value="(v) => handleWeightChange(ind.id, String(v))"
                          class="h-9 w-20 text-center font-semibold pr-6 rounded-r-none border-r-0 focus-visible:z-10 bg-slate-50/50"
                        />
                        <div
                          class="h-9 px-3 flex items-center bg-slate-50 border border-slate-200 rounded-r-md text-slate-500 text-sm"
                        >
                          %
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        class="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
                        @click="removeIndicator(ind.id)"
                      >
                        <Trash2 class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <!-- Bottom 3-step visualization -->
                  <div class="flex flex-col lg:flex-row gap-4 relative mt-2">
                    <!-- Step 1: Aggregation -->
                    <div class="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <div
                        class="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mb-3 tracking-wide"
                      >
                        <Filter class="h-3.5 w-3.5" />
                        1. 数据汇聚 (AGGREGATION)
                      </div>
                      <!-- Dropdown for data source type -->
                      <div class="mb-3">
                        <Select
                          :model-value="ind.dataSourceType"
                          @update:model-value="(v) => handleSourceTypeChange(ind.id, String(v))"
                        >
                          <SelectTrigger class="bg-white border-slate-200 shadow-sm font-medium h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="api">通过系统接口预置</SelectItem>
                            <SelectItem value="manual">员工手动逐日填报</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div class="h-[52px] flex flex-col justify-end">
                        <Select v-if="ind.dataSourceType === 'manual'" default-value="sum">
                          <SelectTrigger
                            class="bg-white border-slate-200 shadow-sm font-medium h-9 text-xs"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sum">月度累加 (SUM)</SelectItem>
                            <SelectItem value="avg">月度单项平均 (AVG)</SelectItem>
                            <SelectItem value="latest">按最后一次填报值计算</SelectItem>
                          </SelectContent>
                        </Select>
                        <div
                          v-else
                          class="bg-slate-100/70 border border-slate-200/50 rounded-md p-2.5 text-[11px] text-slate-500 text-center font-medium mx-auto w-full"
                        >
                          接口直连最终数据<br />无需配置加和方式
                        </div>
                      </div>
                      <div class="mt-3 pt-3 border-t border-slate-200 space-y-2">
                        <div class="text-xs text-slate-400 leading-relaxed">
                          <div v-if="ind.dataSourceType === 'manual'" class="flex items-center gap-1.5 mt-1.5">
                            <Input
                              placeholder="填写呈现给员工的字段指导文字..."
                              :model-value="ind.dataSourceValue"
                              @update:model-value="(v) => handleSourceValueChange(ind.id, String(v))"
                              class="h-7 text-xs flex-1 border-slate-200 focus-visible:ring-1"
                            />
                          </div>
                          <div v-else class="flex items-center gap-1.5 mt-1.5">
                            <Select
                              :model-value="ind.dataSourceValue"
                              @update:model-value="(v) => handleSourceValueChange(ind.id, String(v))"
                            >
                              <SelectTrigger class="h-7 text-xs flex-1 bg-white border-slate-200 focus:ring-0">
                                <SelectValue placeholder="系统接口标识..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="api_act_sales">ERP实际营业额</SelectItem>
                                <SelectItem value="api_act_big_item_sales">ERP大单品销售额</SelectItem>
                                <SelectItem value="api_sys_profit">财务核定毛利额</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <p class="mt-2 text-[10px] text-slate-400 opacity-80">
                            每天提取此项并自动叠加
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Arrow Connection -->
                    <div class="hidden lg:flex items-center justify-center text-slate-300 px-0.5">
                      <ArrowRight class="h-5 w-5" />
                    </div>

                    <!-- Step 2: Target Comparison -->
                    <div class="flex-1 rounded-xl p-4 flex flex-col min-h-[140px] relative">
                      <!-- Background decoration -->
                      <div
                        class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 rounded-xl"
                      />
                      <div class="absolute inset-0 border border-indigo-100/50 rounded-xl" />

                      <div class="relative z-10 w-full h-full flex flex-col">
                        <div
                          class="flex items-center gap-2 text-[11px] font-semibold text-indigo-500 mb-3 tracking-wide"
                        >
                          <ArrowRight class="h-3.5 w-3.5" />
                          2. 目标对比 (TARGET)
                        </div>

                        <div class="flex-1 flex items-center justify-center">
                          <div
                            class="bg-white/90 backdrop-blur-sm border border-indigo-100/80 px-6 py-4 rounded-xl shadow-sm w-[90%] md:w-auto relative group-hover:border-indigo-300 transition-colors"
                          >
                            <div
                              class="text-center font-bold text-slate-700 text-[13px] pb-2 whitespace-nowrap"
                            >
                              实际数据总计
                            </div>
                            <div class="h-0.5 bg-indigo-300/60 w-full mb-2 rounded-full" />
                            <div
                              class="text-center font-bold text-indigo-600 text-[13px] whitespace-nowrap"
                            >
                              设定目标基数
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Arrow Connection -->
                    <div class="hidden lg:flex items-center justify-center text-slate-300 px-0.5">
                      <ArrowRight class="h-5 w-5" />
                    </div>

                    <!-- Step 3: Scoring -->
                    <div class="flex-1 bg-emerald-50/40 border border-emerald-100 rounded-xl p-4">
                      <div
                        class="flex items-center gap-2 text-[11px] font-semibold text-emerald-600/70 mb-3 tracking-wide"
                      >
                        <Calculator class="h-3.5 w-3.5" />
                        3. 绩效转化 (SCORING)
                      </div>
                      <div
                        class="flex items-center justify-between bg-white border border-emerald-200/60 px-3 py-2.5 rounded-md shadow-sm font-medium text-emerald-800 text-xs"
                      >
                        <span class="truncate pr-2">{{ ind.ruleType }}</span>
                        <ChevronRight class="h-4 w-4 text-emerald-400 shrink-0" />
                      </div>
                      <p class="mt-3 text-[10px] text-slate-500/80 leading-relaxed font-medium">
                        当前配置为：100%达成得满分，线性浮动，未达标逐级递减的分数转化模型。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Status Summary -->
      <div class="lg:col-span-1">
        <div class="sticky top-24 space-y-4">
          <Card class="shadow-sm border-slate-200">
            <CardHeader class="pb-3 bg-slate-50/50 border-b">
              <CardTitle class="text-sm font-semibold flex items-center justify-between">
                考核权重分析
                <Badge
                  :variant="isWeightValid ? 'default' : 'destructive'"
                  :class="isWeightValid ? 'bg-emerald-500 hover:bg-emerald-600' : ''"
                >
                  总计: {{ totalWeight }}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent class="pt-4 space-y-4">
              <div
                v-if="!isWeightValid"
                :class="[
                  'text-xs p-3 rounded-md',
                  totalWeight > 100
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : 'bg-amber-50 text-amber-600 border border-amber-100',
                ]"
              >
                ⚠️ {{ totalWeight > 100 ? `权重超标 ${totalWeight - 100}%` : `权重不足 100% (还差 ${100 - totalWeight}%)` }}
                <br />请调整左侧表单中的各项权重，确保准确累加至100%后方可发布。
              </div>

              <div class="space-y-3">
                <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  权重合计检测
                </h4>
                <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    v-for="(ind, i) in indicators"
                    :key="ind.id"
                    :style="{ width: `${(ind.weight / Math.max(100, totalWeight)) * 100}%` }"
                    :class="[colors[i % colors.length], 'h-full transition-all']"
                    :title="`${ind.name}: ${ind.weight}%`"
                  />
                </div>
                <div class="space-y-1.5 mt-3 max-h-48 overflow-y-auto pr-1">
                  <div
                    v-for="(ind, i) in indicators"
                    :key="ind.id"
                    class="flex justify-between items-center text-xs"
                  >
                    <span class="text-slate-600 truncate max-w-[180px]" :title="ind.name">
                      {{ i + 1 }}. {{ ind.name }}
                    </span>
                    <span class="font-semibold text-slate-700">{{ ind.weight }}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div class="text-xs text-slate-400 text-center px-4 leading-relaxed">
            所有的考核表单将会基于本模板动态生成。<br />每日数据将自动聚合以计算月底总评。
          </div>
        </div>
      </div>
    </div>

    <IndicatorSelectorModal
      v-model:is-open="isModalOpen"
      @close="isModalOpen = false"
      @add="handleAddIndicators"
    />

    <DailyReportPreviewModal
      v-model:is-open="isPreviewOpen"
      :indicators="indicators"
      @close="isPreviewOpen = false"
      @confirm="handleConfirmPreview"
    />
  </div>
</template>
