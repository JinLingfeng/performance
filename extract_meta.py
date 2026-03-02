import pandas as pd
import json

file_path = r'd:\Zhuoxi\Projects\performance\脱骨侠线下销售2025财年绩效指标库.xlsx'
try:
    xls = pd.ExcelFile(file_path)
    result = {}
    for sheet in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet).dropna(how='all').dropna(axis=1, how='all')
        # Fill nan with empty string for JSON serialization
        df = df.fillna('')
        
        # We are interested in finding the types of "考核指标" (performance metrics).
        # We'll extract headers and uniquely identifying rows for metrics.
        
        # Save first 5 rows to understand the structure
        sample_data = df.head(5).to_dict(orient='records')
        
        # Check if there is a specific column for "考核指标" or "指标名称"
        columns = df.columns.tolist()
        metrics = []
        for col in columns:
            if isinstance(col, str) and any(x in col for x in ['指标', '考核项目', '项目', '类目', 'KPI']):
                metrics = df[col].dropna().unique().tolist()
                break
                
        # If no explicit column found, maybe just take the whole dataframe as dict
        
        result[sheet] = {
            'columns': columns,
            'identified_metrics_from_column': [m for m in metrics if m],
            'sample_data': sample_data
        }

    with open(r'd:\Zhuoxi\Projects\performance\excel_meta.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
except Exception as e:
    print(f'Error: {e}')
