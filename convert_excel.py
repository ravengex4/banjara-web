import pandas as pd
import json
import math

try:
    df = pd.read_excel(r'C:\Users\osmng\OneDrive\Desktop\banjara-web-main\Visa_Requirements_Processing_Times.xlsx')
    # Replace NaN with None so json.dumps works, or just fillna
    df = df.fillna('')
    records = df.to_dict('records')
    
    with open(r'C:\Users\osmng\OneDrive\Desktop\banjara-web-main\frontend\src\visaRequirements.json', 'w', encoding='utf-8') as f:
        json.dump(records, f, indent=2)
    print("Successfully converted Excel to JSON.")
except Exception as e:
    print("Error:", e)
