import logging
import time

import colorlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.lib.prisma import prisma
from app.routers import router

# Create a color formatter
formatter = colorlog.ColoredFormatter(
    "%(log_color)s%(levelname)s:  %(message)s",
    log_colors={
        "DEBUG": "cyan",
        "INFO": "green",
        "WARNING": "yellow",
        "ERROR": "red",
        "CRITICAL": "bold_red",
    },
    secondary_log_colors={},
    style="%",
)  # Create a console handler and set the formatter
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    handlers=[console_handler],
    force=True,
)

app = FastAPI(
    title="Superagent",
    description="Build, manage and deploy LLM-powered Agents",
    version="0.0.59",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





@app.on_event("startup")
async def startup():
    prisma.connect()


@app.on_event("shutdown")
async def shutdown():
    prisma.disconnect()


app.include_router(router)
