/**
 * Salsa Tabú Gourmet - Aplicación Interactiva Principal
 * Ecosistema IN2TECHMX - Cero Cajas Negras & Experiencia de Vanguardia
 */

let store;

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar almacén determinista con los datos cargados
  store = new TabuStore(PRODUCTS_DATA, PACKS_DATA);
  
  // Renderizar componentes principales
  renderProducts('all');
  renderPacks();
  updateFinancialTable(50);
  updateCartUI();

  // Inicializar interactividad
  initFilterTabs();
  initTiltAndSpotlight();
  initCartDrawerEvents();
  initCheckoutEvents();
  initBatchCalculator();
  initQuickViewEvents();
});

/**
 * 1. Renderizado Dinámico de Productos con Efecto 3D
 */
function renderProducts(categoryFilter = 'all') {
  const container = document.getElementById('products-grid-container');
  if (!container) return;

  const filtered = categoryFilter === 'all' 
    ? PRODUCTS_DATA 
    : PRODUCTS_DATA.filter(p => p.category === categoryFilter);

  container.innerHTML = filtered.map(p => {
    // Generar dots de escala de picor
    let dotsHtml = '';
    for (let i = 1; i <= 10; i++) {
      dotsHtml += `<div class="heat-dot ${i <= p.hotScale ? 'active' : ''}"></div>`;
    }

    return `
      <div class="product-tile" data-product-id="${p.id}" data-category="${p.category}">
        <div class="product-tile-header">
          <div class="tile-badge-wrapper">
            <span class="badge-editorial ${p.badgeColor}">${p.badge}</span>
          </div>
          ${p.sodiumFree ? '<div class="tile-badge-secondary"><span class="badge-editorial emerald">0% SODIO</span></div>' : '<div class="tile-badge-secondary"><span class="badge-editorial amber">USO DIARIO</span></div>'}
          <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
        </div>
        
        <div class="product-tile-body">
          <div class="product-category-text">${p.variant}</div>
          <h3 class="product-title serif-font">${p.name}</h3>
          <p class="product-variant-sub"><em>"${p.tagline}"</em></p>
          <p class="product-short-desc">${p.shortDescription}</p>

          <div class="heat-meter">
            <span class="heat-label">Picor (${p.hotScale}/10):</span>
            <div class="heat-dots">${dotsHtml}</div>
          </div>

          <div class="product-specs-pills">
            <span class="spec-pill">⏱️ ${p.shelfLife}</span>
            <span class="spec-pill">⚖️ ${p.unit}</span>
            ${p.sodiumFree ? '<span class="spec-pill">🌿 Sin Sal Añadida</span>' : '<span class="spec-pill">🧂 Con Sal Marina</span>'}
          </div>

          <div class="product-tile-footer">
            <div class="price-box">
              <span class="price-amount">$${p.price.toFixed(2)}</span>
              <span class="price-unit">MXN / ${p.unit}</span>
            </div>
            <div class="tile-actions">
              <button class="btn-quick-view" data-action="quickview" data-id="${p.id}" title="Ver Storytelling & Ficha de Cata">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="btn-add-cart" data-action="addcart" data-id="${p.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-enlazar eventos tilt a los nuevos elementos del DOM
  initTiltAndSpotlight();
}

/**
 * 2. Renderizado de Packs de Degustación
 */
function renderPacks() {
  const container = document.getElementById('packs-grid-container');
  if (!container) return;

  container.innerHTML = PACKS_DATA.map(pack => `
    <div class="pack-card">
      <img src="${pack.image}" alt="${pack.name}" class="pack-img" loading="lazy">
      <div class="pack-content">
        <span class="badge-editorial amber">${pack.badge}</span>
        <h3 class="pack-title serif-font">${pack.name}</h3>
        <p class="pack-desc">${pack.description}</p>
        <div class="pack-price-row">
          <span class="pack-original-price">$${pack.originalPrice.toFixed(2)} MXN</span>
          <span class="pack-sale-price">$${pack.price.toFixed(2)} MXN</span>
          <button class="btn-add-cart" data-action="addcart" data-id="${pack.id}" style="margin-left: auto;">
            Aprovechar Pack
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * 3. 3D Tilt y Magnetic Spotlight (Estándar Rodri González / Jack)
 */
function initTiltAndSpotlight() {
  const tiles = document.querySelectorAll('.product-tile');
  
  tiles.forEach(tile => {
    tile.addEventListener('mousemove', (e) => {
      const rect = tile.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Variables CSS para el resplandor magnético
      tile.style.setProperty('--mouse-x', `${x}px`);
      tile.style.setProperty('--mouse-y', `${y}px`);

      // Cálculo de rotación suave (-1 a 1)
      const deltaX = (x - rect.width / 2) / (rect.width / 2);
      const deltaY = (y - rect.height / 2) / (rect.height / 2);

      const rotX = (-(deltaY * 6)).toFixed(2);
      const rotY = (deltaX * 6).toFixed(2);

      tile.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
    });

    tile.addEventListener('mouseleave', () => {
      tile.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)`;
    });
  });
}

/**
 * 4. Pestañas de Filtrado
 */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-filter');
      renderProducts(cat);
    });
  });
}

/**
 * 5. Eventos del Carrito de Compras (Side Drawer)
 */
function initCartDrawerEvents() {
  const triggerBtn = document.getElementById('cart-drawer-trigger');
  const overlay = document.getElementById('cart-drawer-overlay');
  const drawer = document.getElementById('cart-drawer');
  const closeBtn = document.getElementById('btn-close-cart');
  const applyCouponBtn = document.getElementById('btn-apply-coupon');

  const openDrawer = () => {
    overlay.classList.add('active');
    drawer.classList.add('active');
  };

  const closeDrawer = () => {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
  };

  if (triggerBtn) triggerBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Delegación de eventos para botones agregar
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-action="addcart"]');
    if (addBtn) {
      const pid = addBtn.getAttribute('data-id');
      store.addItem(pid, 1);
      updateCartUI();
      showToast('¡Producto agregado al carrito!');
      openDrawer();
    }

    const qtyInc = e.target.closest('[data-action="inc-qty"]');
    if (qtyInc) {
      const pid = qtyInc.getAttribute('data-id');
      const item = store.cart.find(i => i.id === pid);
      if (item) {
        store.updateQuantity(pid, item.quantity + 1);
        updateCartUI();
      }
    }

    const qtyDec = e.target.closest('[data-action="dec-qty"]');
    if (qtyDec) {
      const pid = qtyDec.getAttribute('data-id');
      const item = store.cart.find(i => i.id === pid);
      if (item) {
        store.updateQuantity(pid, item.quantity - 1);
        updateCartUI();
      }
    }

    const removeBtn = e.target.closest('[data-action="remove-item"]');
    if (removeBtn) {
      const pid = removeBtn.getAttribute('data-id');
      store.removeItem(pid);
      updateCartUI();
      showToast('Producto eliminado');
    }
  });

  // Cupones
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
      const input = document.getElementById('coupon-input');
      if (input && input.value) {
        const res = store.applyCoupon(input.value);
        showToast(res.message);
        if (res.success) {
          input.value = '';
        }
        updateCartUI();
      }
    });
  }

  // Proceder a checkout
  const checkoutBtn = document.getElementById('btn-proceed-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (store.getItemsCount() === 0) {
        showToast('Agrega productos antes de pagar');
        return;
      }
      closeDrawer();
      openCheckoutModal();
    });
  }
}

/**
 * 6. Actualización de Interfaz del Carrito
 */
function updateCartUI() {
  const badge = document.getElementById('cart-count-badge');
  const itemsContainer = document.getElementById('cart-items-list');
  const subtotalElem = document.getElementById('cart-subtotal');
  const discountElem = document.getElementById('cart-discount');
  const discountRow = document.getElementById('cart-discount-row');
  const shippingElem = document.getElementById('cart-shipping');
  const totalElem = document.getElementById('cart-total');
  const missingShippingElem = document.getElementById('shipping-missing-amount');
  const progressBar = document.getElementById('shipping-progress-fill');

  const count = store.getItemsCount();
  if (badge) badge.textContent = count;

  // Barra de progreso envío gratis CDMX ($300 threshold)
  const missing = store.getFreeShippingMissingAmount();
  if (missingShippingElem && progressBar) {
    if (missing > 0) {
      missingShippingElem.innerHTML = `¡Agrega <strong>$${missing.toFixed(2)} MXN</strong> más para tener <strong>Envío Gratis en CDMX</strong>!`;
      const pct = Math.min(100, (store.getSubtotal() / 300) * 100);
      progressBar.style.width = `${pct}%`;
    } else {
      missingShippingElem.innerHTML = `🎉 ¡Felicidades! Tienes <strong>Envío Gratis garantizado en CDMX</strong>`;
      progressBar.style.width = `100%`;
    }
  }

  if (itemsContainer) {
    if (store.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-dim);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <p>Tu carrito gourmet está vacío</p>
          <p style="font-size: 0.78rem; margin-top: 6px;">Selecciona un frasco o pouch para comenzar.</p>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = store.cart.map(item => `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-variant">${item.variant}</span>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)} MXN</div>
          </div>
          <div class="cart-item-qty-controls">
            <button class="btn-qty" data-action="dec-qty" data-id="${item.id}">-</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="btn-qty" data-action="inc-qty" data-id="${item.id}">+</button>
          </div>
          <button class="btn-qty" data-action="remove-item" data-id="${item.id}" title="Eliminar" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">
            &times;
          </button>
        </div>
      `).join('');
    }
  }

  const subtotal = store.getSubtotal();
  const discount = store.getDiscount();
  const shipping = store.getShippingCost();
  const total = store.getTotal();

  if (subtotalElem) subtotalElem.textContent = `$${subtotal.toFixed(2)} MXN`;
  if (discountElem && discountRow) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      discountElem.textContent = `-$${discount.toFixed(2)} MXN (${store.appliedCoupon.code})`;
    } else {
      discountRow.style.display = 'none';
    }
  }
  if (shippingElem) shippingElem.textContent = shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)} MXN`;
  if (totalElem) totalElem.textContent = `$${total.toFixed(2)} MXN`;
}

/**
 * 7. Modal de Ficha Técnica, Storytelling y Cata
 */
function initQuickViewEvents() {
  const overlay = document.getElementById('product-detail-modal');
  const closeBtn = document.getElementById('btn-close-detail');

  const closeDetail = () => {
    overlay.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDetail);
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDetail();
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="quickview"]');
    if (btn) {
      const pid = btn.getAttribute('data-id');
      const p = PRODUCTS_DATA.find(item => item.id === pid);
      if (p) {
        showProductDetail(p);
      }
    }
  });
}

function showProductDetail(p) {
  const modal = document.getElementById('product-detail-modal');
  const content = document.getElementById('detail-modal-body');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="detail-modal-grid">
      <div>
        <img src="${p.image}" alt="${p.name}" class="detail-modal-img">
        <div style="margin-top: 14px; padding: 14px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.78rem;">
          <strong style="color: var(--gold-light);">Acabado de Empaque:</strong> ${p.labelFinish}
        </div>
      </div>
      <div>
        <span class="badge-editorial ${p.badgeColor}">${p.badge}</span>
        <h2 class="serif-font" style="font-size: 1.8rem; color: #fff; margin: 8px 0 4px 0;">${p.name}</h2>
        <p style="color: var(--gold-primary); font-size: 0.9rem; font-style: italic; margin-bottom: 16px;">"${p.tagline}"</p>
        
        <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gold-light); margin-bottom: 6px;">Storytelling & Mística:</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px; text-align: justify;">
          ${p.storytelling}
        </p>

        <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gold-light); margin-bottom: 6px;">Ingredientes Traseros:</h4>
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 20px; background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: var(--radius-sm);">
          ${p.ingredients}
        </p>

        <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gold-light); margin-bottom: 6px;">Maridaje Recomendado:</h4>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 24px;">
          ${p.pairing}
        </p>

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
          <div>
            <div style="font-family: var(--font-serif); font-size: 1.6rem; color: #fff; font-weight: 700;">$${p.price.toFixed(2)} MXN</div>
            <div style="font-size: 0.72rem; color: var(--text-dim);">${p.unit}</div>
          </div>
          <button class="btn-primary-gold" data-action="addcart" data-id="${p.id}">
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

/**
 * 8. Modal de Checkout Completo
 */
function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  renderCheckoutSummary();
  modal.classList.add('active');
}

