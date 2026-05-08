// ========================================
// LEGALTECH - JAVASCRIPT PREMIUM UI
// ========================================

// ================= API URLS (Relative paths for nginx) =================

const API_URL = {

  auth:'/api/auth',

  cases:'/api/cases',

  clients:'/api/clients',

  documents:'/api/documents',

  timetracking:'/api/time-entries',

  billing:'/api/invoices',

  notifications:'/api/notifications',

  dashboard:'/api/dashboard'

};

// ================= TOKEN =================

let authToken = localStorage.getItem('token') || '';

// ========================================
// SHOW SECTION
// ========================================

function showSection(sectionId){

  document.querySelectorAll('.section')
  .forEach(section=>{

    section.style.display='none';

  });

  const activeSection =
  document.getElementById(`${sectionId}-section`);

  if(activeSection){

    activeSection.style.display='block';

  }

  // ACTIVE MENU

  document.querySelectorAll('.menu li')
  .forEach(item=>item.classList.remove('active'));

}

// ========================================
// TOAST MESSAGE
// ========================================

function showToast(message,type='success'){

  const toast = document.createElement('div');

  toast.className = `toast ${type}`;

  toast.innerHTML = `
  
    <span>${message}</span>

  `;

  document.body.appendChild(toast);

  setTimeout(()=>{

    toast.classList.add('show');

  },100);

  setTimeout(()=>{

    toast.classList.remove('show');

    setTimeout(()=>{

      toast.remove();

    },300);

  },3000);

}

// ========================================
// AUTH HEADERS
// ========================================

function getHeaders(){

  return{

    'Content-Type':'application/json',

    'Authorization':
    authToken ? `Bearer ${authToken}` : ''

  };

}

// ========================================
// LOADING EFFECT
// ========================================

function showLoading(containerId){

  const container =
  document.getElementById(containerId);

  container.innerHTML = `

    <div class="loading-card">

      <div class="loader"></div>

      <p>Cargando...</p>

    </div>

  `;

}

// ========================================
// AUTH
// ========================================

async function register(e){

  e.preventDefault();

  const data = {

    firstName:
    document.getElementById('reg-firstName').value,

    lastName:
    document.getElementById('reg-lastName').value,

    email:
    document.getElementById('reg-email').value,

    password:
    document.getElementById('reg-password').value,

    role:
    document.getElementById('reg-role').value

  };

  try{

    const res = await fetch(
      `${API_URL.auth}/register`,
      {

        method:'POST',

        headers:{
          'Content-Type':'application/json'
        },

        body:JSON.stringify(data)

      }
    );

    const result = await res.json();

    if(result.success){

      showToast('Cuenta creada correctamente');

    }else{

      showToast(result.message,'error');

    }

  }catch(err){

    showToast(err.message,'error');

  }

}

// ========================================
// LOGIN
// ========================================

async function login(e){

  e.preventDefault();

  const data = {

    email:
    document.getElementById('login-email').value,

    password:
    document.getElementById('login-password').value

  };

  try{

    const res = await fetch(
      `${API_URL.auth}/login`,
      {

        method:'POST',

        headers:{
          'Content-Type':'application/json'
        },

        body:JSON.stringify(data)

      }
    );

    const result = await res.json();

    if(result.success){

      authToken = result.data.token;

      localStorage.setItem(
        'token',
        authToken
      );

      showToast('Bienvenido');

      showSection('dashboard');

      loadDashboard();

    }else{

      showToast(result.message,'error');

    }

  }catch(err){

    showToast(err.message,'error');

  }

}

// ========================================
// LOGOUT
// ========================================

function logout(){

  localStorage.removeItem('token');

  authToken='';

  showToast('Sesión cerrada');

  showSection('auth');

}

// ========================================
// CASES
// ========================================

