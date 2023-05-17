"""empty message

Revision ID: b7552b8ee466
Revises: bcfa648d0b76
Create Date: 2023-05-11 15:23:35.830552

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b7552b8ee466'
down_revision = 'bcfa648d0b76'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_messages_assistant_id', table_name='messages')
    op.drop_index('ix_messages_created_time', table_name='messages')
    op.drop_index('ix_messages_direction', table_name='messages')
    op.drop_index('ix_messages_origin', table_name='messages')
    op.drop_index('ix_messages_origin_id', table_name='messages')
    op.drop_index('ix_messages_origin_msg_id', table_name='messages')
    op.drop_index('ix_messages_origin_user_id', table_name='messages')
    op.drop_index('ix_messages_send_time', table_name='messages')
    op.drop_index('ix_messages_status', table_name='messages')
    op.drop_table('messages')
    op.drop_table('states')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('states',
    sa.Column('key', sa.VARCHAR(length=50), nullable=False),
    sa.Column('value', sa.VARCHAR(length=50), nullable=True),
    sa.PrimaryKeyConstraint('key')
    )
    op.create_table('messages',
    sa.Column('id', sa.VARCHAR(length=32), nullable=False),
    sa.Column('origin', sa.VARCHAR(length=50), nullable=True),
    sa.Column('origin_id', sa.VARCHAR(length=50), nullable=True),
    sa.Column('origin_user_id', sa.VARCHAR(length=50), nullable=True),
    sa.Column('origin_msg_id', sa.VARCHAR(length=50), nullable=True),
    sa.Column('assistant_id', sa.VARCHAR(length=50), nullable=True),
    sa.Column('direction', sa.INTEGER(), nullable=True),
    sa.Column('created_time', sa.DATETIME(), nullable=True),
    sa.Column('content', sa.VARCHAR(length=4096), nullable=True),
    sa.Column('status', sa.INTEGER(), nullable=True),
    sa.Column('send_time', sa.INTEGER(), nullable=True),
    sa.Column('msgtype', sa.VARCHAR(length=20), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_messages_status', 'messages', ['status'], unique=False)
    op.create_index('ix_messages_send_time', 'messages', ['send_time'], unique=False)
    op.create_index('ix_messages_origin_user_id', 'messages', ['origin_user_id'], unique=False)
    op.create_index('ix_messages_origin_msg_id', 'messages', ['origin_msg_id'], unique=False)
    op.create_index('ix_messages_origin_id', 'messages', ['origin_id'], unique=False)
    op.create_index('ix_messages_origin', 'messages', ['origin'], unique=False)
    op.create_index('ix_messages_direction', 'messages', ['direction'], unique=False)
    op.create_index('ix_messages_created_time', 'messages', ['created_time'], unique=False)
    op.create_index('ix_messages_assistant_id', 'messages', ['assistant_id'], unique=False)
    # ### end Alembic commands ###
