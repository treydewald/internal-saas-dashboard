"""Analytics schemas for KPI responses"""
from pydantic import BaseModel
from typing import List, Optional


class TrendInfo(BaseModel):
    direction: str  # 'up' or 'down'
    percent: float


class KPIResponse(BaseModel):
    name: str
    value: float
    unit: Optional[str] = None
    trend: Optional[TrendInfo] = None


class KPIsResponse(BaseModel):
    kpis: List[KPIResponse]
