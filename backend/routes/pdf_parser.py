from fastapi import APIRouter, UploadFile, File, HTTPException
import fitz  # PyMuPDF
import re
from typing import Dict, Any
import io

router = APIRouter()

def extract_health_data(text: str) -> Dict[str, Any]:
    """Extract health metrics from PDF text using regex patterns"""
    data = {}
    
    # Glucose patterns (mg/dL)
    glucose_patterns = [
        r'glucose[:\s]+(\d+\.?\d*)\s*mg/dl',
        r'blood\s+sugar[:\s]+(\d+\.?\d*)',
        r'fasting\s+glucose[:\s]+(\d+\.?\d*)'
    ]
    
    for pattern in glucose_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data['glucose'] = float(match.group(1))
            break
    
    # BMI patterns
    bmi_patterns = [
        r'bmi[:\s]+(\d+\.?\d*)',
        r'body\s+mass\s+index[:\s]+(\d+\.?\d*)'
    ]
    
    for pattern in bmi_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data['bmi'] = float(match.group(1))
            break
    
    # Heart rate patterns
    hr_patterns = [
        r'heart\s+rate[:\s]+(\d+)',
        r'pulse[:\s]+(\d+)\s*bpm'
    ]
    
    for pattern in hr_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data['heart_rate'] = int(match.group(1))
            break
    
    # Blood pressure patterns
    bp_pattern = r'blood\s+pressure[:\s]+(\d+/\d+)'
    match = re.search(bp_pattern, text, re.IGNORECASE)
    if match:
        data['blood_pressure'] = match.group(1)
    
    return data

@router.post("/scan")
async def scan_medical_report(file: UploadFile = File(...)):
    """Scan and extract health data from medical PDF reports"""
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Read PDF content
        pdf_bytes = await file.read()
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        # Extract text from all pages
        full_text = ""
        for page_num in range(pdf_document.page_count):
            page = pdf_document[page_num]
            full_text += page.get_text()
        
        pdf_document.close()
        
        # Extract health metrics
        health_data = extract_health_data(full_text)
        
        if not health_data:
            raise HTTPException(
                status_code=422, 
                detail="Could not extract health data from PDF. Please ensure the document contains glucose, BMI, or other health metrics."
            )
        
        return {
            "success": True,
            "data": health_data,
            "extracted_text_length": len(full_text),
            "pages_processed": pdf_document.page_count
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@router.get("/test")
async def test_pdf_parser():
    """Test endpoint for PDF parser"""
    return {"status": "PDF parser is ready", "supported_formats": ["pdf"]}
