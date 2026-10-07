with open(r'g:\Smart\frontend\assets\js\language.js', 'r', encoding='utf-8') as f:
    content = f.read()

# All missing EN keys
en_new = """
            all_time: "All Time",
            api_key: "API Key",
            appearance: "APPEARANCE",
            appearance_description: "Customize the look and feel of SmartReceiptAI.",
            connection_details: "Connection Details",
            connection_details_description: "API keys and connection status.",
            dashboard_subtitle: "Here\\'s what happened with your receipts.",
            disconnected: "Disconnected",
            endpoint_url: "Endpoint URL",
            expenses_overview: "Expenses Overview",
            generate_connect: "Generate & Connect",
            integration: "INTEGRATION",
            integration_settings: "Integration Settings",
            integration_settings_description: "Connect external systems to SmartReceiptAI.",
            last_30_days: "Last 30 Days",
            last_7_days: "Last 7 Days",
            last_90_days: "Last 90 Days",
            org_name: "Organization Name",
            system_configuration: "System Configuration",
            system_configuration_description: "Configure the external system details.",
            system_name: "System Name",
            take_photo: "Take Photo",
            theme: "THEME",
            theme_dark: "Dark",
            theme_dark_description: "Dark background, light text.",
            theme_light: "Light",
            theme_light_description: "Light background, dark text.",
            theme_system: "System",
            theme_system_description: "Follow the system preference.",
            this_year: "This Year",
            upgrade_account: "Upgrade Account",
"""

# All missing AR keys
ar_new = """
            all_time: "كل الوقت",
            api_key: "مفتاح الربط (API Key)",
            appearance: "المظهر",
            appearance_description: "تخصيص مظهر وأسلوب النظام.",
            connection_details: "تفاصيل الاتصال",
            connection_details_description: "مفاتيح الـ API وحالة الاتصال.",
            dashboard_subtitle: "إليك ما حدث مع فواتيرك.",
            disconnected: "غير متصل",
            endpoint_url: "رابط الاستقبال",
            expenses_overview: "نظرة عامة على المصروفات",
            generate_connect: "توليد مفتاح وربط",
            integration: "الربط التقني",
            integration_settings: "إعدادات الربط",
            integration_settings_description: "ربط الأنظمة الخارجية بـ SmartReceiptAI.",
            last_30_days: "آخر 30 يوم",
            last_7_days: "آخر 7 أيام",
            last_90_days: "آخر 90 يوم",
            org_name: "اسم المؤسسة",
            system_configuration: "إعداد النظام الخارجي",
            system_configuration_description: "إعداد تفاصيل النظام الخارجي.",
            system_name: "اسم النظام",
            take_photo: "التقاط صورة",
            theme: "المظهر",
            theme_dark: "داكن",
            theme_dark_description: "خلفية داكنة ونص فاتح.",
            theme_light: "فاتح",
            theme_light_description: "خلفية فاتحة ونص داكن.",
            theme_system: "تلقائي",
            theme_system_description: "اتباع إعداد النظام.",
            this_year: "هذا العام",
            upgrade_account: "ترقية الحساب",
"""

# Insert EN keys just before the ar: { section
if '/* New Keys */' in content:
    # Find the last occurrence of /* New Keys */ in the EN section
    en_marker = content.find("        },\n\n        ar: {")
    if en_marker != -1:
        content = content[:en_marker] + en_new + "\n" + content[en_marker:]

# Insert AR keys just before the }; that closes the ar block
ar_marker = content.rfind("        };\n\n\n        const pageTitle =")
if ar_marker != -1:
    content = content[:ar_marker] + ar_new + "\n" + content[ar_marker:]

with open(r'g:\Smart\frontend\assets\js\language.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! Added all missing keys.")
