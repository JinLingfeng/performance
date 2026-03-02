"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, FileEdit, Trash2, PowerOff, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// Mock data for initial templates
const mockTemplates = [
    {
        id: "TPL-2025-001",
        name: "【休食-省级业务员】2025年绩效考核模板",
        description: "适用于休闲食品事业部所有省级业务员的月度考评标准。",
        indicatorCount: 5,
        totalWeightStr: "100%",
        status: "published", // draft, published, disabled
        updatedAt: "2025-04-12 14:30",
    },
    {
        id: "TPL-2025-002",
        name: "【大客-KA经理】2025年绩效考核模板",
        description: "针对KA渠道的拓客难度增加的主观与客观评价体系。",
        indicatorCount: 8,
        totalWeightStr: "100%",
        status: "published",
        updatedAt: "2025-03-22 09:15",
    },
    {
        id: "TPL-2026-003",
        name: "【餐饮-省级业务员】2026年绩效考核模板",
        description: "2026年新版省级业务员考核草稿。",
        indicatorCount: 3,
        totalWeightStr: "80%", // Weight not up to 100%
        status: "draft",
        updatedAt: "2025-10-18 16:45",
    },
    {
        id: "TPL-2026-004",
        name: "IT部门2026年绩效考核模板",
        description: "针对IT部门研发与支持人员的考核体系。",
        indicatorCount: 4,
        totalWeightStr: "100%",
        status: "draft",
        updatedAt: "2025-11-01 10:00",
    },
    {
        id: "TPL-2026-005",
        name: "销售总监绩效考核模板",
        description: "核心管理层业绩对赌通用模板。",
        indicatorCount: 6,
        totalWeightStr: "100%",
        status: "published",
        updatedAt: "2025-12-11 11:20",
    },
    {
        id: "TPL-2024-099",
        name: "[历史] 2024年度销售专员年底考核项",
        description: "2024年的旧版考核规则，已废弃停用。",
        indicatorCount: 4,
        totalWeightStr: "100%",
        status: "disabled",
        updatedAt: "2024-12-30 18:00",
    }
];

export default function TemplateListPage() {
    const [search, setSearch] = useState("");
    const [templates, setTemplates] = useState(mockTemplates);

    const filteredTemplates = templates.filter(
        (t) => t.name.includes(search) || t.id.includes(search)
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "published":
                return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 font-normal">生效中 (已发布)</Badge>;
            case "draft":
                return <Badge className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 font-normal">草稿中</Badge>;
            case "disabled":
                return <Badge className="bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 font-normal">已禁用</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">考核模板管理</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        基于指标元数据库搭建面向不同组织、不同岗位的绩效自动计算模板。
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="搜索模板名称或编号..."
                            className="pl-9 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Link href="/template/builder">
                        <Button className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <Plus className="mr-1.5 h-4 w-4" />
                            <span>新建考核模板</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[300px]">模板名称 & 编号</TableHead>
                            <TableHead>说明摘要</TableHead>
                            <TableHead className="text-center">指标个数</TableHead>
                            <TableHead className="text-center">权重分配</TableHead>
                            <TableHead className="text-center">当前状态</TableHead>
                            <TableHead className="text-right">最后修改时间</TableHead>
                            <TableHead className="w-[80px] text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTemplates.map((template) => (
                            <TableRow key={template.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-800 line-clamp-1" title={template.name}>
                                            {template.name}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium mt-0.5">{template.id}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-slate-600 line-clamp-1" title={template.description}>
                                        {template.description || "-"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                                        {template.indicatorCount}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className={`text-sm font-medium ${template.totalWeightStr === '100%' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                        {template.totalWeightStr}
                                    </span>
                                    {template.totalWeightStr !== '100%' && (
                                        <p className="text-[10px] text-amber-500/80 leading-none mt-1">需调整为100%</p>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    {getStatusBadge(template.status)}
                                </TableCell>
                                <TableCell className="text-right text-sm text-slate-500">
                                    {template.updatedAt}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">打开菜单</span>
                                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <Link href={`/template/builder?id=${template.id}`}>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <FileEdit className="mr-2 h-4 w-4 text-blue-600" />
                                                    <span className="text-slate-700">编辑模板配置</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            {template.status === 'published' ? (
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <PowerOff className="mr-2 h-4 w-4 text-amber-600" />
                                                    <span className="text-slate-700">暂停/停用</span>
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Power className="mr-2 h-4 w-4 text-emerald-600" />
                                                    <span className="text-slate-700">发布启用</span>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="cursor-pointer focus:bg-red-50">
                                                <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                                                <span className="text-red-600">删除草稿</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredTemplates.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                    未找到匹配的模板
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
