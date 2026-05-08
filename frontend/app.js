// ========================================
// LEGALTECH - JAVASCRIPT SISTEMA JURIDICO
// ========================================

const API_URL = {
  auth: '/api/auth',
  cases: '/api/cases',
  clients: '/api/clients',
  documents: '/api/documents',
  timetracking: '/api/time-entries',
  billing: '/api/invoices',
  dashboard: '/api/dashboard'
};

let authToken = localStorage.getItem('token') || '';
let currentUser = null;

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  };
}

// ================= AUTH TABS =================
function showAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
  
  if (tab === 'login') {
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.getElementById('login-form').classList.remove('hidden');
  } else {
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
    document.getElementById('register-form').classList.remove('hidden');
  }
}

// ================= AUTH FUNCTIONS =================
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const res = await fetch(`${API_URL.auth}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await res.json();
    
    if (result.success) {
      authToken = result.data.token;
      currentUser = result.data.user;
      localStorage.setItem('token', authToken);
      
      document.getElementById('auth-container').classList.add('hidden');
      document.getElementById('app-container').classList.remove('hidden');
      
      document.getElementById('user-name').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
      document.getElementById('user-role').textContent = currentUser.role === 'lawyer' ? 'Abogado' : 'Cliente';
      
      loadDashboard();
    } else {
      alert(result.message || 'Credenciales incorrectas');
    }
  } catch (err) {
    alert('Error de conexión');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('register-firstName').value;
  const lastName = document.getElementById('register-lastName').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const role = document.getElementById('register-role').value;
  
  try {
    const res = await fetch(`${API_URL.auth}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, role })
    });
    const result = await res.json();
    
    if (result.success) {
      alert('Cuenta creada. Iniciando sesión...');
      setTimeout(() => {
        handleLogin(new Event('submit'));
      }, 1000);
    } else {
      alert(result.message || 'Error al crear cuenta');
    }
  } catch (err) {
    alert('Error de conexión');
  }
}

function logout() {
  authToken = '';
  currentUser = null;
  localStorage.removeItem('token');
  document.getElementById('auth-container').classList.remove('hidden');
  document.getElementById('app-container').classList.add('hidden');
}

// ================= NAVIGATION =================
function showView(viewId) {
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  document.getElementById(`view-${viewId}`).classList.add('active');
  document.querySelector(`.nav-item[onclick="showView('${viewId}')"]`).classList.add('active');
  
  if (viewId === 'dashboard') loadDashboard();
  else if (viewId === 'my-cases') loadCases();
  else if (viewId === 'my-documents') loadDocuments();
  else if (viewId === 'time-tracking') loadTimeEntries();
  else if (viewId === 'billing') loadInvoices();
}

