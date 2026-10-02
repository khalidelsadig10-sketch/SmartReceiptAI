from pathlib import Path

from app.core.openai_vision_engine import OpenAIVisionEngine


IMAGE_DIR = Path("test_images")

engine = OpenAIVisionEngine()

images = sorted(
    path
    for path in IMAGE_DIR.iterdir()
    if path.is_file()
    and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
)

print(f"\nFound {len(images)} images.")

for image_path in images:
    print("\n" + "=" * 70)
    print(f"PROCESSING: {image_path.name}")
    print("=" * 70)

    try:
        receipt = engine.analyze(str(image_path))

        print(receipt.model_dump_json(indent=2))
        print("\nSTATUS: SUCCESS")

    except Exception as exc:
        print(f"\nSTATUS: FAILED")
        print(f"ERROR: {type(exc).__name__}: {exc}")