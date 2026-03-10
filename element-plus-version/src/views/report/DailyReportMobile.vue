<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeft, 
  Calendar, 
  ChevronRight,
  Database,
  FileText,
  ClipboardCheck,
  MapPin,
  History,
  Activity
} from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const fillDate = ref<string>(
  ((Array.isArray(route.query.date) ? route.query.date[0] : route.query.date) || 
  new Date().toISOString().split('T')[0]) as string
)

// WeCom Primary Color
const wecomBlue = '#3D7EFF'

// ========== Mock Indicators Data ==========
const indicators = ref([
  {
    id: 'ind-1',
    name: '销售成单额 (元)',
    type: 'quantitative',
    dataSourceType: 'api',
    dataSourceValue: '财务系统同步',
    value: 45800,
    unit: '元',
  },
  {
    id: 'ind-2',
    name: '新客户拜访数',
    type: 'quantitative',
    dataSourceType: 'manual',
    dataSourceValue: '手动录入',
    value: null as number | null,
    unit: '个',
  },
  {
    id: 'ind-3',
    name: '客户满意度反馈',
    type: 'qualitative',
    dataSourceType: 'manual',
    dataSourceValue: '手动录入',
    value: null as string | null,
    unit: '描述',
  },
  {
    id: 'ind-4',
    name: '工单处理及时率',
    type: 'quantitative',
    dataSourceType: 'api',
    dataSourceValue: '运维系统同步',
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

const taskRecords = ref([
  { id: 't1', time: '09:00', type: 'visit', customer: '华艺进出口', location: '徐汇区虹桥路1号', content: '商务洽谈' },
  { id: 't2', time: '14:30', type: 'checkin', customer: '宜家家居 (徐汇店)', location: '漕溪路126号', content: '日常巡检' }
])

const handleSubmit = () => {
  if (!summary.value) {
    ElMessage({ message: '请填写今日工作总结', type: 'warning', plain: true })
    return
  }
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    ElMessage({ message: '提交成功', type: 'success', plain: true })
    router.push('/daily-report')
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen bg-[#F7F7F7] flex flex-col font-sans text-[#191919]">
    <!-- WeUI for Work Compact Header -->
    <header class="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-[#EBEBEB]">
      <div class="flex items-center gap-3">
        <ArrowLeft class="h-5 w-5 text-[#191919] active:opacity-30" @click="router.back()" />
        <h1 class="text-[17px] font-bold">每日日报填报</h1>
      </div>
      <div class="flex items-center gap-1 text-[#3D7EFF] text-[13px] font-semibold px-2.5 py-1 rounded bg-[#3D7EFF]/5 border border-[#3D7EFF]/20">
        <Calendar class="h-3 w-3" />
        {{ fillDate }}
      </div>
    </header>

    <!-- WeUI Tabs (WeCom Blue) -->
    <div class="bg-white flex border-b border-[#EBEBEB] sticky top-[53px] z-40">
      <div 
        v-for="tab in [{k:'indicators', n:'指标填报'}, {k:'tasks', n:'外勤轨迹'}]" 
        :key="tab.k"
        @click="activeTab = tab.k"
        class="flex-1 text-center py-3 text-[15px] transition-all relative"
        :class="activeTab === tab.k ? 'text-[#3D7EFF] font-bold' : 'text-[#808080]'"
      >
        {{ tab.n }}
        <div v-if="activeTab === tab.k" class="absolute bottom-0 left-[30%] right-[30%] h-[2.5px] bg-[#3D7EFF] rounded-full"></div>
      </div>
    </div>

    <!-- Minimal Slogan Bar -->
    <div class="px-4 py-2 text-[11px] text-[#B2B2B2] bg-[#F7F7F7] flex items-center gap-2 border-b border-[#F0F0F0]">
      <div class="w-1 h-3 bg-[#3D7EFF] rounded-full"></div>
      <span class="truncate italic tracking-tight">{{ currentSlogan }}</span>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto pb-32">
      <!-- Indicators Area -->
      <div v-if="activeTab === 'indicators'" class="animate-in fade-in duration-300">
        <div class="px-4 py-2.5 text-[14px] text-[#808080] font-medium">数据指标录入</div>
        <div class="bg-white border-y border-[#EBEBEB]">
          <div 
            v-for="(ind, index) in indicators" 
            :key="ind.id"
            class="flex flex-col px-4 py-4"
            :class="index !== indicators.length - 1 ? 'border-b border-[#F0F0F0]' : ''"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <Database v-if="ind.dataSourceType === 'api'" class="h-4 w-4 text-[#3D7EFF]" />
                <ClipboardCheck v-else class="h-4 w-4 text-[#3D7EFF]" />
                <span class="text-[15px] font-bold text-slate-800">{{ ind.name }}</span>
              </div>
              <span v-if="ind.dataSourceType === 'api'" class="text-[10px] text-[#3D7EFF] bg-[#3D7EFF]/5 px-2 py-0.5 rounded border border-[#3D7EFF]/20 font-black uppercase tracking-tighter">Verified</span>
            </div>

            <!-- Manual Input Cell -->
            <div v-if="ind.dataSourceType === 'manual'" class="relative">
              <el-input 
                v-model="ind.value" 
                :placeholder="'点击输入' + ind.name"
                class="weui-input-adapter"
              >
                <template #suffix>
                  <span class="text-[13px] text-[#B2B2B2] font-medium mr-1">{{ ind.unit }}</span>
                </template>
              </el-input>
            </div>
            <!-- API Value Display -->
            <div v-else class="flex items-center justify-between bg-[#F8FAFF] px-3 py-2.5 rounded-lg border border-[#E9F0FF]">
              <span class="text-[11px] text-[#99A9BF] font-bold uppercase tracking-widest">Real-time Data</span>
              <div class="flex items-baseline gap-1">
                <span class="text-xl font-black text-[#191919] tracking-tighter">{{ ind.value }}</span>
                <span class="text-[11px] text-[#808080] font-medium">{{ ind.unit }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 py-2.5 mt-4 text-[14px] text-[#808080] font-medium">今日工作陈述</div>
        <div class="bg-white border-y border-[#EBEBEB] p-4 space-y-6">
          <div class="space-y-2">
            <div class=\"flex items-center gap-1.5 text-[15px] font-bold text-slate-800\">
              今日总结 <span class=\"text-red-500\">*</span>
            </div>
            <el-input 
              v-model="summary" 
              type="textarea" 
              :rows="4" 
              placeholder="请输入今日核心成果及关键进展..."
              class="weui-textarea-adapter"
            />
          </div>
          <div class="space-y-2">
            <div class=\"flex items-center gap-1.5 text-[15px] font-bold text-slate-800\">
              明日计划
            </div>
            <el-input 
              v-model="nextPlan" 
              type="textarea" 
              :rows="3" 
              placeholder="请输入次日重点工作安排..."
              class="weui-textarea-adapter"
            />
          </div>
        </div>
      </div>

      <!-- Trajectory (Tasks) Area -->
      <div v-if="activeTab === 'tasks'" class="animate-in fade-in duration-300">
        <div class="px-4 py-2.5 text-[14px] text-[#808080] font-medium">任务与外勤记录</div>
        <div class="bg-white border-y border-[#EBEBEB]">
          <div 
            v-for="(rec, index) in taskRecords" 
            :key="rec.id"
            class=\"flex gap-4 px-5 py-5 active:bg-[#F9F9F9] transition-colors\"
            :class="index !== taskRecords.length - 1 ? 'border-b border-[#F0F0F0]' : ''"
          >
            <!-- Custom Timeline Node -->
            <div class="flex flex-col items-center pt-1">
              <div class="w-2.5 h-2.5 rounded-full border-2 border-[#3D7EFF] bg-white z-10"></div>
              <div v-if="index !== taskRecords.length - 1" class="w-[1px] flex-1 bg-[#EBEBEB] my-1"></div>
            </div>
            
            <div class="flex-1 space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F0F5FF] border border-[#E0E9FF]">
                   <History class="h-3 w-3 text-[#3D7EFF]" />
                   <span class="text-[11px] font-bold text-[#3D7EFF]">{{ rec.time }}</span>
                </div>
                <div class="flex items-center gap-1 text-[#B2B2B2] text-[11px] font-medium">
                  <MapPin class=\"h-3 w-3\" />
                  <span class=\"truncate max-w-[120px]\">{{ rec.location }}</span>
                </div>
              </div>
              <div class="text-[16px] font-black text-[#191919]">{{ rec.customer }}</div>
              <div class="bg-[#F9FAFB] p-2.5 rounded-lg border border-[#F2F4F6]">
                <p class="text-[14px] text-[#666] leading-relaxed">{{ rec.content }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Empty State -->
        <div class="p-16 text-center" v-if="taskRecords.length === 0">
           <el-empty description="今日暂无外勤活跃记录" :image-size="100" />
        </div>
      </div>
    </div>

    <!-- FIXED Action Bar (WeCom Blue) -->
    <footer class="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-[#EBEBEB] flex gap-4 z-50">
      <button 
        class="flex-1 h-[46px] rounded-lg border border-[#EBEBEB] text-[#191919] font-bold text-[15px] bg-white active:bg-[#F2F2F2] transition-colors"
      >
        暂存
      </button>
      <button 
        @click="handleSubmit"
        :disabled="isSubmitting"
        class="flex-[2.5] h-[46px] rounded-lg bg-[#3D7EFF] text-white font-black text-[15px] flex items-center justify-center gap-2 active:opacity-80 disabled:opacity-50 shadow-lg shadow-[#3D7EFF]/20 transition-all font-sans"
      >
        <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
        {{ isSubmitting ? '提交中...' : '提交今日日报' }}
      </button>
    </footer>
  </div>
</template>

<style scoped>
/* WeUI Input Stylings */
:deep(.weui-input-adapter .el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
  border-bottom: 1px solid #EDEDED !important;
  border-radius: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  height: 44px !important;
  transition: all 0.2s ease;
}

:deep(.weui-input-adapter .el-input__wrapper.is-focus) {
  border-bottom-color: #3D7EFF !important;
  border-bottom-width: 1.5px !important;
}

:deep(.weui-textarea-adapter .el-textarea__inner) {
  box-shadow: none !important;
  border: 1px solid #EDEDED !important;
  background: #F9F9F9 !important;
  border-radius: 8px !important;
  padding: 12px 14px !important;
  font-size: 15px !important;
  line-height: 1.5 !important;
}

:deep(.weui-textarea-adapter .el-textarea__inner:focus) {
  border-color: #3D7EFF !important;
  background: #FFF !important;
}

/* Animations */
.animate-in {
  animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Hide Scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}
.overflow-y-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
