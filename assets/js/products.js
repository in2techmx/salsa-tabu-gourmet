/**
 * Salsa Tabú - Catálogo y Fórmulas de Especialidad Gourmet
 * IN2TECHMX Framework - Cero Cajas Negras
 */

const PRODUCTS_DATA = [
  {
    id: 'tabu-clasica-frasco',
    name: 'Tabú Clásica Gourmet',
    variant: 'Sin Jamaica (Fórmula Original)',
    category: 'gourmet-jar',
    price: 120.00,
    unit: 'Frasco de vidrio ~130g',
    volume: '130 ml / 4.4 fl oz',
    image: 'assets/images/tabu_clasica_jar.jpg',
    badge: 'ESPECIALIDAD GOURMET',
    badgeColor: 'amber',
    tagline: 'Sabor puro. Placer prohibido.',
    sodiumFree: true,
    shelfLife: '2 años en anaquel garantizados',
    preservation: 'Envasado al vacío mediante baño maría & deshidratación extrema',
    shortDescription: 'Infusión sagrada de habaneros inflados al calor y ajo nacional rostizado a fuego lento en Aceite de Oliva Extra Virgen de primera prensada en frío. Sin sal añadida.',
    storytelling: 'Rompimos las reglas de la cocina tradicional para crear una experiencia pura. Tabú es el resultado de un proceso místico: chiles habaneros tostados pacientemente hasta inflarse como globos de aire, combinados con la intensidad del ajo nacional rostizado a fuego lento y pulverizado a mano. Una infusión sagrada en aceite de oliva extra virgen, libre de sodio y sin una sola pizca de sal. Déjate tentar por lo prohibido. El verdadero sabor no necesita añadidos.',
    ingredients: 'Aceite de oliva extra virgen de primera prensada en frío, chile habanero seleccionado deshidratado, ajo nacional rostizado a fuego lento y pulverizado, ácido cítrico (regulador de acidez), ácido ascórbico (antioxidante natural). LIBRE DE SODIO. SIN SAL AÑADIDA.',
    hotScale: 8, // Escala de 1 a 10
    labelFinish: 'Etiqueta Negra Mate con Estampado Oro Metálico (Hot Stamping)',
    formulaBase50: {
      habaneroFresco: '8.5 kg fresco → ~1 kg seco inflado',
      ajoMorado: '1.7 kg fresco → ~350g polvo rostizado',
      jamaica: 'No lleva',
      aceiteOlivaEV: '5.5 Litros prensada en frío',
      aditivos: '10g Ácido Cítrico + 3g Ácido Ascórbico',
      costoUnitario: 49.08,
      precioVenta: 120.00,
      margen: '59.1%'
    },
    pairing: 'Cortes finos de carne, quesos maduros, pizzas artesanales, pastas, mariscos al ajillo y pan campesino.'
  },
  {
    id: 'tabu-rubi-frasco',
    name: 'Tabú Rubí Gourmet',
    variant: 'Con Jamaica Criolla Tostada',
    category: 'gourmet-jar',
    price: 120.00,
    unit: 'Frasco de vidrio ~130g',
    volume: '130 ml / 4.4 fl oz',
    image: 'assets/images/tabu_rubi_jar.jpg',
    badge: 'INFUSIÓN EXÓTICA',
    badgeColor: 'rose',
    tagline: 'La infusión exótica que desafía las reglas.',
    sodiumFree: true,
    shelfLife: '2 años en anaquel garantizados',
    preservation: 'Envasado al vacío mediante baño maría & deshidratación extrema',
    shortDescription: 'Infusión de tono rubí profundo con habanero deshidratado y sutiles notas ácidas florales de jamaica criolla tostada en Aceite de Oliva Extra Virgen. Sin sal añadida.',
    storytelling: 'Rompimos las reglas de la cocina tradicional para crear una experiencia pura. Tabú es el resultado de un proceso místico: chiles habaneros tostados hasta inflarse como globos de aire, combinados con la intensidad del ajo nacional rostizado a fuego lento y la acidez vibrante de la flor de jamaica deshidratada. Una infusión sagrada de tono rubí en aceite de oliva extra virgen, libre de sodio y sin una sola pizca de sal. Déjate tentar por lo prohibido. El verdadero sabor no necesita añadidos.',
    ingredients: 'Aceite de oliva extra virgen de primera prensada en frío, chile habanero seleccionado deshidratado, ajo nacional rostizado a fuego lento y pulverizado, flor de jamaica deshidratada, ácido cítrico, ácido ascórbico. LIBRE DE SODIO. SIN SAL AÑADIDA.',
    hotScale: 8,
    labelFinish: 'Etiqueta Negra Mate con Letras Bronce / Cobre Mágnum Metálico',
    formulaBase50: {
      habaneroFresco: '8.5 kg fresco → ~1 kg seco inflado',
      ajoMorado: '1.7 kg fresco → ~350g polvo rostizado',
      jamaica: '250 g flor seca tostada sutilmente',
      aceiteOlivaEV: '5.5 Litros prensada en frío',
      aditivos: '6g Ácido Cítrico + 3g Ácido Ascórbico (menor cítrico por la acidez natural de la jamaica)',
      costoUnitario: 50.08,
      precioVenta: 120.00,
      margen: '58.2%'
    },
    pairing: 'Ceviches, aguachiles, pescados a la leña, tacos de camarón, ensaladas de higo, carpaccios y mixología gourmet.'
  },
  {
    id: 'tabu-clasica-pouch',
    name: 'Tabú Clásica Pouch On-The-Go',
    variant: 'Sobre Portátil con Taparosca en Esquina (50g)',
    category: 'pouch',
    price: 45.00,
    unit: 'Mini Pouch Squeeze 50g',
    volume: '50 g / 1.7 oz',
    image: 'assets/images/pouch_tabu_clasica.jpg',
    badge: 'PORTÁTIL ON-THE-GO',
    badgeColor: 'amber',
    tagline: 'Lleva el fuego gourmet en tu bolsillo.',
    sodiumFree: true,
    shelfLife: '18 meses',
    preservation: 'Doypack multicapa hermético con boquilla twist sellada',
    shortDescription: 'La misma fórmula gourmet sin sodio en un sobre ultraligero e irrompible con taparosca ergonómica en esquina. Ideal para oficina, viajes y comidas fuera de casa.',
    storytelling: 'Diseñado para quienes se rehúsan a comer salsas industriales fuera de casa. El sobre On-The-Go de Tabú Clásica conserva intacta la infusión en aceite de oliva virgen extra y habanero inflado, en un envase flexible que cabe en cualquier bolsillo o lonchera.',
    ingredients: 'Aceite de oliva extra virgen prensado en frío, habanero deshidratado, ajo nacional rostizado en polvo, ácido cítrico, ácido ascórbico. LIBRE DE SODIO. SIN SAL AÑADIDA.',
    hotScale: 8,
    labelFinish: 'Matte Black Flexible Pouch con Acabado Oro',
    formulaBase50: {
      habaneroFresco: 'Porción proporcional individual',
      ajoMorado: 'Ajo rostizado fino',
      jamaica: 'No lleva',
      aceiteOlivaEV: 'Aceite de oliva virgen extra',
      aditivos: 'Antioxidantes naturales',
      costoUnitario: 18.50,
      precioVenta: 45.00,
      margen: '58.8%'
    },
    pairing: 'Tacos gourmet de calle, hamburguesas de autor, loncheras ejecutivas y viajes de negocios.'
  },
  {
    id: 'tabu-rubi-pouch',
    name: 'Tabú Rubí Pouch On-The-Go',
    variant: 'Sobre Portátil Habanero & Jamaica (50g)',
    category: 'pouch',
    price: 45.00,
    unit: 'Mini Pouch Squeeze 50g',
    volume: '50 g / 1.7 oz',
    image: 'assets/images/pouch_tabu_rubi.jpg',
    badge: 'PORTÁTIL EXÓTICO',
    badgeColor: 'rose',
    tagline: 'Acidez floral y picor ardiente donde vayas.',
    sodiumFree: true,
    shelfLife: '18 meses',
    preservation: 'Doypack multicapa hermético con boquilla twist sellada',
    shortDescription: 'Infusión de jamaica criolla y habanero en formato flexible con boquilla en esquina. Cero sodio, 100% sabor exótico.',
    storytelling: 'Lleva la sofisticación del rubí a cualquier mesa. Su empaque ergonómico con taparosca dosificadora evita derrames y permite aplicar gota a gota la infusión de flor de jamaica y habanero.',
    ingredients: 'Aceite de oliva extra virgen prensado en frío, habanero deshidratado, ajo nacional rostizado, flor de jamaica tostada, ácido cítrico, ácido ascórbico. LIBRE DE SODIO.',
    hotScale: 8,
    labelFinish: 'Matte Black Flexible Pouch con Acabado Bronce & Rubí',
    formulaBase50: {
      habaneroFresco: 'Porción proporcional individual',
      ajoMorado: 'Ajo rostizado fino',
      jamaica: 'Flor criolla seleccionada',
      aceiteOlivaEV: 'Aceite de oliva virgen extra',
      aditivos: 'Antioxidantes naturales',
      costoUnitario: 19.10,
      precioVenta: 45.00,
      margen: '57.5%'
    },
    pairing: 'Mariscos de fin de semana, sushi bowls, tacos estilo Ensenada y ensaladas frescas.'
  },
  {
    id: 'pasta-habanera-brava',
    name: 'Pasta Brava Día a Día',
    variant: 'Pasta Densa de Habanero & Ajo (Sin Aceite de Oliva)',
    category: 'pouch',
    price: 29.00,
    unit: 'Mini Pouch Squeeze 70g',
    volume: '70 g / 2.5 oz',
    image: 'assets/images/pouch_pasta_brava.jpg',
    badge: 'USO DIARIO ECONÓMICO',
    badgeColor: 'cyan',
    tagline: 'Fuego directo sin rodeos. Poder concentrado para el diario.',
    sodiumFree: false,
    shelfLife: '12 meses',
    preservation: 'Envasado aséptico en sobre con boquilla twist dosificadora',
    shortDescription: 'Fórmula popular de alto rendimiento y bajo costo: puré concentrado de habanero naranja y ajo criollo, con sal marina y sin aceite de oliva. Ultra picosa, ultra accesible.',
    storytelling: 'Creada para el verdadero amante del picor cotidiano que busca máxima potencia al mejor precio. Al prescindir del aceite de oliva y concentrar la pulpa viva de habanero con ajo y sal marina de grano, entregamos un condimento ardiente insuperable para fondas, taquerías caseras y caldos.',
    ingredients: 'Chile habanero naranja seleccionado (85%), ajo criollo nacional triturado (10%), sal marina de grano (3%), ácido cítrico y benzoato de sodio al 0.05% como conservador. CONTIENE SAL MARINA.',
    hotScale: 10, // Máxima potencia pura
    labelFinish: 'Pouch Charcoal & Naranja Fuego con Textura Mate',
    formulaBase50: {
      habaneroFresco: 'Pulpa directa triturada de habanero',
      ajoMorado: 'Ajo criollo en pasta',
      jamaica: 'No lleva',
      aceiteOlivaEV: 'CERO aceite de oliva (sustituido por agua purificada y zumo propio)',
      aditivos: 'Sal marina + conservador grado alimenticio',
      costoUnitario: 10.80,
      precioVenta: 29.00,
      margen: '62.7%'
    },
    pairing: 'Pozole, birria, chilaquiles, tortas ahogadas, frijoles charros y guisados caseros.'
  },
  {
    id: 'tabu-pocket-15g',
    name: 'Tabú Pocket Monodosis',
    variant: 'Sachet Monodosis Abre-Fácil (15g)',
    category: 'pocket',
    price: 10.00,
    unit: 'Sachet Monodosis 15g',
    volume: '15 g / 0.5 oz',
    image: 'assets/images/tabu_pocket_10pesos.jpg',
    badge: 'CONVENIENCIA $10 MXN',
    badgeColor: 'emerald',
    tagline: 'Fuego gourmet al alcance de todos. 10 pesos, cero pretextos.',
    sodiumFree: true,
    shelfLife: '12 meses en anaquel',
    preservation: 'Sachet hermético multicapa metalizado con atmósfera inerte',
    shortDescription: 'Diseñado para tiendas de conveniencia y fondas: la porción justa de 15g para bañar 3-4 tacos o una torta con nuestra infusión sagrada libre de sodio. Solo $10 MXN.',
    storytelling: 'Democratizamos la especialidad gastronómica. Disponible al pie de caja en tiendas de conveniencia, tienditas de la esquina y taquerías: un sachet ultra compacto de 15g con muesca de abre-fácil para llevar en la cartera o bolsillo y elevar cualquier comida callejera al nivel de alta cocina por una sola moneda de $10 pesos.',
    ingredients: 'Aceite de oliva extra virgen prensado en frío, chile habanero seleccionado deshidratado, ajo nacional rostizado a fuego lento, ácido cítrico, ácido ascórbico. LIBRE DE SODIO. SIN SAL AÑADIDA.',
    hotScale: 8,
    labelFinish: 'Foil Metalizado Negro Mate con Tipografía Oro Metálico & Muesca Abre-Fácil',
    formulaBase50: {
      habaneroFresco: 'Porción individual 15g',
      ajoMorado: 'Ajo rostizado puro',
      jamaica: 'No lleva',
      aceiteOlivaEV: 'Aceite de oliva extra virgen',
      aditivos: 'Antioxidante natural',
      costoUnitario: 3.95,
      precioVenta: 10.00,
      margen: '60.5%'
    },
    pairing: 'Tacos de pastor, suadero, carnitas, tortas, esquites, quesadillas, mariscos y caldos al paso.'
  }
];

