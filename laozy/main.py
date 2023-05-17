from .logging import log
import contextlib

from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.middleware import Middleware
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.staticfiles import StaticFiles

from . import api
from .message import queue
from . import db
from . import connectors
from . import router
from . import admin
from .users import auth
from . import template

# Setup message providers
received = queue.MessageQueueInMemory()
connectors.manager.received = received


@contextlib.asynccontextmanager
async def lifespan(app):
    await db.instance.connect()

    connectors.manager.start()

    # Setup robots
    await router.start()

    yield
    await db.instance.disconnect()

# Routes
from .api import routes as _routes
routes = [
    Route('/', endpoint=template.render('index.html')),
    Mount('/static', StaticFiles(directory='static'), name='static'),
    Mount('/api', app=api.entry, name='api'),
]

# Middlewares
middleware = [
    Middleware(AuthenticationMiddleware, backend=auth.BasicAuthBackend())
]

entry = Starlette(debug=True, routes=routes, middleware=middleware, lifespan=lifespan)

admin.enable_admin(entry)

log.info("Welcome to Laozy.")
