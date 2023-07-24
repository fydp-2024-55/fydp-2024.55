"""Create database tables and add relationships

Revision ID: 5dbd40e3e2a0
Revises: 1c45c0f2922b
Create Date: 2023-07-24 16:57:16.720363

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5dbd40e3e2a0'
down_revision = '1c45c0f2922b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Categories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('title')
    )
    op.create_table('Locations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('city', sa.String(), nullable=False),
    sa.Column('state', sa.String(), nullable=False),
    sa.Column('country', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_Locations_id'), 'Locations', ['id'], unique=False)
    op.create_table('URLs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('url', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('url')
    )
    op.create_table('Users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('hashed_password', sa.String(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('is_superuser', sa.Boolean(), nullable=False),
    sa.Column('is_verified', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_Users_email'), 'Users', ['email'], unique=True)
    op.create_index(op.f('ix_Users_id'), 'Users', ['id'], unique=False)
    op.create_table('Consumers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('eth_address', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['id'], ['Users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_Consumers_email'), 'Consumers', ['email'], unique=True)
    op.create_index(op.f('ix_Consumers_eth_address'), 'Consumers', ['eth_address'], unique=True)
    op.create_index(op.f('ix_Consumers_id'), 'Consumers', ['id'], unique=False)
    op.create_table('Producers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('eth_address', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('location_id', sa.Integer(), nullable=False),
    sa.Column('date_of_birth', sa.Date(), nullable=False),
    sa.Column('gender', sa.CHAR(), nullable=False),
    sa.Column('ethnicity', sa.CHAR(), nullable=False),
    sa.Column('income', sa.Integer(), nullable=False),
    sa.Column('marital_status', sa.CHAR(), nullable=False),
    sa.Column('parental_status', sa.CHAR(), nullable=False),
    sa.ForeignKeyConstraint(['id'], ['Users.id'], ),
    sa.ForeignKeyConstraint(['location_id'], ['Locations.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_Producers_email'), 'Producers', ['email'], unique=True)
    op.create_index(op.f('ix_Producers_eth_address'), 'Producers', ['eth_address'], unique=True)
    op.create_index(op.f('ix_Producers_id'), 'Producers', ['id'], unique=False)
    op.create_table('URL_Category_Association',
    sa.Column('url_id', sa.Integer(), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['Categories.id'], ),
    sa.ForeignKeyConstraint(['url_id'], ['URLs.id'], )
    )
    op.create_table('Consumer_Categories',
    sa.Column('consumer_id', sa.Integer(), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['Categories.id'], ),
    sa.ForeignKeyConstraint(['consumer_id'], ['Consumers.id'], )
    )
    op.create_table('Histories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('visit_time', sa.DateTime(), nullable=False),
    sa.Column('time_spent', sa.Integer(), nullable=False),
    sa.Column('producer_id', sa.Integer(), nullable=False),
    sa.Column('url_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['producer_id'], ['Producers.id'], ),
    sa.ForeignKeyConstraint(['url_id'], ['URLs.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_Histories_id'), 'Histories', ['id'], unique=False)
    op.create_table('Producer_Restricted_Categories',
    sa.Column('producer_id', sa.Integer(), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['Categories.id'], ),
    sa.ForeignKeyConstraint(['producer_id'], ['Producers.id'], )
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Producer_Restricted_Categories')
    op.drop_index(op.f('ix_Histories_id'), table_name='Histories')
    op.drop_table('Histories')
    op.drop_table('Consumer_Categories')
    op.drop_table('URL_Category_Association')
    op.drop_index(op.f('ix_Producers_id'), table_name='Producers')
    op.drop_index(op.f('ix_Producers_eth_address'), table_name='Producers')
    op.drop_index(op.f('ix_Producers_email'), table_name='Producers')
    op.drop_table('Producers')
    op.drop_index(op.f('ix_Consumers_id'), table_name='Consumers')
    op.drop_index(op.f('ix_Consumers_eth_address'), table_name='Consumers')
    op.drop_index(op.f('ix_Consumers_email'), table_name='Consumers')
    op.drop_table('Consumers')
    op.drop_index(op.f('ix_Users_id'), table_name='Users')
    op.drop_index(op.f('ix_Users_email'), table_name='Users')
    op.drop_table('Users')
    op.drop_table('URLs')
    op.drop_index(op.f('ix_Locations_id'), table_name='Locations')
    op.drop_table('Locations')
    op.drop_table('Categories')
    # ### end Alembic commands ###
