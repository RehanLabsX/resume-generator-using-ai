# resume_generator.py – Generates PDF from resume data using ReportLab

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY


def generate_resume_pdf(data: dict, output_dir: str) -> str:
    """
    Generate a PDF resume from form data.
    Returns path to the generated PDF.
    """
    personal = data.get('personal', {})
    education = data.get('education', [])
    experience = data.get('experience', [])
    projects = data.get('projects', [])
    skills = data.get('skills', {})
    ai = data.get('aiEnhanced', {})
    template = data.get('template', 'template1')

    name = personal.get('name', 'Resume').replace(' ', '_')
    filename = f"{name}_Resume.pdf"
    filepath = os.path.join(output_dir, filename)

    if template == 'template2':
        _build_modern_pdf(filepath, data)
    else:
        _build_classic_pdf(filepath, data)

    return filepath


# ─── CLASSIC TEMPLATE ───────────────────────────────────────────────
def _build_classic_pdf(filepath: str, data: dict):
    personal = data.get('personal', {})
    education = data.get('education', [])
    experience = data.get('experience', [])
    projects = data.get('projects', [])
    skills = data.get('skills', {})
    ai = data.get('aiEnhanced', {})

    GOLD = HexColor('#B8860B')
    DARK = HexColor('#1a1a1a')
    GRAY = HexColor('#555555')

    doc = SimpleDocTemplate(filepath, pagesize=A4,
        leftMargin=20*mm, rightMargin=20*mm,
        topMargin=18*mm, bottomMargin=18*mm)

    styles = {}
    styles['name'] = ParagraphStyle('name', fontName='Helvetica-Bold',
        fontSize=24, textColor=DARK, spaceAfter=2)
    styles['role'] = ParagraphStyle('role', fontName='Helvetica',
        fontSize=13, textColor=GRAY, spaceAfter=6)
    styles['contact'] = ParagraphStyle('contact', fontName='Helvetica',
        fontSize=10, textColor=GRAY, spaceAfter=4)
    styles['section'] = ParagraphStyle('section', fontName='Helvetica-Bold',
        fontSize=10, textColor=GOLD, spaceBefore=12, spaceAfter=4,
        borderPadding=(0,0,2,0))
    styles['body'] = ParagraphStyle('body', fontName='Helvetica',
        fontSize=10, textColor=DARK, spaceAfter=3, leading=14)
    styles['bold'] = ParagraphStyle('bold', fontName='Helvetica-Bold',
        fontSize=10, textColor=DARK, spaceAfter=1)
    styles['small'] = ParagraphStyle('small', fontName='Helvetica',
        fontSize=9, textColor=GRAY, spaceAfter=2)
    styles['bullet'] = ParagraphStyle('bullet', fontName='Helvetica',
        fontSize=10, textColor=DARK, spaceAfter=2, leftIndent=12,
        bulletIndent=0, leading=14)

    story = []
    p = personal

    story.append(Paragraph(p.get('name', ''), styles['name']))
    story.append(Paragraph(p.get('jobRole', ''), styles['role']))

    contact_parts = [x for x in [p.get('email'), p.get('phone'), p.get('city')] if x]
    if p.get('linkedin'): contact_parts.append(p['linkedin'])
    if p.get('github'): contact_parts.append(p['github'])
    story.append(Paragraph(' | '.join(contact_parts), styles['contact']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=6))

    # Summary
    summary = ai.get('summary') or f"Motivated {p.get('jobRole','professional')} with strong technical skills."
    story.append(Paragraph('PROFESSIONAL SUMMARY', styles['section']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#e0c060'), spaceAfter=4))
    story.append(Paragraph(summary, styles['body']))

    # Education
    if education:
        story.append(Paragraph('EDUCATION', styles['section']))
        story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#e0c060'), spaceAfter=4))
        for edu in education:
            story.append(Paragraph(f"<b>{edu.get('degree','')}</b> — {edu.get('institution','')}", styles['body']))
            sub = [x for x in [edu.get('year'), edu.get('score')] if x]
            if sub:
                story.append(Paragraph(' | '.join(sub), styles['small']))

    # Experience
    ai_exp = ai.get('experience', [])
    exp_src = ai_exp if ai_exp else experience
    if exp_src and (exp_src[0].get('title') or exp_src[0].get('company')):
        story.append(Paragraph('WORK EXPERIENCE', styles['section']))
        story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#e0c060'), spaceAfter=4))
        for i, e in enumerate(exp_src):
            raw = experience[i] if i < len(experience) else {}
            story.append(Paragraph(f"<b>{e.get('title','')}</b> — {e.get('company','')}", styles['body']))
            if e.get('duration'):
                story.append(Paragraph(e['duration'], styles['small']))
            bullets = e.get('bullets') or ([raw.get('description')] if raw.get('description') else [])
            for b in bullets:
                story.append(Paragraph(f"• {b}", styles['bullet']))
            story.append(Spacer(1, 4))

    # Projects
    ai_proj = ai.get('projects', [])
    proj_src = ai_proj if ai_proj else projects
    if proj_src and proj_src[0].get('title'):
        story.append(Paragraph('PROJECTS', styles['section']))
        story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#e0c060'), spaceAfter=4))
        for i, pr in enumerate(proj_src):
            raw = projects[i] if i < len(projects) else {}
            tech = pr.get('tech') or raw.get('tech', '')
            story.append(Paragraph(f"<b>{pr.get('title','')}</b>{(' | ' + tech) if tech else ''}", styles['body']))
            desc = pr.get('description') or raw.get('description', '')
            if desc:
                story.append(Paragraph(desc, styles['body']))
            story.append(Spacer(1, 4))

    # Skills
    ai_skills = ai.get('techSkills', [])
    raw_skills = [s.strip() for s in (data.get('skills', {}).get('technical', '')).split(',') if s.strip()]
    all_skills = ai_skills if ai_skills else raw_skills
    ai_soft = ai.get('softSkills', [])
    raw_soft = [s.strip() for s in (data.get('skills', {}).get('soft', '')).split(',') if s.strip()]
    soft = ai_soft if ai_soft else raw_soft

    if all_skills:
        story.append(Paragraph('SKILLS', styles['section']))
        story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#e0c060'), spaceAfter=4))
        story.append(Paragraph(', '.join(all_skills + soft), styles['body']))

    if data.get('skills', {}).get('certifications'):
        story.append(Paragraph('CERTIFICATIONS', styles['section']))
        story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor('#e0c060'), spaceAfter=4))
        story.append(Paragraph(data['skills']['certifications'], styles['body']))

    doc.build(story)


# ─── MODERN TEMPLATE ───────────────────────────────────────────────
def _build_modern_pdf(filepath: str, data: dict):
    """Two-column modern resume PDF."""
    # For simplicity, modern PDF uses same layout but with color accents
    # Full two-column PDF layout would require more complex ReportLab code
    # Using a styled version of classic for now
    _build_classic_pdf(filepath, data)
