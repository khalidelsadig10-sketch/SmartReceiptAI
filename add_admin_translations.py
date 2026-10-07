import re

with open(r'g:\Smart\frontend\assets\js\language.js', 'r', encoding='utf-8') as f:
    content = f.read()

en_keys = {
    'integration_stats': '"GLOBAL INTEGRATION STATS"',
    'receipt_sources_overview': '"Receipt Sources Overview"',
    'total_digital_receipts': '"Total Digital Receipts"',
    'via_api': '"Via Integration API"',
    'total_scanned_receipts': '"Total Scanned Receipts"',
    'via_vision': '"Via AI Vision"',
    'active_api_keys': '"Active API Keys"'
}

ar_keys = {
    'integration_stats': '"إحصائيات الربط التقني العامة"',
    'receipt_sources_overview': '"نظرة عامة على مصادر الإيصالات"',
    'total_digital_receipts': '"إجمالي الفواتير الرقمية"',
    'via_api': '"عبر الـ API"',
    'total_scanned_receipts': '"إجمالي الفواتير الممسوحة"',
    'via_vision': '"عبر الذكاء الاصطناعي"',
    'active_api_keys': '"مفاتيح الـ API النشطة"'
}

# Add to en block before 'ar: {'
en_insert = "            /* Admin Keys */\n" + "\n".join([f"            {k}: {v}," for k,v in en_keys.items()]) + "\n\n        },\n\n        ar: {"
content = content.replace("        },\n\n        ar: {", en_insert)

# Add to ar block before '};'
ar_insert = "            /* Admin Keys */\n" + "\n".join([f"            {k}: {v}," for k,v in ar_keys.items()]) + "\n\n        };\n\n\n        const pageTitle ="
content = content.replace("        };\n\n\n        const pageTitle =", ar_insert)

with open(r'g:\Smart\frontend\assets\js\language.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
