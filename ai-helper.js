// ai-helper.js – Calls Anthropic Claude API to enhance resume content

async function enhanceWithAI(formData) {
  const { personal, education, skills, experience, projects } = formData;

  const prompt = `You are an expert resume writer. A user has filled in their resume details. 
Your job is to enhance the content to sound professional, ATS-friendly, and impressive.

Return ONLY a valid JSON object with this exact structure (no extra text, no markdown fences):
{
  "summary": "2-3 sentence professional summary",
  "techSkills": ["skill1", "skill2", ...],
  "softSkills": ["skill1", "skill2"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company",
      "duration": "Duration",
      "bullets": ["professional bullet 1", "bullet 2", "bullet 3"]
    }
  ],
  "projects": [
    {
      "title": "Project Title",
      "tech": "Technologies",
      "description": "2-sentence professional description"
    }
  ]
}

User data:
- Name: ${personal.name}
- Target Role: ${personal.jobRole}
- Technical Skills: ${skills.technical}
- Soft Skills: ${skills.soft || 'not provided'}
- Certifications: ${skills.certifications || 'none'}
- Experience: ${JSON.stringify(experience)}
- Projects: ${JSON.stringify(projects)}

Rules:
- Write summary for a ${personal.jobRole} role
- Convert skill list into clean array of individual skills
- Convert rough experience descriptions into 2-3 strong action-verb bullet points
- Make project descriptions sound professional and technical
- Keep language concise and impactful`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) throw new Error('API call failed: ' + response.status);

  const data = await response.json();
  const text = data.content.map(c => c.text || '').join('');
  const clean = text.replace(/```json|```/g, '').trim();

  try {
    return { ...formData, aiEnhanced: JSON.parse(clean) };
  } catch (e) {
    console.warn('AI JSON parse failed, using raw data');
    return formData;
  }
}
