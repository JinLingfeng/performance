<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Settings2,
  TrendingUp,
  Package,
  Users,
  Activity,
  BarChart3,
  Clock,
  Wallet,
} from 'lucide-vue-next'

export interface IndicatorData {
  id: string
  name: string
  dimension: string
  ruleType: string
  ruleDesc: string
  ruleCode?: string
  mapField?: string
  period?: string
}

const props = defineProps<{
  data: IndicatorData
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const getDimensionIcon = (dimension: string) => {
  switch (dimension) {
    case '销售业绩':
      return TrendingUp
    case '产品力':
      return Package
    case '市场指标':
      return Activity
    case '渠道力':
      return BarChart3
    case '费用管理':
      return Wallet
    case '组织力':
      return Users
    case '行动计划':
      return Clock
    default:
      return Settings2
  }
}

const getDimensionColor = (dimension: string) => {
  switch (dimension) {
    case '销售业绩':
      return 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
    case '产品力':
      return 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'
    case '市场指标':
      return 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
    case '渠道力':
      return 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'
    case '费用管理':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
    case '组织力':
      return 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100'
    case '行动计划':
      return 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:bg-cyan-100'
    default:
      return 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
  }
}
</script>

<template>
  <Card
    class="group relative cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-slate-200 hover:border-blue-300 overflow-hidden"
    @click="emit('click')"
  >
    <div class="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-blue-500 transition-colors duration-300"></div>
    <CardHeader class="pb-1 px-3 pt-3 flex flex-col items-start gap-1.5">
      <Badge
        variant="outline"
        :class="['font-normal px-2 py-0 text-[10px]', getDimensionColor(data.dimension)]"
      >
        <component :is="getDimensionIcon(data.dimension)" class="w-3 h-3 mr-1" />
        {{ data.dimension }}
      </Badge>
      <CardTitle
        class="text-sm font-semibold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2"
        :title="data.name"
      >
        {{ data.name }}
      </CardTitle>
    </CardHeader>
    <CardContent class="px-3 pb-3">
      <div class="flex items-center gap-1.5 mb-1">
        <Settings2 class="h-3 w-3 text-slate-400 shrink-0" />
        <span class="text-xs font-medium text-slate-600 truncate">{{ data.ruleType }}</span>
      </div>
      <p
        class="text-[11px] text-slate-500 italic leading-snug line-clamp-2"
        :title="data.ruleDesc"
      >
        {{ data.ruleDesc }}
      </p>
    </CardContent>
  </Card>
</template>
