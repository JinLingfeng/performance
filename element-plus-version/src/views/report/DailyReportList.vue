<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, 
  CalendarDays, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  FileText,
  Search,
  AlertCircle
} from 'lucide-vue-next'

const router = useRouter()

// ========== Mock Data ==========
const reports = ref([
  {
    id: 'rep-20260310',
    date: '2026-03-10',
    status: 'submitted',
    indicatorsCount: 5,
    completionRate: 100,
    summary: '今日完成了KA大客户的巡店，并对接了新产品的上架事宜，整体进度符合预期。',
  },
  {
    id: 'rep-20260309',
    date: '2026-03-09',
    status: 'submitted',
    indicatorsCount: 5,
    completionRate: 100,
    summary: '处理了三起客户投诉，其中一起较为复杂，已反馈至品质部处理。',
  },
  {
    id: 'rep-20260308',
    date: '2026-03-08',
    status: 'missing',
    indicatorsCount: 0,
    completionRate: 0,
    summary: '',
  },
  {
    id: 'rep-20260307',
    date: '2026-03-07',
    status: 'submitted',
    indicatorsCount: 5,
    completionRate: 100,
    summary: '周报汇总与下周计划制定。',
  }
])

const stats = computed(() => {
  const submittedCount = reports.value.filter(r => r.status === 'submitted').length
  return {
    totalThisMonth: 10,
    submittedCount,
    missingCount: 1,
    rate: Math.round((submittedCount / 10) * 100)
  }
})

const searchQuery = ref('')
const filteredReports = computed(() => {
  if (!searchQuery.value) return reports.value
  return reports.value.filter(r => r.date.includes(searchQuery.value) || r.summary.includes(searchQuery.value))
})