// ================= DASHBOARD =================
async function loadDashboard() {
  try {
    const res = await fetch(`${API_URL.dashboard}`, { headers: getHeaders() });
    const result = await res.json();
    
    if (result.success) {
      const data = result.data;
      document.getElementById('stat-cases').textContent = data.totalCases || 0;
      document.getElementById('stat-documents').textContent = data.totalDocuments || 0;
      document.getElementById('stat-hours').textContent = `${data.billableHours || 0}h`;
      document.getElementById('stat-billing').textContent = `$${data.totalRevenue || 0}`;
      
      const activity = data.recentActivity || [];
      const container = document.getElementById('activity-list');
      if (activity.length > 0) {
        container.innerHTML = activity.map(a => `
          <div class="activity-item">
            <i class="fas fa-circle"></i>
            <span>${a.description || 'Actividad'}</span>
            <small>${a.time || ''}</small>
          </div>
        `).join('');
      } else {
        container.innerHTML = '<p class="no-data">No hay actividad reciente</p>';
      }
    }
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

// ================= CASES =================
async function loadCases() {
  try {
    const res = await fetch(`${API_URL.cases}`, { headers: getHeaders() });
    const result = await res.json();
    
    const container = document.getElementById('cases-container');
    if (result.success && result.data.length > 0) {
      container.innerHTML = result.data.map(c => `
        <div class="data-item">
          <div class="data-info">
            <h4>${c.title}</h4>
            <p>${c.caseType || 'Civil'} - ${c.status || 'Activo'}</p>
            <small>${c.caseNumber || ''}</small>
          </div>
          <div class="data-status status-${c.status}">${c.status}</div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p class="no-data">No hay casos disponibles</p>';
    }
  } catch (err) {
    document.getElementById('cases-container').innerHTML = '<p class="no-data">Error al cargar casos</p>';
  }
}

function showCreateCaseForm() {
  document.getElementById('modal-create-case').classList.remove('hidden');
}

async function createCase(e) {
  e.preventDefault();
  
  const caseData = {
    caseNumber: 'CASE-' + Date.now(),
    title: document.getElementById('case-title').value,
    description: document.getElementById('case-description').value,
    caseType: document.getElementById('case-type').value,
    status: document.getElementById('case-status').value
  };
  
  try {
    const res = await fetch(`${API_URL.cases}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(caseData)
    });
    const result = await res.json();
    
    if (result.success) {
      alert('Caso creado exitosamente');
      closeModal('modal-create-case');
      loadCases();
    } else {
      alert(result.message || 'Error al crear caso');
    }
  } catch (err) {
    alert('Error de conexión');
  }
}

// ================= DOCUMENTS =================
async function loadDocuments() {
  try {
    const res = await fetch(`${API_URL.documents}`, { headers: getHeaders() });
    const result = await res.json();
    
    const container = document.getElementById('documents-container');
    if (result.success && result.data.length > 0) {
      container.innerHTML = result.data.map(d => `
        <div class="data-item">
          <div class="data-info">
            <h4><i class="fas fa-file"></i> ${d.originalFileName || d.title}</h4>
            <p>${d.documentType || 'Documento'}</p>
          </div>
          <button class="btn-small">Ver</button>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p class="no-data">No hay documentos</p>';
    }
  } catch (err) {
    document.getElementById('documents-container').innerHTML = '<p class="no-data">Error al cargar documentos</p>';
  }
}

function showUploadDocumentForm() {
  document.getElementById('modal-upload-document').classList.remove('hidden');
}

async function uploadDocument(e) {
  e.preventDefault();
  alert('Documento subido (simulado)');
  closeModal('modal-upload-document');
}

// ================= TIME TRACKING =================
async function loadTimeEntries() {
  try {
    const res = await fetch(`${API_URL.timetracking}`, { headers: getHeaders() });
    const result = await res.json();
    
    const container = document.getElementById('time-container');
    if (result.success && result.data.length > 0) {
      container.innerHTML = result.data.map(t => `
        <div class="data-item">
          <div class="data-info">
            <h4>Caso: ${t.caseId || 'N/A'}</h4>
            <p>${t.description || 'Sin descripción'}</p>
            <small>${t.duration || 0} min - $${t.rate || 0}/hr</small>
          </div>
          <div class="data-status">${t.status || 'Activo'}</div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p class="no-data">No hay registros de tiempo</p>';
    }
  } catch (err) {
    document.getElementById('time-container').innerHTML = '<p class="no-data">Error al cargar tiempo</p>';
  }
}

function showTimeEntryForm() {
  document.getElementById('modal-time-entry').classList.remove('hidden');
}

async function createTimeEntry(e) {
  e.preventDefault();
  alert('Tiempo registrado');
  closeModal('modal-time-entry');
}

// ================= BILLING =================
async function loadInvoices() {
  try {
    const res = await fetch(`${API_URL.billing}`, { headers: getHeaders() });
    const result = await res.json();
    
    const container = document.getElementById('billing-container');
    if (result.success && result.data.length > 0) {
      container.innerHTML = result.data.map(i => `
        <div class="data-item">
          <div class="data-info">
            <h4>${i.invoiceNumber}</h4>
            <p>${i.description || 'Factura'}</p>
            <small>Vence: ${i.dueDate ? new Date(i.dueDate).toLocaleDateString() : 'N/A'}</small>
          </div>
          <div class="data-amount">$${i.total || 0}</div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p class="no-data">No hay facturas</p>';
    }
  } catch (err) {
    document.getElementById('billing-container').innerHTML = '<p class="no-data">Error al cargar facturas</p>';
  }
}

function showCreateInvoiceForm() {
  document.getElementById('modal-create-invoice').classList.remove('hidden');
}

async function createInvoice(e) {
  e.preventDefault();
  alert('Factura creada');
  closeModal('modal-create-invoice');
}

// ================= MODALS =================
function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

// ================= INIT =================
window.onload = function() {
  if (authToken) {
    fetch(`${API_URL.auth}/profile`, { headers: getHeaders() })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          currentUser = result.data;
          document.getElementById('auth-container').classList.add('hidden');
          document.getElementById('app-container').classList.remove('hidden');
          document.getElementById('user-name').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
          document.getElementById('user-role').textContent = currentUser.role === 'lawyer' ? 'Abogado' : 'Cliente';
          loadDashboard();
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
  }
};