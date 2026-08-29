from typing import Any, Optional
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog


class AuditRepository:
    def __init__(self, db: Session):
        self.db = db

    def log(
        self,
        action: str,
        actor_type: str,
        actor_id: Optional[str],
        entity_type: str,
        entity_id: Optional[str],
        old_data: Optional[Any] = None,
        new_data: Optional[Any] = None,
    ) -> AuditLog:
        audit_entry = AuditLog(
            action=action,
            actor_type=actor_type,
            actor_id=actor_id,
            entity_type=entity_type,
            entity_id=entity_id,
            old_data=old_data,
            new_data=new_data,
        )
        self.db.add(audit_entry)
        self.db.commit()
        self.db.refresh(audit_entry)
        return audit_entry