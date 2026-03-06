<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ChevronDown,
  ChevronRight,
  BarChart3,
  Users,
  TrendingUp,
  UserCheck,
  AlertCircle,
  ChevronLeft,
  CalendarDays,
  Printer,
  Download,
  FileText,
  Target,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const cycleId = route.params.id as string

const activeTab = ref('templates') // templates | stats

// ========== Mock Data for the selected cycle ==========
const cycleInfo = {
  id: cycleId,
  title: '2026年3月份初级销售KPI考核',
  period: '2026/03/01 - 2026/03/31',
  status: 'rating', // 'rating' or 'finished'
}

const templates = ref([
  {
    id: 'tpl-1',
    name: '大客KA中心通用考核模板',
    period: 'month',
    indicators: [
      { name: '主推大单品销售目标达成率', weight: 40, dimension: '业绩指标', ruleType: 'STEP_90_70' },
      { name: '新客户开发目标达成率', weight: 30, dimension: '拓展指标', ruleType: 'STEP_100_70' },
      { name: '重点商品退换货率控制', weight: 30, dimension: '售后指标', ruleType: 'DEDUCT_EXCEED' }
    ],
    appliedCount: 15
  },
  {
    id: 'tpl-2',
    name: '餐饮中心业务专员月度考核表',
    period: 'month',
    indicators: [
      { name: '餐饮渠道回款额达成率', weight: 60, dimension: '业绩指标', ruleType: 'STEP_90_70' },
      { name: '网点拓展数量', weight: 40, dimension: '拓展指标', ruleType: 'STEP_100_70' }
    ],
    appliedCount: 22
  }
])

const expandedTemplates = ref<Record<string, boolean>>({})

const toggleTemplate = (id: string) => {
  expandedTemplates.value[id] = !expandedTemplates.value[id]
}

type EmployeeRecord = {
  id: string
  name: string
  role: string
  avatar: string
  score: number | null
  grade: string | null
  goalStatus: '已确认' | '待确认' | '未下发'
  history: { month: string; score: number }[]
}

type Department = {
  id: string
  name: string
  avgScore: number | null
  headcount: number
  ratedCount: number
  employees: EmployeeRecord[]
}

const generateHistory = (base: number): { month: string; score: number }[] => [
  { month: '2025-10', score: Math.round(base + (Math.random() - 0.5) * 15) },
  { month: '2025-11', score: Math.round(base + (Math.random() - 0.5) * 12) },
  { month: '2025-12', score: Math.round(base + (Math.random() - 0.5) * 10) },
  { month: '2026-01', score: Math.round(base + (Math.random() - 0.5) * 8) },
  { month: '2026-02', score: Math.round(base + (Math.random() - 0.5) * 6) },
]

const departments = ref<Department[]>([
  {
    id: 'dept-1',
    name: '大客KA',
    avgScore: 82.5,
    headcount: 5,
    ratedCount: 5,
    employees: [
      { id: 'e1', name: '刘小红', role: '大客经理', avatar: '刘', score: 91, grade: 'A', goalStatus: '已确认', history: generateHistory(88) },
      { id: 'e2', name: '王建军', role: 'KA主管', avatar: '王', score: 85, grade: 'B', goalStatus: '已确认', history: generateHistory(83) },
      { id: 'e3', name: '张丽华', role: '客户专员', avatar: '张', score: 79, grade: 'B', goalStatus: '已确认', history: generateHistory(78) },
      { id: 'e4', name: '陈志明', role: '客户专员', avatar: '陈', score: 76, grade: 'B', goalStatus: '已确认', history: generateHistory(74) },
      { id: 'e5', name: '李小明', role: '助理', avatar: '李', score: 82, grade: 'B', goalStatus: '已确认', history: generateHistory(80) },
    ],
  },
  {
    id: 'dept-2',
    name: '餐饮中心',
    avgScore: 78.2,
    headcount: 4,
    ratedCount: 4,
    employees: [
      { id: 'e6', name: '赵国强', role: '餐饮总监', avatar: '赵', score: 88, grade: 'A', goalStatus: '已确认', history: generateHistory(86) },
      { id: 'e7', name: '周雪梅', role: '渠道经理', avatar: '周', score: 75, grade: 'B', goalStatus: '已确认', history: generateHistory(73) },
      { id: 'e8', name: '吴明辉', role: '业务专员', avatar: '吴', score: 72, grade: 'C', goalStatus: '已确认', history: generateHistory(70) },
      { id: 'e9', name: '孙丽丽', role: '业务专员', avatar: '孙', score: 78, grade: 'B', goalStatus: '已确认', history: generateHistory(76) },
    ],
  },
])

const expandedDepts = ref<Record<string, boolean>>({})

