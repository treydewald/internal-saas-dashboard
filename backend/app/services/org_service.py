"""Organization service - business logic for multi-tenancy"""
from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
from app.models.organization import Organization, UserOrg
from app.schemas.organization import OrganizationCreate, OrganizationUpdate


class OrgService:
    """Service for organization management"""

    @staticmethod
    def create_organization(db: Session, org_data: OrganizationCreate, creator_user_id: int) -> Organization:
        """Create a new organization"""
        # Check if slug already exists
        existing_org = db.query(Organization).filter(Organization.slug == org_data.slug).first()
        if existing_org:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Organization slug already exists",
            )

        # Create organization
        org = Organization(
            name=org_data.name,
            slug=org_data.slug,
            description=org_data.description,
            logo_url=org_data.logo_url,
        )

        db.add(org)
        db.flush()  # Get the org ID without committing

        # Add creator as admin
        user_org = UserOrg(
            user_id=creator_user_id,
            organization_id=org.id,
            role="admin",
        )
        db.add(user_org)
        db.commit()
        db.refresh(org)
        return org

    @staticmethod
    def get_organization(db: Session, org_id: int) -> Organization:
        """Get organization by ID"""
        org = db.query(Organization).filter(Organization.id == org_id).first()
        if not org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found",
            )
        return org

    @staticmethod
    def get_user_organizations(db: Session, user_id: int) -> tuple[list[Organization], int]:
        """Get all organizations for a user"""
        query = db.query(Organization).join(UserOrg).filter(
            and_(
                UserOrg.user_id == user_id,
                UserOrg.is_active == True,
            )
        )
        total_count = query.count()
        orgs = query.all()
        return orgs, total_count

    @staticmethod
    def update_organization(db: Session, org_id: int, org_data: OrganizationUpdate) -> Organization:
        """Update organization"""
        org = OrgService.get_organization(db, org_id)

        update_data = org_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if value is not None:
                setattr(org, field, value)

        db.commit()
        db.refresh(org)
        return org

    @staticmethod
    def add_user_to_organization(
        db: Session,
        org_id: int,
        user_id: int,
        role: str = "member",
    ) -> UserOrg:
        """Add user to organization"""
        # Check if already a member
        existing = db.query(UserOrg).filter(
            and_(
                UserOrg.organization_id == org_id,
                UserOrg.user_id == user_id,
            )
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User is already a member of this organization",
            )

        user_org = UserOrg(
            user_id=user_id,
            organization_id=org_id,
            role=role,
        )

        db.add(user_org)
        db.commit()
        db.refresh(user_org)
        return user_org

    @staticmethod
    def remove_user_from_organization(db: Session, org_id: int, user_id: int) -> None:
        """Remove user from organization"""
        user_org = db.query(UserOrg).filter(
            and_(
                UserOrg.organization_id == org_id,
                UserOrg.user_id == user_id,
            )
        ).first()

        if not user_org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User is not a member of this organization",
            )

        db.delete(user_org)
        db.commit()

    @staticmethod
    def update_user_role(db: Session, org_id: int, user_id: int, new_role: str) -> UserOrg:
        """Update user's role in organization"""
        user_org = db.query(UserOrg).filter(
            and_(
                UserOrg.organization_id == org_id,
                UserOrg.user_id == user_id,
            )
        ).first()

        if not user_org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User is not a member of this organization",
            )

        user_org.role = new_role
        db.commit()
        db.refresh(user_org)
        return user_org
