"""WebSocket service for real-time data streaming"""
import json
import logging
import asyncio
from typing import Set, Dict, Any
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.connection_metadata: Dict[WebSocket, Dict[str, Any]] = {}

    async def connect(self, websocket: WebSocket, user_id: str | None = None):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.add(websocket)
        self.connection_metadata[websocket] = {
            "user_id": user_id,
            "connected_at": asyncio.get_event_loop().time(),
        }
        logger.info(f"Client connected: {len(self.active_connections)} active connections")

    def disconnect(self, websocket: WebSocket):
        """Remove a disconnected WebSocket"""
        if websocket in self.active_connections:
            self.active_connections.discard(websocket)
            self.connection_metadata.pop(websocket, None)
            logger.info(f"Client disconnected: {len(self.active_connections)} active connections")

    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast message to all connected clients"""
        if not self.active_connections:
            return

        disconnected = set()
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to client: {e}")
                disconnected.add(connection)

        for connection in disconnected:
            self.disconnect(connection)

    async def broadcast_to_user(self, user_id: str, message: Dict[str, Any]):
        """Broadcast message to a specific user's connections"""
        disconnected = set()
        for connection in self.active_connections:
            metadata = self.connection_metadata.get(connection, {})
            if metadata.get("user_id") == user_id:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error broadcasting to user {user_id}: {e}")
                    disconnected.add(connection)

        for connection in disconnected:
            self.disconnect(connection)

    async def send_personal_message(self, message: Dict[str, Any], websocket: WebSocket):
        """Send message to a specific connection"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            self.disconnect(websocket)

    def get_connection_count(self) -> int:
        """Get count of active connections"""
        return len(self.active_connections)

    def get_user_connection_count(self, user_id: str) -> int:
        """Get count of connections for a specific user"""
        return sum(
            1 for metadata in self.connection_metadata.values()
            if metadata.get("user_id") == user_id
        )


# Global connection manager instance
connection_manager = ConnectionManager()
