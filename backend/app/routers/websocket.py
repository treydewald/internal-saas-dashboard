"""WebSocket routes for real-time data streaming"""
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.services.websocket_service import connection_manager
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ws", tags=["websocket"])


@router.websocket("/ws/connect")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: str = Query(None, description="User ID for personalized updates"),
):
    """
    WebSocket endpoint for real-time updates.

    Clients connect to /ws/connect?user_id=<user_id> to receive:
    - KPI updates (metrics, active users, requests, etc.)
    - API log events (in real-time as requests complete)
    - System status updates

    Message format:
    {
        "type": "kpi_update" | "log_event" | "connection_status",
        "data": {...},
        "timestamp": "2024-06-15T12:30:45Z"
    }
    """
    await connection_manager.connect(websocket, user_id)

    # Send initial connection confirmation
    await connection_manager.send_personal_message(
        {
            "type": "connection_status",
            "data": {"status": "connected", "user_id": user_id},
            "timestamp": None,
        },
        websocket,
    )

    try:
        while True:
            # Keep connection alive and receive messages from client
            # Client can send ping/keepalive messages
            data = await websocket.receive_text()
            logger.debug(f"Received message from client: {data}")

            # Optionally handle client messages (e.g., subscription changes)
            # For now, just acknowledge
            await connection_manager.send_personal_message(
                {
                    "type": "ack",
                    "data": {"message": "Message received"},
                    "timestamp": None,
                },
                websocket,
            )
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket)
        logger.info(f"WebSocket client disconnected. Active connections: {connection_manager.get_connection_count()}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        connection_manager.disconnect(websocket)


@router.get("/ws/status")
async def websocket_status():
    """
    Get WebSocket server status.

    Returns active connection count and server info.
    """
    return {
        "status": "active",
        "active_connections": connection_manager.get_connection_count(),
        "server_version": "1.0.0",
        "real_time_enabled": True,
    }
