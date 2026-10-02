from app.schemas.receipt import Receipt


class ProductNormalizer:

    PLACEHOLDER_NAMES = {
        "",
        "--",
        "-",
        "N/A",
        "NA",
        "NULL",
        "NONE",
    }

    def normalize(self, receipt: Receipt) -> Receipt:

        normalized_items = []

        for item in receipt.items:

            name = self._normalize_name(item.name)

            if name is None:
                continue

            item.name = name

            item = self._calculate_unit_price(item)
            item = self._calculate_total_price(item)

            normalized_items.append(item)

        receipt.items = normalized_items

        return receipt

    @classmethod
    def _normalize_name(cls, name: str | None) -> str | None:

        if name is None:
            return None

        cleaned = " ".join(name.strip().split())

        if cleaned.upper() in cls.PLACEHOLDER_NAMES:
            return None

        return cleaned

    @staticmethod
    def _calculate_unit_price(item):

        if (
            (item.unit_price is None or item.unit_price == 0)
            and item.total_price is not None
            and item.quantity is not None
            and item.quantity > 0
        ):

            item.unit_price = round(
                item.total_price / item.quantity,
                2
            )

        return item

    @staticmethod
    def _calculate_total_price(item):

        if (
            item.total_price is None
            and item.quantity is not None
            and item.unit_price is not None
            and item.quantity > 0
        ):

            item.total_price = round(
                item.quantity * item.unit_price,
                2
            )

        return item