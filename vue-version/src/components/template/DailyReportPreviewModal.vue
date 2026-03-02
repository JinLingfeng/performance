<script setup lang="ts">
import { computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Database } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  indicators: any[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
  (e: 'update:isOpen', value: boolean): void
}>()

const internalOpen = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val),
})

const getMockValues = (i: number) => {
  const mockAchieved = i === 0 ? 24500 : i === 2 ? 1 : 450
  const mockTarget = i === 0 ? 50000 : i === 2 ? 0 : 500
  const progressPercent = Math.min(
    100,
    Math.max(0, (mockAchieved / (mockTarget || 1)) * 100)
  )
  return { mockAchieved, mockTarget, progressPercent }
}
</script>

<template>
  <Dialog v-model:open="internalOpen">
    <DialogContent class="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>员工日报填报预览</DialogTitle>
        <DialogDescription>
          以下是根据您当前模板配置，员工在提交每日日志时看到的待办数据呈现。
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="h-[500px] mt-2 rounded-md border p-6 bg-slate-50/50">
        <div class="space-y-6">
          <!-- Fake Context Header -->
          <div class="flex justify-between items-center pb-2 border-b border-slate-200">
            <span class="text-sm font-semibold text-slate-800">2026年3月15日 日报</span>
            <Badge variant="outline" class="bg-blue-50 text-blue-600">待提交</Badge>
          </div>

          <div v-if="indicators.length === 0" class="text-center py-10 text-xs text-slate-400">
            模板当前没有任何指标
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(ind, i) in indicators"
              :key="ind.id"
              class="bg-white border md:p-5 p-4 rounded-xl shadow-sm space-y-4"
            >
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <Label class="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FileText v-if="ind.dataSourceType === 'manual'" class="h-4 w-4 text-emerald-500" />
                  <Database v-else class="h-4 w-4 text-blue-500" />
                  {{ ind.name }}
                </Label>
                <Badge
                  v-if="ind.dataSourceType !== 'manual'"
                  variant="secondary"
                  class="bg-blue-50 text-blue-600 border-blue-200 font-normal shadow-sm"
                >
                  系统自动提取
                </Badge>
              </div>

              <div v-if="ind.dataSourceType === 'manual'" class="space-y-2">
                <p
                  class="text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded-md border border-slate-100"
                >
                  <span class="text-emerald-600 mr-1">📝 填报指引:</span>
                  {{ ind.dataSourceValue || '请输入今日完成数量...' }}
                </p>
                <div class="relative pt-1">
                  <Input
                    type="number"
                    placeholder="填写今日实际完成数值"
                    class="bg-white border-slate-300 shadow-sm focus-visible:ring-emerald-500"
                  />
                </div>
              </div>
              <div v-else class="bg-slate-50/50 rounded-lg p-3">
                <div class="flex justify-between items-end mb-2">
                  <div>
                    <p class="text-[11px] text-slate-500 mb-1 font-medium">
                      今日当前累计 ({{ ind.dataSourceValue }})
                    </p>
                    <div class="flex items-baseline gap-2">
                      <span
                        class="text-2xl font-bold text-slate-800 font-mono tracking-tight"
                      >
                        {{ getMockValues(i).mockAchieved.toLocaleString() }}
                      </span>
                      <span class="text-xs text-slate-400 font-mono">
                        / {{ getMockValues(i).mockTarget.toLocaleString() }} (目标)
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-lg font-bold text-blue-600 font-mono">
                      {{ getMockValues(i).progressPercent.toFixed(1) }}%
                    </span>
                  </div>
                </div>
                <!-- Progress bar -->
                <div class="h-2 w-full bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div
                    class="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    :style="{ width: `${getMockValues(i).progressPercent}%` }"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-1.5">
              <Label class="text-sm font-semibold text-slate-700 items-center gap-2">
                今日工作总结与明日计划
              </Label>
              <textarea
                class="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none h-20 shadow-sm"
                placeholder="工作总结..."
              ></textarea>
            </div>
          </div>
          <Button class="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm mt-4">
            提交今日日报
          </Button>
        </div>
      </ScrollArea>
      <DialogFooter class="mt-4">
        <Button variant="outline" @click="emit('close')">取消</Button>
        <Button
          @click="emit('confirm')"
          class="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          已确认，界面无误
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
