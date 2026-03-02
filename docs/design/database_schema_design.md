# 绩效考核系统后端数据库设计方案 (MySQL)

基于我们已经完成的前端原型（包含指标库、模板配置、周期管理、员工目标派发及主管打分），下面为您设计一套适用于 **Spring Boot + MyBatis-Plus / JPA** 架构的 MySQL 关系型数据库底层表结构。

遵循您的“简单至上、可扩展”原则，去除了多余的冗余表，核心围绕这 9 张主表展开：

---

## 核心 E-R 关系说明
1. **指标管理** (`perf_indicator`): 企业级元数据字典。
2. **指标计分规则** (`perf_indicator_rule`): 独立的算分逻辑库。
3. **考核模板** (`perf_template`): HR 创建的岗位考核大纲。
4. **模板指标明细** (`perf_template_item`): 模板与指标的多对多映射（记录权重、目标值、规则ID）。
5. **考核周期实例** (`perf_cycle`): 系统按月自动生成的考核任务大盘。
6. **员工绩效主表** (`perf_assessment`): 具体到周期员工的绩效总表。
7. **员工绩效指标明细** (`perf_assessment_item`): 员工指标得分详情（含规则快照）。
8. **工作日报主表** (`sys_daily_report`): 独立的日常汇报记录。
9. **日报指标明细** (`sys_daily_report_item`): 日报关联填报的指标数据。

---

## 建表 SQL 语句 (提供具体字段设计)

```sql
-- ----------------------------
-- 1. 企业指标库主表 (Performance Indicator)
-- ----------------------------
CREATE TABLE `perf_indicator` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '指标名称 (如: 月度销售额KPI)',
  `category` varchar(50) NOT NULL COMMENT '指标分类 (如: 销售业绩/服务质量)',
  `nature` tinyint(2) NOT NULL COMMENT '指标性质 (1:系统测算定量 2:主管打分定性 3:综合评估)',
  `unit` varchar(20) DEFAULT NULL COMMENT '计量单位 (如: 元/次/%)',
  `description` varchar(500) DEFAULT NULL COMMENT '指标定义与考核说明',
  `rule_id` bigint(20) DEFAULT NULL COMMENT '默认关联的计分规则ID(可空，模板中可被覆盖)',
  `status` tinyint(2) DEFAULT '1' COMMENT '状态 (1:草稿 2:启用 3:停用)',
  `created_by` varchar(50) DEFAULT NULL COMMENT '创建人ID',
  `created_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业级绩效指标库';


-- ----------------------------
-- 2. 指标计分规则模型表 (Indicator Rule) - [新增独立实体]
-- ----------------------------
CREATE TABLE `perf_indicator_rule` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '规则名称 (如: 阶梯扣分法/直线比例法)',
  `type` varchar(50) NOT NULL COMMENT '规则类型 (如: STEP_DEDUCTION, DIRECT_RATIO, RANGE_SCORE)',
  `expression` text COMMENT '底层计分公式/脚本表达式(JSON/SpringEL/Aviator 等解析格式)',
  `description` varchar(500) DEFAULT NULL COMMENT '给HR看的自然语言业务解释',
  `created_by` varchar(50) DEFAULT NULL COMMENT '创建人ID',
  `created_time?` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='抽象的独立绩效计分策略/规则库';


