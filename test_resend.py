import os
import resend
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("RESEND_API_KEY")
if not api_key:
    raise RuntimeError("RESEND_API_KEY is missing from .env")
resend.api_key = api_key
result = resend.Emails.send({
    "from": "onboarding@resend.dev",
    "to": ["delivered@resend.dev"],
    "subject": "SmartReceiptAI Test Email",
    "html": "<h1>SmartReceiptAI</h1><p>Email test successful.</p>",
})
print(result)
