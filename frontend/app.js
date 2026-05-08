// ========================================
// LEGALTECH - JAVASCRIPT SISTEMA JURIDICO
// ========================================

// ================= API URLS (Relative paths for nginx) =================
const API_URL = {
  auth: '/api/auth',
  cases: '/api/cases',
  clients: '/api/clients',
  documents: '/api/documents',
  timetracking: '/api/time-entries',
  billing: '/api/invoices',
  notifications: '/api/notifications',
  dashboard: '/api/dashboard'
};

let authToken = localStorage.getItem('token') || '';
let currentUser = null;

// ================= TOKEN MANAGEMENT =================
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  };
}

// ================= SHOW SECTION =================
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Remove active from menu
  document.querySelectorAll('.menu li').forEach(li => {
    li.classList.remove('active');
  });
  
  // Show selected section
  const section = document.getElementById(`${sectionId}-section`);
  if (section) {
    section.style.display = 'block';
  }
  
  // Activate menu item
  const menuItem = document.querySelector(`.menu li[onclick*="${sectionId}"]`);
  if (menuItem) {
    menuItem.classList.add('active');
  }
  
  // Load data for section
  if (sectionId === 'dashboard') loadDashboard();
  else if (sectionId === 'cases') loadCases();
  else if (sectionId === 'clients') loadClients();
  else if (sectionId === 'documents') loadDocuments();
  else if (sectionId === 'timetracking') loadTimeEntries();
  else if (sectionId === 'billing') loadInvoices();
  else if (sectionId === 'notifications') loadNotifications();
}

// ================= AUTH FUNCTIONS =================
async function login(e) {
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
      
      showMessage('¡Bienvenido!', 'success');
      setTimeout(() => {
        document.getElementById('auth-section').style.display = 'none';
        document.querySelector('.sidebar').style.display = 'flex';
        document.querySelector('.main-content').style.display = 'block';
        updateUserUI();
        showSection('dashboard');
      }, 500);
    } else {
      showMessage(result.message || 'Credenciales incorrectas', 'error');
    }
  } catch (err) {
    showMessage('Error de conexión', 'error');
  }
}

async function register(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('reg-firstName').value;
  const lastName = document.getElementById('reg-lastName').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirmPassword').value;
  const role = document.getElementById('reg-role').value;
  
  if (password !== confirmPassword) {
    showMessage('Las contraseñas no coinciden', 'error');
    return;
  }
  
  try {
    const res = await fetch(`${API_URL.auth}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, role })
    });
    const result = await res.json();
    
    if (result.success) {
      showMessage('Cuenta creada. Iniciando sesión...', 'success');
      // Auto-login
      setTimeout(async () => {
        const loginRes = await fetch(`${API_URL.auth}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const loginResult = await loginRes.json();
        if (loginResult.success) {
          authToken = loginResult.data.token;
          currentUser = loginResult.data.user;
          localStorage.setItem('token', authToken);
          
          document.getElementById('auth-section').style.display = 'none';
          document.querySelector('.sidebar').style.display = 'flex';
          document.querySelector('.main-content').style.display = 'block';
          updateUserUI();
          showSection('dashboard');
        }
      }, 1000);
    } else {
      showMessage(result.message || 'Error al crear cuenta', 'error');
    }
  } catch (err) {
    showMessage('Error de conexión', 'error');
  }
}

function logout() {
  authToken = '';
  currentUser = null;
  localStorage.removeItem('token');
  document.getElementById('auth-section').style.display = 'block';
  document.querySelector('.sidebar').style.display = 'none';
  document.querySelector('.main-content').style.display = 'none';
}

function updateUserUI() {
  if (currentUser) {
    const initials = (currentUser.firstName?.charAt(0) || '') + (currentUser.lastName?.charAt(0) || '');
    document.querySelector('.user-profile img').src = `https://i.pravatar.cc/100?u=${currentUser.id}`;
    document.querySelector('.user-profile h4').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.querySelector('.user-profile span').textContent = currentUser.role;
  }
}

