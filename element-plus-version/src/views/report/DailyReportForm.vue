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
  Target,
  CheckCircle2
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
    target: 50000,
    unit: '元',
  },
  {
    id: 'ind-2',
    name: '新客户拜访数',
    type: 'quantitative',
    dataSourceType: 'manual',
    dataSourceValue: '手动录入实际拜访数量',
    value: null as number | null,
    target: 5,
    unit: '个',
  },
  {
    id: 'ind-3',
    name: '客户满意度反馈',
    type: 'qualitative',
    dataSourceType: 'manual',
    dataSourceValue: '根据售后回访记录填报',
    value: null as string | null,
    target: null,
    unit: '描述',
  },
  {
    id: 'ind-4',
    name: '工单处理及时率',
    type: 'quantitative',
    dataSourceType: 'api',
    dataSourceValue: '运维系统-响应时间接口',
    value: 98.5,
    target: 95,
    unit: '%',
  }
])

const summary = ref('')
const nextPlan = ref('')

const isSubmitting = ref(false)

const handleSaveDraft = () => {
  ElMessage.success('草案已暂存至本地')
}

const handleSubmit = () => {
  if (!summary.value) {
    ElMessage.warning('请填写今日工作总结')
    return
  }

  ElMessageBox.confirm(
    '确定要提交今日日报吗？提交后数据将作为绩效考评的正式参考。',
    '确认提交',
    {
      confirmButtonText: '确认提交',
      cancelButtonText: '取消',
      type: 'info',
      roundButton: true,
    }
  ).then(() => {
    isSubmitting.value = true
    setTimeout(() => {
      isSubmitting.value = false
      ElMessage.success('日报提交成功！')
      router.push('/daily-report')
    }, 1000)
  })
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${dateStr} ${days[date.getDay()]}`
}

const dailySlogans = {
  0: '蓄力前行，调整状态，满电开启新征程。', // 周日
  1: '万事开头难，今日的坚持是成功的基石。', // 周一
  2: '渐入佳境，让高效成为一种习惯。',     // 周二
  3: '半周回顾，查漏补缺，精益求精。',     // 周三
  4: '临门一脚，保持韧性，冲刺关键目标。',   // 周四
  5: '硕果累累，用日报记录这一周的勋章。',   // 周五
  6: '厚积薄发，深度思考，复盘即成长。'      // 周六
}

const currentSlogan = computed(() => {
  const date = new Date(fillDate.value)
  return dailySlogans[date.getDay() as keyof typeof dailySlogans] || '坚持记录，见证成长。'
})
</script>

<template>
  <div class="h-full flex flex-col bg-slate-50/50">
    <!-- Top Action Bar -->
    <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div class="flex items-center gap-4">
        <el-button circle @click="router.back()" class="!border-slate-200">
          <ArrowLeft class="h-4 w-4 text-slate-600" />
        </el-button>
        <div class="h-8 w-[1px] bg-slate-200 mx-1"></div>
        <div>
          <h1 class="text-xl font-black text-slate-900 tracking-tight">绩效日报填报</h1>
          <div class="flex items-center gap-2 mt-0.5">
            <el-date-picker
              v-model="fillDate"
              type="date"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              class="custom-date-picker"
              :clearable="false"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <el-button round @click="handleSaveDraft" class="!font-bold !text-slate-500 !bg-transparent !border-slate-200">
          <Save class="h-4 w-4 mr-2" />
          暂存草稿
        </el-button>
        <el-button 
          type="primary" 
          round 
          :loading="isSubmitting"
          class="!font-black !px-8 !bg-indigo-600 !border-none shadow-lg shadow-indigo-100"
          @click="handleSubmit"
        >
          <Send class="h-4 w-4 mr-2" />
          确认提交
        </el-button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-8">
      <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        <!-- Welcome Section -->
        <div class="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200/50">
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-2">
               <div class="bg-white/20 backdrop-blur-md p-1.5 rounded-lg">
                 <Target class="h-5 w-5 text-white" />
               </div>
               <span class="text-sm font-black uppercase tracking-widest opacity-80">DAILY PERFORMANCE</span>
            </div>
            <h2 class="text-3xl font-black mb-2">{{ currentSlogan }}</h2>
            <p class="text-indigo-100 font-medium max-w-lg">
              今日填报将自动关联「{{ formatDate(fillDate!) }}」的考核数据。手动项请根据公司基准真实填写，系统项数据已自动校准。
            </p>
          </div>
          <!-- Decorative Icons -->
          <CheckCircle2 class="absolute -right-8 -bottom-8 h-48 w-48 text-white/10 rotate-12" />
        </div>

        <!-- Indicators Form -->
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <section class="space-y-4">
             <div class="flex items-center justify-between px-2">
                <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
                  <ClipboardCheck class="h-5 w-5 text-indigo-500" />
                  关键考核指标
                </h3>
                <span class="text-[10px] font-black text-slate-400 bg-slate-200/50 px-2 py-1 rounded-full uppercase tracking-tighter">
                  {{ indicators.length }} Dimensions
                </span>
             </div>

             <div class="grid gap-4">
               <el-card 
                v-for="ind in indicators" 
                :key="ind.id" 
                shadow="hover" 
                class="!border-none !rounded-[24px] bg-white group hover:shadow-xl hover:shadow-slate-200/50 transition-all border-l-8"
                :class="ind.dataSourceType === 'api' ? 'border-l-indigo-400' : 'border-l-emerald-400'"
               >
                 <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 p-2">
                   <div class="flex-1 space-y-2">
                     <div class="flex items-center gap-2">
                        <div 
                          :class="[
                            'p-1.5 rounded-lg',
                            ind.dataSourceType === 'api' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                          ]"
                        >
                          <Database v-if="ind.dataSourceType === 'api'" class="h-4 w-4" />
                          <FileText v-else class="h-4 w-4" />
                        </div>
                        <h4 class="font-black text-slate-900">{{ ind.name }}</h4>
                        <el-tag v-if="ind.dataSourceType === 'api'" type="info" size="small" effect="plain" class="!bg-slate-50 !border-slate-100 !text-slate-400 !font-bold !text-[9px]">接口自动提取</el-tag>
                     </div>
                     <p class="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                       <Info class="h-3 w-3" />
                       数据来源: {{ ind.dataSourceValue }}
                     </p>
                   </div>

                   <div class="w-full md:w-64">
                      <!-- Manual Input -->
                      <div v-if="ind.dataSourceType === 'manual'" class="flex items-center gap-2">
                         <el-input
                          v-model="ind.value"
                          :placeholder="'填写 ' + ind.name"
                          class="custom-fill-input"
                         >
                            <template #suffix>
                              <span class="text-[10px] font-black text-slate-400 mr-2 uppercase">{{ ind.unit }}</span>
                            </template>
                         </el-input>
                      </div>

                      <!-- API (Read Only) -->
                      <div v-else class="bg-indigo-50/50 border border-indigo-100 p-3 rounded-2xl flex items-center justify-between">
                         <div class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Real-time</div>
                         <div class="flex items-baseline gap-1">
                            <span class="text-xl font-black text-slate-900 tracking-tighter">{{ ind.value }}</span>
                            <span class="text-xs font-bold text-slate-400">{{ ind.unit }}</span>
                         </div>
                      </div>
                   </div>
                 </div>
               </el-card>
             </div>
          </section>

          <!-- Narrative Section -->
          <section class="space-y-4">
            <h3 class="text-lg font-black text-slate-800 flex items-center gap-2 px-2">
              <FileText class="h-5 w-5 text-indigo-500" />
              工作总结与后续计划
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">今日工作总结 (必填)</label>
                <el-input
                  v-model="summary"
                  type="textarea"
                  :rows="6"
                  placeholder="简洁描述今日核心工作产出..."
                  class="custom-textarea"
                />
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">明日/后续核心计划</label>
                <el-input
                  v-model="nextPlan"
                  type="textarea"
                  :rows="6"
                  placeholder="规划后续待办事项或重要跟进..."
                  class="custom-textarea"
                />
              </div>
            </div>
          </section>
        </div>

        <div class="h-10"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.custom-date-picker .el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding-left: 12px !important;
}

:deep(.custom-fill-input .el-input__wrapper) {
  border-radius: 1rem !important;
  background-color: white !important;
  box-shadow: none !important;
  border: 2px solid #ecfdf5 !important;
  height: 3.5rem !important;
  transition: all 0.3s ease;
}

:deep(.custom-fill-input .el-input__wrapper.is-focus) {
  border-color: #34d399 !important;
  box-shadow: 0 0 0 4px rgba(209, 250, 229, 0.5) !important;
}

:deep(.custom-textarea .el-textarea__inner) {
  border-radius: 1.5rem !important;
  border: 1px solid #e2e8f0 !important;
  padding: 1.25rem !important;
  box-shadow: none !important;
  font-weight: 500 !important;
  background-color: white !important;
  transition: all 0.3s ease;
}

:deep(.custom-textarea .el-textarea__inner:focus) {
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 4px rgba(238, 242, 255, 0.5) !important;
}
</style>
