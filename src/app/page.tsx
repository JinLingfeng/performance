import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CalendarDays, CheckCircle2, FileText, Target, Users, Star, ArrowRight, BookOpen, Layers } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 xl:px-8 pb-20 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">欢迎来到卓希集团绩效管理平台</h2>
        <p className="text-slate-500 mt-1">
          当前进行中的考核周期：2026年3月份初级销售KPI考核
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-blue-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">活跃考核周期</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1 <span className="text-sm font-normal text-slate-500 ml-1">个进行中</span></div>
            <Link href="/assessment/cycle" className="text-xs text-blue-600 hover:text-blue-700 mt-2 inline-flex items-center">
              前往控制台管理 <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-amber-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">待我确认目标</CardTitle>
            <Target className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1 <span className="text-sm font-normal text-slate-500 ml-1">项待签</span></div>
            <Link href="/assessment/my" className="text-xs text-amber-600 hover:text-amber-700 mt-2 inline-flex items-center">
              立即前往确认 <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">待我评价打分</CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2 <span className="text-sm font-normal text-slate-500 ml-1">人待评</span></div>
            <Link href="/assessment/rating" className="text-xs text-purple-600 hover:text-purple-700 mt-2 inline-flex items-center">
              前往打分大厅 <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-emerald-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">企业指标总库</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">124 <span className="text-sm font-normal text-slate-500 ml-1">个元指标</span></div>
            <Link href="/library" className="text-xs text-emerald-600 hover:text-emerald-700 mt-2 inline-flex items-center">
              维护与新建规则 <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">全景业务流程导航</CardTitle>
            <CardDescription>
              深入了解从指标设计到期末打分的完整管理闭环
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-l border-slate-200 ml-3 space-y-8 pb-4">

              <div className="relative pl-6">
                <span className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-white">
                  <BookOpen className="h-3 w-3 text-emerald-600" />
                </span>
                <h3 className="font-semibold text-slate-900">1. 指标元数据库建设</h3>
                <p className="mt-1 text-sm text-slate-500">维护企业所有考核可能用到的元数据字典与提取规则。</p>
                <Button variant="outline" size="sm" className="mt-3 text-slate-600" asChild>
                  <Link href="/library">进入企业指标库</Link>
                </Button>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 ring-8 ring-white">
                  <Layers className="h-3 w-3 text-indigo-600" />
                </span>
                <h3 className="font-semibold text-slate-900">2. 搭建考核模板</h3>
                <p className="mt-1 text-sm text-slate-500">将指标按权重拼装为针对不同岗位的打分模板。</p>
                <Button variant="outline" size="sm" className="mt-3 text-slate-600" asChild>
                  <Link href="/template">进入考核模板配置</Link>
                </Button>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
                  <CalendarDays className="h-3 w-3 text-blue-600" />
                </span>
                <h3 className="font-semibold text-slate-900">3. HR 发起考核周期</h3>
                <p className="mt-1 text-sm text-slate-500">新建考核月度、选定模板并向下属员工挂载。</p>
                <Button variant="outline" size="sm" className="mt-3 text-slate-600" asChild>
                  <Link href="/assessment/cycle">进入考核周期与发起</Link>
                </Button>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 ring-8 ring-white">
                  <Users className="h-3 w-3 text-sky-600" />
                </span>
                <h3 className="font-semibold text-slate-900">4. 主管下达考核目标</h3>
                <p className="mt-1 text-sm text-slate-500">部门负责人为下属的定量采集指标设定基准与要求值。</p>
                <Button variant="outline" size="sm" className="mt-3 text-slate-600" asChild>
                  <Link href="/assessment/team">进入团队目标设定</Link>
                </Button>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 ring-8 ring-white">
                  <Target className="h-3 w-3 text-amber-600" />
                </span>
                <h3 className="font-semibold text-slate-900">5. 员工确认目标誓师</h3>
                <p className="mt-1 text-sm text-slate-500">基层员工登录自身视角，签署自己这一个月的军令状。</p>
                <Button variant="outline" size="sm" className="mt-3 text-slate-600" asChild>
                  <Link href="/assessment/my">进入我的目标与确认</Link>
                </Button>
              </div>

              <div className="relative pl-6">
                <span className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 ring-8 ring-white">
                  <Star className="h-3 w-3 text-purple-600" />
                </span>
                <h3 className="font-semibold text-slate-900">6. 期末评定主观打分</h3>
                <p className="mt-1 text-sm text-slate-500">周期末，系统自动获取客观数据，由主管人工评判填报定性数据。</p>
                <Button variant="outline" size="sm" className="mt-3 text-slate-600" asChild>
                  <Link href="/assessment/rating">进入团队绩效评定打分</Link>
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 shadow-sm bg-slate-50/50">
          <CardHeader>
            <CardTitle>最新进度通报</CardTitle>
            <CardDescription>当前周期各流程进展状况</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">全员目标设定完成率</span>
                <span className="text-blue-600 font-bold">12 / 45</span>
              </div>
              <Progress value={26} className="h-2 bg-slate-200" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">员工誓师确认率</span>
                <span className="text-amber-600 font-bold">1 / 12</span>
              </div>
              <Progress value={8} className="h-2 bg-slate-200 [&>div]:bg-amber-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">期末打分完成率</span>
                <span className="text-purple-600 font-bold">0 / 45</span>
              </div>
              <Progress value={0} className="h-2 bg-slate-200 [&>div]:bg-purple-500" />
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-8">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm">系统通知</h4>
                  <p className="mt-1 text-sm text-blue-700 leading-relaxed">
                    本系统全流程模块（指标库 - 模板 - 发起 - 下达 - 确认 - 评价）均已开发演示完毕。请根据左侧全景导航逐一点击体验。
                  </p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
