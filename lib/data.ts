/**
 * House of Parampara: central content and pricing config.
 *
 * The business owner can edit product names, descriptions, prices and default
 * selections here in one place. All prices are in Indian Rupees.
 *
 * ---------------------------------------------------------------------------
 * PRICES ARE THE PRODUCT ONLY.
 *
 * Confirmed by the owner: basic primary packing is INCLUDED in the price
 * shown. There is no separate packaging fee, and the builder must not add one.
 * Anything beyond basic packing is an extra that will be listed separately
 * once it is decided.
 * ---------------------------------------------------------------------------
 */

export type HamperItem = {
  id: string
  name: string
  description: string
  price: number
  /** Ticked when the builder first opens. */
  defaultChecked: boolean
  image: string
  alt: string
}

export type SubHamper = {
  id: string
  name: string
  intro: string
  items: HamperItem[]
}

export type Collection = {
  id: string
  name: string
  tagline: string
  intro: string
  image: string
  alt: string
  /**
   * Whether this collection appears on the site.
   *
   * The owner has real products for the Legacy Collection only. The other four
   * still hold invented names and invented prices from the original demo, so
   * they are unpublished rather than deleted: the structure is kept so they can
   * be switched back on one line at a time as real products arrive.
   *
   * Owner: "Others will be updated soon. First let's proceed with legacy
   * collections."
   */
  published: boolean
  subHampers: SubHamper[]
}

/*
 * A shared description. Every Legacy piece is the same kind of object, so the
 * copy is written once rather than repeated six times with slight drift.
 *
 * The owner's own words: "Beautifully Handcrafted brass and copper alloy based
 * Kumkum boxes that can be passed over legacies."
 */
const LEGACY_DESCRIPTION =
  'Handcrafted in brass and copper alloy, made to be kept and passed on.'

/**
 * The Legacy Collection.
 *
 * Six separate products. A customer ticks the ones they want, sets a quantity
 * for each, and sends the whole order on WhatsApp.
 *
 * NAMES. Supplied by the owner as a price list, so each name was matched to a
 * photograph by its price. The owner separately confirmed LC1 is the Lakshmi
 * Kumkum Chest, which settles the only ambiguity: two products share the 1299
 * price.
 *
 * The match was then CHECKED against what is actually visible in each
 * photograph rather than trusted on price alone. Three names describe their
 * subject and all three agree:
 *
 *   lc-4 "Chariot"  -> the piece on wheels drawn by elephants
 *   lc-5 "Peacock"  -> the piece with peacocks fanned around the lid
 *   lc-6 "Vinayakar" -> the piece with Ganesha seated on the lid
 *
 * Three independent confirmations from a six item list is good evidence the
 * price ordering is right, not a coincidence.
 */
const LEGACY_ITEMS: HamperItem[] = [
  { id: 'lc-1', name: 'Lakshmi Kumkum Chest', price: 1299, image: '/images/legacy/lc-1.jpg' },
  { id: 'lc-2', name: 'Vaibhavam Kumkum Chest', price: 2099, image: '/images/legacy/lc-2.jpg' },
  { id: 'lc-3', name: 'Lakshmi Treasure Chest', price: 1699, image: '/images/legacy/lc-3.jpg' },
  { id: 'lc-4', name: 'Lakshmi Chariot Chest', price: 2599, image: '/images/legacy/lc-4.jpg' },
  { id: 'lc-5', name: 'Peacock Kumkum Chest', price: 1499, image: '/images/legacy/lc-5.jpg' },
  { id: 'lc-6', name: 'Vinayakar Kumkum Chest', price: 1299, image: '/images/legacy/lc-6.jpg' },
].map((p) => ({
  ...p,
  description: LEGACY_DESCRIPTION,
  /*
   * Nothing is ticked by default.
   *
   * These are six separate products at 1299 to 2599 each, not components of a
   * single hamper. Pre-ticking any of them would put money in someone's basket
   * that they did not choose to put there, and pre-ticking all six would show
   * an opening total of 10,494.
   */
  defaultChecked: false,
  alt: `${p.name}, handcrafted in brass and copper alloy, held in an open palm`,
}))

export const collections: Collection[] = [
  {
    id: 'legacy-collection',
    name: 'Legacy Collection',
    tagline: 'Kumkum boxes made to be passed on.',
    intro:
      'Beautifully handcrafted kumkum boxes in brass and copper alloy, made to be kept, used and handed down. Choose the pieces you want and tell us how many of each.',
    image: '/images/legacy/lc-1.jpg',
    alt: 'A handcrafted brass and copper alloy kumkum box held in an open palm',
    published: true,
    subHampers: [
      {
        id: 'legacy-kumkum-boxes',
        name: 'Kumkum boxes',
        intro:
          'Every piece is handcrafted, so no two are identical. Tick the ones you would like and set a quantity for each.',
        items: LEGACY_ITEMS,
      },
    ],
  },

  /*
   * ------------------------------------------------------------------------
   * NOT PUBLISHED YET.
   *
   * Everything below is placeholder content from the original demo: invented
   * names, invented descriptions, invented prices. It is kept so the shape of
   * a second collection is ready to fill in, and it is hidden so a customer
   * can never tick an item that does not exist.
   *
   * To publish one: replace its content with real products and set
   * `published: true`.
   * ------------------------------------------------------------------------
   */
  {
    id: 'heritage-gifting-collections',
    name: 'Collection 2',
    tagline: 'Placeholder tagline for collection 2.',
    intro: 'Placeholder introduction for collection 2.',
    image: '/images/placeholder.svg',
    alt: 'Product photograph coming soon',
    published: false,
    subHampers: [
      {
        id: 'guru-purnima-series',
        name: 'Hamper 3',
        intro: 'Placeholder introduction for hamper 3.',
        items: [],
      },
    ],
  },
  {
    id: 'timeless-bonds-collection',
    name: 'Collection 3',
    tagline: 'Placeholder tagline for collection 3.',
    intro: 'Placeholder introduction for collection 3.',
    image: '/images/placeholder.svg',
    alt: 'Product photograph coming soon',
    published: false,
    subHampers: [
      {
        id: 'timeless-bonds-keepsake',
        name: 'Hamper 5',
        intro: 'Placeholder introduction for hamper 5.',
        items: [],
      },
    ],
  },
  {
    id: 'everyday-tradition-revivals',
    name: 'Collection 4',
    tagline: 'Placeholder tagline for collection 4.',
    intro: 'Placeholder introduction for collection 4.',
    image: '/images/placeholder.svg',
    alt: 'Product photograph coming soon',
    published: false,
    subHampers: [
      {
        id: 'everyday-revivals',
        name: 'Hamper 6',
        intro: 'Placeholder introduction for hamper 6.',
        items: [],
      },
    ],
  },
  {
    id: 'limited-edition-experience-kits',
    name: 'Collection 5',
    tagline: 'Placeholder tagline for collection 5.',
    intro: 'Placeholder introduction for collection 5.',
    image: '/images/placeholder.svg',
    alt: 'Product photograph coming soon',
    published: false,
    subHampers: [
      {
        id: 'experience-kits',
        name: 'Hamper 7',
        intro: 'Placeholder introduction for hamper 7.',
        items: [],
      },
    ],
  },
]

/**
 * The collections a customer actually sees.
 *
 * Every component should import THIS, not `collections`. Importing the raw
 * list is how a placeholder leaks onto the page.
 */
export const publishedCollections = collections.filter((c) => c.published)
