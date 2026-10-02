import base64
import mimetypes
from pathlib import Path

from app.core.openai_client import OpenAIClient
from app.core.config import settings


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
            encoded = base64.b64encode(image_file.read()).decode("utf-8")

        return f"data:{mime_type};base64,{encoded}"

    def analyze(self, image_path: str) -> str:
        image_data = self._encode_image(image_path)

        response = self.client.responses.create(
            model=self.model,
            input=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                           "text": (
                                "Analyze this receipt image carefully.\n\n"

                                "You are a professional receipt extraction AI.\n"
                                "Extract all visible information from the receipt.\n\n"

                                "Return the result as structured receipt data.\n\n"

                                "Required fields:\n"

                                "MERCHANT:\n"
                                "- merchant name\n"
                                "- category if available\n"
                                "- address if available\n\n"

                                "RECEIPT INFORMATION:\n"
                                "- invoice number\n"
                                "- date\n"
                                "- time\n"
                                "- currency\n\n"

                                "FINANCIAL INFORMATION:\n"
                                "- subtotal (before tax amount)\n"
                                "- tax amount\n"
                                "- discount amount\n"
                                "- final total amount\n\n"

                                "FINANCIAL INTERPRETATION RULES:\n"
                                "- Subtotal may appear as: Subtotal, Net, Netto, Imponibile, Amount before tax.\n"
                                "- Tax may appear as: Tax, VAT, IVA, Imposta.\n"
                                "- Total may appear as: Total, Totale, Grand Total, Amount Due.\n"
                                "- If subtotal is not explicitly written but item prices are available, "
                                "calculate subtotal from the item totals.\n"
                                "- Never return subtotal as 0 when product totals are available.\n\n"

                                "PRODUCT ITEMS:\n"
                                "For every item line extract:\n"
                                "- product name\n"
                                "- quantity\n"
                                "- unit price\n"
                                "- total price\n\n"

                                "IMPORTANT RULES:\n"
                                "1. Never set prices to zero if a price is visible.\n"
                                "2. Preserve the original currency exactly.\n"
                                "3. Read all Arabic and English text.\n"
                                "4. If a value is missing, return null.\n"
                                "5. Do not guess product prices.\n"
                                "6. Include every visible product line.\n"
                                "7. For each product, extract the actual unit price when visible. "
                                "Do not leave unit_price as 0 if the receipt shows it.\n"
                            ),
                        },
                        {
                            "type": "input_image",
                            "image_url": image_data,
                        },
                    ],
                }
            ],
        )

        print(response.output_text)

        return response.output_text