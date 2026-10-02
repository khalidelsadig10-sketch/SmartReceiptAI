# الفصل الثالث: التحليل والتصميم (Analysis & Design)

## 3.1 مقدمة

يتناول هذا الفصل التحليل والتصميم التفصيلي لنظام **SmartReceiptAI** باستخدام مخططات لغة النمذجة الموحدة (UML). يهدف النظام إلى معالجة الفواتير والإيصالات باستخدام تقنيات الذكاء الاصطناعي (OpenAI Vision) لاستخراج البيانات المهيكلة تلقائياً من صور الفواتير، مع توفير لوحة تحكم تحليلية شاملة وتقارير مالية متقدمة.

### التقنيات المستخدمة

| الطبقة | التقنية |
|--------|---------|
| Backend Framework | FastAPI (Python) |
| Database | MySQL via SQLAlchemy ORM |
| AI Engine | OpenAI Vision API (GPT-5.6) |
| Authentication | JWT (JSON Web Tokens) + Password Hashing (Argon2) |
| Frontend | HTML/CSS/JavaScript (Static Pages) |
| Email Service | Resend API |
| PDF Processing | PyMuPDF |

---

## 3.2 مخطط حالات الاستخدام (Use Case Diagram)

يوضح هذا المخطط الفاعلين (Actors) الرئيسيين في النظام وحالات الاستخدام المتاحة لكل منهم.

```mermaid
graph TB
    subgraph System["نظام SmartReceiptAI"]
        UC1["تسجيل حساب جديد"]
        UC2["تسجيل الدخول"]
        UC3["استعادة كلمة المرور"]
        UC4["رفع صورة فاتورة"]
        UC5["معالجة الفاتورة بالذكاء الاصطناعي"]
        UC6["عرض قائمة الفواتير"]
        UC7["عرض تفاصيل فاتورة"]
        UC8["تعديل بيانات فاتورة"]
        UC9["حذف فاتورة"]
        UC10["عرض لوحة التحكم"]
        UC11["عرض التحليلات المالية"]
        UC12["عرض التقارير"]
        UC13["تصدير التقارير"]
        UC14["عرض معلومات الذكاء الاصطناعي"]
        UC15["إدارة الإعدادات"]
        UC16["إدارة الملف الشخصي"]
        UC17["عرض الإشعارات"]
        UC18["إدارة الجلسات الأمنية"]
        UC19["إدارة المستخدمين"]
        UC20["عرض إحصائيات النظام"]
        UC21["قراءة رمز QR من الفاتورة"]
        UC22["معالجة دفعات متعددة"]
        UC23["تغيير كلمة المرور"]
    end

    User(("👤 المستخدم"))
    Admin(("🔑 المدير"))
    AI(("🤖 محرك OpenAI Vision"))
    Email(("📧 خدمة البريد الإلكتروني"))

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
    User --> UC11
    User --> UC12
    User --> UC13
    User --> UC14
    User --> UC15
    User --> UC16
    User --> UC17
    User --> UC18
    User --> UC22
    User --> UC23

    Admin --> UC19
    Admin --> UC20

    UC4 -.->|"<<include>>"| UC5
    UC4 -.->|"<<include>>"| UC21
    UC3 -.->|"<<include>>"| Email
    UC5 -.->|"<<include>>"| AI
```

---

## 3.3 وصف حالات الاستخدام الرئيسية

### 3.3.1 حالة الاستخدام: رفع ومعالجة فاتورة

