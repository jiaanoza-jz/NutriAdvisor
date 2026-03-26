import os
import json
import io
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

# 1. Load Environment & Configure API
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

app = FastAPI(title="NutriAdvisor API")

# 2. Setup CORS (Adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "model": "gemini-3-flash"}

@app.post("/analyze")
async def analyze_nutrition(
    image: UploadFile = File(...),
    goal: str = Form(...),
    dietary_notes: str = Form(default="")
):
    if not api_key:
        raise HTTPException(status_code=500, detail="Google API Key not configured")

    try:
        # Read the image file as bytes
        image_bytes = await image.read()
        
        # 3. Initialize the Gemini 3 Flash model
        # We use generation_config to force JSON mode at the model level
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            generation_config={"response_mime_type": "application/json"}
        )

        # 4. Construct the prompt
        prompt = f"""
        You are an expert AI nutritionist. Analyze this meal image based on the following:
        User Goal: "{goal}"
        Dietary Notes: "{dietary_notes}"

        Return ONLY a JSON object with this exact structure:
        {{
          "detected_foods": ["list of strings"],
          "total_calories": integer,
          "macros": {{ 
            "protein_g": integer, 
            "carbs_g": integer, 
            "fat_g": integer, 
            "fiber_g": integer 
          }},
          "health_score": integer (1-10),
          "health_score_reason": "brief explanation",
          "per_item_calories": [{{ "item": "string", "calories": integer }}],
          "advice": "2-3 personalized sentences",
          "healthier_swaps": ["list of strings"]
        }}
        """

        # 5. Call the API with multimodal input
        # We pass the image as a parts dict for better reliability
        response = model.generate_content([
            prompt,
            {"mime_type": image.content_type, "data": image_bytes}
        ])

        # 6. Parse and return
        # Since we used JSON mode, we don't need to strip ```json markdown tags
        return json.loads(response.text)

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Model returned invalid JSON format")
    except Exception as e:
        print(f"Server Error: {str(e)}") # Log the actual error to your terminal
        raise HTTPException(status_code=500, detail="An error occurred during analysis")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)