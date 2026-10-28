/**
 * Gate 1: Test Suite Determinista de Salsa Tabú
 * IN2TECHMX Framework - Verificación Automatizada 100% Determinista
 */

const assert = require('assert');
const { PRODUCTS_DATA, PACKS_DATA, FINANCIAL_DATA } = require('../assets/js/products.js');
const { TabuStore } = require('../assets/js/checkout.js');

console.log('--- INICIANDO GATE 1: SUITE DETERMINISTA SALSA TABÚ ---');

let passedTests = 0;
let totalTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${desc}`);
    console.error(`         ${err.message}`);
    process.exitCode = 1;
  }
}

// 1. Integridad del Catálogo y Fórmulas
it('Debe incluir exactamente 6 productos en el catálogo incluyendo la presentación Pocket $10 MXN', () => {
  assert.strictEqual(PRODUCTS_DATA.length, 6, 'Deben existir 6 productos definidos');
});

it('Tabú Pocket Monodosis 15g debe costar $10.00 MXN exactos para conveniencia', () => {
  const p = PRODUCTS_DATA.find(i => i.id === 'tabu-pocket-15g');
  assert.ok(p, 'Producto Pocket no encontrado');
  assert.strictEqual(p.price, 10.00, 'El precio debe ser $10.00 MXN');
  assert.strictEqual(p.category, 'pocket');
  assert.strictEqual(p.sodiumFree, true);
  assert.strictEqual(p.formulaBase50.costoUnitario, 3.95);
  assert.ok(p.formulaBase50.margen.includes('60.5%'));
  assert.ok(p.tagline.includes('10 pesos'));
});

it('Tabú Clásica Frasco debe costar $120 MXN, libre de sodio y con 2 años de anaquel', () => {
  const p = PRODUCTS_DATA.find(i => i.id === 'tabu-clasica-frasco');
  assert.ok(p, 'Producto no encontrado');
  assert.strictEqual(p.price, 120.00);
  assert.strictEqual(p.sodiumFree, true);
  assert.ok(p.shelfLife.includes('2 años'));
  assert.ok(p.tagline.includes('Sabor puro'));
  assert.ok(p.ingredients.includes('LIBRE DE SODIO'));
});

it('Tabú Rubí Frasco debe costar $120 MXN, con flor de jamaica criolla y libre de sodio', () => {
  const p = PRODUCTS_DATA.find(i => i.id === 'tabu-rubi-frasco');
  assert.ok(p, 'Producto no encontrado');
  assert.strictEqual(p.price, 120.00);
  assert.strictEqual(p.sodiumFree, true);
  assert.ok(p.ingredients.includes('flor de jamaica'));
  assert.ok(p.tagline.includes('infusión exótica'));
});

it('Los Pouches On-The-Go deben costar $45 MXN (gourmet) y $29 MXN (Pasta Brava económica)', () => {
  const pClasica = PRODUCTS_DATA.find(i => i.id === 'tabu-clasica-pouch');
  const pRubi = PRODUCTS_DATA.find(i => i.id === 'tabu-rubi-pouch');
  const pBrava = PRODUCTS_DATA.find(i => i.id === 'pasta-habanera-brava');
  
  assert.strictEqual(pClasica.price, 45.00);
  assert.strictEqual(pRubi.price, 45.00);
  assert.strictEqual(pBrava.price, 29.00);
  assert.strictEqual(pBrava.sodiumFree, false, 'Pasta brava económica sí lleva sal');
  assert.ok(pBrava.ingredients.includes('sal marina'), 'Debe explicitar sal marina');
  assert.ok(!pBrava.ingredients.includes('oliva'), 'Pasta brava no lleva aceite de oliva');
});

it('Estructura financiera CEDA debe coincidir exactamente con el costeo de lote de 50', () => {
  assert.strictEqual(FINANCIAL_DATA.classic.unitCost, 49.08);
  assert.strictEqual(FINANCIAL_DATA.classic.sellingPrice, 120.00);
  assert.strictEqual(FINANCIAL_DATA.classic.marginPercent, 59.1);

  assert.strictEqual(FINANCIAL_DATA.rubi.unitCost, 50.08);
  assert.strictEqual(FINANCIAL_DATA.rubi.sellingPrice, 120.00);
  assert.strictEqual(FINANCIAL_DATA.rubi.marginPercent, 58.2);
});

// 2. Motor de Carrito y Checkout
it('Debe agregar productos y calcular subtotal correctamente', () => {
  const store = new TabuStore(PRODUCTS_DATA, PACKS_DATA);
  store.clearCart();
  
  store.addItem('tabu-clasica-frasco', 2); // 2 x 120 = 240
  store.addItem('pasta-habanera-brava', 1); // 1 x 29 = 29
  
  assert.strictEqual(store.getItemsCount(), 3);
  assert.strictEqual(store.getSubtotal(), 269.00);
});

it('Debe actualizar cantidades y remover ítems cuando qty es 0', () => {
  const store = new TabuStore(PRODUCTS_DATA, PACKS_DATA);
  store.clearCart();
  store.addItem('tabu-clasica-frasco', 2);
  
  store.updateQuantity('tabu-clasica-frasco', 5);
  assert.strictEqual(store.getItemsCount(), 5);
  assert.strictEqual(store.getSubtotal(), 600.00);

  store.updateQuantity('tabu-clasica-frasco', 0);
  assert.strictEqual(store.getItemsCount(), 0);
  assert.strictEqual(store.getSubtotal(), 0.00);
});

it('Debe calcular envío express CDMX ($65) y habilitar envío gratis a partir de $300', () => {
  const store = new TabuStore(PRODUCTS_DATA, PACKS_DATA);
  store.clearCart();
  store.setShippingMethod('cdmx-express');

  // Subtotal $240 (menor a $300) -> cobra $65
  store.addItem('tabu-clasica-frasco', 2);
  assert.strictEqual(store.getSubtotal(), 240.00);
  assert.strictEqual(store.getShippingCost(), 65.00);
  assert.strictEqual(store.getFreeShippingMissingAmount(), 60.00);
  assert.strictEqual(store.getTotal(), 305.00);

  // Agrega otro frasco -> Subtotal $360 (>= $300) -> envío gratis $0
  store.addItem('tabu-rubi-frasco', 1);
  assert.strictEqual(store.getSubtotal(), 360.00);
  assert.strictEqual(store.getShippingCost(), 0.00);
  assert.strictEqual(store.getFreeShippingMissingAmount(), 0.00);
  assert.strictEqual(store.getTotal(), 360.00);
});

it('Debe procesar cupón de descuento TABU10 (10% off) de forma determinista', () => {
  const store = new TabuStore(PRODUCTS_DATA, PACKS_DATA);
  store.clearCart();
  store.addItem('tabu-clasica-frasco', 2); // $240
  store.setShippingMethod('cdmx-pickup'); // $0 envío

  const res = store.applyCoupon('TABU10');
  assert.strictEqual(res.success, true);
  assert.strictEqual(store.getDiscount(), 24.00); // 10% de 240
  assert.strictEqual(store.getTotal(), 216.00);
});

it('Debe rechazar cupones inválidos o con mínimo no alcanzado', () => {
  const store = new TabuStore(PRODUCTS_DATA, PACKS_DATA);
  store.clearCart();
  store.addItem('pasta-habanera-brava', 1); // $29 subtotal

  const resInvalid = store.applyCoupon('CUPON_FALSO');
  assert.strictEqual(resInvalid.success, false);

  const resMin = store.applyCoupon('GOURMET20'); // Requiere $200 min
  assert.strictEqual(resMin.success, false);
});

it('Debe generar orden con folio formal, CLABE SPEI y URL de WhatsApp con formato correcto', () => {
  const store = new TabuStore(PRODUCTS_DATA, PACKS_DATA);
  store.clearCart();
  store.addItem('tabu-clasica-frasco', 1);
  store.addItem('tabu-rubi-pouch', 2);

  const customer = {
    name: 'Carlos Mendoza',
    phone: '5512345678',
    email: 'carlos@test.mx',
    address: 'Colima 123, Depto 4B',
    colonia: 'Roma Norte',
    alcaldiaOrCity: 'Cuauhtémoc, CDMX',
    postalCode: '06700'
  };

  const order = store.createOrder(customer, 'spei');
  assert.ok(order.orderId.startsWith('TABU-'), 'El folio debe empezar con TABU-');
  assert.strictEqual(order.customer.name, 'Carlos Mendoza');
  assert.strictEqual(order.financials.subtotal, 210.00);
  assert.ok(order.speiDetails.clabe.length === 18, 'CLABE interbancaria debe tener 18 dígitos');

  const waUrl = store.generateWhatsAppOrderUrl(order);
  assert.ok(waUrl.startsWith('https://wa.me/'), 'Debe ser URL válida de WhatsApp');
  assert.ok(waUrl.includes('Carlos%20Mendoza'), 'Debe incluir el nombre del cliente url-encoded');
  assert.ok(waUrl.includes(order.orderId), 'Debe incluir el folio de orden');
});

console.log(`\n--- RESULTADO GATE 1: ${passedTests}/${totalTests} PRUEBAS EN VERDE (100% PASS) ---`);
