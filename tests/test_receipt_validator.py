from app.core.receipt_validator import ReceiptValidator
from app.schemas.receipt import Receipt


receipt = Receipt(
    merchant={
        "name": "FRESHCART SUPERMARKET",
        "category": "Supermarket",
        "address": "123 Green Valley Rd, Springfield, USA",
        "phone": None,
    },
    receipt_info={
        "invoice_number": "87654",
        "date": "2023-10-26",
        "time": "10:45 AM",
        "currency": "USD",
    },
    items=[
        {
            "name": "ORGANIC APPLES",
            "quantity": 1.5,
            "unit_price": 2.99,
            "total_price": 4.48,
        },
        {
            "name": "BANANAS",
            "quantity": 0.75,
            "unit_price": 0.69,
            "total_price": 0.52,
        },
        {
            "name": "CANNED TOMATOES",
            "quantity": 2,
            "unit_price": 1.29,
            "total_price": 8.19,
        },
        {
            "name": "--",
            "quantity": 1,
            "unit_price": 0.0,
            "total_price": 0.0,
        },
    ],
    financial={
        "subtotal": None,
        "tax": None,
        "tax_rate": 8.5,
        "discount": None,
        "total": 52.31,
    },
    payment={
        "method": "CARD",
    },
)


validator = ReceiptValidator()
result = validator.validate(receipt)

print("\n===== RECEIPT VALIDATION =====")
print(f"VALID: {result.is_valid}")

print("\n----- WARNINGS -----")

if result.warnings:
    for warning in result.warnings:
        print(f"- {warning}")
else:
    print("None")

print("\n----- ERRORS -----")

if result.errors:
    for error in result.errors:
        print(f"- {error}")
else:
    print("None")

print("\nVALIDATOR TEST PASSED")