| العنصر | الوصف |
|--------|-------|
| **الاسم** | رفع ومعالجة فاتورة |
| **الفاعل الرئيسي** | المستخدم المسجل |
| **الفاعلون الثانويون** | محرك OpenAI Vision، قاعدة البيانات |
| **الشرط المسبق** | المستخدم مسجل الدخول بتوكن JWT صالح |
| **المسار الأساسي** | 1. يرفع المستخدم صورة الفاتورة<br>2. النظام يحفظ الصورة في مجلد uploads<br>3. النظام يرسل الصورة لمحرك OpenAI Vision<br>4. المحرك يستخرج البيانات المهيكلة<br>5. النظام يقرأ رمز QR إن وُجد<br>6. النظام يُطبّع العملة (Currency Normalization)<br>7. النظام يُطبّع أسماء المنتجات<br>8. النظام يسترجع البيانات المالية المفقودة<br>9. النظام يتحقق من صحة البيانات<br>10. النظام يحفظ الفاتورة في قاعدة البيانات<br>11. النظام يرسل إشعاراً للمستخدم |
| **الشرط اللاحق** | الفاتورة محفوظة مع جميع بياناتها في قاعدة البيانات |
| **المسار البديل** | إذا فشل التحليل بالذكاء الاصطناعي، يُسجّل الخطأ ويُعاد رسالة فشل |

### 3.3.2 حالة الاستخدام: تسجيل الدخول

| العنصر | الوصف |
|--------|-------|
| **الاسم** | تسجيل الدخول |
| **الفاعل الرئيسي** | المستخدم |
| **الشرط المسبق** | المستخدم لديه حساب مسجل |
| **المسار الأساسي** | 1. يُدخل المستخدم البريد الإلكتروني وكلمة المرور<br>2. النظام يتحقق من البيانات<br>3. النظام ينشئ جلسة مستخدم<br>4. النظام يُصدر توكن JWT<br>5. يتم توجيه المستخدم للوحة التحكم |
| **الشرط اللاحق** | المستخدم مسجل الدخول بتوكن صالح |
| **المسار البديل** | بيانات خاطئة → رسالة خطأ "بيانات غير صحيحة" |

---

## 3.4 مخطط الفئات (Class Diagram)

يوضح هذا المخطط الفئات الرئيسية في النظام والعلاقات بينها.

```mermaid
classDiagram
    class UserModel {
        +int id
        +str full_name
        +str email
        +str profile_image
        +str password_hash
        +bool is_active
        +str role
        +datetime created_at
        +datetime updated_at
        +List~ReceiptModel~ receipts
        +UserSettingsModel settings
        +List~NotificationModel~ notifications
    }

    class ReceiptModel {
        +int id
        +int user_id
        +str merchant_name
        +str merchant_category
        +str merchant_address
        +str merchant_phone
        +str invoice_number
        +str receipt_date
        +str receipt_time
        +str currency
        +float subtotal
        +float tax
        +float tax_rate
        +float discount
        +float total
        +str payment_method
        +bool qr_detected
        +str qr_type
        +str qr_data
        +datetime created_at
        +datetime updated_at
        +List~ReceiptItemModel~ items
        +List~VisionAnalysisModel~ vision_analyses
        +List~ReceiptImageModel~ images
    }

    class ReceiptItemModel {
        +int id
        +int receipt_id
        +str name
        +float quantity
        +float unit_price
        +float total_price
    }

    class ReceiptImageModel {
        +int id
        +int receipt_id
        +str file_name
        +str file_path
        +str mime_type
        +datetime created_at
    }

    class VisionAnalysisModel {
        +int id
        +int receipt_id
        +str model_name
        +str status
        +str raw_response
        +str error_message
        +datetime created_at
    }

    class NotificationModel {
        +int id
        +int user_id
        +str type
        +str title
        +str message
        +bool is_read
        +int reference_id
        +datetime created_at
    }

    class UserSettingsModel {
        +int id
        +int user_id
        +str language
        +str currency
        +str timezone
        +bool email_notifications
        +bool processing_notifications
        +datetime created_at
        +datetime updated_at
    }

    class UserSessionModel {
        +int id
        +int user_id
        +str session_id
        +str user_agent
        +str ip_address
        +str device_name
        +datetime created_at
        +datetime last_active_at
        +datetime expires_at
        +bool revoked
        +datetime revoked_at
    }

    class PasswordResetTokenModel {
        +int id
        +int user_id
        +str token_hash
        +datetime expires_at
        +datetime used_at
        +datetime created_at
    }

    UserModel "1" --> "*" ReceiptModel : owns
    UserModel "1" --> "1" UserSettingsModel : has
    UserModel "1" --> "*" NotificationModel : receives
    UserModel "1" --> "*" UserSessionModel : has sessions
    UserModel "1" --> "*" PasswordResetTokenModel : requests reset

    ReceiptModel "1" --> "*" ReceiptItemModel : contains
    ReceiptModel "1" --> "*" ReceiptImageModel : has images
    ReceiptModel "1" --> "*" VisionAnalysisModel : analyzed by
```

