from datetime import datetime


# Convert a date to an epoch timestamp
def date_to_epoch(date: datetime.date) -> int:
    return int(date.strftime("%s"))


# Convert an epoch to an epoch timestamp
def epoch_to_date(epoch: int) -> datetime.date:
    return datetime.fromtimestamp(epoch).date()
