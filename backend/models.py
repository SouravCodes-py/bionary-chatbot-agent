from sqlalchemy import Column, Integer, String, Date, Text
from pgvector.sqlalchemy import Vector
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name_of_event = Column(String, nullable=False)
    event_domain = Column(String)
    date_of_event = Column(Date)
    time_of_event = Column(String)
    faculty_coordinators = Column(String)
    student_coordinators = Column(String)
    venue = Column(String)
    mode_of_event = Column(String)
    registration_fee = Column(String)
    speakers = Column(String)
    perks = Column(String)
    collaboration = Column(String)
    description_insights = Column(Text)
    search_text = Column(Text)
    embedding = Column(Vector(768)) # BGE-base-en-v1.5 dim is 768