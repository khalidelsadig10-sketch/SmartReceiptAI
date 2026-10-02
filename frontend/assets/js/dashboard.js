"use strict";

/* =========================================================
   SmartReceiptAI Dashboard
   Dashboard Client Logic
   Global Language Support
   ========================================================= */

const API_BASE = "/api/v1";


/* =========================================================
   GLOBAL LANGUAGE
   ========================================================= */

const DASHBOARD_LANGUAGE_FALLBACK = {

    en: {

        account:
            "Account",
        admin_dashboard:
            "Admin Dashboard",

        unknown:
            "Unknown",

        valid_receipt:
            "Valid Receipt",

        review_required:
            "Review Required",

        unknown_merchant:
            "Unknown Merchant",

        merchant:
            "Merchant",

        invoice:
            "Invoice",

        date:
            "Date",

        time:
            "Time",

        payment:
            "Payment",

        currency_label:
            "Currency",

        subtotal:
            "Subtotal",

        tax:
            "Tax",

        discount:
            "Discount",

        total:
            "Total",

        products:
            "PRODUCTS",

        detected_items:
            "Detected Items",

        item:
            "item",

        items:
            "items",

        name:
            "Name",

        quantity:
            "Qty",

        unit_price:
            "Unit Price",

        warnings:
            "Warnings",

        validation_errors:
            "Validation Errors",

        no_item_details:
            "No item details available.",

        no_processed_receipts:
            "No receipts have been processed yet.",

        unable_to_load_receipts:
            "Unable to load receipts.",

        unable_to_load_image:
            "Unable to load image",

        no_receipt_image:
            "The original receipt image could not be displayed.",

        loading_receipt:
            "Loading receipt...",

        unable_to_load_receipt:
            "Unable to load receipt",

        try_again:
            "Try Again",

        original_receipt:
            "ORIGINAL RECEIPT",

        source_image_stored:
            "Source image stored with this receipt",

        loading_image:
            "Loading image...",

        image_unavailable:
            "Image unavailable",

        receipt_information:
            "Receipt Information",

        category:
            "Category",

        phone:
            "Phone",

        address:
            "Address",

        financial_summary:
            "Financial Summary",

        tax_rate:
            "Tax Rate",

        logging_out:
            "Logging out...",

        receipt_ready:
            "Receipt ready for analysis.",

        analyzing_receipt:
            "Analyzing receipt with AI...",

        receipt_analyzed:
            "Receipt analyzed successfully.",

        receipt_processing_failed:
            "Receipt processing failed.",

        unsupported_image_format:
            "Unsupported image format. Use JPG, JPEG, PNG or WEBP.",

        file_size_exceeds:
            "File size exceeds the 10 MB limit.",

        pdf_invalid:
            "Please select a valid PDF file.",

        pdf_size_exceeds:
            "PDF exceeds the 10 MB limit.",

        pdf_processing:
            "Processing...",

        pdf_processed_successfully:
            "Processed successfully.",

        pdf_processing_failed:
            "PDF processing failed.",

        maximum_images:
            "Maximum 100 images allowed.",

        receipts_selected:
            "receipt(s) selected.",

        processing_receipts:
            "Processing",

        batch_processing:
            "Batch",

        batch_processing_failed:
            "Batch processing failed.",

        processed:
            "processed",

        failed:
            "failed",

        processing_complete:
            "Processing Complete",

        status:
            "Status",

        successfully_processed:
            "Successfully processed",

        authentication_required:
            "Authentication required."
    },


    ar: {

        account:
            "الحساب",
        admin_dashboard:
            "لوحة تحكم الإدارة",

        unknown:
            "غير معروف",

        valid_receipt:
            "إيصال صالح",

        review_required:
            "يحتاج إلى مراجعة",

        unknown_merchant:
            "تاجر غير معروف",

        merchant:
            "التاجر",

        invoice:
            "الفاتورة",

        date:
            "التاريخ",

        time:
            "الوقت",

        payment:
            "طريقة الدفع",

        currency_label:
            "العملة",

        subtotal:
            "المجموع الفرعي",

        tax:
            "الضريبة",

        discount:
            "الخصم",

        total:
            "الإجمالي",

        products:
            "المنتجات",

        detected_items:
            "العناصر المكتشفة",

        item:
            "عنصر",

        items:
            "عناصر",

        name:
            "الاسم",

        quantity:
            "الكمية",

        unit_price:
            "سعر الوحدة",

        warnings:
            "تحذيرات",

        validation_errors:
            "أخطاء التحقق",

        no_item_details:
            "لا توجد تفاصيل للعناصر.",

        no_processed_receipts:
            "لا توجد إيصالات تمت معالجتها بعد.",

        unable_to_load_receipts:
            "تعذر تحميل الإيصالات.",

        unable_to_load_image:
            "تعذر تحميل الصورة",

        no_receipt_image:
            "تعذر عرض صورة الإيصال الأصلية.",

        loading_receipt:
            "جاري تحميل الإيصال...",

        unable_to_load_receipt:
            "تعذر تحميل الإيصال",

        try_again:
            "حاول مرة أخرى",

        original_receipt:
            "الإيصال الأصلي",

        source_image_stored:
            "صورة المصدر المحفوظة مع هذا الإيصال",

        loading_image:
            "جاري تحميل الصورة...",

        image_unavailable:
            "الصورة غير متوفرة",

        receipt_information:
            "معلومات الإيصال",

        category:
            "التصنيف",

        phone:
            "الهاتف",

        address:
            "العنوان",

        financial_summary:
            "الملخص المالي",

        tax_rate:
            "نسبة الضريبة",

        logging_out:
            "جاري تسجيل الخروج...",

        receipt_ready:
            "الإيصال جاهز للتحليل.",

        analyzing_receipt:
            "جاري تحليل الإيصال بالذكاء الاصطناعي...",

        receipt_analyzed:
            "تم تحليل الإيصال بنجاح.",

        receipt_processing_failed:
            "فشلت معالجة الإيصال.",

        unsupported_image_format:
            "تنسيق صورة غير مدعوم. استخدم JPG أو JPEG أو PNG أو WEBP.",

        file_size_exceeds:
            "حجم الملف يتجاوز الحد الأقصى البالغ 10 ميجابايت.",

        pdf_invalid:
            "يرجى اختيار ملف PDF صالح.",

        pdf_size_exceeds:
            "حجم ملف PDF يتجاوز 10 ميجابايت.",

        pdf_processing:
            "جاري المعالجة...",

        pdf_processed_successfully:
            "تمت المعالجة بنجاح.",

        pdf_processing_failed:
            "فشلت معالجة ملف PDF.",

        maximum_images:
            "الحد الأقصى 10 صور.",

        receipts_selected:
            "إيصال محدد.",

        processing_receipts:
            "جاري معالجة",

        batch_processing:
            "المعالجة الجماعية",

        batch_processing_failed:
            "فشلت المعالجة الجماعية.",

        processed:
            "تمت معالجته",

        failed:
            "فشل",

        processing_complete:
            "اكتملت المعالجة",

        status:
            "الحالة",

        successfully_processed:
            "تمت المعالجة بنجاح",

        authentication_required:
            "المصادقة مطلوبة."
    }
};


