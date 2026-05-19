// ========================================
// LEGALTECH - JAVASCRIPT SISTEMA JURIDICO
// ========================================

// Supabase Configuration
const SUPABASE_URL = 'https://zftczusnrhslgpgrpzrs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J2uBdxcUW1HjyEA8VjHlLA_5TSWWOJo';

const BASE_URL = `${SUPABASE_URL}/rest/v1`;
const API_URL = {
  users: `${BASE_URL}/users`,
  clients: `${BASE_URL}/clients`,
  cases: `${BASE_URL}/cases`,
  documents: `${BASE_URL}/documents`,
  time_entries: `${BASE_URL}/time_entries`,
  invoices: `${BASE_URL}/invoices`,
  notifications: `${BASE_URL}/notifications`,
  audit_logs: `${BASE_URL}/audit_logs`
};

let authToken = localStorage.getItem('token') || '';
let currentUser = null;

function getHeaders(includeAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Prefer': 'return=minimal'
  };
  if (includeAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

function getSelectHeaders() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
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
    const res = await fetch(`${API_URL.users}?email=eq.${encodeURIComponent(email)}&password=eq.${encodeURIComponent(password)}`, {
      headers: getSelectHeaders()
    });
    const users = await res.json();
    
    if (users && users.length > 0) {
      const user = users[0];
      authToken = user.id.toString();
      currentUser = user;
      localStorage.setItem('token', authToken);
      
      document.getElementById('auth-container').classList.add('hidden');
      document.getElementById('app-container').classList.remove('hidden');
      
      document.getElementById('user-name').textContent = user.name || user.email;
      document.getElementById('user-role').textContent = user.role === 'lawyer' ? 'Abogado' : 'Cliente';
      
      loadDashboard();
    } else {
      alert('Credenciales incorrectas');
    }
  } catch (err) {
    alert('Error de conexión');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('register-firstName').value + ' ' + document.getElementById('register-lastName').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const role = document.getElementById('register-role').value;
  
  try {
    const res = await fetch(API_URL.users, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password, name, role })
    });
    
    if (res.ok) {
      alert('Cuenta creada. Iniciando sesión...');
      setTimeout(() => {
        handleLogin(new Event('submit'));
      }, 1000);
    } else {
      alert('Error al crear cuenta');
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
    const [casesRes, docsRes, timeRes, billingRes] = await Promise.all([
      fetch(API_URL.cases, { headers: getSelectHeaders() }),
      fetch(API_URL.documents, { headers: getSelectHeaders() }),
      fetch(API_URL.time_entries, { headers: getSelectHeaders() }),
      fetch(API_URL.invoices, { headers: getSelectHeaders() })
    ]);
    
    const cases = await casesRes.json();
    const docs = await docsRes.json();
    const times = await timeRes.json();
    const invoices = await billingRes.json();
    
    const totalCases = Array.isArray(cases) ? cases.length : 0;
    const totalDocuments = Array.isArray(docs) ? docs.length : 0;
    const billableHours = Array.isArray(times) ? times.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0) : 0;
    const totalRevenue = Array.isArray(invoices) ? invoices.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0) : 0;
    
    document.getElementById('stat-cases').textContent = totalCases;
    document.getElementById('stat-documents').textContent = totalDocuments;
    document.getElementById('stat-hours').textContent = `${billableHours.toFixed(1)}h`;
    document.getElementById('stat-billing').textContent = `$${totalRevenue.toFixed(0)}`;
    
    const container = document.getElementById('activity-list');
    container.innerHTML = '<p class="no-data">Dashboard conectado a Supabase</p>';
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

// ================= CASES =================
async function loadCases() {
  try {
    const res = await fetch(API_URL.cases, { headers: getSelectHeaders() });
    const cases = await res.json();
    
    const container = document.getElementById('cases-container');
    if (Array.isArray(cases) && cases.length > 0) {
      container.innerHTML = cases.map(c => `
        <div class="data-item">
          <div class="data-info">
            <h4>${c.title}</h4>
            <p>${c.case_type || 'Civil'} - ${c.status || 'Activo'}</p>
            <small>${c.case_number || ''}</small>
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
    case_number: 'CASE-' + Date.now(),
    title: document.getElementById('case-title').value,
    description: document.getElementById('case-description').value,
    case_type: document.getElementById('case-type').value,
    status: document.getElementById('case-status').value
  };
  
  try {
    const res = await fetch(API_URL.cases, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(caseData)
    });
    
    if (res.ok) {
      alert('Caso creado exitosamente');
      closeModal('modal-create-case');
      loadCases();
    } else {
      alert('Error al crear caso');
    }
  } catch (err) {
    alert('Error de conexión');
  }
}

// ================= DOCUMENTS =================
async function loadDocuments() {
  try {
    const res = await fetch(API_URL.documents, { headers: getSelectHeaders() });
    const docs = await res.json();
    
    const container = document.getElementById('documents-container');
    if (Array.isArray(docs) && docs.length > 0) {
      container.innerHTML = docs.map(d => `
        <div class="data-item">
          <div class="data-info">
            <h4><i class="fas fa-file"></i> ${d.file_name || d.title}</h4>
            <p>${d.file_type || 'Documento'}</p>
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
    const res = await fetch(API_URL.time_entries, { headers: getSelectHeaders() });
    const times = await res.json();
    
    const container = document.getElementById('time-container');
    if (Array.isArray(times) && times.length > 0) {
      container.innerHTML = times.map(t => `
        <div class="data-item">
          <div class="data-info">
            <h4>Caso: ${t.case_id || 'N/A'}</h4>
            <p>${t.description || 'Sin descripción'}</p>
            <small>${t.hours || 0} hrs - $${t.rate || 0}/hr</small>
          </div>
          <div class="data-status">Activo</div>
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
    const res = await fetch(API_URL.invoices, { headers: getSelectHeaders() });
    const invoices = await res.json();
    
    const container = document.getElementById('billing-container');
    if (Array.isArray(invoices) && invoices.length > 0) {
      container.innerHTML = invoices.map(i => `
        <div class="data-item">
          <div class="data-info">
            <h4>${i.invoice_number}</h4>
            <p>Factura</p>
            <small>Vence: ${i.due_date ? new Date(i.due_date).toLocaleDateString() : 'N/A'}</small>
          </div>
          <div class="data-amount">$${i.amount || 0}</div>
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
    fetch(`${API_URL.users}?id=eq.${authToken}`, { headers: getSelectHeaders() })
      .then(res => res.json())
      .then(users => {
        if (users && users.length > 0) {
          currentUser = users[0];
          document.getElementById('auth-container').classList.add('hidden');
          document.getElementById('app-container').classList.remove('hidden');
          document.getElementById('user-name').textContent = currentUser.name || currentUser.email;
          document.getElementById('user-role').textContent = currentUser.role === 'lawyer' ? 'Abogado' : 'Cliente';
          loadDashboard();
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
  }
};