"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
    ChevronDown, ChevronRight, BarChart3, Users, TrendingUp,
    Award, Target, UserCheck, AlertCircle
} from "lucide-react";

// ========== Mock Data ==========
type EmployeeRecord = {
    id: string;
    name: string;
    role: string;
    avatar: string;
    score: number | null;       // null代表当月未评分
    grade: string | null;
    goalStatus: '已确认' | '待确认' | '未下发';
    history: { month: string; score: number }[];  // 最近6个月
};

type Department = {
    id: string;
    name: string;
    avgScore: number | null;
    headcount: number;
    ratedCount: number;
    employees: EmployeeRecord[];
};

const months = [
    { value: "2026-03", label: "2026年3月 (当月)" },
    { value: "2026-02", label: "2026年2月" },
    { value: "2026-01", label: "2026年1月" },
    { value: "2025-12", label: "2025年12月" },
    { value: "2025-11", label: "2025年11月" },
    { value: "2025-10", label: "2025年10月" },
];

const generateHistory = (base: number): { month: string; score: number }[] => [
    { month: "2025-10", score: Math.round(base + (Math.random() - 0.5) * 15) },
    { month: "2025-11", score: Math.round(base + (Math.random() - 0.5) * 12) },
    { month: "2025-12", score: Math.round(base + (Math.random() - 0.5) * 10) },
    { month: "2026-01", score: Math.round(base + (Math.random() - 0.5) * 8) },
    { month: "2026-02", score: Math.round(base + (Math.random() - 0.5) * 6) },
];