---

## 3.5 مخطط فئات طبقة Schemas (Pydantic)

يوضح هذا المخطط نماذج التحقق من البيانات المستخدمة في الـ API.

```mermaid
classDiagram
    class Merchant {
        +str name
        +str category
        +str address
        +str phone
    }

    class ReceiptInfo {
        +str invoice_number
        +str date
        +str time
        +str currency
    }

    class ReceiptItem {
        +str name
        +float quantity
        +float unit_price
        +float total_price
    }

    class Financial {
        +float subtotal
        +float tax
        +float tax_rate
        +float discount
        +float total
    }

    class Payment {
        +str method
    }

    class Receipt {
        +Merchant merchant
        +ReceiptInfo receipt_info
        +List~ReceiptItem~ items
        +Financial financial
        +Payment payment
        +bool qr_detected
        +str qr_type
        +str qr_data
    }

    class RegisterRequest {
        +str full_name
        +EmailStr email
        +str password
    }

    class LoginRequest {
        +EmailStr email
        +str password
    }

    class AuthResponse {
        +bool success
        +str message
        +UserResponse user
        +str access_token
        +str token_type
    }

    Receipt --> Merchant
    Receipt --> ReceiptInfo
    Receipt --> "*" ReceiptItem
    Receipt --> Financial
    Receipt --> Payment
```

---

## 3.6 مخطط التسلسل (Sequence Diagram) — معالجة فاتورة

يوضح هذا المخطط التفاعلات بين المكونات عند رفع ومعالجة فاتورة.

```mermaid
sequenceDiagram
    actor User as المستخدم
    participant API as Receipt API Route
    participant Pipeline as ReceiptPipeline
    participant Vision as OpenAI Vision Engine
    participant QR as QR Code Reader
    participant CurrNorm as Currency Normalizer
    participant ProdNorm as Product Normalizer
    participant FinRec as Financial Recovery
    participant Validator as Receipt Validator
    participant Storage as Receipt Storage
    participant DB as MySQL Database

    User->>+API: POST /api/receipts/upload (image)
    API->>API: التحقق من JWT Token
    API->>API: حفظ الصورة في uploads/
    API->>+Pipeline: process(image_path, user_id)

    Pipeline->>+Vision: analyze(image_path)
    Vision->>Vision: تحويل الصورة إلى Base64
    Vision-->>-Pipeline: Receipt (بيانات مهيكلة)

    Pipeline->>+QR: read(image_path)
    QR-->>-Pipeline: QR Result (detected, type, data)

    Pipeline->>+CurrNorm: normalize(receipt)
    CurrNorm-->>-Pipeline: Receipt (عملة موحدة)

    Pipeline->>+ProdNorm: normalize(receipt)
    ProdNorm-->>-Pipeline: Receipt (أسماء منتجات نظيفة)

    Pipeline->>+FinRec: normalize(receipt)
    FinRec-->>-Pipeline: Receipt (بيانات مالية مسترجعة)

    Pipeline->>+Validator: validate(receipt)
    Validator-->>-Pipeline: ValidationResult

    Pipeline->>+Storage: save(db, receipt, image_path, user_id)
    Storage->>+DB: INSERT receipt
    DB-->>Storage: receipt_id
    Storage->>DB: INSERT receipt_items
    Storage->>DB: INSERT receipt_image
    Storage->>DB: INSERT vision_analysis
    Storage->>DB: INSERT notification
    Storage->>-DB: COMMIT
    Storage-->>-Pipeline: ReceiptModel

    Pipeline-->>-API: ProcessResult
    API-->>-User: JSON Response (success, receipt, validation)
```

