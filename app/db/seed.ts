import "dotenv/config";
import { getDb } from "../api/queries/connection";
import { products, type InsertUser } from "./schema";

type SeedProduct = Omit<typeof products.$inferInsert, never>;

const P = (p: SeedProduct) => p;

const catalog: SeedProduct[] = [
  P({
    slug: "iphone-16-pro",
    name: "iPhone 16 Pro",
    category: "iphone",
    tagline: "Титан. A18 Pro. Камера Control.",
    description:
      "Флагман с титановым корпусом, чипом A18 Pro и системой Pro-камер 48 МП. Кнопка Camera Control мгновенно открывает камеру и управляет зумом, а дисплей Super Retina XDR с ProMotion 120 Гц остаётся плавным в любой задаче.",
    price: 109990,
    oldPrice: null,
    image: "/products/iphone-16-pro.jpg",
    badge: "Хит",
    colors: [
      { name: "Пустынный титан", hex: "#c8b19b" },
      { name: "Натуральный титан", hex: "#b7b1a8" },
      { name: "Белый титан", hex: "#e6e4df" },
      { name: "Чёрный титан", hex: "#3c3c3d" },
    ],
    storage: [
      { label: "128 ГБ", price: 99990 },
      { label: "256 ГБ", price: 109990 },
      { label: "512 ГБ", price: 129990 },
      { label: "1 ТБ", price: 159990 },
    ],
    specs: [
      { label: "Экран", value: "6,3″ Super Retina XDR, ProMotion 120 Гц" },
      { label: "Чип", value: "A18 Pro" },
      { label: "Камера", value: "48 + 48 + 12 МП, 5× телефото" },
      { label: "Корпус", value: "Титан, Ceramic Shield" },
      { label: "Разъём", value: "USB-C 3.0" },
      { label: "Аккумулятор", value: "До 27 часов видео" },
    ],
    inStock: true,
  }),
  P({
    slug: "iphone-16",
    name: "iPhone 16",
    category: "iphone",
    tagline: "Яркий. Мощный. Для всех.",
    description:
      "iPhone 16 с чипом A18, кнопкой Action Button и камерой 48 МП Fusion. Стекло с глубоким прокрашиванием не выгорает и не царапается, а цвет «ультрамарин» переливается на свету.",
    price: 79990,
    oldPrice: null,
    image: "/products/iphone-16.jpg",
    badge: "Новинка",
    colors: [
      { name: "Ультрамарин", hex: "#45548c" },
      { name: "Бирюзовый", hex: "#9fc8c3" },
      { name: "Розовый", hex: "#eebfc9" },
      { name: "Белый", hex: "#f2f1ec" },
      { name: "Чёрный", hex: "#3c4043" },
    ],
    storage: [
      { label: "128 ГБ", price: 79990 },
      { label: "256 ГБ", price: 89990 },
      { label: "512 ГБ", price: 109990 },
    ],
    specs: [
      { label: "Экран", value: "6,1″ Super Retina XDR" },
      { label: "Чип", value: "A18" },
      { label: "Камера", value: "48 МП Fusion + 12 МП сверхширокая" },
      { label: "Кнопки", value: "Action Button, Camera Control" },
      { label: "Разъём", value: "USB-C" },
      { label: "Аккумулятор", value: "До 22 часов видео" },
    ],
    inStock: true,
  }),
  P({
    slug: "iphone-16e",
    name: "iPhone 16e",
    category: "iphone",
    tagline: "Всё необходимое. По отличной цене.",
    description:
      "Самый доступный iPhone с чипом A18: 6,1-дюймовый OLED-экран, камера 48 МП и рекордная автономность в линейке. Идеальный первый iPhone.",
    price: 59990,
    oldPrice: null,
    image: "/products/iphone-16e.jpg",
    badge: null,
    colors: [
      { name: "Белый", hex: "#f2f1ec" },
      { name: "Чёрный", hex: "#3c4043" },
    ],
    storage: [
      { label: "128 ГБ", price: 59990 },
      { label: "256 ГБ", price: 69990 },
      { label: "512 ГБ", price: 89990 },
    ],
    specs: [
      { label: "Экран", value: "6,1″ Super Retina XDR OLED" },
      { label: "Чип", value: "A18" },
      { label: "Камера", value: "48 МП Fusion" },
      { label: "Кнопки", value: "Action Button" },
      { label: "Разъём", value: "USB-C" },
      { label: "Аккумулятор", value: "До 26 часов видео" },
    ],
    inStock: true,
  }),
  P({
    slug: "macbook-air-13",
    name: "MacBook Air 13″",
    category: "mac",
    tagline: "Чип M4. Тоньше некуда.",
    description:
      "MacBook Air с чипом M4 — самый популярный ноутбук Apple. До 18 часов без подзарядки, вес 1,24 кг и тихая работа без вентилятора. Теперь в цвете «небесно-голубой».",
    price: 119990,
    oldPrice: null,
    image: "/products/macbook-air.jpg",
    badge: "Хит",
    colors: [
      { name: "Небесно-голубой", hex: "#b6c8d3" },
      { name: "Сияющая звезда", hex: "#e3dfd3" },
      { name: "Серебристый", hex: "#d9dadb" },
      { name: "Тёмная ночь", hex: "#2e3136" },
    ],
    storage: [
      { label: "16 ГБ / 256 ГБ", price: 119990 },
      { label: "16 ГБ / 512 ГБ", price: 139990 },
      { label: "24 ГБ / 512 ГБ", price: 159990 },
    ],
    specs: [
      { label: "Экран", value: "13,6″ Liquid Retina, 500 нит" },
      { label: "Чип", value: "Apple M4, 10 ядер" },
      { label: "Память", value: "16 ГБ unified memory" },
      { label: "Вес", value: "1,24 кг" },
      { label: "Аккумулятор", value: "До 18 часов" },
      { label: "Камера", value: "12 МП Center Stage" },
    ],
    inStock: true,
  }),
  P({
    slug: "macbook-pro-14",
    name: "MacBook Pro 14″",
    category: "mac",
    tagline: "Профессиональный. Во всём.",
    description:
      "MacBook Pro с чипом M4 Pro выдерживает рендеринг, компиляцию и 8K-монтаж без подключения к розетке. Дисплей Liquid Retina XDR с яркостью 1600 нит и студийные микрофоны.",
    price: 199990,
    oldPrice: null,
    image: "/products/macbook-pro.jpg",
    badge: null,
    colors: [
      { name: "Чёрный космос", hex: "#2e3136" },
      { name: "Серебристый", hex: "#d9dadb" },
    ],
    storage: [
      { label: "M4 / 16 ГБ / 512 ГБ", price: 199990 },
      { label: "M4 / 24 ГБ / 1 ТБ", price: 229990 },
      { label: "M4 Pro / 24 ГБ / 512 ГБ", price: 269990 },
    ],
    specs: [
      { label: "Экран", value: "14,2″ Liquid Retina XDR, 120 Гц" },
      { label: "Чип", value: "Apple M4 / M4 Pro" },
      { label: "Порты", value: "3× Thunderbolt 4, HDMI, SDXC" },
      { label: "Аккумулятор", value: "До 24 часов" },
      { label: "Звук", value: "6 динамиков, пространственное аудио" },
      { label: "Камера", value: "12 МП Center Stage" },
    ],
    inStock: true,
  }),
  P({
    slug: "imac-24",
    name: "iMac 24″",
    category: "mac",
    tagline: "Яркий моноблок для всего дома.",
    description:
      "iMac с чипом M4 и дисплеем 4,5K Retina толщиной всего 11,5 мм. В комплекте — клавиатура и мышь в цвет корпуса. Центр домашней цифровой жизни.",
    price: 169990,
    oldPrice: null,
    image: "/products/imac.jpg",
    badge: null,
    colors: [
      { name: "Синий", hex: "#3f6fae" },
      { name: "Зелёный", hex: "#4f8a6b" },
      { name: "Розовый", hex: "#e58fa0" },
      { name: "Серебристый", hex: "#d9dadb" },
    ],
    storage: [
      { label: "16 ГБ / 256 ГБ", price: 169990 },
      { label: "16 ГБ / 512 ГБ", price: 189990 },
      { label: "24 ГБ / 512 ГБ", price: 209990 },
    ],
    specs: [
      { label: "Экран", value: "24″ 4,5K Retina, 500 нит" },
      { label: "Чип", value: "Apple M4, 10 ядер" },
      { label: "Толщина", value: "11,5 мм" },
      { label: "Звук", value: "6 динамиков с Dolby Atmos" },
      { label: "Камера", value: "12 МП Center Stage" },
      { label: "В комплекте", value: "Magic Keyboard + Magic Mouse" },
    ],
    inStock: true,
  }),
  P({
    slug: "mac-mini",
    name: "Mac mini",
    category: "mac",
    tagline: "Крошечный. Невероятно мощный.",
    description:
      "Mac mini с чипом M4 помещается на ладони, но заменяет полноценный рабочий компьютер. Два порта USB-C спереди, Thunderbolt 4 сзади и тихая работа под нагрузкой.",
    price: 64990,
    oldPrice: 74990,
    image: "/products/mac-mini.jpg",
    badge: "Выгода",
    colors: [{ name: "Серебристый", hex: "#d9dadb" }],
    storage: [
      { label: "16 ГБ / 256 ГБ", price: 64990 },
      { label: "16 ГБ / 512 ГБ", price: 79990 },
      { label: "24 ГБ / 512 ГБ", price: 99990 },
    ],
    specs: [
      { label: "Чип", value: "Apple M4, 10 ядер" },
      { label: "Габариты", value: "12,7 × 12,7 × 5 см" },
      { label: "Порты", value: "2× USB-C спереди, 3× Thunderbolt 4" },
      { label: "Мониторы", value: "До 3 дисплеев" },
      { label: "Сеть", value: "Gigabit Ethernet, Wi-Fi 6E" },
      { label: "Шум", value: "Практически бесшумный" },
    ],
    inStock: true,
  }),
  P({
    slug: "ipad-pro-11",
    name: "iPad Pro 11″",
    category: "ipad",
    tagline: "Невозможно тонкий. Невероятно мощный.",
    description:
      "Самый тонкий продукт Apple — 5,3 мм. Чип M4, дисплей Ultra Retina XDR с тандемным OLED и поддержка Apple Pencil Pro. В комплекте с Magic Keyboard превращается в ноутбук.",
    price: 124990,
    oldPrice: null,
    image: "/products/ipad-pro.jpg",
    badge: "Новинка",
    colors: [
      { name: "Серебристый", hex: "#d9dadb" },
      { name: "Чёрный космос", hex: "#2e3136" },
    ],
    storage: [
      { label: "256 ГБ", price: 124990 },
      { label: "512 ГБ", price: 149990 },
      { label: "1 ТБ", price: 189990 },
    ],
    specs: [
      { label: "Экран", value: "11″ Ultra Retina XDR, тандемный OLED" },
      { label: "Чип", value: "Apple M4" },
      { label: "Толщина", value: "5,3 мм" },
      { label: "Стилус", value: "Apple Pencil Pro" },
      { label: "Камера", value: "12 МП, сканер LiDAR" },
      { label: "Разъём", value: "Thunderbolt / USB 4" },
    ],
    inStock: true,
  }),
  P({
    slug: "ipad-air-11",
    name: "iPad Air 11″",
    category: "ipad",
    tagline: "Чип M3. Свобода творчества.",
    description:
      "iPad Air с чипом M3 справляется с рисованием, монтажом и играми. Поддерживает Apple Pencil Pro и Magic Keyboard — универсальный планшет для учёбы и работы.",
    price: 74990,
    oldPrice: 84990,
    image: "/products/ipad-air.jpg",
    badge: "Выгода",
    colors: [
      { name: "Синий", hex: "#9db8cc" },
      { name: "Фиолетовый", hex: "#b7aecb" },
      { name: "Сияющая звезда", hex: "#e3dfd3" },
      { name: "Серый космос", hex: "#7d7f82" },
    ],
    storage: [
      { label: "128 ГБ", price: 74990 },
      { label: "256 ГБ", price: 89990 },
      { label: "512 ГБ", price: 114990 },
    ],
    specs: [
      { label: "Экран", value: "11″ Liquid Retina" },
      { label: "Чип", value: "Apple M3" },
      { label: "Стилус", value: "Apple Pencil Pro" },
      { label: "Камера", value: "12 МП широкоугольная" },
      { label: "Разъём", value: "USB-C" },
      { label: "Аккумулятор", value: "До 10 часов" },
    ],
    inStock: true,
  }),
  P({
    slug: "watch-ultra-2",
    name: "Apple Watch Ultra 2",
    category: "watch",
    tagline: "Для приключений. И подвигов.",
    description:
      "Титановый корпус 49 мм, самый яркий дисплей Apple Watch (3000 нит), до 72 часов работы в режиме энергосбережения и точный двухчастотный GPS. Готовы к марафону и к океану.",
    price: 89990,
    oldPrice: null,
    image: "/products/watch-ultra.jpg",
    badge: null,
    colors: [
      { name: "Титан + оранжевый ремешок", hex: "#e8611c" },
      { name: "Чёрный титан", hex: "#3c3c3d" },
    ],
    storage: [{ label: "49 мм, GPS + Cellular", price: 89990 }],
    specs: [
      { label: "Корпус", value: "49 мм, титан" },
      { label: "Экран", value: "До 3000 нит, Always-On" },
      { label: "Аккумулятор", value: "До 36 часов (72 в эко-режиме)" },
      { label: "GPS", value: "Двухчастотный L1 + L5" },
      { label: "Защита", value: "WR100, EN13319 для дайвинга" },
      { label: "Кнопка", value: "Action Button, настраиваемая" },
    ],
    inStock: true,
  }),
  P({
    slug: "watch-10",
    name: "Apple Watch Series 10",
    category: "watch",
    tagline: "Тоньше. Ярче. Умнее.",
    description:
      "Самые тонкие Apple Watch с самым большим экраном. Отслеживают сон, ЭКГ, температуру и апноэ, заряжаются до 80% за 30 минут.",
    price: 44990,
    oldPrice: 49990,
    image: "/products/watch-10.jpg",
    badge: "Хит",
    colors: [
      { name: "Глянцевый чёрный", hex: "#2b2b2d" },
      { name: "Розовое золото", hex: "#e3c4bb" },
      { name: "Серебристый", hex: "#d9dadb" },
    ],
    storage: [
      { label: "42 мм, GPS", price: 44990 },
      { label: "46 мм, GPS", price: 48990 },
      { label: "46 мм, GPS + Cellular", price: 59990 },
    ],
    specs: [
      { label: "Корпус", value: "42 или 46 мм, алюминий" },
      { label: "Экран", value: "Wide-Angle OLED, Always-On" },
      { label: "Здоровье", value: "ЭКГ, SpO₂, температура, апноэ" },
      { label: "Зарядка", value: "80% за 30 минут" },
      { label: "Защита", value: "WR50, плавание" },
      { label: "Аккумулятор", value: "До 18 часов" },
    ],
    inStock: true,
  }),
  P({
    slug: "airpods-pro-2",
    name: "AirPods Pro 2",
    category: "airpods",
    tagline: "Тишина. По нажатию.",
    description:
      "Активное шумоподавление вдвое сильнее предыдущего поколения, адаптивный звук и режим слухового аппарата. Кейс с динамиком, USB-C и защитой IP54.",
    price: 22990,
    oldPrice: 27990,
    image: "/products/airpods-pro.jpg",
    badge: "Хит",
    colors: [{ name: "Белый", hex: "#f2f1ec" }],
    storage: [{ label: "Кейс USB-C MagSafe", price: 22990 }],
    specs: [
      { label: "Шумоподавление", value: "Активное, до 2× сильнее" },
      { label: "Чип", value: "Apple H2" },
      { label: "Режимы", value: "Прозрачность, адаптивный, разговор" },
      { label: "Аккумулятор", value: "6 ч + 24 ч с кейсом" },
      { label: "Защита", value: "IP54, пыль и брызги" },
      { label: "Здоровье", value: "Тест слуха, режим слухового аппарата" },
    ],
    inStock: true,
  }),
  P({
    slug: "airpods-max",
    name: "AirPods Max",
    category: "airpods",
    tagline: "Полноразмерный звук. Без компромиссов.",
    description:
      "Накладные наушники с вычислительным аудио: динамические драйверы 40 мм, персонализированное пространственное аудио и до 20 часов работы. Чашки из анодированного алюминия.",
    price: 64990,
    oldPrice: null,
    image: "/products/airpods-max.jpg",
    badge: null,
    colors: [
      { name: "Тёмная ночь", hex: "#2e3136" },
      { name: "Сияющая звезда", hex: "#e3dfd3" },
      { name: "Голубой", hex: "#3f6fae" },
      { name: "Фиолетовый", hex: "#b7aecb" },
      { name: "Оранжевый", hex: "#e8611c" },
    ],
    storage: [{ label: "USB-C", price: 64990 }],
    specs: [
      { label: "Драйверы", value: "40 мм, динамические" },
      { label: "Чип", value: "Apple H1 ×2" },
      { label: "Аудио", value: "Пространственное, Dolby Atmos" },
      { label: "Шумоподавление", value: "Активное + прозрачность" },
      { label: "Аккумулятор", value: "До 20 часов" },
      { label: "Управление", value: "Digital Crown" },
    ],
    inStock: true,
  }),
  P({
    slug: "homepod-mini",
    name: "HomePod mini",
    category: "accessories",
    tagline: "Маленький. Звучит по-большому.",
    description:
      "Умная колонка с 360-градусным звуком и Siri. Управляет умным домом, распознаёт голоса всей семьи и объединяется в стереопару.",
    price: 11990,
    oldPrice: null,
    image: "/products/homepod-mini.jpg",
    badge: null,
    colors: [
      { name: "Оранжевый", hex: "#e8611c" },
      { name: "Синий", hex: "#3f6fae" },
      { name: "Жёлтый", hex: "#e8c95a" },
      { name: "Белый", hex: "#f2f1ec" },
      { name: "Тёмная ночь", hex: "#2e3136" },
    ],
    storage: [{ label: "Стандарт", price: 11990 }],
    specs: [
      { label: "Звук", value: "360°, вычислительное аудио" },
      { label: "Ассистент", value: "Siri, распознавание голосов" },
      { label: "Умный дом", value: "HomeKit, Matter, Thread" },
      { label: "Размер", value: "84 × 98 мм" },
      { label: "Стереопара", value: "Два HomePod mini" },
      { label: "Датчики", value: "Температура и влажность" },
    ],
    inStock: true,
  }),
  P({
    slug: "airtag",
    name: "AirTag",
    category: "accessories",
    tagline: "Потерять вещь больше не получится.",
    description:
      "Метка с чипом U1 и сверхширокополосным поиском: находит ключи, рюкзак и багаж с точностью до сантиметра. Батарейка работает больше года.",
    price: 3990,
    oldPrice: null,
    image: "/products/airtag.jpg",
    badge: null,
    colors: [{ name: "Белый / сталь", hex: "#e8e6e1" }],
    storage: [
      { label: "1 шт", price: 3990 },
      { label: "4 шт", price: 12990 },
    ],
    specs: [
      { label: "Поиск", value: "UWB, точное определение" },
      { label: "Сеть", value: "«Локатор» — миллионы устройств" },
      { label: "Батарея", value: "CR2032, больше года" },
      { label: "Защита", value: "IP67" },
      { label: "Динамик", value: "Встроенный" },
      { label: "Гравировка", value: "Бесплатно при заказе" },
    ],
    inStock: true,
  }),
];

async function main() {
  const db = getDb();
  console.log("Clearing products...");
  await db.delete(products);
  console.log(`Seeding ${catalog.length} products...`);
  await db.insert(products).values(catalog);
  console.log("Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export type { InsertUser };
