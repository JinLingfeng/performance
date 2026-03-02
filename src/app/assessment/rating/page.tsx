"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Send, CheckCircle2, CircleDashed, CalendarDays, TrendingUp, Save, Star, Paperclip, Calculator, Target, Info, ChevronDown, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mock Data
const employees = [
    { id: "emp-001", name: "刘小红", role: "KA经理", avatar: "XH", status: "pending" },
    { id: "emp-002", name: "胡凌波", role: "KA经理", avatar: "LB", status: "rated" },
    { id: "emp-003", name: "穆宏洋", role: "KA经理", avatar: "HY", status: "pending" },
    { id: "emp-004", name: "邱臻", role: "KA经理", avatar: "QZ", status: "pending" },
    { id: "emp-005", name: "郑甜甜", role: "KA经理", avatar: "TT", status: "rated" },
];

const mockIndicators = [
    {
        id: "ind-001",
        name: "主管综合评价",
        nature: "定性评分",
        weight: null, // 独立计分，不占计算权重
        maxScore: 20,
        desc: "结合员工本月整体工作表现、价值观遵循、团队协作与创新创造等方面给出的主观综合评价。"
    },
    {
        id: "ind-004",
        name: "季均客单价达标率",
        nature: "定量计算",
        weight: 20,
        maxScore: 100,
        systemScore: 85,
        ruleType: "90/70阶梯制(标准型)",
        targetValue: "150",
        actualValue: "135",
        unit: "元",
        desc: "根据CRM及订单系统每日自动拉取的客单价流水指标换算得出。满分100，系统初始分数为原始业绩系数。"
    },
    {
        id: "ind-005",
        name: "新品上架计划达成率",
        nature: "定量计算",
        weight: 10,
        maxScore: 100,
        systemScore: 92,
        ruleType: "100/70阶梯制(严格型)",
        targetValue: "12",
        actualValue: "11",
        unit: "个SKU",
        desc: "本月计划上架新品SKU数与实际成功上架数之比，从商品中心系统自动拉取。"
    },
    {
        id: "ind-007",
        name: "主推大单品销售目标达成率",
        nature: "定量计算",
        weight: 15,
        maxScore: 100,
        systemScore: 71,
        ruleType: "90/70阶梯制(标准型)",
        targetValue: "80,000",
        actualValue: "57,600",
        unit: "元",
        desc: "本月主推爆款单品实际销售额与营销目标额之比，从订单系统按商品SPU维度聚合拉取。"
    },
    {
        id: "ind-006",
        name: "月度销售额KPI",
        nature: "定量计算",
        weight: 15,
        maxScore: 100,
        systemScore: 78,
        ruleType: "80/70阶梯制(宽限型)",
        targetValue: "150,000",
        actualValue: "117,000",
        unit: "元",
        desc: "本月实际完成销售额与HR设定的目标销售额之比，未达标则按阶梯系数折算。"
    }
];

type EmployeeStatus = 'pending' | 'rated';

