from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.graph_db_password import GraphDBPassword as GraphDBPasswordModel
from app.schemas.graph_db_password import GraphDBPassword, GraphDBPasswordCreate, GraphDBPasswordUpdate

router = APIRouter()

# 获取所有图数据库密码
@router.get("/graph-db-passwords", response_model=List[GraphDBPassword])
def get_graph_db_passwords(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    passwords = db.query(GraphDBPasswordModel).offset(skip).limit(limit).all()
    return passwords

# 根据 ID 获取图数据库密码
@router.get("/graph-db-passwords/{password_id}", response_model=GraphDBPassword)
def get_graph_db_password(
    password_id: int,
    db: Session = Depends(get_db)
):
    password = db.query(GraphDBPasswordModel).filter(GraphDBPasswordModel.id == password_id).first()
    if password is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"GraphDB password with id {password_id} not found"
        )
    return password

# 新增图数据库密码
@router.post("/graph-db-passwords", response_model=GraphDBPassword, status_code=status.HTTP_201_CREATED)
def create_graph_db_password(
    password: GraphDBPasswordCreate,
    db: Session = Depends(get_db)
):
    # 检查环境是否已存在
    existing_password = db.query(GraphDBPasswordModel).filter(
        GraphDBPasswordModel.environment == password.environment
    ).first()
    if existing_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"GraphDB password for environment '{password.environment}' already exists"
        )
    
    # 创建新密码
    db_password = GraphDBPasswordModel(**password.model_dump())
    db.add(db_password)
    db.commit()
    db.refresh(db_password)
    return db_password

# 更新图数据库密码
@router.put("/graph-db-passwords/{password_id}", response_model=GraphDBPassword)
def update_graph_db_password(
    password_id: int,
    password_update: GraphDBPasswordUpdate,
    db: Session = Depends(get_db)
):
    db_password = db.query(GraphDBPasswordModel).filter(GraphDBPasswordModel.id == password_id).first()
    if db_password is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"GraphDB password with id {password_id} not found"
        )
    
    # 检查环境是否已被其他记录使用
    if password_update.environment and password_update.environment != db_password.environment:
        existing_password = db.query(GraphDBPasswordModel).filter(
            GraphDBPasswordModel.environment == password_update.environment
        ).first()
        if existing_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"GraphDB password for environment '{password_update.environment}' already exists"
            )
    
    # 更新密码
    update_data = password_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_password, field, value)
    
    db.commit()
    db.refresh(db_password)
    return db_password

# 删除图数据库密码
@router.delete("/graph-db-passwords/{password_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_graph_db_password(
    password_id: int,
    db: Session = Depends(get_db)
):
    db_password = db.query(GraphDBPasswordModel).filter(GraphDBPasswordModel.id == password_id).first()
    if db_password is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"GraphDB password with id {password_id} not found"
        )
    
    db.delete(db_password)
    db.commit()
    return None