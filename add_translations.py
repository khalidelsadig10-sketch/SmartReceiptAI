import re

with open(r'g:\Smart\frontend\assets\js\language.js', 'r', encoding='utf-8') as f:
    content = f.read()

en_keys = {
    'expenses_overview': '"Expenses Overview"',
    'last_7_days': '"Last 7 Days"',
    'last_30_days': '"Last 30 Days"',
    'last_90_days': '"Last 90 Days"',
    'this_year': '"This Year"',
    'all_time': '"All Time"',
    'integration': '"INTEGRATION"',
    'receipt_source': '"Receipt Source"',
    'system_name': '"System Name"',
    'system_name_placeholder': '"e.g. Hospital Billing System"',
    'org_name': '"Organization Name"',
    'org_name_placeholder': '"e.g. White Nile Hospital"',
    'generate_connect': '"Generate & Connect"',
    'api_key': '"API Key"',
    'api_key_placeholder': '"API Key will appear here"',
    'endpoint_url': '"Endpoint URL"',
    'disconnected': '"Disconnected"',
    'connected': '"Connected"',
    'digital': '"Digital"',
    'scanned': '"Scanned"'
}

ar_keys = {
    'expenses_overview': '"نظرة عامة على المصروفات"',
    'last_7_days': '"آخر 7 أيام"',
    'last_30_days': '"آخر 30 يوم"',
    'last_90_days': '"آخر 90 يوم"',
    'this_year': '"هذا العام"',
    'all_time': '"كل الوقت"',
    'integration': '"الربط التقني"',
    'receipt_source': '"مصدر الفواتير"',
    'system_name': '"اسم النظام"',
    'system_name_placeholder': '"مثال: نظام مستشفى النيل الأبيض"',
    'org_name': '"اسم المؤسسة"',
    'org_name_placeholder': '"مثال: مستشفى النيل الأبيض"',
    'generate_connect': '"توليد مفتاح وربط"',
    'api_key': '"مفتاح الربط (API Key)"',
    'api_key_placeholder': '"سيظهر مفتاح الربط هنا"',
    'endpoint_url': '"رابط الاستقبال (Endpoint)"',
    'disconnected': '"غير متصل"',
    'connected': '"متصل"',
    'digital': '"رقمي"',
    'scanned': '"ممسوح ضوئياً"'
}

# Add to en block before 'ar: {'
en_insert = "            /* New Keys */\n" + "\n".join([f"            {k}: {v}," for k,v in en_keys.items()]) + "\n\n        },\n\n        ar: {"
content = content.replace("        },\n\n        ar: {", en_insert)

# Add to ar block before '};'
ar_insert = "            /* New Keys */\n" + "\n".join([f"            {k}: {v}," for k,v in ar_keys.items()]) + "\n\n        };\n\n\n        const pageTitle ="
content = content.replace("        };\n\n\n        const pageTitle =", ar_insert)

with open(r'g:\Smart\frontend\assets\js\language.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