-- ----------------------------
-- 3. 考核模板主表 (Performance Template)
-- ----------------------------
CREATE TABLE `perf_template` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '模板名称 (如: 销售专员标准考核模板)',
  `dept_id` bigint(20) NOT NULL COMMENT '适用部门ID',
  `dept_name` varchar(100) DEFAULT NULL COMMENT '适用部门名称 (冗余)',
  `status` tinyint(2) DEFAULT '1' COMMENT '状态 (1:草稿 2:已生效 3:已归档)',
  `created_by` varchar(50) DEFAULT NULL COMMENT '创建人ID',
  `created_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='岗位考核模板';


-- ----------------------------
-- 4. 模板-指标关联明细表 (Template Item)
-- ----------------------------
CREATE TABLE `perf_template_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `template_id` bigint(20) NOT NULL COMMENT '所属模板ID',
  `indicator_id` bigint(20) NOT NULL COMMENT '关联的指标ID',
  `rule_id` bigint(20) NOT NULL COMMENT '应用的计分规则ID (覆写指标库中的默认规则)',
  `weight` decimal(5,2) DEFAULT NULL COMMENT '权重(百分比，定性综合评价不填本项则为空)',
  `max_score` decimal(8,2) NOT NULL DEFAULT '100.00' COMMENT '该项指标满分 (通常定量100，当前定性主管评价要求为20)',
  `target_value` varchar(50) DEFAULT NULL COMMENT '目标考核基准值',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序序号',
  PRIMARY KEY (`id`),
  KEY `idx_template_id` (`template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='模板所包含的指标详情设定';


-- ----------------------------
-- 5. 考核周期主表 (Performance Cycle)
-- ----------------------------
CREATE TABLE `perf_cycle` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '周期名称 (如: 2026年3月份月度绩效考核)',
  `cycle_type` varchar(20) NOT NULL DEFAULT 'MONTHLY' COMMENT '周期维度 (MONTHLY/QUARTERLY/YEARLY)',
  `start_date` date NOT NULL COMMENT '考核开始日期',
  `end_date` date NOT NULL COMMENT '考核结束日期',
  `stage` varchar(30) NOT NULL COMMENT '所处阶段 (GOAL_SETTING:目标设定/系统配置, PUBLISHED:下达签报, RATING:打分阶段, ARCHIVED:已归档)',
  `created_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '系统自动生成时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统按月生成的考核任务周期';


-- ----------------------------
-- 6. 员工绩效总表 (Employee Assessment)
-- ----------------------------
CREATE TABLE `perf_assessment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `cycle_id` bigint(20) NOT NULL COMMENT '所属考核周期ID',
  `template_id?` bigint(20) NOT NULL COMMENT '使用的考核模板ID',
  `emp_id` varchar(50) NOT NULL COMMENT '员工工号/用户ID',
  `emp_name` varchar(50) NOT NULL COMMENT '员工姓名',
  `manager_id` varchar(50) NOT NULL COMMENT '直属主管ID(打分人)',
  `status` varchar(30) NOT NULL COMMENT '员工个人考核流转状态 (PENDING_CONFIRM:待誓师确认, CONFIRMED:已签报, PENDING_RATING:待评分, RATED:考核评价完毕)',
  `final_quantitative_score` decimal(8,2) DEFAULT NULL COMMENT '最终汇算：定量类指标加权总分',
  `final_qualitative_score` decimal(8,2) DEFAULT NULL COMMENT '最终汇算：定性主管独立评价得分',
  `total_score` decimal(8,2) DEFAULT NULL COMMENT '期末总成绩(定量分+定性加分)',
  `confirmed_time` datetime DEFAULT NULL COMMENT '员工完成“我已签署并知晓”的时间',
  `rated_time` datetime DEFAULT NULL COMMENT '主管完成打分的具体时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cycle_emp` (`cycle_id`,`emp_id`),
  KEY `idx_manager` (`manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工按月生成的个人考核成绩单总表';


-- ----------------------------
-- 7. 员工各项绩效打分明细表 (Assessment Item)
-- ----------------------------
CREATE TABLE `perf_assessment_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `assessment_id` bigint(20) NOT NULL COMMENT '所属员工考核总表ID',
  `indicator_id` bigint(20) NOT NULL COMMENT '关联的企业指标ID',
  `rule_id` bigint(20) DEFAULT NULL COMMENT '算分瞬间使用的规则ID快照(防规则变更影响历史)',
  `actual_value` varchar(50) DEFAULT NULL COMMENT '阶段未获取的实际业务完成数值(如：81500元)',
  `system_score` decimal(8,2) DEFAULT NULL COMMENT '系统策略引擎按计分规则算出的原始初设分',
  `final_score` decimal(8,2) DEFAULT NULL COMMENT '该项最终计分 (未修则继承system_score; 主管调分则此项被覆盖)',
  `manager_comment` text COMMENT '调分依据/主管定性评语',
  `attachment_url` varchar(500) DEFAULT NULL COMMENT '佐证附件资源路径(逗号分隔存图片等链接)',
  `is_manual_adjusted` tinyint(1) DEFAULT '0' COMMENT '标识本项客观分数是否被主管干预调分过 (0:否 1:是)',
  PRIMARY KEY (`id`),
  KEY `idx_assessment_id` (`assessment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工个人各项绩效指标得失分明细与附件流转详情';


-- ----------------------------
-- 8. 员工工作日报主表 (Daily Report)
-- ----------------------------
CREATE TABLE `sys_daily_report` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `emp_id` varchar(50) NOT NULL COMMENT '员工工号/用户ID',
  `emp_name` varchar(50) NOT NULL COMMENT '员工姓名',
  `report_date` date NOT NULL COMMENT '日报归属日期',
  `work_summary` text COMMENT '今日工作总结 (富文本或纯文本)',
  `tomorrow_plan` text COMMENT '明日工作计划',
  `need_support` text COMMENT '需协调资源与遇到的困难',
  `status` tinyint(2) DEFAULT '0' COMMENT '状态 (0:草稿 1:已提交)',
  `created_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `submitted_time` datetime DEFAULT NULL COMMENT '提交时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_emp_date` (`emp_id`,`report_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='独立的员工每日工作汇报主表';


-- ----------------------------
-- 9. 员工日报-业务核心数据挂载明细表 (Daily Report Item)
-- ----------------------------
CREATE TABLE `sys_daily_report_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `report_id` bigint(20) NOT NULL COMMENT '所属日报主表ID',
  `indicator_id` bigint(20) DEFAULT NULL COMMENT '绑定的考核指标ID(若当前填报项映射了KPI指标则存入)',
  `metric_name` varchar(100) NOT NULL COMMENT '数据指标名称 (如: 今日新增签约额)',
  `metric_value` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '今日实际完成数值',
  `unit` varchar(20) DEFAULT NULL COMMENT '单位',
  PRIMARY KEY (`id`),
  KEY `idx_report_id` (`report_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工日报填写的核心业务数据明细';

```

### Spring Boot 项目架构及落地建议

1. **定量指标的自动算分如何优雅实现** (基于解耦后的独立规则库 `perf_indicator_rule`)：  
   剥离后，我们在 `perf_indicator_rule` 中定义了表达式 `expression` (例如 `(actual / target) * max_score`) 以及规则类型。
   在后台服务中，基于工厂模式或策略模式 (`Strategy Pattern`)，通过 `RuleEngineService` 结合像 **Spring EL / Aviator** 这样的脚本工具。
   当日报或外部数据汇入更新 `actual_value` 后，后端只需读取当时的 `rule_id` 及其 `expression`，替换其中的变量即可实时算出 `system_score`。这极大地增加了指标规则复用的灵活性（相同的销售指标，可以用在普通员工的宽容规则上，也可以用于销冠的严苛规则上）。
   
2. **定性主管评价 20 分独立无权重，怎么处理？**
   对于“主管综合评价”，只需要配置在 `perf_template_item`，此时 `weight` 字段可以为空，但 `max_score=20`。
   而在 Java 业务测的求总分服务 `AssessmentService.calculateTotal()` 里，可以单独将 `weight=null` 的考核项分数摘出来（比如满分20的主观得分：18分），累加到 `final_qualitative_score` 字段，以实现它“独立累积分数”的机制要求。

3. **每月25日的系统自动触发考核周期生成**
   用 Spring 原生最简单的 `spring-boot-starter-quartz` 或者简单的 `@Scheduled(cron = "0 0 1 25 * ?")`。
   在 Job 执行时：
   - 提取所有 `perf_template` 中 `status = 2`（生效）的模板。
   - 向 `perf_cycle` 插入一条记录：“YYYY年MM月月度绩效考核”。
   - 为相关部门下的有效员工（关联拉取 HR 用户表），根据模板在 `perf_assessment` 中批量落库初始化下月待处理记录。

4. **独立日报系统与绩效指标的“松耦合”联动架构**
   为了避免填报的颗粒度灾难，我们独立设计了上述表 `sys_daily_report` 和表 `sys_daily_report_item`。联动架构逻辑如下：
   - **采集端独立**：员工每天填写的是一份完整包含了主客观图文的独立日报。
   - **暴露打卡桩**：当且仅当员工的当月考核大纲里有需要“手工填报”的客观项时，前端读取 `perf_assessment` 里的具体指标，并在日报的“数据填报区”自动生成对应的 Input 输入框。
   - **异步清洗累加机制**：通过在 Spring Boot 中应用 **Spring Event 或 RabbitMQ / RocketMQ** 消息总线。当员工点击“提交今日日报”时：
     1. 首先落库保存日报主子表。
     2. 紧接着发布一条 `DailyReportSubmittedEvent` 消息。
     3. 绩效考核服务监听到该事件，将 `indicator_id` 不为空的 `metric_value` 值提取出来，定位到当前周期的 `perf_assessment_item` 表中，执行累加操作 `actual_value = actual_value + 今日新增值`。
   - **极致解耦**：这种架构下，日报系统是纯粹的过程追踪器，绩效系统是纯粹的结果核算器。两者的边界清晰互相独立，还能无缝实现数据映射。
