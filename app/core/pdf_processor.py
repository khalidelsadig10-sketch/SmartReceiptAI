from pathlib import Path

import fitz


class PDFProcessor:
    def __init__(
        self,
        output_dir: str = "uploads/pdf_pages",
    ):
        self.output_dir = Path(output_dir)

        self.output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

    def convert_to_images(
        self,
        pdf_path: str,
    ) -> list[str]:

        path = Path(pdf_path)

        if not path.exists():
            raise FileNotFoundError(
                f"PDF file not found: {path}"
            )

        if path.suffix.lower() != ".pdf":
            raise ValueError(
                "The provided file is not a PDF."
            )

        document = fitz.open(path)

        image_paths: list[str] = []

        try:
            for page_number, page in enumerate(
                document
            ):
                pixmap = page.get_pixmap(
                    matrix=fitz.Matrix(2, 2),
                    alpha=False,
                )

                image_path = (
                    self.output_dir
                    / (
                        f"{path.stem}"
                        f"_page_{page_number + 1}.png"
                    )
                )

                pixmap.save(str(image_path))

                image_paths.append(
                    str(image_path)
                )

        finally:
            document.close()

        return image_paths