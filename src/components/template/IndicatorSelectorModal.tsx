"use client";

import { useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for library indicators
const mockLibraryIndicators = [
    { id: "IND-001", name: "主推大单品销售目标达成率", dimension: "产品规格指标", ruleType: "90/70阶梯制(标准型)", ruleCode: "STEP_90_70" },
    { id: "IND-002", name: "新客网点开拓数量", dimension: "渠道拓展指标", ruleType: "每家奖励制", ruleCode: "PER_COUNT_BONUS" },
    { id: "IND-003", name: "客户拜访/巡店频率合格率", dimension: "日常动作评估", ruleType: "达标任务制", ruleCode: "BINARY_TASK" },
    { id: "IND-004", name: "重点商品退换货率控制", dimension: "质量售后指标", ruleType: "超标扣分制", ruleCode: "DEDUCT_EXCEED" },
    { id: "IND-005", name: "门店利润目标达成", dimension: "财务指标", ruleType: "100/70阶梯制", ruleCode: "STEP_100_70" },
    { id: "IND-006", name: "月度营销活动执行到位率", dimension: "运营企划指标", ruleType: "定性主观打分", ruleCode: "QUALITATIVE_100" },
    { id: "IND-007", name: "促销费用预算超支控制率", dimension: "财务指标", ruleType: "预算控制减分", ruleCode: "BUDGET_DEDUCT" },
];

export function IndicatorSelectorModal({ isOpen, onClose, onAdd }: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (selected: any[]) => void
}) {
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const filteredIndicators = mockLibraryIndicators.filter(
        ind => ind.name.includes(search) || ind.dimension.includes(search)
    );

    const handleToggle = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleConfirm = () => {
        const selectedItems = mockLibraryIndicators.filter(ind => selectedIds.includes(ind.id));
        onAdd(selectedItems);
        setSelectedIds([]); // reset
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>从企业指标库选取指标</DialogTitle>
                    <DialogDescription>
                        搜索并勾选您想加入到当前考核模板中的指标，加入后您可以在模板中配置它们的权重与数据来源。
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-3 py-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="搜索指标名称或归属维度..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border rounded-md">
                    <div className="bg-slate-50 border-b px-4 py-2 flex justify-between text-xs font-semibold text-slate-500">
                        <span>可选指标列表</span>
                        <span>已选 {selectedIds.length} 项</span>
                    </div>
                    <ScrollArea className="h-[300px]">
                        <div className="p-2 space-y-1">
                            {filteredIndicators.map((ind) => {
                                const isSelected = selectedIds.includes(ind.id);
                                return (
                                    <div
                                        key={ind.id}
                                        onClick={() => handleToggle(ind.id)}
                                        className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all border ${isSelected ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
                                    >
                                        <div className={`flex items-center justify-center h-5 w-5 rounded-full border ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                                            {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                        </div>
                                        <div className="flex flex-col flex-1 pl-1">
                                            <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{ind.name}</span>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] bg-white h-4 font-normal text-slate-500">{ind.dimension}</Badge>
                                                <span className="text-[10px] text-slate-400">计分: {ind.ruleType}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            {filteredIndicators.length === 0 && (
                                <div className="text-center py-10 text-slate-500 text-sm">
                                    未找到对应的指标项
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>取消</Button>
                    <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={selectedIds.length === 0}>
                        确认添加 ({selectedIds.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
