import json
from pathlib import Path
from urllib.parse import urlparse

import cv2


class QRCodeReader:

    def __init__(self):
        self.detector = cv2.QRCodeDetector()

    def read(self, image_path: str | Path) -> dict:

        image_path = Path(image_path)

        image = cv2.imread(
            str(image_path)
        )

        if image is None:
            raise ValueError(
                f"Unable to read image: {image_path}"
            )

        variants = [
            ("original", image)
        ]

        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

        variants.append(
            ("gray", gray)
        )

        threshold = cv2.threshold(
            gray,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )[1]

        variants.append(
            ("threshold", threshold)
        )

        adaptive = cv2.adaptiveThreshold(
            gray,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            31,
            5
        )

        variants.append(
            ("adaptive", adaptive)
        )

        resized = cv2.resize(
            image,
            None,
            fx=2,
            fy=2,
            interpolation=cv2.INTER_CUBIC
        )

        variants.append(
            ("resized", resized)
        )

        for method, variant in variants:

            data, points, _ = (
                self.detector.detectAndDecode(
                    variant
                )
            )

            if data:
                return {
                    "detected": True,
                    "data": data,
                    "qr_type": self._detect_type(
                        data
                    ),
                    "method": method,
                    "count": 1
                }

        return {
            "detected": False,
            "data": None,
            "qr_type": None,
            "method": None,
            "count": 0
        }

    def _detect_type(
        self,
        data: str
    ) -> str:

        value = data.strip()

        try:
            json.loads(value)
            return "JSON"
        except (
            json.JSONDecodeError,
            TypeError,
            ValueError
        ):
            pass

        parsed = urlparse(value)

        if parsed.scheme in {
            "http",
            "https"
        }:
            return "URL"

        return "TEXT"