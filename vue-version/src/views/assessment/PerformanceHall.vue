<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  LayoutDashboard,
  Target,
  Award,
  UserCircle,
  CalendarDays,
  Lock,
  Unlock,
} from 'lucide-vue-next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import MyAssessmentWorkspace from '@/components/assessment/MyAssessmentWorkspace.vue'
import TeamGoalWorkspace from '@/components/assessment/TeamGoalWorkspace.vue'
import RatingWorkspace from '@/components/assessment/RatingWorkspace.vue'

// ---------- Mock Business Logic ----------
// Current cycle state (simulated)
const currentCycle = {
  id: 'cycle-2026-03',
  title: '2026年3月份初级销售KPI',
  phase: 'rating', // goal_setting | rating | finished | public_公示
  expireDate: '2026-03-07',
}

// User role (simulated as 'manager' by default)
const userRole = ref<'employee' | 'manager'>('manager')

// Navigation state
const activeTab = ref('my_performance')

// Phase status UI mapping
const phaseInfo = computed(() => {
  switch (currentCycle.phase) {
    case 'goal_setting':
      return {
        label: '目标设定中',
        color: 'bg-blue-500',
        description: '当前正在为下属设定本期指标。',
      }
    case 'rating':
      return {
        label: '考评打分中',
        color: 'bg-amber-500',
        description: '各级主管正根据业绩表现进行闭案评分。',
      }
    case 'public_公示':
      return {
        label: '成绩公示中',
        color: 'bg-purple-500',
        description: '评分已完成，正处于异议复核期。',
      }
    case 'finished':
      return {
        label: '已归档',
        color: 'bg-emerald-500',
        description: '本考核周期已正式结束。',
      }
    default:
      return { label: '未开始', color: 'bg-slate-400', description: '等待周期开启。' }
  }
})

// Locking logic for different workspaces
const isGoalSettingLocked = computed(() => currentCycle.phase !== 'goal_setting')
const isRatingLocked = computed(() => currentCycle.phase !== 'rating')
</script>

