/* ==========================================================================
   FRONTEND LOGIC: Hamburguesas A Tu Estilo
   Features: Cart state, item customization, search/filtering, multi-step checkout,
             thermal ticket generation, synth sound effects, and Admin Live Sync.
   ========================================================================== */

// ===== 1. DETAILED MENU DATABASE =====
const menu = [
  {
    id: 1, cat: 'hamburgesa', emoji: '🍔', name: 'La Capitana',
    desc: 'Doble carne smashed angus, queso cheddar blanco fundido, cebolla caramelizada al bourbon y huevo de campo frito.',
    price: 7500, featured: true, image: 'assets/capitana.png',
    extras: ['Bacon ahumado extra +$800', 'Doble queso cheddar +$500', 'Huevo de campo extra +$400'],
    remove: ['Cebolla caramelizada', 'Queso cheddar', 'Huevo frito']
  },
  {
    id: 2, cat: 'hamburgesa', emoji: '🖤', name: 'La Oscura',
    desc: 'Exclusivo pan brioche negro de carbón activado, doble medallón angus, cheddar premium y salsa secreta ahumada.',
    price: 7000, featured: true, image: 'assets/oscura.png',
    extras: ['Bacon ahumado extra +$800', 'Pepinillos agridulces +$300', 'Doble queso cheddar +$500'],
    remove: ['Cheddar fundido', 'Salsa especial']
  },
  {
    id: 3, cat: 'hamburgesa', emoji: '🥓', name: 'BBQ Bacon Craft',
    desc: 'Carne angus seleccionada, bacon crocante glaseado en miel, aros de cebolla crujientes y salsa barbacoa de la casa.',
    price: 7800, featured: false, image: 'assets/bbq_bacon.png',
    extras: ['Doble bacon ahumado +$900', 'Jalapeños encurtidos +$400', 'Doble carne smashed +$1200'],
    remove: ['Aros de cebolla', 'Bacon crujiente', 'Salsa BBQ']
  },
  {
    id: 4, cat: 'hamburgesa', emoji: '🌶️', name: 'La Infernal',
    desc: 'Doble carne smashed angus, jalapeños encurtidos, cheddar fundido, cebolla crujiente y salsa de chiles ahumados.',
    price: 7200, featured: false, image: 'assets/infernal.png',
    extras: ['Más jalapeños picantes +$350', 'Doble queso cheddar +$500', 'Doble carne smashed +$1200'],
    remove: ['Jalapeños', 'Cebolla crujiente', 'Salsa picante']
  },
  {
    id: 5, cat: 'papas', emoji: '🍟', name: 'Papas Rústicas',
    desc: 'Papas fritas con corte rústico artesanal, sal marina de la patagonia y hojas de romero fresco.',
    price: 2800, featured: false, image: 'assets/papas_clasicas.png',
    extras: ['Cheddar fundido cremoso +$600', 'Bacon ahumado picado +$700'],
    remove: []
  },
  {
    id: 6, cat: 'papas', emoji: '🧀', name: 'Papas Cheddar & Bacon',
    desc: 'Nuestras papas rústicas bañadas en una cremosa salsa de queso cheddar casera y lluvia de bacon crujiente.',
    price: 3600, featured: false, image: 'assets/papas_cheddar.png',
    extras: ['Doble porción bacon +$700', 'Jalapeños en rodajas +$400'],
    remove: []
  },
  {
    id: 7, cat: 'bebidas', emoji: '🍋', name: 'Limonada de Menta',
    desc: 'Limonada natural exprimida al momento, macerada con menta fresca, jengibre y hielo triturado.',
    price: 1800, featured: false, image: 'assets/limonada.png',
    extras: ['Endulzar con miel +$200'],
    remove: ['Menta', 'Jengibre']
  },
  {
    id: 8, cat: 'combo', emoji: '🍔🍟🥤', name: 'Combo Full Craft',
    desc: 'Cualquier hamburguesa premium a elección de la carta + papas rústicas medianas + bebida a elección.',
    price: 10500, featured: false, image: 'assets/combo_gourmet.png',
    extras: ['Agrandar papas a cheddar +$500', 'Sumar un dip gourmet +$300'],
    remove: []
  },
  {
    id: 9, cat: 'combo', emoji: '🍔🍔🍟', name: 'Combo Dúo Brutal',
    desc: 'Dos hamburguesas premium clásicas a elección + porción extra grande de papas rústicas para compartir.',
    price: 16000, featured: false, image: 'assets/capitana.png', // Fallback to capitana
    extras: ['Agrandar papas a cheddar +$800'],
    remove: []
  }
];