const goToFill = (date?: string) => {
  router.push({ name: 'daily-report-fill', query: { date } })
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${dateStr} (${days[date.getDay()]})`
}
</script>

<template>
  <div class="h-full overflow-y-auto bg-slate-50/50 p-6 md:p-8">
    <div class="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-black tracking-tight text-slate-900 border-l-8 border-indigo-600 pl-4">我的工作日报</h1>
          <p class="text-slate-500 mt-2 font-medium flex items-center gap-2">
            <CalendarDays class="h-4 w-4 text-indigo-500" />
            李小明 (00192) · 2026年3月份考核周期进行中
          </p>
        </div>
        <el-button 
          type="primary" 
          size="large" 
          class="!h-14 !px-8 !rounded-2xl !font-black !text-lg shadow-xl shadow-indigo-100 hover:scale-105 transition-all !bg-indigo-600"
          @click="goToFill()"
        >
          <Plus class="mr-2 h-6 w-6" />
          填写今日日报
        </el-button>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <el-card shadow="never" class="!border-none !rounded-3xl bg-white shadow-sm overflow-hidden relative group">
          <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <CheckCircle2 class="h-20 w-20 text-indigo-600" />
          </div>
          <div class="p-6">
            <div class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">本月已提交</div>
            <div class="text-4xl font-black text-slate-900">{{ stats.submittedCount }} <span class="text-sm font-bold text-slate-400">/ 22 天</span></div>
            <el-progress :percentage="stats.rate" :show-text="false" color="#4f46e5" class="mt-4" />
          </div>
        </el-card>

        <el-card shadow="never" class="!border-none !rounded-3xl bg-white shadow-sm overflow-hidden relative group">
          <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <AlertCircle class="h-20 w-20 text-amber-600" />
          </div>
          <div class="p-6">
            <div class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">待补填日期</div>
            <div class="text-4xl font-black text-amber-600">{{ stats.missingCount }} <span class="text-sm font-bold text-slate-400">Days</span></div>
            <p class="text-[10px] text-amber-600/80 font-bold mt-4">尽快补齐日报，避免影响权重指标计算。</p>
          </div>
        </el-card>

        <el-card shadow="never" class="!border-none !rounded-3xl bg-white shadow-sm overflow-hidden relative group">
          <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp class="h-20 w-20 text-emerald-600" />
          </div>
          <div class="p-6">
            <div class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">本月指标平均达成</div>
            <div class="text-4xl font-black text-emerald-600">82.4 <span class="text-sm font-bold text-slate-400">%</span></div>
            <p class="text-[10px] text-emerald-600/80 font-bold mt-4">数据来源于每日系统接口初算均值。</p>
          </div>
        </el-card>
      </div>

      <!-- Filters & List -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-black text-slate-800 flex items-center gap-2">
            <FileText class="h-5 w-5 text-slate-400" />
            历史填报记录
          </h2>
          <div class="flex items-center gap-3">
             <el-input
              v-model="searchQuery"
              placeholder="搜索日期或内容..."
              class="!w-64 custom-el-input"
              clearable
            >
              <template #prefix>
                <Search class="h-4 w-4 text-slate-400" />
              </template>
            </el-input>
          </div>
        </div>

        <div class="grid gap-4">
          <div 
            v-for="report in filteredReports" 
            :key="report.id"
            class="group bg-white rounded-3xl p-6 border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer relative"
            @click="report.status === 'missing' ? goToFill(report.date) : null"
          >
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div class="flex items-center gap-6 flex-1 min-w-0">
                <div 
                  :class="[
                    'h-14 w-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border-2',
                    report.status === 'submitted' ? 'bg-indigo-50 border-white text-indigo-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                  ]"
                >
                  <span class="text-[10px] font-black uppercase opacity-60">{{ report.date.split('-')[1] }}月</span>
                  <span class="text-xl font-black leading-none">{{ report.date.split('-')[2] }}</span>
                </div>
                
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-3 flex-wrap">
                    <h3 class="font-black text-slate-900 underline decoration-slate-200 underline-offset-4">{{ formatDate(report.date) }}</h3>
                    <el-tag 
                      v-if="report.status === 'submitted'" 
                      type="success" 
                      effect="plain" 
                      round 
                      class="!bg-emerald-50 !border-emerald-100 !text-emerald-700 !font-black !text-[10px]"
                    >
                      已确认提交
                    </el-tag>
                    <el-tag 
                      v-else 
                      type="warning" 
                      effect="dark" 
                      round 
                      class="!font-black !text-[10px] !bg-amber-500 animate-pulse"
                    >
                      待补填
                    </el-tag>
                  </div>
                  <p class="text-sm text-slate-500 mt-2 truncate max-w-2xl font-medium">
                    {{ report.status === 'missing' ? '该日期暂无日报数据，点击立即补填今日绩效表现。' : report.summary }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-6 shrink-0">
                <div v-if="report.status === 'submitted'" class="text-right hidden sm:block">
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">填报指标项</div>
                  <div class="flex items-center gap-1.5 flex-row-reverse">
                    <div class="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">+{{ report.indicatorsCount - 3 }}</div>
                    <div class="h-6 w-6 rounded-full bg-indigo-100 border-2 border-white shadow-sm"></div>
                    <div class="h-6 w-6 rounded-full bg-emerald-100 border-2 border-white shadow-sm"></div>
                    <div class="h-6 w-6 rounded-full bg-amber-100 border-2 border-white shadow-sm"></div>
                  </div>
                </div>
                
                <div v-if="report.status === 'submitted'" class="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                  <div class="text-[9px] font-bold text-indigo-400 uppercase text-center mb-0.5">SCORE</div>
                  <div class="text-lg font-black text-indigo-700 leading-none">88.5</div>
                </div>

                <div class="p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ChevronRight class="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
:deep(.custom-el-input .el-input__wrapper) {
  border-radius: 1rem !important;
  background-color: white !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
  height: 2.75rem !important;
}

:deep(.custom-el-input .el-input__wrapper.is-focus) {
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 4px rgba(238, 242, 255, 0.5) !important;
}

:deep(.el-progress-bar__outer) {
  background-color: #f1f5f9 !important;
  border-radius: 10px !important;
}
</style>