async function createCase(e){

  e.preventDefault();

  const data = {

    caseNumber:
    document.getElementById('case-number').value,

    title:
    document.getElementById('case-title').value,

    description:
    document.getElementById('case-description').value,

    caseType:
    document.getElementById('case-type').value,

    priority:
    document.getElementById('case-priority').value,

    startDate:
    document.getElementById('case-startDate').value,

    budget:
    document.getElementById('case-budget').value || 0

  };

  try{

    const res = await fetch(
      `${API_URL.cases}/`,
      {

        method:'POST',

        headers:getHeaders(),

        body:JSON.stringify(data)

      }
    );

    const result = await res.json();

    if(result.success){

      showToast('Caso creado');

      getAllCases();

    }else{

      showToast(result.message,'error');

    }

  }catch(err){

    showToast(err.message,'error');

  }

}

// ========================================
// GET CASES
// ========================================

async function getAllCases(){

  showLoading('cases-list');

  try{

    const res = await fetch(
      `${API_URL.cases}/`,
      {

        headers:getHeaders()

      }
    );

    const result = await res.json();

    displayCases(result.data || []);

  }catch(err){

    showToast(err.message,'error');

  }

}

// ========================================
// DISPLAY CASES
// ========================================

function displayCases(cases){

  const container =
  document.getElementById('cases-list');

  if(!cases.length){

    container.innerHTML = `

      <div class="empty-state">

        No hay casos registrados

      </div>

    `;

    return;

  }

  container.innerHTML = cases.map(c=>`

    <div class="result-item">

      <div class="result-top">

        <h3>${c.title}</h3>

        <span class="case-status status-${c.status}">
          ${c.status}
        </span>

      </div>

      <p>
        ${c.description || 'Sin descripción'}
      </p>

      <div class="case-meta">

        <span>
          ⚖️ ${c.caseType}
        </span>

        <span>
          💰 $${c.budget || 0}
        </span>

        <span>
          🔥 ${c.priority}
        </span>

      </div>

    </div>

  `).join('');

}

// ========================================
// CLIENTS
// ========================================

async function createClient(e){

  e.preventDefault();

  const data = {

    firstName:
    document.getElementById('client-firstName').value,

    lastName:
    document.getElementById('client-lastName').value,

    email:
    document.getElementById('client-email').value,

    phone:
    document.getElementById('client-phone').value

  };

  try{

    const res = await fetch(
      `${API_URL.clients}/`,
      {

        method:'POST',

        headers:getHeaders(),

        body:JSON.stringify(data)

      }
    );

    const result = await res.json();

    if(result.success){

      showToast('Cliente creado');

      getAllClients();

    }else{

      showToast(result.message,'error');

    }

  }catch(err){

    showToast(err.message,'error');

  }

}

// ========================================
// GET CLIENTS
// ========================================

async function getAllClients(){

  showLoading('clients-list');

  try{

    const res = await fetch(
      `${API_URL.clients}/`,
      {

        headers:getHeaders()

      }
    );

    const result = await res.json();

    displayClients(result.data || []);

  }catch(err){

    showToast(err.message,'error');

  }

}

// ========================================
// DISPLAY CLIENTS
// ========================================

function displayClients(clients){

  const container =
  document.getElementById('clients-list');

  if(!clients.length){

    container.innerHTML =
    `<div class="empty-state">
      No hay clientes
    </div>`;

    return;

  }

  container.innerHTML = clients.map(c=>`

    <div class="result-item">

      <h3>
        ${c.firstName}
        ${c.lastName}
      </h3>

      <p>
        📧 ${c.email || 'Sin email'}
      </p>

      <p>
        📱 ${c.phone || 'Sin teléfono'}
      </p>

    </div>

  `).join('');

}

// ========================================
// DOCUMENTS
// ========================================

async function uploadDocument(e){

  e.preventDefault();

  const formData = new FormData();

  formData.append(
    'file',
    document.getElementById('doc-file').files[0]
  );

  formData.append(
    'caseId',
    document.getElementById('doc-caseId').value
  );

  formData.append(
    'description',
    document.getElementById('doc-description').value
  );

  try{

    const res = await fetch(
      `${API_URL.documents}/`,
      {

        method:'POST',

        headers:{
          'Authorization':
          `Bearer ${authToken}`
        },

        body:formData

      }
    );

    const result = await res.json();

    if(result.success){

      showToast('Documento subido');

      getAllDocuments();

    }else{

      showToast(result.message,'error');

    }

  }catch(err){

    showToast(err.message,'error');

  }

}

