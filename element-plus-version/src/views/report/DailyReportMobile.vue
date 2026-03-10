<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Info,
  Database,
  FileText,
  ClipboardCheck,
  MapPin,
  History,
  Activity,
  Calendar,
  ChevronRight
} from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

const fillDate = ref<string>(
  ((Array.isArray(route.query.date) ? route.query.date[0] : route.query.date) || 
  new Date().toISOString().split('T')[0]) as string
)

// ========== Mock Indicators Data ==========
const indicators = ref([
  {
    id: 'ind-1',
    name: '销售成单额 (元)',
    type: 'quantitative',
    dataSourceType: 'api',
    dataSourceValue: '财务系统-回款接口',
    value: 45800,
    unit: '元',
  },
  {
    id: 'ind-2',
    name: '新客户拜访数',
    type: 'quantitative',
    dataSourceType: 'manual',
    dataSourceValue: '手动录入实际拜访数量',
    value: null as number | null,
    unit: '个',
  },
  {
    id: 'ind-3',
    name: '客户满意度反馈',
    type: 'qualitative',
    dataSourceType: 'manual',
    dataSourceValue: '根据售后回访记录填报',
    value: null as string | null,
    unit: '描述',
  },
  {
    id: 'ind-4',
    name: '工单处理及时率',
    type: 'quantitative',
    dataSourceType: 'api',
    dataSourceValue: '运维系统-响应时间接口',
    value: 98.5,
    unit: '%',
  }
])

const summary = ref('')
const nextPlan = ref('')
const isSubmitting = ref(false)
const activeTab = ref('indicators')

const dailySlogans = [
  '行而不辍，履践致远，每一份努力都在发光。',
  '精诚所至，金石为开，用专业赢得客户信任。',
  '日省其身，月盈其效，在实战中稳步进阶。',
  '志在峰巅，起于累土，记录成长的每一个脚印。',
  '以终为始，专注目标，让过程与结果同样精彩。',
  '不积跬步，无以至千里，今日事今日毕。',
  '砥砺前行，笃行不怠，用汗水浇灌成功的果实。',
  '勇往直前，破茧成蝶，挑战自我无上限。'
]

const currentSlogan = computed(() => {
  const dateStr = (fillDate.value || new Date().toISOString().split('T')[0]) as string
  const hash = dateStr.split('').reduce((acc: number, char: string) => acc + (char.charCodeAt(0) || 0), 0)
  return dailySlogans[hash % dailySlogans.length]
})

// ========== Mock Task System Data ==========
const taskRecords = ref([
  {
    id: 'task-1',
    time: '09:00 - 10:30',
    type: 'visit',
    customer: '上海华艺进出口有限公司',
    location: '徐汇区虹桥路1号',
    status: 'completed',
    content: '沟通Q2季度采购计划，确认初步意向单。'
  },
  {
    id: 'task-2',
    time: '11:00 - 12:00',
    type: 'checkin',
    customer: '宜家家居 (徐汇店)',
    location: '徐汇区漕溪路126号',
    status: 'completed',
    content: '日常巡店，检查展位布置及物料库存。'
  },
  {
    id: 'task-3',
    time: '14:00 - 16:30',
    type: 'visit',
    customer: '百安居商贸有限公司',
    location: '普陀区真北路1208号',
    status: 'completed',
    content: '新产品推介会，演示了智能家居模块。'
  }
])

const handleSaveDraft = () => {
  ElMessage.success('草案已暂存')
}

