"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CalendarDays, Plus, Clock, Users, PlayCircle, Eye,
    ChevronRight, CheckCircle2, FileText, CheckSquare, Square,
    Search, Info
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// ========== Mock Data ==========

// Active templates for the Monthly frequency
const activeTemplates = [
    { id: "tpl1", name: "大客KA中心通用考核模板", dept: "大客KA", updateAt: "2026/02/15" },
    { id: "tpl2", name: "餐饮中心业务专员月度考核表", dept: "餐饮中心", updateAt: "2026/01/20" },
    { id: "tpl3", name: "市场部月度推广定性考评", dept: "市场推广部", updateAt: "2025/12/10" },
    { id: "tpl4", name: "休食中心日常绩效考核标准", dept: "休食中心", updateAt: "2026/02/28" },
];

// Cycles data, now supporting multiple templates
const initialCycles = [
    {
        id: "cyc-202603",
        name: "2026年3月份全公司月度绩效考核",
        period: "2026/03/01 - 2026/03/31",
        stage: "goal_setting", // goal_setting | goal_confirming | ongoing | evaluating | finished
        templateNames: ["大客KA中心通用考核模板", "餐饮中心业务专员月度考核表", "市场部月度推广定性考评", "休食中心日常绩效考核标准"],
        totalEmployees: 45,
        targetSetCount: 12,
        targetConfirmedCount: 0,
    },
    {
        id: "cyc-202602",
        name: "2026年2月份业务部门月度考核",
        period: "2026/02/01 - 2026/02/28",
        stage: "evaluating",
        templateNames: ["大客KA中心通用考核模板", "餐饮中心业务专员月度考核表", "市场部月度推广定性考评"],
        totalEmployees: 42,
        targetSetCount: 42,
        targetConfirmedCount: 42,
    },
    {
        id: "cyc-202601",
        name: "2026年1月份销售条线考核",
        period: "2026/01/01 - 2026/01/31",
        stage: "finished",
        templateNames: ["大客KA中心通用考核模板", "餐饮中心业务专员月度考核表"],
        totalEmployees: 40,
        targetSetCount: 40,
        targetConfirmedCount: 40,
    }
];

export default function AssessmentCyclePage() {
    const [cycles, setCycles] = useState(initialCycles);
    const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);

    // Multi-select templates in the modal
    const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTemplates = activeTemplates.filter(t => t.name.includes(searchTerm) || t.dept.includes(searchTerm));

    const toggleTemplate = (id: string) => {
        setSelectedTemplates(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const getStageBadge = (stage: string) => {
        switch (stage) {
            case 'goal_setting': return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">目标制定中</Badge>;
            case 'goal_confirming': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">员工确认中</Badge>;
            case 'ongoing': return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">正在执行</Badge>;
            case 'evaluating': return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">结果评估与打分中</Badge>;
            case 'finished': return <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">已归档结案</Badge>;
            default: return <Badge variant="outline">未知状态</Badge>;
        }
    };

    const handlePushStage = (id: string, newStage: string) => {
        setCycles(prev => prev.map(c => c.id === id ? { ...c, stage: newStage } : c));
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 xl:px-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md pb-4 pt-2 -mt-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">绩效考核周期管理</h1>
                    <p className="text-slate-500 mt-1">HR 工作台：在此处向组织派发新的考核模板并开启一个考评周期。</p>
                </div>
            </div>

            {/* Section 2: 周期实例 */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-emerald-500" />
                        考核周期实例
                    </h2>

                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100">
                        <Info className="w-4 h-4" />
                        每月25日系统将自动生成下一考核周期的实例，并绑定当前全部生效模板
                    </div>
                </div>

                <div className="grid gap-4">
                    {cycles.map((cycle) => (
                        <Card key={cycle.id} className={`shadow-sm overflow-hidden border-l-4 ${cycle.stage === 'goal_setting' ? 'border-l-amber-500 bg-amber-50/10' : 'border-l-slate-200'}`}>
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Left Main Info */}
                                    <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-slate-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {cycle.name}
                                                </h3>
                                                <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-6 mt-3 text-sm text-slate-500">
                                                    <div className="flex items-center text-slate-600 font-medium">
                                                        <CalendarDays className="mr-1.5 h-4 w-4 text-slate-400" />
                                                        {cycle.period}
                                                    </div>
                                                    <div className="flex items-start">
                                                        <Clock className="mr-1.5 h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                                        <div>
                                                            <span className="text-slate-500">包含 {cycle.templateNames.length} 个考核模板:</span>
                                                            <p className="text-xs text-slate-700 font-medium line-clamp-1 mt-0.5" title={cycle.templateNames.join(", ")}>
                                                                {cycle.templateNames.join(", ")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {getStageBadge(cycle.stage)}
                                        </div>

                                        {/* Sub Progress if in goal setting */}
                                        {cycle.stage === 'goal_setting' && (
                                            <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-100">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="font-medium text-slate-700">主管下发目标进度</span>
                                                    <span className="text-slate-500">{cycle.targetSetCount} / {cycle.totalEmployees} 人</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${(cycle.targetSetCount / cycle.totalEmployees) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="mt-3 text-xs text-amber-600 flex items-center bg-amber-50 px-2 py-1 rounded-md max-w-max border border-amber-100">
                                                    ⚠️ 请催促未下发的主管尽快完成员工本月的基数与权重设定。
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Actions Area */}
                                    <div className="w-full lg:w-48 bg-slate-50/50 p-6 flex flex-row lg:flex-col items-center justify-center gap-3">
                                        {cycle.stage === 'goal_setting' && (
                                            <>
                                                <Button variant="outline" className="w-full bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm" asChild>
                                                    <a href="/assessment/team">
                                                        <Users className="mr-2 h-4 w-4 text-blue-500" />
                                                        追踪宣发情况
                                                    </a>
                                                </Button>
                                                <Button
                                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                                                    onClick={() => handlePushStage(cycle.id, 'evaluating')}
                                                >
                                                    <PlayCircle className="mr-2 h-4 w-4" />
                                                    转入评分阶段
                                                </Button>
                                            </>
                                        )}
                                        {cycle.stage === 'evaluating' && (
                                            <>
                                                <Button variant="outline" className="w-full bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm" asChild>
                                                    <a href="/assessment/rating">
                                                        <Eye className="mr-2 h-4 w-4 text-purple-600" />
                                                        追踪打分情况
                                                    </a>
                                                </Button>
                                                <Button
                                                    className="w-full bg-slate-800 hover:bg-slate-900 text-white shadow-sm"
                                                    onClick={() => handlePushStage(cycle.id, 'finished')}
                                                >
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    结案并归档
                                                </Button>
                                            </>
                                        )}
                                        {['finished', 'goal_confirming', 'ongoing'].includes(cycle.stage) && (
                                            <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900 flex justify-between">
                                                进入工作台
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

