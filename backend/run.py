import os
import sys
import uvicorn

# Ensure backend root is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    print("Starting Student 360 API Server on http://localhost:8000 ...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)