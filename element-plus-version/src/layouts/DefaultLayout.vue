<script setup lang="ts">
import { ref } from 'vue'
import {
  Settings,
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Smartphone,
} from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isCollapsed = ref(false)

const menuItems = [
  { name: '工作日报', path: '/daily-report', icon: ClipboardList },
  { name: '日报 (H5预览)', path: '/daily-report/h5', icon: Smartphone },
  { name: '绩效配置中心', path: '/configuration', icon: Settings },
  { name: '考核周期管理', path: '/assessment/cycle', icon: CalendarDays },
  { name: '绩效工作台', path: '/assessment/hall', icon: LayoutDashboard },
]
</script>

<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-30',
        isCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      <div class="p-6 flex items-center gap-3 shrink-0">
        <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
          <ClipboardList class="text-white h-5 w-5" />
        </div>
        <span v-if="!isCollapsed" class="font-black text-lg tracking-tight text-slate-900 truncate">绩效考核系统</span>
      </div>

      <nav class="flex-1 px-3 space-y-1">
        <div 
          v-for="item in menuItems" 
          :key="item.path"
          @click="router.push(item.path)"
          :class="[
            'flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all font-bold text-sm group',
            route.path === item.path 
              ? 'bg-indigo-50 text-indigo-600' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <component :is="item.icon" :class="['h-5 w-5 shrink-0', route.path === item.path ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600']" />
          <span v-if="!isCollapsed" class="truncate">{{ item.name }}</span>
        </div>
      </nav>

      <div class="p-4 border-t border-slate-100 italic text-[10px] text-slate-400 text-center uppercase tracking-widest font-black">
        {{ isCollapsed ? 'V1' : 'EP Version 1.0' }}
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 flex flex-col overflow-hidden relative">
      <router-view></router-view>
    </main>
  </div>
</template>
