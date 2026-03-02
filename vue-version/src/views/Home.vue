<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">绩效总览</h1>
    </div>
    
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-sm font-medium">总考核任务</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">128</div>
          <p class="text-xs text-muted-foreground">即将截止: 12</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
