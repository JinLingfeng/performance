<script setup lang="ts">
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppSidebar from '@/components/AppSidebar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <TooltipProvider>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <!-- Decorative background pattern -->
        <div
          class="fixed inset-0 pointer-events-none z-0"
          :style="{
            backgroundImage: [
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.07), transparent)',
              'radial-gradient(circle, rgba(148, 163, 184, 0.15) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '100% 100%, 20px 20px',
          }"
        ></div>
        
        <header class="flex h-14 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-4 shadow-sm relative z-10">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/">工作台</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>绩效总览</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div class="flex flex-1 flex-col p-4 md:p-6 pb-12 w-full max-w-7xl mx-auto relative z-10">
          <RouterView />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </TooltipProvider>
</template>