// ===== 2. STATE MANAGER =====
let cart = [];
let currentProduct = null;
let modalQtyVal = 1;
let selectedExtras = [];
let selectedRemove = [];
let currentCheckoutStep = 1;

// Global dynamic states (Syncs with Firebase Firestore / Local Sandbox)
let activeMenu = [];
let storeConfig = {
  storeName: "Hamburguesas A Tu Estilo",
  tagline: "A tu estilo o nada",
  whatsapp: "5491137410000",
  instagram: "hamburguesas_a_tu_estilo",
  deliveryZone: "Consultar Cobertura",
  minOrder: 5000,
  welcomeMessage: "¡Hola! Quiero hacer un pedido gourmet 🍔",
  isOpen: true
};
let audioEnabled = true;

// ===== 3. CORE AUDIO SYNTH (Web Audio API - No assets needed!) =====
function playAddSound() {
  if (!audioEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Bubble Pop / Sizzle synthesized sound
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (e) {
    console.warn("AudioContext blockeado o no soportado por navegador.", e);
  }
}

// ===== 4. RENDER MENU WITH LIVE STOCK FROM ADMIN =====
function renderMenu(cat = 'all') {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  const isStoreClosed = !storeConfig.isOpen;
  const searchQuery = document.getElementById('searchMenu')?.value.toLowerCase() || '';
  const filtered = activeMenu
    .filter(p => cat === 'all' || p.cat === cat)
    .filter(p => p.name.toLowerCase().includes(searchQuery) || p.desc.toLowerCase().includes(searchQuery));
  
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted); font-size: 1rem;">
      🔍 No encontramos productos que coincidan con tu búsqueda.
    </div>`;
    return;
  }
  
  filtered.forEach((p, i) => {
    const isOutOfStock = p.available === false;
    const priceVal = p.price || 0;
    
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.style.transitionDelay = (i * 0.04) + 's';
    
    let btnHtml = '';
    if (isStoreClosed) {
      btnHtml = `<button class="btn-add" disabled style="background:var(--ash-gray);opacity:0.3;cursor:not-allowed;font-size:0.65rem;padding:4px 8px;width:auto;">CERRADO</button>`;
    } else if (isOutOfStock) {
      btnHtml = `<button class="btn-add" disabled style="background:var(--ash-gray);opacity:0.3;cursor:not-allowed;font-size:0.65rem;padding:4px 8px;width:auto;">SIN STOCK</button>`;
    } else {
      btnHtml = `<button class="btn-add" onclick="openProductModal(${p.id})">+</button>`;
    }
    
    card.innerHTML = `
      <div class="card-top">
        <div class="card-glow"></div>
        <img src="${p.image}" class="product-image" alt="${p.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🍔</text></svg>';">
        ${p.featured ? '<span class="promo-badge">⭐ Destacada</span>' : ''}
        ${isOutOfStock ? '<div class="stock-out-badge">Agotado</div>' : ''}
      </div>
      <div class="card-body">
        <div class="card-cat">${catLabel(p.cat)}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-foot">
          <span class="card-price">$${priceVal.toLocaleString('es-AR')}</span>
          ${btnHtml}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  
  observeReveal();
}

function catLabel(c) {
  const labels = { hamburgesa: 'Hamburguesa', papas: 'Guarnición', bebidas: 'Bebida', combo: 'Combo' };
  return labels[c] || c;
}

// Categories Filter Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.cat);
  });
});

// Real-time Search Input listener
document.getElementById('searchMenu')?.addEventListener('input', () => {
  const activeTab = document.querySelector('.tab-btn.active');
  renderMenu(activeTab ? activeTab.dataset.cat : 'all');
});