const handleSubmit = () => {
  if (!summary.value) {
    ElMessage.warning('请填写今日工作总结')
    return
  }
  ElMessageBox.confirm('确认提交今日日报？', '提交确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
    center: true,
    roundButton: true
  }).then(() => {
    isSubmitting.value = true
    setTimeout(() => {
      isSubmitting.value = false
      ElMessage.success('提交成功！')
      router.push('/daily-report')
    }, 1000)
  })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col pb-24 font-sans antialiased text-slate-900 overflow-x-hidden">
    <!-- H5 Header -->
    <header class="bg-indigo-600 pt-10 pb-16 px-6 sticky top-0 z-30 shadow-lg relative overflow-hidden">
      <!-- Decorator Background -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-6">
          <button @click="router.back()" class="p-2 -ml-2 text-indigo-100 active:opacity-50 transition-opacity">
            <ArrowLeft class="h-6 w-6" />
          </button>
          <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <Calendar class="h-3.5 w-3.5 text-indigo-200" />
            <span class="text-xs font-bold text-white tracking-widest">{{ fillDate }}</span>
          </div>
        </div>
        
        <h1 class="text-2xl font-black text-white mb-2 leading-tight">
          绩效日报填报
        </h1>
        <p class="text-indigo-100/80 text-sm font-medium leading-relaxed italic border-l-2 border-indigo-400/50 pl-3">
          「 {{ currentSlogan }} 」
        </p>
      </div>
    </header>

    <!-- Main Content Tabs -->
    <div class="flex-1 -mt-8 relative z-20 px-4">
      <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col min-h-[500px]">
        <!-- Custom Mobile Tabs -->
        <div class="flex border-b border-slate-100">
          <button 
            @click="activeTab = 'indicators'"
            :class="['flex-1 py-5 px-2 flex flex-col items-center gap-1.5 transition-all relative', activeTab === 'indicators' ? 'text-indigo-600' : 'text-slate-400']"
          >
            <Activity class="h-5 w-5" />
            <span class="text-xs font-black tracking-tighter">指标填报</span>
            <div v-show="activeTab === 'indicators'" class="absolute bottom-0 left-1/4 right-1/4 h-1 bg-indigo-600 rounded-full"></div>
          </button>
          <button 
            @click="activeTab = 'tasks'"
            :class="['flex-1 py-5 px-2 flex flex-col items-center gap-1.5 transition-all relative', activeTab === 'tasks' ? 'text-indigo-600' : 'text-slate-400']"
          >
            <History class="h-5 w-5" />
            <span class="text-xs font-black tracking-tighter">外勤轨迹</span>
            <div v-show="activeTab === 'tasks'" class="absolute bottom-0 left-1/4 right-1/4 h-1 bg-indigo-600 rounded-full"></div>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="p-5 flex-1 overflow-y-auto">
          <!-- Indicators Tab -->
          <div v-if="activeTab === 'indicators'" class="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <!-- Indicator List -->
            <div class="space-y-4">
              <div v-for="ind in indicators" :key="ind.id" class="bg-slate-50/80 rounded-3xl p-5 border border-slate-100/50">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div :class="['p-2 rounded-2xl', ind.dataSourceType === 'api' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600']">
                      <Database v-if="ind.dataSourceType === 'api'" class="h-4 w-4" />
                      <FileText v-else class="h-4 w-4" />
                    </div>
                    <div>
                      <h3 class="font-black text-slate-800 text-sm">{{ ind.name }}</h3>
                      <p class="text-[10px] font-bold text-slate-400 tracking-tight">{{ ind.dataSourceValue }}</p>
                    </div>
                  </div>
                  <span v-if="ind.dataSourceType === 'api'" class="text-[8px] font-black bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded-full uppercase border border-indigo-100">Sync</span>
                </div>

                <!-- Input Slot -->
                <div v-if="ind.dataSourceType === 'manual'">
                  <el-input
                    v-model="ind.value"
                    :placeholder="'请录入' + ind.name"
                    class="h5-input"
                  >
                    <template #suffix>
                      <span class="text-[10px] font-black text-slate-400 mr-2 uppercase">{{ ind.unit }}</span>
                    </template>
                  </el-input>
                </div>
                <!-- API Slot (Real-time Value) -->
                <div v-else class="flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-indigo-50">
                   <span class="text-[10px] font-black text-indigo-300 uppercase letter-spacing-widest">Real-time Verified</span>
                   <div class="flex items-baseline gap-1">
                      <span class="text-lg font-black text-indigo-600 tracking-tighter">{{ ind.value }}</span>
                      <span class="text-[10px] font-bold text-slate-400">{{ ind.unit }}</span>
                   </div>
                </div>
              </div>
            </div>

            <!-- Narratives -->
            <div class="space-y-6">
               <div class="space-y-2.5">
                  <div class="flex items-center gap-2 px-1">
                    <span class="h-4 w-1 bg-indigo-600 rounded-full"></span>
                    <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest">今日工作总结</label>
                  </div>
                  <el-input
                    v-model="summary"
                    type="textarea"
                    :rows="4"
                    placeholder="描述今日工作产出与核心成果..."
                    class="h5-textarea"
                  />
               </div>
               <div class="space-y-2.5">
                  <div class="flex items-center gap-2 px-1">
                    <span class="h-4 w-1 bg-slate-400 rounded-full"></span>
                    <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest">明日工作计划</label>
                  </div>
                  <el-input
                    v-model="nextPlan"
                    type="textarea"
                    :rows="4"
                    placeholder="后续跟进计划或重点事项..."
                    class="h5-textarea"
                  />
               </div>
            </div>
          </div>

          <!-- Tasks Tab -->
          <div v-if="activeTab === 'tasks'" class="animate-in slide-in-from-left-4 duration-300">
            <div class="flex items-center gap-3 mb-8 p-1">
              <div class="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <MapPin class="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 class="font-black text-slate-900 leading-none mb-1">活跃足迹预览</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase">Tracked from task system</p>
              </div>
            </div>

            <div class="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200 before:dashed">
              <div v-for="record in taskRecords" :key="record.id" class="relative">
                <div class="absolute -left-[20px] top-1 h-3.5 w-3.5 rounded-full bg-white border-2 border-indigo-600 z-10"></div>
                
                <div class="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col gap-3 active:bg-slate-100 active:scale-[0.98] transition-all">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black text-indigo-500 bg-white px-2 py-0.5 rounded-lg border border-indigo-50">{{ record.time }}</span>
                    <ChevronRight class="h-4 w-4 text-slate-300" />
                  </div>
                  <h4 class="font-black text-slate-900 text-sm">{{ record.customer }}</h4>
                  <div class="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <MapPin class="h-3 w-3" />
                    {{ record.location }}
                  </div>
                  <p class="text-xs text-slate-600 font-medium leading-relaxed bg-white/60 p-2.5 rounded-2xl border border-white">
                    {{ record.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Footer Actions -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-5 flex items-center justify-between gap-4 z-40">
       <el-button 
        round 
        @click="handleSaveDraft" 
        class="flex-1 !h-14 !bg-slate-50 !border-slate-200 !text-slate-500 !font-black !rounded-2xl active:!bg-slate-100"
       >
         <Save class="h-4 w-4 mr-2" />
         暂存
       </el-button>
       <el-button 
        type="primary" 
        round 
        @click="handleSubmit" 
        :loading="isSubmitting"
        class="flex-[2] !h-14 !bg-indigo-600 !border-none !text-white !font-black !rounded-2xl shadow-xl shadow-indigo-100 active:opacity-90"
       >
         <Send class="h-4 w-4 mr-2" />
         确认提交日报
       </el-button>
    </footer>
  </div>
</template>

<style scoped>
/* Mobile Input Stylings */
:deep(.h5-input .el-input__wrapper) {
  border-radius: 1.25rem !important;
  height: 3.5rem !important;
  border: 2px solid #f1f5f9 !important;
  box-shadow: none !important;
  background-color: white !important;
  transition: all 0.2s ease;
}

:deep(.h5-input .el-input__wrapper.is-focus) {
  border-color: #4f46e5 !important;
  background-color: white !important;
}

:deep(.h5-textarea .el-textarea__inner) {
  border-radius: 1.5rem !important;
  background-color: white !important;
  border: 1.5px solid #f1f5f9 !important;
  padding: 1rem !important;
  box-shadow: none !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  line-height: 1.6 !important;
  transition: all 0.2s ease;
}

:deep(.h5-textarea .el-textarea__inner:focus) {
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.05) !important;
}

/* Custom Hide Scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}
.overflow-y-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes bounce-sm {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
