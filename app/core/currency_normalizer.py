from app.schemas.receipt import Receipt


class CurrencyNormalizer:

    DEFAULT_CURRENCY = "SDG"

    CURRENCY_MAP = {
        "SD": "SDG",
        "SDG": "SDG",
        "جنيه": "SDG",
        "جنيه سوداني": "SDG",

        "$": "USD",
        "USD": "USD",
        "دولار": "USD",

        "€": "EUR",
        "EUR": "EUR",

        "SAR": "SAR",
        "ريال": "SAR",
    }


    def normalize(self, receipt: Receipt) -> Receipt:

        currency = receipt.receipt_info.currency

        if not currency:
            receipt.receipt_info.currency = self.DEFAULT_CURRENCY
            return receipt


        cleaned = currency.strip().upper()

        receipt.receipt_info.currency = self.CURRENCY_MAP.get(
            cleaned,
            self.DEFAULT_CURRENCY
        )

        return receipt