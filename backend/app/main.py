from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import lifespan

try:
    from app.core.config import settings
    cors_origins = settings.CORS_ORIGINS
except ImportError:
    cors_origins = ["*"]

# Import routers
from app.routers.auth import router as auth_router
from app.routers.assessments import router as assessments_router
from app.routers.analytics import router as analytics_router
from app.routers.urges import router as urges_router
from app.routers.websocket import router as websocket_router

app = FastAPI(
    title='Refrain API',
    version='1.0.0',
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# SlowAPI rate limiting (optional)
try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
    from slowapi.middleware import SlowAPIMiddleware

    limiter = Limiter(key_func=get_remote_address)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)
except ImportError:
    pass

# Include routers
app.include_router(auth_router)
app.include_router(assessments_router)
app.include_router(analytics_router)
app.include_router(urges_router)
app.include_router(websocket_router)

@app.get('/')
async def root():
    return {
        "name": "Refrain API",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get('/health')
async def health():
    return {"status": "ok"}