---

## 3.7 مخطط التسلسل — تسجيل الدخول

```mermaid
sequenceDiagram
    actor User as المستخدم
    participant API as Auth API Route
    participant Security as Security Module
    participant Session as Session Manager
    participant DB as MySQL Database

    User->>+API: POST /api/auth/login (email, password)

    API->>+DB: البحث عن المستخدم بالبريد الإلكتروني
    DB-->>-API: UserModel أو null

    alt المستخدم غير موجود
        API-->>User: 401 - بيانات غير صحيحة
    end

    API->>+Security: verify_password(plain, hashed)
    Security-->>-API: true/false

    alt كلمة المرور خاطئة
        API-->>User: 401 - بيانات غير صحيحة
    end

    alt الحساب غير نشط
        API-->>User: 403 - الحساب معطل
    end

    API->>+Session: إنشاء جلسة جديدة
    Session->>DB: INSERT user_session
    Session-->>-API: session_id

    API->>+Security: create_access_token(user_id, session_id)
    Security-->>-API: JWT Token

    API-->>-User: 200 - AuthResponse (token, user)
```

---

## 3.8 مخطط التسلسل — استعادة كلمة المرور

```mermaid
sequenceDiagram
    actor User as المستخدم
    participant API as Auth API Route
    participant Security as Security Module
    participant Email as Email Service (Resend)
    participant DB as MySQL Database

    User->>+API: POST /api/auth/forgot-password (email)

    API->>+DB: البحث عن المستخدم بالبريد الإلكتروني
    DB-->>-API: UserModel أو null

    alt المستخدم موجود
        API->>API: توليد توكن عشوائي
        API->>+Security: hash(token)
        Security-->>-API: token_hash
        API->>DB: INSERT password_reset_token
        API->>+Email: send_password_reset_email(email, token)
        Email-->>-API: تم الإرسال
    end

    API-->>-User: 200 - "تم إرسال رابط إعادة التعيين"

    Note over User: المستخدم يفتح الرابط من البريد

    User->>+API: POST /api/auth/reset-password (token, new_password)
    API->>+DB: البحث عن التوكن
    DB-->>-API: PasswordResetTokenModel

    alt التوكن صالح وغير منتهي
        API->>+Security: hash_password(new_password)
        Security-->>-API: password_hash
        API->>DB: UPDATE user.password_hash
        API->>DB: UPDATE token.used_at
        API-->>User: 200 - "تم تغيير كلمة المرور"
    else التوكن منتهي أو مستخدم
        API-->>-User: 400 - "توكن غير صالح"
    end
```

---

## 3.9 مخطط النشاط (Activity Diagram) — خط معالجة الفاتورة

