// URLs de los servicios
const API_URL = {
  auth: 'http://localhost:3001/api/auth',
  cases: 'http://localhost:3002/api/cases',
  clients: 'http://localhost:3003/api/clients',
  documents: 'http://localhost:3004/api/documents',
  timetracking: 'http://localhost:3005/api/time-entries',
  billing: 'http://localhost:3006/api/invoices',
  notifications: 'http://localhost:3007/api/notifications',
  dashboard: 'http://localhost:3008/api/dashboard'
};

// Token global - limpiar cualquier token inválido al inicio
let authToken = localStorage.getItem('token') || '';
// Forzar limpieza si hay un token guardado que no funciona
if (authToken && authToken !== 'undefined') {
  try {
    // Verificar que el token no esté vacío o sea válido
    if (authToken.length < 20) {
      authToken = '';
      localStorage.removeItem('token');
    }
  } catch(e) {
    authToken = '';
    localStorage.removeItem('token');
  }
}

// Mostrar secciones
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(sectionId + '-section').classList.remove('hidden');
  
  // Actualizar menú activo
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + sectionId) {
      link.classList.add('active');
    }
  });
}

// Mostrar mensaje
function showMessage(elementId, message, isError = false) {
  const el = document.getElementById(elementId);
  el.className = isError ? 'message-error' : 'message-success';
  el.textContent = message;
}

// Headers con auth - siempre incluir Authorization header
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