function getCurrentLanguage() {

    return window.SmartReceiptLanguage
        ? window.SmartReceiptLanguage.getLanguage()
        : "en";
}


function t(key) {

    const language =
        getCurrentLanguage();


    const dictionary =
        window.SmartReceiptLanguage
            ?.translations?.[language];


    if (
        dictionary &&
        Object.prototype.hasOwnProperty.call(
            dictionary,
            key
        )
    ) {

        return dictionary[key];
    }


    const fallback =
        DASHBOARD_LANGUAGE_FALLBACK[
            language
        ];


    if (
        fallback &&
        Object.prototype.hasOwnProperty.call(
            fallback,
            key
        )
    ) {

        return fallback[key];
    }


    const englishFallback =
        DASHBOARD_LANGUAGE_FALLBACK.en;


    if (
        englishFallback &&
        Object.prototype.hasOwnProperty.call(
            englishFallback,
            key
        )
    ) {

        return englishFallback[key];
    }


    return String(key);
}


/* =========================================================
   CURRENT DYNAMIC DATA
   ========================================================= */

let currentAnalysisResponse = null;

let currentReceiptDetailsData = null;

let currentReceiptDetailsContainer = null;


/* =========================================================
   AUTHENTICATION
   ========================================================= */

function getAccessToken() {

    return (
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        null
    );
}


function getAuthHeaders() {

    const token =
        getAccessToken();


    if (!token) {
        return {};
    }


    return {
        Authorization:
            `Bearer ${token}`
    };
}


function requireAuthentication() {

    if (!getAccessToken()) {

        window.location.href =
            "/";

        return false;
    }


    return true;
}


/* =========================================================
   API
   ========================================================= */

async function apiRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            {
                ...options,

                headers: {
                    ...getAuthHeaders(),
                    ...(options.headers || {})
                }
            }
        );


    if (
        response.status === 401
    ) {

        localStorage.removeItem(
            "access_token"
        );

        sessionStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "token"
        );

        sessionStorage.removeItem(
            "token"
        );


        window.location.href =
            "/";


        return null;
    }


    let data =
        null;


    try {

        data =
            await response.json();

    } catch {

        data =
            null;
    }


    if (
        !response.ok
    ) {

        throw new Error(
            data?.detail ||
            data?.message ||
            t("request_failed")
        );
    }


    return data;
}


/* =========================================================
   SINGLE RECEIPT PROCESSING
   ========================================================= */

function initializeReceiptUpload() {

    const fileInput =
        document.getElementById(
            "receipt-file"
        );


    const uploadButton =
        document.getElementById(
            "upload-button"
        );
    const cameraButton =
        document.getElementById(
            "camera-button"
        );

    const cameraModal =
        document.getElementById(
            "camera-modal"
        );

    const cameraVideo =
        document.getElementById(
            "camera-video"
        );

    const cameraCanvas =
        document.getElementById(
            "camera-canvas"
        );

    const captureButton =
        document.getElementById(
            "capture-button"
        );

    const closeCameraButton =
        document.getElementById(
            "close-camera-button"
        );

    const cameraStatus =
        document.getElementById(
            "camera-status"
        );


    const analyzeButton =
        document.getElementById(
            "analyze-button"
        );


    const selectedFile =
        document.getElementById(
            "selected-file"
        );


    const status =
        document.getElementById(
            "processing-status"
        );


    const preview =
        document.getElementById(
            "receipt-preview"
        );


    const previewImage =
        document.getElementById(
            "receipt-preview-image"
        );


    if (
        !fileInput ||
        !uploadButton ||
        !analyzeButton ||
        !selectedFile ||
        !status ||
        !preview ||
        !previewImage
    ) {

        console.error(
            "Receipt upload elements are missing from dashboard.html."
        );


        return;
    }


    let selectedReceipt =
        null;


    uploadButton.addEventListener(
        "click",
        () => {

            fileInput.click();

        }
    );
    let cameraStream = null;

    function stopCamera() {

        if (cameraStream) {

            cameraStream
                .getTracks()
                .forEach(
                    track => {
                        track.stop();
                    }
                );

            cameraStream = null;
        }

        cameraVideo.srcObject = null;

        cameraModal.hidden = true;

        cameraStatus.textContent = "";
    }

    if (
        cameraButton &&
        cameraModal &&
        cameraVideo &&
        cameraCanvas &&
        captureButton &&
        closeCameraButton
    ) {

        cameraButton.addEventListener(
            "click",
            async () => {

                try {

                    cameraStream =
                        await navigator.mediaDevices.getUserMedia(
                            {
                                video: {
                                    facingMode: {
                                        ideal:
                                            "environment"
                                    }
                                },
                                audio: false
                            }
                        );

                    cameraVideo.srcObject =
                        cameraStream;

                    cameraModal.hidden =
                        false;

                } catch (error) {

                    console.error(
                        "Camera access failed:",
                        error
                    );

                    cameraStatus.textContent =
                        "Unable to access the camera.";
                }
            }
        );

        captureButton.addEventListener(
            "click",
            () => {

                if (
                    !cameraStream ||
                    !cameraVideo.videoWidth ||
                    !cameraVideo.videoHeight
                ) {
                    return;
                }

                cameraCanvas.width =
                    cameraVideo.videoWidth;

                cameraCanvas.height =
                    cameraVideo.videoHeight;

                const context =
                    cameraCanvas.getContext(
                        "2d"
                    );

                if (!context) {
                    return;
                }

                context.drawImage(
                    cameraVideo,
                    0,
                    0,
                    cameraCanvas.width,
                    cameraCanvas.height
                );

                cameraCanvas.toBlob(
                    blob => {

                        if (!blob) {
                            return;
                        }

                        const file =
                            new File(
                                [
                                    blob
                                ],
                                `receipt-camera-${Date.now()}.jpg`,
                                {
                                    type:
                                        "image/jpeg"
                                }
                            );

                        const dataTransfer =
                            new DataTransfer();

                        dataTransfer.items.add(
                            file
                        );

                        fileInput.files =
                            dataTransfer.files;

                        stopCamera();

                        fileInput.dispatchEvent(
                            new Event(
                                "change",
                                {
                                    bubbles: true
                                }
                            )
                        );
                    },
                    "image/jpeg",
                    0.92
                );
            }
        );

        closeCameraButton.addEventListener(
            "click",
            () => {
                stopCamera();
            }
        );
    }

    fileInput.addEventListener(
        "change",
        () => {

            const file =
                fileInput.files?.[0];


            if (!file) {
                return;
            }


            const validation =
                validateImageFile(
                    file
                );


            if (
                !validation.valid
            ) {

                selectedReceipt =
                    null;


                analyzeButton.disabled =
                    true;


                preview.hidden =
                    true;


                previewImage.removeAttribute(
                    "src"
                );


                selectedFile.textContent =
                    "";


                status.textContent =
                    validation.message;


                return;
            }


            selectedReceipt =
                file;


            selectedFile.textContent =
                `${file.name} • ${formatFileSize(
                    file.size
                )}`;


            status.textContent =
                t("receipt_ready");


            const reader =
                new FileReader();


            reader.onload =
                event => {

                    previewImage.src =
                        event.target.result;


                    preview.hidden =
                        false;
                };


            reader.readAsDataURL(
                file
            );


            analyzeButton.disabled =
                false;
        }
    );


    analyzeButton.addEventListener(
        "click",
        async () => {

            if (
                !selectedReceipt
            ) {
                return;
            }


            analyzeButton.disabled =
                true;


            uploadButton.disabled =
                true;


            status.textContent =
                t(
                    "analyzing_receipt"
                );


            clearAnalysisResult();


            try {

                const response =
                    await processReceipt(
                        selectedReceipt
                    );


                currentAnalysisResponse =
                    response;


                renderAnalysisResult(
                    response
                );


                status.textContent =
                    t(
                        "receipt_analyzed"
                    );


                await refreshDashboard();


            } catch (error) {

                console.error(
                    "Receipt processing failed:",
                    error
                );


                status.textContent =
                    error.message ||
                    t(
                        "receipt_processing_failed"
                    );


            } finally {

                analyzeButton.disabled =
                    false;


                uploadButton.disabled =
                    false;
            }
        }
    );
}