const mockDepartments: { [month: string]: Department[] } = {
    "2026-02": [
        {
            id: "dept-1", name: "大客KA", avgScore: 82.5, headcount: 5, ratedCount: 5,
            employees: [
                { id: "e1", name: "刘小红", role: "大客经理", avatar: "刘", score: 91, grade: "A", goalStatus: "已确认", history: generateHistory(88) },
                { id: "e2", name: "王建军", role: "KA主管", avatar: "王", score: 85, grade: "B", goalStatus: "已确认", history: generateHistory(83) },
                { id: "e3", name: "张丽华", role: "客户专员", avatar: "张", score: 79, grade: "B", goalStatus: "已确认", history: generateHistory(78) },
                { id: "e4", name: "陈志明", role: "客户专员", avatar: "陈", score: 76, grade: "B", goalStatus: "已确认", history: generateHistory(74) },
                { id: "e5", name: "李小明", role: "助理", avatar: "李", score: 82, grade: "B", goalStatus: "已确认", history: generateHistory(80) },
            ]
        },
        {
            id: "dept-2", name: "餐饮中心", avgScore: 78.2, headcount: 4, ratedCount: 4,
            employees: [
                { id: "e6", name: "赵国强", role: "餐饮总监", avatar: "赵", score: 88, grade: "A", goalStatus: "已确认", history: generateHistory(86) },
                { id: "e7", name: "周雪梅", role: "渠道经理", avatar: "周", score: 75, grade: "B", goalStatus: "已确认", history: generateHistory(73) },
                { id: "e8", name: "吴明辉", role: "业务专员", avatar: "吴", score: 72, grade: "C", goalStatus: "已确认", history: generateHistory(70) },
                { id: "e9", name: "孙丽丽", role: "业务专员", avatar: "孙", score: 78, grade: "B", goalStatus: "已确认", history: generateHistory(76) },
            ]
        },
        {
            id: "dept-3", name: "市场推广部", avgScore: 85.7, headcount: 3, ratedCount: 3,
            employees: [
                { id: "e10", name: "黄晓东", role: "市场总监", avatar: "黄", score: 92, grade: "A", goalStatus: "已确认", history: generateHistory(90) },
                { id: "e11", name: "林婉婷", role: "品牌经理", avatar: "林", score: 86, grade: "A", goalStatus: "已确认", history: generateHistory(84) },
                { id: "e12", name: "郑伟杰", role: "推广专员", avatar: "郑", score: 79, grade: "B", goalStatus: "已确认", history: generateHistory(77) },
            ]
        },
        {
            id: "dept-4", name: "休食中心", avgScore: 80.3, headcount: 4, ratedCount: 4,
            employees: [
                { id: "e13", name: "何俊杰", role: "休食总监", avatar: "何", score: 87, grade: "A", goalStatus: "已确认", history: generateHistory(85) },
                { id: "e14", name: "钱晓燕", role: "品类经理", avatar: "钱", score: 81, grade: "B", goalStatus: "已确认", history: generateHistory(79) },
                { id: "e15", name: "冯大伟", role: "业务专员", avatar: "冯", score: 77, grade: "B", goalStatus: "已确认", history: generateHistory(75) },
                { id: "e16", name: "褚小芳", role: "业务专员", avatar: "褚", score: 76, grade: "B", goalStatus: "已确认", history: generateHistory(74) },
            ]
        },
    ],
    "2026-03": [
        {
            id: "dept-1", name: "大客KA", avgScore: null, headcount: 5, ratedCount: 0,
            employees: [
                { id: "e1", name: "刘小红", role: "大客经理", avatar: "刘", score: null, grade: null, goalStatus: "已确认", history: generateHistory(88) },
                { id: "e2", name: "王建军", role: "KA主管", avatar: "王", score: null, grade: null, goalStatus: "已确认", history: generateHistory(83) },
                { id: "e3", name: "张丽华", role: "客户专员", avatar: "张", score: null, grade: null, goalStatus: "待确认", history: generateHistory(78) },
                { id: "e4", name: "陈志明", role: "客户专员", avatar: "陈", score: null, grade: null, goalStatus: "待确认", history: generateHistory(74) },
                { id: "e5", name: "李小明", role: "助理", avatar: "李", score: null, grade: null, goalStatus: "未下发", history: generateHistory(80) },
            ]
        },
        {
            id: "dept-2", name: "餐饮中心", avgScore: null, headcount: 4, ratedCount: 0,
            employees: [
                { id: "e6", name: "赵国强", role: "餐饮总监", avatar: "赵", score: null, grade: null, goalStatus: "已确认", history: generateHistory(86) },
                { id: "e7", name: "周雪梅", role: "渠道经理", avatar: "周", score: null, grade: null, goalStatus: "已确认", history: generateHistory(73) },
                { id: "e8", name: "吴明辉", role: "业务专员", avatar: "吴", score: null, grade: null, goalStatus: "待确认", history: generateHistory(70) },
                { id: "e9", name: "孙丽丽", role: "业务专员", avatar: "孙", score: null, grade: null, goalStatus: "已确认", history: generateHistory(76) },
            ]
        },
        {
            id: "dept-3", name: "市场推广部", avgScore: null, headcount: 3, ratedCount: 0,
            employees: [
                { id: "e10", name: "黄晓东", role: "市场总监", avatar: "黄", score: null, grade: null, goalStatus: "已确认", history: generateHistory(90) },
                { id: "e11", name: "林婉婷", role: "品牌经理", avatar: "林", score: null, grade: null, goalStatus: "待确认", history: generateHistory(84) },
                { id: "e12", name: "郑伟杰", role: "推广专员", avatar: "郑", score: null, grade: null, goalStatus: "未下发", history: generateHistory(77) },
            ]
        },
        {
            id: "dept-4", name: "休食中心", avgScore: null, headcount: 4, ratedCount: 0,
            employees: [
                { id: "e13", name: "何俊杰", role: "休食总监", avatar: "何", score: null, grade: null, goalStatus: "已确认", history: generateHistory(85) },
                { id: "e14", name: "钱晓燕", role: "品类经理", avatar: "钱", score: null, grade: null, goalStatus: "待确认", history: generateHistory(79) },
                { id: "e15", name: "冯大伟", role: "业务专员", avatar: "冯", score: null, grade: null, goalStatus: "已确认", history: generateHistory(75) },
                { id: "e16", name: "褚小芳", role: "业务专员", avatar: "褚", score: null, grade: null, goalStatus: "未下发", history: generateHistory(74) },
            ]
        },
    ],
};

