import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, PlayCircle, Users } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">绩效总览</h2>
        <p className="text-muted-foreground mt-1">
          当前考核周期：2026年上半年（Q1-Q2）
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">参与考核总人数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground mt-1">较上周期增长 4%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">考核完成率</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <Progress value={76} className="mt-2 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待我处理</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">需在本周五前完成审批</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">S/A级比例</CardTitle>
            <PlayCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-xs text-muted-foreground mt-1">目标比例：不超过25%</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>最新考核动态</CardTitle>
            <CardDescription>
              列出最近提交或更新的下属绩效考核表
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>部门团队</TableHead>
                  <TableHead>当前阶段</TableHead>
                  <TableHead>综合自评</TableHead>
                  <TableHead>初评建议</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">李建国</TableCell>
                  <TableCell>研发中心 / 前端二组</TableCell>
                  <TableCell><Badge variant="secondary">主管面审中</Badge></TableCell>
                  <TableCell>A (超出预期)</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground line-clamp-1 w-[160px]" title="该周期内核心业务重构贡献突出，建议给予A级绩效">
                      该周期内核心业务重构贡献突出，建议给予A级绩效
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">审核</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">张晓梅</TableCell>
                  <TableCell>产品部 / 用户增长组</TableCell>
                  <TableCell><Badge variant="outline">等待自评</Badge></TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">提醒</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">王大伟</TableCell>
                  <TableCell>研发中心 / 后端架构</TableCell>
                  <TableCell><Badge variant="default" className="bg-green-600">已完结</Badge></TableCell>
                  <TableCell>B+ (符合预期)</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground line-clamp-1 w-[160px]" title="基础设施稳定性达标，产出稳定">
                      基础设施稳定性达标，产出稳定
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">详情</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">陈如一</TableCell>
                  <TableCell>设计部 / UI体验组</TableCell>
                  <TableCell><Badge variant="secondary">HR复核中</Badge></TableCell>
                  <TableCell>A (超出预期)</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground line-clamp-1 w-[160px]" title="主导的新版设计规范落地效果显著，团队协作成效好">
                      主导的新版改版落地效果显著...
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">详情</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>快捷操作</CardTitle>
            <CardDescription>高频管理入口</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col">
            <Button variant="outline" className="justify-start w-full">发起新一轮考核</Button>
            <Button variant="outline" className="justify-start w-full">配置评估模板</Button>
            <Button variant="outline" className="justify-start w-full">导出本月考核报表</Button>
            <Button variant="default" className="justify-start w-full mt-4">批量审批建议 (5)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
