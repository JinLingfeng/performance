"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function IndicatorWizard({ isOpen, onClose, initialData, onSave }: any) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        dimension: "",
        mapField: "",
        period: "month",
        ruleCode: "STEP_90_70"
    });

    // 预览状态
    const [previewValue, setPreviewValue] = useState(85);
    const [deductValue, setDeductValue] = useState(0);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                dimension: initialData.dimension || "",
                mapField: initialData.mapField || "",
                period: initialData.period || "month",
                ruleCode: initialData.ruleCode || "STEP_90_70"
            });
        } else {
            setFormData({
                name: "",
                dimension: "销售业绩",
                mapField: "",
                period: "month",
                ruleCode: "STEP_90_70"
            });
        }
        setStep(1);
    }, [initialData, isOpen]);

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);
    const handleSave = () => {
        // 构造显示用的 desc 和 ruleType
        let ruleType = "";
        let ruleDesc = "";
        switch (formData.ruleCode) {
            case "STEP_90_70":
                ruleType = "90/70阶梯制(标准型)";
                ruleDesc = "低于70%得0分，70%-90%线性得分，90%以上得满分。";
                break;
            case "STEP_80_70":
                ruleType = "80/70阶梯制(宽限型)";
                ruleDesc = "低于70%得0分，70%-80%线性得分，80%即可得满分。";
                break;
            case "STEP_100_70":
                ruleType = "100/70阶梯制(严格型)";
                ruleDesc = "低于70%得0分，70%-100%线性得分，100%以上得满分。";
                break;
            case "BUDGET_DEDUCT":
                ruleType = "预算控制(扣分型)";
                ruleDesc = "X≤0%得满分，X＞0%每多1%扣罚1分，扣完为止。";
                break;
            case "BINARY_TASK":
                ruleType = "任务节点(二元型)";
                ruleDesc = "按期发布得满分，逾期或未发布得0分。";
                break;
            case "QUALITATIVE_100":
                ruleType = "定性测定(直接打分)";
                ruleDesc = "由主管主观打分，0-100分。";
                break;
            case "QUALITATIVE_LEVEL":
                ruleType = "定性分级";
                ruleDesc = "评定为：优秀、良好、普通、不合格。";
                break;
        }

        onSave({
            id: initialData?.id || Date.now().toString(),
            ...formData,
            ruleType,
            ruleDesc
        });
    };

    // 根据选中的规则动态展示预览组件
    const renderPreview = () => {
        const { ruleCode } = formData;

        // 阶梯机制通用计算
        const calculateStepScore = (val: number, min: number, max: number) => {
            if (val < min) return 0;
            if (val >= max) return 100;
            return Math.round(((val - min) / (max - min)) * 100);
        };

        if (ruleCode.startsWith("STEP_")) {
            let min = 70;
            let max = 90;
            if (ruleCode === "STEP_80_70") max = 80;
            if (ruleCode === "STEP_100_70") max = 100;

            const score = calculateStepScore(previewValue, min, max);

            return (
                <div className="space-y-6 mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                        </svg>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700">完成率模拟: {previewValue}%</span>
                        <Badge className={`${score >= 100 ? "bg-emerald-500 hover:bg-emerald-600" : score === 0 ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} text-white px-3 py-1 shadow-sm`}>
                            预计考核得分: {score} 分
                        </Badge>
                    </div>
                    <Slider
                        value={[previewValue]}
                        onValueChange={(v) => setPreviewValue(v[0])}
                        max={120}
                        step={1}
                        className="w-full mt-6"
                    />
                    <div className="relative w-full h-8 mt-2">
                        <span className="absolute left-0 text-xs text-slate-400 font-medium -translate-x-1/2">0%</span>
                        <span className="absolute text-xs text-slate-500 font-bold -translate-x-1/2 flex flex-col items-center" style={{ left: `${(min / 120) * 100}%` }}>
                            <span className="h-2 w-px bg-slate-400 mb-1"></span>
                            {min}% (零分线)
                        </span>
                        <span className="absolute text-xs text-blue-600 font-bold -translate-x-1/2 flex flex-col items-center" style={{ left: `${(max / 120) * 100}%` }}>
                            <span className="h-2 w-px bg-blue-300 mb-1"></span>
                            {max}% (满分线)
                        </span>
                        <span className="absolute right-0 text-xs text-slate-400 font-medium translate-x-1/2">120%</span>
                    </div>
                </div>
            );
        }

        if (ruleCode === "BUDGET_DEDUCT") {
            const score = Math.max(0, 100 - deductValue);
            return (
                <div className="space-y-6 mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700">超出预算模拟: {deductValue}%</span>
                        <Badge className={`${score >= 100 ? "bg-emerald-500" : score === 0 ? "bg-red-500" : "bg-orange-500"} text-white px-3 py-1`}>
                            预计考核得分: {score} 分
                        </Badge>
                    </div>
                    <Slider
                        value={[deductValue]}
                        onValueChange={(v) => setDeductValue(v[0])}
                        max={120}
                        step={1}
                        className="w-full mt-6 [&_[role=slider]]:border-orange-400 [&_[role=slider]]:focus-visible:ring-orange-400"
                    />
                    <div className="relative w-full h-8 mt-2">
                        <span className="absolute left-0 text-xs text-emerald-600 font-bold -translate-x-1/2 flex flex-col items-center">
                            <span className="h-2 w-px bg-emerald-300 mb-1"></span>
                            ≤0% (满分线)
                        </span>
                        <span className="absolute right-0 text-xs text-red-500 font-bold -translate-x-1/2 flex flex-col items-center" style={{ left: `${(100 / 120) * 100}%` }}>
                            <span className="h-2 w-px bg-red-300 mb-1"></span>
                            100% (扣完线)
                        </span>
                        <span className="absolute right-0 text-xs text-slate-400 font-medium translate-x-1/2">120%</span>
                    </div>
                </div>
            );
        }

        if (ruleCode === "BINARY_TASK") {
            return (
                <div className="space-y-4 mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-700 mb-3">任务状态模拟</p>
                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1 hover:bg-emerald-50 hover:text-emerald-700 border-emerald-200 text-emerald-600 bg-white">
                            已按期完成 (100分)
                        </Button>
                        <Button variant="outline" className="flex-1 hover:bg-red-50 hover:text-red-700 border-red-200 text-red-500 bg-white">
                            未完成/逾期 (0分)
                        </Button>
                    </div>
                </div>
            );
        }

        if (ruleCode === "QUALITATIVE_LEVEL") {
            return (
                <div className="space-y-4 mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-700 mb-3">定性评级模拟</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <Button variant="outline" className="hover:bg-blue-50 bg-white border-blue-200 text-blue-700">优秀 (100分)</Button>
                        <Button variant="outline" className="hover:bg-slate-100 bg-white text-slate-700">良好 (80分)</Button>
                        <Button variant="outline" className="hover:bg-slate-100 bg-white text-slate-700">普通 (60分)</Button>
                        <Button variant="outline" className="text-red-500 hover:bg-red-50 bg-white border-red-200 hover:border-red-300">不合格 (0分)</Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-sm text-slate-500 min-h-[100px] shadow-sm">
                通用打分预设，直接由考核人在月底输入 0-100 的数值。
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[620px] gap-0 p-0 overflow-hidden shadow-2xl rounded-xl">
                <DialogHeader className="px-6 py-5 border-b bg-white">
                    <DialogTitle className="text-xl font-bold text-slate-800">{initialData ? "编辑指标配置元数据" : "新增指标配置元数据"}</DialogTitle>
                    <DialogDescription className="mt-1.5 text-slate-500 leading-relaxed">
                        采用向导模式配置指标元数据，配置完成后，可配置成考核目标分发汇入各个业务或职能部门的月底绩效报表中。
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-6 pb-2 bg-slate-50/30">
                    <Tabs value={`step-${step}`} className="w-full">
                        <TabsContent value="step-1" className="space-y-5 mt-0 outline-none">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-700 font-semibold">指标名称</Label>
                                    <Input
                                        id="name"
                                        className="h-10"
                                        placeholder="例如: 月度大单品销售达成率"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-semibold">所属维度分类</Label>
                                        <Select value={formData.dimension} onValueChange={(v) => setFormData({ ...formData, dimension: v })}>
                                            <SelectTrigger className="h-10 bg-white">
                                                <SelectValue placeholder="选择所属维度" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="销售业绩">销售业绩</SelectItem>
                                                <SelectItem value="产品力">产品力</SelectItem>
                                                <SelectItem value="渠道力">渠道力</SelectItem>
                                                <SelectItem value="市场指标">市场指标</SelectItem>
                                                <SelectItem value="费用管理">费用管理</SelectItem>
                                                <SelectItem value="组织力">组织力</SelectItem>
                                                <SelectItem value="行动计划">行动计划</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-semibold">考核周期</Label>
                                        <Select value={formData.period} onValueChange={(v) => setFormData({ ...formData, period: v })}>
                                            <SelectTrigger className="h-10 bg-white">
                                                <SelectValue placeholder="选择考核周期" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="month">月度</SelectItem>
                                                <SelectItem value="quarter">季度</SelectItem>
                                                <SelectItem value="year">年度</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                            </div>
                        </TabsContent>


                        <TabsContent value="step-2" className="space-y-5 mt-0 outline-none">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold">考核记分规则</Label>
                                    <Select value={formData.ruleCode} onValueChange={(v) => { setFormData({ ...formData, ruleCode: v }); setPreviewValue(85); setDeductValue(0); }}>
                                        <SelectTrigger className="h-12 border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                                            <SelectValue placeholder="选择预设的记分逻辑" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="STEP_90_70">90/70阶梯制 (满分90%，底线70%)</SelectItem>
                                            <SelectItem value="STEP_80_70">80/70阶梯制 (满分80%，底线70%)</SelectItem>
                                            <SelectItem value="STEP_100_70">100/70阶梯制 (满分100%，底线70%)</SelectItem>
                                            <SelectItem value="BUDGET_DEDUCT">预算控制 (超出扣分型)</SelectItem>
                                            <SelectItem value="BINARY_TASK">任务节点 (完成即满分，逾期0分)</SelectItem>
                                            <SelectItem value="QUALITATIVE_100">定性测定 (直接打分)</SelectItem>
                                            <SelectItem value="QUALITATIVE_LEVEL">定性分级 (优秀/良好/普通/不合格)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-slate-500 ml-1 mt-1.5 leading-relaxed">该规则决定了该指标在月末是如何将“实际业务数值”自动转化成“绩效考分”的。</p>
                                </div>

                                {/* 实时预览区 */}
                                {renderPreview()}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className="px-6 py-4 bg-slate-50 border-t flex items-center justify-between sm:justify-between">
                    <div>
                        {step === 2 && (
                            <Button variant="outline" onClick={handleBack} className="bg-white hover:bg-slate-100 hover:text-slate-900 border-slate-200">
                                上一步
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose} className="hover:bg-slate-200/50">取消</Button>
                        {step === 1 ? (
                            <Button onClick={handleNext} disabled={!formData.name || !formData.dimension} className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                                下一步，配置记分规则
                            </Button>
                        ) : (
                            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium px-6">
                                完成配置并保存
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