```mermaid
flowchart TD
    A([بداية]) --> B[رفع صورة الفاتورة]
    B --> C{التحقق من صيغة الملف}
    C -->|صيغة غير مدعومة| D[إرجاع رسالة خطأ]
    C -->|صيغة مدعومة| E[حفظ الصورة في مجلد uploads]
    E --> F[إرسال الصورة لـ OpenAI Vision]
    F --> G{نجاح التحليل؟}
    G -->|لا| H[تسجيل الخطأ وإرجاع رسالة فشل]
    G -->|نعم| I[استخراج البيانات المهيكلة]
    I --> J[قراءة رمز QR]
    J --> K{تم العثور على QR؟}
    K -->|نعم| L[حفظ بيانات QR]
    K -->|لا| M[تعيين qr_detected = false]
    L --> N[تطبيع العملة]
    M --> N
    N --> O[تطبيع أسماء المنتجات]
    O --> P[استرجاع البيانات المالية المفقودة]
    P --> Q[التحقق من صحة البيانات]
    Q --> R{هل البيانات صحيحة؟}
    R -->|لا - تحذيرات فقط| S[تسجيل التحذيرات]
    R -->|نعم| T[حفظ في قاعدة البيانات]
    S --> T
    T --> U[حفظ الفاتورة]
    U --> V[حفظ عناصر الفاتورة]
    V --> W[حفظ صورة الفاتورة]
    W --> X[حفظ نتيجة تحليل Vision]
    X --> Y[إرسال إشعار للمستخدم]
    Y --> Z[إرجاع النتيجة]
    Z --> AA([نهاية])
    D --> AA
    H --> AA
```

---

## 3.10 مخطط المكونات (Component Diagram)

يوضح هذا المخطط البنية المعمارية للنظام وطبقاته.

```mermaid
graph TB
    subgraph Frontend["طبقة العرض (Frontend)"]
        P1[index.html - الصفحة الرئيسية]
        P2[login.html - تسجيل الدخول]
        P3[register.html - التسجيل]
        P4[dashboard.html - لوحة التحكم]
        P5[receipts.html - الفواتير]
        P6[reports.html - التقارير]
        P7[analytics.html - التحليلات]
        P8[intelligence.html - الذكاء الاصطناعي]
        P9[settings.html - الإعدادات]
        P10[profile.html - الملف الشخصي]
        P11[notifications.html - الإشعارات]
        P12[security.html - الأمان]
        P13[admin.html - لوحة الإدارة]
    end

    subgraph APILayer["طبقة الـ API Routes"]
        R1[Auth Routes]
        R2[Receipt Routes]
        R3[Dashboard Routes]
        R4[Analytics Routes]
        R5[Reports Routes]
        R6[Intelligence Routes]
        R7[Settings Routes]
        R8[Notifications Routes]
        R9[Admin Routes]
    end

    subgraph ServiceLayer["طبقة الخدمات (Services)"]
        S1[ReceiptPipeline]
        S2[ReceiptStorage]
        S3[ReceiptRepository]
        S4[DashboardService]
        S5[AnalyticsService]
        S6[ReportsService]
        S7[IntelligenceService]
        S8[NotificationService]
    end

    subgraph CoreLayer["طبقة النواة (Core)"]
        C1[OpenAI Vision Engine]
        C2[Security - JWT & Password]
        C3[Receipt Validator]
        C4[Currency Normalizer]
        C5[Product Normalizer]
        C6[Financial Recovery]
        C7[QR Code Reader]
        C8[Email Service - Resend]
        C9[PDF Processor]
        C10[Config & Settings]
    end

    subgraph DataLayer["طبقة البيانات (Data Layer)"]
        DB[(MySQL Database)]
        FS[File System - uploads/]
    end

    subgraph External["خدمات خارجية"]
        OAI[OpenAI API]
        ResendAPI[Resend Email API]
    end

    Frontend --> APILayer
    APILayer --> ServiceLayer
    ServiceLayer --> CoreLayer
    ServiceLayer --> DataLayer
    CoreLayer --> External
    CoreLayer --> DataLayer
```

---

## 3.11 مخطط النشر (Deployment Diagram)

```mermaid
graph TB
    subgraph ClientDevice["جهاز العميل"]
        Browser[متصفح الويب]
    end

    subgraph Server["الخادم"]
        subgraph AppServer["خادم التطبيق"]
            Uvicorn[Uvicorn ASGI Server]
            FastAPI[FastAPI Application]
        end

        subgraph DBServer["خادم قاعدة البيانات"]
            MySQL[(MySQL Server)]
        end

        subgraph FileStorage["تخزين الملفات"]
            Uploads[مجلد uploads/]
            Assets[مجلد assets/]
        end
    end

    subgraph CloudServices["خدمات سحابية"]
        OpenAI[OpenAI API]
        Resend[Resend Email API]
    end

    Browser -->|HTTP/HTTPS| Uvicorn
    Uvicorn --> FastAPI
    FastAPI -->|SQLAlchemy ORM| MySQL
    FastAPI -->|File I/O| Uploads
    FastAPI -->|Static Files| Assets
    FastAPI -->|HTTPS API Call| OpenAI
    FastAPI -->|HTTPS API Call| Resend
```

