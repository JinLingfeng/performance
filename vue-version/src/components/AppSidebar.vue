<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  Settings,
  Target,
  CalendarDays,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const items = [
  {
    title: '绩效配置中心',
    url: '/configuration',
    icon: Settings,
  },
  {
    title: '绩效工作台',
    url: '/assessment/hall',
    icon: Target,
  },
  {
    title: '考核周期与发起',
    url: '/assessment/cycle',
    icon: CalendarDays,
  },
]
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel class="text-sm font-semibold text-primary">卓希集团绩效管理</SidebarGroupLabel>
        <SidebarGroupContent class="mt-2">
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton as-child :tooltip="item.title">
                <RouterLink :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
