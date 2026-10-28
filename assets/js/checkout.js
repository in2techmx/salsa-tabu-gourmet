/**
 * Salsa Tabú - Motor de Carrito y Checkout Autovendible
 * IN2TECHMX Framework - Cero Cajas Negras & Rigor Determinista
 */

class TabuStore {
  constructor(products = [], packs = []) {
    this.products = products;
    this.packs = packs;
    this.cart = this.loadCart();
    this.appliedCoupon = null;
    this.shippingMethod = 'cdmx-express';
    this.shippingRates = {
      'cdmx-express': { name: 'Envío Express CDMX (Mismo Día / 24h)', cost: 65.00, freeThreshold: 300.00 },
      'cdmx-pickup': { name: 'Recolección en Obrador Roma Norte / CEDA', cost: 0.00, freeThreshold: 0 },
      'nacional': { name: 'Envío Nacional Estafeta / FedEx', cost: 120.00, freeThreshold: 600.00 }
    };
    this.coupons = {
      'TABU10': { type: 'percent', value: 0.10, desc: '10% de descuento en tu orden' },
      'CDMXGRATIS': { type: 'free_shipping', value: 0, desc: 'Envío gratis en CDMX' },
      'GOURMET20': { type: 'fixed', value: 20.00, minSubtotal: 200.00, desc: '$20 MXN de descuento' }
    };
  }

