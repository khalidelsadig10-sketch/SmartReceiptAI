from typing import List

from app.schemas.receipt import Receipt


class ReceiptValidationResult:
    def __init__(
        self,
        receipt: Receipt,
        warnings: List[str],
        errors: List[str],
    ):
        self.receipt = receipt
        self.warnings = warnings
        self.errors = errors

    @property
    def is_valid(self) -> bool:
        return len(self.errors) == 0

    def to_dict(self):
        return {
            "is_valid": self.is_valid,
            "warnings": self.warnings,
            "errors": self.errors,
        }


class ReceiptValidator:
    PRICE_TOLERANCE = 0.02

    @staticmethod
    def _is_placeholder_item(name: str) -> bool:
        normalized = name.strip().lower()

        placeholders = {
            "",
            "-",
            "--",
            "---",
            "n/a",
            "na",
            "null",
            "none",
        }

        return normalized in placeholders

    def validate(self, receipt: Receipt) -> ReceiptValidationResult:
        warnings: List[str] = []
        errors: List[str] = []

        self._validate_items(receipt, warnings, errors)
        self._validate_financials(receipt, warnings, errors)

        return ReceiptValidationResult(
            receipt=receipt,
            warnings=warnings,
            errors=errors,
        )

    def _validate_items(
        self,
        receipt: Receipt,
        warnings: List[str],
        errors: List[str],
    ) -> None:
        for index, item in enumerate(receipt.items, start=1):
            name = item.name.strip()

            if self._is_placeholder_item(name):
                warnings.append(
                    f"Item {index} appears to be a placeholder: '{item.name}'."
                )

            if item.quantity is not None and item.quantity < 0:
                errors.append(
                    f"Item {index} has negative quantity: {item.quantity}."
                )

            if item.unit_price is not None and item.unit_price < 0:
                errors.append(
                    f"Item {index} has negative unit price: {item.unit_price}."
                )

            if item.total_price is not None and item.total_price < 0:
                errors.append(
                    f"Item {index} has negative total price: {item.total_price}."
                )

            if (
                item.quantity is not None
                and item.unit_price is not None
                and item.total_price is not None
            ):
                expected_total = item.quantity * item.unit_price

                if abs(expected_total - item.total_price) > self.PRICE_TOLERANCE:
                    warnings.append(
                        f"Item {index} price mismatch: "
                        f"quantity={item.quantity}, "
                        f"unit_price={item.unit_price}, "
                        f"total_price={item.total_price}."
                    )

    def _validate_financials(
        self,
        receipt: Receipt,
        warnings: List[str],
        errors: List[str],
    ) -> None:
        financial = receipt.financial

        if financial.subtotal is not None and financial.subtotal < 0:
            errors.append(
                f"Negative subtotal: {financial.subtotal}."
            )

        if financial.tax is not None and financial.tax < 0:
            errors.append(
                f"Negative tax: {financial.tax}."
            )

        if financial.discount is not None and financial.discount < 0:
            errors.append(
                f"Negative discount: {financial.discount}."
            )

        if financial.total is not None and financial.total < 0:
            errors.append(
                f"Negative total: {financial.total}."
            )

        if financial.subtotal is not None:
            item_totals = [
                item.total_price
                for item in receipt.items
                if item.total_price is not None
            ]

            if item_totals:
                calculated_subtotal = round(sum(item_totals), 2)

                if abs(calculated_subtotal - financial.subtotal) > self.PRICE_TOLERANCE:
                    warnings.append(
                        "Items total does not match receipt subtotal: "
                        f"items={calculated_subtotal}, "
                        f"subtotal={financial.subtotal}."
                    )

        if (
                financial.subtotal is not None
                and financial.subtotal > 0
            ):
            # Some receipts only show the final total
            # without subtotal/tax details.
            # Avoid false mismatch warnings.

            has_financial_breakdown = (
                financial.subtotal > 0
                or (financial.tax is not None and financial.tax > 0)
                or (financial.discount is not None and financial.discount > 0)
            )

            if has_financial_breakdown:

                expected_total = financial.subtotal

                if financial.tax is not None:
                    expected_total += financial.tax

                if financial.discount is not None:
                    expected_total -= financial.discount

                expected_total = round(expected_total, 2)

                if abs(expected_total - financial.total) > self.PRICE_TOLERANCE:
                    warnings.append(
                        "Financial total mismatch: "
                        f"calculated={expected_total}, "
                        f"receipt_total={financial.total}."
                    )