<template>
  <div class="h-screen flex flex-col bg-slate-50/50 overflow-hidden">
    <!-- Top Header Navigation / Breadcrumb replacement for more space -->
    <header class="bg-white border-b border-slate-200 px-8 py-3 shrink-0 shadow-sm z-20">
      <div class="flex items-center justify-between max-w-full mx-auto">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <div class="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
               <LayoutDashboard class="h-5 w-5 text-white" />
            </div>
            <div>
               <h1 class="text-xl font-extrabold text-slate-900 leading-none">绩效工作台</h1>
               <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Performance Hall</p>
            </div>
          </div>
          
          <div class="h-8 w-px bg-slate-200 hidden md:block"></div>

          <!-- Current Cycle Quick Info -->
          <div class="hidden lg:flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
             <CalendarDays class="h-4 w-4 text-slate-400" />
             <div class="flex flex-col">
                <span class="text-xs font-bold text-slate-700 leading-none">{{ currentCycle.title }}</span>
                <span class="text-[9px] text-slate-400 mt-1">截止时间: {{ currentCycle.expireDate }}</span>
             </div>
             <Badge :class="[phaseInfo.color, 'text-white border-none px-2 h-5 rounded-md font-bold text-[10px] ml-2']">
                {{ phaseInfo.label }}
             </Badge>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <template v-if="activeTab === 'team_rating' && !isRatingLocked">
             <div class="flex items-center gap-5 mr-1">
               <div class="flex flex-col items-end pt-1">
                 <div class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                   <span>评分进度: <span class="text-indigo-600">2</span>/5 (40%)</span>
                   <div class="w-1.5 h-1.5 rounded-full bg-slate-200 hidden sm:block"></div>
                   <span class="hidden sm:inline">剩余时间: <span class="text-slate-700">14:22:05</span></span>
                 </div>
                 <div class="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner hidden sm:block">
                    <div class="h-full bg-indigo-600 w-[40%] transition-all"></div>
                 </div>
               </div>
               <Button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 h-9 rounded-[10px] shadow-sm shadow-indigo-100 text-xs font-bold transition-all">
                  全部提交
               </Button>
             </div>
          </template>
        </div>
      </div>
    </header>

    <!-- Main Tabs -->
    <Tabs v-model="activeTab" class="flex-1 flex flex-col overflow-hidden">
      <div class="bg-white border-b border-slate-200 px-8 py-0 shrink-0 z-10">
        <TabsList class="bg-transparent h-14 p-0 flex gap-10">
          <TabsTrigger 
            value="my_performance" 
            class="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-indigo-600 data-[state=active]:border-b-4 data-[state=active]:border-indigo-600 rounded-none h-full bg-transparent px-0 font-black text-slate-500 border-b-4 border-transparent transition-all gap-2"
          >
            <UserCircle class="h-5 w-5" />
            我的绩效
          </TabsTrigger>
          
          <template v-if="userRole === 'manager'">
            <TabsTrigger 
              value="team_goals" 
              class="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-indigo-600 data-[state=active]:border-b-4 data-[state=active]:border-indigo-600 rounded-none h-full bg-transparent px-0 font-black text-slate-400 border-b-4 border-transparent transition-all gap-2 relative group"
            >
              <Target :class="['h-5 w-5', isGoalSettingLocked ? 'text-slate-300' : 'text-slate-400 group-data-[state=active]:text-indigo-600']" />
              <span :class="isGoalSettingLocked ? 'text-slate-300' : 'text-slate-500 group-data-[state=active]:text-indigo-600'">团队目标设定</span>
              <Lock v-if="isGoalSettingLocked" class="h-3.5 w-3.5 absolute -right-5 top-[18px] text-slate-300 fill-slate-50/50" />
            </TabsTrigger>
            
            <TabsTrigger 
              value="team_rating" 
              class="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-indigo-600 data-[state=active]:border-b-4 data-[state=active]:border-indigo-600 rounded-none h-full bg-transparent px-0 font-black text-slate-400 border-b-4 border-transparent transition-all gap-2 relative group"
            >
              <Award :class="['h-5 w-5', isRatingLocked ? 'text-slate-300' : 'text-slate-400 group-data-[state=active]:text-indigo-600']" />
              <span :class="isRatingLocked ? 'text-slate-300' : 'text-slate-500 group-data-[state=active]:text-indigo-600'">团队绩效评价</span>
              <Lock v-if="isRatingLocked" class="h-3.5 w-3.5 absolute -right-5 top-[18px] text-slate-300 fill-slate-50/50" />
            </TabsTrigger>
          </template>
        </TabsList>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-hidden relative">
        <TabsContent value="my_performance" class="h-full m-0 p-0 overflow-hidden outline-none">
          <MyAssessmentWorkspace />
        </TabsContent>

        <TabsContent value="team_goals" class="h-full m-0 p-0 overflow-hidden outline-none">
          <TeamGoalWorkspace :is-locked="isGoalSettingLocked" />
        </TabsContent>

        <TabsContent value="team_rating" class="h-full m-0 p-0 overflow-y-auto overflow-x-hidden custom-scrollbar outline-none">
          <RatingWorkspace :is-locked="isRatingLocked" />
        </TabsContent>

        <!-- Floating Phase Status Notification -->
        <transition 
          enter-active-class="transform transition ease-out duration-500" 
          enter-from-class="translate-y-10 opacity-0" 
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition ease-in duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div 
            v-if="activeTab !== 'my_performance' && (activeTab === 'team_goals' ? isGoalSettingLocked : isRatingLocked)"
            class="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div class="bg-blue-600/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-blue-400/50">
               <div class="bg-blue-400 p-1.5 rounded-lg">
                  <Unlock class="h-4 w-4" />
               </div>
               <div class="flex flex-col pr-4">
                  <span class="text-xs font-black uppercase tracking-widest text-blue-100">只读模式开启</span>
                  <span class="text-sm font-medium">当前周期处于<b>{{ phaseInfo.label }}</b>，禁止修改操作。</span>
               </div>
            </div>
          </div>
        </transition>
      </div>
    </Tabs>
  </div>
</template>

<style scoped>
/* Ensure the hall takes full height below the breadcrumb/header of main layout */
.h-screen {
  height: calc(100vh - 0px); /* Adjust if parent padding exists */
}
</style>
