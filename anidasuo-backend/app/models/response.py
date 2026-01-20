from pydantic import BaseModel
from typing import Optional

class DetectionResponse(BaseModel):
    obstacle:bool
    type:Optional[str]
    distance: Optional[str]
    direction:Optional[str]