/* =========================================================
   PROCESS SINGLE RECEIPT
   ========================================================= */

async function processReceipt(
    file
) {

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    const response =
        await apiRequest(
            `${API_BASE}/receipt/process`,
            {
                method:
                    "POST",

                body:
                    formData
            }
        );


    if (!response) {

        throw new Error(
            t(
                "authentication_required"
            )
        );
    }


    return response;
}


/* =========================================================
   ANALYSIS RESULT
   ========================================================= */

function showAnalysisResult() {

    const section =
        document.getElementById(
            "analysis-result"
        );


    if (section) {

        section.hidden =
            false;
    }
}


function clearAnalysisResult() {

    const section =
        document.getElementById(
            "analysis-result"
        );


    const container =
        document.getElementById(
            "analysis-result-content"
        );


    if (
        !section ||
        !container
    ) {
        return;
    }


    section.hidden =
        true;


    container.innerHTML =
        "";


    currentAnalysisResponse =
        null;
}


function renderAnalysisResult(
    response
) {

    const container =
        document.getElementById(
            "analysis-result-content"
        );


    if (!container) {
        return;
    }


    currentAnalysisResponse =
        response;


    const receipt =
        response?.receipt ||
        {};


    const merchant =
        receipt.merchant ||
        {};


    const receiptInfo =
        receipt.receipt_info ||
        {};


    const financial =
        receipt.financial ||
        {};


    const payment =
        receipt.payment ||
        {};


    const items =
        Array.isArray(
            receipt.items
        )
            ? receipt.items
            : [];


    const validation =
        response?.validation ||
        {};


    const isValid =
        validation.is_valid === true;


    const itemRows =
        items.length

            ? items
                .map(
                    item => `

                        <tr>

                            <td>
                                ${escapeHtml(
                                    item.name ||
                                    t("unknown")
                                )}
                            </td>

                            <td>
                                ${formatValue(
                                    item.quantity
                                )}
                            </td>

                            <td>
                                ${formatAmount(
                                    item.unit_price
                                )}
                            </td>

                            <td>
                                ${formatAmount(
                                    item.total_price
                                )}
                            </td>

                        </tr>

                    `
                )
                .join("")

            : `

                <tr>

                    <td
                        colspan="4"
                        style="text-align:center;"
                    >

                        ${escapeHtml(
                            t(
                                "no_item_details"
                            )
                        )}

                    </td>

                </tr>

            `;


    const warnings =
        Array.isArray(
            validation.warnings
        )
            ? validation.warnings
            : [];


    const errors =
        Array.isArray(
            validation.errors
        )
            ? validation.errors
            : [];


    container.innerHTML = `

        <div class="result-success">


            <!-- RESULT HEADER -->

            <div class="result-header">

                <div>

                    <span
                        class="result-badge ${
                            isValid
                                ? "valid"
                                : "warning"
                        }"
                    >

                        ${
                            isValid
                                ? `✓ ${escapeHtml(
                                    t(
                                        "valid_receipt"
                                    )
                                )}`
                                : `⚠ ${escapeHtml(
                                    t(
                                        "review_required"
                                    )
                                )}`
                        }

                    </span>


                    <h3>

                        ${escapeHtml(
                            merchant.name ||
                            t(
                                "unknown_merchant"
                            )
                        )}

                    </h3>

                </div>


                <strong
                    class="result-total"
                >

                    ${formatAmount(
                        financial.total
                    )}

                    ${escapeHtml(
                        receiptInfo.currency ||
                        ""
                    )}

                </strong>

            </div>


            <!-- SUMMARY -->

            <div class="result-grid">


                <div class="result-field">

                    <span>
                        ${escapeHtml(
                            t("merchant")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            merchant.name ||
                            "—"
                        )}

                    </strong>

                </div>


                <div class="result-field">

                    <span>
                        ${escapeHtml(
                            t("invoice")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            receiptInfo.invoice_number ||
                            "—"
                        )}

                    </strong>

                </div>


                <div class="result-field">

                    <span>
                        ${escapeHtml(
                            t("date")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            receiptInfo.date ||
                            "—"
                        )}

                    </strong>

                </div>


                <div class="result-field">

                    <span>
                        ${escapeHtml(
                            t("time")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            receiptInfo.time ||
                            "—"
                        )}

                    </strong>

                </div>


                <div class="result-field">

                    <span>
                        ${escapeHtml(
                            t("payment")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            payment.method ||
                            "—"
                        )}

                    </strong>

                </div>


                <div class="result-field">

                    <span>
                        ${escapeHtml(
                            t(
                                "currency_label"
                            )
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            receiptInfo.currency ||
                            "—"
                        )}

                    </strong>

                </div>


                <div class="result-field">

                    <span>
                        ${escapeHtml(
                            t("subtotal")
                        )}
                    </span>

                    <strong>

                        ${formatAmount(
                            financial.subtotal
                        )}

                    </strong>

                </div>


                <div class="result-field">

                    <span>
                        ${escapeHtml(
                            t("tax")
                        )}
                    </span>

                    <strong>

                        ${formatAmount(
                            financial.tax
                        )}

                    </strong>

                </div>


                <div class="result-field">

                    <span>
                        ${escapeHtml(
                            t("discount")
                        )}
                    </span>

                    <strong>

                        ${formatAmount(
                            financial.discount
                        )}

                    </strong>

                </div>


                <div
                    class="result-field result-total-field"
                >

                    <span>
                        ${escapeHtml(
                            t("total")
                        )}
                    </span>

                    <strong>

                        ${formatAmount(
                            financial.total
                        )}

                        ${escapeHtml(
                            receiptInfo.currency ||
                            ""
                        )}

                    </strong>

                </div>

            </div>


            <!-- PRODUCTS -->

            <div class="result-items">


                <div class="result-items-header">

                    <div>

                        <span
                            class="section-eyebrow"
                        >
                            ${escapeHtml(
                                t("products")
                            )}
                        </span>


                        <h3>

                            ${escapeHtml(
                                t(
                                    "detected_items"
                                )
                            )}

                        </h3>

                    </div>


                    <strong>

                        ${formatNumber(
                            items.length
                        )}

                        ${
                            items.length === 1
                                ? escapeHtml(
                                    t("item")
                                )
                                : escapeHtml(
                                    t("items")
                                )
                        }

                    </strong>

                </div>


                <div
                    class="details-table-wrapper"
                >

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    ${escapeHtml(
                                        t("name")
                                    )}
                                </th>

                                <th>
                                    ${escapeHtml(
                                        t("quantity")
                                    )}
                                </th>

                                <th>
                                    ${escapeHtml(
                                        t("unit_price")
                                    )}
                                </th>

                                <th>
                                    ${escapeHtml(
                                        t("total")
                                    )}
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${itemRows}

                        </tbody>

                    </table>

                </div>

            </div>


            <!-- WARNINGS -->

            ${
                warnings.length

                    ? `

                        <div
                            class="result-warning"
                        >

                            <strong>

                                ${escapeHtml(
                                    t(
                                        "warnings"
                                    )
                                )}

                            </strong>


                            <ul>

                                ${warnings
                                    .map(
                                        warning => `

                                            <li>

                                                ${escapeHtml(
                                                    warning
                                                )}

                                            </li>

                                        `
                                    )
                                    .join("")}

                            </ul>

                        </div>

                    `

                    : ""
            }


            <!-- ERRORS -->

            ${
                errors.length

                    ? `

                        <div
                            class="result-error"
                        >

                            <strong>

                                ${escapeHtml(
                                    t(
                                        "validation_errors"
                                    )
                                )}

                            </strong>


                            <ul>

                                ${errors
                                    .map(
                                        error => `

                                            <li>

                                                ${escapeHtml(
                                                    error
                                                )}

                                            </li>

                                        `
                                    )
                                    .join("")}

                            </ul>

                        </div>

                    `

                    : ""
            }


        </div>

    `;


    showAnalysisResult();


    document
        .getElementById(
            "analysis-result"
        )
        ?.scrollIntoView({
            behavior:
                "smooth",

            block:
                "start"
        });
}


