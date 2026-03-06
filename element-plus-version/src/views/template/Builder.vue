<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  Trash2,
  Eye,
  TrendingUp,
  Filter,
  ArrowRight,
  Calculator,
  ChevronRight,
  Info,
} from 'lucide-vue-next'
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

const removeIndicator = (id: string) => {
  indicators.value = indicators.value.filter((ind) => ind.id !== id)
}

const goBack = () => router.push('/configuration')

const colors = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-pink-500',
]
const lightColors = [
  'bg-indigo-50 text-indigo-600',
  'bg-emerald-50 text-emerald-600',
  'bg-amber-50 text-amber-600',
  'bg-purple-50 text-purple-600',
  'bg-pink-50 text-pink-600',
]

const handleConfirmPreview = () => {
  isPreviewOpen.value = false
  hasPreviewed.value = true
}

const handlePublish = () => {
  if (!isWeightValid.value) {
    return
  }
  if (!hasPreviewed.value) {
    return
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto bg-slate-50/50 pb-20">
    <!-- Sticky Header -->
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-4">
        <el-button circle class="header-back-btn" @click="goBack">
          <ArrowLeft class="h-5 w-5 text-slate-500" />
        </el-button>
        <div>
          <h1 class="text-xl font-black text-slate-900 tracking-tight">考核模板编辑器</h1>
          <div class="flex items-center gap-2 mt-1">
            <el-tag type="warning" effect="dark" round class="status-tag">草稿状态</el-tag>
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Unsaved Changes Detected</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <el-button 
          round 
          class="preview-btn" 
          @click="isPreviewOpen = true"
          :class="{ 'preview-active': hasPreviewed }"
        >
          <div class="flex items-center gap-2">
            <Eye class="h-4 w-4" />
            <span>日报界面预览</span>
          </div>
          <span v-if="!hasPreviewed" class="preview-badge"></span>
        </el-button>
        
        <el-button round class="save-draft-btn">
          <Save class="h-4 w-4 mr-2" />
          保存草稿
        </el-button>

        <el-button 
          type="primary" 
          round 
          @click="handlePublish"
          :disabled="!isWeightValid || !hasPreviewed"
          class="publish-btn"
        >
          <Send class="h-4 w-4 mr-2" />
          正式发布并启用
        </el-button>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 xl:grid-cols-4 gap-8">
      <!-- Main Content -->
      <div class="xl:col-span-3 space-y-8">
        <!-- 1. Basic Info -->
        <el-card shadow="never" class="basic-info-card group">
          <div class="accent-bar"></div>
          <div class="p-6">
            <div class="flex items-center gap-3 mb-8">
              <div class="bg-indigo-600 p-2 rounded-xl text-white">
                <Info class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-lg font-black text-slate-900 tracking-tight">1. 基础映射定义</h3>
                <p class="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Base Template Configuration</p>
              </div>
            </div>

            <el-form label-position="top">
              <el-form-item label="模板名称">
                <template #label>
                  <span class="form-label">模板官方名称</span>
                </template>
                <el-input 
                  v-model="templateInfo.name" 
                  placeholder="例如: 2025年业务一部区域经理月度考核版" 
                  class="custom-el-input-large"
                />
              </el-form-item>

              <el-form-item label="摘要说明" class="mt-4">
                <template #label>
                  <span class="form-label">应用场景摘要说明</span>
                </template>
                <el-input 
                  v-model="templateInfo.description" 
                  type="textarea" 
                  :rows="3" 
                  placeholder="简要描述该绩效考评模板的核心目标与涵盖维度..." 
                  class="custom-el-textarea"
                />
              </el-form-item>

              <div class="grid grid-cols-2 gap-8 mt-4">
                <el-form-item label="考评周期">
                  <template #label>
                    <span class="form-label">标准考核频次</span>
                  </template>
                  <el-select v-model="templateInfo.period" class="w-full custom-el-select-large">
                    <el-option label="按月度考核 (Monthly)" value="month" />
                    <el-option label="按季度考核 (Quarterly)" value="quarter" />
                    <el-option label="按年度考核 (Yearly)" value="year" />
                  </el-select>
                </el-form-item>

                <el-form-item label="适用范围">
                  <template #label>
                    <span class="form-label">适用职能人员范畴</span>
                  </template>
                  <el-select v-model="templateInfo.applyTo" class="w-full custom-el-select-large">
                    <el-option label="全公司通用 (Global)" value="all" />
                    <el-option label="销售部专用 (Sales Only)" value="dept_sales" />
                    <el-option label="职能部专用 (Functional)" value="dept_func" />
                  </el-select>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-card>

        <!-- 2. Indicators -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-2">
            <div class="flex items-center gap-3">
              <div class="bg-indigo-600 p-2 rounded-xl text-white">
                <TrendingUp class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-lg font-black text-slate-900 tracking-tight">2. 考核项权重与计算引擎</h3>
                <p class="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Weight & Scoring Logic</p>
              </div>
            </div>
            <el-button type="primary" round @click="isModalOpen = true" class="add-indicator-btn">
              <Plus class="h-4 w-4 mr-2" />
              挑选考核指标
            </el-button>
          </div>

          <div v-if="indicators.length === 0" class="empty-state group" @click="isModalOpen = true">
             <div class="empty-icon-wrapper group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">
                <Plus class="h-8 w-8" />
             </div>
             <p class="text-slate-400 font-bold italic">当前模板尚未添加任何指标项</p>
             <p class="text-[10px] text-slate-300 font-black uppercase mt-2 tracking-widest">Click to select indicators from library</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="(ind, index) in indicators" 
              :key="ind.id" 
              class="indicator-item-card group"
            >
              <div :class="['absolute left-0 top-0 bottom-0 w-2', colors[index % colors.length]]"></div>

              <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                  <div :class="['indicator-icon-box', lightColors[index % lightColors.length]]">
                    <TrendingUp class="h-7 w-7" />
                  </div>
                  <div>
                    <h4 class="text-xl font-black text-slate-900 tracking-tight">{{ ind.name }}</h4>
                    <div class="flex items-center gap-3 mt-1">
                      <el-tag effect="plain" round class="dimension-tag">{{ ind.dimension }}</el-tag>
                      <div class="scoring-rule-info">
                         <div class="w-1 h-1 rounded-full bg-slate-300"></div>
                         计分制: {{ ind.ruleType }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                   <div class="flex flex-col items-end mr-2">
                      <span class="weight-label">考核权重占比 (Weight)</span>
                      <div class="flex items-center gap-2">
                        <el-input-number v-model="ind.weight" :min="0" :max="100" class="custom-el-input-number" controls-position="right" />
                        <span class="text-lg font-black text-indigo-600">%</span>
                      </div>
                   </div>
                   <el-button circle plain type="danger" @click="removeIndicator(ind.id)" class="remove-btn">
                      <Trash2 class="h-5 w-5" />
                   </el-button>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-11 gap-4 items-stretch relative px-2">
                 <div class="lg:col-span-3 step-input-box group/step">
                    <div class="step-header">
                       <Filter class="h-3 w-3" />
                       1. 数据填报方式 (INPUT)
                    </div>
                    <el-select v-model="ind.dataSourceType" class="w-full custom-el-select-small mb-3">
                       <el-option label="系统接口预置提取" value="api" />
                       <el-option label="员工手动逐日填报" value="manual" />
                    </el-select>
                    
                    <div v-if="ind.dataSourceType === 'manual'" class="animate-fade">
                       <el-input v-model="ind.dataSourceValue" placeholder="请输入填报指引文字..." size="small" class="custom-el-input-small" />
                    </div>
                    <div v-else class="animate-fade">
                       <el-select v-model="ind.dataSourceValue" placeholder="选择接口标识..." size="small" class="w-full custom-el-select-small">
                          <el-option label="ERP实际营业额" value="api_act_sales" />
                          <el-option label="ERP大单品销售额" value="api_act_big_item_sales" />
                          <el-option label="核心财务利润额" value="api_sys_profit" />
                       </el-select>
                    </div>
                 </div>

                 <div class="lg:col-span-1 flex items-center justify-center opacity-20">
                    <ArrowRight class="h-6 w-6 text-slate-400" />
                 </div>

                 <div class="lg:col-span-3 step-target-box group/step flex flex-col justify-between">
                    <div class="step-header-target">
                       <div class="w-1 h-3 bg-indigo-200 rounded-full mr-1"></div>
                       2. 目标基数对比 (TARGET)
                    </div>
                    
                    <div class="flex-1 flex items-center justify-center py-2">
                       <div class="target-compare-box">
                          <div class="target-label-actual">实际汇总数值</div>
                          <div class="target-label-base">设定目标基数</div>
                       </div>
                    </div>
                 </div>

                 <div class="lg:col-span-1 flex items-center justify-center opacity-20">
                    <ArrowRight class="h-6 w-6 text-slate-400" />
                 </div>

                 <div class="lg:col-span-3 step-scoring-box group/step flex flex-col justify-between">
                    <div class="step-header-scoring">
                       <Calculator class="h-3 w-3" />
                       3. 最终绩效考分 (SCORING)
                    </div>
                    
                    <div class="scoring-result-box group-hover:shadow-md transition-all">
                       <span class="scoring-text">{{ ind.ruleType }}</span>
                       <ChevronRight class="h-3 w-3 text-emerald-300 shrink-0" />
                    </div>
                    
                    <p class="scoring-footer-text">
                       基于算法引擎实时转化达成率。
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="xl:col-span-1">
        <div class="sticky top-28 space-y-6">
          <el-card shadow="never" class="analysis-card group">
             <div class="analysis-header relative z-10">
                <h4 class="text-sm font-black text-slate-900 tracking-tight">绩效权重合规分析</h4>
                <el-tag :type="isWeightValid ? 'success' : 'danger'" effect="dark" round class="analysis-tag">
                   总计: {{ totalWeight }}%
                </el-tag>
             </div>

             <div v-if="!isWeightValid" class="weight-warning-box relative z-10 animate-zoom">
                <div class="flex items-center gap-2 text-orange-700 font-black text-xs">
                   <span>⚠️ 指示警告:</span>
                </div>
                <p class="text-[10px] text-orange-600 font-bold leading-relaxed">
                   {{ totalWeight > 100 ? `权重超标 ${totalWeight - 100}%` : `权重不足 100% (还差 ${100 - totalWeight}%)` }}。请调整数值，合规后方可发布。
                </p>
             </div>

             <div class="space-y-6 relative z-10">
                <div class="weight-progress-bar shadow-inner">
                   <div 
                     v-for="(ind, i) in indicators" 
                     :key="ind.id"
                     :style="{ width: `${(ind.weight / Math.max(100, totalWeight)) * 100}%` }"
                     :class="[colors[i % colors.length], 'h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full hover:opacity-80 cursor-pointer']"
                     :title="`${ind.name}: ${ind.weight}%`"
                   />
                </div>

                <div class="weight-list-container custom-scrollbar pr-2">
                   <div v-for="(ind, i) in indicators" :key="ind.id" class="weight-list-item group/item hover:bg-slate-50 transition-all">
                      <div class="flex items-center gap-2 max-w-[80%]">
                         <div :class="['w-2 h-2 rounded-full shrink-0', colors[i % colors.length]]"></div>
                         <span class="weight-item-name">{{ i + 1 }}. {{ ind.name }}</span>
                      </div>
                      <span class="weight-item-value group-hover:scale-110 transition-transform">{{ ind.weight }}%</span>
                   </div>
                </div>
             </div>
             
             <div class="watermark-icon rotate-12">
                <Calculator class="h-40 w-40 text-slate-900" />
             </div>
          </el-card>

          <div class="design-notice-box">
             <div class="flex items-center gap-3 mb-3">
                <div class="design-notice-icon-box">
                   <Info class="h-3 w-3" />
                </div>
                <span class="design-notice-title">设计规范提醒</span>
             </div>
             <p class="design-notice-text">
                所有的打分逻辑均需通过接口自动汇聚或员工确认日报填报生成。发布后将直接应用至考评周期。
             </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
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

<style scoped>
/* Page Specific Customization - Standard CSS to avoid Tailwind v4 compile errors with @apply */
.header-back-btn {
  border: none !important;
  background-color: transparent !important;
}
.header-back-btn:hover {
  background-color: #f1f5f9 !important;
}

.status-tag {
  font-size: 9px !important;
  font-weight: 900 !important;
  height: 1rem !important;
  padding: 0 0.5rem !important;
  text-transform: uppercase;
}

.preview-btn {
  font-weight: 900 !important;
  background-color: white !important;
  color: #64748b !important;
  position: relative;
}
.preview-active {
  color: #4f46e5 !important;
  border-color: #eef2ff !important;
}
.preview-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  display: flex;
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 9999px;
  background-color: #ef4444;
  border: 2px solid white;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.save-draft-btn {
  background-color: white !important;
  font-weight: 900 !important;
  color: #475569 !important;
  border-color: #e2e8f0 !important;
}

.publish-btn {
  padding: 0 2rem !important;
  font-weight: 900 !important;
  height: 2.75rem !important;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.1);
  transition: all 0.3s;
}
.publish-btn:active {
  transform: scale(0.98);
}

.basic-info-card {
  border-color: #e2e8f0 !important;
  border-radius: 32px !important;
  background-color: white !important;
  overflow: visible !important;
  position: relative;
}
.accent-bar {
  position: absolute;
  left: -0.75rem;
  top: 2rem;
  width: 0.375rem;
  height: 3rem;
  background-color: #4f46e5;
  border-radius: 9999px;
  opacity: 0;
  transition: opacity 0.3s;
}
.basic-info-card:hover .accent-bar {
  opacity: 1;
}

.form-label {
  font-weight: 900;
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.add-indicator-btn {
  padding: 0 1.5rem !important;
  font-weight: 900 !important;
  height: 2.5rem !important;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.1);
}

.empty-state {
  background-color: white;
  border: 2px dashed #e2e8f0;
  border-radius: 32px;
  padding: 5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}
.empty-state:active {
  transform: scale(0.99);
}
.empty-icon-wrapper {
  width: 4rem;
  height: 4rem;
  background-color: #f8fafc;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #cbd5e1;
}

.indicator-item-card {
  position: relative;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 32px;
  overflow: hidden;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}
.indicator-item-card:hover {
  border-color: #c7d2fe;
}

.indicator-icon-box {
  height: 3.5rem;
  width: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10px 15px -3px rgba(241, 245, 249, 1);
}

.dimension-tag {
  font-size: 10px !important;
  font-weight: 900 !important;
  background-color: #f8fafc !important;
  height: 1.25rem !important;
  padding: 0 0.5rem !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.scoring-rule-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 10px;
  font-weight: 900;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.weight-label {
  font-size: 10px;
  font-weight: 900;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.375rem;
}

.remove-btn {
  border: none !important;
  padding: 0.625rem !important;
  background-color: #fef2f2 !important;
  color: #ef4444 !important;
  transition: background-color 0.3s;
}
.remove-btn:hover {
  background-color: #fee2e2 !important;
}

.step-input-box {
  background-color: rgba(248, 250, 252, 0.8);
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid #f1f5f9;
  position: relative;
  transition: all 0.3s;
}
.step-input-box:active {
  transform: scale(0.98);
}
.step-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 9px;
  font-weight: 900;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.step-target-box {
  background-color: rgba(238, 242, 255, 0.5);
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid #e0e7ff;
}
.step-header-target {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 9px;
  font-weight: 900;
  color: #818cf8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}
.target-compare-box {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid #e0e7ff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 0.75rem;
  border-radius: 0.75rem;
  width: 100%;
  text-align: center;
}
.target-label-actual {
  font-size: 10px;
  font-weight: 900;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid #eef2ff;
  padding-bottom: 0.25rem;
}
.target-label-base {
  font-size: 10px;
  font-weight: 900;
  color: #4f46e5;
  text-transform: uppercase;
  padding-top: 0.25rem;
}

.step-scoring-box {
  background-color: rgba(209, 250, 229, 0.5);
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid #d1fae5;
}
.step-header-scoring {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 9px;
  font-weight: 900;
  color: #059669;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}
.scoring-result-box {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #d1fae5;
  padding: 0.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.scoring-text {
  font-size: 11px;
  font-weight: 900;
  color: #065f46;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 0.5rem;
}
.scoring-footer-text {
  font-size: 9px;
  color: #94a3b8;
  font-weight: 700;
  font-style: italic;
  margin-top: 0.75rem;
  line-height: 1.625;
}

.analysis-card {
  border-color: #e2e8f0 !important;
  border-radius: 32px !important;
  background-color: white !important;
  overflow: hidden !important;
  position: relative;
  padding: 1.5rem !important;
}
.analysis-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f8fafc;
}
.analysis-tag {
  font-weight: 900 !important;
  font-size: 10px !important;
  height: 1.5rem !important;
  padding: 0 0.75rem !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.weight-warning-box {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #fff7ed;
  border: 1px solid #ffedd5;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.weight-progress-bar {
  height: 0.75rem;
  width: 100%;
  background-color: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
  display: flex;
}
.weight-list-container {
  max-height: 320px;
  overflow-y: auto;
}
.weight-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.75rem;
}
.weight-item-name {
  font-size: 11px;
  font-weight: 900;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.025em;
}
.weight-item-value {
  font-size: 11px;
  font-weight: 900;
  color: #4f46e5;
}

.watermark-icon {
  position: absolute;
  right: -2rem;
  bottom: -2rem;
  opacity: 0.03;
  pointer-events: none;
}

.design-notice-box {
  background-color: rgba(79, 70, 229, 0.05);
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(79, 70, 229, 0.1);
}
.design-notice-icon-box {
  background-color: #4f46e5;
  color: white;
  padding: 0.25rem;
  border-radius: 0.5rem;
}
.design-notice-title {
  font-size: 10px;
  font-weight: 900;
  color: #4338ca;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.design-notice-text {
  font-size: 10px;
  color: #6366f1;
  font-weight: 700;
  line-height: 1.625;
  font-style: italic;
}

/* Scrollbar Customization */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 9999px;
}

/* Element Plus Global Overrides inside SFC */
:deep(.custom-el-input-large .el-input__wrapper) {
  border-radius: 1rem !important;
  background-color: #f8fafc !important;
  box-shadow: none !important;
  border: 2px solid transparent !important;
  height: 3.5rem !important;
  padding: 0 1.5rem !important;
  transition: all 0.3s;
}
:deep(.custom-el-input-large .el-input__wrapper.is-focus) {
  background-color: white !important;
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 8px rgba(238, 242, 255, 0.5) !important;
}
:deep(.custom-el-input-large .el-input__inner) {
  font-weight: 900 !important;
  color: #0f172a !important;
  font-size: 1rem !important;
}

:deep(.custom-el-textarea .el-textarea__inner) {
  border-radius: 24px !important;
  background-color: #f8fafc !important;
  box-shadow: none !important;
  border: 2px solid transparent !important;
  padding: 1.5rem !important;
  font-weight: 700 !important;
  font-size: 0.875rem !important;
  transition: all 0.3s;
}
:deep(.custom-el-textarea .el-textarea__inner:focus) {
  background-color: white !important;
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 8px rgba(238, 242, 255, 0.5) !important;
}

:deep(.custom-el-select-large .el-select__wrapper) {
  border-radius: 1rem !important;
  background-color: #f8fafc !important;
  box-shadow: none !important;
  border: 2px solid transparent !important;
  height: 3.5rem !important;
  padding: 0 1.5rem !important;
  transition: all 0.3s;
}
:deep(.custom-el-select-large .el-select__wrapper.is-focused) {
  background-color: white !important;
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 8px rgba(238, 242, 255, 0.5) !important;
}

:deep(.custom-el-input-number) {
  width: 100px !important;
}
:deep(.custom-el-input-number .el-input__wrapper) {
  border-radius: 0.75rem !important;
  background-color: #f8fafc !important;
  box-shadow: none !important;
  border: none !important;
  height: 2.75rem !important;
}
:deep(.custom-el-input-number .el-input__inner) {
  font-weight: 900 !important;
  font-size: 1rem !important;
}

:deep(.custom-el-select-small .el-select__wrapper) {
  border-radius: 0.75rem !important;
  background-color: white !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #e2e8f0 !important;
  height: 2.5rem !important;
  padding: 0 0.75rem !important;
}
:deep(.custom-el-select-small .el-select__wrapper.is-focused) {
  border-color: #818cf8 !important;
}
:deep(.custom-el-select-small .el-select__placeholder) {
  font-size: 11px !important;
  font-weight: 700 !important;
  color: #475569 !important;
}

:deep(.custom-el-input-small .el-input__wrapper) {
  border-radius: 0.75rem !important;
  background-color: white !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #e2e8f0 !important;
  height: 2.5rem !important;
}

/* Animations using standard CSS */
.animate-zoom {
  animation: zoomIn 0.3s ease-out;
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
