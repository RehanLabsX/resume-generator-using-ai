// form.js – Multi-step form logic

let currentStep = 1;
let selectedTemplate = 'template1';

function nextStep(step) {
  if (step > currentStep && !validateStep(currentStep)) return;

  document.getElementById(`step${currentStep}`).classList.remove('active');
  document.querySelectorAll('.sidebar-steps li').forEach(li => li.classList.remove('active'));
  if (step > currentStep) {
    document.querySelectorAll('.sidebar-steps li')[currentStep - 1].classList.add('done');
  }

  currentStep = step;
  document.getElementById(`step${currentStep}`).classList.add('active');
  document.querySelectorAll('.sidebar-steps li')[currentStep - 1].classList.add('active');

  // update progress bar
  const pct = (currentStep / 5) * 100;
  document.getElementById('progressFill').style.width = pct + '%';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(step) {
  if (step === 1) {
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const role = document.getElementById('jobRole').value.trim();
    if (!name || !email || !phone || !role) {
      alert('Please fill in all required fields (Name, Email, Phone, Job Role).');
      return false;
    }
  }
  if (step === 2) {
    const degrees = document.querySelectorAll('.edu-degree');
    if (degrees[0] && !degrees[0].value.trim()) {
      alert('Please enter at least one education entry.');
      return false;
    }
  }
  if (step === 3) {
    const skills = document.getElementById('techSkills').value.trim();
    if (!skills) {
      alert('Please enter at least some technical skills.');
      return false;
    }
  }
  return true;
}

function addEducation() {
  const container = document.getElementById('educationList');
  const div = document.createElement('div');
  div.className = 'edu-entry entry-block';
  div.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-family:var(--font-head);font-size:0.85rem">Education Entry</strong>
      <button onclick="this.closest('.edu-entry').remove()" style="background:none;border:none;color:#f07840;cursor:pointer;font-size:0.85rem">✕ Remove</button>
    </div>
    <div class="field-row">
      <div class="field-group">
        <label>Degree / Course</label>
        <input type="text" class="edu-degree" placeholder="B.E. Computer Science"/>
      </div>
      <div class="field-group">
        <label>Institution</label>
        <input type="text" class="edu-inst" placeholder="ABC Engineering College"/>
      </div>
    </div>
    <div class="field-row">
      <div class="field-group">
        <label>Year of Passing</label>
        <input type="text" class="edu-year" placeholder="2025"/>
      </div>
      <div class="field-group">
        <label>CGPA / Percentage</label>
        <input type="text" class="edu-score" placeholder="8.5 CGPA"/>
      </div>
    </div>
  `;
  container.appendChild(div);
}

function addExperience() {
  const container = document.getElementById('expList');
  const div = document.createElement('div');
  div.className = 'exp-entry entry-block';
  div.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-family:var(--font-head);font-size:0.85rem">Experience Entry</strong>
      <button onclick="this.closest('.exp-entry').remove()" style="background:none;border:none;color:#f07840;cursor:pointer;font-size:0.85rem">✕ Remove</button>
    </div>
    <div class="field-row">
      <div class="field-group">
        <label>Job Title</label>
        <input type="text" class="exp-title" placeholder="Software Intern"/>
      </div>
      <div class="field-group">
        <label>Company</label>
        <input type="text" class="exp-company" placeholder="XYZ Technologies"/>
      </div>
    </div>
    <div class="field-row">
      <div class="field-group">
        <label>Duration</label>
        <input type="text" class="exp-duration" placeholder="June 2024 – Aug 2024"/>
      </div>
    </div>
    <div class="field-group">
      <label>What did you do? (briefly)</label>
      <textarea class="exp-desc" rows="2" placeholder="e.g. built REST APIs, worked on frontend bugs"></textarea>
    </div>
  `;
  container.appendChild(div);
}

function addProject() {
  const container = document.getElementById('projList');
  const div = document.createElement('div');
  div.className = 'proj-entry entry-block';
  div.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <strong style="font-family:var(--font-head);font-size:0.85rem">Project Entry</strong>
      <button onclick="this.closest('.proj-entry').remove()" style="background:none;border:none;color:#f07840;cursor:pointer;font-size:0.85rem">✕ Remove</button>
    </div>
    <div class="field-row">
      <div class="field-group">
        <label>Project Title</label>
        <input type="text" class="proj-title" placeholder="My Project"/>
      </div>
      <div class="field-group">
        <label>Technologies Used</label>
        <input type="text" class="proj-tech" placeholder="React, Node.js"/>
      </div>
    </div>
    <div class="field-group">
      <label>Description</label>
      <textarea class="proj-desc" rows="2" placeholder="Brief description of what you built"></textarea>
    </div>
  `;
  container.appendChild(div);
}

function selectTemplate(tpl, el) {
  selectedTemplate = tpl;
  document.querySelectorAll('.template-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

function collectFormData() {
  // Personal
  const personal = {
    name: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    city: document.getElementById('city').value.trim(),
    linkedin: document.getElementById('linkedin').value.trim(),
    github: document.getElementById('github').value.trim(),
    jobRole: document.getElementById('jobRole').value.trim()
  };

  // Education
  const education = [];
  document.querySelectorAll('.edu-entry').forEach(entry => {
    const degree = entry.querySelector('.edu-degree')?.value.trim();
    const inst = entry.querySelector('.edu-inst')?.value.trim();
    if (degree || inst) {
      education.push({
        degree,
        institution: inst,
        year: entry.querySelector('.edu-year')?.value.trim(),
        score: entry.querySelector('.edu-score')?.value.trim()
      });
    }
  });

  // Skills
  const skills = {
    technical: document.getElementById('techSkills').value.trim(),
    soft: document.getElementById('softSkills').value.trim(),
    certifications: document.getElementById('certs').value.trim()
  };

  // Experience
  const experience = [];
  document.querySelectorAll('.exp-entry').forEach(entry => {
    const title = entry.querySelector('.exp-title')?.value.trim();
    const company = entry.querySelector('.exp-company')?.value.trim();
    const desc = entry.querySelector('.exp-desc')?.value.trim();
    if (title || company || desc) {
      experience.push({
        title,
        company,
        duration: entry.querySelector('.exp-duration')?.value.trim(),
        description: desc
      });
    }
  });

  // Projects
  const projects = [];
  document.querySelectorAll('.proj-entry').forEach(entry => {
    const title = entry.querySelector('.proj-title')?.value.trim();
    const tech = entry.querySelector('.proj-tech')?.value.trim();
    const desc = entry.querySelector('.proj-desc')?.value.trim();
    if (title || desc) {
      projects.push({ title, tech, description: desc });
    }
  });

  return { personal, education, skills, experience, projects, template: selectedTemplate };
}

async function generateResume() {
  if (!validateStep(5)) return;

  const btn = document.getElementById('generateBtn');
  const btnText = document.getElementById('genBtnText');
  btn.disabled = true;
  btnText.textContent = '⏳ Generating...';

  const formData = collectFormData();
  localStorage.setItem('resumeData', JSON.stringify(formData));

  // Call backend or AI directly
  try {
    const enhanced = await enhanceWithAI(formData);
    localStorage.setItem('enhancedData', JSON.stringify(enhanced));
    window.location.href = 'preview.html';
  } catch (err) {
    console.error(err);
    // fallback: go to preview anyway with raw data
    localStorage.setItem('enhancedData', JSON.stringify(formData));
    window.location.href = 'preview.html';
  }
}
