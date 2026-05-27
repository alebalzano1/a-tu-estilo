/* ==========================================================================
   FRONTEND LOGIC: Hamburguesas A Tu Estilo (Vicio-Style Premium)
   Features: Cart state, horizontal cards layout, sticky tabs scroll system,
             ingredients customizer drawer, cross-sell, interactive thermal ticket,
             and full Firebase/Cloud Sync integration.
   ========================================================================== */

// ===== 1. CORE MENU DATABASE (Fallback & Local Seed Reference) =====
const menu = [
  {
    id: 1,
    cat: 'hamburgesa',
    emoji: '🍔',
    name: 'La Capitana',
    desc: 'Doble carne smashed angus, queso cheddar blanco fundido, cebolla caramelizada al bourbon y huevo de campo frito.',
    price: 7500,
    featured: true,
    image: 'assets/capitana.png',
    extras: ['Bacon ahumado extra +$800', 'Doble queso cheddar +$500', 'Huevo de campo extra +$400'],
    remove: ['Cebolla caramelizada', 'Queso cheddar', 'Huevo frito'],
    available: true
  },
  {
    id: 2,
    cat: 'hamburgesa',
    emoji: '🖤',
    name: 'La Oscura',
    desc: 'Exclusivo pan brioche negro de carbón activado, doble medallón angus, cheddar premium y salsa secreta ahumada.',
    price: 7000,
    featured: true,
    image: 'assets/oscura.png',
    extras: ['Bacon ahumado extra +$800', 'Pepinillos agridulces +$300', 'Doble queso cheddar +$500'],
    remove: ['Cheddar fundido', 'Salsa especial'],
    available: true
  },
  {
    id: 3,
    cat: 'hamburgesa',
    emoji: '🥓',
    name: 'BBQ Bacon Craft',
    desc: 'Carne angus seleccionada, bacon crocante glaseado en miel, aros de cebolla crujientes y salsa barbacoa de la casa.',
    price: 7800,
    featured: false,
    image: 'assets/bbq_bacon.png',
    extras: ['Doble bacon ahumado +$900', 'Jalapeños encurtidos +$400', 'Doble carne smashed +$1200'],
    remove: ['Aros de cebolla', 'Bacon crujiente', 'Salsa BBQ'],
    available: true
  },
  {
    id: 4,
    cat: 'hamburgesa',
    emoji: '🌶️',
    name: 'La Infernal',
    desc: 'Doble carne smashed angus, jalapeños encurtidos, cheddar fundido, cebolla crujiente y salsa de chiles ahumados.',
    price: 7200,
    featured: false,
    image: 'assets/infernal.png',
    extras: ['Más jalapeños picantes +$350', 'Doble queso cheddar +$500', 'Doble carne smashed +$1200'],
    remove: ['Jalapeños', 'Cebolla crujiente', 'Salsa picante'],
    available: true
  },
  {
    id: 5,
    cat: 'papas',
    emoji: '🍟',
    name: 'Papas Rústicas',
    desc: 'Papas fritas con corte rústico artesanal, sal marina de la patagonia y hojas de romero fresco.',
    price: 2800,
    sizes: { chica: 2800, grande: 3800 },
    featured: false,
    image: 'assets/papas_clasicas.png',
    extras: ['Cheddar fundido cremoso +$600', 'Bacon ahumado picado +$700'],
    remove: [],
    available: true
  },
  {
    id: 6,
    cat: 'papas',
    emoji: '🧀',
    name: 'Papas Cheddar & Bacon',
    desc: 'Nuestras papas rústicas bañadas en una cremosa salsa de queso cheddar casera y lluvia de bacon crujiente.',
    price: 3600,
    sizes: { chica: 3600, grande: 4600 },
    featured: false,
    image: 'assets/papas_cheddar.png',
    extras: ['Doble porción bacon +$700', 'Jalapeños en rodajas +$400'],
    remove: [],
    available: true
  },
  {
    id: 7,
    cat: 'bebidas',
    emoji: '🍋',
    name: 'Limonada de Menta',
    desc: 'Limonada natural exprimida al momento, macerada con menta fresca, jengibre y hielo triturado.',
    price: 1800,
    sub: '500cc - Natural',
    featured: false,
    image: 'assets/limonada.png',
    extras: ['Endulzar con miel +$200'],
    remove: ['Menta', 'Jengibre'],
    available: true
  },
  {
    id: 10,
    cat: 'bebidas',
    emoji: '🥤',
    name: 'Coca-Cola Helada',
    desc: 'Lata de 354cc helada de sabor original.',
    price: 1500,
    sub: '354cc - Lata',
    featured: false,
    image: '',
    extras: [],
    remove: [],
    available: true
  },
  {
    id: 11,
    cat: 'dips',
    emoji: '🥣',
    name: 'Dip Alioli Ahumado',
    desc: 'Nuestra deliciosa mayonesa casera con ajo asado y pimentón ahumado.',
    price: 1200,
    featured: false,
    image: '',
    extras: [],
    remove: [],
    available: true
  },
  {
    id: 12,
    cat: 'dips',
    emoji: '🥣',
    name: 'Dip Barbacoa de la Casa',
    desc: 'Salsa barbacoa artesanal caramelizada.',
    price: 1200,
    featured: false,
    image: '',
    extras: [],
    remove: [],
    available: true
  },
  {
    id: 13,
    cat: 'dips',
    emoji: '🥣',
    name: 'Dip Queso Azul',
    desc: 'Crema suave de queso azul y hierbas frescas.',
    price: 1500,
    featured: false,
    image: '',
    extras: [],
    remove: [],
    available: true
  },
  {
    id: 8,
    cat: 'combo',
    emoji: '🍔🍟🥤',
    name: 'Combo Full Craft',
    desc: 'Cualquier hamburguesa premium a elección de la carta + papas rústicas medianas + bebida a elección.',
    price: 10500,
    featured: false,
    image: 'assets/combo_gourmet.png',
    extras: ['Agrandar papas a cheddar +$500', 'Sumar un dip gourmet +$300'],
    remove: [],
    available: true
  },
  {
    id: 9,
    cat: 'combo',
    emoji: '🍔🍔🍟',
    name: 'Combo Dúo Brutal',
    desc: 'Dos hamburguesas premium clásicas a elección + porción extra grande de papas rústicas para compartir.',
    price: 16000,
    featured: false,
    image: 'assets/capitana.png',
    extras: ['Agrandar papas a cheddar +$800'],
    remove: [],
    available: true
  }
];

