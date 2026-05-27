// Datos de autosiembra inicial (Seeding) para Hamburguesas A Tu Estilo
const initialProducts = [
  // CATEGORÍA: HAMBURGUESAS (hamburgesa)
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

  // CATEGORÍA: PAPAS (papas)
  {
    id: 5,
    cat: 'papas',
    emoji: '🍟',
    name: 'Papas Rústicas',
    desc: 'Papas fritas con corte rústico artesanal, sal marina de la patagonia y hojas de romero fresco.',
    price: 2800,
    sizes: { chica: 2800, grande: 3800 }, // Selector de tamaño
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
    sizes: { chica: 3600, grande: 4600 }, // Selector de tamaño
    featured: false,
    image: 'assets/papas_cheddar.png',
    extras: ['Doble porción bacon +$700', 'Jalapeños en rodajas +$400'],
    remove: [],
    available: true
  },

  // CATEGORÍA: BEBIDAS (bebidas)
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

  // CATEGORÍA: DIPS (dips)
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

  // CATEGORÍA: COMBOS (combo)
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

const initialHorarios = [
  { day: 0, label: "Domingo",   open: true,  slots: "20:00 - 23:30" },
  { day: 1, label: "Lunes",     open: false, slots: "" },
  { day: 2, label: "Martes",    open: true,  slots: "20:00 - 23:30" },
  { day: 3, label: "Miércoles", open: true,  slots: "20:00 - 23:30" },
  { day: 4, label: "Jueves",    open: true,  slots: "20:00 - 23:30" },
  { day: 5, label: "Viernes",   open: true,  slots: "20:00 - 23:30" },
  { day: 6, label: "Sábado",    open: true,  slots: "20:00 - 23:30" }
];

const initialPromos = [
  { icon: "🍔", name: "PROMO DÚO BRUTAL", desc: "Dos de nuestras espectaculares hamburguesas clásicas a elección + una porción gigante de papas rústicas crujientes. Perfecto para compartir de a dos.", cond: "Ideal Parejas", visible: true },
  { icon: "🍟", name: "COMBO FULL CRAFT", desc: "Elegí tu hamburguesa premium preferida de la carta + una porción mediana de papas fritas rústicas + una refrescante limonada o bebida latita fría.", cond: "Más vendido", visible: true },
  { icon: "👑", name: "LA MONARCA", desc: "Tres hamburguesas clásicas a elección + dos porciones de papas cheddar cargadas + dips gourmet de regalo. Especial para juntadas de amigos. Pedir con anticipación.", cond: "A lo grande", visible: true }
];

const initialConfig = {
  storeName: "Hamburguesas A Tu Estilo",
  tagline: "A tu estilo o nada",
  whatsapp: "5491137410000",
  instagram: "hamburguesas_a_tu_estilo",
  deliveryZone: "Consultar Cobertura",
  minOrder: 5000,
  welcomeMessage: "¡Hola! Quiero hacer un pedido gourmet 🍔",
  isOpen: true // Estado de apertura manual
};

window.initialProducts = initialProducts;
window.initialHorarios = initialHorarios;
window.initialPromos   = initialPromos;
window.initialConfig   = initialConfig;
