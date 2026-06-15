"""Background job to publish real-time metrics via WebSocket"""
import asyncio
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.services.websocket_service import connection_manager
from app.services.analytics_service import AnalyticsService
from app.database.init_db import SessionLocal

logger = logging.getLogger(__name__)


async def publish_metrics_loop(interval: int = 30):
    """
    Periodically publish KPI metrics to all connected clients.

    Args:
        interval: Interval in seconds between broadcasts (default: 30)
    """
    db: Session | None = None

    while True:
        try:
            if connection_manager.get_connection_count() == 0:
                # No clients connected, wait before checking again
                await asyncio.sleep(interval)
                continue

            # Get database session and fetch current KPIs
            db = SessionLocal()
            kpis_response = AnalyticsService.get_kpis(db)
            db.close()

            # Format message
            message = {
                "type": "kpi_update",
                "data": {
                    "kpis": [
                        {
                            "name": kpi.name,
                            "value": kpi.value,
                            "unit": kpi.unit,
                            "trend": {
                                "direction": kpi.trend.direction,
                                "percent": kpi.trend.percent,
                            } if kpi.trend else None,
                        }
                        for kpi in kpis_response.kpis
                    ]
                },
                "timestamp": datetime.utcnow().isoformat() + "Z",
            }

            # Broadcast to all connected clients
            await connection_manager.broadcast(message)
            logger.debug(f"Published KPI update to {connection_manager.get_connection_count()} clients")

        except Exception as e:
            logger.error(f"Error publishing metrics: {e}")
        finally:
            if db:
                db.close()
            # Wait before next broadcast
            await asyncio.sleep(interval)


def start_metrics_publisher():
    """Start the metrics publisher in the background"""
    asyncio.create_task(publish_metrics_loop(interval=30))
    logger.info("Metrics publisher started (30s interval)")