// ===== 2. STATE MANAGER =====
let cart = [];
let baseProduct = null;
let selectedExtras = [];
let removedIngredients = [];
let selectedCrossSells = [];
let currentCheckoutStep = 1;
let isScrollingClick = false;
let scrollTimeout = null;

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
let horarios = [];
let promos = [];

// ===== 3. PAPAS SIZE SECTOR STATE =====
let selectedPapasSizes = {
  5: 'chica',
  6: 'chica'
};

function setPapasSize(productId, size) {
  selectedPapasSizes[productId] = size;

  // Buscar la card correspondiente
  const card = document.querySelector(`.product-vicio-card[data-id="${productId}"]`);
  if (card) {
    const product = activeMenu.find(p => p.id === productId);
    const price = product.sizes[size];

    // Actualizar precio visual de la card
    card.querySelector('.vicio-price').textContent = `$${price.toLocaleString('es-AR')}`;

    // Actualizar estado activo de las pills
    card.querySelectorAll('.size-pill').forEach(pill => {
      if (pill.dataset.size === size) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }
}

// ===== 4. RENDER CATALOG (VICIO LAYOUT) =====
function renderProducts() {
  const hamburgesasContainer = document.getElementById('hamburgesasList');
  const papasContainer = document.getElementById('papasList');
  const bebidasContainer = document.getElementById('bebidasGrid');
  const dipsContainer = document.getElementById('dipsList');
  const combosContainer = document.getElementById('combosList');

  if (hamburgesasContainer) hamburgesasContainer.innerHTML = '';
  if (papasContainer) papasContainer.innerHTML = '';
  if (bebidasContainer) bebidasContainer.innerHTML = '';
  if (dipsContainer) dipsContainer.innerHTML = '';
  if (combosContainer) combosContainer.innerHTML = '';

  const isStoreClosed = !storeConfig.isOpen;

  activeMenu.forEach(p => {
    if (p.available === false) return;

    if (p.cat === 'hamburgesa') {
      // Render Hamburguesa (Layout Horizontal)
      const card = document.createElement('div');
      card.className = 'product-vicio-card';
      card.dataset.id = p.id;
      
      const imgPath = p.image || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🍔</text></svg>';
      
      card.innerHTML = `
        <div class="vicio-img-wrap product-img-wrap">
            <img src="${imgPath}" alt="${p.name}" onload="this.closest('.product-img-wrap').classList.add('loaded')" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🍔</text></svg>';this.closest('.product-img-wrap').classList.add('loaded')">
            ${p.featured ? `<span class="vicio-badge-triple">HIT</span>` : ''}
        </div>
        <div class="vicio-info-wrap">
            <div>
                <h4 class="vicio-name">${p.name}</h4>
                <p class="vicio-desc">${p.desc}</p>
            </div>
            <div class="vicio-footer">
                <span class="vicio-price">$${p.price.toLocaleString('es-AR')}</span>
                <button class="vicio-btn-add" aria-label="Personalizar e integrar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
        </div>
      `;
      card.addEventListener('click', () => {
        if (!isStoreClosed) openModal(p);
      });
      card.querySelector('.vicio-btn-add').addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isStoreClosed) openModal(p);
      });
      if (hamburgesasContainer) hamburgesasContainer.appendChild(card);
    }
    else if (p.cat === 'papas') {
      // Render Papas (Layout Horizontal con selector de tamaño)
      const card = document.createElement('div');
      card.className = 'product-vicio-card';
      card.dataset.id = p.id;
      const size = selectedPapasSizes[p.id] || 'chica';
      const currentPrice = p.sizes ? p.sizes[size] : p.price;

      const imgPath = p.image || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🍟</text></svg>';

      card.innerHTML = `
        <div class="vicio-img-wrap product-img-wrap">
            <img src="${imgPath}" alt="${p.name}" onload="this.closest('.product-img-wrap').classList.add('loaded')" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🍟</text></svg>';this.closest('.product-img-wrap').classList.add('loaded')">
        </div>
        <div class="vicio-info-wrap">
            <div>
                <h4 class="vicio-name">${p.name}</h4>
                <p class="vicio-desc">${p.desc}</p>
                <div class="papas-size-selector" onclick="event.stopPropagation()">
                    <button class="size-pill ${size === 'chica' ? 'active' : ''}" data-size="chica" onclick="setPapasSize(${p.id}, 'chica')">Chica $${(p.sizes ? p.sizes.chica : p.price).toLocaleString('es-AR')}</button>
                    <button class="size-pill ${size === 'grande' ? 'active' : ''}" data-size="grande" onclick="setPapasSize(${p.id}, 'grande')">Grande $${(p.sizes ? p.sizes.grande : p.price + 1000).toLocaleString('es-AR')}</button>
                </div>
            </div>
            <div class="vicio-footer">
                <span class="vicio-price">$${currentPrice.toLocaleString('es-AR')}</span>
                <button class="vicio-btn-add" aria-label="Agregar al carrito">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
        </div>
      `;
      card.addEventListener('click', () => {
        if (!isStoreClosed) openModal(p);
      });
      card.querySelector('.vicio-btn-add').addEventListener('click', (e) => {
        e.stopPropagation();
        if (isStoreClosed) return;
        const chosenSize = selectedPapasSizes[p.id] || 'chica';
        const price = p.sizes ? p.sizes[chosenSize] : p.price;
        const modifiedProduct = {
          ...p,
          id: `${p.id}-${chosenSize}`, // ID único en carrito
          originalId: p.id,
          name: `${p.name} (${chosenSize.charAt(0).toUpperCase() + chosenSize.slice(1)})`,
          price: price,
          sub: chosenSize === 'chica' ? 'Porción Chica' : 'Porción Grande'
        };
        addToCart(modifiedProduct, e.currentTarget);
      });
      if (papasContainer) papasContainer.appendChild(card);
    }
    else if (p.cat === 'bebidas') {
      // Render Bebidas (Grilla de 2 Columnas)
      const card = document.createElement('div');
      card.className = 'bebida-vicio-card';
      
      card.innerHTML = `
        <div class="bebida-icon">${p.emoji || '🥤'}</div>
        <h4 class="bebida-name">${p.name}</h4>
        <span class="bebida-size">${p.sub || '500cc'}</span>
        <div class="bebida-footer">
            <span class="vicio-price">$${p.price.toLocaleString('es-AR')}</span>
            <button class="vicio-btn-add" aria-label="Agregar al carrito">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
        </div>
      `;
      card.addEventListener('click', () => {
        if (!isStoreClosed) openModal(p);
      });
      card.querySelector('.vicio-btn-add').addEventListener('click', (e) => {
        e.stopPropagation();
        if (isStoreClosed) return;
        addToCart(p, e.currentTarget);
      });
      if (bebidasContainer) bebidasContainer.appendChild(card);
    }
    else if (p.cat === 'dips') {
      // Render Dips (Lista Simple)
      const card = document.createElement('div');
      card.className = 'dip-vicio-card product-vicio-card';
      card.dataset.id = p.id;
      card.innerHTML = `
        <div class="dip-icon-wrap">${p.emoji || '🥣'}</div>
        <div class="dip-info">
            <h4 class="dip-name">${p.name}</h4>
            <p class="vicio-desc" style="margin-bottom:0;">${p.desc}</p>
        </div>
        <div class="vicio-footer" style="margin-top:0; border-top:none; padding-top:0; flex-shrink:0; gap:12px;">
            <span class="vicio-price">$${p.price.toLocaleString('es-AR')}</span>
            <button class="vicio-btn-add" aria-label="Agregar al carrito">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
        </div>
      `;
      card.addEventListener('click', () => {
        if (!isStoreClosed) openModal(p);
      });
      card.querySelector('.vicio-btn-add').addEventListener('click', (e) => {
        e.stopPropagation();
        if (isStoreClosed) return;
        addToCart(p, e.currentTarget);
      });
      if (dipsContainer) dipsContainer.appendChild(card);
    }
    else if (p.cat === 'combo') {
      // Render Combo (Layout Horizontal)
      const card = document.createElement('div');
      card.className = 'product-vicio-card';
      card.dataset.id = p.id;
      
      const imgPath = p.image || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>📦</text></svg>';
      
      card.innerHTML = `
        <div class="vicio-img-wrap product-img-wrap">
            <img src="${imgPath}" alt="${p.name}" onload="this.closest('.product-img-wrap').classList.add('loaded')" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>📦</text></svg>';this.closest('.product-img-wrap').classList.add('loaded')">
            <span class="vicio-badge-triple">COMBO</span>
        </div>
        <div class="vicio-info-wrap">
            <div>
                <h4 class="vicio-name">${p.name}</h4>
                <p class="vicio-desc">${p.desc}</p>
            </div>
            <div class="vicio-footer">
                <span class="vicio-price">$${p.price.toLocaleString('es-AR')}</span>
                <button class="vicio-btn-add" aria-label="Personalizar combo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
        </div>
      `;
      card.addEventListener('click', () => {
        if (!isStoreClosed) openModal(p);
      });
      card.querySelector('.vicio-btn-add').addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isStoreClosed) openModal(p);
      });
      if (combosContainer) combosContainer.appendChild(card);
    }
  });

  setTimeout(updateActiveTabOnScroll, 100);
}