// Fill other months with Feb data as fallback
["2026-01", "2025-12", "2025-11", "2025-10"].forEach(m => {
    mockDepartments[m] = mockDepartments["2026-02"];
});

const gradeColor = (grade: string | null) => {
    switch (grade) {
        case 'A': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'B': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'C': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'D': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
};

const goalStatusBadge = (status: string) => {
    switch (status) {
        case '已确认': return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px]">已确认</Badge>;
        case '待确认': return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-[10px]">待确认</Badge>;
        case '未下发': return <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[10px]">未下发</Badge>;
        default: return null;
    }
};

// Mini sparkline rendered as tiny bars
function MiniTrend({ history }: { history: { month: string; score: number }[] }) {
    const max = 100;
    return (
        <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-700 mb-2">近6月考核趋势</div>
            {history.map((h) => (
                <div key={h.month} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-14 shrink-0">{h.month}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${h.score >= 85 ? 'bg-emerald-400' : h.score >= 70 ? 'bg-blue-400' : 'bg-amber-400'}`}
                            style={{ width: `${(h.score / max) * 100}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 w-6 text-right">{h.score}</span>
                </div>
            ))}
        </div>
    );
}

export default function StatsPage() {
    const [selectedMonth, setSelectedMonth] = useState("2026-02");
    const [expandedDepts, setExpandedDepts] = useState<{ [key: string]: boolean }>({});

    const isCurrentMonth = selectedMonth === "2026-03";
    const departments = mockDepartments[selectedMonth] || [];

    const toggleDept = (deptId: string) => {
        setExpandedDepts(prev => ({ ...prev, [deptId]: !prev[deptId] }));
    };

    // Summary stats
    const totalEmployees = departments.reduce((s, d) => s + d.headcount, 0);
    const totalRated = departments.reduce((s, d) => s + d.ratedCount, 0);
    const allScores = departments.flatMap(d => d.employees.map(e => e.score).filter((s): s is number => s !== null));
    const overallAvg = allScores.length > 0 ? (allScores.reduce((a, b) => a + b, 0) / allScores.length) : null;

    return (
        <div className="max-w-6xl mx-auto px-4 xl:px-8 pb-20 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">绩效统计大盘</h1>
                    <p className="text-sm text-slate-500 mt-1">按部门维度总览全公司绩效考核数据，支持下钻查看个人明细及历史趋势。</p>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[200px] bg-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map(m => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-blue-50 p-2.5 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div>
                        <div>
                            <div className="text-2xl font-black text-slate-800">{totalEmployees}</div>
                            <div className="text-xs text-slate-500">考核总人数</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-emerald-50 p-2.5 rounded-lg"><UserCheck className="h-5 w-5 text-emerald-600" /></div>
                        <div>
                            <div className="text-2xl font-black text-slate-800">{totalRated}</div>
                            <div className="text-xs text-slate-500">已完成评分</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-purple-50 p-2.5 rounded-lg"><TrendingUp className="h-5 w-5 text-purple-600" /></div>
                        <div>
                            <div className="text-2xl font-black text-slate-800">{overallAvg !== null ? overallAvg.toFixed(1) : '--'}</div>
                            <div className="text-xs text-slate-500">全司平均分</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-amber-50 p-2.5 rounded-lg"><BarChart3 className="h-5 w-5 text-amber-600" /></div>
                        <div>
                            <div className="text-2xl font-black text-slate-800">{departments.length}</div>
                            <div className="text-xs text-slate-500">参评部门数</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Current month alert */}
            {isCurrentMonth && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-sm text-amber-800">
                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                    <span>当前月份考核评分尚未进行，以下展示的是<strong>目标设定进度</strong>而非考核结果。</span>
                </div>
            )}

            {/* Department List */}
            <div className="space-y-4">
                {departments.map(dept => {
                    const isExpanded = expandedDepts[dept.id];
                    const confirmedCount = dept.employees.filter(e => e.goalStatus === '已确认').length;
                    const goalProgress = Math.round((confirmedCount / dept.headcount) * 100);

                    return (
                        <Card key={dept.id} className="shadow-sm border-slate-200 overflow-hidden">
                            {/* Department Header Row */}
                            <div
                                className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                                onClick={() => toggleDept(dept.id)}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="text-slate-400">
                                        {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-800">{dept.name}</h3>
                                            <Badge variant="secondary" className="text-[10px] font-normal">{dept.headcount}人</Badge>
                                        </div>
                                        {isCurrentMonth ? (
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-xs text-slate-500">目标签署进度</span>
                                                <Progress value={goalProgress} className="w-24 h-1.5" />
                                                <span className="text-xs font-medium text-slate-600">{confirmedCount}/{dept.headcount}</span>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 mt-0.5">已评分 {dept.ratedCount}/{dept.headcount} 人</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    {!isCurrentMonth && dept.avgScore !== null && (
                                        <>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500">部门均分</div>
                                                <div className="text-xl font-black text-slate-800">{dept.avgScore}</div>
                                            </div>
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm ${gradeColor(dept.avgScore >= 85 ? 'A' : dept.avgScore >= 70 ? 'B' : dept.avgScore >= 60 ? 'C' : 'D')}`}>
                                                {dept.avgScore >= 85 ? 'A' : dept.avgScore >= 70 ? 'B' : dept.avgScore >= 60 ? 'C' : 'D'}
                                            </div>
                                        </>
                                    )}
                                    {isCurrentMonth && (
                                        <div className="text-right">
                                            <div className="text-xs text-slate-500">目标确认率</div>
                                            <div className="text-xl font-black text-slate-800">{goalProgress}%</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Expanded Employee Table */}
                            {isExpanded && (
                                <div className="border-t border-slate-100">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-50/80 text-xs text-slate-500">
                                                <th className="text-left font-medium px-5 py-2.5">姓名</th>
                                                <th className="text-left font-medium px-3 py-2.5">岗位</th>
                                                {isCurrentMonth ? (
                                                    <th className="text-center font-medium px-3 py-2.5">目标状态</th>
                                                ) : (
                                                    <>
                                                        <th className="text-center font-medium px-3 py-2.5">考核得分</th>
                                                        <th className="text-center font-medium px-3 py-2.5">评级</th>
                                                    </>
                                                )}
                                                <th className="text-right font-medium px-5 py-2.5">趋势</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dept.employees.map(emp => (
                                                <Tooltip key={emp.id} delayDuration={200}>
                                                    <TooltipTrigger asChild>
                                                        <tr className="border-t border-slate-50 hover:bg-blue-50/30 transition-colors cursor-default">
                                                            <td className="px-5 py-3">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                                        {emp.avatar}
                                                                    </div>
                                                                    <span className="text-sm font-medium text-slate-800">{emp.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3 text-sm text-slate-500">{emp.role}</td>
                                                            {isCurrentMonth ? (
                                                                <td className="px-3 py-3 text-center">{goalStatusBadge(emp.goalStatus)}</td>
                                                            ) : (
                                                                <>
                                                                    <td className="px-3 py-3 text-center">
                                                                        <span className="text-sm font-bold text-slate-800">{emp.score ?? '--'}</span>
                                                                    </td>
                                                                    <td className="px-3 py-3 text-center">
                                                                        {emp.grade && (
                                                                            <span className={`inline-flex w-6 h-6 rounded items-center justify-center text-xs font-black ${gradeColor(emp.grade)}`}>
                                                                                {emp.grade}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                </>
                                                            )}
                                                            <td className="px-5 py-3 text-right">
                                                                <div className="inline-flex items-center gap-1">
                                                                    {emp.history.slice(-3).map((h, i) => (
                                                                        <div key={i} className="w-1.5 rounded-full bg-blue-300" style={{ height: `${Math.max(8, h.score / 100 * 20)}px` }} />
                                                                    ))}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="left" className="p-3 w-56 bg-white border border-slate-200 shadow-lg">
                                                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                                {emp.avatar}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-slate-800">{emp.name}</div>
                                                                <div className="text-[10px] text-slate-500">{emp.role}</div>
                                                            </div>
                                                        </div>
                                                        <MiniTrend history={emp.history} />
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