// ===== 5. INTERACTIVE MENU DETAIL MODAL =====
function openProductModal(id) {
  const p = activeMenu.find(x => x.id === id);
  if (!p) return;
  
  currentProduct = p;
  modalQtyVal = 1;
  selectedExtras = [];
  selectedRemove = [];
  
  const actualPrice = p.price || 0;
  
  document.getElementById('modalCat').textContent = catLabel(p.cat);
  
  let extrasHtml = '', removeHtml = '';
  
  if (p.extras && p.extras.length > 0) {
    extrasHtml = `
      <div class="modal-section">
        <div class="modal-section-title">¿Querés agregar adicionales?</div>
        <div class="option-list">
          ${p.extras.map((e, idx) => {
            const name = e.split('+')[0].trim();
            const price = e.includes('+') ? e.split('+$')[1] : '0';
            return `
              <div class="option-item" onclick="toggleModalExtra(${idx})">
                <span class="option-label">${name}</span>
                <div class="option-right-wrap">
                  <span class="option-extra-price">+$${price}</span>
                  <div class="option-check" id="extCheck${idx}"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  if (p.remove && p.remove.length > 0) {
    removeHtml = `
      <div class="modal-section">
        <div class="modal-section-title">¿Querés quitar ingredientes?</div>
        <div class="option-list">
          ${p.remove.map((r, idx) => `
            <div class="option-item" onclick="toggleModalRemove(${idx})">
              <span class="option-label">Sin ${r}</span>
              <div class="option-check" id="remCheck${idx}"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  document.getElementById('modalBody').innerHTML = `
    <div class="modal-image-wrap">
      <img src="${p.image}" class="modal-product-img" alt="${p.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🍔</text></svg>';">
    </div>
    <div class="modal-info">
      <div class="modal-name">${p.name}</div>
      <div class="modal-price-row">
        <span class="modal-price" id="modalPrice">$${actualPrice.toLocaleString('es-AR')}</span>
      </div>
      <div class="modal-desc">${p.desc}</div>
      ${extrasHtml}
      ${removeHtml}
    </div>
  `;
  
  document.getElementById('modalQty').textContent = "1";
  updateModalFooterPrice();
  
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalIfOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

function toggleModalExtra(idx) {
  const index = selectedExtras.indexOf(idx);
  if (index > -1) {
    selectedExtras.splice(index, 1);
  } else {
    selectedExtras.push(idx);
  }
  
  // Re-sync CSS classes and checkmarks
  document.querySelectorAll('[id^="extCheck"]').forEach((el, i) => {
    const isSelected = selectedExtras.includes(i);
    el.closest('.option-item').classList.toggle('selected', isSelected);
    el.textContent = isSelected ? '✓' : '';
  });
  
  updateModalFooterPrice();
}

function toggleModalRemove(idx) {
  const index = selectedRemove.indexOf(idx);
  if (index > -1) {
    selectedRemove.splice(index, 1);
  } else {
    selectedRemove.push(idx);
  }
  
  // Re-sync CSS classes and checkmarks
  document.querySelectorAll('[id^="remCheck"]').forEach((el, i) => {
    const isSelected = selectedRemove.includes(i);
    el.closest('.option-item').classList.toggle('selected', isSelected);
    el.textContent = isSelected ? '✓' : '';
  });
}

function modalQty(d) {
  modalQtyVal = Math.max(1, modalQtyVal + d);
  document.getElementById('modalQty').textContent = modalQtyVal;
  updateModalFooterPrice();
}

function getExtrasSubtotal() {
  if (!currentProduct) return 0;
  return selectedExtras.reduce((sum, idx) => {
    const extraString = currentProduct.extras[idx];
    const match = extraString.match(/\+\$(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);
}

function updateModalFooterPrice() {
  if (!currentProduct) return;
  const basePrice = currentProduct.price || 0;
  const finalSinglePrice = basePrice + getExtrasSubtotal();
  const totalPrice = finalSinglePrice * modalQtyVal;
  document.getElementById('modalBtnPrice').textContent = '$' + totalPrice.toLocaleString('es-AR');
}

function addToCartFromModal() {
  if (!currentProduct) return;
  
  const p = currentProduct;
  const extras = selectedExtras.map(idx => p.extras[idx]);
  const removals = selectedRemove.map(idx => 'Sin ' + p.remove[idx]);
  
  const basePrice = p.price || 0;
  const finalUnitPrice = basePrice + getExtrasSubtotal();
  
  const cartItem = {
    id: Date.now() + Math.random().toString(36).substr(2, 5), // unique dynamic ID
    productId: p.id,
    name: p.name,
    image: p.image,
    price: finalUnitPrice,
    qty: modalQtyVal,
    notes: [...extras.map(e => e.split('+')[0].trim()), ...removals].filter(Boolean)
  };
  
  // Animation: Flying product visual to header cart (Micro-interaction)
  animateFlyToCart();
  
  cart.push(cartItem);
  saveCart();
  renderCart();
  closeModal();
  
  // Play BBQ sizzle synth sound
  playAddSound();
  
  // Expand cart sidebar drawer automatically
  setTimeout(openCart, 500);
}

// Micro-interaction: Flying fly-particle to the cart indicator
function animateFlyToCart() {
  const modalImg = document.querySelector('.modal-product-img');
  const cartBtn = document.querySelector('.btn-cart');
  if (!modalImg || !cartBtn) return;
  
  const startRect = modalImg.getBoundingClientRect();
  const endRect = cartBtn.getBoundingClientRect();
  
  const particle = document.createElement('div');
  particle.className = 'cart-fly-particle';
  particle.innerHTML = '🍔';
  particle.style.left = `${startRect.left + startRect.width/2 - 12}px`;
  particle.style.top = `${startRect.top + startRect.height/2 - 12}px`;
  document.body.appendChild(particle);
  
  // Trigger animation next frame
  requestAnimationFrame(() => {
    particle.style.transform = `translate(${endRect.left - startRect.left}px, ${endRect.top - startRect.top}px) scale(0.3)`;
    particle.style.opacity = '0.3';
  });
  
  // Clear after transition finished
  setTimeout(() => {
    particle.remove();
    // Quick scale bump animation for cart count
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      cartCount.style.transform = 'scale(1.4)';
      setTimeout(() => cartCount.style.transform = 'scale(1)', 250);
    }
  }, 800);
}

// ===== 6. CARTS STATE PERSISTENCE & DRAWER =====
function saveCart() {
  localStorage.setItem('hamburgesas_estilo_cart', JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem('hamburgesas_estilo_cart');
  if (saved) {
    try { cart = JSON.parse(saved); } catch(e) { cart = []; }
  }
  renderCart();
}

function renderCart() {
  const el = document.getElementById('drawerItems');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('drawerTotal');
  const confirmBtn = document.getElementById('btnConfirm');
  
  if (!el) return;
  
  const totalQty = cart.reduce((s, x) => s + x.qty, 0);
  const totalVal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  
  if (countEl) countEl.textContent = totalQty;
  if (totalEl) totalEl.textContent = '$' + totalVal.toLocaleString('es-AR');
  if (confirmBtn && currentCheckoutStep === 1) {
    confirmBtn.disabled = cart.length === 0;
  }
  
  if (cart.length === 0) {
    el.innerHTML = `
      <div class="drawer-empty">
        <div class="big">🍔</div>
        <p>Tu pedido está vacío.<br>¡Agregá tu hamburguesa a tu estilo!</p>
      </div>
    `;
    return;
  }
  
  el.innerHTML = cart.map(item => `
    <div class="drawer-item">
      <div class="drawer-item-img">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🍔</text></svg>';" style="width:100%;height:100%;object-fit:contain;">
      </div>
      <div>
        <div class="drawer-item-name">${item.name}</div>
        ${item.notes.length ? `<div class="drawer-item-extras">${item.notes.join(' · ')}</div>` : ''}
        <div class="drawer-item-controls">
          <button class="qty-btn" onclick="changeCartQty('${item.id}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeCartQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <div style="text-align:right;">
        <div class="drawer-item-price">$${(item.price * item.qty).toLocaleString('es-AR')}</div>
      </div>
    </div>
  `).join('');
}

function changeCartQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }
  saveCart();
  renderCart();
  
  if (cart.length === 0 && currentCheckoutStep !== 1) {
    resetCheckoutSteps(); // Go back to cart list if empty
  }
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
  // If checkout was complete or in progress, reset when closing
  if (currentCheckoutStep === 3) {
    resetCheckoutSteps();
  }
}

function toggleCart() {
  const open = document.getElementById('cartDrawer').classList.contains('open');
  open ? closeCart() : openCart();
}

// ===== 7. STEP-BY-STEP CHECKOUT & RECEIPT ENGINE =====
function resetCheckoutSteps() {
  currentCheckoutStep = 1;
  const drawerHeadTitle = document.querySelector('.drawer-title');
  if (drawerHeadTitle) drawerHeadTitle.textContent = '🛒 Tu Pedido';
  
  const confirmBtn = document.getElementById('btnConfirm');
  if (confirmBtn) {
    confirmBtn.textContent = '💬 Confirmar por WhatsApp';
    confirmBtn.disabled = cart.length === 0;
    confirmBtn.onclick = handleCheckoutNext;
  }
  
  renderCart();
}

function handleCheckoutNext() {
  if (cart.length === 0) return;
  
  if (currentCheckoutStep === 1) {
    // Transition from Cart list to Delivery Form
    currentCheckoutStep = 2;
    document.querySelector('.drawer-title').textContent = '📝 Datos de Entrega';
    
    const itemsEl = document.getElementById('drawerItems');
    itemsEl.innerHTML = `
      <div class="checkout-modal-body">
        <div class="form-group">
          <label for="cName">Tu Nombre *</label>
          <input type="text" id="cName" class="form-input" placeholder="Ej: Alejandro Sosa" required>
        </div>
        <div class="form-group">
          <label for="cMethod">Entrega *</label>
          <select id="cMethod" class="form-select" onchange="toggleAddressField()">
            <option value="delivery">🛵 Envío a Domicilio</option>
            <option value="takeaway">🏬 Retiro por Local</option>
          </select>
        </div>
        <div class="form-group" id="addressGroup">
          <label for="cAddress">Dirección Completa *</label>
          <input type="text" id="cAddress" class="form-input" placeholder="Ej: Av. Rivadavia 4567, Piso 3A">
        </div>
        <div class="form-group">
          <label for="cPayment">Método de Pago *</label>
          <select id="cPayment" class="form-select">
            <option value="transfer">📱 Transferencia (Mercado Pago)</option>
            <option value="cash">💵 Efectivo al recibir</option>
          </select>
        </div>
        <div class="form-group">
          <label for="cNotes">Aclaraciones Adicionales</label>
          <input type="text" id="cNotes" class="form-input" placeholder="Ej: Tocar timbre 4, puerta negra">
        </div>
      </div>
    `;
    
    const confirmBtn = document.getElementById('btnConfirm');
    confirmBtn.textContent = '🔥 Generar Pedido';
    confirmBtn.onclick = processCheckoutSubmit;
    
  }
}

function toggleAddressField() {
  const method = document.getElementById('cMethod').value;
  const addressGroup = document.getElementById('addressGroup');
  const cAddress = document.getElementById('cAddress');
  if (method === 'takeaway') {
    addressGroup.style.display = 'none';
    cAddress.removeAttribute('required');
  } else {
    addressGroup.style.display = 'block';
    cAddress.setAttribute('required', '');
  }
}

function processCheckoutSubmit() {
  const name = document.getElementById('cName').value.trim();
  const method = document.getElementById('cMethod').value;
  const address = document.getElementById('cAddress') ? document.getElementById('cAddress').value.trim() : '';
  const payment = document.getElementById('cPayment').value;
  const notes = document.getElementById('cNotes').value.trim();
  
  if (!name) {
    alert("Por favor, ingresá tu nombre.");
    retu  // Compile checkout data
  currentCheckoutStep = 3;
  const totalVal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const ticketNumber = "ATE-" + Math.floor(1000 + Math.random() * 9000);
  const dateStr = new Date().toLocaleDateString('es-AR') + ' ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  
  const orderDetails = {
    ticket: ticketNumber,
    date: dateStr,
    name: name,
    method: method === 'delivery' ? 'Delivery 🛵' : 'Retiro en Local 🏬',
    address: method === 'delivery' ? address : 'N/A',
    payment: payment === 'transfer' ? 'Transferencia (Mercado Pago)' : 'Efectivo',
    notes: notes || 'Ninguna',
    items: cart.map(i => ({
      name: i.name,
      qty: i.qty,
      price: i.price,
      notes: i.notes
    })),
    total: totalVal,
    status: 'Pendiente'
  };
  
  // Save order to namespaced FirebaseService (cloud or local storage automatically)
  FirebaseService.saveOrder(orderDetails);
  
  // Render animated thermal ticket screen
  document.querySelector('.drawer-title').textContent = '✅ ¡Pedido Generado!';
  
  const itemsEl = document.getElementById('drawerItems');
  itemsEl.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; padding:10px 0;">
      <div class="success-glow-ring">✓</div>
      <p style="text-align:center; font-size:0.9rem; color:var(--text-muted); margin-bottom:20px;">
        Tu pedido ha sido recibido en parrilla. Aquí está tu ticket:
      </p>
      
      <div class="receipt-wrapper">
        <div class="receipt-ticket">
          <div class="receipt-header">
            <div class="receipt-logo">★ A TU ESTILO ★</div>
            <div style="font-size:0.65rem; color:#555; margin-top:2px;">HAMBURGUESERÍA GOURMET</div>
            <div style="font-size:0.6rem; color:#777; margin-top:6px;">TICKET: ${ticketNumber}</div>
            <div style="font-size:0.6rem; color:#777;">FECHA: ${dateStr}</div>
          </div>
          
          <div style="margin-bottom:8px; font-size:0.75rem;">
            <strong>CLIENTE:</strong> ${name}<br>
            <strong>ENTREGA:</strong> ${method === 'delivery' ? 'Domicilio' : 'Retiro'}<br>
            <strong>PAGO:</strong> ${payment === 'transfer' ? 'Transfer' : 'Efectivo'}
            ${method === 'delivery' ? `<br><strong>DIR:</strong> ${address}` : ''}
          </div>
          
          <div class="receipt-divider"></div>
          
          <div style="font-size:0.7rem; margin-bottom:12px;">
            ${cart.map(i => `
              <div class="receipt-line">
                <span>${i.qty}x ${i.name}</span>
                <span>$${(i.price * i.qty).toLocaleString('es-AR')}</span>
              </div>
              ${i.notes.length ? `<div style="font-size:0.62rem; color:#555; margin-left:10px; margin-bottom:4px;">* ${i.notes.join(', ')}</div>` : ''}
            `).join('')}
          </div>
          
          <div class="receipt-divider"></div>
          
          <div class="receipt-total-row">
            <span>TOTAL DE COMPRA</span>
            <span>$${totalVal.toLocaleString('es-AR')}</span>
          </div>
          
          <div style="text-align:center; margin-top:22px; font-size:0.65rem; font-weight:bold; border-top:1px dashed #bbb; padding-top:10px;">
            ¡A TU ESTILO O NADA! 🔥
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Update footer button to trigger WhatsApp sending
  const confirmBtn = document.getElementById('btnConfirm');
  confirmBtn.textContent = '📲 Enviar a WhatsApp';
  confirmBtn.disabled = false;
  confirmBtn.onclick = () => {
    sendWhatsAppFinal(orderDetails);
  };
}

function sendWhatsAppFinal(order) {
  let msg = '🍔 *★ HAMBURGUESAS A TU ESTILO ★* 🔥\n';
  msg += '¡Hola! Quiero confirmar mi pedido gourmet:\n\n';
  
  msg += `🎫 *Ticket:* #${order.ticket}\n`;
  msg += `👤 *Cliente:* ${order.name}\n`;
  msg += `🛵 *Entrega:* ${order.method}\n`;
  if (order.address !== 'N/A') msg += `📍 *Dirección:* ${order.address}\n`;
  msg += `💳 *Pago:* ${order.payment}\n`;
  msg += `📝 *Aclaración:* _${order.notes}_\n\n`;
  
  msg += '🛒 *Detalle del Pedido:*\n';
  order.items.forEach(i => {
    msg += `• *${i.qty}x* ${i.name} — $${(i.price * i.qty).toLocaleString('es-AR')}\n`;
    if (i.notes && i.notes.length) {
      msg += `  _( ${i.notes.join(', ')} )_\n`;
    }
  });
  
  msg += `\n💰 *Total a abonar: $${order.total.toLocaleString('es-AR')}*\n\n`;
  msg += '¡Quedo a la espera de las brasas! 🔥🍔';
  
  const encoded = encodeURIComponent(msg);
  const waPhone = storeConfig.whatsapp || "5491137410000";
  window.open(`https://wa.me/${waPhone}?text=${encoded}`, '_blank');
  
  // Clear cart after sending order
  cart = [];
  saveCart();
  resetCheckoutSteps();
  closeCart();
}

// ===== 8. SMOOTH LOGICAL LISTENERS & SCROLL REVEALS =====
function observeReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
      }
    });
  }, { threshold: 0.08 });
  
  document.querySelectorAll('.reveal:not(.vis)').forEach(el => observer.observe(el));
}

