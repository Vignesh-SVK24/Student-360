from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session):
        super().__init__(User, db)

    def get_by_email(self, email: str) -> Optional[User]:
        if not email:
            return None
        return self.db.query(User).filter(User.email.ilike(email.strip())).first()

    def get_by_username(self, username: str) -> Optional[User]:
        if not username:
            return None
        return self.db.query(User).filter(User.username.ilike(username.strip())).first()

    def get_by_reset_token(self, token: str) -> Optional[User]:
        if not token:
            return None
        return self.db.query(User).filter(User.reset_token == token).first()

    def update_last_login(self, user: User) -> None:
        user.last_login_at = datetime.now(timezone.utc)
        self.db.commit()

    def set_reset_token(self, user: User, token: str, expires_at: datetime) -> None:
        user.reset_token = token
        user.reset_token_expires_at = expires_at
        self.db.commit()

    def clear_reset_token(self, user: User) -> None:
        user.reset_token = None
        user.reset_token_expires_at = None
        self.db.commit()