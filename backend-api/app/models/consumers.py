import sqlalchemy as sa
from sqlalchemy.orm import relationship

from ..database import Base
from .users import GUID, User


class Consumer(Base):
    __tablename__ = "Consumers"

    id = sa.Column(sa.Integer, primary_key=True, index=True, nullable=False)
    name = sa.Column(sa.String, nullable=False)
    user_id = sa.Column(GUID, sa.ForeignKey("Users.id"), index=True)

    user = relationship(User, back_populates="consumer")
    categories = relationship(
        "Category", "Consumer_Categories", back_populates="consumers"
    )