// Scrolling Navbar effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Parallax 3D Card Hover effect in Hero Section
const heroVisual = document.querySelector('.hero-visual-inner');
if (heroVisual) {
  heroVisual.addEventListener('mousemove', (e) => {
    heroVisual.classList.remove('floating'); // Stop automatic floating when manual hover
    const rect = heroVisual.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    
    // Rotate card according to cursor coordinates
    heroVisual.style.transform = `rotateY(${x / 14}deg) rotateX(${-y / 14}deg)`;
  });
  
  heroVisual.addEventListener('mouseleave', () => {
    heroVisual.style.transform = 'rotateY(0) rotateX(0)';
    heroVisual.classList.add('floating'); // Restart floating
  });
}

// ===== 9. ADMIN LIVE SYNC & REALTIME DATABASE LOADER =====
async function loadCloudDataAndInit() {
  // 1. Cargar Configuración General
  try {
    const config = await FirebaseService.getConfig();
    if (config) {
      storeConfig = config;
    } else {
      if (!FirebaseService.isCloudActive()) {
        localStorage.setItem("ate_config", JSON.stringify(storeConfig));
      }
    }
  } catch (e) {
    console.error("Error al obtener la configuración:", e);
  }
  
  // 2. Cargar Productos y Stock
  try {
    const products = await FirebaseService.getProducts();
    if (products && products.length > 0) {
      activeMenu = products;
    } else {
      activeMenu = [...menu];
      if (!FirebaseService.isCloudActive()) {
        localStorage.setItem("ate_products", JSON.stringify(menu));
      }
    }
  } catch (e) {
    console.error("Error al obtener los productos:", e);
    activeMenu = [...menu];
  }
  
  // 3. Renderizar Vista
  renderMenu();
  loadPromos();
  updateStatusBadge();
}

