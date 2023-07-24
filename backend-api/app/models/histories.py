from ..database import Base
import sqlalchemy as sa

class History(Base):
    __tablename__ = "Histories"
    id = sa.Column(sa.Integer, primary_key=True,index = True, nullable=False)
    title = sa.Column(sa.String, nullable=False)
    visit_time = sa.Column(sa.DateTime, nullable=False)
    time_spent = sa.Column(sa.Integer, nullable=False)
    producer_id = sa.Column(sa.Integer, sa.ForeignKey("Producers.id"), nullable=False)
    url_id = sa.Column(sa.Integer, sa.ForeignKey("URLs.id"), nullable=False)
