"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Database } from "lucide-react";

export function DailyReportPreviewModal({ isOpen, onClose, onConfirm, indicators }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    indicators: any[]
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>员工日报填报预览</DialogTitle>
                    <DialogDescription>
                        以下是根据您当前模板配置，员工在提交每日日志时看到的待办数据呈现。
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[500px] mt-2 rounded-md border p-6 bg-slate-50/50">
                    <div className="space-y-6">
                        {/* Fake Context Header */}
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                            <span className="text-sm font-semibold text-slate-800">2026年3月15日 日报</span>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600">待提交</Badge>
                        </div>

                        {indicators.length === 0 ? (
                            <div className="text-center py-10 text-xs text-slate-400">
                                模板当前没有任何指标
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {indicators.map((ind, i) => {
                                    const isManual = ind.dataSourceType === "manual";
                                    // Make different mock values so it looks dynamic
                                    const mockAchieved = i === 0 ? 24500 : (i === 2 ? 1 : 450);
                                    const mockTarget = i === 0 ? 50000 : (i === 2 ? 0 : 500);
                                    const progressPercent = Math.min(100, Math.max(0, (mockAchieved / (mockTarget || 1)) * 100));

                                    return (
                                        <div key={ind.id} className="bg-white border md:p-5 p-4 rounded-xl shadow-sm space-y-4">
                                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                                <Label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                    {isManual ? <FileText className="h-4 w-4 text-emerald-500" /> : <Database className="h-4 w-4 text-blue-500" />}
                                                    {ind.name}
                                                </Label>
                                                {!isManual && <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200 font-normal shadow-sm">系统自动提取</Badge>}
                                            </div>

                                            {isManual ? (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded-md border border-slate-100">
                                                        <span className="text-emerald-600 mr-1">📝 填报指引:</span>
                                                        {ind.dataSourceValue || "请输入今日完成数量..."}
                                                    </p>
                                                    <div className="relative pt-1">
                                                        <Input type="number" placeholder="填写今日实际完成数值" className="bg-white border-slate-300 shadow-sm focus-visible:ring-emerald-500" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50/50 rounded-lg p-3">
                                                    <div className="flex justify-between items-end mb-2">
                                                        <div>
                                                            <p className="text-[11px] text-slate-500 mb-1 font-medium">今日当前累计 ({ind.dataSourceValue})</p>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-2xl font-bold text-slate-800 font-mono tracking-tight">{mockAchieved.toLocaleString()}</span>
                                                                <span className="text-xs text-slate-400 font-mono">/ {mockTarget.toLocaleString()} (目标)</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-lg font-bold text-blue-600 font-mono">{progressPercent.toFixed(1)}%</span>
                                                        </div>
                                                    </div>
                                                    {/* Progress bar */}
                                                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mt-2">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                                            style={{ width: `${progressPercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-slate-700 items-center gap-2">今日工作总结与明日计划</Label>
                                    <textarea className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none h-20 shadow-sm" placeholder="工作总结..."></textarea>
                                </div>
                            </div>
                        )}
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm mt-4">提交今日日报</Button>
                    </div>
                </ScrollArea>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>取消</Button>
                    {onConfirm && <Button onClick={onConfirm} className="bg-emerald-600 hover:bg-emerald-700 text-white">已确认，界面无误</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
