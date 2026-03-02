import pandas as pd
import json

file_path = r'd:\Zhuoxi\Projects\performance\脱骨侠线下销售2025财年绩效指标库.xlsx'
try:
    xls = pd.ExcelFile(file_path)
    dimensions = set()
    indicators = set()
    
    for sheet in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet).dropna(how='all').dropna(axis=1, how='all')
        df = df.fillna('')
        
        # Look for headers containing string 考核维度 or 指标名称
        dim_col = None
        ind_col = None
        
        # We assume the first few rows might contain the generic header "考核维度", "指标名称"
        # Find them
        for i, row in df.head(10).iterrows():
            for col in df.columns:
                val = str(row[col]).strip()
                if val == '考核维度':
                    dim_col = col
                elif val == '指标名称':
                    ind_col = col
                    
        if dim_col and ind_col:
            # Get values excluding the header row itself
            dims = df[dim_col].tolist()
            inds = df[ind_col].tolist()
            
            for d in dims:
                if str(d).strip() and str(d).strip() != '考核维度':
                    dimensions.add(str(d).strip())
            for i in inds:
                if str(i).strip() and str(i).strip() != '指标名称':
                    indicators.add(str(i).strip())
        else:
            # If not found exactly, check if columns are named directly
            for col in df.columns:
                if '考核维度' in str(col):
                    for val in df[col].dropna().tolist():
                        if str(val).strip(): dimensions.add(str(val).strip())
                if '指标名称' in str(col):
                    for val in df[col].dropna().tolist():
                        if str(val).strip(): indicators.add(str(val).strip())

    result = {
        '考核维度_dimensions': sorted(list(dimensions)),
        '指标名称_indicators': sorted(list(indicators))
    }

    with open(r'd:\Zhuoxi\Projects\performance\excel_summary.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
except Exception as e:
    print(f'Error: {e}')
