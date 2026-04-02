// preview.js – Renders resume from localStorage

document.addEventListener('DOMContentLoaded', () => {
  const raw = localStorage.getItem('enhancedData') || localStorage.getItem('resumeData');
  if (!raw) {
    document.getElementById('resumeOutput').innerHTML = `
      <div style="padding:60px;text-align:center;color:#999;font-family:sans-serif;">
        <p>No resume data found. <a href="form.html" style="color:#f0c040;">Fill the form first →</a></p>
      </div>`;
    document.getElementById('loading-overlay').style.display = 'none';
    return;
  }

  const data = JSON.parse(raw);
  const template = data.template || 'template1';

  // Small delay to show loading animation
  setTimeout(() => {
    renderResume(data, template);
    document.getElementById('loading-overlay').style.display = 'none';
  }, 1800);
});

function renderResume(data, template) {
  const output = document.getElementById('resumeOutput');
  if (template === 'template2') {
    output.className = 'tpl-modern';
    output.innerHTML = buildModern(data);
  } else {
    output.className = 'tpl-classic';
    output.innerHTML = buildClassic(data);
  }
}

function switchTemplate(tpl, btn) {
  document.querySelectorAll('.tpl-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const raw = localStorage.getItem('enhancedData') || localStorage.getItem('resumeData');
  if (!raw) return;
  const data = JSON.parse(raw);
  data.template = tpl;
  renderResume(data, tpl);
}

// -------------------------
// TEMPLATE 1: Classic
// -------------------------
function buildClassic(data) {
  const p = data.personal;
  const ai = data.aiEnhanced || {};
  const edu = data.education || [];
  const exp = data.experience || [];
  const proj = data.projects || [];
  const skills = data.skills || {};

  const techSkills = ai.techSkills || skills.technical.split(',').map(s => s.trim()).filter(Boolean);
  const softSkills = ai.softSkills || (skills.soft ? skills.soft.split(',').map(s => s.trim()) : []);
  const summary = ai.summary || `Motivated ${p.jobRole} candidate with strong technical skills and a passion for solving real-world problems.`;
  const aiExp = ai.experience || [];
  const aiProj = ai.projects || [];

  const contactParts = [p.email, p.phone, p.city].filter(Boolean);
  if (p.linkedin) contactParts.push(p.linkedin);
  if (p.github) contactParts.push(p.github);

  let html = `
    <div class="r-name">${p.name}</div>
    <div class="r-role">${p.jobRole}</div>
    <div class="r-contact">${contactParts.join(' &nbsp;|&nbsp; ')}</div>
    <hr class="r-divider"/>

    <div class="r-section-title">Professional Summary</div>
    <div class="r-summary">${summary}</div>
  `;

  // Education
  if (edu.length > 0) {
    html += `<div class="r-section-title">Education</div>`;
    edu.forEach(e => {
      html += `<div class="r-entry">
        <div class="r-entry-header"><span>${e.degree}</span><span>${e.year || ''}</span></div>
        <div class="r-entry-sub">${e.institution}${e.score ? ' &nbsp;|&nbsp; ' + e.score : ''}</div>
      </div>`;
    });
  }

  // Experience
  const expSrc = aiExp.length > 0 ? aiExp : exp;
  if (expSrc.length > 0 && (expSrc[0].title || expSrc[0].company)) {
    html += `<div class="r-section-title">Work Experience</div>`;
    expSrc.forEach((e, i) => {
      const rawExp = exp[i] || {};
      const bullets = e.bullets || (rawExp.description ? [rawExp.description] : []);
      html += `<div class="r-entry">
        <div class="r-entry-header"><span>${e.title || ''}</span><span>${e.duration || ''}</span></div>
        <div class="r-entry-sub">${e.company || ''}</div>
        ${bullets.length ? `<ul class="r-bullets">${bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
      </div>`;
    });
  }

  // Projects
  const projSrc = aiProj.length > 0 ? aiProj : proj;
  if (projSrc.length > 0 && projSrc[0].title) {
    html += `<div class="r-section-title">Projects</div>`;
    projSrc.forEach((pr, i) => {
      const rawPr = proj[i] || {};
      html += `<div class="r-entry">
        <div class="r-entry-header"><span>${pr.title || ''}</span><span>${pr.tech || rawPr.tech || ''}</span></div>
        <div class="r-summary">${pr.description || rawPr.description || ''}</div>
      </div>`;
    });
  }

  // Skills
  html += `<div class="r-section-title">Skills</div>
    <div class="r-skills-wrap">
      ${techSkills.map(s => `<span class="r-skill-tag">${s}</span>`).join('')}
      ${softSkills.map(s => `<span class="r-skill-tag">${s}</span>`).join('')}
    </div>`;

  if (skills.certifications) {
    html += `<div class="r-section-title">Certifications</div>
      <div class="r-summary">${skills.certifications}</div>`;
  }

  return html;
}

// -------------------------
// TEMPLATE 2: Modern
// -------------------------
function buildModern(data) {
  const p = data.personal;
  const ai = data.aiEnhanced || {};
  const edu = data.education || [];
  const exp = data.experience || [];
  const proj = data.projects || [];
  const skills = data.skills || {};

  const techSkills = ai.techSkills || skills.technical.split(',').map(s => s.trim()).filter(Boolean);
  const softSkills = ai.softSkills || (skills.soft ? skills.soft.split(',').map(s => s.trim()) : []);
  const summary = ai.summary || `Motivated ${p.jobRole} candidate with strong technical skills and a passion for solving real-world problems.`;
  const aiExp = ai.experience || [];
  const aiProj = ai.projects || [];

  let leftHtml = `
    <div class="r-name">${p.name}</div>
    <div class="r-role">${p.jobRole}</div>
    <div class="r-left-section">
      <div class="r-left-title">Contact</div>
      ${p.email ? `<div class="r-contact-item">✉ ${p.email}</div>` : ''}
      ${p.phone ? `<div class="r-contact-item">📞 ${p.phone}</div>` : ''}
      ${p.city ? `<div class="r-contact-item">📍 ${p.city}</div>` : ''}
      ${p.linkedin ? `<div class="r-contact-item">🔗 ${p.linkedin}</div>` : ''}
      ${p.github ? `<div class="r-contact-item">💻 ${p.github}</div>` : ''}
    </div>
    <div class="r-left-section">
      <div class="r-left-title">Skills</div>
      ${techSkills.map(s => `<span class="r-skill-tag">${s}</span>`).join('')}
    </div>
    ${softSkills.length ? `<div class="r-left-section">
      <div class="r-left-title">Soft Skills</div>
      ${softSkills.map(s => `<span class="r-skill-tag">${s}</span>`).join('')}
    </div>` : ''}
    ${skills.certifications ? `<div class="r-left-section">
      <div class="r-left-title">Certifications</div>
      <div style="font-size:11px;color:#ccc;line-height:1.7">${skills.certifications.replace(/,\s*/g,'<br/>')}</div>
    </div>` : ''}
  `;

  let rightHtml = `
    <div class="r-section-title">About Me</div>
    <div class="r-summary">${summary}</div>
  `;

  // Education
  if (edu.length > 0) {
    rightHtml += `<div class="r-section-title">Education</div>`;
    edu.forEach(e => {
      rightHtml += `<div class="r-entry">
        <div class="r-entry-header"><span>${e.degree}</span><span>${e.year || ''}</span></div>
        <div class="r-entry-sub">${e.institution}${e.score ? ' · ' + e.score : ''}</div>
      </div>`;
    });
  }

  // Experience
  const expSrc = aiExp.length > 0 ? aiExp : exp;
  if (expSrc.length > 0 && (expSrc[0].title || expSrc[0].company)) {
    rightHtml += `<div class="r-section-title">Experience</div>`;
    expSrc.forEach((e, i) => {
      const rawExp = exp[i] || {};
      const bullets = e.bullets || (rawExp.description ? [rawExp.description] : []);
      rightHtml += `<div class="r-entry">
        <div class="r-entry-header"><span>${e.title || ''}</span><span style="font-size:11px;color:#999">${e.duration || ''}</span></div>
        <div class="r-entry-sub">${e.company || ''}</div>
        ${bullets.length ? `<ul class="r-bullets">${bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
      </div>`;
    });
  }

  // Projects
  const projSrc = aiProj.length > 0 ? aiProj : proj;
  if (projSrc.length > 0 && projSrc[0].title) {
    rightHtml += `<div class="r-section-title">Projects</div>`;
    projSrc.forEach((pr, i) => {
      const rawPr = proj[i] || {};
      rightHtml += `<div class="r-entry">
        <div class="r-entry-header"><span>${pr.title || ''}</span><span style="font-size:11px;color:#777">${pr.tech || rawPr.tech || ''}</span></div>
        <div class="r-summary">${pr.description || rawPr.description || ''}</div>
      </div>`;
    });
  }

  return `<div class="r-left">${leftHtml}</div><div class="r-right">${rightHtml}</div>`;
}

// -------------------------
// PDF Download
// -------------------------
function downloadPDF() {
  const element = document.getElementById('resumeOutput');
  const raw = localStorage.getItem('enhancedData') || localStorage.getItem('resumeData');
  const data = raw ? JSON.parse(raw) : {};
  const name = data.personal?.name?.replace(/\s+/g, '_') || 'Resume';

  const opt = {
    margin: 0,
    filename: `${name}_Resume.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const btn = document.querySelector('.btn-primary');
  btn.textContent = '⏳ Generating PDF...';
  btn.disabled = true;

  html2pdf().set(opt).from(element).save().then(() => {
    btn.textContent = '⬇ Download PDF';
    btn.disabled = false;
  });
}
