from ..database import Base
import sqlalchemy as sa
from sqlalchemy.orm import relationship

URL_Category_Association = sa.Table(
    "URL_Category_Association",
    Base.metadata,
    sa.Column("url_id", sa.Integer, sa.ForeignKey("URLs.id")),
    sa.Column("category_id",sa.Integer, sa.ForeignKey("Categories.id"))
)

class URL(Base):
    __tablename__ = "URLs"
    id = sa.Column(sa.Integer, primary_key=True, nullable=False)
    url = sa.Column(sa.String, unique=True, nullable=False)
    
    categories = relationship("Category", secondary = URL_Category_Association, back_populates="urls")