---

## 3.12 مخطط الكيان والعلاقات (ERD)

يوضح هذا المخطط جداول قاعدة البيانات والعلاقات بينها.

```mermaid
erDiagram
    users {
        int id PK
        varchar full_name
        varchar email UK
        varchar profile_image
        varchar password_hash
        boolean is_active
        varchar role
        datetime created_at
        datetime updated_at
    }

    receipts {
        int id PK
        int user_id FK
        varchar merchant_name
        varchar merchant_category
        varchar merchant_address
        varchar merchant_phone
        varchar invoice_number
        varchar receipt_date
        varchar receipt_time
        varchar currency
        float subtotal
        float tax
        float tax_rate
        float discount
        float total
        varchar payment_method
        boolean qr_detected
        varchar qr_type
        text qr_data
        datetime created_at
        datetime updated_at
    }

    receipt_items {
        int id PK
        int receipt_id FK
        varchar name
        float quantity
        float unit_price
        float total_price
    }

    receipt_images {
        int id PK
        int receipt_id FK
        varchar file_name
        varchar file_path
        varchar mime_type
        datetime created_at
    }

    vision_analysis {
        int id PK
        int receipt_id FK
        varchar model_name
        varchar status
        text raw_response
        text error_message
        datetime created_at
    }

    notifications {
        int id PK
        int user_id FK
        varchar type
        varchar title
        text message
        boolean is_read
        int reference_id
        datetime created_at
    }

    user_settings {
        int id PK
        int user_id FK
        varchar language
        varchar currency
        varchar timezone
        boolean email_notifications
        boolean processing_notifications
        datetime created_at
        datetime updated_at
    }

    user_sessions {
        int id PK
        int user_id FK
        varchar session_id UK
        varchar user_agent
        varchar ip_address
        varchar device_name
        datetime created_at
        datetime last_active_at
        datetime expires_at
        boolean revoked
        datetime revoked_at
    }

    password_reset_tokens {
        int id PK
        int user_id FK
        varchar token_hash UK
        datetime expires_at
        datetime used_at
        datetime created_at
    }

    users ||--o{ receipts : "owns"
    users ||--o| user_settings : "has"
    users ||--o{ notifications : "receives"
    users ||--o{ user_sessions : "has"
    users ||--o{ password_reset_tokens : "requests"
    receipts ||--o{ receipt_items : "contains"
    receipts ||--o{ receipt_images : "has"
    receipts ||--o{ vision_analysis : "analyzed_by"
```

---

## 3.13 مخطط الحالة (State Diagram) — دورة حياة الفاتورة

```mermaid
stateDiagram-v2
    [*] --> Uploaded : رفع الصورة
    Uploaded --> Processing : بدء المعالجة

    state Processing {
        [*] --> VisionAnalysis : تحليل بالذكاء الاصطناعي
        VisionAnalysis --> QRReading : قراءة QR
        QRReading --> CurrencyNormalization : تطبيع العملة
        CurrencyNormalization --> ProductNormalization : تطبيع المنتجات
        ProductNormalization --> FinancialRecovery : استرجاع مالي
        FinancialRecovery --> Validation : التحقق
        Validation --> [*]
    }

    Processing --> Saved : حفظ ناجح
    Processing --> Failed : فشل المعالجة

    Saved --> Updated : تعديل بيانات
    Updated --> Saved : حفظ التعديلات
    Saved --> Deleted : حذف
    Failed --> [*] : إنهاء

    Deleted --> [*]
```