function initCheckoutEvents() {
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('btn-close-checkout');
  const form = document.getElementById('checkout-order-form');

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Métodos de envío
  const shippingOptions = document.querySelectorAll('.shipping-method-option');
  shippingOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      shippingOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const method = opt.getAttribute('data-shipping');
      store.setShippingMethod(method);
      renderCheckoutSummary();
      updateCartUI();
    });
  });

  // Métodos de pago
  const paymentOptions = document.querySelectorAll('.payment-method-option');
  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const method = opt.getAttribute('data-payment');
      document.getElementById('selected-payment-method').value = method;
      
      const cardFields = document.getElementById('card-fields-box');
      if (cardFields) {
        cardFields.style.display = method === 'card' ? 'block' : 'none';
      }
    });
  });

  // Envío del formulario de compra
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const customer = {
        name: document.getElementById('cust-name').value.trim(),
        email: document.getElementById('cust-email').value.trim(),
        phone: document.getElementById('cust-phone').value.trim(),
        address: document.getElementById('cust-address').value.trim(),
        colonia: document.getElementById('cust-colonia').value.trim(),
        alcaldiaOrCity: document.getElementById('cust-city').value.trim(),
        postalCode: document.getElementById('cust-cp').value.trim(),
        notes: document.getElementById('cust-notes').value.trim()
      };

      const paymentMethod = document.getElementById('selected-payment-method').value;

      try {
        const order = store.createOrder(customer, paymentMethod);
        store.clearCart();
        updateCartUI();
        displayOrderSuccess(order);
      } catch (err) {
        showToast(`Error: ${err.message}`);
      }
    });
  }
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkout-items-summary');
  const subtotalElem = document.getElementById('checkout-subtotal');
  const shippingElem = document.getElementById('checkout-shipping');
  const discountElem = document.getElementById('checkout-discount');
  const totalElem = document.getElementById('checkout-total');

  if (container) {
    container.innerHTML = store.cart.map(item => `
      <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 8px; color: var(--text-muted);">
        <span>${item.quantity}x ${item.name}</span>
        <span style="color: #fff; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
  }

  const subtotal = store.getSubtotal();
  const discount = store.getDiscount();
  const shipping = store.getShippingCost();
  const total = store.getTotal();

  if (subtotalElem) subtotalElem.textContent = `$${subtotal.toFixed(2)} MXN`;
  if (discountElem) discountElem.textContent = `-$${discount.toFixed(2)} MXN`;
  if (shippingElem) shippingElem.textContent = shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)} MXN`;
  if (totalElem) totalElem.textContent = `$${total.toFixed(2)} MXN`;
}

function displayOrderSuccess(order) {
  const body = document.getElementById('checkout-modal-card-body');
  if (!body) return;

  const waUrl = store.generateWhatsAppOrderUrl(order);

  body.innerHTML = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(52, 211, 153, 0.15); border: 1px solid #34d399; color: #34d399; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <span class="badge-editorial emerald">¡PEDIDO REGISTRADO CON ÉXITO!</span>
      <h2 class="serif-font" style="font-size: 2.2rem; color: #fff; margin: 12px 0 6px 0;">Folio: ${order.orderId}</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 500px; margin: 0 auto 24px auto;">
        Gracias por tu compra, <strong>${order.customer.name}</strong>. Hemos reservado tu lote de Salsa Tabú Gourmet para entrega en <strong>${order.customer.alcaldiaOrCity}</strong>.
      </p>

      ${order.speiDetails ? `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-gold); border-radius: var(--radius-md); padding: 20px; max-width: 540px; margin: 0 auto 24px auto; text-align: left;">
          <h4 style="color: var(--gold-light); font-size: 0.95rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            🏦 Datos para Transferencia Interbancaria (SPEI):
          </h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;"><strong>Banco:</strong> ${order.speiDetails.banco}</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;"><strong>Beneficiario:</strong> ${order.speiDetails.beneficiario}</p>
          <p style="font-size: 0.95rem; color: #fff; margin-bottom: 6px; font-family: monospace; letter-spacing: 0.05em;"><strong>CLABE:</strong> ${order.speiDetails.clabe}</p>
          <p style="font-size: 0.85rem; color: var(--text-muted);"><strong>Concepto / Referencia:</strong> ${order.speiDetails.concepto}</p>
        </div>
      ` : ''}

      <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-top: 20px;">
        <a href="${waUrl}" target="_blank" class="btn-whatsapp-quick" style="padding: 14px 28px; font-size: 0.95rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/></svg>
          Confirmar Pedido vía WhatsApp
        </a>
        <button onclick="window.print()" class="btn-secondary-outline">
          🖨️ Imprimir Comprobante
        </button>
        <button onclick="location.reload()" class="btn-secondary-outline">
          Cerrar
        </button>
      </div>
    </div>
  `;
}

/**
 * 9. Calculadora Interactiva de Costeo Financiero CEDA
 */
function initBatchCalculator() {
  const select = document.getElementById('batch-size-selector');
  if (select) {
    select.addEventListener('change', (e) => {
      const size = parseInt(e.target.value, 10);
      updateFinancialTable(size);
    });
  }
}

function updateFinancialTable(batchSize = 50) {
  const factor = batchSize / 50;
  
  // Variante 1: Clásica
  const cMat = (FINANCIAL_DATA.classic.rawMaterials * factor).toFixed(2);
  const cEnv = (FINANCIAL_DATA.classic.packaging * factor).toFixed(2);
  const cGas = (FINANCIAL_DATA.classic.energyGas * factor).toFixed(2);
  const cTot = (FINANCIAL_DATA.classic.totalInvestment * factor).toFixed(2);
  const cUni = FINANCIAL_DATA.classic.unitCost.toFixed(2);
  const cPvs = FINANCIAL_DATA.classic.sellingPrice.toFixed(2);
  const cMrg = FINANCIAL_DATA.classic.marginPercent;

  // Variante 2: Rubí
  const rMat = (FINANCIAL_DATA.rubi.rawMaterials * factor).toFixed(2);
  const rEnv = (FINANCIAL_DATA.rubi.packaging * factor).toFixed(2);
  const rGas = (FINANCIAL_DATA.rubi.energyGas * factor).toFixed(2);
  const rTot = (FINANCIAL_DATA.rubi.totalInvestment * factor).toFixed(2);
  const rUni = FINANCIAL_DATA.rubi.unitCost.toFixed(2);
  const rPvs = FINANCIAL_DATA.rubi.sellingPrice.toFixed(2);
  const rMrg = FINANCIAL_DATA.rubi.marginPercent;

  const tbody = document.getElementById('ceda-financial-tbody');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td><strong>Materia Prima Total (Precios CEDA)</strong></td>
      <td>$${cMat} MXN</td>
      <td>$${rMat} MXN (+$${(40 * factor).toFixed(2)} jamaica criolla)</td>
    </tr>
    <tr>
      <td><strong>Envases, Tapas al Vacío & Etiquetas</strong></td>
      <td>$${cEnv} MXN</td>
      <td>$${rEnv} MXN</td>
    </tr>
    <tr>
      <td><strong>Gas, Energía & Deshidratación Extrema</strong></td>
      <td>$${cGas} MXN</td>
      <td>$${rGas} MXN (por tostado sutil)</td>
    </tr>
    <tr>
      <td><strong>Inversión Total de Producción</strong></td>
      <td><strong>$${cTot} MXN</strong></td>
      <td><strong>$${rTot} MXN</strong></td>
    </tr>
    <tr>
      <td><strong>Costo Unitario por Frasco</strong></td>
      <td><span class="highlight-metric">$${cUni} MXN</span></td>
      <td><span class="highlight-metric">$${rUni} MXN</span></td>
    </tr>
    <tr>
      <td><strong>Precio de Venta Sugerido (PVS)</strong></td>
      <td><strong>$${cPvs} MXN</strong></td>
      <td><strong>$${rPvs} MXN</strong></td>
    </tr>
    <tr>
      <td><strong>Margen de Ganancia Real</strong></td>
      <td><span class="highlight-metric" style="font-size: 1.1rem;">${cMrg}%</span></td>
      <td><span class="highlight-metric" style="font-size: 1.1rem;">${rMrg}%</span></td>
    </tr>
  `;
}

/**
 * 10. Notificaciones Toast
 */
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const text = document.getElementById('toast-text');
  if (!toast || !text) return;

  text.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3200);
}
