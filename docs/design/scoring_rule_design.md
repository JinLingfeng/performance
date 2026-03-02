# 绩效考核核心计分规则引擎设计方案

为了实现业务中复杂的“90/70规则”、“完成率算分”及“阶梯扣分”，我们将计分逻辑从硬编码中剥离，采用由 **AviatorScript (高性能表达式引擎)** 驱动的动态规则架构。

---

## 1. 核心设计思想：逻辑配置化
计分规则不再由 Java 代码的 `if-else` 实现，而是通过数据库 `perf_indicator_rule` 表中的 `expression` 字段存储可执行的逻辑表达式。

### 规则执行流程
1. **数据汇聚**：后台任务或日报同步将业务数据更新至 `perf_assessment_item` 的 `actual_value`。
2. **规则加载**：系统读取该绩效项绑定的 `rule_id` 及其对应的 `expression`。
3. **变量注入**：将 `actual` (实际值)、`target` (目标值)、`max_score` (满分) 注入执行上下文。
4. **引擎运算**：Aviator 引擎解析字符串并返回计算结果，存入 `system_score`。

---

## 2. 典型业务规则的表达式定义指南

| 业务规则场景 | 规则演示 | 存储表达式 (Aviator 语法) |
| :--- | :--- | :--- |
| **完成率线性增长** | 销售额达到多少得多少。 | `(actual / target) * max_score` |
| **90/70 阶梯制** | >=90得满分；>=70得80%分；否则0分。 | `actual >= 90 ? max_score : (actual >= 70 ? (max_score * 0.8) : 0)` |
| **负向指标扣分制** | 基础10分，每出1次错扣2分，扣完为止。 | `math.max(0, max_score - (actual * 2))` |
| **奖励/加分制** | 每超过目标1万，额外奖励5分。 | `actual > target ? (actual - target) / 10000 * 5 : 0` |

---

## 3. 后端 Java 落地实现 (Spring Boot)

推荐使用 **Google 旗下的开源引擎 AviatorScript**，具有接近 Java 原生运行速度的特点。

### 3.1 Maven 依赖
```xml
<dependency>
    <groupId>com.googlecode.aviator</groupId>
    <artifactId>aviator</artifactId>
    <version>5.3.3</version>
</dependency>
```

### 3.2 计分核心代码实现
```java
@Service
public class PerformanceRuleEngine {

    /**
     * 根据动态规则表达式执行算分
     * @param actual 员工实际值
     * @param target 标准目标值
     * @param maxScore 某项满分
     * @param expression 数据库存的表达式，如: "actual >= 90 ? max_score : 0"
     */
    public BigDecimal execute(BigDecimal actual, BigDecimal target, BigDecimal maxScore, String expression) {
        // 1. 注入变量
        Map<String, Object> env = new HashMap<>();
        env.put("actual", actual);
        env.put("target", target);
        env.put("max_score", maxScore);

        try {
            // 2. 运行表达式
            Object result = AviatorEvaluator.execute(expression, env);
            
            // 3. 结果处理（保留2位小数）
            return new BigDecimal(result.toString()).setScale(2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            log.error("规则解析失败:[{}]", expression, e);
            return BigDecimal.ZERO; // 异常兜底
        }
    }
}
```

---

## 4. 前端交互设计：可视化规则转换器

为了不让 HR 直接编写代码，前端 UI 会进行适配：

1. **模板化选择**：前端预设“阶梯制”、“扣分制”等模版。
2. **可视化表单**：
   - 展现：`如果 [实际完成] [大于等于] [ 90 ] 则得 [ 100 ]% 的分数`。
3. **数据封装**：前端通过代码逻辑，将 HR 填写的数值转化为三元运算格式存入后端：
   - `input_90` + `input_100%` => `actual >= 90 ? max_score * 1.0 : ...`

---

## 5. 扩展性说明
- **快照记录**：当周期开启时，建议将当时生效的 `expression` 字符串拷贝到考核明细表。这样即使 HR 在下个月修改了规则，本月历史数据的算分逻辑也不会乱。
- **业务函数库**：可以通过 Aviator 自定义函数功能，在后端扩展复杂的业务函数，例如 `get_last_month_avg(empId)` 直接在表达式里调用。