/* =========================================================
   IMAGE VALIDATION
   ========================================================= */

function validateImageFile(
    file
) {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    const maxSize =
        10 * 1024 * 1024;


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        return {

            valid:
                false,

            message:
                t(
                    "unsupported_image_format"
                )
        };
    }


    if (
        file.size >
        maxSize
    ) {

        return {

            valid:
                false,

            message:
                t(
                    "file_size_exceeds"
                )
        };
    }


    return {

        valid:
            true,

        message:
            ""
    };
}


/* =========================================================
   DASHBOARD STATISTICS
   ========================================================= */

async function loadDashboardStats() {

    try {

        const response =
            await apiRequest(
                `${API_BASE}/dashboard/stats`
            );


        if (!response) {
            return;
        }


        const data =
            response.data ||
            {};


        setText(
            "total-receipts",
            formatNumber(
                data.total_receipts
            )
        );


        setText(
            "total-items",
            formatNumber(
                data.total_items
            )
        );


        setText(
            "total-amount",
            formatAmount(
                data.total_amount
            )
        );


        setText(
            "average-receipt",
            formatAmount(
                data.average_receipt
            )
        );


        setText(
            "total-tax",
            formatAmount(
                data.total_tax
            )
        );


        setText(
            "total-discount",
            formatAmount(
                data.total_discount
            )
        );


        setText(
            "successful-analyses",
            formatNumber(
                data.successful_vision_analyses
            )
        );


        setText(
            "failed-analyses",
            formatNumber(
                data.failed_vision_analyses
            )
        );


    } catch (error) {

        console.error(
            "Failed to load dashboard statistics:",
            error
        );
    }
}


/* =========================================================
   RECENT RECEIPTS
   ========================================================= */

