# 绩效考核系统后端 API 接口设计 (Yudao-Cloud 风格)

基于完整的 `database_schema_design.md` 以及前端交互，本规范严格遵循 **Yudao-Cloud（芋道源码）** 框架风格进行后端 API 接口设计。

**Yudao-Cloud 接口规范要素：**
- 管理后台 Base Path：`/admin-api`
- 业务模块前缀：`/perf` (Performance)
- REST 遵循动作化路径（代替纯资源化）：如 `/get`, `/page`, `/create`, `/update`, `/delete`, `/export-excel`。
- 请求/响应统一包裹在 `CommonResult<T>` 中。
- 列表查询一律采用 `GET` 挂参或者 `xxxPageReqVO`；增改操作采用 `POST/PUT` 结合 `xxxSaveReqVO`。

---

## 1. 企业指标库模块 (Indicator)
**控制类：`PerfIndicatorController`**  
**路径前缀：`/admin-api/perf/indicator`**

| 方法 | 路径 | 描述 | 请求VO范例 / 核心业务逻辑 |
| :--- | :--- | :--- | :--- |
| `GET` | `/page` | 获得企业指标分页 | `PerfIndicatorPageReqVO` (含 name, category 模糊查) |
| `GET` | `/list` | 获得企业指标列表(精简版) | `PerfIndicatorListReqVO` (用于下拉框选择) |
| `GET` | `/get?id={id}` | 获得企业指标详情 | |
| `POST` | `/create` | 创建企业指标 | `PerfIndicatorSaveReqVO` (包含 target_value, weight 等) |
| `PUT` | `/update` | 更新企业指标 | `PerfIndicatorSaveReqVO` |
| `DELETE` | `/delete?id={id}` | 删除企业指标 | 逻辑删除或停用状态 |
| `PUT` | `/update-status` | 修改指标状态 | 参数包含 `id` 及 `status` |
| `GET` | `/export-excel` | 导出企业指标 Excel | |

---

## 2. 指标计分规则模块 (Indicator Rule)
**控制类：`PerfIndicatorRuleController`**  
**路径前缀：`/admin-api/perf/indicator-rule`**

| 方法 | 路径 | 描述 | 请求VO范例 / 核心业务逻辑 |
| :--- | :--- | :--- | :--- |
| `GET` | `/page` | 获得计分规则分页 | `PerfIndicatorRulePageReqVO` |
| `GET` | `/list` | 获得计分规则列表(精简版) | `PerfIndicatorRuleListReqVO` (用于创建指标或调整模板时的下拉框选择) |
| `GET` | `/get?id={id}` | 获得计分规则详情 | 返回 `PerfIndicatorRuleRespVO` 包含真实的底层计算表达式。 |
| `POST` | `/create` | 创建计分规则 | `PerfIndicatorRuleSaveReqVO` |
| `PUT` | `/update` | 更新计分规则 | `PerfIndicatorRuleSaveReqVO` |
| `DELETE` | `/delete?id={id}` | 删除计分规则 | |

---

## 3. 考核模板构建模块 (Template)
**控制类：`PerfTemplateController`**  
**路径前缀：`/admin-api/perf/template`**

| 方法 | 路径 | 描述 | 请求VO范例 / 核心业务逻辑 |
| :--- | :--- | :--- | :--- |
| `GET` | `/page` | 获得考核模板分页 | `PerfTemplatePageReqVO` |
| `GET` | `/get?id={id}` | 获得考核模板详情 | 返回主表+包含的所有明细项(Item)列表。|
| `POST` | `/create` | 创建考核模板 | `PerfTemplateSaveReqVO` (支持**级联保存**明细 `items`) |
| `PUT` | `/update` | 更新考核模板 | 同上，实现明细的批量删插逻辑 |
| `DELETE` | `/delete?id={id}` | 删除考核模板 | |
| `PUT` | `/publish` | 生效下发考核模板 | 接收 `id`，将状态更新为生效(2)。 |

---

## 4. HR 考核周期管理模块 (Cycle)
**控制类：`PerfCycleController`**  
**路径前缀：`/admin-api/perf/cycle`**

| 方法 | 路径 | 描述 | 请求VO范例 / 核心业务逻辑 |
| :--- | :--- | :--- | :--- |
| `GET` | `/page` | 获得考核周期推演分页 | `PerfCyclePageReqVO` |
| `GET` | `/get?id={id}` | 获得考核周期详情 | |
| `POST` | `/create` | 创建/补充考核周期 | (若开启全自动模式，此接口可能仅留作后门补充用) |
| `PUT` | `/update-stage` | 强制干预流转阶段 | 特批时将会用于改写 `stage` (如强制进入打分) |
| `GET` | `/get-active-templates` | 获取当前周期生效模板 | 供HR查单使用。|

