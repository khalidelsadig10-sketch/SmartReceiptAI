from app.schemas.receipt import Receipt


class FinancialRecovery:

    def normalize(
        self,
        receipt: Receipt
    ) -> Receipt:

        financial = receipt.financial

        # Recover subtotal from detected products
        if (
            financial.subtotal is None
            or financial.subtotal == 0
        ):

            items_total = sum(
                item.total_price or 0
                for item in receipt.items
            )

            if items_total > 0:
                financial.subtotal = round(
                    items_total,
                    2
                )

        # Recover total if missing
        if (
            financial.total is None
            and financial.subtotal is not None
        ):

            total = financial.subtotal

            if financial.tax:
                total += financial.tax

            if financial.discount:
                total -= financial.discount

            financial.total = round(
                total,
                2
            )

        return receipt