function updateStatusBadge() {
  const badge = document.getElementById('navStatus');
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  if (!badge || !dot || !text) return;
  
  if (storeConfig.isOpen) {
    badge.classList.remove('closed');
    dot.classList.remove('closed');
    text.classList.remove('closed');
    text.textContent = "Abierto";
  } else {
    badge.classList.add('closed');
    dot.classList.add('closed');
    text.classList.add('closed');
    text.textContent = "Cerrado";
  }
}

async function loadPromos() {
  const promosGrid = document.getElementById('promosGrid');
  if (!promosGrid) return;
  
  try {
    const list = await FirebaseService.getPromos();
    const activePromos = (list && list.length > 0) ? list : window.initialPromos;
    if (activePromos && activePromos.length > 0) {
      promosGrid.innerHTML = activePromos.map((pr, i) => `
        <div class="promo-card reveal" style="transition-delay:${i * 0.1}s">
          <div class="promo-icon-wrap">${pr.icon || '🎁'}</div>
          <div class="promo-icon">${pr.icon || '🎁'}</div>
          <div class="promo-tag">${pr.cond || 'Promo'}</div>
          <div class="promo-name">${pr.name}</div>
          <div class="promo-desc">${pr.desc}</div>
        </div>
      `).join('');
      observeReveal();
    }
  } catch (e) {
    console.error("Error loading promos:", e);
  }
}

// Escuchar cambios desde otras pestañas (sincronización instantánea de stock/horarios/config)
window.addEventListener('storage', (e) => {
  if (e.key === 'ate_stock_sync_trigger' || e.key === 'ate_config_sync_trigger' || e.key === 'ate_status_sync_trigger') {
    loadCloudDataAndInit();
  }
});

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  loadCloudDataAndInit();
  resetCheckoutSteps();
});