// ===== 5. SHOPPING CART STATE ENGINE =====
function animateVicioPop(btn) {
  if (!btn) return;
  btn.classList.remove('vicio-pop-anim');
  void btn.offsetWidth; // Force Reflow
  btn.classList.add('vicio-pop-anim');
}

function animateCartBtnBump() {
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.classList.remove('bump');
    void cartBtn.offsetWidth;
    cartBtn.classList.add('bump');
  }
}

function animateCountPop() {
  const countEl = document.getElementById('cartCount');
  if (countEl && !countEl.classList.contains('hidden')) {
    countEl.classList.remove('pop');
    void countEl.offsetWidth;
    countEl.classList.add('pop');
  }
}

function addToCart(p, btn) {
  const ex = cart.find(i => i.id === p.id);
  if (ex) {
    ex.qty++;
  } else {
    cart.push({
      ...p,
      qty: 1,
      note: '',
      extras: p.extras || [],
      removals: p.removals || []
    });
  }

  updateCartUI();

  if (btn) {
    animateVicioPop(btn);
  }
  animateCartBtnBump();
  animateCountPop();
}

function removeFromCart(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  if (item.qty > 1) {
    item.qty--;
  } else {
    cart = cart.filter(i => i.id !== id);
  }
  updateCartUI();
  animateCartBtnBump();
  animateCountPop();
}

function updateItemNote(itemId, value) {
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.note = value;
  }
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  // Original cart indicator badge
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = count;
    countEl.classList.toggle('hidden', count === 0);
  }

  const totalEl = document.getElementById('cartTotal');
  if (totalEl) {
    totalEl.textContent = '$' + total.toLocaleString('es-AR');
  }

  // Premium Vicio Floating Cart Bar down-center
  const floatingCart = document.getElementById('floatingCart');
  const floatingQty = document.getElementById('floatingQty');
  const floatingTotal = document.getElementById('floatingTotal');
  const cartBtn = document.getElementById('cartBtn');

  if (floatingCart && floatingQty && floatingTotal) {
    if (count > 0) {
      floatingQty.textContent = count;
      floatingTotal.textContent = `$${total.toLocaleString('es-AR')}`;
      floatingCart.classList.add('visible');
      document.body.classList.add('has-sticky-banner');
      if (cartBtn) {
        cartBtn.style.transform = 'translateY(-64px)';
      }
    } else {
      floatingCart.classList.remove('visible');
      document.body.classList.remove('has-sticky-banner');
      if (cartBtn) {
        cartBtn.style.transform = '';
      }
    }
  }

  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  
  if (itemsEl) {
    itemsEl.innerHTML = '';
    if (!cart.length) {
      if (emptyEl) {
        itemsEl.appendChild(emptyEl);
        emptyEl.style.display = '';
      }
      validateCheckoutForm();
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';

    cart.forEach(item => {
      let subText = item.sub || catLabel(item.cat);
      if (item.extras && item.extras.length > 0) {
        subText += '<br><span class="cart-customization-plus">➕ ' + item.extras.map(e => e.name || e).join(', ') + '</span>';
      }
      if (item.removals && item.removals.length > 0) {
        subText += '<br><span class="cart-customization-minus"> Sin ' + item.removals.map(r => r.replace('Sin ', '')).join(', ') + '</span>';
      }

      const div = document.createElement('div');
      div.className = 'cart-item';
      const imgPath = item.image || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🍔</text></svg>';
      
      div.innerHTML = `
        <img src="${imgPath}" alt="${item.name}" class="cart-item-img" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🍔</text></svg>';">
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-sub">${subText}</div>
            <div class="cart-item-qty">
                <button class="qty-btn" data-action="remove">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" data-action="add">+</button>
            </div>
            <input type="text" class="cart-item-note" placeholder="Ej: sin pickles, sin cebolla..." value="${item.note || ''}" oninput="updateItemNote('${item.id}', this.value)">
        </div>
        <div class="cart-item-price">$${(item.price * item.qty).toLocaleString('es-AR')}</div>
      `;
      div.querySelector('[data-action="remove"]').onclick = () => removeFromCart(item.id);
      div.querySelector('[data-action="add"]').onclick = () => {
        item.qty++;
        updateCartUI();
        animateCartBtnBump();
        animateCountPop();
      };
      itemsEl.appendChild(div);
    });
  }
  validateCheckoutForm();
}