---

## 3.14 مخطط الحزم (Package Diagram)

```mermaid
graph TB
    subgraph app["📦 app"]
        subgraph api["📦 api"]
            subgraph routes["📦 routes"]
                auth_r[auth.py]
                receipt_r[receipt.py]
                dashboard_r[dashboard.py]
                analytics_r[analytics.py]
                reports_r[reports.py]
                intelligence_r[intelligence.py]
                settings_r[settings.py]
                notifications_r[notifications.py]
                admin_r[admin.py]
            end
        end

        subgraph models["📦 models"]
            user_m[user.py]
            receipt_m[receipt.py]
            receipt_item_m[receipt_item.py]
            receipt_image_m[receipt_image.py]
            vision_m[vision_analysis.py]
            notification_m[notification.py]
            settings_m[user_settings.py]
            session_m[user_session.py]
            token_m[password_reset_token.py]
        end

        subgraph schemas["📦 schemas"]
            auth_s[auth.py]
            receipt_s[receipt.py]
            dashboard_s[dashboard.py]
            analytics_s[analytics.py]
            intelligence_s[intelligence.py]
            reports_s[reports.py]
            settings_s[settings.py]
        end

        subgraph services["📦 services"]
            pipeline[receipt_pipeline.py]
            storage[receipt_storage.py]
            repository[receipt_repository.py]
            dashboard_svc[dashboard_service.py]
            analytics_svc[analytics_service.py]
            reports_svc[reports_service.py]
            intelligence_svc[intelligence_service.py]
            notification_svc[notification_service.py]
            qr_reader[qr_code_reader.py]
        end

        subgraph core["📦 core"]
            config[config.py]
            database[database.py]
            security[security.py]
            vision_engine[openai_vision_engine.py]
            validator[receipt_validator.py]
            currency_norm[currency_normalizer.py]
            product_norm[product_normalizer.py]
            financial_rec[financial_recovery.py]
            email[email.py]
            pdf[pdf_processor.py]
        end

        subgraph web["📦 web"]
            web_routes[routes.py]
        end

        main[main.py]
    end

    routes --> services
    routes --> schemas
    services --> models
    services --> core
    core --> database
    web --> models
    main --> routes
    main --> web
```

---

## 3.15 مخطط التسلسل — عرض لوحة التحكم

```mermaid
sequenceDiagram
    actor User as المستخدم
    participant Web as Web Browser
    participant API as Dashboard API Route
    participant Service as DashboardService
    participant DB as MySQL Database

    User->>+Web: فتح صفحة لوحة التحكم
    Web->>+API: GET /api/dashboard/stats
    API->>API: التحقق من JWT Token
    API->>+Service: get_stats(db, user_id)
    Service->>+DB: COUNT receipts WHERE user_id
    DB-->>Service: total_receipts
    Service->>DB: COUNT receipt_items
    DB-->>Service: total_items
    Service->>DB: SUM(total) receipts
    DB-->>Service: total_amount
    Service->>DB: AVG(total) receipts
    DB-->>Service: average_receipt
    Service->>DB: COUNT vision_analysis (success)
    DB-->>Service: successful
    Service->>DB: COUNT vision_analysis (failed)
    DB-->>-Service: failed
    Service-->>-API: StatsData
    API-->>-Web: JSON Response
    Web-->>-User: عرض الإحصائيات

    Web->>+API: GET /api/dashboard/recent
    API->>+Service: get_recent_receipts(db, user_id)
    Service->>+DB: SELECT receipts ORDER BY created_at DESC LIMIT 10
    DB-->>-Service: List of ReceiptModel
    Service-->>-API: recent_receipts
    API-->>-Web: JSON Response
    Web-->>User: عرض آخر الفواتير
```

---

## 3.16 مخطط التسلسل — إنشاء التقارير

