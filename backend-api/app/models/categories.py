from ..database import Base
import sqlalchemy as sa
from sqlalchemy.orm import relationship

Producer_Restricted_Categories = sa.Table(
    "Producer_Restricted_Categories",
    Base.metadata,
    sa.Column("producer_id",sa.Integer, sa.ForeignKey("Producers.id")),
    sa.Column("category_id",sa.Integer, sa.ForeignKey("Categories.id"))
)

Consumer_Categories = sa.Table(
    "Consumer_Categories",
    Base.metadata,
    sa.Column("consumer_id",sa.Integer, sa.ForeignKey("Consumers.id")),
    sa.Column("category_id",sa.Integer, sa.ForeignKey("Categories.id"))
)

class Category(Base):
    __tablename__ = "Categories"
    id = sa.Column(sa.Integer, primary_key=True, nullable=False)
    title = sa.Column(sa.String, unique=True, nullable=False)
    
    """ urls = relationship("URL", secondary="URL_Category_Association", back_populates="categories")
    producers = relationship("Producer", secondary="Producer_Restricted_Categories", back_populates="categories")
    consumers = relationship("Consumer", secondary="Consumer_Categories", back_populates="categories")
    """