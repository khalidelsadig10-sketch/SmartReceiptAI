import os

import resend


RESEND_API_KEY = os.getenv("RESEND_API_KEY")
MAIL_FROM = os.getenv(
    "MAIL_FROM",
    "SmartReceiptAI <onboarding@resend.dev>",
)
RESET_PASSWORD_URL = os.getenv(
    "RESET_PASSWORD_URL",
    "http://127.0.0.1:8000/reset-password",
)


def send_password_reset_email(
    recipient: str,
    token: str,
) -> None:

    if not RESEND_API_KEY:
        raise RuntimeError(
            "RESEND_API_KEY is not configured."
        )

    resend.api_key = RESEND_API_KEY

    reset_url = (
        f"{RESET_PASSWORD_URL}"
        f"?token={token}"
    )

    html = f"""
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f4f6fa;
        font-family:Arial,Helvetica,sans-serif;
        color:#151827;
    "
>

    <div
        style="
            max-width:600px;
            margin:40px auto;
            background:#ffffff;
            border:1px solid #e5e8ef;
            border-radius:18px;
            overflow:hidden;
        "
    >

        <div
            style="
                padding:28px 30px;
                background:#15182f;
                color:#ffffff;
            "
        >

            <div
                style="
                    font-size:22px;
                    font-weight:700;
                "
            >
                Smart<span style="color:#aeb1ff;">
                    Receipt
                </span>AI
            </div>

        </div>


        <div
            style="
                padding:36px 30px;
            "
        >

            <h1
                style="
                    margin:0 0 14px;
                    font-size:25px;
                "
            >
                Reset your password
            </h1>


            <p
                style="
                    margin:0 0 18px;
                    color:#687083;
                    line-height:1.7;
                "
            >
                We received a request to reset the password
                for your SmartReceiptAI account.
            </p>


            <p
                style="
                    margin:0 0 28px;
                    color:#687083;
                    line-height:1.7;
                "
            >
                Click the button below to create a new password.
            </p>


            <a
                href="{reset_url}"
                style="
                    display:inline-block;
                    padding:13px 22px;
                    background:#5559d6;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:10px;
                    font-weight:700;
                "
            >
                Reset Password
            </a>


            <p
                style="
                    margin:28px 0 0;
                    color:#98a0b1;
                    font-size:13px;
                    line-height:1.7;
                "
            >
                This link will expire in 15 minutes
                and can only be used once.
            </p>


            <p
                style="
                    margin:18px 0 0;
                    color:#98a0b1;
                    font-size:13px;
                    line-height:1.7;
                "
            >
                If you did not request a password reset,
                you can safely ignore this email.
            </p>

        </div>


        <div
            style="
                padding:20px 30px;
                border-top:1px solid #eef0f4;
                color:#98a0b1;
                font-size:12px;
            "
        >
            SmartReceiptAI Security
        </div>

    </div>

</body>

</html>
"""

    params = {
        "from": MAIL_FROM,
        "to": [recipient],
        "subject": "Reset your SmartReceiptAI password",
        "html": html,
    }

    resend.Emails.send(params)