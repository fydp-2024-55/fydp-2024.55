"""Create tables

Revision ID: cd497bf086e5
Revises: 
Create Date: 2023-07-26 21:40:28.887217

"""
import fastapi_users_db_sqlalchemy
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "cd497bf086e5"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "Categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("title"),
    )
    op.create_table(
        "Locations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("city", sa.String(), nullable=False),
        sa.Column("state", sa.String(), nullable=False),
        sa.Column("country", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_Locations_id"), "Locations", ["id"], unique=False)
    op.create_table(
        "Users",
        sa.Column("eth_address", sa.String(), nullable=True),
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("hashed_password", sa.String(length=1024), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("is_superuser", sa.Boolean(), nullable=False),
        sa.Column("is_verified", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_Users_email"), "Users", ["email"], unique=True)
    op.create_table(
        "Consumers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column(
            "user_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["Users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_Consumers_id"), "Consumers", ["id"], unique=False)
    op.create_index(op.f("ix_Consumers_user_id"), "Consumers", ["user_id"], unique=True)
    op.create_table(
        "Producers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column(
            "user_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False
        ),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("country", sa.String(), nullable=True),
        sa.Column("date_of_birth", sa.Date(), nullable=True),
        sa.Column("gender", sa.CHAR(), nullable=True),
        sa.Column("ethnicity", sa.CHAR(), nullable=True),
        sa.Column("income", sa.Integer(), nullable=True),
        sa.Column("marital_status", sa.CHAR(), nullable=True),
        sa.Column("parental_status", sa.CHAR(), nullable=True),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["Users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_Producers_id"), "Producers", ["id"], unique=False)
    op.create_index(op.f("ix_Producers_user_id"), "Producers", ["user_id"], unique=True)
    op.create_table(
        "Consumer_Categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("consumer_id", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["category_id"],
            ["Categories.id"],
        ),
        sa.ForeignKeyConstraint(
            ["consumer_id"],
            ["Consumers.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "Histories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("visit_time", sa.DateTime(), nullable=False),
        sa.Column("time_spent", sa.Integer(), nullable=False),
        sa.Column("url", sa.String(), nullable=False),
        sa.Column("producer_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["producer_id"],
            ["Producers.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_Histories_id"), "Histories", ["id"], unique=False)
    op.create_table(
        "Producer_Restricted_Categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("producer_id", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["category_id"],
            ["Categories.id"],
        ),
        sa.ForeignKeyConstraint(
            ["producer_id"],
            ["Producers.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "History_Categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("consumer_id", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["category_id"],
            ["Categories.id"],
        ),
        sa.ForeignKeyConstraint(
            ["consumer_id"],
            ["Histories.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("History_Categories")
    op.drop_table("Producer_Restricted_Categories")
    op.drop_index(op.f("ix_Histories_id"), table_name="Histories")
    op.drop_table("Histories")
    op.drop_table("Consumer_Categories")
    op.drop_index(op.f("ix_Producers_user_id"), table_name="Producers")
    op.drop_index(op.f("ix_Producers_id"), table_name="Producers")
    op.drop_table("Producers")
    op.drop_index(op.f("ix_Consumers_user_id"), table_name="Consumers")
    op.drop_index(op.f("ix_Consumers_id"), table_name="Consumers")
    op.drop_table("Consumers")
    op.drop_index(op.f("ix_Users_email"), table_name="Users")
    op.drop_table("Users")
    op.drop_index(op.f("ix_Locations_id"), table_name="Locations")
    op.drop_table("Locations")
    op.drop_table("Categories")
    # ### end Alembic commands ###