function catLabel(c) {
  const labels = { hamburgesa: 'Hamburguesa', papas: 'Guarnición', bebidas: 'Bebida', combo: 'Combo', dips: 'Dip' };
  return labels[c] || c;
}

function saveCart() {
  localStorage.setItem('ate_style_cart', JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem('ate_style_cart');
  if (saved) {
    try { cart = JSON.parse(saved); } catch (e) { cart = []; }
  }
  updateCartUI();
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
  if (currentCheckoutStep === 3) {
    resetCheckoutSteps();
  }
}

document.getElementById('cartBtn').onclick = openCart;
document.getElementById('cartClose').onclick = closeCart;
document.getElementById('cartOverlay').onclick = closeCart;

// ===== 6. STEP-BY-STEP CHECKOUT & WhatsApp TICKET GENERATOR =====
function resetCheckoutSteps() {
  currentCheckoutStep = 1;
  const drawerHeadTitle = document.querySelector('.cart-header h3');
  if (drawerHeadTitle) drawerHeadTitle.textContent = 'Tu Pedido';

  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) checkoutForm.innerHTML = '';

  const confirmBtn = document.getElementById('btnCheckout');
  if (confirmBtn) {
    confirmBtn.textContent = '💬 Confirmar Pedido';
    confirmBtn.disabled = cart.length === 0;
    confirmBtn.onclick = handleCheckoutNext;
  }

  updateCartUI();
}

function handleCheckoutNext() {
  if (cart.length === 0) return;

  if (currentCheckoutStep === 1) {
    currentCheckoutStep = 2;
    const drawerHeadTitle = document.querySelector('.cart-header h3');
    if (drawerHeadTitle) drawerHeadTitle.textContent = 'Datos de Entrega';

    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.innerHTML = `
      <div class="form-group">
          <label for="formName">Nombre completo *</label>
          <input type="text" id="formName" class="form-input" placeholder="Ej: Juan Pérez" required oninput="validateCheckoutForm()">
      </div>
      <div class="form-group">
          <label for="formMethod">Método de entrega *</label>
          <select id="formMethod" class="form-select" onchange="toggleAddressField(); validateCheckoutForm();">
              <option value="delivery">🛵 Envío a domicilio</option>
              <option value="takeaway">🏬 Retirar por local</option>
          </select>
      </div>
      <div class="form-group" id="addressGroup">
          <label for="formAddress">Dirección de envío *</label>
          <input type="text" id="formAddress" class="form-input" placeholder="Ej: Av. del Libertador 1500, Vicente López" required oninput="validateCheckoutForm()">
      </div>
      <div class="form-group">
          <label for="formRefs">Referencias / Piso / Depto</label>
          <input type="text" id="formRefs" class="form-input" placeholder="Ej: Piso 3A, reja negra">
      </div>
      <div class="form-group">
          <label for="formPayment">Medio de pago *</label>
          <select id="formPayment" class="form-select">
              <option value="transfer">📱 Transferencia / Mercado Pago</option>
              <option value="cash">💵 Efectivo</option>
          </select>
      </div>
    `;

    const confirmBtn = document.getElementById('btnCheckout');
    confirmBtn.textContent = '🔥 Generar Ticket';
    confirmBtn.onclick = processCheckoutSubmit;
    validateCheckoutForm();
  }
}

function toggleAddressField() {
  const method = document.getElementById('formMethod').value;
  const addressGroup = document.getElementById('addressGroup');
  const addressInput = document.getElementById('formAddress');
  if (method === 'takeaway') {
    if (addressGroup) addressGroup.style.display = 'none';
    if (addressInput) addressInput.removeAttribute('required');
  } else {
    if (addressGroup) addressGroup.style.display = 'block';
    if (addressInput) addressInput.setAttribute('required', '');
  }
}

