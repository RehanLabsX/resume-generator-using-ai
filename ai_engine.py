# ai_engine.py – AI-powered resume enhancement using Anthropic Claude

import anthropic
import json

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from environment

def enhance_resume_content(form_data: dict) -> dict:
    """
    Takes raw form data and uses Claude AI to enhance it.
    Returns the same structure with AI-improved content.
    """
    personal = form_data.get('personal', {})
    skills = form_data.get('skills', {})
    experience = form_data.get('experience', [])
    projects = form_data.get('projects', [])

    prompt = f"""You are an expert resume writer and career coach.
A user has submitted their resume details. Enhance the content to sound professional, ATS-friendly, and impressive.

Return ONLY a valid JSON object with this exact structure:
{{
  "summary": "2-3 sentence professional summary for the target role",
  "techSkills": ["skill1", "skill2", ...],
  "softSkills": ["skill1", "skill2"],
  "experience": [
    {{
      "title": "Job Title",
      "company": "Company",
      "duration": "Duration",
      "bullets": ["strong action-verb bullet 1", "bullet 2", "bullet 3"]
    }}
  ],
  "projects": [
    {{
      "title": "Project Title",
      "tech": "Technologies",
      "description": "2-sentence professional description"
    }}
  ]
}}

User input:
- Name: {personal.get('name', '')}
- Target Role: {personal.get('jobRole', '')}
- Technical Skills: {skills.get('technical', '')}
- Soft Skills: {skills.get('soft', 'not provided')}
- Certifications: {skills.get('certifications', 'none')}
- Experience: {json.dumps(experience, indent=2)}
- Projects: {json.dumps(projects, indent=2)}

Rules:
1. Write a 2-3 sentence professional summary tailored to the {personal.get('jobRole', 'professional')} role
2. Split skills string into individual items in the array
3. Convert rough experience descriptions into 2-3 strong bullet points starting with action verbs
4. Write professional 1-2 sentence project descriptions
5. Return ONLY JSON, no explanation, no markdown code fences"""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    response_text = message.content[0].text.strip()
    
    # Strip markdown fences if present
    if response_text.startswith('```'):
        response_text = response_text.split('```')[1]
        if response_text.startswith('json'):
            response_text = response_text[4:]

    enhanced = json.loads(response_text.strip())

    # Merge into original data
    return {**form_data, 'aiEnhanced': enhanced}


def improve_single_text(text: str, context: str = "resume") -> str:
    """
    Improve a single piece of text for professional tone.
    Utility function for individual field enhancement.
    """
    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=256,
        messages=[{
            "role": "user",
            "content": f"Rewrite the following text to sound professional and polished for a {context}. Return ONLY the improved text, nothing else:\n\n{text}"
        }]
    )
    return message.content[0].text.strip()