// ================= DASHBOARD =================
async function loadDashboard() {
  try {
    const res = await fetch(`${API_URL.dashboard}`, { headers: getHeaders() });
    const result = await res.json();
    
    if (result.success) {
      const data = result.data;
      document.querySelector('.hero-stat h3:nth-child(1)').textContent = data.totalCases || 0;
      document.querySelector('.hero-stat:nth-child(2) .trend span').textContent = data.successRate || '0%';
      document.querySelector('.hero-stat:nth-child(3) .trend span').textContent = data.support || '24/7';
      
      // Update stats
      const stats = data.stats || {};
      document.querySelectorAll('.stat-card h3')[0].textContent = stats.totalCases || 0;
      document.querySelectorAll('.stat-card h3')[1].textContent = stats.totalClients || 0;
      document.querySelectorAll('.stat-card h3')[2].textContent = `$${stats.totalRevenue || 0}`;
      document.querySelectorAll('.stat-card h3')[3].textContent = `${stats.billableHours || 0}h`;
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
    
    if (result.success) {
      const cases = result.data || [];
      const container = document.getElementById('cases-list');
      container.innerHTML = cases.map(c => `
        <div class="data-card">
          <div class="card-header">
            <h4>${c.caseNumber || 'N/A'} - ${c.title}</h4>
            <span class="status-badge status-${c.status}">${c.status}</span>
          </div>
          <div class="card-body">
            <p><strong>Tipo:</strong> ${c.caseType || 'N/A'}</p>
            <p><strong>Prioridad:</strong> ${c.priority || 'N/A'}</p>
            <p><strong>Cliente:</strong> ${c.clientId || 'N/A'}</p>
          </div>
          <div class="card-actions">
            <button class="btn-small" onclick="viewCase('${c.id}')">Ver</button>
            <button class="btn-small btn-outline" onclick="editCase('${c.id}')">Editar</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading cases:', err);
  }
}

async function createCase(e) {
  e.preventDefault();
  
  const caseData = {
    caseNumber: 'CASE-' + Date.now(),
    title: document.getElementById('case-title').value,
    description: document.getElementById('case-description').value,
    caseType: document.getElementById('case-type').value,
    priority: document.getElementById('case-priority').value,
    clientId: document.getElementById('case-clientId').value
  };
  
  try {
    const res = await fetch(`${API_URL.cases}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(caseData)
    });
    const result = await res.json();
    
    if (result.success) {
      showMessage('Caso creado exitosamente', 'success');
      closeModal('create-case-modal');
      loadCases();
    } else {
      showMessage(result.message || 'Error al crear caso', 'error');
    }
  } catch (err) {
    showMessage('Error de conexión', 'error');
  }
}

// ================= CLIENTS =================
async function loadClients() {
  try {
    const res = await fetch(`${API_URL.clients}`, { headers: getHeaders() });
    const result = await res.json();
    
    if (result.success) {
      const clients = result.data || [];
      const container = document.getElementById('clients-list');
      container.innerHTML = clients.map(c => `
        <div class="data-card">
          <div class="card-header">
            <h4>${c.firstName} ${c.lastName}</h4>
            <span class="client-type">${c.clientType || 'N/A'}</span>
          </div>
          <div class="card-body">
            <p><strong>Email:</strong> ${c.email || 'N/A'}</p>
            <p><strong>Documento:</strong> ${c.documentType || 'N/A'}: ${c.documentNumber || 'N/A'}</p>
            <p><strong>Teléfono:</strong> ${c.phone || 'N/A'}</p>
          </div>
          <div class="card-actions">
            <button class="btn-small" onclick="viewClient('${c.id}')">Ver</button>
            <button class="btn-small btn-outline" onclick="editClient('${c.id}')">Editar</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading clients:', err);
  }
}

// ================= DOCUMENTS =================
async function loadDocuments() {
  try {
    const res = await fetch(`${API_URL.documents}`, { headers: getHeaders() });
    const result = await res.json();
    
    if (result.success) {
      const docs = result.data || [];
      const container = document.getElementById('documents-list');
      container.innerHTML = docs.map(d => `
        <div class="data-card">
          <div class="card-header">
            <i class="fas fa-file"></i>
            <h4>${d.originalFileName || d.title}</h4>
            <span class="doc-type">${d.documentType}</span>
          </div>
          <div class="card-body">
            <p><strong>Tamaño:</strong> ${d.fileSize ? (d.fileSize / 1024).toFixed(2) + ' KB' : 'N/A'}</p>
            <p><strong>Caso:</strong> ${d.caseId || 'N/A'}</p>
          </div>
          <div class="card-actions">
            <button class="btn-small" onclick="viewDocument('${d.id}')">Ver</button>
            <button class="btn-small btn-outline" onclick="downloadDocument('${d.id}')">Descargar</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading documents:', err);
  }
}

// ================= TIME TRACKING =================
async function loadTimeEntries() {
  try {
    const res = await fetch(`${API_URL.timetracking}`, { headers: getHeaders() });
    const result = await res.json();
    
    if (result.success) {
      const entries = result.data || [];
      const container = document.getElementById('timetracking-list');
      container.innerHTML = entries.map(e => `
        <div class="data-card">
          <div class="card-header">
            <h4>Caso: ${e.caseId || 'N/A'}</h4>
            <span class="status-badge ${e.billable ? 'status-active' : 'status-inactive'}">${e.billable ? 'Facturable' : 'No facturable'}</span>
          </div>
          <div class="card-body">
            <p><strong>Descripción:</strong> ${e.description || 'N/A'}</p>
            <p><strong>Duración:</strong> ${e.duration || 0} min</p>
            <p><strong>Estado:</strong> ${e.status}</p>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading time entries:', err);
  }
}

// ================= BILLING =================
async function loadInvoices() {
  try {
    const res = await fetch(`${API_URL.billing}`, { headers: getHeaders() });
    const result = await res.json();
    
    if (result.success) {
      const invoices = result.data || [];
      const container = document.getElementById('billing-list');
      container.innerHTML = invoices.map(i => `
        <div class="data-card">
          <div class="card-header">
            <h4>${i.invoiceNumber}</h4>
            <span class="status-badge status-${i.status}">${i.status}</span>
          </div>
          <div class="card-body">
            <p><strong>Total:</strong> $${i.total || 0}</p>
            <p><strong>Cliente:</strong> ${i.clientId || 'N/A'}</p>
            <p><strong>Fecha:</strong> ${i.createdAt ? new Date(i.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div class="card-actions">
            <button class="btn-small" onclick="viewInvoice('${i.id}')">Ver</button>
            <button class="btn-small btn-outline" onclick="downloadInvoice('${i.id}')">PDF</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading invoices:', err);
  }
}

// ================= NOTIFICATIONS =================
async function loadNotifications() {
  try {
    const res = await fetch(`${API_URL.notifications}`, { headers: getHeaders() });
    const result = await res.json();
    
    if (result.success) {
      const notifications = result.data || [];
      const container = document.getElementById('notifications-list');
      container.innerHTML = notifications.map(n => `
        <div class="notification-card ${n.isRead ? '' : 'unread'}">
          <div class="notification-icon">
            <i class="fas fa-${n.type === 'error' ? 'exclamation-circle' : n.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
          </div>
          <div class="notification-content">
            <h4>${n.title}</h4>
            <p>${n.message}</p>
            <span class="notification-date">${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}</span>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading notifications:', err);
  }
}

// ================= MODAL FUNCTIONS =================
function showCreateCaseModal() {
  document.getElementById('create-case-modal').style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// ================= UTILITY FUNCTIONS =================
function showMessage(msg, type) {
  const el = document.getElementById('auth-message') || document.getElementById('main-message');
  if (el) {
    el.textContent = msg;
    el.className = type === 'error' ? 'message-error' : 'message-success';
    el.style.display = 'block';
    setTimeout(() => {
      el.style.display = 'none';
    }, 5000);
  }
}

// ================= INIT =================
window.onload = function() {
  // Check if already logged in
  if (authToken) {
    fetch(`${API_URL.auth}/profile`, { headers: getHeaders() })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          currentUser = result.data;
          document.getElementById('auth-section').style.display = 'none';
          document.querySelector('.sidebar').style.display = 'flex';
          document.querySelector('.main-content').style.display = 'block';
          updateUserUI();
          showSection('dashboard');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
  }
  
  // Set up form submissions
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', login);
  
  const registerForm = document.getElementById('register-form');
  if (registerForm) registerForm.addEventListener('submit', register);
  
  // Show login by default
  showSection('auth');
};
