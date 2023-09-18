from pydantic import BaseModel

from prisma.models import User


class SignIn(BaseModel):
    email: str
    password: str


class SignInOut(BaseModel):
    token: str
    user: User


class SignInOutput(BaseModel):
    success: bool
    data: dict

class SignInOutput2(BaseModel):
    success: bool
    data: dict
    user_exist:str

class SignUp(BaseModel):
    email: str
    password: str
    name: str = None
    metadata: dict = None


class OAuth(BaseModel):
    email: str
    name: str
    access_token: str = None
    provider: str = None