async function loadRecentReceipts() {

    const tableBody =
        document.getElementById(
            "receipts-table-body"
        );


    if (!tableBody) {
        return;
    }


    try {

        const response =
            await apiRequest(
                `${API_BASE}/dashboard/recent?limit=10`
            );


        if (!response) {
            return;
        }


        const receipts =
            response.receipts ||
            [];


        if (
            !receipts.length
        ) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="table-empty"
                    >

                        ${escapeHtml(
                            t(
                                "no_processed_receipts"
                            )
                        )}

                    </td>

                </tr>

            `;


            return;
        }


        tableBody.innerHTML =
            "";


        receipts.forEach(
            receipt => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        ${escapeHtml(
                            receipt.merchant_name ||
                            t("unknown")
                        )}

                    </td>


                    <td>

                        ${escapeHtml(
                            receipt.invoice_number ||
                            "—"
                        )}

                    </td>


                    <td>

                        ${formatDate(
                            receipt.receipt_date ||
                            receipt.created_at
                        )}

                    </td>


                    <td>

                        ${formatAmount(
                            receipt.total
                        )}

                        ${escapeHtml(
                            receipt.currency ||
                            ""
                        )}

                    </td>


                    <td>

                        ${escapeHtml(
                            receipt.payment_method ||
                            "—"
                        )}

                    </td>


                    <td>

                        <button
                            type="button"
                            class="table-action"
                            data-receipt-id="${escapeHtml(
                                receipt.id
                            )}"
                        >

                            ${escapeHtml(
                                t("view")
                            )}

                        </button>

                    </td>

                `;


                tableBody.appendChild(
                    row
                );
            }
        );


        attachReceiptButtons();


    } catch (error) {

        console.error(
            "Failed to load recent receipts:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="table-error"
                >

                    ${escapeHtml(
                        t(
                            "unable_to_load_receipts"
                        )
                    )}

                </td>

            </tr>

        `;
    }
}


/* =========================================================
   RECEIPT BUTTONS
   ========================================================= */

function attachReceiptButtons() {

    const tableBody =
        document.getElementById(
            "receipts-table-body"
        );


    if (!tableBody) {
        return;
    }


    const buttons =
        tableBody.querySelectorAll(
            ".table-action[data-receipt-id]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const receiptId =
                        button.dataset
                            .receiptId;


                    if (!receiptId) {
                        return;
                    }


                    openReceiptModal(
                        receiptId
                    );
                }
            );

        }
    );
}


/* =========================================================
   RECEIPT IMAGE
   ========================================================= */

async function loadReceiptImage(
    imageUrl,
    imageElement
) {

    if (
        !imageUrl ||
        !imageElement
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                imageUrl,
                {
                    credentials:
                        "include",

                    headers: {
                        ...getAuthHeaders()
                    }
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                `Image request failed: ${response.status}`
            );
        }


        const blob =
            await response.blob();


        const objectUrl =
            URL.createObjectURL(
                blob
            );


        imageElement.src =
            objectUrl;


        imageElement.onload =
            () => {

                URL.revokeObjectURL(
                    objectUrl
                );


                imageElement
                    .closest(
                        ".receipt-image-frame"
                    )
                    ?.querySelector(
                        ".receipt-image-loading"
                    )
                    ?.remove();
            };


    } catch (error) {

        console.error(
            "Failed to load receipt image:",
            error
        );


        const frame =
            imageElement.closest(
                ".receipt-image-frame"
            );


        if (frame) {

            frame.innerHTML = `

                <div
                    class="receipt-image-placeholder error"
                >

                    <div
                        class="receipt-placeholder-icon"
                    >
                        !
                    </div>


                    <strong>

                        ${escapeHtml(
                            t(
                                "unable_to_load_image"
                            )
                        )}

                    </strong>


                    <small>

                        ${escapeHtml(
                            t(
                                "no_receipt_image"
                            )
                        )}

                    </small>

                </div>

            `;
        }
    }
}


/* =========================================================
   RECEIPT MODAL
   ========================================================= */

async function openReceiptModal(
    receiptId
) {

    const modal =
        document.getElementById(
            "receipt-modal"
        );


    const details =
        document.getElementById(
            "receipt-details"
        );


    if (
        !modal ||
        !details
    ) {
        return;
    }


    requestAnimationFrame(
        () => {

            modal.classList.add(
                "show"
            );
        }
    );


    modal.hidden =
        false;


    details.innerHTML = `

        <div class="modal-loading">

            <span class="loading-spinner"></span>

            <span>

                ${escapeHtml(
                    t(
                        "loading_receipt"
                    )
                )}

            </span>

        </div>

    `;


    document.body.classList.add(
        "modal-open"
    );


    try {

        const response =
            await apiRequest(
                `${API_BASE}/receipt/${encodeURIComponent(
                    receiptId
                )}`
            );


        if (
            !response ||
            !response.receipt
        ) {

            throw new Error(
                t(
                    "unable_to_load_receipt"
                )
            );
        }


        currentReceiptDetailsData =
            response.receipt;


        currentReceiptDetailsContainer =
            details;


        renderReceiptDetails(
            response.receipt,
            details
        );


    } catch (error) {

        console.error(
            "Failed to load receipt details:",
            error
        );


        details.innerHTML = `

            <div class="modal-error">

                <div
                    class="modal-error-icon"
                >
                    !
                </div>


                <strong>

                    ${escapeHtml(
                        t(
                            "unable_to_load_receipt"
                        )
                    )}

                </strong>


                <span>

                    ${escapeHtml(
                        error.message ||
                        t("try_again")
                    )}

                </span>


                <button
                    type="button"
                    class="secondary-button"
                    id="retry-dashboard-receipt"
                >

                    ${escapeHtml(
                        t("try_again")
                    )}

                </button>

            </div>

        `;


        document
            .getElementById(
                "retry-dashboard-receipt"
            )
            ?.addEventListener(
                "click",
                () => {

                    openReceiptModal(
                        receiptId
                    );

                }
            );
    }
}


/* =========================================================
   RECEIPT DETAILS
   ========================================================= */

function renderReceiptDetails(
    receipt,
    container
) {

    if (!container) {
        return;
    }


    currentReceiptDetailsData =
        receipt;


    currentReceiptDetailsContainer =
        container;


    const currency =
        receipt.currency ||
        "SDG";


    const items =
        Array.isArray(
            receipt.items
        )
            ? receipt.items
            : [];


    const imageUrl =
        receipt.image_url ||
        null;


    const itemsHtml =
        items.length

            ? `

                <div class="details-table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    ${escapeHtml(
                                        t("name")
                                    )}
                                </th>

                                <th>
                                    ${escapeHtml(
                                        t("quantity")
                                    )}
                                </th>

                                <th>
                                    ${escapeHtml(
                                        t("unit_price")
                                    )}
                                </th>

                                <th>
                                    ${escapeHtml(
                                        t("total")
                                    )}
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                items
                                    .map(
                                        item => `

                                            <tr>

                                                <td>

                                                    ${escapeHtml(
                                                        item.name ||
                                                        t(
                                                            "unknown"
                                                        )
                                                    )}

                                                </td>


                                                <td>

                                                    ${formatValue(
                                                        item.quantity
                                                    )}

                                                </td>


                                                <td>

                                                    ${formatAmount(
                                                        item.unit_price
                                                    )}

                                                    ${escapeHtml(
                                                        currency
                                                    )}

                                                </td>


                                                <td>

                                                    <strong>

                                                        ${formatAmount(
                                                            item.total_price
                                                        )}

                                                        ${escapeHtml(
                                                            currency
                                                        )}

                                                    </strong>

                                                </td>

                                            </tr>

                                        `
                                    )
                                    .join("")
                            }

                        </tbody>

                    </table>

                </div>

            `

            : `

                <div class="details-empty">

                    ${escapeHtml(
                        t(
                            "no_item_details"
                        )
                    )}

                </div>

            `;


    container.innerHTML = `

        <div
            class="dashboard-receipt-details"
        >


            <!-- ORIGINAL RECEIPT -->

            <section
                class="dashboard-receipt-image-card"
            >

                <div
                    class="dashboard-receipt-section-heading"
                >

                    <div>

                        <span>

                            ${escapeHtml(
                                t(
                                    "original_receipt"
                                )
                            )}

                        </span>


                        <small>

                            ${escapeHtml(
                                t(
                                    "source_image_stored"
                                )
                            )}

                        </small>

                    </div>

                </div>


                ${
                    imageUrl

                        ? `

                            <div
                                class="receipt-image-frame"
                            >

                                <div
                                    class="receipt-image-loading"
                                >

                                    <span
                                        class="loading-spinner"
                                    ></span>


                                    <span>

                                        ${escapeHtml(
                                            t(
                                                "loading_image"
                                            )
                                        )}

                                    </span>

                                </div>


                                <img
                                    src=""
                                    alt="${escapeHtml(
                                        t(
                                            "original_receipt"
                                        )
                                    )}"
                                    class="dashboard-original-receipt-image"
                                    loading="eager"
                                >

                            </div>

                        `

                        : `

                            <div
                                class="receipt-image-frame"
                            >

                                <div
                                    class="receipt-image-placeholder"
                                >

                                    <div
                                        class="receipt-placeholder-icon"
                                    >
                                        ▣
                                    </div>


                                    <strong>

                                        ${escapeHtml(
                                            t(
                                                "image_unavailable"
                                            )
                                        )}

                                    </strong>


                                    <small>

                                        ${escapeHtml(
                                            t(
                                                "no_receipt_image"
                                            )
                                        )}

                                    </small>

                                </div>

                            </div>

                        `
                }

            </section>


            <!-- RECEIPT INFORMATION -->

            <section
                class="details-block"
            >

                <h3>

                    ${escapeHtml(
                        t(
                            "receipt_information"
                        )
                    )}

                </h3>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("merchant")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            receipt.merchant_name ||
                            t("unknown")
                        )}

                    </strong>

                </div>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("category")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            receipt.merchant_category ||
                            "—"
                        )}

                    </strong>

                </div>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("invoice")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            receipt.invoice_number ||
                            "—"
                        )}

                    </strong>

                </div>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("date")
                        )}
                    </span>

                    <strong>

                        ${formatDate(
                            receipt.receipt_date ||
                            receipt.created_at
                        )}

                    </strong>

                </div>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("time")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            receipt.receipt_time ||
                            "—"
                        )}

                    </strong>

                </div>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("payment")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            receipt.payment_method ||
                            "—"
                        )}

                    </strong>

                </div>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t(
                                "currency_label"
                            )
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            currency
                        )}

                    </strong>

                </div>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("phone")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            receipt.merchant_phone ||
                            "—"
                        )}

                    </strong>

                </div>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("address")
                        )}
                    </span>

                    <strong>

                        ${escapeHtml(
                            receipt.merchant_address ||
                            "—"
                        )}

                    </strong>

                </div>

            </section>


            <!-- ITEMS -->

            <section
                class="details-block details-items"
            >

                <div
                    class="dashboard-receipt-section-heading"
                >

                    <div>

                        <span>

                            ${escapeHtml(
                                t("products")
                            )}

                        </span>


                        <small>

                            ${escapeHtml(
                                t(
                                    "detected_items"
                                )
                            )}

                        </small>

                    </div>


                    <strong>

                        ${formatNumber(
                            items.length
                        )}

                    </strong>

                </div>


                ${itemsHtml}

            </section>


            <!-- FINANCIAL -->

            <section
                class="details-block"
            >

                <h3>

                    ${escapeHtml(
                        t(
                            "financial_summary"
                        )
                    )}

                </h3>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("subtotal")
                        )}
                    </span>

                    <strong>

                        ${formatAmount(
                            receipt.subtotal
                        )}

                        ${escapeHtml(
                            currency
                        )}

                    </strong>

                </div>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("tax")
                        )}
                    </span>

                    <strong>

                        ${formatAmount(
                            receipt.tax
                        )}

                        ${escapeHtml(
                            currency
                        )}

                    </strong>

                </div>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("tax_rate")
                        )}
                    </span>

                    <strong>

                        ${
                            receipt.tax_rate !==
                                null &&
                            receipt.tax_rate !==
                                undefined

                                ? `${escapeHtml(
                                    receipt.tax_rate
                                )}%`

                                : "—"
                        }

                    </strong>

                </div>


                <div class="details-row">

                    <span>
                        ${escapeHtml(
                            t("discount")
                        )}
                    </span>

                    <strong>

                        ${formatAmount(
                            receipt.discount
                        )}

                        ${escapeHtml(
                            currency
                        )}

                    </strong>

                </div>


                <div
                    class="details-row total-row"
                >

                    <span>
                        ${escapeHtml(
                            t("total")
                        )}
                    </span>

                    <strong>

                        ${formatAmount(
                            receipt.total
                        )}

                        ${escapeHtml(
                            currency
                        )}

                    </strong>

                </div>

            </section>

        </div>

    `;


    const image =
        container.querySelector(
            ".dashboard-original-receipt-image"
        );


    if (
        image &&
        imageUrl
    ) {

        loadReceiptImage(
            imageUrl,
            image
        );
    }
}


/* =========================================================
   LOGOUT
   ========================================================= */

async function initializeLogout() {

    const button =
        document.getElementById(
            "logout-button"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async () => {

            if (
                button.disabled
            ) {
                return;
            }


            button.disabled =
                true;


            button.textContent =
                t(
                    "logging_out"
                );


            try {

                await fetch(
                    `${API_BASE}/auth/logout`,
                    {
                        method:
                            "POST",

                        credentials:
                            "include",

                        headers: {
                            ...getAuthHeaders()
                        }
                    }
                );


            } catch (error) {

                console.error(
                    "Dashboard logout request failed:",
                    error
                );


            } finally {

                localStorage.removeItem(
                    "access_token"
                );

                sessionStorage.removeItem(
                    "access_token"
                );

                localStorage.removeItem(
                    "token"
                );

                sessionStorage.removeItem(
                    "token"
                );


                window.location.href =
                    "/";
            }
        }
    );
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const button =
        document.getElementById(
            "mobile-menu-button"
        );


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (
        !button ||
        !sidebar
    ) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "mobile-open"
            );
        }
    );
}


/* =========================================================
   MODAL INITIALIZATION
   ========================================================= */

function initializeModal() {

    const modal =
        document.getElementById(
            "receipt-modal"
        );


    const closeButton =
        document.getElementById(
            "modal-close"
        );


    const backdrop =
        modal?.querySelector(
            ".modal-backdrop"
        );


    if (!modal) {
        return;
    }


    const close = () => {

        modal.classList.remove(
            "show"
        );


        setTimeout(
            () => {

                modal.hidden =
                    true;

            },
            150
        );


        document.body.classList.remove(
            "modal-open"
        );


        currentReceiptDetailsData =
            null;


        currentReceiptDetailsContainer =
            null;
    };


    closeButton?.addEventListener(
        "click",
        close
    );


    backdrop?.addEventListener(
        "click",
        close
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !modal.hidden
            ) {

                close();
            }
        }
    );
}


/* =========================================================
   REFRESH DASHBOARD
   ========================================================= */

async function refreshDashboard() {

    await Promise.all([
        loadDashboardStats(),
        loadRecentReceipts()
    ]);
}


/* =========================================================
   PDF PROCESSING
   ========================================================= */

function initializePDFUpload() {

    const fileInput =
        document.getElementById(
            "pdf-file"
        );


    const uploadZone =
        document.getElementById(
            "pdf-upload-zone"
        );


    const processButton =
        document.getElementById(
            "process-pdf-button"
        );


    const selectedFile =
        document.getElementById(
            "pdf-selected-file"
        );


    if (
        !fileInput ||
        !uploadZone ||
        !processButton ||
        !selectedFile
    ) {

        console.error(
            "PDF upload elements not found."
        );


        return;
    }


    let selectedPDF =
        null;


    uploadZone.addEventListener(
        "click",
        () => {

            fileInput.click();

        }
    );


    fileInput.addEventListener(
        "change",
        () => {

            const file =
                fileInput.files?.[0];


            if (!file) {

                selectedPDF =
                    null;


                processButton.disabled =
                    true;


                selectedFile.textContent =
                    "";


                return;
            }


            const isPDF =
                file.type ===
                    "application/pdf" ||
                file.name
                    .toLowerCase()
                    .endsWith(".pdf");


            if (!isPDF) {

                selectedPDF =
                    null;


                processButton.disabled =
                    true;


                selectedFile.textContent =
                    t(
                        "pdf_invalid"
                    );


                return;
            }


            if (
                file.size >
                10 * 1024 * 1024
            ) {

                selectedPDF =
                    null;


                processButton.disabled =
                    true;


                selectedFile.textContent =
                    t(
                        "pdf_size_exceeds"
                    );


                return;
            }


            selectedPDF =
                file;


            selectedFile.textContent =
                `${file.name} • ${formatFileSize(
                    file.size
                )}`;


            processButton.disabled =
                false;
        }
    );


    processButton.addEventListener(
        "click",
        async () => {

            if (
                !selectedPDF
            ) {
                return;
            }


            processButton.disabled =
                true;


            selectedFile.textContent =
                `${selectedPDF.name} • ${t(
                    "pdf_processing"
                )}`;


            try {

                const formData =
                    new FormData();


                formData.append(
                    "file",
                    selectedPDF
                );


                const response =
                    await apiRequest(
                        `${API_BASE}/receipt/process-pdf`,
                        {
                            method:
                                "POST",

                            body:
                                formData
                        }
                    );


                if (!response) {
                    return;
                }


                renderProcessingResult(
                    response,
                    "PDF"
                );


                selectedFile.textContent =
                    `${selectedPDF.name} • ${t(
                        "pdf_processed_successfully"
                    )}`;


                await refreshDashboard();


            } catch (error) {

                console.error(
                    "PDF processing failed:",
                    error
                );


                selectedFile.textContent =
                    error.message ||
                    t(
                        "pdf_processing_failed"
                    );


            } finally {

                processButton.disabled =
                    false;
            }
        }
    );
}


/* =========================================================
   BATCH PROCESSING
   ========================================================= */

function initializeBatchUpload() {

    const fileInput =
        document.getElementById(
            "batch-files"
        );


    const uploadZone =
        document.getElementById(
            "batch-upload-zone"
        );


    const processButton =
        document.getElementById(
            "process-batch-button"
        );


    const selectedFiles =
        document.getElementById(
            "batch-selected-files"
        );


    if (
        !fileInput ||
        !uploadZone ||
        !processButton ||
        !selectedFiles
    ) {

        console.error(
            "Batch upload elements not found."
        );


        return;
    }


    let batchFiles =
        [];


    uploadZone.addEventListener(
        "click",
        () => {

            fileInput.click();

        }
    );


    fileInput.addEventListener(
        "change",
        () => {

            const files =
                Array.from(
                    fileInput.files ||
                    []
                );


            if (!files.length) {

                batchFiles =
                    [];


                processButton.disabled =
                    true;


                selectedFiles.textContent =
                    "";


                return;
            }


            if (
                files.length > 100
            ) {

                batchFiles =
                    [];


                processButton.disabled =
                    true;


                selectedFiles.textContent =
                    t(
                        "maximum_images"
                    );


                return;
            }


            for (
                const file of files
            ) {

                const validation =
                    validateImageFile(
                        file
                    );


                if (
                    !validation.valid
                ) {

                    batchFiles =
                        [];


                    processButton.disabled =
                        true;


                    selectedFiles.textContent =
                        validation.message;


                    return;
                }
            }


            batchFiles =
                files;


            const selectedCount =
                t(
                    "receipts_selected"
                );


            selectedFiles.textContent =
                `${formatNumber(
                    files.length
                )} ${selectedCount}`;


            processButton.disabled =
                false;
        }
    );


    processButton.addEventListener(
        "click",
        async () => {

            if (
                !batchFiles.length
            ) {
                return;
            }


            processButton.disabled =
                true;


            selectedFiles.textContent =
                `${t(
                    "processing_receipts"
                )} ${formatNumber(
                    batchFiles.length
                )}`;


            try {

                const formData =
                    new FormData();


                batchFiles.forEach(
                    file => {

                        formData.append(
                            "files",
                            file
                        );
                    }
                );


                const response =
                    await apiRequest(
                        `${API_BASE}/receipt/process-batch`,
                        {
                            method:
                                "POST",

                            body:
                                formData
                        }
                    );


                if (!response) {
                    return;
                }


                renderProcessingResult(
                    response,
                    "BATCH"
                );


                selectedFiles.textContent =
                    `${formatNumber(
                        response.processed ||
                        0
                    )} ${t(
                        "processed"
                    )}, ` +
                    `${formatNumber(
                        response.failed ||
                        0
                    )} ${t(
                        "failed"
                    )}.`;


                await refreshDashboard();


            } catch (error) {

                console.error(
                    "Batch processing failed:",
                    error
                );


                selectedFiles.textContent =
                    error.message ||
                    t(
                        "batch_processing_failed"
                    );


            } finally {

                processButton.disabled =
                    false;
            }
        }
    );
}


/* =========================================================
   PDF / BATCH RESULT
   ========================================================= */

function renderProcessingResult(
    response,
    type
) {

    const section =
        document.getElementById(
            "analysis-result"
        );


    const container =
        document.getElementById(
            "analysis-result-content"
        );


    if (
        !section ||
        !container
    ) {
        return;
    }


    if (
        response?.receipt
    ) {

        currentAnalysisResponse =
            response;


        renderAnalysisResult(
            response
        );


        return;
    }


    const typeLabel =
        type === "PDF"
            ? "PDF"
            : t(
                "batch_processing"
            );


    container.innerHTML = `

        <div
            class="result-success"
        >

            <div
                class="result-header"
            >

                <div>

                    <span
                        class="result-badge valid"
                    >

                        ✓ ${escapeHtml(
                            t(
                                "processing_complete"
                            )
                        )}

                    </span>


                    <h3>

                        ${escapeHtml(
                            typeLabel
                        )}

                        ${escapeHtml(
                            t(
                                "analysis"
                            )
                        )}

                    </h3>

                </div>

            </div>


            <div
                class="result-grid"
            >

                <div
                    class="result-field"
                >

                    <span>
                        ${escapeHtml(
                            t(
                                "status"
                            )
                        )}
                    </span>

                    <strong>
                        ${escapeHtml(
                            t(
                                "successfully_processed"
                            )
                        )}
                    </strong>

                </div>


                ${
                    response?.processed !==
                    undefined

                        ? `

                            <div
                                class="result-field"
                            >

                                <span>
                                    ${escapeHtml(
                                        t(
                                            "processed"
                                        )
                                    )}
                                </span>

                                <strong>

                                    ${formatNumber(
                                        response.processed
                                    )}

                                </strong>

                            </div>

                        `

                        : ""
                }


                ${
                    response?.failed !==
                    undefined

                        ? `

                            <div
                                class="result-field"
                            >

                                <span>
                                    ${escapeHtml(
                                        t(
                                            "failed"
                                        )
                                    )}
                                </span>

                                <strong>

                                    ${formatNumber(
                                        response.failed
                                    )}

                                </strong>

                            </div>

                        `

                        : ""
                }

            </div>

        </div>

    `;


    section.hidden =
        false;


    section.scrollIntoView({
        behavior:
            "smooth",

        block:
            "start"
    });
}


/* =========================================================
   UTILITIES
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;
    }
}


function formatNumber(
    value
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(
            number
        )
    ) {

        return "0";
    }


    return number.toLocaleString(
        getCurrentLanguage() ===
            "ar"

            ? "ar"

            : "en-US"
    );
}


function formatAmount(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "0.00";
    }


    const number =
        Number(value);


    if (
        !Number.isFinite(
            number
        )
    ) {

        return "0.00";
    }


    return number.toLocaleString(
        getCurrentLanguage() ===
            "ar"

            ? "ar"

            : "en-US",
        {
            minimumFractionDigits:
                2,

            maximumFractionDigits:
                2
        }
    );
}


function formatValue(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "—";
    }


    return escapeHtml(
        String(value)
    );
}


function formatDate(
    value
) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return escapeHtml(
            String(value)
        );
    }


    return date.toLocaleDateString(
        getCurrentLanguage() ===
            "ar"

            ? "ar"

            : "en-US",
        {
            year:
                "numeric",

            month:
                "short",

            day:
                "numeric"
        }
    );
}


function formatFileSize(
    bytes
) {

    if (
        bytes < 1024
    ) {

        return `${bytes} B`;
    }


    if (
        bytes <
        1024 * 1024
    ) {

        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;
    }


    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(2)} MB`;
}


