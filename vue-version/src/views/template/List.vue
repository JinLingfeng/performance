<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus, Search, FileEdit, Trash2, PowerOff, Power, MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock data for initial templates
const mockTemplates = [
  {
    id: 'TPL-2025-001',
    name: '【休食-省级业务员】2025年绩效考核模板',
    description: '适用于休闲食品事业部所有省级业务员的月度考评标准。',
    indicatorCount: 5,
    totalWeightStr: '100%',
    status: 'published', // draft, published, disabled
    updatedAt: '2025-04-12 14:30',
  },
  {
    id: 'TPL-2025-002',
    name: '【大客-KA经理】2025年绩效考核模板',
    description: '针对KA渠道的拓客难度增加的主观与客观评价体系。',
    indicatorCount: 8,
    totalWeightStr: '100%',
    status: 'published',
    updatedAt: '2025-03-22 09:15',
  },
  {
    id: 'TPL-2026-003',
    name: '【餐饮-省级业务员】2026年绩效考核模板',
    description: '2026年新版省级业务员考核草稿。',
    indicatorCount: 3,
    totalWeightStr: '80%', // Weight not up to 100%
    status: 'draft',
    updatedAt: '2025-10-18 16:45',
  },
  {
    id: 'TPL-2026-004',
    name: 'IT部门2026年绩效考核模板',
    description: '针对IT部门研发与支持人员的考核体系。',
    indicatorCount: 4,
    totalWeightStr: '100%',
    status: 'draft',
    updatedAt: '2025-11-01 10:00',
  },
  {
    id: 'TPL-2026-005',
    name: '销售总监绩效考核模板',
    description: '核心管理层业绩对赌通用模板。',
    indicatorCount: 6,
    totalWeightStr: '100%',
    status: 'published',
    updatedAt: '2025-12-11 11:20',
  },
  {
    id: 'TPL-2024-099',
    name: '[历史] 2024年度销售专员年底考核项',
    description: '2024年的旧版考核规则，已废弃停用。',
    indicatorCount: 4,
    totalWeightStr: '100%',
    status: 'disabled',
    updatedAt: '2024-12-30 18:00',
  },
]

const search = ref('')
const templates = ref(mockTemplates)

const filteredTemplates = computed(() => {
  return templates.value.filter(
    (t) => t.name.includes(search.value) || t.id.includes(search.value)
  )
})

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'published':
      return { text: '生效中 (已发布)', class: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 font-normal' }
    case 'draft':
      return { text: '草稿中', class: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 font-normal' }
    case 'disabled':
      return { text: '已禁用', class: 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 font-normal' }
    default:
      return { text: status, class: '' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">考核模板管理</h1>
        <p class="text-sm text-slate-500 mt-1">
          基于指标元数据库搭建面向不同组织、不同岗位的绩效自动计算模板。
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative w-full md:w-64">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="搜索模板名称或编号..."
            class="pl-9 bg-white"
            v-model="search"
          />
        </div>
        <RouterLink to="/template/builder">
          <Button class="shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus class="mr-1.5 h-4 w-4" />
            <span>新建考核模板</span>
          </Button>
        </RouterLink>
      </div>
    </div>

    <Card class="border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader class="bg-slate-50/50">
          <TableRow>
            <TableHead class="w-[300px]">模板名称 & 编号</TableHead>
            <TableHead>说明摘要</TableHead>
            <TableHead class="text-center">指标个数</TableHead>
            <TableHead class="text-center">权重分配</TableHead>
            <TableHead class="text-center">当前状态</TableHead>
            <TableHead class="text-right">最后修改时间</TableHead>
            <TableHead class="w-[80px] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="template in filteredTemplates"
            :key="template.id"
            class="hover:bg-slate-50/50 transition-colors"
          >
            <TableCell>
              <div class="flex flex-col">
                <span class="font-semibold text-slate-800 line-clamp-1" :title="template.name">
                  {{ template.name }}
                </span>
                <span class="text-xs text-slate-400 font-medium mt-0.5">{{ template.id }}</span>
              </div>
            </TableCell>
            <TableCell>
              <span class="text-sm text-slate-600 line-clamp-1" :title="template.description">
                {{ template.description || '-' }}
              </span>
            </TableCell>
            <TableCell class="text-center">
              <span
                class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-semibold text-slate-700"
              >
                {{ template.indicatorCount }}
              </span>
            </TableCell>
            <TableCell class="text-center">
              <span
                :class="[
                  'text-sm font-medium',
                  template.totalWeightStr === '100%' ? 'text-emerald-600' : 'text-amber-500',
                ]"
              >
                {{ template.totalWeightStr }}
              </span>
              <p
                v-if="template.totalWeightStr !== '100%'"
                class="text-[10px] text-amber-500/80 leading-none mt-1"
              >
                需调整为100%
              </p>
            </TableCell>
            <TableCell class="text-center">
              <Badge :class="getStatusBadge(template.status).class">
                {{ getStatusBadge(template.status).text }}
              </Badge>
            </TableCell>
            <TableCell class="text-right text-sm text-slate-500">
              {{ template.updatedAt }}
            </TableCell>
            <TableCell class="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" class="h-8 w-8 p-0">
                    <span class="sr-only">打开菜单</span>
                    <MoreHorizontal class="h-4 w-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-[160px]">
                  <RouterLink :to="`/template/builder?id=${template.id}`">
                    <DropdownMenuItem class="cursor-pointer">
                      <FileEdit class="mr-2 h-4 w-4 text-blue-600" />
                      <span class="text-slate-700">编辑模板配置</span>
                    </DropdownMenuItem>
                  </RouterLink>
                  <DropdownMenuItem v-if="template.status === 'published'" class="cursor-pointer">
                    <PowerOff class="mr-2 h-4 w-4 text-amber-600" />
                    <span class="text-slate-700">暂停/停用</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem v-else class="cursor-pointer">
                    <Power class="mr-2 h-4 w-4 text-emerald-600" />
                    <span class="text-slate-700">发布启用</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem class="cursor-pointer focus:bg-red-50">
                    <Trash2 class="mr-2 h-4 w-4 text-red-600" />
                    <span class="text-red-600">删除草稿</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          <TableRow v-if="filteredTemplates.length === 0">
            <TableCell colSpan="7" class="h-24 text-center text-slate-500">
              未找到匹配的模板
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>