// Packs Promocionales de Alta Conversión
const PACKS_DATA = [
  {
    id: 'pack-tira-conveniencia',
    name: 'Tira de Mostrador: 10 Sachets Pocket',
    description: '10 sobres individuales de Tabú Pocket 15g ($10 c/u) con descuento. Ideal para tu alacena, oficina o para exhibición en tu negocio.',
    originalPrice: 100.00,
    price: 85.00,
    savings: 15.00,
    badge: 'TIRA CONVENIENCIA - AHORRA $15',
    image: 'assets/images/tabu_pocket_10pesos.jpg',
    items: [
      { id: 'tabu-pocket-15g', qty: 10 }
    ]
  },
  {
    id: 'pack-maestro-gourmet',
    name: 'Pack Maestro Tabú Gourmet',
    description: '1 Frasco Tabú Clásica (130g) + 1 Frasco Tabú Rubí (130g) + 1 Pouch Pasta Brava (70g) de regalo.',
    originalPrice: 269.00,
    price: 220.00,
    savings: 49.00,
    badge: 'MÁS VENDIDO - AHORRA $49',
    image: 'assets/images/tabu_clasica_jar.jpg',
    items: [
      { id: 'tabu-clasica-frasco', qty: 1 },
      { id: 'tabu-rubi-frasco', qty: 1 },
      { id: 'pasta-habanera-brava', qty: 1 }
    ]
  },
  {
    id: 'pack-trio-onthego',
    name: 'Trío Portátil On-The-Go',
    description: '1 Pouch Clásica 50g + 1 Pouch Rubí 50g + 1 Pouch Pasta Brava 70g. El combo perfecto para llevar a cualquier parte.',
    originalPrice: 119.00,
    price: 99.00,
    savings: 20.00,
    badge: 'COMBO BOLSILLO',
    image: 'assets/images/tabu_pouches_line.jpg',
    items: [
      { id: 'tabu-clasica-pouch', qty: 1 },
      { id: 'tabu-rubi-pouch', qty: 1 },
      { id: 'pasta-habanera-brava', qty: 1 }
    ]
  }
];

// Costeo y Fórmulas CEDA Comparativas (Lote 50 Frascos)
const FINANCIAL_DATA = {
  batchSize: 50,
  unitWeight: '~130g',
  classic: {
    rawMaterials: 1679.30,
    packaging: 675.00,
    energyGas: 100.00,
    totalInvestment: 2454.30,
    unitCost: 49.08,
    sellingPrice: 120.00,
    unitProfit: 70.92,
    marginPercent: 59.1
  },
  rubi: {
    rawMaterials: 1719.30,
    packaging: 675.00,
    energyGas: 110.00,
    totalInvestment: 2504.30,
    unitCost: 50.08,
    sellingPrice: 120.00,
    unitProfit: 69.92,
    marginPercent: 58.2
  }
};

// Exportación para Node.js (Tests Gate 1) y Browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS_DATA, PACKS_DATA, FINANCIAL_DATA };
}
