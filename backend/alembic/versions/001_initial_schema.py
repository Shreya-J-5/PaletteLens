"""Initial schema setup

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-10 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    op.create_table(
        'analyses',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=True),
        sa.Column('source_type', sa.String(length=50), nullable=False),
        sa.Column('source_url', sa.String(length=2048), nullable=True),
        sa.Column('original_filename', sa.String(length=512), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('progress_step', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_analyses_created_at'), 'analyses', ['created_at'], unique=False)
    op.create_index(op.f('ix_analyses_source_type'), 'analyses', ['source_type'], unique=False)
    op.create_index(op.f('ix_analyses_status'), 'analyses', ['status'], unique=False)

    op.create_table(
        'analysis_pages',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('analysis_id', sa.String(length=36), nullable=False),
        sa.Column('url', sa.String(length=2048), nullable=False),
        sa.Column('page_title', sa.String(length=512), nullable=True),
        sa.Column('screenshot_path', sa.String(length=1024), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['analysis_id'], ['analyses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_analysis_pages_analysis_id'), 'analysis_pages', ['analysis_id'], unique=False)

    op.create_table(
        'colours',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('analysis_id', sa.String(length=36), nullable=False),
        sa.Column('page_id', sa.String(length=36), nullable=True),
        sa.Column('hex', sa.String(length=10), nullable=False),
        sa.Column('rgb_r', sa.Integer(), nullable=False),
        sa.Column('rgb_g', sa.Integer(), nullable=False),
        sa.Column('rgb_b', sa.Integer(), nullable=False),
        sa.Column('hsl_h', sa.Float(), nullable=False),
        sa.Column('hsl_s', sa.Float(), nullable=False),
        sa.Column('hsl_l', sa.Float(), nullable=False),
        sa.Column('lab_l', sa.Float(), nullable=False),
        sa.Column('lab_a', sa.Float(), nullable=False),
        sa.Column('lab_b', sa.Float(), nullable=False),
        sa.Column('usage_percentage', sa.Float(), nullable=False),
        sa.Column('colour_role', sa.String(length=50), nullable=True),
        sa.Column('role_confidence', sa.String(length=20), nullable=True),
        sa.Column('occurrence_count', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['analysis_id'], ['analyses.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['page_id'], ['analysis_pages.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_colours_analysis_id'), 'colours', ['analysis_id'], unique=False)
    op.create_index(op.f('ix_colours_hex'), 'colours', ['hex'], unique=False)
    op.create_index(op.f('ix_colours_page_id'), 'colours', ['page_id'], unique=False)

    op.create_table(
        'analysis_assets',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('analysis_id', sa.String(length=36), nullable=False),
        sa.Column('file_path', sa.String(length=1024), nullable=False),
        sa.Column('asset_type', sa.String(length=50), nullable=False),
        sa.Column('metadata_json', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['analysis_id'], ['analyses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_analysis_assets_analysis_id'), 'analysis_assets', ['analysis_id'], unique=False)

def downgrade():
    op.drop_table('analysis_assets')
    op.drop_table('colours')
    op.drop_table('analysis_pages')
    op.drop_table('analyses')
    op.drop_table('users')
