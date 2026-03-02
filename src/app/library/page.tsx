"use client";

import { useState } from "react";
import { Plus, SlidersHorizontal, Search, FileText } from "lucide-react";
import { IndicatorCard } from "@/components/library/IndicatorCard";
import { IndicatorWizard } from "@/components/library/IndicatorWizard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// 模拟的初始指标数据
const initialIndicators = [
    {
        id: "1",
        name: "主推大单品销售目标达成率",
        dimension: "产品力",
        ruleType: "90/70阶梯制(标准型)",
        ruleDesc: "低于70%得0分，70%-90%线性得分，90%以上得满分。",
        ruleCode: "STEP_90_70"
    },
    {
        id: "2",
        name: "新客户开发目标达成率",
        dimension: "市场指标",
        ruleType: "100/70阶梯制(严格型)",
        ruleDesc: "低于70%得0分，70%-100%线性得分，100%以上得满分甚至奖励。",
        ruleCode: "STEP_100_70"
    },
    {
        id: "3",
        name: "月度OT合格店打造积分达成率",
        dimension: "渠道力",
        ruleType: "80/70阶梯制(宽限型)",
        ruleDesc: "低于70%得0分，70%-80%线性得分，80%即可得满分。",
        ruleCode: "STEP_80_70"
    },
    {
        id: "4",
        name: "TP费用预算达标率",
        dimension: "费用管理",
        ruleType: "预算控制(扣分型)",
        ruleDesc: "预算费用超出部分按比例倒扣分，封底为0。",
        ruleCode: "BUDGET_DEDUCT"
    },
    {
        id: "5",
        name: "月度1+3行动计划通知达标率",
        dimension: "行动计划",
        ruleType: "任务节点(二元型)",
        ruleDesc: "按期发布得满分，逾期或未发布得0分。",
        ruleCode: "BINARY_TASK"
    },
    {
        id: "6",
        name: "跨部门协作评价",
        dimension: "组织力",
        ruleType: "定性测定(直接打分)",
        ruleDesc: "由相关部门主管直接主观打分，0-100分。",
        ruleCode: "QUALITATIVE_100"
    }
];

export default function IndicatorLibraryPage() {
    const [search, setSearch] = useState("");
    const [dimensionFilter, setDimensionFilter] = useState("all");
    const [ruleFilter, setRuleFilter] = useState("all");
    const [indicators, setIndicators] = useState(initialIndicators);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [editingIndicator, setEditingIndicator] = useState<any>(null);

    const filtered = indicators.filter((ind) => {
        const matchSearch = ind.name.includes(search);
        const matchDimension = dimensionFilter === "all" || ind.dimension === dimensionFilter;
        // Simplify rule matching by checking if ruleType includes the filter text
        const matchRule = ruleFilter === "all" || ind.ruleType.includes(ruleFilter);
        return matchSearch && matchDimension && matchRule;
    });

    const handleEdit = (indicator: any) => {
        setEditingIndicator(indicator);
        setIsWizardOpen(true);
    };

    const handleAddNew = () => {
        setEditingIndicator(null);
        setIsWizardOpen(true);
    };

    const handleSave = (newInd: any) => {
        if (editingIndicator) {
            setIndicators(indicators.map((i) => (i.id === newInd.id ? newInd : i)));
        } else {
            setIndicators([{ id: Date.now().toString(), ...newInd }, ...indicators]);
        }
        setIsWizardOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">企业指标元数据库</h1>
                    <p className="text-sm text-slate-500 mt-1">管理维护全公司所有业务及职能部门的考核考分元数据标准。</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-full md:w-56">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="搜索指标名称..."
                            className="pl-9 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Select value={dimensionFilter} onValueChange={setDimensionFilter}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="全部分类" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部分类</SelectItem>
                            <SelectItem value="销售业绩">销售业绩</SelectItem>
                            <SelectItem value="产品力">产品力</SelectItem>
                            <SelectItem value="市场指标">市场指标</SelectItem>
                            <SelectItem value="渠道力">渠道力</SelectItem>
                            <SelectItem value="费用管理">费用管理</SelectItem>
                            <SelectItem value="组织力">组织力</SelectItem>
                            <SelectItem value="行动计划">行动计划</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={ruleFilter} onValueChange={setRuleFilter}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="全部计分规则" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部计分规则</SelectItem>
                            <SelectItem value="阶梯制">阶梯制</SelectItem>
                            <SelectItem value="控制">预算扣分</SelectItem>
                            <SelectItem value="二元">节点二元</SelectItem>
                            <SelectItem value="定性">主观打分</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleAddNew} className="shrink-0">
                        <Plus className="mr-1.5 h-4 w-4" />
                        <span>新建指标</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filtered.map((ind) => (
                    <IndicatorCard key={ind.id} data={ind} onClick={() => handleEdit(ind)} />
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-500 border border-dashed rounded-lg bg-white">
                        <FileText className="h-8 w-8 mb-4 text-slate-300" />
                        <p>未找到符合条件的指标</p>
                    </div>
                )}
            </div>

            {isWizardOpen && (
                <IndicatorWizard
                    isOpen={isWizardOpen}
                    onClose={() => setIsWizardOpen(false)}
                    initialData={editingIndicator}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