function processCheckoutSubmit() {
  const name = document.getElementById('formName').value.trim();
  const method = document.getElementById('formMethod').value;
  const address = document.getElementById('formAddress') ? document.getElementById('formAddress').value.trim() : '';
  const refs = document.getElementById('formRefs').value.trim() || '—';
  const payment = document.getElementById('formPayment').value;

  if (!name) {
    alert("Por favor, ingresá tu nombre.");
    return;
  }
  if (method === 'delivery' && !address) {
    alert("Por favor, ingresá tu dirección de envío.");
    return;
  }

  currentCheckoutStep = 3;
  const totalVal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const ticketNumber = "ATE-" + Math.floor(1000 + Math.random() * 9000);
  const dateStr = new Date().toLocaleDateString('es-AR') + ' ' + new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  const orderDetails = {
    ticket: ticketNumber,
    date: dateStr,
    name: name,
    method: method === 'delivery' ? 'Domicilio 🛵' : 'Retiro por local 🏬',
    address: method === 'delivery' ? address : 'N/A',
    refs: refs,
    payment: payment === 'transfer' ? 'Transferencia / Mercado Pago' : 'Efectivo',
    items: cart.map(i => ({
      name: i.name,
      qty: i.qty,
      price: i.price,
      sub: i.sub || catLabel(i.cat),
      extras: i.extras || [],
      removals: i.removals || [],
      note: i.note || ''
    })),
    total: totalVal
  };

  // Sync to database
  FirebaseService.saveOrder(orderDetails);

  // Render animated thermal ticket screen
  const drawerHeadTitle = document.querySelector('.cart-header h3');
  if (drawerHeadTitle) drawerHeadTitle.textContent = '¡Pedido Generado!';

  const itemsEl = document.getElementById('cartItems');
  itemsEl.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; padding:10px 0;">
      <div class="success-glow-ring">✓</div>
      <p style="text-align:center; font-size:0.9rem; color:rgba(242,242,242,0.5); margin-bottom:20px;">
        Tu pedido ha sido enviado a la parrilla. Aquí está tu ticket:
      </p>
      
      <div class="receipt-wrapper">
        <div class="receipt-ticket">
          <div class="receipt-header">
            <div class="receipt-logo">★ A TU ESTILO ★</div>
            <div style="font-size:0.65rem; color:#555; margin-top:2px; font-weight:bold;">HAMBURGUESERÍA GOURMET</div>
            <div style="font-size:0.6rem; color:#777; margin-top:6px;">TICKET: #${ticketNumber}</div>
            <div style="font-size:0.6rem; color:#777;">FECHA: ${dateStr}</div>
          </div>
          
          <div style="margin-bottom:8px; font-size:0.75rem; color:#111;">
            <strong>CLIENTE:</strong> ${name}<br>
            <strong>ENTREGA:</strong> ${method === 'delivery' ? 'Domicilio' : 'Retiro'}<br>
            <strong>PAGO:</strong> ${payment === 'transfer' ? 'Transfer' : 'Efectivo'}
            ${method === 'delivery' ? `<br><strong>DIR:</strong> ${address}` : ''}
            ${refs !== '—' ? `<br><strong>REF:</strong> ${refs}` : ''}
          </div>
          
          <div class="receipt-divider"></div>
          
          <div style="font-size:0.7rem; color:#111; margin-bottom:12px;">
            ${cart.map(i => {
              let customizationsText = '';
              if (i.extras && i.extras.length > 0) {
                customizationsText += i.extras.map(e => `+${e.name || e}`).join(' ');
              }
              if (i.removals && i.removals.length > 0) {
                customizationsText += ' ' + i.removals.map(r => `-${r.replace('Sin ', '')}`).join(' ');
              }
              if (i.note) {
                customizationsText += ` [Nota: ${i.note}]`;
              }
              return `
                <div class="receipt-line">
                  <span>${i.qty}x ${i.name}</span>
                  <span>$${(i.price * i.qty).toLocaleString('es-AR')}</span>
                </div>
                ${customizationsText ? `<div style="font-size:0.62rem; color:#666; margin-left:10px; margin-bottom:4px; font-style:italic;">${customizationsText}</div>` : ''}
              `;
            }).join('')}
          </div>
          
          <div class="receipt-divider"></div>
          
          <div class="receipt-total-row">
            <span>TOTAL A PAGAR</span>
            <span>$${totalVal.toLocaleString('es-AR')}</span>
          </div>
          
          <div style="text-align:center; margin-top:22px; font-size:0.65rem; font-weight:bold; border-top:1px dashed #bbb; padding-top:10px; color:#111;">
            ¡A TU ESTILO O NADA! 🔥🍔
          </div>
        </div>
      </div>
    </div>
  `;

  const confirmBtn = document.getElementById('btnCheckout');
  confirmBtn.textContent = '📲 Enviar a WhatsApp';
  confirmBtn.disabled = false;
  confirmBtn.onclick = () => {
    sendWhatsAppOrder(orderDetails);
  };
}

function sendWhatsAppOrder(order) {
  let msg = '🍔 *★ HAMBURGUESAS A TU ESTILO ★* 🔥\n';
  msg += '¡Hola! Quiero confirmar mi pedido gourmet:\n\n';

  msg += `🎫 *Ticket:* #${order.ticket}\n`;
  msg += `👤 *Cliente:* ${order.name}\n`;
  msg += `🛵 *Entrega:* ${order.method}\n`;
  if (order.address !== 'N/A') msg += `📍 *Dirección:* ${order.address}\n`;
  if (order.refs !== '—') msg += `📝 *Referencias:* _${order.refs}_\n`;
  msg += `💳 *Pago:* ${order.payment}\n\n`;

  msg += '🛒 *Detalle del Pedido:*\n';
  order.items.forEach(i => {
    msg += `• *${i.qty}x* ${i.name} — $${(i.price * i.qty).toLocaleString('es-AR')}\n`;
    let detailParts = [];
    if (i.extras && i.extras.length > 0) {
      detailParts.push('➕ ' + i.extras.map(e => e.name || e).join(', '));
    }
    if (i.removals && i.removals.length > 0) {
      detailParts.push(' Sin ' + i.removals.map(r => r.replace('Sin ', '')).join(', '));
    }
    if (i.note) {
      detailParts.push('📝 ' + i.note);
    }
    if (detailParts.length > 0) {
      msg += `  _( ${detailParts.join(' · ')} )_\n`;
    }
  });

  msg += `\n💰 *Total a abonar: $${order.total.toLocaleString('es-AR')}*\n\n`;
  msg += '¡Quedo a la espera de las brasas! 🔥🍔';

  const cleanPhone = storeConfig.whatsapp.replace(/\D/g, '');
  window.open(`https://wa.me/${cleanPhone}?text=` + encodeURIComponent(msg), '_blank');

  // Clear Cart
  cart = [];
  saveCart();
  resetCheckoutSteps();
  closeCart();
}

function isStoreOpen(date) {
  const dayNum = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const currentMins = hours * 60 + minutes;

  const dayConfig = horarios.find(h => h.day === dayNum);
  if (dayConfig && dayConfig.open) {
    const slots = dayConfig.slots || "20:00 - 23:30";
    const [startStr, endStr] = slots.split(' - ');
    if (startStr && endStr) {
      const [startH, startM] = startStr.split(':').map(Number);
      const [endH, endM] = endStr.split(':').map(Number);
      
      const startMins = startH * 60 + startM;
      let endMins = endH * 60 + endM;

      if (endMins < startMins) {
        if (currentMins >= startMins) return true;
      } else {
        if (currentMins >= startMins && currentMins < endMins) return true;
      }
    }
  }

  // Check previous day midnights
  const prevDayNum = (dayNum + 6) % 7;
  const prevDayConfig = horarios.find(h => h.day === prevDayNum);
  if (prevDayConfig && prevDayConfig.open) {
    const slots = prevDayConfig.slots || "20:00 - 23:30";
    const [startStr, endStr] = slots.split(' - ');
    if (startStr && endStr) {
      const [startH, startM] = startStr.split(':').map(Number);
      const [endH, endM] = endStr.split(':').map(Number);
      
      const startMins = startH * 60 + startM;
      const endMins = endH * 60 + endM;

      if (endMins < startMins) {
        if (currentMins < endMins) return true;
      }
    }
  }

  return false;
}

function getNextOpenSlot(now) {
  let testDate = new Date(now.getTime());
  for (let i = 0; i < 2016; i++) {
    testDate.setMinutes(testDate.getMinutes() + 5);
    if (isStoreOpen(testDate)) return testDate;
  }
  return null;
}

