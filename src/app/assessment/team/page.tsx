"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, CheckCircle2, CircleDashed, AlertCircle, FileSignature, ArrowRight, Save, CalendarDays, TrendingUp } from "lucide-react";

// Mock Data
const employees = [
    { id: "emp-001", name: "刘小红", role: "KA经理", avatar: "XH", status: "pending_set" },
    { id: "emp-002", name: "胡凌波", role: "KA经理", avatar: "LB", status: "pending_confirm" },
    { id: "emp-003", name: "穆宏洋", role: "KA经理", avatar: "HY", status: "confirmed" },
    { id: "emp-004", name: "邱臻", role: "KA经理", avatar: "QZ", status: "disputed" },
    { id: "emp-005", name: "郑甜甜", role: "KA经理", avatar: "TT", status: "pending_set" },
];

const mockIndicators = [
    {
        id: "ind-001",
        name: "门店实际销售总额",
        nature: "越高越好",
        weight: 60,
        aggregation: "月度累加",
        source: "系统接口直连",
        targetBase: "" // Emptied for setting
    },
    {
        id: "ind-002",
        name: "连带率考核",
        nature: "越高越好",
        weight: 20,
        aggregation: "按下达值平均",
        source: "人工填报",
        targetBase: ""
    },
    {
        id: "ind-003",
        name: "重点客诉事件处罚",
        nature: "越低越好",
        weight: 20,
        aggregation: "单次触发",
        source: "管理扣分",
        targetBase: "0" // Typically expected is 0 complaints
    }
];

type EmployeeStatus = 'pending_set' | 'pending_confirm' | 'confirmed' | 'disputed';

