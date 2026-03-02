"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertCircle, FileSignature, CheckCircle2, Calculator, ArrowRight,
    Wallet, History, Star, Target, TrendingUp, Award, ChevronLeft,
    CalendarDays, Clock
} from "lucide-react";

// ========== 考核周期列表 Mock ==========
const cycleList = [
    {
        id: "cycle-2026-03",
        title: "2026年3月份初级销售KPI考核",
        period: "2026-03-01 ~ 2026-03-31",
        status: "pending_confirm" as const,
        totalScore: null,
        grade: null,
    },
    {
        id: "cycle-2026-02",
        title: "2026年2月份初级销售KPI考核",
        period: "2026-02-01 ~ 2026-02-28",
        status: "finished" as const,
        totalScore: 82.3,
        grade: "B",
    },
    {
        id: "cycle-2026-01",
        title: "2026年1月份初级销售KPI考核",
        period: "2026-01-01 ~ 2026-01-31",
        status: "finished" as const,
        totalScore: 91.5,
        grade: "A",
    },
    {
        id: "cycle-2025-12",
        title: "2025年12月份初级销售KPI考核",
        period: "2025-12-01 ~ 2025-12-31",
        status: "finished" as const,
        totalScore: 76.8,
        grade: "B",
    },
];

// ========== 目标确认 Mock Data ==========
const personalIndicators = [
    {
        id: "ind-001", name: "门店实际销售总额", nature: "越高越好",
        weight: 60, aggregation: "月度累加", source: "BI系统", targetBase: "250,000"
    },
    {
        id: "ind-002", name: "新品上架计划达成率", nature: "越高越好",
        weight: 20, aggregation: "按下达值平均", source: "BI系统", targetBase: "12 个SKU"
    },
    {
        id: "ind-003", name: "重点客诉事件处罚", nature: "越低越好",
        weight: 20, aggregation: "单次触发", source: "管理扣分", targetBase: "0"
    }
];

// ========== 考核结果 Mock Data ==========
const resultIndicators = [
    { id: "r-001", name: "季均客单价达标率", nature: "定量计算", weight: 20, targetValue: "150", actualValue: "135", unit: "元", systemScore: 85, finalScore: 85, ruleType: "90/70阶梯制(标准型)", supervisorComment: null },
    { id: "r-002", name: "新品上架计划达成率", nature: "定量计算", weight: 10, targetValue: "12", actualValue: "11", unit: "个SKU", systemScore: 92, finalScore: 92, ruleType: "100/70阶梯制(严格型)", supervisorComment: null },
    { id: "r-003", name: "主推大单品销售目标达成率", nature: "定量计算", weight: 15, targetValue: "80,000", actualValue: "57,600", unit: "元", systemScore: 71, finalScore: 71, ruleType: "90/70阶梯制(标准型)", supervisorComment: null },
    { id: "r-004", name: "月度销售额KPI", nature: "定量计算", weight: 15, targetValue: "150,000", actualValue: "117,000", unit: "元", systemScore: 78, finalScore: 78, ruleType: "80/70阶梯制(宽限型)", supervisorComment: null },
    { id: "r-005", name: "价值观考核", nature: "定性评分", weight: 15, targetValue: null, actualValue: null, unit: null, systemScore: null, finalScore: 88, ruleType: "定性测定(直接打分)", supervisorComment: "小明在本月表现出色，积极参与团队建设活动，能主动协助新同事融入团队，价值观践行良好。" },
    { id: "r-006", name: "工作态度与主动性", nature: "定性评分", weight: 15, targetValue: null, actualValue: null, unit: null, systemScore: null, finalScore: 82, ruleType: "定性测定(直接打分)", supervisorComment: "工作态度端正，遇到问题能积极寻求解决方案。但跨部门沟通时偶有拖延，建议下月加强主动性。" },
    { id: "r-007", name: "客户投诉处理满意度", nature: "综合评估", weight: 10, targetValue: null, actualValue: null, unit: null, systemScore: null, finalScore: 75, ruleType: "定性测定(直接打分)", supervisorComment: "本月处理了3起客诉事件，其中1起处理时效偏长，客户反馈一般。需加强对紧急客诉的响应速度。" },
];

