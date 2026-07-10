"""
IntelliMine Copilot — SQLAlchemy Models
All database tables defined here. Run `alembic upgrade head` to apply migrations.
"""
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    mine_manager = "mine_manager"
    safety_officer = "safety_officer"
    maintenance_engineer = "maintenance_engineer"
    hr = "hr"


class EquipmentStatus(str, enum.Enum):
    operational = "operational"
    maintenance = "maintenance"
    breakdown = "breakdown"
    idle = "idle"


# ────────────────────────────────────────────────────────────
# USER
# ────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    mine_id = Column(String, ForeignKey("mines.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())


# ────────────────────────────────────────────────────────────
# MINE
# ────────────────────────────────────────────────────────────
class Mine(Base):
    __tablename__ = "mines"
    id = Column(String, primary_key=True)  # RJP, ARG, PPW, etc.
    name = Column(String, nullable=False)
    area = Column(String)
    mine_type = Column(String)  # OC / UG
    total_capacity_mt = Column(Float)
    status = Column(String, default="operational")
    equipment = relationship("Equipment", back_populates="mine")
    employees = relationship("Employee", back_populates="mine")
    production_records = relationship("ProductionRecord", back_populates="mine")


# ────────────────────────────────────────────────────────────
# EQUIPMENT
# ────────────────────────────────────────────────────────────
class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(String, primary_key=True)  # EX-001, DMP-203, etc.
    name = Column(String, nullable=False)
    equipment_type = Column(String)  # Excavator, Dumper, etc.
    model = Column(String)
    manufacturer = Column(String)
    mine_id = Column(String, ForeignKey("mines.id"), nullable=False)
    mine = relationship("Mine", back_populates="equipment")
    status = Column(Enum(EquipmentStatus), default=EquipmentStatus.operational)
    health_score = Column(Float)
    age_years = Column(Float)
    total_hours = Column(Integer, default=0)
    temperature_c = Column(Float)
    vibration_mms = Column(Float)
    failure_probability = Column(Float, default=0.0)
    remaining_life_months = Column(Integer)
    last_maintenance = Column(DateTime)
    next_maintenance = Column(DateTime)
    maintenance_records = relationship("MaintenanceRecord", back_populates="equipment")
    sensor_readings = relationship("SensorReading", back_populates="equipment")


# ────────────────────────────────────────────────────────────
# EMPLOYEE
# ────────────────────────────────────────────────────────────
class Employee(Base):
    __tablename__ = "employees"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    designation = Column(String)
    department = Column(String)
    mine_id = Column(String, ForeignKey("mines.id"), nullable=True)
    mine = relationship("Mine", back_populates="employees")
    grade = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    date_of_joining = Column(DateTime)
    attendance_percent = Column(Float, default=100.0)
    training_status = Column(String, default="current")  # current / due / overdue
    safety_score = Column(Float, default=100.0)
    safety_violations = Column(Integer, default=0)
    leave_balance = Column(Integer, default=30)
    performance_rating = Column(Float, default=3.0)
    certifications = Column(JSON, default=list)  # [{name, expiry, status}]
    incidents = relationship("SafetyIncident", back_populates="employee")


# ────────────────────────────────────────────────────────────
# PRODUCTION RECORD (daily)
# ────────────────────────────────────────────────────────────
class ProductionRecord(Base):
    __tablename__ = "production_records"
    id = Column(Integer, primary_key=True, autoincrement=True)
    mine_id = Column(String, ForeignKey("mines.id"), nullable=False)
    mine = relationship("Mine", back_populates="production_records")
    date = Column(DateTime, nullable=False)
    shift = Column(String)  # A / B / C / General
    actual_mt = Column(Float, default=0)
    target_mt = Column(Float, default=0)
    oms_quantity = Column(Float, default=0)
    recorded_by = Column(String)


# ────────────────────────────────────────────────────────────
# SAFETY INCIDENT
# ────────────────────────────────────────────────────────────
class SafetyIncident(Base):
    __tablename__ = "safety_incidents"
    id = Column(String, primary_key=True)
    mine_id = Column(String, ForeignKey("mines.id"))
    employee_id = Column(String, ForeignKey("employees.id"), nullable=True)
    employee = relationship("Employee", back_populates="incidents")
    incident_date = Column(DateTime)
    incident_type = Column(String)  # Minor Injury / Near Miss / PPE Violation / Equipment Damage
    description = Column(Text)
    severity = Column(String)  # low / medium / high / critical
    status = Column(String, default="Open")  # Open / Under Review / Closed
    action_taken = Column(Text)


# ────────────────────────────────────────────────────────────
# MAINTENANCE RECORD
# ────────────────────────────────────────────────────────────
class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"
    id = Column(Integer, primary_key=True, autoincrement=True)
    equipment_id = Column(String, ForeignKey("equipment.id"))
    equipment = relationship("Equipment", back_populates="maintenance_records")
    maintenance_date = Column(DateTime)
    maintenance_type = Column(String)  # Scheduled / Breakdown / Inspection
    description = Column(Text)
    cost_inr = Column(Float)
    technician = Column(String)
    hours_taken = Column(Float)


# ────────────────────────────────────────────────────────────
# SENSOR READING (time series)
# ────────────────────────────────────────────────────────────
class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    equipment_id = Column(String, ForeignKey("equipment.id"))
    equipment = relationship("Equipment", back_populates="sensor_readings")
    timestamp = Column(DateTime, nullable=False)
    temperature_c = Column(Float)
    vibration_mms = Column(Float)
    fuel_consumption_l = Column(Float)
    operating_hours = Column(Float)
    health_score = Column(Float)


# ────────────────────────────────────────────────────────────
# DOCUMENT
# ────────────────────────────────────────────────────────────
class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    category = Column(String)
    mine_id = Column(String, ForeignKey("mines.id"), nullable=True)
    author = Column(String)
    document_date = Column(DateTime)
    pages = Column(Integer)
    file_size_bytes = Column(Integer)
    storage_url = Column(String)  # MinIO/S3 URL
    chroma_collection = Column(String)  # ChromaDB collection name
    tags = Column(JSON, default=list)
    summary = Column(Text)
    uploaded_by = Column(String)
    uploaded_at = Column(DateTime, server_default=func.now())
