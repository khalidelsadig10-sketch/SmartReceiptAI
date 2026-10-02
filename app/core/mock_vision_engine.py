from app.schemas.receipt import (
    Financial,
    Merchant,
    Payment,
    Receipt,
    ReceiptInfo,
    ReceiptItem,
)


class MockVisionEngine:

    model = "mock-vision"

    def analyze(self, image_path: str) -> Receipt:
        return Receipt(
            merchant=Merchant(
                name="MOCK MERCHANT",
                category="Supermarket",
                address="Mock Address",
                phone="0000000000",
            ),
            receipt_info=ReceiptInfo(
                invoice_number="MOCK-001",
                date="2026-01-01",
                time="12:00 PM",
                currency="USD",
            ),
            items=[
                ReceiptItem(
                    name="Mock Product A",
                    quantity=2.0,
                    unit_price=10.0,
                    total_price=20.0,
                ),
                ReceiptItem(
                    name="Mock Product B",
                    quantity=1.0,
                    unit_price=5.0,
                    total_price=5.0,
                ),
            ],
            financial=Financial(
                subtotal=25.0,
                tax=2.5,
                tax_rate=10.0,
                discount=None,
                total=27.5,
            ),
            payment=Payment(
                method="CARD",
            ),
        )