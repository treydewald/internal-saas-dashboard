"""Background job to publish real-time API logs via WebSocket"""
import asyncio
import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.services.websocket_service import connection_manager
from app.models.api_log import APILog
from app.database.init_db import SessionLocal

logger = logging.getLogger(__name__)

# Track last published timestamp to avoid duplicates
last_published_timestamp = None


async def publish_logs_loop(interval: int = 10):
    """
    Periodically publish recent API logs to all connected clients.

    Args:
        interval: Interval in seconds between broadcasts (default: 10)
    """
    global last_published_timestamp
    db: Session | None = None

    while True:
        try:
            if connection_manager.get_connection_count() == 0:
                # No clients connected, wait before checking again
                await asyncio.sleep(interval)
                continue

            # Get database session and fetch recent logs
            db = SessionLocal()

            # Query logs from last 10 seconds
            cutoff_time = datetime.utcnow() - timedelta(seconds=interval)
            recent_logs = (
                db.query(APILog)
                .filter(APILog.timestamp >= cutoff_time)
                .order_by(desc(APILog.timestamp))
                .limit(10)
                .all()
            )

            db.close()

            if recent_logs:
                # Format message
                message = {
                    "type": "log_event",
                    "data": {
                        "logs": [
                            {
                                "id": log.id,
                                "timestamp": log.timestamp.isoformat() + "Z" if log.timestamp else None,
                                "endpoint": log.endpoint,
                                "method": log.method,
                                "status_code": log.status_code,
                                "response_time_ms": log.response_time_ms,
                                "user_id": log.user_id,
                            }
                            for log in recent_logs
                        ]
                    },
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                }

                # Broadcast to all connected clients
                await connection_manager.broadcast(message)
                logger.debug(f"Published {len(recent_logs)} API logs to {connection_manager.get_connection_count()} clients")

                last_published_timestamp = recent_logs[0].timestamp

        except Exception as e:
            logger.error(f"Error publishing logs: {e}")
        finally:
            if db:
                db.close()
            # Wait before next broadcast
            await asyncio.sleep(interval)


def start_logs_publisher():
    """Start the logs publisher in the background"""
    asyncio.create_task(publish_logs_loop(interval=10))
    logger.info("Logs publisher started (10s interval)")
