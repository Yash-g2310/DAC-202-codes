from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from plot import generate_gradinet_descent_plot

class GradinetDescentInput(BaseModel):
    equation: str
    learningRate: float
    x0: float
    y0: float

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.post("/gradient_descent")
async def run_gradient_descent(descent: GradinetDescentInput):
    plot_bffer = generate_gradinet_descent_plot(descent.equation, descent.learningRate, descent.x0, descent.y0)
    
    return StreamingResponse(plot_bffer, media_type="image/png")
    

@app.get("/")
async def root():
    return {"status": "healthy"}