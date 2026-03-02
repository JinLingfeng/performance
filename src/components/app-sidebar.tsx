import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BarChart3, Users, Settings, Home, FileText, Target, CalendarDays, Star } from "lucide-react"

const items = [
    {
        title: "总览面板",
        url: "/",
        icon: Home,
    },
    {
        title: "企业指标元数据库",
        url: "/library",
        icon: FileText,
    },
    {
        title: "考核模板配置",
        url: "/template",
        icon: FileText,
    },
    {
        title: "考核周期与发起",
        url: "/assessment/cycle",
        icon: CalendarDays,
    },
    {
        title: "团队目标设定大厅",
        url: "/assessment/team",
        icon: Users,
    },
    {
        title: "我的考核目标与结果",
        url: "/assessment/my",
        icon: Target,
    },
    {
        title: "团队绩效评定打分",
        url: "/assessment/rating",
        icon: Star,
    },
    {
        title: "绩效统计大盘",
        url: "/stats",
        icon: BarChart3,
    },
    {
        title: "系统设置",
        url: "#",
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sm font-semibold text-primary">卓希集团绩效管理</SidebarGroupLabel>
                    <SidebarGroupContent className="mt-2">
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
