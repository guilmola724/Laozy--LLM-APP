import databases
import sqlalchemy

from .db import Model
from .db import metadata
from .db import instance as db
from ..utils import uuid

class RobotModel(Model):
    def __init__(self, name, metadata: sqlalchemy.MetaData, db: databases.Database, *args) -> None:
        super().__init__(name, metadata, db, *args)

robots = RobotModel(
    'robots',
    metadata,
    db,
    sqlalchemy.Column('id', sqlalchemy.String(50), primary_key=True),
    sqlalchemy.Column('implement', sqlalchemy.String(50)),
    sqlalchemy.Column('name', sqlalchemy.String(50)),
    sqlalchemy.Column('prompt_template_id', sqlalchemy.String(50)),
    sqlalchemy.Column('variables', sqlalchemy.String(4096)),
    sqlalchemy.Column('owner', sqlalchemy.String(50), index=True),
    sqlalchemy.Column('created_time', sqlalchemy.Integer, index=True),
)