  loadCart() {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('tabu_cart');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  saveCart() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('tabu_cart', JSON.stringify(this.cart));
      } catch (e) {}
    }
  }

  addItem(productId, quantity = 1) {
    if (quantity <= 0) return this.cart;
    const existing = this.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      const prod = this.products.find(p => p.id === productId);
      if (prod) {
        this.cart.push({
          id: prod.id,
          name: prod.name,
          variant: prod.variant,
          price: prod.price,
          unit: prod.unit,
          image: prod.image,
          quantity: quantity,
          isPack: false
        });
      } else {
        const pack = this.packs.find(p => p.id === productId);
        if (pack) {
          this.cart.push({
            id: pack.id,
            name: pack.name,
            variant: pack.badge,
            price: pack.price,
            unit: 'Pack de degustación',
            image: pack.image,
            quantity: quantity,
            isPack: true
          });
        }
      }
    }
    this.saveCart();
    return this.cart;
  }

  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    return this.cart;
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    this.appliedCoupon = null;
    this.saveCart();
    return this.cart;
  }

  getItemsCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return parseFloat(this.cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2));
  }

  applyCoupon(code) {
    if (!code) return { success: false, message: 'Ingresa un cupón' };
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.coupons[cleanCode];
    if (!coupon) {
      return { success: false, message: 'Cupón no válido o expirado' };
    }
    const subtotal = this.getSubtotal();
    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      return { success: false, message: `Mínimo de compra para este cupón: $${coupon.minSubtotal.toFixed(2)} MXN` };
    }
    this.appliedCoupon = { code: cleanCode, ...coupon };
    return { success: true, message: `Cupón ${cleanCode} aplicado: ${coupon.desc}` };
  }

  removeCoupon() {
    this.appliedCoupon = null;
    return true;
  }

  getDiscount() {
    if (!this.appliedCoupon) return 0.00;
    const subtotal = this.getSubtotal();
    if (this.appliedCoupon.type === 'percent') {
      return parseFloat((subtotal * this.appliedCoupon.value).toFixed(2));
    }
    if (this.appliedCoupon.type === 'fixed') {
      return parseFloat(Math.min(subtotal, this.appliedCoupon.value).toFixed(2));
    }
    return 0.00;
  }

  setShippingMethod(methodKey) {
    if (this.shippingRates[methodKey]) {
      this.shippingMethod = methodKey;
    }
    return this.shippingMethod;
  }

  getShippingCost() {
    const rate = this.shippingRates[this.shippingMethod] || this.shippingRates['cdmx-express'];
    const subtotal = this.getSubtotal();

    // Cupón de envío gratis
    if (this.appliedCoupon && this.appliedCoupon.type === 'free_shipping' && this.shippingMethod.startsWith('cdmx')) {
      return 0.00;
    }

    if (rate.freeThreshold > 0 && subtotal >= rate.freeThreshold) {
      return 0.00;
    }
    return rate.cost;
  }

  getFreeShippingMissingAmount() {
    const rate = this.shippingRates[this.shippingMethod] || this.shippingRates['cdmx-express'];
    if (rate.freeThreshold === 0) return 0;
    const subtotal = this.getSubtotal();
    const missing = rate.freeThreshold - subtotal;
    return missing > 0 ? parseFloat(missing.toFixed(2)) : 0;
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const shipping = this.getShippingCost();
    const total = Math.max(0, subtotal - discount + shipping);
    return parseFloat(total.toFixed(2));
  }

  createOrder(customerData, paymentMethod) {
    const subtotal = this.getSubtotal();
    if (subtotal <= 0) {
      throw new Error('El carrito está vacío');
    }

    const orderId = 'TABU-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
    const shippingCost = this.getShippingCost();
    const discount = this.getDiscount();
    const total = this.getTotal();

    const order = {
      orderId: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
        colonia: customerData.colonia || '',
        alcaldiaOrCity: customerData.alcaldiaOrCity || 'CDMX',
        postalCode: customerData.postalCode || '',
        notes: customerData.notes || ''
      },
      items: JSON.parse(JSON.stringify(this.cart)),
      shippingMethod: this.shippingMethod,
      shippingRateName: this.shippingRates[this.shippingMethod].name,
      paymentMethod: paymentMethod, // 'mercadopago', 'spei', 'cash_on_delivery', 'card'
      financials: {
        subtotal: subtotal,
        discount: discount,
        couponCode: this.appliedCoupon ? this.appliedCoupon.code : null,
        shipping: shippingCost,
        total: total
      },
      status: 'CONFIRMED_PENDING_PAYMENT'
    };

    // Generar datos específicos de pago
    if (paymentMethod === 'spei') {
      order.speiDetails = {
        clabe: '6461801570' + Math.floor(10000000 + Math.random() * 90000000),
        banco: 'STP / Banco de México',
        beneficiario: 'Salsa Tabú Gourmet Especialidades SAPI de CV',
        concepto: orderId
      };
    }

    return order;
  }

  generateWhatsAppOrderUrl(order, phone = '525549028110') {
    let msg = `🌶️ *NUEVO PEDIDO SALSA TABÚ GOURMET*\n`;
    msg += `*Folio:* ${order.orderId}\n`;
    msg += `*Cliente:* ${order.customer.name}\n`;
    msg += `*Teléfono:* ${order.customer.phone}\n`;
    msg += `*Dirección:* ${order.customer.address}, Col. ${order.customer.colonia}, ${order.customer.alcaldiaOrCity}, CP ${order.customer.postalCode}\n\n`;
    msg += `*PRODUCTOS:*\n`;
    order.items.forEach(item => {
      msg += `• ${item.quantity}x ${item.name} (${item.variant}) - $${(item.price * item.quantity).toFixed(2)} MXN\n`;
    });
    msg += `\n*Subtotal:* $${order.financials.subtotal.toFixed(2)} MXN\n`;
    if (order.financials.discount > 0) {
      msg += `*Descuento (${order.financials.couponCode}):* -$${order.financials.discount.toFixed(2)} MXN\n`;
    }
    msg += `*Envío (${order.shippingRateName}):* $${order.financials.shipping.toFixed(2)} MXN\n`;
    msg += `*TOTAL:* $${order.financials.total.toFixed(2)} MXN\n\n`;
    msg += `*Método de Pago:* ${order.paymentMethod.toUpperCase()}\n`;
    if (order.customer.notes) {
      msg += `*Instrucciones de entrega:* ${order.customer.notes}\n`;
    }
    msg += `\n_Confirmación generada en www.salsatabu.mx_`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }
}

// Exportación para Node.js y navegador
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TabuStore };
}