const toggleDept = (deptId: string) => {
  expandedDepts.value[deptId] = !expandedDepts.value[deptId]
}

const gradeColor = (grade: string | null) => {
  switch (grade) {
    case 'A': return '!bg-emerald-100 !text-emerald-700 !border-emerald-200'
    case 'B': return '!bg-blue-100 !text-blue-700 !border-blue-200'
    case 'C': return '!bg-amber-100 !text-amber-700 !border-amber-200'
    case 'D': return '!bg-red-100 !text-red-700 !border-red-200'
    default: return '!bg-slate-100 !text-slate-500 !border-slate-200'
  }
}

// Summary stats
const summary = computed(() => {
  const totalEmployees = departments.value.reduce((s, d) => s + d.headcount, 0)
  const totalRated = departments.value.reduce((s, d) => s + d.ratedCount, 0)
  const allScores = departments.value.flatMap((d) =>
    d.employees.map((e) => e.score).filter((s): s is number => s !== null),
  )
  const overallAvg = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : null
  
  return {
    totalEmployees,
    totalRated,
    overallAvg,
    deptCount: departments.value.length,
  }
})

const goBack = () => router.push('/assessment/cycle')

const viewTemplate = (tplId: string) => {
  router.push(`/template/builder?id=${tplId}`)
}
</script>