type CycleStatus = 'pending_confirm' | 'finished';

const getStatusUI = (status: CycleStatus) => {
    switch (status) {
        case 'pending_confirm': return <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50" variant="outline">待确认目标</Badge>;
        case 'finished': return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" variant="outline">已结案</Badge>;
    }
};

export default function MyAssessmentGoalPage() {
    const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
    const [confirmStatus, setConfirmStatus] = useState<{ [key: string]: 'pending_confirm' | 'confirmed' }>({});

    const selectedCycle = cycleList.find(c => c.id === selectedCycleId);

    const getConfirmStatus = (cycleId: string) => {
        return confirmStatus[cycleId] || cycleList.find(c => c.id === cycleId)?.status || 'pending_confirm';
    };

    const handleConfirm = (cycleId: string) => {
        setConfirmStatus(prev => ({ ...prev, [cycleId]: 'confirmed' }));
    };

    const totalScore = resultIndicators.reduce((sum, ind) => sum + (ind.finalScore * ind.weight / 100), 0);
    const quantitativeResults = resultIndicators.filter(i => i.nature === '定量计算');
    const qualitativeResults = resultIndicators.filter(i => i.nature !== '定量计算');

    // ========== 周期列表视图 ==========
    if (!selectedCycle) {
        return (
            <div className="max-w-4xl mx-auto px-4 xl:px-8 pb-20 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">我的考核目标与结果</h1>
                    <p className="text-sm text-slate-500 mt-1">李小明 (工号: 00192) · 查阅您参与的所有考核周期的目标与最终评价结果。</p>
                </div>

                <div className="space-y-4">
                    {cycleList.map((cycle) => (
                        <Card
                            key={cycle.id}
                            className="shadow-sm border-slate-200 hover:border-blue-200 transition-colors cursor-pointer group"
                            onClick={() => setSelectedCycleId(cycle.id)}
                        >
                            <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={`h-12 w-12 rounded-xl flex flex-col items-center justify-center font-bold leading-tight shrink-0 ${cycle.status === 'pending_confirm' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                        <CalendarDays className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-slate-800 truncate">{cycle.title}</h3>
                                            {getStatusUI(cycle.status)}
                                            {cycle.status === 'pending_confirm' && (
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {cycle.period}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    {cycle.totalScore !== null ? (
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500">综合评分</div>
                                                <div className="text-xl font-black text-slate-800">{cycle.totalScore}</div>
                                            </div>
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg ${cycle.grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                                                    cycle.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                                        cycle.grade === 'C' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-red-100 text-red-700'
                                                }`}>
                                                {cycle.grade}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm font-medium text-amber-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" /> 需要您确认目标
                                        </div>
                                    )}
                                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // ========== 周期详情视图 ==========
    const currentStatus = getConfirmStatus(selectedCycle.id);

    return (
        <div className="max-w-4xl mx-auto px-4 xl:px-8 pb-20 space-y-6">
            {/* Back button + Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setSelectedCycleId(null)} className="text-slate-500 hover:text-slate-900 -ml-2">
                    <ChevronLeft className="h-4 w-4 mr-1" /> 返回列表
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex flex-col items-center justify-center font-bold leading-tight ${selectedCycle.status === 'pending_confirm' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{selectedCycle.title}</h1>
                        <p className="text-sm text-slate-500 mt-1">适用人: 李小明 (工号: 00192) · 角色: 区域销售</p>
                    </div>
                </div>
                {selectedCycle.status === 'pending_confirm' && currentStatus === 'pending_confirm' && (
                    <Button
                        size="lg"
                        className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white shadow-md font-bold text-base px-8 h-12"
                        onClick={() => handleConfirm(selectedCycle.id)}
                    >
                        <FileSignature className="mr-2 h-5 w-5" />
                        我已完整阅读，确认签署
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="goals" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100 p-1 rounded-xl">
                    <TabsTrigger value="goals" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold text-sm">
                        <Target className="h-4 w-4 mr-2" />
                        我的考核目标
                    </TabsTrigger>
                    <TabsTrigger value="results" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold text-sm">
                        <Award className="h-4 w-4 mr-2" />
                        我的考核结果
                    </TabsTrigger>
                </TabsList>

                {/* ========== Tab 1: 考核目标 ========== */}
                <TabsContent value="goals" className="mt-6 space-y-6">
                    {selectedCycle.status === 'pending_confirm' && currentStatus === 'pending_confirm' && (
                        <div className="bg-red-50 border-l-4 border-l-red-500 border-y border-r border-y-red-100 border-r-red-100 p-5 rounded-r-xl shadow-sm flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="bg-red-100 p-2 rounded-full shrink-0">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-red-800 font-bold text-lg">您有待确认的本月绩效目标！</h2>
                                <div className="mt-2 text-red-700/90 text-sm leading-relaxed space-y-2">
                                    <p>您的主管已为您下发了考核指标与基数设定，请务必核对下方明细并点击确认。</p>
                                    <p className="font-semibold flex items-center gap-1.5"><Wallet className="h-4 w-4" /> 警告：逾期不确认或无正当理由拒绝，将直接影响您本周期（及下月）的工资和绩效奖金发放。</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStatus === 'confirmed' && (
                        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl shadow-sm flex items-center justify-between animate-in fade-in duration-500">
                            <div className="flex items-center gap-4">
                                <div className="bg-emerald-100 p-2 rounded-full">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-emerald-800 font-bold text-lg">您已成功签署本期考核目标</h2>
                                    <p className="text-emerald-700/80 text-sm mt-1">请按照以下指标数据作为本期业务指引开展工作。</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-200">
                            <Calculator className="h-5 w-5 text-blue-600" />
                            考核明细
                        </h3>
                        {personalIndicators.map((ind, index) => (
                            <Card key={ind.id} className="shadow-sm border-slate-200 overflow-hidden relative">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${currentStatus === 'confirmed' || selectedCycle.status === 'finished' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                <CardContent className="p-0 pl-1">
                                    <div className="p-5 flex flex-col md:flex-row gap-6 items-center">
                                        <div className="flex-1 space-y-3 w-full">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-slate-50 text-slate-500">{index + 1}</Badge>
                                                <h4 className="text-base font-bold text-slate-800">{ind.name}</h4>
                                                <Badge variant="secondary" className="font-normal text-[10px] ml-1">{ind.nature}</Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                                <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
                                                    <span className="text-slate-400 mr-2">数据来源</span>
                                                    <span className="font-medium text-slate-700">{ind.source}</span>
                                                </div>
                                                <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
                                                    <span className="text-slate-400 mr-2">计算方式</span>
                                                    <span className="font-medium text-slate-700">{ind.aggregation}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-auto flex justify-center py-2 md:py-0">
                                            <ArrowRight className="h-5 w-5 text-slate-300 hidden md:block" />
                                        </div>
                                        <div className="w-full md:w-[280px] shrink-0 bg-blue-50/50 rounded-xl border border-blue-100/60 p-4 relative overflow-hidden">
                                            <div className="flex justify-between items-center mb-3 relative z-10">
                                                <span className="text-xs font-bold text-slate-500">本期业务挑战基数</span>
                                                <Badge variant="outline" className="bg-white text-blue-700 border-blue-200">权重: {ind.weight}%</Badge>
                                            </div>
                                            <div className="text-2xl font-black text-blue-900 tracking-tight relative z-10">
                                                {ind.targetBase || <span className="text-slate-300 italic text-lg">待设定</span>}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {(currentStatus === 'confirmed' || selectedCycle.status === 'finished') && (
                        <div className="flex flex-col items-center justify-center pt-8 pb-4 text-slate-400 text-sm animate-in fade-in duration-700">
                            <FileSignature className="h-8 w-8 mb-2 opacity-50" />
                            <p>电子画押与签署留存记录</p>
                            <p className="text-xs mt-1">李小明 (00192) - 签署于 2026-03-01 09:15:30</p>
                        </div>
                    )}
                </TabsContent>

                {/* ========== Tab 2: 考核结果 ========== */}
                <TabsContent value="results" className="mt-6 space-y-6">
                    {selectedCycle.status === 'finished' ? (
                        <>
                            {/* Overall Score Card */}
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-white/15 rounded-2xl p-4">
                                            <Award className="h-10 w-10" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-white/80 font-medium">综合加权总评分</div>
                                            <div className="text-5xl font-black tracking-tight mt-1">{selectedCycle.totalScore}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-center">
                                        <div>
                                            <div className="text-2xl font-bold">{quantitativeResults.length}</div>
                                            <div className="text-xs text-white/70 mt-0.5">定量指标</div>
                                        </div>
                                        <div className="h-8 w-px bg-white/20" />
                                        <div>
                                            <div className="text-2xl font-bold">{qualitativeResults.length}</div>
                                            <div className="text-xs text-white/70 mt-0.5">定性指标</div>
                                        </div>
                                        <div className="h-8 w-px bg-white/20" />
                                        <div>
                                            <div className="text-2xl font-bold">{selectedCycle.grade}</div>
                                            <div className="text-xs text-white/70 mt-0.5">评级</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quantitative Results */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Calculator className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-bold text-slate-900">系统测算类指标 (定量)</h3>
                                </div>
                                <div className="space-y-4">
                                    {quantitativeResults.map((ind, index) => (
                                        <Card key={ind.id} className="shadow-sm border-slate-200 overflow-hidden">
                                            <CardContent className="p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0">{index + 1}</div>
                                                        <h4 className="font-bold text-slate-800">{ind.name}</h4>
                                                        <Badge variant="secondary" className="text-[10px] font-normal">{ind.nature}</Badge>
                                                        <Badge variant="outline" className="text-[10px] font-normal ml-1 bg-white border-slate-200">{ind.ruleType}</Badge>
                                                    </div>
                                                    <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 shrink-0">权重 {ind.weight}%</Badge>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                                                        <div className="text-xs text-slate-500 mb-1">目标值</div>
                                                        <div className="font-semibold text-slate-800">{ind.targetValue} <span className="text-xs font-normal text-slate-500">{ind.unit}</span></div>
                                                    </div>
                                                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                                                        <div className="text-xs text-slate-500 mb-1">实际值</div>
                                                        <div className="font-semibold text-slate-800">{ind.actualValue} <span className="text-xs font-normal text-slate-500">{ind.unit}</span></div>
                                                    </div>
                                                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                                                        <div className="text-xs text-blue-500 mb-1">系统得分</div>
                                                        <div className="font-bold text-blue-700 text-lg">{ind.systemScore}</div>
                                                    </div>
                                                    <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg">
                                                        <div className="text-xs text-purple-500 mb-1">最终核定</div>
                                                        <div className="font-black text-purple-700 text-lg">{ind.finalScore}</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Qualitative Results */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="h-5 w-5 text-purple-600" />
                                    <h3 className="text-lg font-bold text-slate-900">主管评价类指标 (定性)</h3>
                                </div>
                                <div className="space-y-4">
                                    {qualitativeResults.map((ind, index) => (
                                        <Card key={ind.id} className="shadow-sm border-slate-200 overflow-hidden">
                                            <CardContent className="p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-purple-100 text-purple-600 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0">{index + 1}</div>
                                                        <h4 className="font-bold text-slate-800">{ind.name}</h4>
                                                        <Badge variant="secondary" className="text-[10px] font-normal">{ind.nature}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">权重 {ind.weight}%</Badge>
                                                        <div className="bg-purple-50 border border-purple-100 px-4 py-2 rounded-lg">
                                                            <div className="text-xs text-purple-500">得分</div>
                                                            <div className="font-black text-purple-700 text-xl text-center">{ind.finalScore}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {ind.supervisorComment && (
                                                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mt-2">
                                                        <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                                            <Star className="h-3 w-3" /> 上级评语
                                                        </div>
                                                        <p className="text-sm text-slate-700 leading-relaxed">{ind.supervisorComment}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Clock className="h-16 w-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">本期考核尚未结束</p>
                            <p className="text-sm mt-1.5">请等待考核周期进入评分并结案后查看最终结果。</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
