import pandas as pd

file_path = r'd:\Zhuoxi\Projects\performance\脱骨侠线下销售2025财年绩效指标库.xlsx'
try:
    xls = pd.ExcelFile(file_path)
    for sheet in xls.sheet_names:
        print(f'\n=== Sheet: {sheet} ===')
        df = pd.read_excel(xls, sheet_name=sheet).dropna(how='all').dropna(axis=1, how='all')
        print(df.to_markdown(index=False))
except Exception as e:
    print(f'Error: {e}')
