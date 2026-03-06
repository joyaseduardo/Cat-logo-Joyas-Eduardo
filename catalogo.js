
// TABS
function cambiarTab(tab) {
  var tabs = document.querySelectorAll('.tab-content');
  var btns = document.querySelectorAll('.tab-btn');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
  var contenido = document.getElementById('content-' + tab);
  var boton = document.getElementById('tab-' + tab);
  if (contenido) contenido.classList.add('active');
  if (boton) boton.classList.add('active');
  if (tab === 'joyas') cargarJoyas();
}

// ── JOYAS DATA ────────────────────────────
var joyasData = [];
var filtroActivo = 'todos';
var joyasCargadas = false;

function cargarJoyas() {
  if (joyasCargadas) return;

  // Mostrar loading
  var grid = document.getElementById('joyasGrid');
  if (grid) grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="icon">⏳</div><p>Cargando joyas...</p></div>';

  fetch('joyas-data.json?v=' + Date.now())
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(data) {
      joyasData = data;
      joyasCargadas = true;
      construirFiltros();
      renderJoyas();
      // Badge con cantidad
      var tabJoyas = document.getElementById('tab-joyas');
      if (tabJoyas) {
        var badge = tabJoyas.querySelector('.tab-badge');
        var activos = joyasData.filter(function(j){ return j.cantidad > 0; }).length;
        if (!badge) {
          tabJoyas.innerHTML += ' <span class="tab-badge">' + activos + '</span>';
        } else {
          badge.textContent = activos;
        }
      }
    })
    .catch(function(e) {
      console.log('joyas-data.json no disponible:', e.message);
      var g = document.getElementById('joyasGrid');
      if (g) g.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="icon">📂</div><p>El catálogo de joyas aún no está disponible.<br><small style="color:#444;margin-top:.5rem;display:block;">Exportá el archivo <strong>joyas-data.json</strong> desde la app de gestión con el botón <strong>🌐 Catálogo</strong> y subilo a Netlify junto con este HTML.</small></p></div>';
    });
}

function construirFiltros() {
  var cats = [];
  joyasData.forEach(function(j){ if(j.categoria && cats.indexOf(j.categoria)===-1) cats.push(j.categoria); });
  cats.sort();
  var bar = document.getElementById('filtrosBar');
  var totalActivos = joyasData.filter(function(j){ return j.cantidad > 0; }).length;
  bar.innerHTML = '<button class="filtro-btn active" onclick="setFiltro(\'todos\', this)">Todos (' + totalActivos + ')</button>';
  cats.forEach(function(cat) {
    var count = joyasData.filter(function(j){ return j.categoria === cat && j.cantidad > 0; }).length;
    if (count === 0) return;
    bar.innerHTML += '<button class="filtro-btn" onclick="setFiltro(\'' + cat + '\', this)">' + cat + ' (' + count + ')</button>';
  });
}

function setFiltro(cat, btn) {
  filtroActivo = cat;
  document.querySelectorAll('.filtro-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  renderJoyas();
}

function filtrarJoyas() { renderJoyas(); }

function renderJoyas() {
  var busqueda = (document.getElementById('busquedaJoyas').value || '').toLowerCase();
  var lista = joyasData.slice();

  if (filtroActivo !== 'todos') lista = lista.filter(function(j){ return j.categoria === filtroActivo; });
  if (busqueda) lista = lista.filter(function(j){
    return (j.nombre||'').toLowerCase().indexOf(busqueda) > -1 ||
           (j.sku||'').toLowerCase().indexOf(busqueda) > -1 ||
           (j.material||'').toLowerCase().indexOf(busqueda) > -1;
  });

  // Stock primero
  lista.sort(function(a,b){ return (b.cantidad > 0 ? 1 : 0) - (a.cantidad > 0 ? 1 : 0); });

  var grid = document.getElementById('joyasGrid');
  if (!grid) return;

  if (lista.length === 0) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="icon">🔍</div><p>No se encontraron joyas con ese criterio.</p></div>';
    return;
  }

  grid.innerHTML = lista.map(function(j) {
    // Mapa categoria -> carpeta de imagenes
    var carpetas = {
      'Anillos':   'ANILLOS',
      'Aros':      'AROS',
      'Dijes':     'DIJES',
      'Pulseras':  'PULSERAS',
      'Cadenas':   'CADENAS',
      'Otros':     'OTROS',
      'Creaciones':'CREACIONES',
      'Arreglos':  'ARREGLOS'
    };
    var carpeta = carpetas[j.categoria] || j.categoria || 'OTROS';
    // Archivos de foto usan espacio en lugar de guion (ej: AN 185.jpg)
    var nombreFoto = j.foto ? j.foto.replace(/-/g, ' ') : '';
    var rutaFoto = nombreFoto ? 'https://res.cloudinary.com/dfsnzdwqx/image/upload/imagenes/' + carpeta + '/' + nombreFoto : '';
    var precio = j.precioARS > 0 ? '$' + j.precioARS.toLocaleString('es-AR') : 'Consultar precio';
    var sinStock = j.cantidad === 0;
    var msgWA = encodeURIComponent('Hola! Me interesa 💎\n\nProducto: ' + j.nombre + '\nCódigo: ' + j.sku + '\nMaterial: ' + (j.material||'') + '\n\n¿Está disponible?');
    return '<div class="joya-card' + (sinStock ? ' opacity-50' : '') + '">' +
      '<div class="foto-container">' +
      (rutaFoto ? '<img src="' + rutaFoto + '" alt="' + j.nombre + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' : '') +
      '<div class="foto-placeholder" style="' + (rutaFoto ? 'display:none' : '') + '"><span>💎</span><p>' + j.sku + '</p></div>' +
      (j.categoria ? '<span class="badge-categoria">' + j.categoria + '</span>' : '') +
      (sinStock ? '<div class="sin-stock">Sin stock</div>' : '') +
      '</div>' +
      '<div class="info">' +
      '<div class="sku">' + j.sku + '</div>' +
      '<div class="nombre">' + j.nombre + '</div>' +
      '<div class="material">' + (j.material||'') + '</div>' +
      (j.notas ? '<div class="notas-badge">📝 ' + j.notas + '</div>' : '') +
      '<div class="precio">' + precio + '</div>' +
      '<button class="btn-consultar" onclick="consultarJoya(\'' + msgWA + '\')" ' + (sinStock ? 'disabled style="opacity:0.4;cursor:not-allowed"' : '') + '>💬 Consultar por WhatsApp</button>' +
      '</div></div>';
  }).join('');
}


function consultarJoya(msgWA) {
  window.open('https://wa.me/5492976235421?text=' + msgWA, '_blank');
}

// WELCOME MODAL
function cerrarWelcome() {
  document.getElementById('welcomeModal').classList.remove('active');
  try { localStorage.setItem('welcomeSeenV2', '1'); } catch(e) {}
}

if (!localStorage.getItem('welcomeSeenV2')) {
  setTimeout(function() {
    document.getElementById('welcomeModal').classList.add('active');
  }, 2000);
}
