import os

import pytest
from openai import OpenAI


@pytest.mark.live
def test_openai_connection():
    if not os.getenv("OPENAI_API_KEY"):
        pytest.skip(
            "OPENAI_API_KEY is not configured."
        )

    client = OpenAI()

    response = client.responses.create(
        model="gpt-5-mini",
        input="Reply with exactly: OK",
    )

    assert response.output_text.strip() == "OK"

    print("\n===== OPENAI CONNECTION TEST =====")
    print("OpenAI connection successful.")