/* =========================================================
   SECURITY
   ========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}

/* =========================================================
   ADMIN NAVIGATION
   ========================================================= */

function updateAdminNavigation(
    user
) {

    const adminLink =
        document.getElementById(
            "admin-dashboard-nav"
        );

    if (!adminLink) {
        return;
    }

    if (
        user?.role === "admin"
    ) {

        adminLink.hidden =
            false;

    } else {

        adminLink.hidden =
            true;
    }
}
/* =========================================================
   CURRENT USER
   ========================================================= */

async function loadCurrentUser() {

    try {

        const user =
            await apiRequest(
                `${API_BASE}/auth/me`
            );


        if (!user) {
            return;
        }
        updateAdminNavigation(
            user
        );


        const fullName =
            user.full_name ||
            user.email ||
            t(
                "account"
            );


        const email =
            user.email ||
            "—";


        const initial =
            fullName
                .trim()
                .charAt(0)
                .toUpperCase() ||
            "U";


        setText(
            "user-email",
            fullName
        );


        setText(
            "user-menu-name",
            fullName
        );


        setText(
            "user-menu-email",
            email
        );


        updateDashboardAvatar(
            "user-avatar",
            user.profile_image,
            initial
        );


        updateDashboardAvatar(
            "user-menu-avatar",
            user.profile_image,
            initial
        );


    } catch (error) {

        console.error(
            "Failed to load current user:",
            error
        );
    }
}


