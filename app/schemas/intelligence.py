from datetime import datetime

from pydantic import BaseModel, Field


# =========================================================
# AI Overview
# =========================================================

class IntelligenceOverview(BaseModel):
    total_analyses: int = 0
    successful_analyses: int = 0
    failed_analyses: int = 0
    success_rate: float = 0.0


# =========================================================
# Vision Model
# =========================================================

class IntelligenceVisionModel(BaseModel):
    model_name: str
    analyses: int = 0
    successful: int = 0
    failed: int = 0


# =========================================================
# Recent Analysis
# =========================================================

class IntelligenceRecentAnalysis(BaseModel):
    id: int
    receipt_id: int
    merchant_name: str | None = None
    model_name: str
    status: str
    created_at: datetime


# =========================================================
# Processing Pipeline
# =========================================================

class IntelligencePipelineStep(BaseModel):
    key: str
    title: str
    description: str
    status: str = "active"


# =========================================================
# Response Data
# =========================================================

class IntelligenceData(BaseModel):
    overview: IntelligenceOverview

    vision_models: list[
        IntelligenceVisionModel
    ] = Field(default_factory=list)

    recent_analyses: list[
        IntelligenceRecentAnalysis
    ] = Field(default_factory=list)

    pipeline: list[
        IntelligencePipelineStep
    ] = Field(default_factory=list)


# =========================================================
# Response
# =========================================================

class IntelligenceResponse(BaseModel):
    success: bool
    data: IntelligenceData