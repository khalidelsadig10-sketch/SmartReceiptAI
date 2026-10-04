import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


SMTP_EMAIL = os.getenv("SMTP_EMAIL", "khalidelsadig10@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "wzpjarkfahzmktqb")
MAIL_FROM = os.getenv(
    "MAIL_FROM",
    "SmartReceiptAI <khalidelsadig10@gmail.com>",
)
RESET_PASSWORD_URL = os.getenv(
    "RESET_PASSWORD_URL",
    "https://smartreceiptai1.up.railway.app/reset-password",
)


def send_password_reset_email(
    recipient: str,
    token: str,
) -> None:

    if not SMTP_EMAIL or not SMTP_PASSWORD:
        raise RuntimeError(
            "SMTP_EMAIL or SMTP_PASSWORD is not configured."
        )

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

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset your SmartReceiptAI password"
    msg["From"] = MAIL_FROM
    msg["To"] = recipient

    part = MIMEText(html, "html")
    msg.attach(part)

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, recipient, msg.as_string())
        server.quit()
    except Exception as e:
        raise RuntimeError(f"Failed to send email via SMTP: {e}")