<template>
  <div class="h-full overflow-y-auto bg-slate-50/50">
    <div class="max-w-7xl mx-auto px-4 xl:px-8 pb-20 pt-6 space-y-6">
      <!-- Header with Back Button -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <el-button @click="goBack" class="!rounded-full shadow-sm !bg-white shrink-0 !w-10 !h-10 !p-0 border-slate-200 hover:bg-slate-50 text-slate-700">
            <ChevronLeft class="h-4 w-4" />
          </el-button>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <el-tag effect="plain" class="!bg-blue-100 !text-blue-700 !border-blue-200 !font-bold">绩效大盘</el-tag>
              <h1 class="text-xl font-bold tracking-tight text-slate-900">{{ cycleInfo.title }}</h1>
            </div>
            <p class="text-sm text-slate-500 flex items-center gap-1.5">
              <CalendarDays class="h-3.5 w-3.5" /> {{ cycleInfo.period }} · 仅HR可见统计视图
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <el-button class="!bg-white border-slate-200 text-slate-600">
            <Printer class="h-4 w-4 mr-2" /> 打印报告
          </el-button>
          <el-button class="!bg-white border-slate-200 text-slate-600">
            <Download class="h-4 w-4 mr-2" /> 导出Excel
          </el-button>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="border-b border-slate-200">
        <div class="flex items-center gap-6 text-sm font-bold text-slate-500">
          <button
            @click="activeTab = 'templates'"
            :class="[ 'pb-3 px-1 border-b-2 transition-colors duration-200', activeTab === 'templates' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-800 hover:border-slate-300' ]"
          >
            本周期适用模板及名单
          </button>
          <button
            @click="activeTab = 'stats'"
            :class="[ 'pb-3 px-1 border-b-2 transition-colors duration-200', activeTab === 'stats' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-800 hover:border-slate-300' ]"
          >
            绩效综合大盘
          </button>
        </div>
      </div>

      <!-- Tab Content: Templates & Indicators -->
      <div v-if="activeTab === 'templates'" class="space-y-6 animate-in">
        <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3">
          <div class="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Info class="h-4 w-4" />
          </div>
          <p class="text-xs text-indigo-700 font-bold leading-relaxed">
            该面板展示本次考评周期关联的所有“考核模板（由配置中心下发）”以及被分配到对应模板下的“人员名单”。点击模板可预览考核维度构成。
          </p>
        </div>

        <div class="grid gap-4">
          <el-card v-for="tpl in templates" :key="tpl.id" shadow="hover" class="custom-el-card !p-0 !border-slate-200 overflow-hidden transition-all duration-300" body-class="!p-0">
            <div 
              class="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
              @click="toggleTemplate(tpl.id)"
            >
              <div class="flex items-center gap-4 min-w-0">
                <div class="text-slate-400">
                    <ChevronDown v-if="expandedTemplates[tpl.id]" class="h-5 w-5" />
                    <ChevronRight v-else class="h-5 w-5" />
                </div>
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <h3 class="font-bold text-slate-800">{{ tpl.name }}</h3>
                      <el-tag effect="plain" class="!bg-slate-100 !text-slate-500 !font-bold !border-none text-[10px]">受评人数: {{ tpl.appliedCount }}人</el-tag>
                    </div>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-[10px] text-slate-400 font-bold uppercase shrink-0"><FileText class="w-3 h-3 inline pb-0.5" /> 包含 {{ tpl.indicators.length }} 个维度指标</span>
                    </div>
                </div>
              </div>
              <div class="flex items-center gap-4 shrink-0">
                <el-button size="small" round @click.stop="viewTemplate(tpl.id)" class="!font-black text-xs !bg-white">查看模板详情配置</el-button>
              </div>
            </div>

            <div v-if="expandedTemplates[tpl.id]" class="border-t border-slate-100 bg-slate-50/30 p-6 animate-in duration-300">
              <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Target class="w-4 h-4 text-indigo-500"/> 指标构成模型</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 <div v-for="(ind, i) in tpl.indicators" :key="i" class="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:border-indigo-200 transition-colors">
                    <div class="flex justify-between items-start mb-2">
                       <el-tag size="small" effect="plain" class="!bg-slate-50 !border-none !font-bold text-[10px]">{{ ind.dimension }}</el-tag>
                       <span class="text-indigo-600 font-black text-sm">{{ ind.weight }}%</span>
                    </div>
                    <p class="font-bold text-slate-800 text-sm line-clamp-2 mt-1">{{ ind.name }}</p>
                    <div class="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                       <div class="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                       计分引擎: {{ ind.ruleType }}
                    </div>
                 </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- Tab Content: Stats -->
      <div v-if="activeTab === 'stats'" class="space-y-6 animate-in">
        <!-- Summary Statistics Dashboard -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <el-card shadow="hover" class="custom-el-card !border-slate-200 overflow-hidden relative group transition-all" body-class="!p-5 !flex !items-center !gap-4">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
            <div class="bg-blue-50 p-3 rounded-xl"><Users class="h-6 w-6 text-blue-600" /></div>
            <div>
              <div class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">考核总人数</div>
              <div class="text-2xl font-black text-slate-800">{{ summary.totalEmployees }}</div>
            </div>
          </el-card>

          <el-card shadow="hover" class="custom-el-card !border-slate-200 overflow-hidden relative group transition-all" body-class="!p-5 !flex !items-center !gap-4">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
            <div class="bg-emerald-50 p-3 rounded-xl"><UserCheck class="h-6 w-6 text-emerald-600" /></div>
            <div>
              <div class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">已完成评分</div>
              <div class="text-2xl font-black text-slate-800">{{ summary.totalRated }}</div>
            </div>
          </el-card>

          <el-card shadow="hover" class="custom-el-card !border-slate-200 overflow-hidden relative group transition-all" body-class="!p-5 !flex !items-center !gap-4">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
            <div class="bg-purple-50 p-3 rounded-xl"><TrendingUp class="h-6 w-6 text-purple-600" /></div>
            <div>
              <div class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">全周期平均分</div>
              <div class="text-2xl font-black text-slate-800">{{ summary.overallAvg?.toFixed(1) || '--' }}</div>
            </div>
          </el-card>

          <el-card shadow="hover" class="custom-el-card !border-slate-200 overflow-hidden relative group transition-all" body-class="!p-5 !flex !items-center !gap-4">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
            <div class="bg-amber-50 p-3 rounded-xl"><BarChart3 class="h-6 w-6 text-amber-600" /></div>
            <div>
              <div class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">参评部门总数</div>
              <div class="text-2xl font-black text-slate-800">{{ summary.deptCount }}</div>
            </div>
          </el-card>
        </div>

        <!-- Alert for active cycles -->
        <div v-if="cycleInfo.status === 'rating'" class="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3 shadow-inner">
          <AlertCircle class="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div class="text-sm text-blue-800">
            <p class="font-bold mb-1">考核正在进行中</p>
            <p>当前分数为实时计算的参考得分，最终成绩将以周期正式结案归档后的记录为准。</p>
          </div>
        </div>

        <!-- Department Detail List -->
        <div class="space-y-4">
          <el-card v-for="dept in departments" :key="dept.id" shadow="hover" class="custom-el-card !p-0 !border-slate-200 overflow-hidden transition-all duration-300" body-class="!p-0">
            <div 
              class="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
              @click="toggleDept(dept.id)"
            >
              <div class="flex items-center gap-4 min-w-0">
                <div class="text-slate-400">
                    <ChevronDown v-if="expandedDepts[dept.id]" class="h-5 w-5" />
                    <ChevronRight v-else class="h-5 w-5" />
                </div>
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <h3 class="font-bold text-slate-800">{{ dept.name }}</h3>
                      <el-tag effect="plain" class="!bg-slate-100 !text-slate-500 !font-bold !border-none text-[10px]">{{ dept.headcount }}人</el-tag>
                    </div>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-[10px] text-slate-400 font-bold uppercase shrink-0">评分进度</span>
                      <el-progress :percentage="Math.round((dept.ratedCount / dept.headcount) * 100)" :show-text="false" color="#4f46e5" class="w-16" :stroke-width="6" />
                      <span class="text-[10px] font-bold text-slate-600 shrink-0">{{ dept.ratedCount }}/{{ dept.headcount }}</span>
                    </div>
                </div>
              </div>

              <div class="flex items-center gap-4 shrink-0">
                <template v-if="dept.avgScore !== null">
                  <div class="text-right">
                      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">部门均分</div>
                      <div class="text-xl font-black text-slate-800 leading-none mt-1.5">{{ dept.avgScore }}</div>
                  </div>
                  <div :class="['w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm border border-white/50', 
                      gradeColor(dept.avgScore >= 85 ? 'A' : dept.avgScore >= 70 ? 'B' : dept.avgScore >= 60 ? 'C' : 'D')]">
                      {{ dept.avgScore >= 85 ? 'A' : dept.avgScore >= 70 ? 'B' : dept.avgScore >= 60 ? 'C' : 'D' }}
                  </div>
                </template>
              </div>
            </div>

            <div v-if="expandedDepts[dept.id]" class="border-t border-slate-100 animate-in duration-300">
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-slate-50/50 border-b border-slate-100 italic">
                      <th class="text-left font-bold text-slate-400 text-[10px] uppercase px-6 py-3 tracking-widest">考核对象</th>
                      <th class="text-left font-bold text-slate-400 text-[10px] uppercase px-4 py-3 tracking-widest">业务岗位</th>
                      <th class="text-center font-bold text-slate-400 text-[10px] uppercase px-4 py-3 tracking-widest">当前分</th>
                      <th class="text-center font-bold text-slate-400 text-[10px] uppercase px-4 py-3 tracking-widest">评级</th>
                      <th class="text-right font-bold text-slate-400 text-[10px] uppercase px-6 py-3 tracking-widest">半年趋势</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-for="emp in dept.employees" :key="emp.id" class="group hover:bg-blue-50/30 transition-colors">
                      <td class="px-6 py-3.5">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center text-xs font-bold text-slate-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-700">
                            {{ emp.avatar }}
                          </div>
                          <span class="font-bold text-slate-700 group-hover:text-blue-900 transition-colors">{{ emp.name }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-3.5 text-slate-500 font-medium">{{ emp.role }}</td>
                      <td class="px-4 py-3.5 text-center">
                        <span class="font-black text-slate-800 tracking-tight">{{ emp.score ?? '--' }}</span>
                      </td>
                      <td class="px-4 py-3.5 text-center">
                        <div v-if="emp.grade" :class="['inline-flex w-7 h-7 rounded items-center justify-center text-xs font-black shadow-inner border', gradeColor(emp.grade)]">
                          {{ emp.grade }}
                        </div>
                      </td>
                      <td class="px-6 py-3.5">
                        <div class="flex items-center justify-end">
                          <el-tooltip
                            placement="left"
                            effect="light"
                            :show-arrow="false"
                            popper-class="custom-tooltip-popper"
                          >
                            <template #content>
                                <div class="min-w-[200px] -m-3">
                                    <div class="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                                      <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black">{{ emp.avatar }}</div>
                                      <span class="font-black text-xs text-slate-800">{{ emp.name }} · 历史绩效分布</span>
                                    </div>
                                    <div class="p-3 space-y-2 bg-white">
                                      <div v-for="h in emp.history" :key="h.month" class="flex items-center justify-between gap-6">
                                          <span class="text-[10px] font-bold text-slate-400 font-mono">{{ h.month }}</span>
                                          <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                                            <div class="h-full bg-blue-500 rounded-full" :style="{ width: `${h.score}%` }" />
                                          </div>
                                          <span class="text-[10px] font-black text-slate-700 w-4 text-right">{{ h.score }}</span>
                                      </div>
                                    </div>
                                </div>
                            </template>
                            <div class="flex items-end gap-1 h-6 cursor-help group-hover:scale-110 transition-transform origin-right">
                              <div v-for="(h, i) in emp.history.slice(-4)" :key="i" 
                                  :class="['w-1.5 rounded-t-sm transition-all duration-500', 
                                    h.score >= 85 ? 'bg-emerald-400' : h.score >= 70 ? 'bg-blue-400' : 'bg-slate-300']"
                                  :style="{ height: `${Math.max(4, (h.score / 100) * 24)}px` }" />
                            </div>
                          </el-tooltip>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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

.animate-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.custom-tooltip-popper) {
  padding: 0px !important;
  border-radius: 0.75rem !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  border: none !important;
  overflow: hidden !important;
}
</style>
