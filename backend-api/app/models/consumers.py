from ..database import Base
import sqlalchemy as sa
from . import users
from sqlalchemy.orm import relationship

class Consumer(users.User, Base):
    __tablename__ = "Consumers"
    id = sa.Column(sa.Integer, sa.ForeignKey("Users.id"), primary_key=True, index=True, nullable=False)
    eth_address = sa.Column(sa.String, unique=True,index=True,nullable=False)
    email = sa.Column(sa.String, unique=True, index=True, nullable=False)
    
    categories = relationship("Category", secondary="Consumer_Categories",back_populates="consumers")