/* =========================================================
   DASHBOARD USER AVATAR
   ========================================================= */

function updateDashboardAvatar(
    elementId,
    imagePath,
    initial
) {

    const avatar =
        document.getElementById(
            elementId
        );


    if (!avatar) {
        return;
    }


    avatar.innerHTML =
        "";


    if (imagePath) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            normalizeProfileImageUrl(
                imagePath
            );


        image.alt =
            "Profile image";


        image.loading =
            "eager";


        avatar.appendChild(
            image
        );


    } else {

        const span =
            document.createElement(
                "span"
            );


        span.textContent =
            initial;


        avatar.appendChild(
            span
        );
    }
}


/* =========================================================
   PROFILE IMAGE URL
   ========================================================= */

function normalizeProfileImageUrl(
    imagePath
) {

    if (!imagePath) {
        return "";
    }


    if (
        imagePath.startsWith(
            "http://"
        ) ||
        imagePath.startsWith(
            "https://"
        )
    ) {

        return imagePath;
    }


    if (
        imagePath.startsWith(
            "/"
        )
    ) {

        return imagePath;
    }


    return "/" +
        imagePath.replace(
            /^\/+/,
            ""
        );
}


/* =========================================================
   ACCOUNT MENU
   ========================================================= */

function initializeAccountMenu() {

    const button =
        document.getElementById(
            "user-account-button"
        );


    const menu =
        document.getElementById(
            "user-account-menu"
        );


    const logoutButton =
        document.getElementById(
            "account-menu-logout"
        );


    if (
        !button ||
        !menu
    ) {

        return;
    }


    function closeMenu() {

        menu.hidden =
            true;


        button.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    button.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            const isOpen =
                !menu.hidden;


            menu.hidden =
                isOpen;


            button.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );
        }
    );


    menu.addEventListener(
        "click",
        event => {

            event.stopPropagation();
        }
    );


    document.addEventListener(
        "click",
        closeMenu
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeMenu();
            }
        }
    );


    logoutButton?.addEventListener(
        "click",
        () => {

            closeMenu();


            document
                .getElementById(
                    "logout-button"
                )
                ?.click();
        }
    );
}


