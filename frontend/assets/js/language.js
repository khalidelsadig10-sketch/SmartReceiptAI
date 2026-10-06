/* =========================================================
   SmartReceiptAI — Global Language Manager
   English / Arabic
   LTR / RTL
   Global Application Language
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const LANGUAGE_KEY = "smartreceiptai_language";
    const DEFAULT_LANGUAGE = "en";

    const SUPPORTED_LANGUAGES = ["en", "ar"];


    /* =====================================================
       TRANSLATIONS
       Global translations for the whole application
    ===================================================== */

    const translations = {

        /* =================================================
           ENGLISH
        ================================================= */

        en: {

            /* =================================================
               NAVIGATION
            ================================================= */

            dashboard: "Dashboard",
            receipts: "Receipts",
            analytics: "Analytics",
            intelligence: "AI Intelligence",

            account: "Account",
            profile: "Profile",
            security: "Security",
            settings: "Settings",

            logout: "Logout",

            main: "MAIN",
            account_section: "ACCOUNT",


            /* =================================================
               DASHBOARD
            ================================================= */

            total_receipts: "Total Receipts",
            total_items: "Total Items",
            total_amount: "Total Amount",
            average_receipt: "Average Receipt",

            all_processed_receipts: "All processed receipts",
            items_extracted: "Items extracted",
            total_processed_amount: "Total processed amount",
            average_receipt_value: "Average receipt value",

            ai_processing: "AI PROCESSING",

            process_receipt: "Process a Receipt",

            upload_receipt_description:
                "Upload a receipt and let SmartReceiptAI analyze it.",

            single_receipt: "Single Receipt",

            single_receipt_description:
                "JPG, JPEG, PNG or WEBP up to 10 MB.",

            choose_receipt: "Choose Receipt",

            analyze_receipt: "Analyze Receipt",


            /* PDF */

            pdf_processing: "PDF Processing",

            pdf_processing_description:
                "Process receipts contained in PDF files.",

            drop_pdf: "Drop your PDF here",

            or_click_browse: "or click to browse",

            pdf_limit: "PDF • Maximum 10 MB",

            process_pdf: "Process PDF",


            /* Batch */

            batch_processing: "Batch Processing",

            batch_processing_description:
                "Process up to 100 receipt images at once.",

            drop_receipts: "Drop your receipts here",

            image_limit:
                "JPG, PNG, WEBP • Up to 100 files",

            analyze_batch: "Analyze Batch",


            /* Analysis */

            ai_result: "AI RESULT",

            analysis_result: "Analysis Result",

            analysis_result_description:
                "SmartReceiptAI extracted the following information.",

            ai_intelligence: "AI INTELLIGENCE",

            processing_overview: "Processing Overview",

            successful_analyses: "Successful Analyses",

            failed_analyses: "Failed Analyses",

            total_tax: "Total Tax",

            total_discount: "Total Discount",


            /* Recent Receipts */

            recent_receipts: "Recent Receipts",

            recent_receipts_description:
                "Your latest processed receipts.",

            merchant: "Merchant",
            invoice: "Invoice",
            date: "Date",
            total: "Total",
            payment: "Payment",
            action: "Action",

            loading_receipts: "Loading receipts...",

            no_receipts: "No receipts yet",

            no_receipts_description:
                "Upload your first receipt to start using SmartReceiptAI.",


            /* =================================================
               RECEIPTS
            ================================================= */

            receipt_details: "RECEIPT DETAILS",

            receipt: "Receipt",

            loading_receipt: "Loading receipt...",

            receipts_subtitle:
                "Manage, review and export your processed receipts.",

            successfully_analyzed: "Successfully analyzed",

            combined_receipt_value: "Combined receipt value",

            search_receipts:
                "Search receipts, merchants or invoice...",

            clear_search: "Clear search",

            filter_by_date: "Filter by date",

            filter_by_status: "Filter by status",

            sort_receipts: "Sort receipts",

            all_dates: "All dates",

            today: "Today",

            this_week: "This week",

            this_month: "This month",

            all_statuses: "All statuses",

            needs_review: "Needs review",

            newest_first: "Newest first",

            oldest_first: "Oldest first",

            amount_high_low: "Amount: High to Low",

            amount_low_high: "Amount: Low to High",

            csv: "CSV",

            comma_separated_values:
                "Comma-separated values",

            excel: "Excel",

            spreadsheet_file: "Spreadsheet file",

            filters: "Filters:",

            clear_all: "Clear all",

            receipt_management: "RECEIPT MANAGEMENT",

            all_receipts: "All Receipts",

            amount: "Amount",

            status: "Status",

            actions: "Actions",

            no_receipts_found: "No receipts found",

            no_matching_receipts:
                "There are no receipts matching your current filters.",

            clear_filters: "Clear Filters",

            showing: "Showing",

            showing_zero_receipts: "Showing 0 receipts",

            of: "of",

            previous_page: "Previous page",

            next_page: "Next page",

            view_receipt: "View receipt",

            edit_receipt: "Edit receipt",

            delete_receipt: "Delete receipt",

            original_receipt: "ORIGINAL RECEIPT",

            source_image: "Source image",

            loading_image: "Loading image...",

            image_unavailable: "Image unavailable",

            no_receipt_image:
                "No receipt image is attached to this record.",

            receipt_information: "RECEIPT INFORMATION",

            extracted_receipt_details:
                "Extracted receipt details",

            products_detected_from_receipt:
                "Products detected from receipt",

            financial_summary: "FINANCIAL SUMMARY",

            receipt_totals: "Receipt totals",

            merchant_information: "Merchant Information",

            business_details_extracted:
                "Business details extracted from the receipt",

            identification_payment_details:
                "Identification and payment details",

            invoice_number: "Invoice Number",

            receipt_date: "Receipt Date",

            receipt_time: "Receipt Time",

            time_example: "e.g. 14:35",

            payment_method: "Payment Method",

            financial_information: "Financial Information",

            correct_financial_values:
                "Correct the financial values when necessary",

            deleting: "Deleting...",

            receipt_not_found: "Receipt not found.",

            receipt_updated_successfully:
                "Receipt updated successfully.",

            failed_to_update_receipt:
                "Failed to update receipt.",

            receipt_deleted_successfully:
                "Receipt deleted successfully.",

            failed_to_delete_receipt:
                "Failed to delete receipt.",

            no_receipts_to_export:
                "There are no receipts to export.",

            receipts_exported_successfully:
                "Receipts exported successfully.",

            exported_to_excel:
                "exported to Excel",

            failed_to_export_excel:
                "Failed to export Excel.",

            receipt_image_could_not_be_displayed:
                "The receipt image could not be displayed.",

            receipt_details_load_failed:
                "Receipt details could not be loaded.",

            something_went_wrong:
                "Something went wrong. Please try again.",

            download_failed:
                "Download failed.",

            failed_to_load_receipts:
                "Failed to load receipts.",

            unable_to_load_receipts_try_again:
                "Unable to load receipts. Please try again.",

            profile_image: "Profile image",

            open_navigation: "Open navigation",


            /* =================================================
               PROFILE
            ================================================= */

            profile_description:
                "Manage your personal account information.",

            profile_image_section: "PROFILE IMAGE",

            your_photo: "Your Photo",

            choose_photo: "Choose Photo",

            remove_photo: "Remove Photo",

            profile_image_limit:
                "JPG, PNG or WEBP · Maximum 50 MB",

            account_information: "ACCOUNT INFORMATION",

            personal_details: "Personal Details",

            full_name: "Full Name",

            your_full_name: "Your full name",

            email: "Email",

            account_status: "Account Status",

            active: "Active",


            /* =================================================
               ANALYTICS
            ================================================= */

            smartreceiptai: "SMARTRECEIPTAI",

            analytics_subtitle:
                "Understand your receipt data and processing activity.",

            overview: "OVERVIEW",

            receipt_overview: "Receipt Overview",

            receipt_overview_description:
                "Key statistics from your processed receipts.",

            processed_receipts: "Processed receipts",

            extracted_items: "Extracted items",

            total_spending: "Total Spending",

            primary_currency: "Primary currency",

            financial: "FINANCIAL",

            financial_overview: "Financial Overview",

            financial_overview_description:
                "Totals grouped by the currency stored in your receipts.",

            loading_financial_data:
                "Loading financial data...",

            processing_activity: "PROCESSING ACTIVITY",

            receipts_processed_over_time:
                "Receipts Processed Over Time",

            processing_activity_description:
                "Activity based on when receipts were created in SmartReceiptAI.",

            no_processing_activity:
                "No processing activity yet",

            processing_activity_empty_description:
                "Processing activity will appear here when receipts are added.",

            payment_methods: "Payment Methods",

            no_payment_data:
                "No payment data available.",

            merchants: "MERCHANTS",

            merchant_categories: "Merchant Categories",

            no_merchant_category_data:
                "No merchant category data available.",

            vision_analysis: "VISION ANALYSIS",

            processing_performance:
                "Processing Performance",

            vision_analysis_description:
                "Actual Vision analysis results stored for your receipts.",

            success_rate: "Success Rate",

            no_analytics_data:
                "No Analytics Data Yet",

            analytics_empty_description:
                "Process your first receipt to start seeing analytics here.",

            multiple: "Multiple",

            multiple_currencies: "Multiple currencies",

            no_financial_data: "No financial data",

            no_financial_data_available:
                "No financial data is available yet.",

            average: "Average",

            no_data_available_yet:
                "No data available yet.",

            unable_to_load_analytics:
                "Unable to load analytics",

            unable_to_load_processing_activity:
                "Unable to load processing activity",

            request_failed: "Request failed.",

            reports: "Reports",

            reports_subtitle:
                "Generate reports from your processed receipts and activity.",

            report_builder:
                "REPORT BUILDER",

            create_a_report:
                "Create a Report",

            create_report_description:
                "Choose the period you want to analyze.",

            start_date:
                "Start Date",

            end_date:
                "End Date",

            generate_report:
                "Generate Report",

            report:
                "REPORT",

            generated_report:
                "Generated Report",

            download_pdf:
                "Download PDF",

            export_excel:
                "Export Excel",

            financial_summary:
                "Financial Summary",

            financial_summary_description:
                "Financial totals grouped by currency.",

            processing_activity_report:
                "Processing Activity",

            processing_activity_report_description:
                "Receipt processing grouped by date.",

            processing_qr_summary:
                "Processing & QR Summary",

            receipts_with_qr:
                "Receipts With QR",

            details:
                "DETAILS",

            receipt_details_description:
                "Receipts processed during the selected period.",

            quality:
                "QUALITY",

            single_currency_summary:
                "Single currency summary",

            no_report_generated:
                "No Report Generated",

            no_report_description:
                "Select a start and end date to generate a report from your receipt activity.",
            /* =================================================
               LOGIN / REGISTER
            ================================================= */

            login_page_title:
                "Login — SmartReceiptAI",

            login_welcome:
                "Welcome back",

            email_address:
                "Email Address",

            enter_your_email:
                "Enter your email",

            password:
                "Password",

            enter_your_password:
                "Enter your password",

            remember_me:
                "Remember me",

            forgot_password:
                "Forgot password?",

            login:
                "Login",

            signing_in:
                "Signing in...",

            dont_have_account:
                "Don't have an account?",

            create_account:
                "Create Account",

            register_page_title:
                "Create Account — SmartReceiptAI",

            create_your_account:
                "Create your account",

            enter_your_full_name:
                "Enter your full name",

            create_password:
                "Create a password",

            confirm_password:
                "Confirm Password",

            confirm_your_password:
                "Confirm your password",

            enter_a_password:
                "Enter a password",

            password_match:
                "Passwords match",

            password_do_not_match:
                "Passwords do not match",

            i_agree_to:
                "I agree to the",

            terms_conditions:
                "Terms & Conditions",

            and: "and",

            privacy_policy:
                "Privacy Policy",

            creating_account:
                "Creating account...",

            already_have_account:
                "Already have an account?",

            register_login:
                "Login",


            /* =================================================
               AI INTELLIGENCE
            ================================================= */

            intelligence_subtitle:
                "Understand how SmartReceiptAI analyzes, validates and structures your receipts.",

            ai_overview: "AI OVERVIEW",

            vision_processing: "Vision Processing",

            vision_processing_description:
                "Actual AI processing activity recorded for your account.",

            total_analyses: "Total Analyses",

            vision_analyses: "Vision analyses",

            successful: "Successful",

            completed_analyses: "Completed analyses",

            failed: "Failed",

            recorded_analysis_result:
                "Recorded analysis result",

            processing_pipeline:
                "PROCESSING PIPELINE",

            ai_receipt_pipeline:
                "AI Receipt Pipeline",

            ai_pipeline_description:
                "The processing stages currently implemented in SmartReceiptAI.",

            loading_ai_pipeline:
                "Loading AI pipeline...",

            vision_engine:
                "VISION ENGINE",

            vision_models:
                "Vision Models",

            vision_models_description:
                "Models recorded from actual receipt processing sessions.",

            loading_vision_models:
                "Loading vision models...",

            activity: "ACTIVITY",

            recent_ai_analyses:
                "Recent AI Analyses",

            recent_ai_analyses_description:
                "Recent Vision analysis records associated with your receipts.",

            model: "Model",

            created: "Created",

            loading_ai_analyses:
                "Loading AI analyses...",

            no_ai_processing:
                "No AI Processing Yet",

            no_ai_processing_description:
                "Process a receipt to start recording AI intelligence activity.",

            no_pipeline_information:
                "No pipeline information is available.",

            no_vision_model_activity:
                "No Vision model activity has been recorded yet.",

            vision_model: "Vision Model",

            analyses: "Analyses",

            unknown_model: "Unknown Model",

            unknown: "Unknown",

            no_ai_analysis_records:
                "No AI analysis records available yet.",

            unable_to_load_ai_intelligence:
                "Unable to load AI intelligence",

            unable_to_load_ai_analysis_records:
                "Unable to load AI analysis records.",

            ai_intelligence_data_unavailable:
                "AI intelligence data is unavailable.",

            logging_out: "Logging out...",


            /* =================================================
            CURRENT SMARTRECEIPTAI PIPELINE
            No OCR
            ================================================= */

            pipeline_vision:
                "OpenAI Vision",

            pipeline_currency:
                "Currency Normalization",

            pipeline_product:
                "Product Normalization",

            pipeline_financial_recovery:
                "Financial Recovery",

            pipeline_validation:
                "Receipt Validation",

            pipeline_storage:
                "Structured Storage",

            pipeline_vision_description:
                "Analyze the receipt image using OpenAI Vision.",

            pipeline_currency_description:
                "Normalize and standardize the currency information.",

            pipeline_product_description:
                "Clean and normalize product information.",

            pipeline_financial_recovery_description:
                "Recover and normalize financial information from the receipt.",

            pipeline_validation_description:
                "Check the processed receipt data for consistency and validity.",

            pipeline_storage_description:
                "Store the processed receipt, items, image, and vision analysis.",

            /* =================================================
               SETTINGS
            ================================================= */

            language: "Language",

            currency: "Currency",

            timezone: "Time Zone",

            english: "English",

            arabic: "Arabic",

            preferences: "Preferences",

            preferences_description:
                "Personalize your experience",

            preferences_status:
                "Preferences",

            general: "GENERAL",

            general_preferences:
                "General Preferences",

            general_preferences_description:
                "Configure how SmartReceiptAI displays and handles your account preferences.",

            settings_description:
                "Manage your SmartReceiptAI preferences and notifications.",

            application_language:
                "Application Language",

            choose_language:
                "Choose the language used by the application.",

            language_description:
                "Choose the language used by the application.",

            default_currency:
                "Default Currency",

            choose_currency:
                "Select your preferred receipt currency.",

            currency_description:
                "Select your preferred receipt currency.",

            time_zone:
                "Time Zone",

            time_zone_description:
                "Set the time zone used for account activity and timestamps.",

            currency_sdg:
                "Sudanese Pound (SDG)",

            currency_usd:
                "US Dollar (USD)",

            currency_eur:
                "Euro (EUR)",

            currency_gbp:
                "British Pound (GBP)",


            /* Notifications */

            notifications: "NOTIFICATIONS",

            notification_preferences:
                "Notification Preferences",

            notification_preferences_description:
                "Control which account and processing notifications you want to receive.",

            email_notifications:
                "Email Notifications",

            email_notifications_description:
                "Receive supported account notifications by email.",

            processing_notifications:
                "Processing Notifications",

            processing_notifications_description:
                "Receive notifications related to receipt processing.",


            /* Settings Actions */

            save_changes: "Save Changes",

            reset: "Reset",

            saving: "Saving...",

            loading: "Loading...",

            loading_settings:
                "Loading your settings...",

            preferences_saved:
                "Settings saved successfully.",

            settings_saved_message:
                "Your settings have been saved successfully.",

            settings_saved_toast:
                "Settings saved successfully.",

            settings_load_error:
                "Unable to load settings.",

            settings_save_error:
                "Unable to save settings.",

            changes_reset:
                "Changes have been reset.",

            system_preferences:
                "System Preferences",

            personalize_experience:
                "Personalize your experience",

            smartreceipt_settings:
                "SmartReceiptAI Settings",

            settings_footer:
                "Manage your personal application preferences.",

            settings_footer_description:
                "Manage your personal application preferences.",


            /* =================================================
               RECEIPT ANALYSIS RESULT
            ================================================= */

            valid_receipt: "Valid Receipt",

            review_required: "Review Required",

            unknown_merchant: "Unknown Merchant",

            time: "Time",

            currency_label: "Currency",

            products: "PRODUCTS",

            detected_items: "Detected Items",

            items: "Items",

            item: "Item",

            name: "Name",

            quantity: "Qty",

            unit_price: "Unit Price",

            subtotal: "Subtotal",

            tax: "Tax",

            discount: "Discount",

            warnings: "Warnings",

            validation_errors:
                "Validation Errors",

            no_items_detected:
                "No items detected.",

            successfully_processed:
                "Successfully processed",

            processed: "Processed",

            processing_complete:
                "Processing Complete",

            analysis: "Analysis",
            /* =========================================================
            ADMIN DASHBOARD
            ========================================================= */

            admin_dashboard: "Admin Dashboard",
            admin_access: "Admin Access",
            admin_overview: "Overview",
            administration: "Administration",

            monitor_users_receipts_activity:
                "Monitor users, receipts and system-level activity.",

            user_accounts: "User Accounts",
            accounts: "Accounts",

            user_status:
                "User Status",

            user_status_description:
                "Active and disabled account distribution.",

            access_roles:
                "ACCESS ROLES",

            user_roles:
                "User Roles",

            user_roles_description:
                "Distribution of administrator and regular accounts.",

            regular_users:
                "Regular Users",

            administrators:
                "Administrators",

            system_analytics:
                "SYSTEM ANALYTICS",

            user_activity:
                "User Activity",

            user_activity_description:
                "Registration activity and current system distribution.",

            user_registrations:
                "USER REGISTRATIONS",

            last_six_months:
                "Last 6 Months",

            system_snapshot:
                "SYSTEM SNAPSHOT",

            current_distribution:
                "Current Distribution",

            active_accounts:
                "Active Accounts",

            currently_enabled:
                "Currently enabled",

            disabled_accounts:
                "Disabled Accounts",

            currently_restricted:
                "Currently restricted",

            admin_accounts:
                "Accounts with admin role",

            processed_in_system:
                "Processed in system",

            receipt_analytics:
                "RECEIPT ANALYTICS",

            receipt_reports:
                "Receipt Reports",

            receipt_analytics_description:
                "System-wide receipt activity grouped by month, currency and user.",

            monthly_activity:
                "MONTHLY ACTIVITY",

            receipts_by_month:
                "Receipts by Month",

            currency_distribution:
                "CURRENCY DISTRIBUTION",

            receipts_by_currency:
                "Receipts by Currency",

            admin_user_activity:
                "USER ACTIVITY",

            receipts_by_user:
                "Receipts by User",

            system_receipts:
                "System Receipts",

            all_processed_receipts:
                "All processed receipts",

            search_admin_receipts:
                "Search by merchant, invoice, user or receipt ID...",

            search_admin_users:
                "Search by name, email or ID...",

            all_currencies:
                "All Currencies",

            all_users:
                "All Users",

            all_roles:
                "All Roles",

            admin_role:
                "Administrator",

            regular_role:
                "User",

            admin_all_status:
                "All Status",

            newest:
                "Newest",

            oldest:
                "Oldest",

            total_high_low:
                "Total High–Low",

            total_low_high:
                "Total Low–High",

            merchant_az:
                "Merchant A–Z",

            name_az:
                "Name A–Z",

            name_za:
                "Name Z–A",

            id_low_high:
                "ID Low–High",

            id_high_low:
                "ID High–Low",

            reset_filters:
                "Reset Filters",

            registered_users:
                "Registered Users",

            search_manage_accounts:
                "Search and manage account access",

            user_id:
                "User ID",

            current_admin:
                "Current Admin",

            create_administrator:
                "Create Administrator",

            create_admin_description:
                "Create a new account with administrator access.",

            enter_email:
                "Enter email address",

            minimum_password:
                "Minimum 8 characters",

            creating:
                "Creating...",

            unknown_user:
                "Unknown User",

            unknown_merchant:
                "Unknown Merchant",

            no_users_match:
                "No users match the current filters.",

            no_receipts_match:
                "No receipts match the current filters.",

            no_receipt_activity:
                "No receipt activity available.",

            no_currency_data:
                "No currency data available.",

            error_occurred:
                "An error occurred.",

            operation_completed:
                "Operation completed.",

            administrator_access_required:
                "Administrator access required.",

            user_details:
                "User Details",

            full_name:
                "Full Name",

            receipts_count:
                "Receipts",

            processing_information:
                "Processing Information",

            vision_analyses:
                "Vision Analyses",

            items_count:
                "Items",

            quantity_short:
                "Qty",

            unit_price_short:
                "Unit Price",

            admin_created_successfully:
                "Administrator account created successfully.",

            user_activated_successfully:
                "User account activated successfully.",

            user_disabled_successfully:
                "User account disabled successfully.",

            user_deleted_successfully:
                "User account deleted successfully.",

            receipt_deleted_successfully:
                "Receipt deleted successfully.",

            admin_data_refreshed:
                "Admin data refreshed successfully.",

            receipt_data_refreshed:
                "Receipt data refreshed successfully.",
             
            user: "User",
            sort: "Sort",

            /* =================================================
               WELCOME / LANDING PAGE
            ================================================= */

            welcome_brand_tagline:
                "Intelligent Receipt Processing",

            welcome_nav_home: "Home",

            welcome_nav_features: "Features",

            welcome_nav_how: "How It Works",

            welcome_nav_about: "About",

            welcome_nav_contact: "Contact",

            welcome_language:
                "Language",

            welcome_login: "Login",

            welcome_create_account:
                "Create Account",

            welcome_hero_tag:
                "AI Powered Receipt Intelligence",

            welcome_hero_title_first:
                "The Future of",

            welcome_hero_title_second:
                "Intelligent Receipt Processing",

            welcome_hero_description:
                "Transform your receipts into intelligent insights. SmartReceiptAI uses OpenAI Vision and advanced Artificial Intelligence to understand, extract, validate, and organize receipt data into meaningful information.",

            welcome_get_started:
                "Get Started",

            welcome_ai_processing_ready:
                "OpenAI Vision-powered receipt processing",

            welcome_total: "Total",

            welcome_ai_analysis_complete:
                "AI Analysis Complete",

            welcome_receipt_detected:
                "Receipt detected",

            welcome_ai_analysis:
                "OpenAI Vision Analysis",

            welcome_smart_insights:
                "Smart Insights",


            /* Features */

            welcome_features_label:
                "FEATURES",

            welcome_features_title:
                "Intelligent Processing. Meaningful Results.",

            welcome_features_description:
                "SmartReceiptAI combines OpenAI Vision, intelligent analysis, validation, financial processing, and structured data extraction in one intelligent system.",

            welcome_feature_vision_title:
                "OpenAI Vision",

            welcome_feature_vision_description:
                "Analyze receipt images using OpenAI Vision to understand and extract structured receipt information.",

            welcome_feature_extraction_title:
                "AI Data Extraction",

            welcome_feature_extraction_description:
                "Extract and organize receipt information, product details, and financial data from analyzed receipt images.",

            welcome_feature_financial_title:
                "Financial Processing",

            welcome_feature_financial_description:
                "Process totals, taxes, discounts, currencies, and other financial information extracted from receipts.",

            welcome_feature_insights_title:
                "Smart Insights",

            welcome_feature_insights_description:
                "Transform processed receipt information into structured and useful insights for analysis and understanding.",


            /* How It Works */

            welcome_how_label:
                "HOW IT WORKS",

            welcome_how_title:
                "From Receipt Image to Intelligent Data",

            welcome_how_description:
                "OpenAI Vision and the system's intelligent processing pipeline transform receipt images into validated and organized data.",

            welcome_step_upload:
                "Upload Receipt",

            welcome_step_upload_description:
                "Upload a supported receipt image to the system.",

            welcome_step_ai:
                "OpenAI Vision Analysis",

            welcome_step_ai_description:
                "OpenAI Vision analyzes the receipt image and identifies its relevant information.",

            welcome_step_extraction:
                "Intelligent Data Processing",

            welcome_step_extraction_description:
                "The system normalizes currency and product information and recovers financial data from the receipt.",

            welcome_step_validation:
                "Validation",

            welcome_step_validation_description:
                "The processed receipt data is checked for consistency and validity before storage.",

            welcome_step_insights:
                "Structured Results",

            welcome_step_insights_description:
                "The validated receipt is stored as structured data, including receipt details, products, financial information, image, and Vision analysis.",

            /* Supported Receipts */

            welcome_supported_label:
                "SUPPORTED RECEIPTS",

            welcome_supported_title:
                "Built for Different Receipt Types",

            welcome_supported_description:
                "SmartReceiptAI is designed to process the receipt categories supported by the implemented system.",

            welcome_receipt_supermarket:
                "Supermarket",

            welcome_receipt_supermarket_description:
                "Grocery and supermarket receipts.",

            welcome_receipt_pharmacy:
                "Pharmacy",

            welcome_receipt_pharmacy_description:
                "Pharmacy and medicine purchase receipts.",

            welcome_receipt_hospital:
                "Hospital",

            welcome_receipt_hospital_description:
                "Hospital and healthcare-related receipts.",

            welcome_receipt_restaurant:
                "Restaurant",

            welcome_receipt_restaurant_description:
                "Restaurant and food service receipts.",


            /* About */

            welcome_about_label:
                "ABOUT SMARTRECEIPTAI",

            welcome_about_title:
                "Intelligent Receipt Processing Powered by AI",

            welcome_about_description:
                "SmartReceiptAI is an AI-based receipt processing system designed to transform receipt images into structured and meaningful information using OpenAI Vision.",

            welcome_about_description_two:
                "The system combines image processing, OpenAI Vision analysis, data extraction, financial processing, validation, and intelligent data organization.",

            welcome_about_highlight_title:
                "From Image to Insight",

            welcome_about_highlight_description:
                "A structured AI-powered approach to understanding receipt information.",


            /* Contact */

            welcome_contact_label:
                "CONTACT US",

            welcome_contact_title:
                "Get in Touch",

            welcome_contact_description:
                "Have a question about SmartReceiptAI? Reach out through one of the available channels.",

            welcome_contact_email:
                "Email",

            welcome_contact_whatsapp:
                "WhatsApp",

            welcome_contact_facebook:
                "Facebook",

            welcome_contact_facebook_open:
                "Visit Facebook",


            /* Footer */

            welcome_footer_description:
                "Intelligent receipt processing powered by OpenAI Vision.",

            welcome_footer_navigation:
                "Navigation",

            welcome_footer_account:
                "Account",

            welcome_footer_social:
                "Social Links",

            welcome_all_rights_reserved:
                "All Rights Reserved.",


            /* =================================================
               SECURITY
            ================================================= */

            security_controls:
                "Security Controls",

            account_protection:
                "Account protection",

            security_description:
                "Manage your password and active account sessions.",

            account_security:
                "Account Security",

            change_password:
                "Change Password",

            change_password_description:
                "Update your account password securely.",

            account_password:
                "Account Password",

            strong_password_description:
                "Use a strong password to protect your account.",

            current_password:
                "Current Password",

            new_password:
                "New Password",

            confirm_new_password:
                "Confirm New Password",

            show_password:
                "Show password",

            hide_password:
                "Hide password",

            enter_new_password:
                "Enter a new password",

            password_requirement_length:
                "At least 8 characters",

            password_requirement_uppercase:
                "One uppercase letter",

            password_requirement_lowercase:
                "One lowercase letter",

            password_requirement_number:
                "One number",

            password_requirement_special:
                "One special character",

            sessions: "SESSIONS",

            active_sessions:
                "Active Sessions",

            active_sessions_description:
                "Devices currently signed in to your account.",

            refresh_sessions:
                "Refresh Sessions",

            sign_out_other_sessions:
                "Sign Out Other Sessions",

            loading_active_sessions:
                "Loading active sessions...",

            keep_account_secure:
                "Keep your account secure",

            keep_account_secure_description:
                "Review active sessions regularly and revoke devices you no longer recognize.",

            smartreceipt_security:
                "SmartReceiptAI Security",

            security_footer_description:
                "Manage your account protection securely.",


            /* =================================================
               COMMON
            ================================================= */

            cancel: "Cancel",

            close: "Close",

            save: "Save",

            delete: "Delete",

            edit: "Edit",

            view: "View",

            download: "Download",

            export: "Export",

            search: "Search",

            filter: "Filter",

            refresh: "Refresh",

            yes: "Yes",

            no: "No",

            success: "Success",

            error: "Error",

            warning: "Warning"
        },


        /* =================================================
           ARABIC
        ================================================= */

        ar: {

            /* =================================================
               NAVIGATION
            ================================================= */

            dashboard: "لوحة التحكم",

            receipts: "الإيصالات",

            analytics: "التحليلات",

            intelligence: "الذكاء الاصطناعي",

            account: "الحساب",

            profile: "الملف الشخصي",

            security: "الأمان",

            settings: "الإعدادات",

            logout: "تسجيل الخروج",

            main: "الرئيسية",

            account_section: "الحساب",
            /* =========================================================
            ADMIN DASHBOARD
            ========================================================= */

            admin_dashboard: "لوحة تحكم الإدارة",
            admin_access: "صلاحيات الإدارة",
            admin_overview: "نظرة عامة",
            administration: "الإدارة",

            monitor_users_receipts_activity:
                "مراقبة المستخدمين والإيصالات ونشاط النظام.",

            user_accounts: "حسابات المستخدمين",
            accounts: "الحسابات",

            user_status:
                "حالة المستخدمين",

            user_status_description:
                "توزيع الحسابات النشطة والمعطلة.",

            access_roles:
                "صلاحيات الوصول",

            user_roles:
                "أدوار المستخدمين",

            user_roles_description:
                "توزيع حسابات المديرين والمستخدمين العاديين.",

            regular_users:
                "المستخدمون العاديون",

            administrators:
                "المديرون",

            system_analytics:
                "تحليلات النظام",

            user_activity:
                "نشاط المستخدمين",

            user_activity_description:
                "نشاط التسجيل والتوزيع الحالي للنظام.",

            user_registrations:
                "تسجيلات المستخدمين",

            last_six_months:
                "آخر 6 أشهر",

            system_snapshot:
                "ملخص النظام",

            current_distribution:
                "التوزيع الحالي",

            active_accounts:
                "الحسابات النشطة",

            currently_enabled:
                "مفعلة حالياً",

            disabled_accounts:
                "الحسابات المعطلة",

            currently_restricted:
                "مقيدة حالياً",

            admin_accounts:
                "الحسابات التي تحمل صلاحية الإدارة",

            processed_in_system:
                "المعالجة داخل النظام",

            receipt_analytics:
                "تحليلات الإيصالات",

            receipt_reports:
                "تقارير الإيصالات",

            receipt_analytics_description:
                "نشاط الإيصالات على مستوى النظام حسب الشهر والعملة والمستخدم.",

            monthly_activity:
                "النشاط الشهري",

            receipts_by_month:
                "الإيصالات حسب الشهر",

            currency_distribution:
                "توزيع العملات",

            receipts_by_currency:
                "الإيصالات حسب العملة",

            admin_user_activity:
                "نشاط المستخدمين",

            receipts_by_user:
                "الإيصالات حسب المستخدم",

            system_receipts:
                "إيصالات النظام",

            all_processed_receipts:
                "جميع الإيصالات المعالجة",

            search_admin_receipts:
                "البحث باسم المتجر أو رقم الفاتورة أو المستخدم أو رقم الإيصال...",

            search_admin_users:
                "البحث بالاسم أو البريد الإلكتروني أو المعرّف...",

            all_currencies:
                "جميع العملات",

            all_users:
                "جميع المستخدمين",

            all_roles:
                "جميع الأدوار",

            admin_role:
                "مدير",

            regular_role:
                "مستخدم",

            admin_all_status:
                "جميع الحالات",

            newest:
                "الأحدث",

            oldest:
                "الأقدم",

            total_high_low:
                "الإجمالي من الأعلى إلى الأقل",

            total_low_high:
                "الإجمالي من الأقل إلى الأعلى",

            merchant_az:
                "المتجر من A إلى Z",

            name_az:
                "الاسم من A إلى Z",

            name_za:
                "الاسم من Z إلى A",

            id_low_high:
                "المعرّف من الأقل إلى الأعلى",

            id_high_low:
                "المعرّف من الأعلى إلى الأقل",

            reset_filters:
                "إعادة ضبط الفلاتر",

            registered_users:
                "المستخدمون المسجلون",

            search_manage_accounts:
                "البحث وإدارة صلاحيات الحسابات",

            user_id:
                "معرّف المستخدم",

            current_admin:
                "المدير الحالي",

            create_administrator:
                "إنشاء مدير",

            create_admin_description:
                "إنشاء حساب جديد بصلاحيات إدارية.",

            enter_email:
                "أدخل البريد الإلكتروني",

            minimum_password:
                "8 أحرف على الأقل",

            creating:
                "جارٍ الإنشاء...",

            unknown_user:
                "مستخدم غير معروف",

            unknown_merchant:
                "متجر غير معروف",

            no_users_match:
                "لا يوجد مستخدمون يطابقون الفلاتر الحالية.",

            no_receipts_match:
                "لا توجد إيصالات تطابق الفلاتر الحالية.",

            no_receipt_activity:
                "لا يوجد نشاط للإيصالات.",

            no_currency_data:
                "لا توجد بيانات عملات.",

            error_occurred:
                "حدث خطأ.",

            operation_completed:
                "تمت العملية بنجاح.",

            administrator_access_required:
                "يلزم الوصول بصلاحيات المدير.",

            user_details:
                "تفاصيل المستخدم",

            full_name:
                "الاسم الكامل",

            receipts_count:
                "الإيصالات",

            processing_information:
                "معلومات المعالجة",

            vision_analyses:
                "تحليلات الرؤية",

            items_count:
                "العناصر",

            quantity_short:
                "الكمية",

            unit_price_short:
                "سعر الوحدة",

            admin_created_successfully:
                "تم إنشاء حساب المدير بنجاح.",

            user_activated_successfully:
                "تم تفعيل حساب المستخدم بنجاح.",

            user_disabled_successfully:
                "تم تعطيل حساب المستخدم بنجاح.",

            user_deleted_successfully:
                "تم حذف حساب المستخدم بنجاح.",

            receipt_deleted_successfully:
                "تم حذف الإيصال بنجاح.",

            admin_data_refreshed:
                "تم تحديث بيانات الإدارة بنجاح.",

            receipt_data_refreshed:
                "تم تحديث بيانات الإيصالات بنجاح.",


            /* =================================================
               DASHBOARD
            ================================================= */

            total_receipts:
                "إجمالي الإيصالات",

            total_items:
                "إجمالي العناصر",

            total_amount:
                "إجمالي المبلغ",

            average_receipt:
                "متوسط الإيصال",

            all_processed_receipts:
                "جميع الإيصالات المعالجة",

            items_extracted:
                "العناصر المستخرجة",

            total_processed_amount:
                "إجمالي المبلغ المعالج",

            average_receipt_value:
                "متوسط قيمة الإيصال",

            ai_processing:
                "المعالجة بالذكاء الاصطناعي",

            process_receipt:
                "معالجة إيصال",

            upload_receipt_description:
                "ارفع إيصالًا ودع SmartReceiptAI يقوم بتحليله.",

            single_receipt:
                "إيصال واحد",

            single_receipt_description:
                "JPG أو JPEG أو PNG أو WEBP بحد أقصى 10 ميجابايت.",

            choose_receipt:
                "اختيار إيصال",

            analyze_receipt:
                "تحليل الإيصال",


            /* PDF */

            pdf_processing:
                "معالجة ملفات PDF",

            pdf_processing_description:
                "معالجة الإيصالات الموجودة داخل ملفات PDF.",

            drop_pdf:
                "ضع ملف PDF هنا",

            or_click_browse:
                "أو اضغط للتصفح",

            pdf_limit:
                "PDF • الحد الأقصى 100 ميجابايت",

            process_pdf:
                "معالجة PDF",


            /* Batch */

            batch_processing:
                "المعالجة الجماعية",

            batch_processing_description:
                "معالجة ما يصل إلى 100 صور إيصالات في وقت واحد.",

            drop_receipts:
                "ضع الإيصالات هنا",

            image_limit:
                "JPG وPNG وWEBP • حتى 10 ملفات",

            analyze_batch:
                "تحليل المجموعة",


            /* Analysis */

            ai_result:
                "نتيجة الذكاء الاصطناعي",

            analysis_result:
                "نتيجة التحليل",

            analysis_result_description:
                "استخرج SmartReceiptAI المعلومات التالية.",

            ai_intelligence:
                "الذكاء الاصطناعي",

            processing_overview:
                "نظرة عامة على المعالجة",

            successful_analyses:
                "التحليلات الناجحة",

            failed_analyses:
                "التحليلات الفاشلة",

            total_tax:
                "إجمالي الضريبة",

            total_discount:
                "إجمالي الخصم",


            /* Recent Receipts */

            recent_receipts:
                "أحدث الإيصالات",

            recent_receipts_description:
                "أحدث الإيصالات التي تمت معالجتها.",

            merchant:
                "التاجر",

            invoice:
                "الفاتورة",

            date:
                "التاريخ",

            total:
                "الإجمالي",

            payment:
                "طريقة الدفع",

            action:
                "الإجراء",

            loading_receipts:
                "جاري تحميل الإيصالات...",

            no_receipts:
                "لا توجد إيصالات بعد",

            no_receipts_description:
                "ارفع أول إيصال لك لبدء استخدام SmartReceiptAI.",


            /* =================================================
               RECEIPTS
            ================================================= */

            receipt_details:
                "تفاصيل الإيصال",

            receipt:
                "الإيصال",

            loading_receipt:
                "جاري تحميل الإيصال...",

            receipts_subtitle:
                "إدارة ومراجعة وتصدير الإيصالات التي تمت معالجتها.",

            successfully_analyzed:
                "تم تحليله بنجاح",

            combined_receipt_value:
                "إجمالي قيمة الإيصالات",

            search_receipts:
                "ابحث عن الإيصالات أو التجار أو رقم الفاتورة...",

            clear_search:
                "مسح البحث",

            filter_by_date:
                "تصفية حسب التاريخ",

            filter_by_status:
                "تصفية حسب الحالة",

            sort_receipts:
                "ترتيب الإيصالات",

            all_dates:
                "جميع التواريخ",

            today:
                "اليوم",

            this_week:
                "هذا الأسبوع",

            this_month:
                "هذا الشهر",

            all_statuses:
                "جميع الحالات",

            needs_review:
                "تحتاج إلى مراجعة",

            newest_first:
                "الأحدث أولًا",

            oldest_first:
                "الأقدم أولًا",

            amount_high_low:
                "المبلغ: من الأعلى إلى الأقل",

            amount_low_high:
                "المبلغ: من الأقل إلى الأعلى",

            csv:
                "CSV",

            comma_separated_values:
                "قيم مفصولة بفواصل",

            excel:
                "Excel",

            spreadsheet_file:
                "ملف جدول بيانات",

            filters:
                "عوامل التصفية:",

            clear_all:
                "مسح الكل",

            receipt_management:
                "إدارة الإيصالات",

            all_receipts:
                "جميع الإيصالات",

            amount:
                "المبلغ",

            status:
                "الحالة",

            actions:
                "الإجراءات",

            no_receipts_found:
                "لم يتم العثور على إيصالات",

            no_matching_receipts:
                "لا توجد إيصالات تطابق عوامل التصفية الحالية.",

            clear_filters:
                "مسح عوامل التصفية",

            showing:
                "عرض",

            showing_zero_receipts:
                "عرض 0 إيصالات",

            of:
                "من",

            previous_page:
                "الصفحة السابقة",

            next_page:
                "الصفحة التالية",

            view_receipt:
                "عرض الإيصال",

            edit_receipt:
                "تعديل الإيصال",

            delete_receipt:
                "حذف الإيصال",

            original_receipt:
                "الإيصال الأصلي",

            source_image:
                "الصورة الأصلية",

            loading_image:
                "جاري تحميل الصورة...",

            image_unavailable:
                "الصورة غير متاحة",

            no_receipt_image:
                "لا توجد صورة إيصال مرتبطة بهذا السجل.",

            receipt_information:
                "معلومات الإيصال",

            extracted_receipt_details:
                "تفاصيل الإيصال المستخرجة",

            products_detected_from_receipt:
                "المنتجات المكتشفة من الإيصال",

            financial_summary:
                "الملخص المالي",

            receipt_totals:
                "إجماليات الإيصال",

            merchant_information:
                "معلومات التاجر",

            business_details_extracted:
                "بيانات النشاط التجاري المستخرجة من الإيصال",

            identification_payment_details:
                "بيانات التعريف والدفع",

            invoice_number:
                "رقم الفاتورة",

            receipt_date:
                "تاريخ الإيصال",

            receipt_time:
                "وقت الإيصال",

            time_example:
                "مثال: 14:35",

            payment_method:
                "طريقة الدفع",

            financial_information:
                "المعلومات المالية",

            correct_financial_values:
                "تصحيح القيم المالية عند الحاجة",

            deleting:
                "جاري الحذف...",

            receipt_not_found:
                "لم يتم العثور على الإيصال.",

            receipt_updated_successfully:
                "تم تحديث الإيصال بنجاح.",

            failed_to_update_receipt:
                "فشل تحديث الإيصال.",

            receipt_deleted_successfully:
                "تم حذف الإيصال بنجاح.",

            failed_to_delete_receipt:
                "فشل حذف الإيصال.",

            no_receipts_to_export:
                "لا توجد إيصالات للتصدير.",

            receipts_exported_successfully:
                "تم تصدير الإيصالات بنجاح.",

            exported_to_excel:
                "تم التصدير إلى Excel",

            failed_to_export_excel:
                "فشل تصدير ملف Excel.",

            receipt_image_could_not_be_displayed:
                "تعذر عرض صورة الإيصال.",

            receipt_details_load_failed:
                "تعذر تحميل تفاصيل الإيصال.",

            something_went_wrong:
                "حدث خطأ ما. يرجى المحاولة مرة أخرى.",

            download_failed:
                "فشل التحميل.",

            failed_to_load_receipts:
                "فشل تحميل الإيصالات.",

            unable_to_load_receipts_try_again:
                "تعذر تحميل الإيصالات. يرجى المحاولة مرة أخرى.",

            profile_image:
                "صورة الملف الشخصي",

            open_navigation:
                "فتح قائمة التنقل",


            /* =================================================
               PROFILE
            ================================================= */

            profile_description:
                "إدارة معلومات حسابك الشخصية.",

            profile_image_section:
                "صورة الملف الشخصي",

            your_photo:
                "صورتك",

            choose_photo:
                "اختيار صورة",

            remove_photo:
                "إزالة الصورة",

            profile_image_limit:
                "JPG وPNG وWEBP · الحد الأقصى 50 ميجابايت",

            account_information:
                "معلومات الحساب",

            personal_details:
                "البيانات الشخصية",

            full_name:
                "الاسم الكامل",

            your_full_name:
                "اكتب اسمك الكامل",

            email:
                "البريد الإلكتروني",

            account_status:
                "حالة الحساب",

            active:
                "نشط",
            // AR
            user: "المستخدم",
            sort: "ترتيب",   


            /* =================================================
               ANALYTICS
            ================================================= */

            smartreceiptai:
                "SMARTRECEIPTAI",

            analytics_subtitle:
                "افهم بيانات إيصالاتك ونشاط المعالجة.",

            overview:
                "نظرة عامة",

            receipt_overview:
                "نظرة عامة على الإيصالات",

            receipt_overview_description:
                "الإحصائيات الأساسية من الإيصالات التي تمت معالجتها.",

            processed_receipts:
                "الإيصالات المعالجة",

            extracted_items:
                "العناصر المستخرجة",

            total_spending:
                "إجمالي الإنفاق",

            primary_currency:
                "العملة الأساسية",

            financial:
                "المالية",

            financial_overview:
                "النظرة المالية",

            financial_overview_description:
                "الإجماليات مجمعة حسب العملة المخزنة في الإيصالات.",

            loading_financial_data:
                "جاري تحميل البيانات المالية...",

            processing_activity:
                "نشاط المعالجة",

            receipts_processed_over_time:
                "الإيصالات المعالجة بمرور الوقت",

            processing_activity_description:
                "النشاط بناءً على وقت إنشاء الإيصالات في SmartReceiptAI.",

            no_processing_activity:
                "لا يوجد نشاط معالجة بعد",

            processing_activity_empty_description:
                "سيظهر نشاط المعالجة هنا عند إضافة الإيصالات.",

            payment_methods:
                "طرق الدفع",

            no_payment_data:
                "لا تتوفر بيانات الدفع.",

            merchants:
                "التجار",

            merchant_categories:
                "فئات التجار",

            no_merchant_category_data:
                "لا تتوفر بيانات لفئات التجار.",

            vision_analysis:
                "تحليل الرؤية",

            processing_performance:
                "أداء المعالجة",

            vision_analysis_description:
                "نتائج تحليل الرؤية الفعلية المخزنة لإيصالاتك.",

            success_rate:
                "معدل النجاح",

            no_analytics_data:
                "لا توجد بيانات تحليلات بعد",

            analytics_empty_description:
                "قم بمعالجة أول إيصال لك لبدء ظهور التحليلات هنا.",

            multiple:
                "متعددة",

            multiple_currencies:
                "عملات متعددة",

            no_financial_data:
                "لا توجد بيانات مالية",

            no_financial_data_available:
                "لا تتوفر بيانات مالية بعد.",

            average:
                "المتوسط",

            no_data_available_yet:
                "لا تتوفر بيانات بعد.",

            unable_to_load_analytics:
                "تعذر تحميل التحليلات",

            unable_to_load_processing_activity:
                "تعذر تحميل نشاط المعالجة",

            request_failed:
                "فشل الطلب.",


            /* =================================================
               LOGIN / REGISTER
            ================================================= */

            login_page_title:
                "تسجيل الدخول — SmartReceiptAI",

            login_welcome:
                "مرحبًا بعودتك",

            email_address:
                "البريد الإلكتروني",

            enter_your_email:
                "أدخل بريدك الإلكتروني",

            password:
                "كلمة المرور",

            enter_your_password:
                "أدخل كلمة المرور",

            remember_me:
                "تذكرني",

            forgot_password:
                "هل نسيت كلمة المرور؟",

            login:
                "تسجيل الدخول",

            signing_in:
                "جاري تسجيل الدخول...",

            dont_have_account:
                "ليس لديك حساب؟",

            create_account:
                "إنشاء حساب",

            register_page_title:
                "إنشاء حساب — SmartReceiptAI",

            create_your_account:
                "أنشئ حسابك",

            enter_your_full_name:
                "أدخل اسمك الكامل",

            create_password:
                "أنشئ كلمة مرور",

            confirm_password:
                "تأكيد كلمة المرور",

            confirm_your_password:
                "أكد كلمة المرور",

            enter_a_password:
                "أدخل كلمة المرور",

            password_match:
                "كلمتا المرور متطابقتان",

            password_do_not_match:
                "كلمتا المرور غير متطابقتين",

            i_agree_to:
                "أوافق على",

            terms_conditions:
                "الشروط والأحكام",

            and:
                "و",

            privacy_policy:
                "سياسة الخصوصية",

            creating_account:
                "جاري إنشاء الحساب...",

            already_have_account:
                "لديك حساب بالفعل؟",

            register_login:
                "تسجيل الدخول",


            /* =================================================
               AI INTELLIGENCE
            ================================================= */

            intelligence_subtitle:
                "افهم كيف يقوم SmartReceiptAI بتحليل إيصالاتك والتحقق منها وتنظيمها.",

            ai_overview:
                "نظرة عامة على الذكاء الاصطناعي",

            vision_processing:
                "معالجة الرؤية",

            vision_processing_description:
                "نشاط المعالجة الفعلي بالذكاء الاصطناعي المسجل لحسابك.",

            total_analyses:
                "إجمالي التحليلات",

            vision_analyses:
                "تحليلات الرؤية",

            successful:
                "ناجحة",

            completed_analyses:
                "التحليلات المكتملة",

            failed:
                "فاشلة",

            recorded_analysis_result:
                "نتيجة التحليل المسجلة",

            processing_pipeline:
                "مراحل المعالجة",

            ai_receipt_pipeline:
                "خط معالجة الإيصال بالذكاء الاصطناعي",

            ai_pipeline_description:
                "مراحل المعالجة المطبقة حاليًا في SmartReceiptAI.",

            loading_ai_pipeline:
                "جاري تحميل خط معالجة الذكاء الاصطناعي...",

            vision_engine:
                "محرك الرؤية",

            vision_models:
                "نماذج الرؤية",

            vision_models_description:
                "النماذج المسجلة من جلسات معالجة الإيصالات الفعلية.",

            loading_vision_models:
                "جاري تحميل نماذج الرؤية...",

            activity:
                "النشاط",

            recent_ai_analyses:
                "أحدث تحليلات الذكاء الاصطناعي",

            recent_ai_analyses_description:
                "أحدث سجلات تحليل Vision المرتبطة بإيصالاتك.",

            model:
                "النموذج",

            created:
                "تاريخ الإنشاء",

            loading_ai_analyses:
                "جاري تحميل تحليلات الذكاء الاصطناعي...",

            no_ai_processing:
                "لا توجد معالجة بالذكاء الاصطناعي بعد",

            no_ai_processing_description:
                "قم بمعالجة إيصال لبدء تسجيل نشاط الذكاء الاصطناعي.",

            no_pipeline_information:
                "لا تتوفر معلومات عن خط المعالجة.",

            no_vision_model_activity:
                "لم يتم تسجيل أي نشاط لنماذج الرؤية بعد.",

            vision_model:
                "نموذج الرؤية",

            analyses:
                "التحليلات",

            unknown_model:
                "نموذج غير معروف",

            unknown:
                "غير معروف",

            no_ai_analysis_records:
                "لا توجد سجلات لتحليلات الذكاء الاصطناعي حتى الآن.",

            unable_to_load_ai_intelligence:
                "تعذر تحميل بيانات الذكاء الاصطناعي",

            unable_to_load_ai_analysis_records:
                "تعذر تحميل سجلات تحليلات الذكاء الاصطناعي.",

            ai_intelligence_data_unavailable:
                "بيانات الذكاء الاصطناعي غير متاحة.",

            logging_out:
                "جاري تسجيل الخروج...",


            /* =================================================
            CURRENT SMARTRECEIPTAI PIPELINE
            No OCR
            ================================================= */

            pipeline_vision:
                "OpenAI Vision",

            pipeline_currency:
                "توحيد العملة",

            pipeline_product:
                "توحيد بيانات المنتجات",

            pipeline_financial_recovery:
                "استعادة البيانات المالية",

            pipeline_validation:
                "التحقق من الإيصال",

            pipeline_storage:
                "التخزين المنظم",

            pipeline_vision_description:
                "تحليل صورة الإيصال باستخدام OpenAI Vision.",

            pipeline_currency_description:
                "توحيد وتنسيق معلومات العملة.",

            pipeline_product_description:
                "تنظيف وتوحيد بيانات المنتجات.",

            pipeline_financial_recovery_description:
                "استعادة وتوحيد المعلومات المالية من الإيصال.",

            pipeline_validation_description:
                "التحقق من بيانات الإيصال المعالجة من حيث الاتساق والصحة.",

            pipeline_storage_description:
                "تخزين الإيصال المعالج والعناصر والصورة وتحليل Vision.",
            reports:
            "\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631",

            reports_subtitle:
                "\u0625\u0646\u0634\u0627\u0621 \u062a\u0642\u0627\u0631\u064a\u0631 \u0645\u0646 \u0627\u0644\u0625\u064a\u0635\u0627\u0644\u0627\u062a \u0648\u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0627\u062a \u0627\u0644\u062a\u064a \u062a\u0645\u062a.",

            report_builder:
                "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062a\u0642\u0631\u064a\u0631",

            create_a_report:
                "\u0625\u0646\u0634\u0627\u0621 \u062a\u0642\u0631\u064a\u0631",

            create_report_description:
                "\u0627\u062e\u062a\u0631 \u0627\u0644\u0641\u062a\u0631\u0629 \u0627\u0644\u062a\u064a \u062a\u0631\u064a\u062f \u062a\u062d\u0644\u064a\u0644\u0647\u0627.",

            start_date:
                "\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0628\u062f\u0627\u064a\u0629",

            end_date:
                "\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0646\u0647\u0627\u064a\u0629",

            generate_report:
                "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062a\u0642\u0631\u064a\u0631",

            report:
                "\u0627\u0644\u062a\u0642\u0631\u064a\u0631",

            generated_report:
                "\u0627\u0644\u062a\u0642\u0631\u064a\u0631 \u0627\u0644\u0645\u0646\u0634\u0623",

            download_pdf:
                "\u062a\u0646\u0632\u064a\u0644 PDF",

            export_excel:
                "\u062a\u0635\u062f\u064a\u0631 Excel",

            financial_summary:
                "\u0627\u0644\u0645\u0644\u062e\u0635 \u0627\u0644\u0645\u0627\u0644\u064a",

            financial_summary_description:
                "\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\u0627\u062a \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0645\u062c\u0645\u0639\u0629 \u062d\u0633\u0628 \u0627\u0644\u0639\u0645\u0644\u0629.",

            processing_activity_report:
                "\u0646\u0634\u0627\u0637 \u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629",

            processing_activity_report_description:
                "\u0645\u0639\u0627\u0644\u062c\u0629 \u0627\u0644\u0625\u064a\u0635\u0627\u0644\u0627\u062a \u0645\u062c\u0645\u0639\u0629 \u062d\u0633\u0628 \u0627\u0644\u062a\u0627\u0631\u064a\u062e.",

            processing_qr_summary:
                "\u0645\u0644\u062e\u0635 \u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629 \u0648 QR",

            receipts_with_qr:
                "\u0625\u064a\u0635\u0627\u0644\u0627\u062a \u0628\u0647\u0627 QR",

            details:
                "\u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644",

            receipt_details_description:
                "\u0627\u0644\u0625\u064a\u0635\u0627\u0644\u0627\u062a \u0627\u0644\u062a\u064a \u062a\u0645\u062a \u0645\u0639\u0627\u0644\u062c\u062a\u0647\u0627 \u062e\u0644\u0627\u0644 \u0627\u0644\u0641\u062a\u0631\u0629 \u0627\u0644\u0645\u062d\u062f\u062f\u0629.",

            quality:
                "\u0627\u0644\u062c\u0648\u062f\u0629",

            single_currency_summary:
                "\u0645\u0644\u062e\u0635 \u0644\u0639\u0645\u0644\u0629 \u0648\u0627\u062d\u062f\u0629",

            no_report_generated:
                "\u0644\u0645 \u064a\u062a\u0645 \u0625\u0646\u0634\u0627\u0621 \u062a\u0642\u0631\u064a\u0631",

            no_report_description:
                "\u062d\u062f\u062f \u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0628\u062f\u0627\u064a\u0629 \u0648\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0646\u0647\u0627\u064a\u0629 \u0644\u0625\u0646\u0634\u0627\u0621 \u062a\u0642\u0631\u064a\u0631 \u0645\u0646 \u0646\u0634\u0627\u0637 \u0625\u064a\u0635\u0627\u0644\u0627\u062a\u0643.",

            /* =================================================
               SETTINGS
            ================================================= */

            language:
                "اللغة",

            currency:
                "العملة",

            timezone:
                "المنطقة الزمنية",

            english:
                "الإنجليزية",

            arabic:
                "العربية",

            preferences:
                "التفضيلات",

            preferences_description:
                "خصّص تجربتك",

            preferences_status:
                "التفضيلات",

            general:
                "عام",

            general_preferences:
                "التفضيلات العامة",

            general_preferences_description:
                "قم بتكوين طريقة عرض SmartReceiptAI وإدارة تفضيلات حسابك.",

            settings_description:
                "إدارة تفضيلات SmartReceiptAI والإشعارات الخاصة بك.",

            application_language:
                "لغة التطبيق",

            choose_language:
                "اختر اللغة المستخدمة في التطبيق.",

            language_description:
                "اختر اللغة المستخدمة في التطبيق.",

            default_currency:
                "العملة الافتراضية",

            choose_currency:
                "اختر العملة المفضلة للإيصالات.",

            currency_description:
                "اختر العملة المفضلة للإيصالات.",

            time_zone:
                "المنطقة الزمنية",

            time_zone_description:
                "حدد المنطقة الزمنية المستخدمة لنشاط الحساب والطوابع الزمنية.",

            currency_sdg:
                "الجنيه السوداني (SDG)",

            currency_usd:
                "الدولار الأمريكي (USD)",

            currency_eur:
                "اليورو (EUR)",

            currency_gbp:
                "الجنيه الإسترليني (GBP)",


            /* Notifications */

            notifications:
                "الإشعارات",

            notification_preferences:
                "تفضيلات الإشعارات",

            notification_preferences_description:
                "تحكم في إشعارات الحساب وإشعارات معالجة الإيصالات التي تريد استلامها.",

            email_notifications:
                "إشعارات البريد الإلكتروني",

            email_notifications_description:
                "استلم إشعارات الحساب المدعومة عبر البريد الإلكتروني.",

            processing_notifications:
                "إشعارات المعالجة",

            processing_notifications_description:
                "استلم الإشعارات المتعلقة بمعالجة الإيصالات.",


            /* Settings Actions */

            save_changes:
                "حفظ التغييرات",

            reset:
                "إعادة تعيين",

            saving:
                "جارٍ الحفظ...",

            loading:
                "جارٍ التحميل...",

            loading_settings:
                "جاري تحميل إعداداتك...",

            preferences_saved:
                "تم حفظ الإعدادات بنجاح.",

            settings_saved_message:
                "تم حفظ إعداداتك بنجاح.",

            settings_saved_toast:
                "تم حفظ الإعدادات بنجاح.",

            settings_load_error:
                "تعذر تحميل الإعدادات.",

            settings_save_error:
                "تعذر حفظ الإعدادات.",

            changes_reset:
                "تمت إعادة التغييرات.",

            system_preferences:
                "تفضيلات النظام",

            personalize_experience:
                "خصّص تجربتك",

            smartreceipt_settings:
                "إعدادات SmartReceiptAI",

            settings_footer:
                "إدارة تفضيلات التطبيق الشخصية.",

            settings_footer_description:
                "إدارة تفضيلات التطبيق الشخصية.",


            /* =================================================
               RECEIPT ANALYSIS RESULT
            ================================================= */

            valid_receipt:
                "إيصال صالح",

            review_required:
                "يحتاج إلى مراجعة",

            unknown_merchant:
                "تاجر غير معروف",

            time:
                "الوقت",

            currency_label:
                "العملة",

            products:
                "المنتجات",

            detected_items:
                "العناصر المكتشفة",

            items:
                "العناصر",

            item:
                "عنصر",

            name:
                "الاسم",

            quantity:
                "الكمية",

            unit_price:
                "سعر الوحدة",

            subtotal:
                "المجموع الفرعي",

            tax:
                "الضريبة",

            discount:
                "الخصم",

            warnings:
                "تحذيرات",

            validation_errors:
                "أخطاء التحقق",

            no_items_detected:
                "لم يتم اكتشاف أي عناصر.",

            successfully_processed:
                "تمت المعالجة بنجاح",

            processed:
                "تمت المعالجة",

            processing_complete:
                "اكتملت المعالجة",

            analysis:
                "التحليل",


            /* =================================================
               WELCOME / LANDING PAGE
            ================================================= */

            welcome_brand_tagline:
                "معالجة الإيصالات بذكاء",

            welcome_nav_home:
                "الرئيسية",

            welcome_nav_features:
                "المميزات",

            welcome_nav_how:
                "كيف يعمل",

            welcome_nav_about:
                "عن النظام",

            welcome_nav_contact:
                "تواصل معنا",

            welcome_language:
                "اللغة",

            welcome_login:
                "تسجيل الدخول",

            welcome_create_account:
                "إنشاء حساب",

            welcome_hero_tag:
                "ذكاء اصطناعي لمعالجة الإيصالات",

            welcome_hero_title_first:
                "مستقبل",

            welcome_hero_title_second:
                "معالجة الإيصالات الذكية",

            welcome_hero_description:
                "حوّل إيصالاتك إلى معلومات وبيانات ذكية. يستخدم SmartReceiptAI تقنية OpenAI Vision والذكاء الاصطناعي لفهم بيانات الإيصالات واستخراجها والتحقق منها وتنظيمها.",

            welcome_get_started:
                "ابدأ الآن",

            welcome_ai_processing_ready:
                "معالجة الإيصالات باستخدام OpenAI Vision",

            welcome_total:
                "الإجمالي",

            welcome_ai_analysis_complete:
                "اكتمل تحليل الذكاء الاصطناعي",

            welcome_receipt_detected:
                "تم اكتشاف الإيصال",

            welcome_ai_analysis:
                "تحليل OpenAI Vision",

            welcome_smart_insights:
                "رؤى ذكية",


            /* Features */

            welcome_features_label:
                "المميزات",

            welcome_features_title:
                "معالجة ذكية. نتائج مفيدة.",

            welcome_features_description:
                "يجمع SmartReceiptAI بين OpenAI Vision والتحليل الذكي والتحقق والمعالجة المالية واستخراج البيانات المنظمة في نظام ذكي واحد.",

            welcome_feature_vision_title:
                "OpenAI Vision",

            welcome_feature_vision_description:
                "تحليل صور الإيصالات باستخدام OpenAI Vision لفهم بيانات الإيصال واستخراج المعلومات المنظمة.",

            welcome_feature_extraction_title:
                "استخراج البيانات بالذكاء الاصطناعي",

            welcome_feature_extraction_description:
                "استخراج وتنظيم معلومات الإيصال وبيانات المنتجات والمعلومات المالية من صور الإيصالات التي تم تحليلها.",

            welcome_feature_financial_title:
                "المعالجة المالية",

            welcome_feature_financial_description:
                "معالجة الإجماليات والضرائب والخصومات والعملات وغيرها من المعلومات المالية المستخرجة من الإيصالات.",

            welcome_feature_insights_title:
                "الرؤى الذكية",

            welcome_feature_insights_description:
                "تحويل معلومات الإيصالات المعالجة إلى بيانات منظمة ومفيدة للتحليل والفهم.",


            /* How It Works */

            welcome_how_label:
                "كيف يعمل النظام",

            welcome_how_title:
                "من صورة الإيصال إلى البيانات الذكية",

            welcome_how_description:
                "يحوّل OpenAI Vision وخط المعالجة الذكي في النظام صور الإيصالات إلى بيانات تم التحقق منها وتنظيمها.",

            welcome_step_upload:
                "رفع الإيصال",

            welcome_step_upload_description:
                "ارفع صورة إيصال مدعومة إلى النظام.",

            welcome_step_ai:
                "تحليل OpenAI Vision",

            welcome_step_ai_description:
                "يقوم OpenAI Vision بتحليل صورة الإيصال وتحديد المعلومات المهمة.",

            welcome_step_extraction:
                "معالجة البيانات الذكية",

            welcome_step_extraction_description:
                "يقوم النظام بتوحيد معلومات العملة والمنتجات واستعادة البيانات المالية من الإيصال.",

            welcome_step_validation:
                "التحقق",

            welcome_step_validation_description:
                "يتم التحقق من بيانات الإيصال المعالجة من حيث الاتساق والصحة قبل التخزين.",

            welcome_step_insights:
                "النتائج المنظمة",

            welcome_step_insights_description:
                "يتم تخزين الإيصال الذي تم التحقق منه كبيانات منظمة تشمل تفاصيل الإيصال والمنتجات والمعلومات المالية والصورة وتحليل Vision.",

            /* Supported Receipts */

            welcome_supported_label:
                "الإيصالات المدعومة",

            welcome_supported_title:
                "مصمم لأنواع مختلفة من الإيصالات",

            welcome_supported_description:
                "تم تصميم SmartReceiptAI لمعالجة فئات الإيصالات التي يدعمها النظام المطبق فعليًا.",

            welcome_receipt_supermarket:
                "السوبرماركت",

            welcome_receipt_supermarket_description:
                "إيصالات البقالة ومحلات السوبرماركت.",

            welcome_receipt_pharmacy:
                "الصيدليات",

            welcome_receipt_pharmacy_description:
                "إيصالات الصيدليات وشراء الأدوية.",

            welcome_receipt_hospital:
                "المستشفيات",

            welcome_receipt_hospital_description:
                "إيصالات المستشفيات والخدمات المتعلقة بالرعاية الصحية.",

            welcome_receipt_restaurant:
                "المطاعم",

            welcome_receipt_restaurant_description:
                "إيصالات المطاعم وخدمات الطعام.",


            /* About */

            welcome_about_label:
                "عن SMARTRECEIPTAI",

            welcome_about_title:
                "معالجة ذكية للإيصالات مدعومة بالذكاء الاصطناعي",

            welcome_about_description:
                "SmartReceiptAI هو نظام لمعالجة الإيصالات بالذكاء الاصطناعي، صُمم لتحويل صور الإيصالات إلى معلومات منظمة وذات معنى باستخدام OpenAI Vision.",

            welcome_about_description_two:
                "يجمع النظام بين معالجة الصور وتحليل OpenAI Vision واستخراج البيانات والمعالجة المالية والتحقق والتنظيم الذكي للبيانات.",

            welcome_about_highlight_title:
                "من الصورة إلى الرؤية الذكية",

            welcome_about_highlight_description:
                "نهج منظم ومدعوم بالذكاء الاصطناعي لفهم معلومات الإيصالات.",


            /* Contact */

            welcome_contact_label:
                "تواصل معنا",

            welcome_contact_title:
                "تواصل معنا",

            welcome_contact_description:
                "هل لديك سؤال حول SmartReceiptAI؟ تواصل معنا عبر إحدى قنوات التواصل المتاحة.",

            welcome_contact_email:
                "البريد الإلكتروني",

            welcome_contact_whatsapp:
                "واتساب",

            welcome_contact_facebook:
                "فيسبوك",

            welcome_contact_facebook_open:
                "زيارة فيسبوك",


            /* Footer */

            welcome_footer_description:
                "معالجة ذكية للإيصالات مدعومة بتقنية OpenAI Vision.",

            welcome_footer_navigation:
                "التنقل",

            welcome_footer_account:
                "الحساب",

            welcome_footer_social:
                "روابط التواصل",

            welcome_all_rights_reserved:
                "جميع الحقوق محفوظة.",


            /* =================================================
               SECURITY
            ================================================= */

            security_controls:
                "عناصر التحكم في الأمان",

            account_protection:
                "حماية الحساب",

            security_description:
                "إدارة كلمة المرور وجلسات الحساب النشطة.",

            account_security:
                "أمان الحساب",

            change_password:
                "تغيير كلمة المرور",

            change_password_description:
                "قم بتحديث كلمة مرور حسابك بشكل آمن.",

            account_password:
                "كلمة مرور الحساب",

            strong_password_description:
                "استخدم كلمة مرور قوية لحماية حسابك.",

            current_password:
                "كلمة المرور الحالية",

            new_password:
                "كلمة المرور الجديدة",

            confirm_new_password:
                "تأكيد كلمة المرور الجديدة",

            show_password:
                "إظهار كلمة المرور",

            hide_password:
                "إخفاء كلمة المرور",

            enter_new_password:
                "أدخل كلمة مرور جديدة",

            password_requirement_length:
                "8 أحرف على الأقل",

            password_requirement_uppercase:
                "حرف إنجليزي كبير واحد",

            password_requirement_lowercase:
                "حرف إنجليزي صغير واحد",

            password_requirement_number:
                "رقم واحد",

            password_requirement_special:
                "رمز خاص واحد",

            sessions:
                "الجلسات",

            active_sessions:
                "الجلسات النشطة",

            active_sessions_description:
                "الأجهزة التي سجلت الدخول إلى حسابك حاليًا.",

            refresh_sessions:
                "تحديث الجلسات",

            sign_out_other_sessions:
                "تسجيل الخروج من الجلسات الأخرى",

            loading_active_sessions:
                "جاري تحميل الجلسات النشطة...",

            keep_account_secure:
                "حافظ على أمان حسابك",

            keep_account_secure_description:
                "راجع الجلسات النشطة بانتظام وقم بإلغاء الأجهزة التي لم تعد تتعرف عليها.",

            smartreceipt_security:
                "أمان SmartReceiptAI",

            security_footer_description:
                "إدارة حماية حسابك بشكل آمن.",


            /* =================================================
               COMMON
            ================================================= */

            cancel:
                "إلغاء",

            close:
                "إغلاق",

            save:
                "حفظ",

            delete:
                "حذف",

            edit:
                "تعديل",

            view:
                "عرض",

            download:
                "تحميل",

            export:
                "تصدير",

            search:
                "بحث",

            filter:
                "تصفية",

            refresh:
                "تحديث",

            yes:
                "نعم",

            no:
                "لا",

            success:
                "نجاح",

            error:
                "خطأ",

            warning:
                "تحذير"
        }
    };


    /* =====================================================
       HELPERS
    ===================================================== */

    function isSupportedLanguage(language) {

        return SUPPORTED_LANGUAGES.includes(
            language
        );
    }


    function normalizeLanguage(language) {

        return isSupportedLanguage(language)
            ? language
            : DEFAULT_LANGUAGE;
    }


    /* =====================================================
       GET CURRENT LANGUAGE
    ===================================================== */

    function getLanguage() {

        let savedLanguage = null;

        try {

            savedLanguage =
                localStorage.getItem(
                    LANGUAGE_KEY
                );

        } catch (error) {

            savedLanguage = null;
        }


        return normalizeLanguage(
            savedLanguage
        );
    }


    /* =====================================================
       CHECK STORED LANGUAGE
    ===================================================== */

    function hasStoredLanguage() {

        let savedLanguage = null;

        try {

            savedLanguage =
                localStorage.getItem(
                    LANGUAGE_KEY
                );

        } catch (error) {

            savedLanguage = null;
        }


        return isSupportedLanguage(
            savedLanguage
        );
    }


    /* =====================================================
       SAVE LANGUAGE
    ===================================================== */

    function saveLanguage(language) {

        language =
            normalizeLanguage(language);

        try {

            localStorage.setItem(
                LANGUAGE_KEY,
                language
            );

        } catch (error) {

            console.warn(
                "SmartReceiptAI: Unable to save language preference.",
                error
            );
        }

        return language;
    }


    /* =====================================================
       APPLY DIRECTION
    ===================================================== */

    function applyDirection(language) {

        language =
            normalizeLanguage(language);

        const html =
            document.documentElement;

        const body =
            document.body;


        if (!html) {
            return;
        }


        if (language === "ar") {

            html.setAttribute(
                "lang",
                "ar"
            );

            html.setAttribute(
                "dir",
                "rtl"
            );

            if (body) {

                body.classList.add(
                    "rtl-layout"
                );
            }

        } else {

            html.setAttribute(
                "lang",
                "en"
            );

            html.setAttribute(
                "dir",
                "ltr"
            );

            if (body) {

                body.classList.remove(
                    "rtl-layout"
                );
            }
        }
    }


    /* =====================================================
       UPDATE LANGUAGE SWITCHERS
       Desktop + Mobile
    ===================================================== */

    function updateLanguageSwitchers(language) {

        language =
            normalizeLanguage(language);


        const currentLanguage =
            document.getElementById(
                "currentLanguage"
            );

        const mobileCurrentLanguage =
            document.getElementById(
                "mobileCurrentLanguage"
            );

        const languageSwitcher =
            document.getElementById(
                "languageSwitcher"
            );

        const mobileLanguageSwitcher =
            document.getElementById(
                "mobileLanguageSwitcher"
            );


        const shortLanguage =
            language === "ar"
                ? "AR"
                : "EN";


        const ariaLabel =
            language === "ar"
                ? "تغيير اللغة"
                : "Change Language";


        if (currentLanguage) {

            currentLanguage.textContent =
                shortLanguage;
        }


        if (mobileCurrentLanguage) {

            mobileCurrentLanguage.textContent =
                shortLanguage;
        }


        if (languageSwitcher) {

            languageSwitcher.setAttribute(
                "aria-label",
                ariaLabel
            );

            languageSwitcher.setAttribute(
                "title",
                ariaLabel
            );
        }


        if (mobileLanguageSwitcher) {

            mobileLanguageSwitcher.setAttribute(
                "aria-label",
                ariaLabel
            );

            mobileLanguageSwitcher.setAttribute(
                "title",
                ariaLabel
            );
        }
    }


    /* =====================================================
       TRANSLATE TEXT
    ===================================================== */

    function translateText(language) {

        language =
            normalizeLanguage(language);

        const dictionary =
            translations[language];

        if (!dictionary) {
            return;
        }


        document
            .querySelectorAll(
                "[data-i18n]"
            )
            .forEach(
                function (element) {

                    const key =
                        element.dataset.i18n;

                    if (
                        Object.prototype.hasOwnProperty.call(
                            dictionary,
                            key
                        )
                    ) {

                        element.textContent =
                            dictionary[key];
                    }
                }
            );
    }


    /* =====================================================
       TRANSLATE PLACEHOLDERS
    ===================================================== */

    function translatePlaceholders(language) {

        language =
            normalizeLanguage(language);

        const dictionary =
            translations[language];

        if (!dictionary) {
            return;
        }


        document
            .querySelectorAll(
                "[data-i18n-placeholder]"
            )
            .forEach(
                function (element) {

                    const key =
                        element.dataset
                            .i18nPlaceholder;

                    if (
                        Object.prototype.hasOwnProperty.call(
                            dictionary,
                            key
                        )
                    ) {

                        element.placeholder =
                            dictionary[key];
                    }
                }
            );
    }


    /* =====================================================
       TRANSLATE TITLES
    ===================================================== */

    function translateTitles(language) {

        language =
            normalizeLanguage(language);

        const dictionary =
            translations[language];

        if (!dictionary) {
            return;
        }


        document
            .querySelectorAll(
                "[data-i18n-title]"
            )
            .forEach(
                function (element) {

                    const key =
                        element.dataset
                            .i18nTitle;

                    if (
                        Object.prototype.hasOwnProperty.call(
                            dictionary,
                            key
                        )
                    ) {

                        element.title =
                            dictionary[key];
                    }
                }
            );
    }


    /* =====================================================
       DOCUMENT TITLE
    ===================================================== */

    function translateDocumentTitle(language) {

        language =
            normalizeLanguage(language);


        const page =
            document.documentElement.dataset.page ||
            "";


        const titles = {

            dashboard: {
                en: "Dashboard — SmartReceiptAI",
                ar: "لوحة التحكم — SmartReceiptAI"
            },
            admin: {
                en: "Admin Dashboard — SmartReceiptAI",
                ar: "لوحة تحكم الإدارة — SmartReceiptAI"
            },

            receipts: {
                en: "Receipts — SmartReceiptAI",
                ar: "الإيصالات — SmartReceiptAI"
            },

            analytics: {
                en: "Analytics — SmartReceiptAI",
                ar: "التحليلات — SmartReceiptAI"
            },
            reports: {
                en: "Reports — SmartReceiptAI",
                ar: "التقارير — SmartReceiptAI"
            },

            intelligence: {
                en: "AI Intelligence — SmartReceiptAI",
                ar: "الذكاء الاصطناعي — SmartReceiptAI"
            },

            profile: {
                en: "Profile — SmartReceiptAI",
                ar: "الملف الشخصي — SmartReceiptAI"
            },

            security: {
                en: "Security — SmartReceiptAI",
                ar: "الأمان — SmartReceiptAI"
            },

            login: {
                en: "Login — SmartReceiptAI",
                ar: "تسجيل الدخول — SmartReceiptAI"
            },

            register: {
                en: "Create Account — SmartReceiptAI",
                ar: "إنشاء حساب — SmartReceiptAI"
            },

            settings: {
                en: "Settings — SmartReceiptAI",
                ar: "الإعدادات — SmartReceiptAI"
            },

            welcome: {
                en: "SmartReceiptAI",
                ar: "SmartReceiptAI"
            }
            /* New Keys */
            expenses_overview: "نظرة عامة على المصروفات",
            last_7_days: "آخر 7 أيام",
            last_30_days: "آخر 30 يوم",
            last_90_days: "آخر 90 يوم",
            this_year: "هذا العام",
            all_time: "كل الوقت",
            integration: "الربط التقني",
            receipt_source: "مصدر الفواتير",
            system_name: "اسم النظام",
            system_name_placeholder: "مثال: نظام مستشفى النيل الأبيض",
            org_name: "اسم المؤسسة",
            org_name_placeholder: "مثال: مستشفى النيل الأبيض",
            generate_connect: "توليد مفتاح وربط",
            api_key: "مفتاح الربط (API Key)",
            api_key_placeholder: "سيظهر مفتاح الربط هنا",
            endpoint_url: "رابط الاستقبال (Endpoint)",
            disconnected: "غير متصل",
            connected: "متصل",
            digital: "رقمي",
            scanned: "ممسوح ضوئياً",

            /* Admin Keys */
            integration_stats: "إحصائيات الربط التقني العامة",
            receipt_sources_overview: "نظرة عامة على مصادر الإيصالات",
            total_digital_receipts: "إجمالي الفواتير الرقمية",
            via_api: "عبر الـ API",
            total_scanned_receipts: "إجمالي الفواتير الممسوحة",
            via_vision: "عبر الذكاء الاصطناعي",
            active_api_keys: "مفاتيح الـ API النشطة",


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

        };


        const pageTitle =
            titles[page];


        if (!pageTitle) {
            return;
        }


        document.title =
            pageTitle[language] ||
            pageTitle.en;
    }


    /* =====================================================
       TRANSLATE PAGE
    ===================================================== */

    function translatePage(language) {

        language =
            normalizeLanguage(language);


        translateText(language);

        translatePlaceholders(language);

        translateTitles(language);

        translateDocumentTitle(language);

        updateLanguageSwitchers(language);
    }


    /* =====================================================
       APPLY LANGUAGE
    ===================================================== */

    function applyLanguage(language) {

        language =
            normalizeLanguage(language);


        /* Save globally */

        saveLanguage(language);


        /* Apply RTL / LTR */

        applyDirection(language);


        /* Translate current page */

        translatePage(language);


        /* Notify all page scripts */

        window.dispatchEvent(
            new CustomEvent(
                "languageChanged",
                {
                    detail: {
                        language: language
                    }
                }
            )
        );
    }


    /* =====================================================
       TOGGLE LANGUAGE
    ===================================================== */

    function toggleLanguage() {

        const current =
            getLanguage();

        const next =
            current === "en"
                ? "ar"
                : "en";

        applyLanguage(next);

        return next;
    }


    /* =====================================================
       LANGUAGE SWITCHER
       Desktop + Mobile
    ===================================================== */

    function initializeLanguageSwitcher() {

        const languageSwitcher =
            document.getElementById(
                "languageSwitcher"
            );

        const mobileLanguageSwitcher =
            document.getElementById(
                "mobileLanguageSwitcher"
            );


        /* -------------------------------------------------
           Initial State
        ------------------------------------------------- */

        const current =
            getLanguage();

        updateLanguageSwitchers(
            current
        );


        /* -------------------------------------------------
           Desktop Switcher
        ------------------------------------------------- */

        if (
            languageSwitcher &&
            !languageSwitcher.dataset.languageBound
        ) {

            languageSwitcher.dataset.languageBound =
                "true";


            languageSwitcher.addEventListener(
                "click",
                function () {

                    toggleLanguage();
                }
            );
        }


        /* -------------------------------------------------
           Mobile Switcher
        ------------------------------------------------- */

        if (
            mobileLanguageSwitcher &&
            !mobileLanguageSwitcher.dataset.languageBound
        ) {

            mobileLanguageSwitcher.dataset.languageBound =
                "true";


            mobileLanguageSwitcher.addEventListener(
                "click",
                function () {

                    toggleLanguage();
                }
            );
        }


        /* -------------------------------------------------
           Update When Language Changes
        ------------------------------------------------- */

        if (
            !window.__smartReceiptLanguageListener
        ) {

            window.__smartReceiptLanguageListener =
                true;


            window.addEventListener(
                "languageChanged",
                function (event) {

                    const language =
                        event &&
                        event.detail &&
                        event.detail.language
                            ? event.detail.language
                            : getLanguage();


                    updateLanguageSwitchers(
                        language
                    );
                }
            );
        }
    }


    /* =====================================================
       SYNC LANGUAGE BETWEEN TABS
       localStorage changes are reflected in other tabs.
    ===================================================== */

    function initializeStorageSync() {

        if (
            window.__smartReceiptLanguageStorageListener
        ) {
            return;
        }


        window.__smartReceiptLanguageStorageListener =
            true;


        window.addEventListener(
            "storage",
            function (event) {

                if (
                    event.key !== LANGUAGE_KEY
                ) {
                    return;
                }


                const language =
                    normalizeLanguage(
                        event.newValue
                    );


                applyDirection(
                    language
                );


                translatePage(
                    language
                );


                window.dispatchEvent(
                    new CustomEvent(
                        "languageChanged",
                        {
                            detail: {
                                language:
                                    language
                            }
                        }
                    )
                );
            }
        );
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initializeLanguage() {

        const language =
            getLanguage();


        applyDirection(
            language
        );


        translatePage(
            language
        );


        initializeLanguageSwitcher();

        initializeStorageSync();
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.SmartReceiptLanguage = {

        getLanguage:
            getLanguage,

        hasStoredLanguage:
            hasStoredLanguage,

        setLanguage:
            applyLanguage,

        toggleLanguage:
            toggleLanguage,

        saveLanguage:
            saveLanguage,

        translatePage:
            translatePage,

        applyDirection:
            applyDirection,

        translations:
            translations
    };


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeLanguage
        );

    } else {

        initializeLanguage();
    }


})();