function updateStoreStatusUI() {
  const now = new Date();
  const open = isStoreOpen(now);

  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  if (statusDot && statusText) {
    statusDot.className = 'status-dot' + (open ? '' : ' closed');
    statusText.className = 'status-text' + (open ? '' : ' closed');
    statusText.textContent = open ? 'Abierto' : 'Cerrado';
  }

  const closedMsgEl = document.getElementById('closedMessage');
  if (closedMsgEl) {
    if (open) {
      closedMsgEl.style.display = 'none';
      closedMsgEl.textContent = '';
    } else {
      closedMsgEl.style.display = 'block';
      const nextOpen = getNextOpenSlot(now);
      if (nextOpen) {
        const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const nextDay = nextOpen.getDay();
        const nowDay = now.getDay();

        let dayStr = '';
        if (nextDay === nowDay) {
          dayStr = 'hoy';
        } else if (nextDay === (nowDay + 1) % 7) {
          dayStr = 'mañana';
        } else {
          dayStr = 'el ' + daysOfWeek[nextDay];
        }

        closedMsgEl.textContent = `🔴 Cerrado ahora · Abrimos ${dayStr} a las 20:00 hs`;
      } else {
        closedMsgEl.textContent = '🔴 Cerrado ahora';
      }
    }
  }

  validateCheckoutForm();
}

function validateCheckoutForm() {
  const nameInput = document.getElementById('formName');
  const addressInput = document.getElementById('formAddress');
  const checkoutBtn = document.getElementById('btnCheckout');

  if (!nameInput || !checkoutBtn) return;

  const name = nameInput.value.trim();
  const method = document.getElementById('formMethod')?.value || 'delivery';
  const address = addressInput ? addressInput.value.trim() : '';

  const isDemo = !FirebaseService.isCloudActive() || window.location.search.includes('demo=true');
  const open = isStoreOpen(new Date()) || isDemo;
  const formValid = name !== '' && (method === 'takeaway' || address !== '');
  const cartHasItems = cart.length > 0;

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const minOrder = storeConfig.minOrder || 5000;
  const minValid = total >= minOrder;

  if (cartHasItems && formValid && open && minValid) {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = (currentCheckoutStep === 2) ? '🔥 Generar Ticket' : '💬 Confirmar Pedido';
  } else {
    checkoutBtn.disabled = true;
    if (cartHasItems && !minValid) {
      checkoutBtn.textContent = `Mínimo de compra: $${minOrder.toLocaleString('es-AR')}`;
    } else {
      checkoutBtn.textContent = (currentCheckoutStep === 2) ? '🔥 Generar Ticket' : '💬 Confirmar Pedido';
    }
  }
}

// ===== 7. INGREDIENTS CUSTOMIZER MODAL DRAWER =====
const availableExtras = [
  { id: 'ext-cheddar', name: 'Extra Queso Cheddar', price: 500 },
  { id: 'ext-bacon', name: 'Extra Bacon Ahumado', price: 800 },
  { id: 'ext-egg', name: 'Extra Huevo Frito', price: 400 },
  { id: 'ext-patty', name: 'Extra Medallón Carne Angus', price: 1200 }
];

function openModal(p) {
  baseProduct = p;
  selectedExtras = [];
  removedIngredients = [];
  selectedCrossSells = [];

  const imgEl = document.getElementById('customizerImg');
  const nameEl = document.getElementById('customizerName');
  const descEl = document.getElementById('customizerDesc');
  const priceEl = document.getElementById('customizerBasePrice');

  const imgPath = p.image || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🍔</text></svg>';

  if (imgEl) imgEl.src = imgPath;
  if (nameEl) nameEl.textContent = p.name;
  if (descEl) descEl.textContent = p.desc;
  if (priceEl) priceEl.textContent = `$${p.price.toLocaleString('es-AR')}`;

  const sectionExtras = document.getElementById('sectionExtras');
  const sectionRemovals = document.getElementById('sectionRemovals');
  const sectionCrossPapas = document.getElementById('sectionCrossPapas');
  const sectionCrossDips = document.getElementById('sectionCrossDips');
  const sectionCrossBebidas = document.getElementById('sectionCrossBebidas');

  if (p.cat === 'hamburgesa' || p.cat === 'combo') {
    if (sectionExtras) sectionExtras.style.display = 'block';
    if (sectionRemovals) sectionRemovals.style.display = 'block';
    if (sectionCrossPapas) sectionCrossPapas.style.display = 'block';
    if (sectionCrossDips) sectionCrossDips.style.display = 'block';
    if (sectionCrossBebidas) sectionCrossBebidas.style.display = 'block';

    renderCustomizerExtras();
    renderCustomizerRemovals();
    renderCustomizerCrossSells();
  } else {
    // Other items bypass customization and go straight to cart
    addToCart(p);
    return;
  }

  updateCustomizerPrice();

  const overlay = document.getElementById('modalOverlay');
  const drawer = document.getElementById('customizerModal');
  if (overlay) {
    overlay.classList.add('customizer-open');
    overlay.classList.add('open');
  }
  if (drawer) {
    drawer.classList.add('open');
  }
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  const drawer = document.getElementById('customizerModal');
  if (overlay) {
    overlay.classList.remove('customizer-open');
    overlay.classList.remove('open');
  }
  if (drawer) {
    drawer.classList.remove('open');
  }
  document.body.style.overflow = '';
}

document.getElementById('customizerBack').onclick = closeModal;
document.getElementById('modalOverlay').onclick = e => {
  if (e.target === e.currentTarget) closeModal();
};

function renderCustomizerExtras() {
  const listEl = document.getElementById('customizerExtrasList');
  if (!listEl) return;
  listEl.innerHTML = '';

  const extrasSource = (baseProduct && baseProduct.extras && baseProduct.extras.length > 0) 
    ? baseProduct.extras.map((ext, idx) => {
        const name = ext.split('+')[0].trim();
        const match = ext.match(/\+\$(\d+)/);
        const price = match ? parseInt(match[1]) : 500;
        return { id: `ext-${idx}`, name: name, price: price };
      })
    : availableExtras;

  extrasSource.forEach(ext => {
    const isActive = selectedExtras.some(e => e.id === ext.id);
    const itemEl = document.createElement('div');
    itemEl.className = 'extra-item';
    itemEl.innerHTML = `
        <span class="extra-name">
            ${ext.name}
            <span class="extra-price">+ $${ext.price.toLocaleString('es-AR')}</span>
        </span>
        <button class="extra-btn ${isActive ? 'active' : ''}">
            ${isActive ? '✓' : '+'}
        </button>
    `;

    const btn = itemEl.querySelector('.extra-btn');
    btn.onclick = () => {
      const index = selectedExtras.findIndex(e => e.id === ext.id);
      if (index > -1) {
        selectedExtras.splice(index, 1);
        btn.classList.remove('active');
        btn.textContent = '+';
      } else {
        selectedExtras.push(ext);
        btn.classList.add('active');
        btn.textContent = '✓';
      }
      updateCustomizerPrice();
    };

    listEl.appendChild(itemEl);
  });
}