// ========================================
// GET DOCUMENTS
// ========================================

async function getAllDocuments(){

  showLoading('documents-list');

  try{

    const res = await fetch(
      `${API_URL.documents}/`,
      {

        headers:getHeaders()

      }
    );

    const result = await res.json();

    displayDocuments(result.data || []);

  }catch(err){

    showToast(err.message,'error');

  }

}

// ========================================
// DISPLAY DOCUMENTS
// ========================================

function displayDocuments(docs){

  const container =
  document.getElementById('documents-list');

  if(!docs.length){

    container.innerHTML =
    `<div class="empty-state">
      No hay documentos
    </div>`;

    return;

  }

  container.innerHTML = docs.map(d=>`

    <div class="result-item">

      <h3>
        📄 ${d.originalFileName}
      </h3>

      <p>
        Caso:
        ${d.caseId}
      </p>

      <p>
        ${(d.fileSize / 1024).toFixed(2)}
        KB
      </p>

      <button
      onclick="downloadDocument('${d._id}')">

      Descargar

      </button>

    </div>

  `).join('');

}

// ========================================
// DOWNLOAD DOCUMENT
// ========================================

function downloadDocument(id){

  window.open(
    `${API_URL.documents}/${id}/download`,
    '_blank'
  );

}

// ========================================
// DASHBOARD
// ========================================

async function loadDashboard(){

  try{

    const res = await fetch(
      `${API_URL.dashboard}/stats`,
      {

        headers:getHeaders()

      }
    );

    const result = await res.json();

    updateDashboard(result.data);

  }catch(err){

    console.log(err);

  }

}

// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard(data){

  if(!data) return;

  const statCards =
  document.querySelectorAll('.stat-card h2');

  if(statCards.length >= 4){

    statCards[0].innerText =
    data.cases || 0;

    statCards[1].innerText =
    data.clients || 0;

    statCards[2].innerText =
    `$${data.revenue || 0}`;

    statCards[3].innerText =
    data.notifications || 0;

  }

}

// ========================================
// DARK MODE
// ========================================

function toggleDarkMode(){

  document.body.classList.toggle('dark');

  localStorage.setItem(
    'darkMode',
    document.body.classList.contains('dark')
  );

}

// ========================================
// LOAD DARK MODE
// ========================================

if(localStorage.getItem('darkMode') === 'true'){

  document.body.classList.add('dark');

}

// ========================================
// AUTO LOAD
// ========================================

window.onload = ()=>{

  if(authToken){

    showSection('dashboard');

    loadDashboard();

  }else{

    showSection('auth');

  }

};

// ========================================
// TOAST CSS AUTO
// ========================================

const style = document.createElement('style');

style.innerHTML = `

.toast{

  position:fixed;

  top:30px;
  right:30px;

  background:#111827;

  color:white;

  padding:16px 22px;

  border-radius:14px;

  box-shadow:
  0 10px 30px rgba(0,0,0,.2);

  transform:translateX(120%);

  transition:.4s;

  z-index:9999;

}

.toast.show{

  transform:translateX(0);

}

.toast.error{

  background:#ef4444;

}

.loading-card{

  padding:40px;

  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;

}

.loader{

  width:40px;
  height:40px;

  border:4px solid #e5e7eb;

  border-top:4px solid #2563eb;

  border-radius:50%;

  animation:spin 1s linear infinite;

  margin-bottom:15px;

}

@keyframes spin{

  to{

    transform:rotate(360deg);

  }

}

.empty-state{

  padding:50px;

  text-align:center;

  color:#6b7280;

}

.result-top{

  display:flex;
  justify-content:space-between;
  align-items:center;

  margin-bottom:15px;

}

.case-meta{

  display:flex;
  gap:15px;

  margin-top:15px;

  flex-wrap:wrap;

}

`;

document.head.appendChild(style);