// ==================== AUTH ====================
async function register(e) {
  e.preventDefault();
  if (!checkAuth()) {
    document.querySelector('.navbar').style.display = 'none';
  }
  const data = {
    firstName: document.getElementById('reg-firstName').value,
    lastName: document.getElementById('reg-lastName').value,
    email: document.getElementById('reg-email').value,
    password: document.getElementById('reg-password').value,
    role: document.getElementById('reg-role').value
  };

  try {
    const res = await fetch(`${API_URL.auth}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    
    if (result.success) {
      showMessage('auth-message', 'Registro exitoso! Ahora puedes hacer login.');
    } else {
      showMessage('auth-message', result.message, true);
    }
  } catch (err) {
    showMessage('auth-message', 'Error de conexión: ' + err.message, true);
  }
}

async function login(e) {
  e.preventDefault();
  const data = {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value
  };

  try {
    const res = await fetch(`${API_URL.auth}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    
    if (result.success) {
      authToken = result.data.token;
      localStorage.setItem('token', authToken);
      document.querySelector('.navbar').style.display = 'flex';
      showMessage('auth-message', '¡Bienvenido! Iniciando sesión...', false);
      setTimeout(() => {
        showSection('cases');
      }, 500);
    } else {
      showMessage('auth-message', result.message, true);
    }
  } catch (err) {
    showMessage('auth-message', 'Error de conexión: ' + err.message, true);
  }
}

function logout() {
  authToken = '';
  localStorage.removeItem('token');
  document.querySelector('.navbar').style.display = 'none';
  showSection('auth');
}

// ==================== CASES ====================
async function createCase(e) {
  e.preventDefault();
  
  const lawyerValue = document.getElementById('case-lawyer').value;
  const assignedTo = lawyerValue && lawyerValue.length > 5 ? lawyerValue : null;
  
  const data = {
    caseNumber: document.getElementById('case-number').value,
    title: document.getElementById('case-title').value,
    description: document.getElementById('case-description').value,
    caseType: document.getElementById('case-type').value,
    priority: document.getElementById('case-priority').value,
    clientId: document.getElementById('case-clientId').value,
    assignedTo: assignedTo,
    startDate: document.getElementById('case-startDate').value || null,
    budget: document.getElementById('case-budget').value || 0
  };
  
  if (!data.clientId || data.clientId === '') {
    alert('Por favor selecciona un cliente');
    return;
  }

  console.log('Token actual:', authToken);
  console.log('Headers:', getHeaders());

  try {
    const res = await fetch(`${API_URL.cases}/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message || (result.success ? 'Caso creado!' : 'Error: ' + result.message));
    getAllCases();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getCases(e) {
  e?.preventDefault();
  const status = document.getElementById('search-case-status').value;
  let url = API_URL.cases + '/';
  if (status) url += `?status=${status}`;
  
  try {
    const res = await fetch(url, { headers: getHeaders() });
    const result = await res.json();
    displayCases(result.data || []);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getAllCases() {
  try {
    const res = await fetch(API_URL.cases + '/', { headers: getHeaders() });
    const result = await res.json();
    displayCases(result.data || []);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function displayCases(cases) {
  const container = document.getElementById('cases-list');
  if (!cases.length) {
    container.innerHTML = '<p>No hay casos.</p>';
    return;
  }
  
  container.innerHTML = cases.map(c => `
    <div class="result-item">
      <div class="case-header">
        <strong>${c.caseNumber}</strong> - ${c.title}
        <span class="case-status status-${c.status}">${c.status}</span>
      </div>
      <div class="case-details">
        <p>Tipo: ${c.caseType} | Prioridad: ${c.priority} | Presupuesto: $${c.budget || 0}</p>
        <p>Cliente ID: ${c.clientId} | Abogado: ${c.assignedTo || 'Sin asignar'}</p>
        <p>Descripción: ${c.description || 'Sin descripción'}</p>
      </div>
      <div class="case-actions">
        <button onclick="editCase('${c.id}')" class="btn-edit">Editar</button>
        <button onclick="deleteCase('${c.id}')" class="btn-danger">Borrar</button>
      </div>
    </div>
  `).join('');
}

async function getCaseStats() {
  try {
    const res = await fetch(`${API_URL.cases}/stats`, { headers: getHeaders() });
    const result = await res.json();
    const statsEl = document.getElementById('cases-stats');
    statsEl.classList.remove('hidden');
    document.getElementById('cases-stats-content').textContent = JSON.stringify(result.data, null, 2);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function deleteCase(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este caso?')) return;
  
  try {
    const res = await fetch(`${API_URL.cases}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const result = await res.json();
    alert(result.message || (result.success ? 'Caso eliminado!' : 'Error: ' + result.message));
    getAllCases();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function editCase(id) {
  try {
    const res = await fetch(`${API_URL.cases}/${id}`, { headers: getHeaders() });
    const result = await res.json();
    
    if (!result.success) {
      alert('Error al obtener el caso');
      return;
    }
    
    const c = result.data;
    
    document.getElementById('case-edit-id').value = c.id;
    document.getElementById('case-edit-number').value = c.caseNumber;
    document.getElementById('case-edit-title').value = c.title;
    document.getElementById('case-edit-description').value = c.description || '';
    document.getElementById('case-edit-type').value = c.caseType;
    document.getElementById('case-edit-priority').value = c.priority;
    document.getElementById('case-edit-clientId').value = c.clientId;
    document.getElementById('case-edit-lawyer').value = c.assignedTo || '';
    document.getElementById('case-edit-startDate').value = c.startDate ? c.startDate.split('T')[0] : '';
    document.getElementById('case-edit-budget').value = c.budget || 0;
    document.getElementById('case-edit-status').value = c.status;
    
    document.getElementById('edit-case-modal').style.display = 'flex';
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function saveCase(e) {
  e.preventDefault();
  
  const id = document.getElementById('case-edit-id').value;
  const data = {
    caseNumber: document.getElementById('case-edit-number').value,
    title: document.getElementById('case-edit-title').value,
    description: document.getElementById('case-edit-description').value,
    caseType: document.getElementById('case-edit-type').value,
    priority: document.getElementById('case-edit-priority').value,
    clientId: document.getElementById('case-edit-clientId').value,
    assignedTo: document.getElementById('case-edit-lawyer').value,
    startDate: document.getElementById('case-edit-startDate').value,
    budget: parseFloat(document.getElementById('case-edit-budget').value) || 0,
    status: document.getElementById('case-edit-status').value
  };
  
  try {
    const res = await fetch(`${API_URL.cases}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message || (result.success ? 'Caso actualizado!' : 'Error: ' + result.message));
    document.getElementById('edit-case-modal').style.display = 'none';
    getAllCases();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function closeEditModal() {
  document.getElementById('edit-case-modal').style.display = 'none';
}

// ==================== CLIENTS ====================
async function createClient(e) {
  e.preventDefault();
  const data = {
    firstName: document.getElementById('client-firstName').value,
    lastName: document.getElementById('client-lastName').value,
    documentType: document.getElementById('client-docType').value,
    documentNumber: document.getElementById('client-docNumber').value,
    email: document.getElementById('client-email').value,
    phone: document.getElementById('client-phone').value,
    clientType: document.getElementById('client-type').value
  };

  try {
    const res = await fetch(`${API_URL.clients}/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message || (result.success ? 'Cliente creado!' : 'Error: ' + result.message));
    getAllClients();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getAllClients() {
  try {
    const res = await fetch(API_URL.clients + '/', { headers: getHeaders() });
    const result = await res.json();
    displayClients(result.data || []);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function displayClients(clients) {
  const container = document.getElementById('clients-list');
  if (!clients.length) {
    container.innerHTML = '<p>No hay clientes.</p>';
    return;
  }
  
  container.innerHTML = clients.map(c => `
    <div class="result-item">
      <strong>${c.firstName} ${c.lastName}</strong><br>
      ${c.documentType}: ${c.documentNumber}<br>
      Email: ${c.email || 'N/A'} | Tel: ${c.phone || 'N/A'}<br>
      Tipo: ${c.clientType} | Activo: ${c.isActive !== false ? 'Sí' : 'No'}
    </div>
  `).join('');
}

async function loadClientsForCase() {
  try {
    const res = await fetch(API_URL.clients + '/', { headers: getHeaders() });
    const result = await res.json();
    const clients = result.data || [];
    const select = document.getElementById('case-clientId');
    select.innerHTML = '<option value="">Seleccionar Cliente</option>';
    clients.forEach(c => {
      const option = document.createElement('option');
      option.value = c.id;
      option.textContent = `${c.firstName} ${c.lastName} (${c.documentType}: ${c.documentNumber})`;
      select.appendChild(option);
    });
  } catch (err) {
    alert('Error al cargar clientes: ' + err.message);
  }
}

async function loadLawyersForCase() {
  try {
    const res = await fetch(`${API_URL.auth}/lawyers`, { headers: getHeaders() });
    const result = await res.json();
    const lawyers = result.data || [];
    const select = document.getElementById('case-lawyer');
    select.innerHTML = '<option value="">Seleccionar Abogado (Opcional)</option>';
    
    if (lawyers.length === 0) {
      // Si no hay abogados, intentar cargar todos los usuarios
      const allRes = await fetch(`${API_URL.auth}/users`, { headers: getHeaders() });
      const allResult = await allRes.json();
      const allUsers = allResult.data?.users || [];
      allUsers.forEach(u => {
        const option = document.createElement('option');
        option.value = u.id || '';
        option.textContent = `${u.firstName || ''} ${u.lastName || ''} (${u.role || 'Sin rol'})`;
        select.appendChild(option);
      });
    } else {
      lawyers.forEach(l => {
        const option = document.createElement('option');
        option.value = l.id || '';
        option.textContent = `${l.firstName || ''} ${l.lastName || ''} (${l.role || 'Sin rol'})`;
        select.appendChild(option);
      });
    }
    
    if (select.options.length <= 1) {
      alert('No hay usuarios registrados');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error al cargar usuarios: ' + err.message);
  }
}

// ==================== DOCUMENTS ====================
async function uploadDocument(e) {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('file', document.getElementById('doc-file').files[0]);
  formData.append('caseId', document.getElementById('doc-caseId').value);
  formData.append('documentType', document.getElementById('doc-type').value);
  formData.append('description', document.getElementById('doc-description').value);

  try {
    const res = await fetch(`${API_URL.documents}/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData
    });
    const result = await res.json();
    alert(result.message || (result.success ? 'Documento subido!' : 'Error: ' + result.message));
    getAllDocuments();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getAllDocuments() {
  try {
    const res = await fetch(API_URL.documents + '/', { headers: getHeaders() });
    const result = await res.json();
    displayDocuments(result.data || []);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getDocumentsByCase(e) {
  e.preventDefault();
  const caseId = document.getElementById('doc-search-caseId').value;
  if (!caseId) return getAllDocuments();
  
  try {
    const res = await fetch(`${API_URL.documents}/case/${caseId}`, { headers: getHeaders() });
    const result = await res.json();
    displayDocuments(result.data || []);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function displayDocuments(docs) {
  const container = document.getElementById('documents-list');
  if (!docs.length) {
    container.innerHTML = '<p>No hay documentos.</p>';
    return;
  }
  
  container.innerHTML = docs.map(d => `
    <div class="result-item">
      <strong>${d.originalFileName}</strong><br>
      Caso ID: ${d.caseId} | Tipo: ${d.documentType}<br>
      Tamaño: ${(d.fileSize / 1024).toFixed(2)} KB<br>
      <button onclick="downloadDocument('${d._id}')">Descargar</button>
      <button class="danger" onclick="deleteDocument('${d._id}')">Eliminar</button>
    </div>
  `).join('');
}

async function downloadDocument(id) {
  window.open(`${API_URL.documents}/${id}/download`, '_blank');
}

async function deleteDocument(id) {
  if (!confirm('Eliminar documento?')) return;
  
  try {
    const res = await fetch(`${API_URL.documents}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const result = await res.json();
    alert(result.message);
    getAllDocuments();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// ==================== TIME TRACKING ====================
async function startTimeEntry(e) {
  e.preventDefault();
  const data = {
    caseId: document.getElementById('time-caseId').value,
    description: document.getElementById('time-description').value,
    billable: document.getElementById('time-billable').checked,
    hourlyRate: document.getElementById('time-rate').value || 0
  };

  try {
    const res = await fetch(`${API_URL.timetracking}/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message || (result.success ? 'Temporizador iniciado!' : 'Error: ' + result.message));
    getTimeEntries();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function stopTimeEntry(e) {
  e.preventDefault();
  const id = document.getElementById('time-stop-id').value;
  
  try {
    const res = await fetch(`${API_URL.timetracking}/${id}/stop`, {
      method: 'PUT',
      headers: getHeaders()
    });
    const result = await res.json();
    alert(result.message);
    getTimeEntries();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getTimeEntries(e) {
  e?.preventDefault();
  const caseId = document.getElementById('time-search-caseId').value;
  let url = API_URL.timetracking + '/';
  if (caseId) url += `?caseId=${caseId}`;
  
  try {
    const res = await fetch(url, { headers: getHeaders() });
    const result = await res.json();
    displayTimeEntries(result.data || []);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function displayTimeEntries(entries) {
  const container = document.getElementById('timetracking-list');
  if (!entries.length) {
    container.innerHTML = '<p>No hay entradas de tiempo.</p>';
    return;
  }
  
  container.innerHTML = entries.map(e => `
    <div class="result-item">
      <strong>Caso: ${e.caseId}</strong><br>
      Descripción: ${e.description}<br>
      Estado: ${e.status} | Duración: ${e.duration || 0} min<br>
      Facturable: ${e.billable ? 'Sí' : 'No'}
    </div>
  `).join('');
}

// ==================== BILLING ====================
let invoiceItems = [];

function addInvoiceItem() {
  const desc = document.querySelector('.inv-item-desc')?.value;
  const qty = document.querySelector('.inv-item-qty')?.value;
  const price = document.querySelector('.inv-item-price')?.value;
  
  if (desc && qty && price) {
    invoiceItems.push({ description: desc, quantity: parseInt(qty), unitPrice: parseFloat(price) });
    alert('Ítem agregado. Agrega más si es necesario.');
  } else {
    alert('Completa los campos del ítem primero.');
  }
}

async function createInvoice(e) {
  e.preventDefault();
  
  if (invoiceItems.length === 0) {
    alert('Agrega al menos un ítem a la factura.');
    return;
  }
  
  const data = {
    clientId: document.getElementById('inv-clientId').value,
    caseId: document.getElementById('inv-caseId').value || null,
    items: invoiceItems,
    tax: parseFloat(document.getElementById('inv-tax').value) || 0,
    dueDate: document.getElementById('inv-dueDate').value,
    notes: document.getElementById('inv-notes').value
  };

  try {
    const res = await fetch(`${API_URL.billing}/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message || (result.success ? 'Factura creada!' : 'Error: ' + result.message));
    invoiceItems = [];
    getAllInvoices();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getAllInvoices() {
  try {
    const res = await fetch(API_URL.billing + '/', { headers: getHeaders() });
    const result = await res.json();
    displayInvoices(result.data || []);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getInvoicesByClient(e) {
  e.preventDefault();
  const clientId = document.getElementById('inv-search-clientId').value;
  if (!clientId) return getAllInvoices();
  
  try {
    const res = await fetch(`${API_URL.billing}/client/${clientId}`, { headers: getHeaders() });
    const result = await res.json();
    displayInvoices(result.data || []);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function displayInvoices(invoices) {
  const container = document.getElementById('billing-list');
  if (!invoices.length) {
    container.innerHTML = '<p>No hay facturas.</p>';
    return;
  }
  
  container.innerHTML = invoices.map(i => `
    <div class="result-item">
      <strong>${i.invoiceNumber}</strong> - Cliente: ${i.clientId}<br>
      Total: $${i.total} | Estado: ${i.status}<br>
      ${i.status !== 'paid' ? `<button onclick="payInvoice('${i._id}')">Pagar</button>` : ''}
    </div>
  `).join('');
}

async function payInvoice(id) {
  try {
    const res = await fetch(`${API_URL.billing}/${id}/pay`, {
      method: 'PUT',
      headers: getHeaders()
    });
    const result = await res.json();
    alert(result.message);
    getAllInvoices();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// ==================== NOTIFICATIONS ====================
async function createNotification(e) {
  e.preventDefault();
  const data = {
    userId: document.getElementById('notif-userId').value,
    title: document.getElementById('notif-title').value,
    message: document.getElementById('notif-message').value,
    type: document.getElementById('notif-type').value
  };

  try {
    const res = await fetch(`${API_URL.notifications}/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message || (result.success ? 'Notificación creada!' : 'Error: ' + result.message));
    getNotifications();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function sendNotification(e) {
  e.preventDefault();
  const data = {
    userId: document.getElementById('notif-send-userId').value,
    email: document.getElementById('notif-send-email').value || null,
    title: document.getElementById('notif-send-title').value,
    message: document.getElementById('notif-send-message').value,
    channel: document.getElementById('notif-send-channel').value
  };

  try {
    const res = await fetch(`${API_URL.notifications}/send`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message || (result.success ? 'Notificación enviada!' : 'Error: ' + result.message));
    getNotifications();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getNotifications() {
  try {
    const res = await fetch(API_URL.notifications + '/', { headers: getHeaders() });
    const result = await res.json();
    displayNotifications(result.data || []);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function markAllAsRead() {
  try {
    const res = await fetch(`${API_URL.notifications}/read-all`, {
      method: 'PUT',
      headers: getHeaders()
    });
    const result = await res.json();
    alert(result.message);
    getNotifications();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

function displayNotifications(notifs) {
  const container = document.getElementById('notifications-list');
  if (!notifs.length) {
    container.innerHTML = '<p>No hay notificaciones.</p>';
    return;
  }
  
  container.innerHTML = notifs.map(n => `
    <div class="result-item ${n.isRead ? '' : 'warning'}">
      <strong>${n.title}</strong><br>
      ${n.message}<br>
      Tipo: ${n.type} | Leída: ${n.isRead ? 'Sí' : 'No'}
    </div>
  `).join('');
}

// ==================== DASHBOARD ====================
async function getDashboardStats() {
  try {
    const res = await fetch(`${API_URL.dashboard}/stats`, { headers: getHeaders() });
    const result = await res.json();
    document.getElementById('dashboard-stats').textContent = JSON.stringify(result.data, null, 2);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getCasesStats() {
  try {
    const res = await fetch(`${API_URL.dashboard}/cases`, { headers: getHeaders() });
    const result = await res.json();
    document.getElementById('dashboard-cases').textContent = JSON.stringify(result.data, null, 2);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getFinancialStats() {
  try {
    const res = await fetch(`${API_URL.dashboard}/financial`, { headers: getHeaders() });
    const result = await res.json();
    document.getElementById('dashboard-financial').textContent = JSON.stringify(result.data, null, 2);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function getClientsStats() {
  try {
    const res = await fetch(`${API_URL.dashboard}/clients`, { headers: getHeaders() });
    const result = await res.json();
    document.getElementById('dashboard-clients').textContent = JSON.stringify(result.data, null, 2);
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// ========================================
// CONTROL DE SESIÓN OBLIGATORIA
// ========================================

function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined' || token.length < 20) {
    return false;
  }
  return true;
}

function requireAuth() {
  if (!checkAuth()) {
    showSection('auth');
    document.querySelector('.navbar').style.display = 'none';
    return false;
  }
  document.querySelector('.navbar').style.display = 'flex';
  return true;
}

// Ocultar navbar inicialmente si no hay sesión
if (!checkAuth()) {
  document.querySelector('.navbar').style.display = 'none';
  showSection('auth');
} else {
  document.querySelector('.navbar').style.display = 'flex';
  showSection('cases');
}

// Modificar showSection para verificar auth
const originalShowSection = showSection;
showSection = function(sectionId) {
  if (sectionId !== 'auth' && !checkAuth()) {
    showSection('auth');
    return;
  }
  originalShowSection(sectionId);
  
  if (sectionId === 'auth') {
    document.querySelector('.navbar').style.display = 'none';
  } else {
    document.querySelector('.navbar').style.display = 'flex';
  }
};

// Modificar login para mostrar navbar
const originalLogin = login;
login = async function(e) {
  await originalLogin(e);
  if (localStorage.getItem('token')) {
    document.querySelector('.navbar').style.display = 'flex';
  }
};

// Modificar logout
const originalLogout = logout;
logout = function() {
  originalLogout();
  document.querySelector('.navbar').style.display = 'none';
  showSection('auth');
};