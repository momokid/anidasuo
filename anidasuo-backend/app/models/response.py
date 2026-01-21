from pydantic import BaseModel
from typing import Optional

class DetectionResponse(BaseModel):
    obstacle: bool
    distance: Optional[float]
    direction: Optional[str]