<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, FileEdit, Trash2, PowerOff, Power, MoreHorizontal } from 'lucide-vue-next'

const router = useRouter()

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

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'published':
      return { text: '生效中', type: 'success' }
    case 'draft':
      return { text: '草稿', type: 'warning' }
    case 'disabled':
      return { text: '已停用', type: 'info' }
    default:
      return { text: status, type: '' }
  }
}

const handleEdit = (id: string) => {
  router.push(`/template/builder?id=${id}`)
}

const handleCreate = () => {
  router.push('/template/builder')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-black tracking-tight text-slate-900 border-l-4 border-indigo-600 pl-3">考核模板管理</h2>
        <p class="text-xs text-slate-400 font-bold mt-1 pl-4 uppercase tracking-widest">
          Template Logic Designer
        </p>
      </div>

      <div class="flex items-center gap-3">
        <el-input
          v-model="search"
          placeholder="搜索模板名称或编号..."
          class="!w-64 custom-el-input"
          clearable
        >
          <template #prefix>
            <Search class="h-4 w-4 text-slate-400" />
          </template>
        </el-input>

        <el-button type="primary" round @click="handleCreate" class="!px-6 !font-black !h-10 shadow-lg shadow-indigo-100">
          <Plus class="mr-1.5 h-4 w-4" />
          新建考核模板
        </el-button>
      </div>
    </div>

    <el-card shadow="never" class="!border-slate-200 !rounded-3xl !bg-white/50 !backdrop-blur-sm overflow-hidden">
      <el-table :data="filteredTemplates" class="custom-el-table" style="width: 100%">
        <el-table-column label="模板信息" min-width="280">
          <template #default="{ row }">
            <div class="flex flex-col py-1">
              <span class="font-black text-slate-800 text-sm line-clamp-1 mb-0.5">{{ row.name }}</span>
              <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">{{ row.id }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="摘要说明" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="text-xs text-slate-500 font-medium">{{ row.description || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="指标/权重" width="120" align="center">
          <template #default="{ row }">
            <div class="flex flex-col items-center">
              <span class="text-xs font-black text-slate-700">{{ row.indicatorCount }} 个指标</span>
              <span :class="[
                'text-[10px] font-black underline decoration-2 underline-offset-2',
                row.totalWeightStr === '100%' ? 'text-emerald-500 decoration-emerald-100' : 'text-amber-500 decoration-amber-100'
              ]">
                权重 {{ row.totalWeightStr }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="当前状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusInfo(row.status).type as any" effect="plain" round class="!font-black !text-[10px]">
              {{ getStatusInfo(row.status).text }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="最后修改" width="150" align="right">
          <template #default="{ row }">
            <span class="text-[10px] text-slate-400 font-black">{{ row.updatedAt }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80" align="right">
          <template #default="{ row }">
            <el-dropdown trigger="click">
              <el-button circle class="!border-none !bg-transparent hover:!bg-slate-100 !p-2">
                <MoreHorizontal class="h-4 w-4 text-slate-400" />
              </el-button>
              <template #content>
                <el-dropdown-menu class="custom-el-dropdown-menu">
                  <el-dropdown-item @click="handleEdit(row.id)">
                    <div class="flex items-center gap-2 font-bold text-xs text-indigo-600">
                      <FileEdit class="h-3.5 w-3.5" />
                      编辑模板配置
                    </div>
                  </el-dropdown-item>
                  <el-button v-if="row.status === 'published'" link class="w-full">
                    <el-dropdown-item>
                      <div class="flex items-center gap-2 font-bold text-xs text-amber-600">
                        <PowerOff class="h-3.5 w-3.5" />
                        暂停使用
                      </div>
                    </el-dropdown-item>
                  </el-button>
                  <el-button v-else link class="w-full">
                    <el-dropdown-item>
                      <div class="flex items-center gap-2 font-bold text-xs text-emerald-600">
                        <Power class="h-3.5 w-3.5" />
                        发布启用
                      </div>
                    </el-dropdown-item>
                  </el-button>
                  <el-dropdown-item divided>
                    <div class="flex items-center gap-2 font-bold text-xs text-red-500">
                      <Trash2 class="h-3.5 w-3.5" />
                      删除草稿
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.custom-el-input .el-input__wrapper) {
  border-radius: 0.75rem !important;
  background-color: white !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
}
:deep(.custom-el-input .el-input__wrapper.is-focus) {
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 4px rgba(238, 242, 255, 0.5) !important;
}

:deep(.custom-el-table) {
  background-color: transparent !important;
  --el-table-border-color: #f1f5f9;
  --el-table-header-bg-color: #f8fafc;
}
:deep(.custom-el-table th.el-table__cell) {
  font-weight: 900 !important;
  color: #94a3b8 !important;
  font-size: 10px !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-top: 1rem !important;
  padding-bottom: 0.75rem !important;
}
:deep(.custom-el-table td.el-table__cell) {
  border-bottom: 1px solid rgba(241, 245, 249, 0.6) !important;
}

.custom-el-dropdown-menu {
  border-radius: 1rem !important;
  padding: 0.5rem !important;
  border: none !important;
  box-shadow: 0 25px 50px -12px rgba(226, 232, 240, 1) !important;
}
</style>
