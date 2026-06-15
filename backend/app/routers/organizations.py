"""Organization management routes"""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.organization import (
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationResponse,
    OrganizationListResponse,
    UserOrgResponse,
)
from app.services.org_service import OrgService

router = APIRouter(prefix="/api/organizations", tags=["organizations"])


@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    org_data: OrganizationCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new organization"""
    org = OrgService.create_organization(db, org_data, current_user["user_id"])
    return org


@router.get("", response_model=OrganizationListResponse)
async def list_user_organizations(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all organizations for current user"""
    orgs, total_count = OrgService.get_user_organizations(db, current_user["user_id"])
    return OrganizationListResponse(organizations=orgs, total_count=total_count)


@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get organization details (verify access)"""
    org = OrgService.get_organization(db, org_id)

    # Verify user has access
    from app.middleware.org_isolation import verify_org_access
    await verify_org_access(org_id, current_user["user_id"], db)

    return org


@router.put("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: int,
    org_data: OrganizationUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update organization (admin only)"""
    # Verify user has admin access
    from app.middleware.org_isolation import verify_org_access
    org_context = await verify_org_access(org_id, current_user["user_id"], db)

    if org_context["org_role"] != "admin":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organization admins can update organization details",
        )

    org = OrgService.update_organization(db, org_id, org_data)
    return org


@router.post("/{org_id}/members", response_model=UserOrgResponse, status_code=status.HTTP_201_CREATED)
async def add_organization_member(
    org_id: int,
    user_id: int = Query(...),
    role: str = Query("member"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add user to organization (admin only)"""
    # Verify user has admin access
    from app.middleware.org_isolation import verify_org_access
    org_context = await verify_org_access(org_id, current_user["user_id"], db)

    if org_context["org_role"] != "admin":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organization admins can add members",
        )

    user_org = OrgService.add_user_to_organization(db, org_id, user_id, role)
    return user_org


@router.delete("/{org_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_organization_member(
    org_id: int,
    user_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove user from organization (admin only)"""
    # Verify user has admin access
    from app.middleware.org_isolation import verify_org_access
    org_context = await verify_org_access(org_id, current_user["user_id"], db)

    if org_context["org_role"] != "admin":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organization admins can remove members",
        )

    OrgService.remove_user_from_organization(db, org_id, user_id)
    return None


@router.put("/{org_id}/members/{user_id}/role", response_model=UserOrgResponse)
async def update_member_role(
    org_id: int,
    user_id: int,
    new_role: str = Query(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user's role in organization (admin only)"""
    # Verify user has admin access
    from app.middleware.org_isolation import verify_org_access
    org_context = await verify_org_access(org_id, current_user["user_id"], db)

    if org_context["org_role"] != "admin":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organization admins can update member roles",
        )

    user_org = OrgService.update_user_role(db, org_id, user_id, new_role)
    return user_org