export default function RatingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEmpId, setSelectedEmpId] = useState<string>("emp-001");
    const [scores, setScores] = useState<{ [key: string]: { score: string, comment: string } }>({});
    const [adjustingIds, setAdjustingIds] = useState<{ [key: string]: boolean }>({});

    // Status badges mapping
    const getStatusUI = (status: EmployeeStatus) => {
        switch (status) {
            case 'pending': return { icon: <CircleDashed className="h-4 w-4 text-amber-400" />, badge: <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">待完成打分</Badge> };
            case 'rated': return { icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, badge: <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">已完成评估</Badge> };
            default: return { icon: null, badge: null };
        }
    };

    const selectedEmp = employees.find(e => e.id === selectedEmpId);

    // Derived stats
    const stats = {
        total: employees.length,
        pending: employees.filter(e => e.status === 'pending').length,
        rated: employees.filter(e => e.status === 'rated').length,
    };

    const handleScoreChange = (indId: string, value: string) => {
        setScores(prev => ({
            ...prev,
            [indId]: { ...prev[indId], score: value }
        }));
    };

    const handleCommentChange = (indId: string, value: string) => {
        setScores(prev => ({
            ...prev,
            [indId]: { ...prev[indId], comment: value }
        }));
    };

    const toggleAdjustment = (indId: string) => {
        setAdjustingIds(prev => ({ ...prev, [indId]: !prev[indId] }));
    };

    const quantitativeIndicators = mockIndicators.filter(i => i.nature === '定量计算');
    const qualitativeIndicators = mockIndicators.filter(i => i.nature !== '定量计算');

    return (
        <div className="max-w-7xl mx-auto px-4 xl:px-8 pb-20 space-y-6">
            {/* Top Dashboard Board */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">评分期</Badge>
                        <h1 className="text-xl font-bold text-slate-900">2026年3月份初级销售KPI考核</h1>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center mt-2">
                        <CalendarDays className="h-4 w-4 mr-1.5 opacity-70" /> 考评对象：本团队全体员工
                    </p>
                </div>

                <div className="flex items-center gap-4 lg:gap-8 w-full md:w-auto">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-700">{stats.total}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">需考评总人数</div>
                    </div>
                    <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-amber-500">{stats.pending}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">待打分</div>
                    </div>
                    <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-500">{stats.rated}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">已完成评估</div>
                    </div>
                </div>
            </div>

            {/* Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
                {/* Left Side: Employee List */}
                <div className="col-span-1 lg:col-span-3 xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-w-0">
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
                                        ${isSelected ? 'bg-purple-50 border-purple-200 shadow-sm' : 'border-transparent hover:bg-slate-50'}
                                        border
                                    `}
                                >
                                    <Avatar className="h-10 w-10 border border-slate-200 shadow-sm shrink-0">
                                        <AvatarFallback className={isSelected ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}>
                                            {emp.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className={`font-semibold truncate ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>
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

                {/* Right Side: Rating Form */}
                <div className="col-span-1 lg:col-span-9 xl:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-w-0">
                    {selectedEmp ? (
                        <>
                            {/* Employee Detail Header */}
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
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
                                        <p className="text-sm text-slate-500 mt-1 truncate">请对此员工在本周期的主观定性指标进行客观打分评价</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Button variant="outline" className="bg-white text-slate-700">
                                        <Save className="h-4 w-4 mr-2 shrink-0" /> 保存草稿
                                    </Button>
                                    <Button
                                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2 shrink-0" /> 提交评估考核
                                    </Button>
                                </div>
                            </div>

                            {/* Indicators Form Area */}
                            <div className="flex-1 overflow-y-scroll overflow-x-hidden p-6 bg-slate-50/30 custom-scrollbar">
                                {/* Quantitative Section */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Calculator className="h-5 w-5 text-blue-600" />
                                        <h3 className="text-lg font-bold text-slate-900">系统测算类指标 (定量)</h3>
                                        <Badge variant="outline" className="ml-2 font-normal text-slate-500 bg-white shadow-sm border-slate-200">系统已出分，支持申诉说明调分</Badge>
                                    </div>
                                    <div className="space-y-6">
                                        {quantitativeIndicators.map((ind, index) => (
                                            <div key={ind.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-blue-200 transition-colors">
                                                {/* Top bar */}
                                                <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <h3 className="font-bold text-slate-800">{ind.name}</h3>
                                                        <Badge variant="secondary" className="font-normal text-[10px] ml-2 shrink-0 bg-white border-slate-200">{ind.nature}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-700 shrink-0">
                                                        <span>权重: {ind.weight}%</span>
                                                        <span>满分: {ind.maxScore}</span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5 flex flex-col md:flex-row gap-6">
                                                    {/* Left: Description & System Score for Quantitative */}
                                                    <div className="flex-1 space-y-4">
                                                        <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                            {ind.desc}
                                                        </div>

                                                        {/* Business Data & Rule Box */}
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                                                                <div className="text-xs text-slate-500 mb-1 flex items-center">
                                                                    <Target className="w-3 h-3 mr-1" /> 目标考核值
                                                                </div>
                                                                <div className="font-semibold text-slate-800">
                                                                    {ind.targetValue} <span className="text-xs font-normal text-slate-500">{ind.unit}</span>
                                                                </div>
                                                            </div>
                                                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                                                                <div className="text-xs text-slate-500 mb-1 flex items-center">
                                                                    业务实际值
                                                                </div>
                                                                <div className="font-semibold text-slate-800">
                                                                    {ind.actualValue} <span className="text-xs font-normal text-slate-500">{ind.unit}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-2 md:col-span-1 bg-slate-50 border border-slate-100 p-3 rounded-lg flex flex-col justify-center">
                                                                <div className="text-xs text-slate-500 mb-1 flex items-center">
                                                                    <Info className="w-3 h-3 mr-1" /> 计分规则映射
                                                                </div>
                                                                <div className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded inline-block w-fit">
                                                                    {ind.ruleType}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-center justify-between mt-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-blue-100 p-2 rounded-md">
                                                                    <Calculator className="h-5 w-5 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-semibold text-blue-900">系统计算原始得分</div>
                                                                    <div className="text-xs text-blue-600 mt-0.5">数据来源：BI系统</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-3xl font-black text-blue-700">
                                                                {ind.systemScore}
                                                            </div>
                                                        </div>

                                                        {/* Manual Adjustment Toggle */}
                                                        <div className="pt-2 border-t border-slate-100">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toggleAdjustment(ind.id)}
                                                                className={`px-0 hover:bg-transparent ${adjustingIds[ind.id] ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                                                            >
                                                                {adjustingIds[ind.id] ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                                                                <span className="relative flex items-center gap-1.5">
                                                                    <span className="relative flex h-2 w-2">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                                                    </span>
                                                                    我要人工调整分数
                                                                </span>
                                                            </Button>

                                                            {adjustingIds[ind.id] && (
                                                                <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                                                                    <Label className="text-slate-500 mb-1.5 block">
                                                                        人工调整说明 (必填)
                                                                    </Label>
                                                                    <Textarea
                                                                        placeholder="请务必在此注明异常情况及调分理由，本条记录将永久留档并抄送HRBP..."
                                                                        className="min-h-[80px] resize-y border-slate-200 focus-visible:ring-blue-500"
                                                                        value={scores[ind.id]?.comment || ""}
                                                                        onChange={(e) => handleCommentChange(ind.id, e.target.value)}
                                                                    />
                                                                    <div className="mt-3 flex items-center justify-between">
                                                                        <Button variant="outline" size="sm" className="text-slate-600">
                                                                            <Paperclip className="h-4 w-4 mr-2" /> 上传证明附件
                                                                        </Button>
                                                                        <span className="text-xs text-slate-400">支持 .pdf, .jpg, .xlsx</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Right: Score Input */}
                                                    <div className="w-full md:w-56 shrink-0 flex flex-col">
                                                        <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-5 flex-1 flex flex-col items-center justify-center">
                                                            <div className="mb-4 flex flex-col items-center gap-1 text-center">
                                                                <Star className="h-6 w-6 text-blue-400 mb-1" />
                                                                <span className="text-sm font-bold text-blue-800">
                                                                    最终核定分数
                                                                </span>
                                                                <span className="text-xs text-slate-500">(满分 {ind.maxScore})</span>
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                max={ind.maxScore}
                                                                min={0}
                                                                className="h-14 bg-white border-blue-200 shadow-sm text-center font-bold text-2xl text-blue-700 focus-visible:ring-blue-500"
                                                                placeholder={ind.systemScore ? ind.systemScore.toString() : "0"}
                                                                value={scores[ind.id]?.score || ""}
                                                                onChange={(e) => handleScoreChange(ind.id, e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Qualitative Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingUp className="h-5 w-5 text-purple-600" />
                                        <h3 className="text-lg font-bold text-slate-900">主管评价类指标 (定性)</h3>
                                        <Badge variant="outline" className="ml-2 font-normal text-slate-500 bg-white shadow-sm border-slate-200">综合主观打分与评语</Badge>
                                    </div>
                                    <div className="space-y-6">
                                        {qualitativeIndicators.map((ind, index) => (
                                            <div key={ind.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-purple-200 transition-colors">
                                                {/* Top bar */}
                                                <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-purple-100 text-purple-600 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <h3 className="font-bold text-slate-800">{ind.name}</h3>
                                                        <Badge variant="secondary" className="font-normal text-[10px] ml-2 shrink-0 bg-white border-slate-200">{ind.nature}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-700 shrink-0">
                                                        {ind.weight !== null && <span>权重: {ind.weight}%</span>}
                                                        <span>满分: {ind.maxScore}</span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5 flex flex-col md:flex-row gap-6">
                                                    {/* Left: Description */}
                                                    <div className="flex-1 space-y-2">
                                                        <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                            {ind.desc}
                                                        </div>
                                                        <div className="pt-2">
                                                            <Label className="text-slate-500 mb-1.5 block">上级考核评价 / 评语 (必填)</Label>
                                                            <Textarea
                                                                placeholder="请客观描述该员工在此项考核中的具体表现..."
                                                                className="min-h-[100px] resize-y border-slate-200 focus-visible:ring-purple-500"
                                                                value={scores[ind.id]?.comment || ""}
                                                                onChange={(e) => handleCommentChange(ind.id, e.target.value)}
                                                            />
                                                            <div className="mt-3 flex items-center justify-between">
                                                                <Button variant="outline" size="sm" className="text-slate-600 bg-white shadow-sm border-slate-200 hover:bg-slate-50">
                                                                    <Paperclip className="h-4 w-4 mr-2 text-slate-500" /> 上传佐证附件
                                                                </Button>
                                                                <span className="text-xs text-slate-400">支持图文报告与文档</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right: Score Input */}
                                                    <div className="w-full md:w-56 shrink-0 flex flex-col">
                                                        <div className="bg-purple-50/50 rounded-xl border border-purple-100 p-5 flex-1 flex flex-col items-center justify-center">
                                                            <div className="mb-4 flex flex-col items-center gap-1 text-center">
                                                                <Star className="h-6 w-6 text-purple-400 mb-1" />
                                                                <span className="text-sm font-bold text-purple-800">打分数值</span>
                                                                <span className="text-xs text-slate-500">(满分 {ind.maxScore})</span>
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                max={ind.maxScore}
                                                                min={0}
                                                                className="h-14 bg-white border-purple-200 shadow-sm text-center font-bold text-2xl text-purple-700 focus-visible:ring-purple-500"
                                                                placeholder="0"
                                                                value={scores[ind.id]?.score || ""}
                                                                onChange={(e) => handleScoreChange(ind.id, e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <TrendingUp className="h-16 w-16 mb-4 opacity-20" />
                            <p>请在左侧选择需要评价打分的员工</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