/* =========================================================
   GLOBAL LANGUAGE CHANGE
   ========================================================= */

window.addEventListener(
    "languageChanged",
    async event => {

        const language =
            event.detail?.language ||
            getCurrentLanguage();


        /*
         * Update the static DOM.
         */

        window.SmartReceiptLanguage
            ?.translatePage(
                language
            );


        /*
         * Reload dynamic dashboard values.
         */

        await Promise.all([
            loadDashboardStats(),
            loadRecentReceipts()
        ]);


        /*
         * Re-render the current analysis
         * using the new language.
         */

        if (
            currentAnalysisResponse
        ) {

            renderAnalysisResult(
                currentAnalysisResponse
            );
        }


        /*
         * Re-render the currently opened
         * receipt details modal.
         */

        if (
            currentReceiptDetailsData &&
            currentReceiptDetailsContainer
        ) {

            renderReceiptDetails(
                currentReceiptDetailsData,
                currentReceiptDetailsContainer
            );
        }
    }
);


/* =========================================================
   INITIALIZE DASHBOARD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (
            !requireAuthentication()
        ) {

            return;
        }


        initializeReceiptUpload();

        initializePDFUpload();

        initializeBatchUpload();

        initializeLogout();

        initializeMobileMenu();

        initializeModal();

        initializeAccountMenu();


        await loadCurrentUser();


        await Promise.all([
            loadDashboardStats(),
            loadRecentReceipts()
        ]);
    }
);