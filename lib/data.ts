/**
 * House of Parampara — central content & pricing config.
 * Business owners can edit item names, descriptions, prices, packaging fees,
 * and default selections here in one place.
 * All prices are in Indian Rupees (₹). Demo placeholders within stated tiers.
 */

export type HamperItem = {
  id: string
  name: string
  description: string
  price: number
  defaultChecked: boolean
  image: string
  alt: string
}

export type SubHamper = {
  id: string
  name: string
  intro: string
  items: HamperItem[]
  packagingFee: number
}

export type Collection = {
  id: string
  name: string
  tagline: string
  intro: string
  image: string
  alt: string
  subHampers: SubHamper[]
}

export const collections: Collection[] = [
  {
    id: 'memory-keepsake-boxes',
    name: 'Memory Keepsake Boxes',
    tagline: 'Small boxes, full of big memories.',
    intro:
      'Small boxes, full of big memories — designed to bring back the quiet rituals of childhood and home.',
    image: '/images/collection-keepsake.png',
    alt: 'A handcrafted keepsake box with a brass diya and dried jasmine, lit by warm evening light',
    subHampers: [
      {
        id: 'grandmothers-evening-ritual-box',
        name: "Grandmother's Evening Ritual Box",
        intro:
          'The quiet ritual of dusk at home — a lamp lit, a fragrance in the air, a pattern traced at the threshold.',
        packagingFee: 200,
        items: [
          {
            id: 'brass-diya',
            name: 'Brass Diya',
            description:
              'A small handcrafted brass lamp, just like the one that lit up dusk at home',
            price: 350,
            defaultChecked: true,
            image: '/images/item-brass-diya.png',
            alt: 'A small brass diya oil lamp glowing softly at dusk',
          },
          {
            id: 'cotton-wicks',
            name: 'Hand-Rolled Cotton Wicks (set of 5)',
            description: 'Soft cotton wicks, rolled by hand the traditional way',
            price: 50,
            defaultChecked: true,
            image: '/images/item-cotton-wicks.png',
            alt: 'Hand-rolled white cotton wicks arranged on a warm linen cloth',
          },
          {
            id: 'jasmine-sachet',
            name: 'Jasmine-Scented Dried Flower Sachet',
            description: 'The fragrance that filled the evening air',
            price: 120,
            defaultChecked: true,
            image: '/images/item-jasmine-sachet.png',
            alt: 'A small cloth sachet beside fresh white jasmine flowers',
          },
          {
            id: 'kolam-stencil',
            name: 'Hand-Carved Kolam Stencil',
            description: 'Trace the patterns your grandmother drew at sunrise',
            price: 150,
            defaultChecked: true,
            image: '/images/item-kolam-stencil.png',
            alt: 'A hand-carved wooden kolam stencil with an intricate pattern',
          },
          {
            id: 'story-card',
            name: 'Handwritten-Style Story Card',
            description: 'The memory behind this box, told gently',
            price: 80,
            defaultChecked: true,
            image: '/images/item-story-card.png',
            alt: 'A handwritten-style story card on textured khadi paper',
          },
        ],
      },
      {
        id: 'childhood-summer-box',
        name: 'Childhood Summer Box',
        intro:
          'Long, lazy afternoons at the grandparents’ home — games, sweets, and little stories.',
        packagingFee: 200,
        items: [
          {
            id: 'mango-wood-puzzle',
            name: 'Mango Wood Traditional Games Puzzle',
            description:
              'Hand-carved games once played through long summer afternoons',
            price: 450,
            defaultChecked: true,
            image: '/images/item-mango-puzzle.png',
            alt: 'A hand-carved mango wood traditional puzzle game',
          },
          {
            id: 'dry-fruit-mix',
            name: 'Prasadam-Inspired Dry Fruit Mix',
            description: 'A sweet taste of festival mornings',
            price: 300,
            defaultChecked: true,
            image: '/images/item-dryfruit-mix.png',
            alt: 'A small brass bowl of mixed dry fruits and nuts',
          },
          {
            id: 'illustrated-storybooklet',
            name: 'Illustrated Storybooklet',
            description:
              'Little stories of summers spent at grandparents’ homes',
            price: 150,
            defaultChecked: true,
            image: '/images/item-storybooklet.png',
            alt: 'An illustrated storybooklet with warm-toned cover art',
          },
        ],
      },
    ],
  },
  {
    id: 'heritage-gifting-collections',
    name: 'Heritage Gifting Collections',
    tagline: 'For the occasions that matter most.',
    intro:
      'For the occasions that matter most — gifts that honour guidance, gratitude, and grace.',
    image: '/images/collection-heritage.png',
    alt: 'An embroidered potli pouch and sandalwood pieces arranged for a festive gift',
    subHampers: [
      {
        id: 'guru-purnima-series',
        name: 'Guru Purnima Series',
        intro:
          'A gift of gratitude — for the mentors and teachers who quietly shaped who we are.',
        packagingFee: 200,
        items: [
          {
            id: 'embroidered-potli',
            name: 'Hand-Embroidered Potli',
            description: 'A soft pouch, embroidered by hand with quiet care',
            price: 250,
            defaultChecked: true,
            image: '/images/item-potli.png',
            alt: 'A hand-embroidered drawstring potli pouch in warm tones',
          },
          {
            id: 'sandalwood-set',
            name: 'Sandalwood Item Set',
            description: 'The calming scent of sandalwood, just as it should be',
            price: 400,
            defaultChecked: true,
            image: '/images/item-sandalwood.png',
            alt: 'Sandalwood pieces and shavings on a warm surface',
          },
          {
            id: 'gratitude-notebook',
            name: 'Guru Dakshina-Inspired Notebook',
            description: 'With space for a note of gratitude',
            price: 300,
            defaultChecked: true,
            image: '/images/item-notebook.png',
            alt: 'A handmade notebook with a textured cover and gold detail',
          },
        ],
      },
      {
        id: 'varalakshmi-festive-return-gift',
        name: 'Varalakshmi / Festive Return Gift',
        intro:
          'A small token of blessing — exchanged between hands on a festive morning.',
        packagingFee: 150,
        items: [
          {
            id: 'tamboolam-box',
            name: 'Mini Tamboolam Box (Betel Leaf Motif)',
            description: 'A small box that carries a big tradition',
            price: 200,
            defaultChecked: true,
            image: '/images/item-tamboolam.png',
            alt: 'A small tamboolam box with a betel leaf motif',
          },
          {
            id: 'kumkum-haldi-set',
            name: 'Kumkum & Haldi Set',
            description: 'For the blessing exchanged between hands',
            price: 80,
            defaultChecked: true,
            image: '/images/item-kumkum-haldi.png',
            alt: 'Small dishes of red kumkum and yellow haldi powder',
          },
          {
            id: 'silver-keepsake',
            name: 'Small Silver-Plated Keepsake',
            description: 'A little something to be kept, not used',
            price: 600,
            defaultChecked: true,
            image: '/images/item-silver-keepsake.png',
            alt: 'A small silver-plated keepsake bowl with delicate detail',
          },
        ],
      },
    ],
  },
  {
    id: 'timeless-bonds-collection',
    name: 'Timeless Bonds Collection',
    tagline: 'A gift that asks a question, and keeps the answer forever.',
    intro:
      'A gift that asks a question, and keeps the answer forever — turning a present into a family heirloom in the making.',
    image: '/images/collection-bonds.png',
    alt: 'A fabric-wrapped recipe keepsake book beside a framed memory prompt',
    subHampers: [
      {
        id: 'timeless-bonds-keepsake',
        name: 'Timeless Bonds Keepsake',
        intro:
          'A present that becomes a family heirloom — waiting to be filled with the recipes and stories you carry.',
        packagingFee: 150,
        items: [
          {
            id: 'framed-memory-prompt',
            name: 'Framed Memory Prompt — “Write the Recipe Your Mother Taught You”',
            description: 'A framed keepsake with space to fill in, by hand',
            price: 650,
            defaultChecked: true,
            image: '/images/item-framed-prompt.png',
            alt: 'A framed memory prompt keepsake with handwriting space',
          },
          {
            id: 'recipe-keepsake-book',
            name: 'Fabric-Wrapped Recipe Keepsake Book',
            description:
              'Wrapped in soft cotton, ready to hold generations of recipes',
            price: 550,
            defaultChecked: true,
            image: '/images/item-recipe-book.png',
            alt: 'A recipe keepsake book wrapped in soft cotton fabric',
          },
        ],
      },
    ],
  },
  {
    id: 'everyday-tradition-revivals',
    name: 'Everyday Tradition Revivals',
    tagline: 'Small everyday objects, quietly reimagined.',
    intro:
      'Small everyday objects, quietly reimagined — for the corners of home where tradition still lives.',
    image: '/images/collection-everyday.png',
    alt: 'A hand-painted lotus diya and a woven scarf arranged on a warm surface',
    subHampers: [
      {
        id: 'everyday-revivals',
        name: 'Everyday Revivals',
        intro:
          'Pick the pieces that speak to you — small, daily objects carrying a quiet bit of tradition.',
        packagingFee: 150,
        items: [
          {
            id: 'hand-painted-diya',
            name: 'Hand-Painted Diya (Lotus Motif)',
            description: 'A diya, gently hand-painted with a lotus pattern',
            price: 300,
            defaultChecked: true,
            image: '/images/item-painted-diya.png',
            alt: 'A hand-painted clay diya decorated with a lotus motif',
          },
          {
            id: 'embroidered-lampshade',
            name: 'Embroidered Lampshade (Kolam Pattern)',
            description: 'Soft light, filtered through hand-stitched patterns',
            price: 700,
            defaultChecked: true,
            image: '/images/item-lampshade.png',
            alt: 'An embroidered lampshade with a kolam-inspired pattern glowing softly',
          },
          {
            id: 'memory-woven-scarf',
            name: 'Memory-Woven Scarf (Saree Pallu Inspired)',
            description:
              'A scarf woven with a quiet quote, inspired by a saree’s pallu',
            price: 1200,
            defaultChecked: true,
            image: '/images/item-scarf.png',
            alt: 'A handwoven scarf with a saree-pallu inspired border',
          },
          {
            id: 'brass-bell-qr',
            name: 'Brass Bell with Audio QR Story',
            description:
              'Scan to hear a grandmother’s voice, narrating a memory',
            price: 450,
            defaultChecked: false,
            image: '/images/item-brass-bell.png',
            alt: 'A small brass bell with a tag carrying an audio QR code',
          },
          {
            id: 'kumkum-holder',
            name: 'Brass/Terracotta Kumkum Holder',
            description: 'A small holder for a small, daily ritual',
            price: 250,
            defaultChecked: false,
            image: '/images/item-kumkum-holder.png',
            alt: 'A small terracotta and brass kumkum holder',
          },
        ],
      },
    ],
  },
  {
    id: 'limited-edition-experience-kits',
    name: 'Limited Edition Experience Kits',
    tagline: 'For when a gift should feel like an experience.',
    intro:
      'For when a gift should feel like an experience — physical keepsakes paired with stories meant to be added to, and passed on.',
    image: '/images/collection-kits.png',
    alt: 'A curated festival ritual kit laid out as an experience gift',
    subHampers: [
      {
        id: 'experience-kits',
        name: 'Experience Kits',
        intro:
          'Keepsakes paired with stories meant to be added to — and passed gently to the next person.',
        packagingFee: 300,
        items: [
          {
            id: 'festival-ritual-kit',
            name: 'Festival Ritual Kit + Digital Memory Journal',
            description:
              'Physical ritual items, paired with prompts for your own digital memory journal',
            price: 2500,
            defaultChecked: true,
            image: '/images/item-ritual-kit.png',
            alt: 'A festival ritual kit laid out with ritual items and a journal',
          },
          {
            id: 'pass-it-on-kit',
            name: '“Pass It On” Story Kit',
            description:
              'A keepsake with space for the giver to add their own family story, for the next person to discover',
            price: 3000,
            defaultChecked: true,
            image: '/images/item-passiton-kit.png',
            alt: 'A “Pass It On” story kit with space to add a family story',
          },
        ],
      },
    ],
  },
]
