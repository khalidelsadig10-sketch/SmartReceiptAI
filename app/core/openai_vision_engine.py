import base64
import mimetypes
from pathlib import Path

from app.core.config import settings
from app.core.openai_client import OpenAIClient
from app.schemas.receipt import Receipt


class OpenAIVisionEngine:
    def __init__(self):
        self.client = OpenAIClient().get_client()
        self.model = settings.OPENAI_MODEL

    @staticmethod
    def _encode_image(image_path: str) -> str:
        path = Path(image_path)

        if not path.exists():
            raise FileNotFoundError(f"Image not found: {path}")

        mime_type, _ = mimetypes.guess_type(path.name)

        if mime_type is None:
            mime_type = "image/jpeg"

        with open(path, "rb") as image_file:
            encoded = base64.b64encode(
                image_file.read()
            ).decode("utf-8")

        return f"data:{mime_type};base64,{encoded}"

    def analyze(self, image_path: str) -> Receipt:
        image_data = self._encode_image(image_path)

        response = self.client.responses.parse(
            model=self.model,
            input=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": """
Analyze this receipt or invoice image as a document with a visual layout.

Extract the receipt information into the provided structured schema.

IMPORTANT ITEM EXTRACTION RULES:

1. Read each product line according to its visual position on the receipt.

2. Do not assign a number to quantity, unit_price, or total_price merely
because the number appears near the product name.

3. Distinguish carefully between:
- quantity
- unit price
- line total

4. If the receipt uses weighted products, preserve the printed
weight/quantity exactly as quantity when it is clearly shown.

5. If a number is part of the product name or description, do not treat it
as a price or quantity.

6. If the visual relationship between a number and a field is unclear,
use null instead of guessing.

7. Never move a price from one item to another.

8. If quantity and unit_price are clearly associated with the same product
line and the printed receipt does not provide a separate line total,
return total_price as null. The application may calculate it later.

9. Preserve duplicate products as separate line items when they appear as
separate lines on the receipt.

10. Preserve the original order of receipt items.

FINANCIAL EXTRACTION RULES:

1. Extract subtotal, tax, tax_rate, discount, and total only when they are
visibly present on the receipt.

2. Receipts may contain more than one tax, such as GST, PST, VAT, sales tax,
service tax, or similar tax lines.

3. When multiple tax amounts are clearly visible but the structured schema
provides only one tax field, combine the tax amounts into the single tax
field.

4. When multiple tax rates are clearly visible and the structured schema
provides only one tax_rate field, use the sum of the applicable tax rates.

5. For example, if the receipt shows:
GST (5%) = 26.21
PST (7%) = 36.69

extract:
tax = 62.90
tax_rate = 12

6. Do not confuse subtotal with total.

7. Do not treat a tax amount as a discount.

8. Do not calculate a missing subtotal.

9. Do not calculate a missing tax amount.

10. Do not calculate a missing total.

11. If a financial value is unclear or not visibly present, use null.

12. If multiple financial lines explain the final total, extract all
available amounts into the supported structured fields so that the
financial relationship can be validated correctly.

GENERAL RULES:

- Read Arabic and English text.
- Preserve product names as printed when possible.
- Do not invent merchant information.
- Do not invent dates, invoice numbers, currencies, prices, taxes, or
payment methods.
- Use null whenever information is not reliably visible.
- The image is the source of truth.
""",
                        },
                        {
                            "type": "input_image",
                            "image_url": image_data,
                        },
                    ],
                }
            ],
            text_format=Receipt,
        )

        if response.output_parsed is None:
            raise ValueError(
                "OpenAI returned no structured receipt data."
            )

        return response.output_parsed