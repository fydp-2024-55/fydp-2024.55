from datetime import datetime
from fastapi import status, HTTPException

from ..schemas.producers import (
    ProducerCreate,
    ProducerUpdate,
    GENDERS,
    ETHNICITIES,
    MARITAL_STATUSES,
    PARENTAL_STATUSES,
)


def validate_producer_dto(producer: ProducerCreate | ProducerUpdate):
    if producer.gender and producer.gender not in GENDERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid gender provided",
        )
    if producer.ethnicity and producer.ethnicity not in ETHNICITIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ethnicity provided",
        )
    if producer.date_of_birth > datetime.now().date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date of birth provided",
        )
    if producer.marital_status and producer.marital_status not in MARITAL_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid marital status provided",
        )
    if producer.parental_status and producer.parental_status not in PARENTAL_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid parental status provided",
        )