function renderCustomizerRemovals() {
  const containerEl = document.getElementById('customizerRemovalsList');
  if (!containerEl) return;
  containerEl.innerHTML = '';

  const ingredients = baseProduct ? baseProduct.remove : [];
  if (!ingredients || ingredients.length === 0) {
    const sec = document.getElementById('sectionRemovals');
    if (sec) sec.style.display = 'none';
    return;
  } else {
    const sec = document.getElementById('sectionRemovals');
    if (sec) sec.style.display = 'block';
  }

  ingredients.forEach(ing => {
    const isActive = removedIngredients.includes(ing);
    const pillEl = document.createElement('button');
    pillEl.className = `removal-pill ${isActive ? 'active' : ''}`;
    pillEl.innerHTML = `${isActive ? '✓ ' : ''}Sin ${ing}`;

    pillEl.onclick = () => {
      const index = removedIngredients.indexOf(ing);
      if (index > -1) {
        removedIngredients.splice(index, 1);
        pillEl.classList.remove('active');
        pillEl.innerHTML = `Sin ${ing}`;
      } else {
        removedIngredients.push(ing);
        pillEl.classList.add('active');
        pillEl.innerHTML = `✓ Sin ${ing}`;
      }
    };

    containerEl.appendChild(pillEl);
  });
}

function renderCustomizerCrossSells() {
  const papasListEl = document.getElementById('crossPapasList');
  const dipsListEl = document.getElementById('crossDipsList');
  const bebidasListEl = document.getElementById('crossBebidasList');

  if (papasListEl) papasListEl.innerHTML = '';
  if (dipsListEl) dipsListEl.innerHTML = '';
  if (bebidasListEl) bebidasListEl.innerHTML = '';

  const papas = activeMenu.filter(p => p.cat === 'papas' && p.available !== false);
  const dips = activeMenu.filter(p => p.cat === 'dips' && p.available !== false);
  const bebidas = activeMenu.filter(p => p.cat === 'bebidas' && p.available !== false);

  function populateCarousel(listEl, items, type) {
    if (!listEl) return;
    const sec = listEl.closest('.customizer-section');
    if (items.length === 0) {
      if (sec) sec.style.display = 'none';
      return;
    } else {
      if (sec) sec.style.display = 'block';
    }

    items.forEach(item => {
      const isActive = selectedCrossSells.some(cs => cs.id === item.id || cs.originalId === item.id);
      const cardEl = document.createElement('div');
      cardEl.className = 'cross-sell-card';

      let price = item.price;
      let sub = item.sub || '';
      if (type === 'papas' && item.sizes) {
        price = item.sizes.chica;
        sub = 'Chica';
      }

      cardEl.innerHTML = `
          <div class="cross-sell-img-wrap">
              ${item.image ? `<img src="${item.image}" alt="${item.name}" class="cross-sell-img" loading="lazy">` : `<span style="font-size:32px">${item.emoji || '🥣'}</span>`}
          </div>
          <div class="cross-sell-name">${item.name}</div>
          <div class="cross-sell-sub">${sub}</div>
          <div class="cross-sell-footer">
              <span class="cross-sell-price">$${price.toLocaleString('es-AR')}</span>
              <button class="cross-sell-add-btn ${isActive ? 'active' : ''}">
                  ${isActive ? '✓' : '+'}
              </button>
          </div>
      `;

      const btn = cardEl.querySelector('.cross-sell-add-btn');
      btn.onclick = () => {
        let crossSellItem = { ...item };
        if (type === 'papas' && item.sizes) {
          crossSellItem = {
            ...item,
            id: `${item.id}-chica`,
            originalId: item.id,
            name: `${item.name} (Chica)`,
            price: item.sizes.chica,
            sub: 'Porción Chica'
          };
        }

        const index = selectedCrossSells.findIndex(cs => cs.id === crossSellItem.id);
        if (index > -1) {
          selectedCrossSells.splice(index, 1);
          btn.classList.remove('active');
          btn.textContent = '+';
        } else {
          selectedCrossSells.push(crossSellItem);
          btn.classList.add('active');
          btn.textContent = '✓';
        }
        updateCustomizerPrice();
      };

      listEl.appendChild(cardEl);
    });
  }

  populateCarousel(papasListEl, papas, 'papas');
  populateCarousel(dipsListEl, dips, 'dips');
  populateCarousel(bebidasListEl, bebidas, 'bebidas');
}

function updateCustomizerPrice() {
  if (!baseProduct) return;
  let total = baseProduct.price;
  selectedExtras.forEach(ext => {
    total += ext.price;
  });
  selectedCrossSells.forEach(cs => {
    total += cs.price;
  });

  const addBtn = document.getElementById('btnCustomizerAdd');
  if (addBtn) {
    addBtn.textContent = `Añadir 1 al pedido · $${total.toLocaleString('es-AR')}`;
  }
}

document.getElementById('btnCustomizerAdd').onclick = (e) => {
  if (!baseProduct) return;

  const burgerPrice = baseProduct.price + selectedExtras.reduce((sum, ext) => sum + ext.price, 0);
  const finalProduct = {
    ...baseProduct,
    id: `${baseProduct.id}-${Date.now()}`,
    originalId: baseProduct.id,
    price: burgerPrice,
    qty: 1,
    note: '',
    extras: [...selectedExtras],
    removals: [...removedIngredients]
  };
  
  cart.push(finalProduct);

  selectedCrossSells.forEach(cs => {
    const existing = cart.find(i => i.id === cs.id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        ...cs,
        qty: 1,
        note: '',
        extras: cs.extras || [],
        removals: cs.removals || []
      });
    }
  });

  updateCartUI();
  animateCartBtnBump();
  animateCountPop();
  saveCart();
  closeModal();

  setTimeout(openCart, 500);
};

// ===== 8. INTERACTIVE SCROLL & NAVIGATION TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const categoryGroups = document.querySelectorAll('.category-group');

tabBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = btn.getAttribute('data-target');
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      isScrollingClick = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabsContainer = document.querySelector('.category-tabs');
      if (tabsContainer) {
        const leftOffset = btn.offsetLeft - (tabsContainer.offsetWidth / 2) + (btn.offsetWidth / 2);
        tabsContainer.scrollTo({
          left: leftOffset,
          behavior: 'smooth'
        });
      }

      const navHeight = document.querySelector('nav')?.offsetHeight || 64;
      const tabsHeight = document.getElementById('stickyTabs')?.offsetHeight || 48;
      const offset = navHeight + tabsHeight;

      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset + 2;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      scrollTimeout = setTimeout(() => {
        isScrollingClick = false;
      }, 800);
    }
  });
});