export default function TeamGoalSettingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEmpId, setSelectedEmpId] = useState<string>("emp-001");
    const [targets, setTargets] = useState<{ [key: string]: string }>({});

    // Status badges mapping
    const getStatusUI = (status: EmployeeStatus) => {
        switch (status) {
            case 'pending_set': return { icon: <CircleDashed className="h-4 w-4 text-slate-300" />, badge: <Badge variant="outline" className="text-slate-500 bg-slate-50 border-slate-200">待设定目标</Badge> };
            case 'pending_confirm': return { icon: <FileSignature className="h-4 w-4 text-amber-500" />, badge: <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">待员工签署</Badge> };
            case 'confirmed': return { icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, badge: <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">已签署确认</Badge> };
            case 'disputed': return { icon: <AlertCircle className="h-4 w-4 text-red-500" />, badge: <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">有异议</Badge> };
            default: return { icon: null, badge: null };
        }
    };

    const selectedEmp = employees.find(e => e.id === selectedEmpId);

    // Derived stats
    const stats = {
        total: employees.length,
        pendingSet: employees.filter(e => e.status === 'pending_set').length,
        pendingConfirm: employees.filter(e => e.status === 'pending_confirm').length,
        confirmed: employees.filter(e => e.status === 'confirmed').length,
    };

    const handleTargetChange = (indId: string, value: string) => {
        setTargets(prev => ({ ...prev, [indId]: value }));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 xl:px-8 pb-20 space-y-6">
            {/* Top Dashboard Board */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">进行中</Badge>
                        <h1 className="text-xl font-bold text-slate-900">2026年3月份初级销售KPI考核</h1>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center mt-2">
                        <CalendarDays className="h-4 w-4 mr-1.5 opacity-70" /> 评定周期: 2026/03/01 - 2026/03/31
                    </p>
                </div>

                <div className="flex items-center gap-4 lg:gap-8 w-full lg:w-auto">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-700">{stats.total}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">考核总人数</div>
                    </div>
                    <div className="h-10 w-px bg-slate-200 hidden lg:block"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-amber-500">{stats.pendingConfirm}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">待签署</div>
                    </div>
                    <div className="h-10 w-px bg-slate-200 hidden lg:block"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-400">{stats.pendingSet}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">待设定数值</div>
                    </div>
                    <div className="h-10 w-px bg-slate-200 hidden lg:block"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-500">{stats.confirmed}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">已生效完成</div>
                    </div>
                </div>
            </div>

            {/* Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
                {/* Left Side: Employee List */}
                <div className="col-span-1 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-w-0">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="搜索下属姓名..."
                                className="pl-9 bg-white border-slate-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-y-scroll overflow-x-hidden flex-1 p-2 space-y-1 custom-scrollbar">
                        {employees.filter(e => e.name.includes(searchQuery)).map(emp => {
                            const ui = getStatusUI(emp.status as EmployeeStatus);
                            const isSelected = selectedEmpId === emp.id;
                            return (
                                <div
                                    key={emp.id}
                                    onClick={() => setSelectedEmpId(emp.id)}
                                    className={`
                                        flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                                        ${isSelected ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-transparent hover:bg-slate-50'}
                                        border
                                    `}
                                >
                                    <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
                                        <AvatarFallback className={isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}>
                                            {emp.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className={`font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                                {emp.name}
                                            </span>
                                            {ui.icon}
                                        </div>
                                        <div className="text-xs text-slate-500 truncate mt-0.5">{emp.role}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Target Setting Form */}
                <div className="col-span-1 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-w-0">
                    {selectedEmp ? (
                        <>
                            {/* Employee Detail Header */}
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                                    <Avatar className="h-14 w-14 border border-slate-200 shadow-sm shrink-0">
                                        <AvatarFallback className="bg-slate-100 text-slate-600 text-lg">
                                            {selectedEmp.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-bold text-slate-900 truncate">{selectedEmp.name}</h2>
                                            {getStatusUI(selectedEmp.status as EmployeeStatus).badge}
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1 truncate">岗位角色: {selectedEmp.role} · 匹配模板: 门店导购基础考核模板</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Button variant="outline" className="bg-white text-slate-700">
                                        <Save className="h-4 w-4 mr-2 shrink-0" /> 暂存修改
                                    </Button>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                        disabled={selectedEmp.status !== 'pending_set'}
                                    >
                                        <Send className="h-4 w-4 mr-2 shrink-0" /> 下发让其确认
                                    </Button>
                                </div>
                            </div>

                            {/* Indicators Form Area */}
                            <div className="flex-1 overflow-y-scroll overflow-x-hidden p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
                                {selectedEmp.status !== 'pending_set' && (
                                    <div className="mb-6">
                                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl inline-flex items-start gap-3 text-sm shadow-sm max-w-full xl:max-w-2xl">
                                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                            <p className="flex-1 leading-relaxed">
                                                当前员工考核目标已下发。员工处于<b>{selectedEmp.status === 'pending_confirm' ? '待签署' : '已签署'}</b>状态时，目标不建议随意修改。如确需调整，需先撤回重新流转。
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {mockIndicators.map((ind, index) => (
                                        <div key={ind.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
                                            {/* Top bar */}
                                            <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded flex items-center justify-center text-xs font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <h3 className="font-bold text-slate-800">{ind.name}</h3>
                                                    <Badge variant="secondary" className="font-normal text-[10px] ml-2">{ind.nature}</Badge>
                                                </div>
                                                <div className="text-sm font-semibold text-slate-700">
                                                    权重: {ind.weight}%
                                                </div>
                                            </div>

                                            {/* Middle config */}
                                            <div className="p-5 flex flex-col md:flex-row gap-6 items-center">
                                                {/* Left: properties */}
                                                <div className="flex-1 grid grid-cols-2 gap-4 text-sm w-full">
                                                    <div>
                                                        <div className="text-slate-400 text-xs mb-1">数据采集方式</div>
                                                        <div className="font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 inline-block">{ind.source}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-slate-400 text-xs mb-1">考核汇聚手段</div>
                                                        <div className="font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 inline-block">{ind.aggregation}</div>
                                                    </div>
                                                </div>

                                                <ArrowRight className="h-5 w-5 text-slate-300 hidden md:block shrink-0" />

                                                {/* Right: Target input component */}
                                                <div className="w-full md:w-[320px] shrink-0 bg-blue-50/50 rounded-xl border border-blue-100 p-4">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-xs font-bold text-blue-800">🎯 设定本期目标基数值：</span>
                                                    </div>
                                                    <Input
                                                        className="h-11 bg-white border-blue-200 shadow-sm text-center font-bold text-lg focus-visible:ring-blue-500"
                                                        placeholder="请输入需达成的具体数值..."
                                                        value={targets[ind.id] !== undefined ? targets[ind.id] : ind.targetBase}
                                                        onChange={(e) => handleTargetChange(ind.id, e.target.value)}
                                                        disabled={selectedEmp.status !== 'pending_set'}
                                                    />
                                                    <div className="mt-2 text-[10px] text-slate-500 text-center">
                                                        系统将以期末实际总值除以此基数进行计分转换。
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <TrendingUp className="h-16 w-16 mb-4 opacity-20" />
                            <p>请在左侧选择需要设定目标的员工</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                html, body {
                    overflow-y: scroll !important;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
}