---

## 5. 员工与主管执行交互模块 (Assessment)
基于执行端视角拆分，可以归于 `PerfAssessmentController`。
**路径前缀：`/admin-api/perf/assessment`**

### 5.1 通用与员工操作
| 方法 | 路径 | 描述 | 请求VO范例 / 核心业务逻辑 |
| :--- | :--- | :--- | :--- |
| `GET` | `/my-page` | 员工：获得我的考核分页 | 内部直接获取当前登录人的 UserId 进行过滤查询。 |
| `GET` | `/get-detail?id={id}` | 员工/主管：获得成绩单明细| 返回 `PerfAssessmentRespVO` 并级联它的 `PerfAssessmentItemRespVO` 列表。 |
| `PUT` | `/confirm-goals` | 员工：誓师确认目标 | 传参 `id`，更新主单状态为 `CONFIRMED`。 |

### 5.2 主管考核评估操作
| 方法 | 路径 | 描述 | 请求VO范例 / 核心业务逻辑 |
| :--- | :--- | :--- | :--- |
| `GET` | `/team-page` | 主管：获取团队花名册分页 | 根据当前登录主管 UserId，匹配 `manager_id`。|
| `PUT` | `/item/update-target` | 主管：调整下属定量目标 | `PerfAssessmentItemSaveReqVO` (调整下达数值) |
| `PUT` | `/item/update-score` | 主管：更新单项打分与评语 | 覆写 `final_score`，存入 `manager_comment` 和 `attachment_url`。|
| `PUT` | `/submit-rating` | 主管：提交整体考核表 | 传参 `assessmentId`，业务侧结算定量与定性加权分，落盘总分并改变 `status` 为 `RATED`。 |

---

## 6. 独立工作日报模块 (Daily Report)
**控制类：`SysDailyReportController`** 或 `PerfDailyReportController` (如果归口不一致)  
**路径前缀：`/admin-api/perf/daily-report`**

| 方法 | 路径 | 描述 | 请求VO范例 / 核心业务逻辑 |
| :--- | :--- | :--- | :--- |
| `GET` | `/today-form-info` | 获取今日待填报元数据 | 组装该员工当月考核客观项等信息用于辅助渲染表单。|
| `POST` | `/create` | 提交今日工作日报 | 日报内容落库；同时使用 Spring Event 或 MQ 解耦触发 KPI 数据的累加操作。|
| `GET` | `/page` | 获取历史日报分页 | 支持员工查自身、主管查下属(传参控制或数据权限拦截)。|
| `GET` | `/get?id={id}` | 获取单篇日报详情 | 包含主表及填报的数据明细表列表。|

---

## 7. 全局统计与大盘看板 (Statistics & Dashboard)
**控制类：`PerfStatsController`**  
**路径前缀：`/admin-api/perf/stats`**

| 方法 | 路径 | 描述 | 请求VO范例 / 核心业务逻辑 |
| :--- | :--- | :--- | :--- |
| `GET` | `/todo-count` | 获得待办红点统筹数值 | 针对当前登录人返回对应的未签单、未打分数等聚合 Integer。|
| `GET` | `/dept-trend` | 获得战区/部门考核趋势 | 返回多维度数据供 Echarts 柱状/折线图渲染。 |
| `GET` | `/emp-ranking-list` | 获得员工绩效红黑榜列表 | 战区概览使用，带名次、分数等核心列。|

---
### 芋道架构 (Yudao-Cloud) 落地建议
1. **Mapper & Mybatis-Plus**：由于芋道原生集成了 Mybatis-Plus，请多加利用 `XxxMapper.java` 内部的 `LambdaQueryWrapper` 操作单表，复杂的成绩汇总再使用 `selectXXX` 自定义 XML。
2. **DTO / VO 映射**：使用 MapStruct 框架配置 `XxxConvert.java` 负责将 Entity 与各个 ReqVO/RespVO 进行深拷贝互转。
3. **数据权限规则 (Data Permission)**：芋道内置了行级数据权限。对于 `/team-page` 等接口，可以直接在方法上标上 `@DataPermission(enable = true)` 然后依靠部门负责人(主管)身份进行 SQL 自动拼接拦截。
