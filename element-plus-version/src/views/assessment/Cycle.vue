<script setup lang="ts">
import { ref } from 'vue'
import {
  CalendarDays,
  Clock,
  PlayCircle,
  Eye,
  CheckCircle2,
  Info,
  BarChart3,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

// ========== Mock Data ==========

// Cycles data
const initialCycles = [
  {
    id: 'cyc-202604',
    name: '2026年4月份全公司月度绩效考核',
    period: '2026/04/01 - 2026/04/30',
    stage: 'pending', // pending | goal_setting | evaluating | finished
    templateNames: [
      '大客KA中心通用考核模板',
    ],
    totalEmployees: 48,
    targetSetCount: 0,
    targetConfirmedCount: 0,
  },
  {
    id: 'cyc-202603',
    name: '2026年3月份全公司月度绩效考核',
    period: '2026/03/01 - 2026/03/31',
    stage: 'goal_setting', 
    templateNames: [
      '大客KA中心通用考核模板',
      '餐饮中心业务专员月度考核表',
      '市场部月度推广定性考评',
      '休食中心日常绩效考核标准',
    ],
    totalEmployees: 45,
    targetSetCount: 12,
    targetConfirmedCount: 0,
  },
  {
    id: 'cyc-202602',
    name: '2026年2月份业务部门月度考核',
    period: '2026/02/01 - 2026/02/28',
    stage: 'evaluating',
    templateNames: ['大客KA中心通用考核模板', '餐饮中心业务专员月度考核表', '市场部月度推广定性考评'],
    totalEmployees: 42,
    targetSetCount: 42,
    targetConfirmedCount: 42,
  },
  {
    id: 'cyc-202601',
    name: '2026年1月份销售条线考核',
    period: '2026/01/01 - 2026/01/31',
    stage: 'finished',
    templateNames: ['大客KA中心通用考核模板', '餐饮中心业务专员月度考核表'],
    totalEmployees: 40,
    targetSetCount: 40,
    targetConfirmedCount: 40,
  },
]

const cycles = ref(initialCycles)

const getStageBadge = (stage: string) => {
  switch (stage) {
    case 'goal_setting':
      return { text: '目标制定中', class: '!bg-amber-50 !text-amber-600 !border-amber-200' }
    case 'goal_confirming':
      return { text: '员工确认中', class: '!bg-blue-50 !text-blue-600 !border-blue-200' }
    case 'ongoing':
      return { text: '正在执行', class: '!bg-emerald-50 !text-emerald-600 !border-emerald-200' }
    case 'evaluating':
      return { text: '结果评估与打分中', class: '!bg-purple-50 !text-purple-600 !border-purple-200' }
    case 'finished':
      return { text: '已归档结案', class: '!bg-slate-50 !text-slate-500 !border-slate-200' }
    default:
      return { text: '未知状态', class: '' }
  }
}

const handlePushStage = (id: string, newStage: string) => {
  cycles.value = cycles.value.map((c) => (c.id === id ? { ...c, stage: newStage } : c))
}
</script>

<template>
  <div class="h-full overflow-y-auto bg-slate-50/50">
    <div class="space-y-6 max-w-7xl mx-auto px-4 xl:px-8 pb-20 pt-6">
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-4 sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md pb-4 pt-2 -mt-2"
      >
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">绩效考核周期管理</h1>
          <p class="text-slate-500 mt-1">HR 工作台：在此处向组织派发新的考核模板并开启一个考评周期。</p>
        </div>
      </div>

      <!-- Section: 周期实例 -->
      <div>
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays class="w-5 h-5 text-emerald-500" />
                考核周期实例
              </h2>

              <div
                class="flex items-center gap-2 text-xs md:text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100"
              >
                <Info class="w-4 h-4 shrink-0" />
                每月25日系统将自动生成下一考核周期的实例，并绑定当前全部生效模板
              </div>
            </div>

            <div class="grid gap-4">
              <el-card
                v-for="cycle in cycles"
                :key="cycle.id"
                shadow="hover"
                class="custom-el-card !border-0 shadow-sm overflow-hidden border-l-4 transition-all"
                :class="[
                  cycle.stage === 'goal_setting' ? '!border-l-amber-500 !bg-amber-50/10' : '!border-l-slate-200',
                ]"
                body-class="!p-0"
              >
                <div>
                  <div class="flex flex-col lg:flex-row">
                    <!-- Left Main Info -->
                    <div class="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-slate-100">
                      <div class="flex justify-between items-start mb-4">
                        <div>
                          <h3
                            class="text-lg font-bold text-slate-900 transition-colors"
                          >
                            {{ cycle.name }}
                          </h3>
                          <div
                            class="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-6 mt-3 text-sm text-slate-500"
                          >
                            <div class="flex items-center text-slate-600 font-medium">
                              <CalendarDays class="mr-1.5 h-4 w-4 text-slate-400" />
                              {{ cycle.period }}
                            </div>
                            <div class="flex items-start">
                              <Clock class="mr-1.5 h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <div>
                                <span class="text-slate-500">
                                  包含 {{ cycle.templateNames.length }} 个考核模板:
                                </span>
                                <p
                                  class="text-xs text-slate-700 font-medium line-clamp-1 mt-0.5"
                                  :title="cycle.templateNames.join(', ')"
                                >
                                  {{ cycle.templateNames.join(', ') }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <el-tag
                          effect="plain"
                          :class="['!font-bold !border !px-3', getStageBadge(cycle.stage).class]"
                        >
                          {{ getStageBadge(cycle.stage).text }}
                        </el-tag>
                      </div>

                      <!-- Sub Progress if in goal setting -->
                      <div
                        v-if="cycle.stage === 'goal_setting'"
                        class="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-100"
                      >
                        <div class="flex justify-between text-sm mb-2">
                          <span class="font-medium text-slate-700">主管下发目标进度</span>
                          <span class="text-slate-500">
                            {{ cycle.targetSetCount }} / {{ cycle.totalEmployees }} 人
                          </span>
                        </div>
                        <el-progress
                          :percentage="Math.round((cycle.targetSetCount / cycle.totalEmployees) * 100)"
                          :show-text="false"
                          color="#3b82f6"
                          :stroke-width="8"
                        />
                        <div
                          class="mt-3 text-xs text-amber-600 flex items-center bg-amber-50 px-2 py-1 rounded-md max-w-max border border-amber-100"
                        >
                          ⚠️ 请催促未下发的主管尽快完成员工本月的基数与权重设定。
                        </div>
                      </div>
                    </div>

                    <!-- Right Actions Area -->
                    <div
                      class="w-full lg:w-48 bg-slate-50/50 p-6 flex flex-row lg:flex-col items-center justify-center gap-3"
                    >
                      <template v-if="cycle.stage === 'pending'">
                        <el-button
                          class="w-full !ml-0 !bg-white hover:!bg-slate-50 !text-slate-700 !border-slate-200 shadow-sm"
                          @click="router.push(`/assessment/cycle/${cycle.id}`)"
                        >
                          <Eye class="mr-2 h-4 w-4 text-slate-500" />
                          周期详情
                        </el-button>
                        <el-button
                          type="primary"
                          class="w-full !ml-0 !bg-blue-600 hover:!bg-blue-700 !text-white shadow-sm !border-none"
                          @click="handlePushStage(cycle.id, 'goal_setting')"
                        >
                          <PlayCircle class="mr-2 h-4 w-4" />
                          开启目标设定
                        </el-button>
                      </template>
                      <template v-if="cycle.stage === 'goal_setting'">
                        <el-button
                          class="w-full !ml-0 !bg-white hover:!bg-slate-50 !text-slate-700 !border-slate-200 shadow-sm"
                          @click="router.push(`/assessment/cycle/${cycle.id}`)"  
                        >
                          <Eye class="mr-2 h-4 w-4 text-slate-500" />
                          周期详情
                        </el-button>
                        <el-button
                          type="primary"
                          class="w-full !ml-0 !bg-purple-600 hover:!bg-purple-700 !text-white shadow-sm !border-none"
                          @click="handlePushStage(cycle.id, 'evaluating')"
                        >
                          <PlayCircle class="mr-2 h-4 w-4" />
                          开启绩效打分
                        </el-button>
                      </template>
                      <template v-else-if="cycle.stage === 'evaluating'">
                        <el-button
                          class="w-full !ml-0 !bg-white hover:!bg-slate-50 !text-slate-700 !border-slate-200 shadow-sm"
                          @click="router.push(`/assessment/cycle/${cycle.id}`)"
                        >
                          <Eye class="mr-2 h-4 w-4 text-slate-500" />
                          周期详情
                        </el-button>
                        <el-button
                          type="primary"
                          class="w-full !ml-0 !bg-slate-800 hover:!bg-slate-900 !text-white shadow-sm !border-none"
                          @click="handlePushStage(cycle.id, 'finished')"
                        >
                          <CheckCircle2 class="mr-2 h-4 w-4" />
                          关闭本周期
                        </el-button>
                      </template>
                      <template v-else-if="cycle.stage === 'finished'">
                        <el-button
                          class="w-full !ml-0 !bg-white hover:!bg-slate-50 !text-slate-700 !border-slate-200 shadow-sm"
                          @click="router.push(`/assessment/cycle/${cycle.id}`)"
                        >
                          <BarChart3 class="mr-2 h-4 w-4 text-emerald-500" />
                          查看绩效结果
                        </el-button>
                      </template>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.custom-el-card) {
  border-radius: 0.75rem !important;
}
</style>
