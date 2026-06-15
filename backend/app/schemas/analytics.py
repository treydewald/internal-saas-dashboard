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


class APIActivityDataPoint(BaseModel):
    date: str  # ISO format YYYY-MM-DD
    count: int


class APIActivityResponse(BaseModel):
    data: List[APIActivityDataPoint]


class MetricResponse(BaseModel):
    name: str
    value: float
    unit: Optional[str] = None


class MetricsResponse(BaseModel):
    metrics: List[MetricResponse]
