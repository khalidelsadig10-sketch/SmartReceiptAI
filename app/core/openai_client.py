from openai import OpenAI
from app.core.config import settings


class OpenAIClient:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY
        )

    def get_client(self) -> OpenAI:
        return self.client