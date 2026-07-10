from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt, JWTError
import os

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

SECRET_KEY = os.getenv("JWT_SECRET", "intellimine-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict


class TokenData(BaseModel):
    user_id: str | None = None
    role: str | None = None


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        role = payload.get("role")
        if user_id is None:
            raise credentials_exception
        return TokenData(user_id=user_id, role=role)
    except JWTError:
        raise credentials_exception


# Demo users — replace with DB lookup in production
DEMO_USERS = {
    "admin@ccl.gov.in": {"id": "USR-001", "name": "S.K. Agrawal", "role": "admin", "password": "admin123"},
    "manager@ccl.gov.in": {"id": "USR-002", "name": "Ramesh Kumar Singh", "role": "mine_manager", "password": "manager123"},
    "safety@ccl.gov.in": {"id": "USR-003", "name": "Priya Sharma", "role": "safety_officer", "password": "safety123"},
    "engineer@ccl.gov.in": {"id": "USR-004", "name": "Suresh Pandey", "role": "maintenance_engineer", "password": "eng123"},
    "hr@ccl.gov.in": {"id": "USR-005", "name": "Deepika Oraon", "role": "hr", "password": "hr123"},
}


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = DEMO_USERS.get(form_data.username)
    if not user or user["password"] != form_data.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token({"sub": user["id"], "role": user["role"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user["id"], "name": user["name"], "role": user["role"]},
    }


@router.get("/me")
def get_me(current_user: TokenData = Depends(get_current_user)):
    return {"user_id": current_user.user_id, "role": current_user.role}