function updateActiveTabOnScroll() {
  if (isScrollingClick) return;

  const navHeight = document.querySelector('nav')?.offsetHeight || 64;
  const tabsHeight = document.getElementById('stickyTabs')?.offsetHeight || 48;
  const offset = navHeight + tabsHeight + 15;

  let activeId = null;

  categoryGroups.forEach(group => {
    const rect = group.getBoundingClientRect();
    if (rect.top <= offset) {
      activeId = group.getAttribute('id');
    }
  });

  if (!activeId && categoryGroups.length > 0) {
    activeId = categoryGroups[0].getAttribute('id');
  }

  if (activeId) {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-target') === activeId) {
        if (!btn.classList.contains('active')) {
          btn.classList.add('active');

          const tabsContainer = document.querySelector('.category-tabs');
          if (tabsContainer) {
            const leftOffset = btn.offsetLeft - (tabsContainer.offsetWidth / 2) + (btn.offsetWidth / 2);
            tabsContainer.scrollTo({
              left: leftOffset,
              behavior: 'smooth'
            });
          }
        }
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(updateActiveTabOnScroll);
}, { passive: true });

// Floating direct checkout bar listener to open drawer
const floatingCartEl = document.getElementById('floatingCart');
if (floatingCartEl) {
  floatingCartEl.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  });
}

// ===== 9. ADMIN DATA SYNCHRONIZER & REALTIME LOADER =====
async function loadCloudDataAndInit() {
  // 1. Fetch Config
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

  // 2. Fetch Horarios
  try {
    const list = await FirebaseService.getHorarios();
    if (list && list.length > 0) {
      horarios = list;
    } else {
      horarios = window.initialHorarios || [];
      if (!FirebaseService.isCloudActive()) {
        localStorage.setItem("ate_horarios", JSON.stringify(horarios));
      }
    }
  } catch (e) {
    console.error("Error al obtener horarios:", e);
    horarios = window.initialHorarios || [];
  }

  // 3. Fetch Products & Stock
  try {
    const products = await FirebaseService.getProducts();
    if (products && products.length > 0) {
      activeMenu = products;
    } else {
      activeMenu = window.initialProducts || [...menu];
      if (!FirebaseService.isCloudActive()) {
        localStorage.setItem("ate_products", JSON.stringify(activeMenu));
      }
    }
  } catch (e) {
    console.error("Error al obtener los productos:", e);
    activeMenu = window.initialProducts || [...menu];
  }

  // 4. Render interface
  applyConfigUI();
  renderProducts();
  loadPromos();
  updateStoreStatusUI();
}

function applyConfigUI() {
  document.querySelectorAll('.nav-logo').forEach(el => {
    el.innerHTML = `<span class="logo-long-text">${configLogoText(storeConfig.storeName)}</span> <em>A TU ESTILO</em> 🍔`;
  });
  
  const heroTag = document.getElementById('heroTag');
  if (heroTag) heroTag.textContent = storeConfig.deliveryZone;

  const heroSub = document.getElementById('heroSub');
  if (heroSub) heroSub.textContent = storeConfig.tagline;

  const deliveryBox = document.getElementById('deliveryZoneInfo');
  if (deliveryBox) deliveryBox.textContent = storeConfig.deliveryZone;

  const footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) footerLogo.innerHTML = `${storeConfig.storeName.toUpperCase()} <em>A TU ESTILO</em> 🍔`;

  const instagramLink = document.getElementById('contactInstagram');
  if (instagramLink) {
    instagramLink.textContent = '@' + storeConfig.instagram.replace('@', '');
    instagramLink.href = `https://instagram.com/${storeConfig.instagram.replace('@', '')}`;
  }
  document.querySelectorAll('.footer-ig-link').forEach(el => {
    el.href = `https://instagram.com/${storeConfig.instagram.replace('@', '')}`;
  });

  const cleanPhone = storeConfig.whatsapp.replace(/\D/g, '');
  const whatsappLink = document.getElementById('contactWhatsapp');
  if (whatsappLink) {
    whatsappLink.textContent = storeConfig.whatsapp;
    whatsappLink.href = `https://wa.me/${cleanPhone}`;
  }

  const btnNav = document.getElementById('btnNavWa');
  if (btnNav) btnNav.href = `https://wa.me/${cleanPhone}`;

  const heroWa = document.getElementById('heroWaBtn');
  if (heroWa) heroWa.href = `https://wa.me/${cleanPhone}`;

  const ctaWa = document.getElementById('ctaWhatsappBtn');
  if (ctaWa) ctaWa.href = `https://wa.me/${cleanPhone}`;

  const heroPhonePill = document.getElementById('heroPhonePill');
  if (heroPhonePill) heroPhonePill.innerHTML = `📱 <strong>${storeConfig.whatsapp}</strong>`;

  const heroDeliveryPill = document.getElementById('heroDeliveryPill');
  if (heroDeliveryPill) heroDeliveryPill.textContent = storeConfig.deliveryZone;

  document.querySelectorAll('.footer-wa-link').forEach(el => {
    el.href = `https://wa.me/${cleanPhone}`;
  });

  const floatingInstagram = document.getElementById('floatingInstagram');
  if (floatingInstagram) {
    floatingInstagram.href = `https://instagram.com/${storeConfig.instagram.replace('@', '')}`;
  }
  const floatingWhatsapp = document.getElementById('floatingWhatsapp');
  if (floatingWhatsapp) {
    floatingWhatsapp.href = `https://wa.me/${cleanPhone}`;
  }
}

function configLogoText(name) {
  if (name.toLowerCase().includes("hamburguesas")) {
    return "HAMBURGUESAS";
  }
  return name.toUpperCase();
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
    console.error("Error al cargar promociones:", e);
  }
}

function observeReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// Sincronización instantánea entre pestañas / paneles de administración locales
window.addEventListener('storage', (e) => {
  if (e.key === 'ate_stock_sync_trigger' || e.key === 'ate_config_sync_trigger' || e.key === 'ate_status_sync_trigger') {
    loadCloudDataAndInit();
  }
});

// Inicialización final
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  loadCloudDataAndInit();
  resetCheckoutSteps();
});

setInterval(updateStoreStatusUI, 30000);
