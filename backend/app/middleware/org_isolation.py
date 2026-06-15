"""Organization isolation middleware for data segregation"""
from fastapi import HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.models.organization import UserOrg


async def verify_org_access(
    org_id: int,
    current_user_id: int,
    db: Session,
) -> dict:
    """
    Verify that user has access to the specified organization.
    Returns organization context for the request.
    """
    # Check if user is a member of this organization
    user_org = db.query(UserOrg).filter(
        UserOrg.organization_id == org_id,
        UserOrg.user_id == current_user_id,
        UserOrg.is_active == True,
    ).first()

    if not user_org:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this organization",
        )

    return {
        "org_id": org_id,
        "user_id": current_user_id,
        "org_role": user_org.role,
    }


def create_org_filter(current_org_id: int):
    """
    Create an organization ID filter for database queries.
    Use this to automatically filter results by organization.
    """
    return {"organization_id": current_org_id}
