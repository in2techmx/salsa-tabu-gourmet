const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- INICIANDO SUITE DE PRUEBAS: INGENIERÍA & PRODUCCIÓN ---');

const produccionPath = path.join(__dirname, '..', 'produccion.html');
const indexPath = path.join(__dirname, '..', 'index.html');

// Test 1: produccion.html exists and is not empty
assert.ok(fs.existsSync(produccionPath), 'produccion.html debe existir');
const produccionHtml = fs.readFileSync(produccionPath, 'utf8');
assert.ok(produccionHtml.length > 5000, 'produccion.html debe tener contenido sustancial');
console.log('  [PASS] produccion.html existe y contiene arquitectura completa');

// Test 2: produccion.html includes Etapa 1 (Casera / Piloto) with correct dimensions and cost
assert.ok(produccionHtml.includes('id="etapa-casera"'), 'Debe contener sección #etapa-casera');
assert.ok(produccionHtml.includes('16 m²') || produccionHtml.includes('4×4m'), 'Debe especificar 16 m² (4x4m)');
assert.ok(produccionHtml.includes('109,000') || produccionHtml.includes('$109,000 MXN'), 'Debe contener costo total etapa casera $109,000 MXN');
console.log('  [PASS] Etapa 1 Casera/Piloto documentada con layout 16 m² y costo $109,000 MXN');

// Test 3: produccion.html includes Etapa 2 (Planta Industrializada) with dimensions and cost
assert.ok(produccionHtml.includes('id="etapa-industrial"'), 'Debe contener sección #etapa-industrial');
assert.ok(produccionHtml.includes('64 m²') || produccionHtml.includes('8×8m'), 'Debe especificar 64 m² (8x8m)');
assert.ok(produccionHtml.includes('555,100') || produccionHtml.includes('$28,200 USD'), 'Debe contener costo total industrial $555,100 MXN / $28,200 USD');
console.log('  [PASS] Etapa 2 Industrial documentada con layout 64 m² y costo $555,100 MXN');

// Test 4: produccion.html contains animated SVG diagrams
assert.ok(produccionHtml.includes('class="flow-line"'), 'Debe contener animación SVG flow-line');
assert.ok(produccionHtml.includes('<svg'), 'Debe contener diagramas SVG vectoriales');
console.log('  [PASS] Diagramas SVG animados interactivos presentes');

// Test 5: produccion.html covers Baño María vacuum sealing
assert.ok(produccionHtml.includes('Baño María') || produccionHtml.includes('baño maría'), 'Debe documentar Baño María para sellado al vacío');
console.log('  [PASS] Proceso de sellado al vacío por Baño María verificado');

// Test 6: index.html links to produccion.html and contains thumbnail links
const indexHtml = fs.readFileSync(indexPath, 'utf8');
assert.ok(indexHtml.includes('produccion.html'), 'index.html debe enlazar a produccion.html');
assert.ok(indexHtml.includes('produccion.html#etapa-casera'), 'index.html debe tener link 1 con thumbnail a #etapa-casera');
assert.ok(indexHtml.includes('produccion.html#etapa-industrial'), 'index.html debe tener link 2 con thumbnail a #etapa-industrial');
console.log('  [PASS] index.html contiene enlaces y thumbnails hacia ambas etapas de producción');

console.log('\n--- RESULTADO SUITE PRODUCCIÓN: TODAS LAS PRUEBAS EN VERDE (100% PASS) ---');