```mermaid
sequenceDiagram
    actor User as المستخدم
    participant API as Reports API Route
    participant Service as ReportsService
    participant DB as MySQL Database

    User->>+API: GET /api/reports?start_date&end_date&format
    API->>API: التحقق من JWT Token
    API->>+Service: get_report(db, user_id, start_date, end_date)
    Service->>+DB: SELECT receipts WHERE user_id AND date range
    DB-->>-Service: List of ReceiptModel

    Service->>Service: حساب ملخص العملات
    Service->>Service: حساب طرق الدفع
    Service->>Service: حساب فئات التجار
    Service->>Service: حساب اتجاه المعالجة
    Service->>Service: حساب إحصائيات Vision
    Service->>Service: حساب إحصائيات QR

    Service-->>-API: ReportData

    alt format = json
        API-->>User: JSON Response
    else format = excel
        API->>API: إنشاء ملف Excel (openpyxl)
        API-->>User: Excel File Download
    else format = pdf
        API->>API: إنشاء ملف PDF
        API-->>-User: PDF File Download
    end
```

---

## 3.17 ملخص المخططات

| # | نوع المخطط | الغرض |
|---|-----------|-------|
| 1 | مخطط حالات الاستخدام (Use Case) | تحديد الفاعلين والوظائف الرئيسية للنظام |
| 2 | مخطط الفئات (Class Diagram) - Models | توضيح بنية البيانات والعلاقات في طبقة قاعدة البيانات |
| 3 | مخطط الفئات (Class Diagram) - Schemas | توضيح نماذج التحقق والاستجابة في الـ API |
| 4 | مخطط التسلسل - معالجة فاتورة | توضيح تدفق العمليات عند رفع ومعالجة فاتورة |
| 5 | مخطط التسلسل - تسجيل الدخول | توضيح عملية المصادقة وإصدار التوكن |
| 6 | مخطط التسلسل - استعادة كلمة المرور | توضيح عملية إعادة تعيين كلمة المرور |
| 7 | مخطط النشاط (Activity Diagram) | توضيح خطوات خط معالجة الفاتورة بالتفصيل |
| 8 | مخطط المكونات (Component Diagram) | توضيح البنية المعمارية وطبقات النظام |
| 9 | مخطط النشر (Deployment Diagram) | توضيح بيئة التشغيل والخدمات الخارجية |
| 10 | مخطط الكيان والعلاقات (ERD) | توضيح هيكل قاعدة البيانات والعلاقات بين الجداول |
| 11 | مخطط الحالة (State Diagram) | توضيح دورة حياة الفاتورة ومراحلها |
| 12 | مخطط الحزم (Package Diagram) | توضيح التنظيم الهيكلي لملفات المشروع |
| 13 | مخطط التسلسل - لوحة التحكم | توضيح تدفق البيانات عند عرض الإحصائيات |
| 14 | مخطط التسلسل - التقارير | توضيح عملية إنشاء وتصدير التقارير |

---

## 3.18 خاتمة الفصل

قدّم هذا الفصل تحليلاً وتصميماً شاملاً لنظام SmartReceiptAI باستخدام 14 مخططاً من مخططات UML تغطي جميع جوانب النظام:

- **الجانب الوظيفي**: من خلال مخططات حالات الاستخدام والتسلسل والنشاط
- **الجانب الهيكلي**: من خلال مخططات الفئات والكيانات والحزم والمكونات
- **الجانب السلوكي**: من خلال مخطط الحالة ومخططات التسلسل التفصيلية
- **الجانب التشغيلي**: من خلال مخطط النشر

يتميز النظام ببنية **متعددة الطبقات (Layered Architecture)** تفصل بين طبقة العرض (Frontend)، وطبقة واجهة البرمجة (API Routes)، وطبقة الخدمات (Services)، وطبقة النواة (Core)، وطبقة البيانات (Data Layer)، مما يسهّل الصيانة والتوسع.
