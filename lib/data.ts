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

export type ItemOption = {
  label: string
  price: number
}

export type HamperItem = {
  id: string
  name: string
  description: string
  price: number
  /**
   * Size variants, shown as one card with a dropdown.
   *
   * When present, the card offers each option (for example 4 inch and
   * 5 inch) and the running total uses the chosen option price.
   * `price` stays as the fallback so items without options keep working.
   */
  options?: ItemOption[]
  /** Ticked when the builder first opens. */
  defaultChecked: boolean
  image: string
  alt: string
}

/** Unit price of an item for a given option label, or its base price. */
export function optionPrice(item: HamperItem, label?: string): number {
  if (!item.options || item.options.length === 0) return item.price
  if (!label) return item.options[0].price
  return item.options.find((o) => o.label === label)?.price ?? item.options[0].price
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
   * Pilot: the first 12 Pichwai jars (catalog page 01).
   *
   * Photos are grid slices from HouseOfParampara_Catalog.pdf, saved as
   * public/images/catalog/pj-01.jpg through pj-12.jpg. Each jar comes in
   * two sizes, 4 inch at 106 and 5 inch at 156, so one card carries a
   * size dropdown rather than two near identical cards.
   *
   * Names stay as design codes. Fancy invented names beside real prices
   * would be fiction, and the catalog itself names nothing but size
   * and price.
   */
  {
    id: 'pichwai-jars',
    name: 'Pichwai Jars',
    tagline: 'Handpainted jars in two sizes.',
    intro:
      'Twelve handmade Pichwai jars from the catalog. Pick a design, choose 4 inch or 5 inch, set how many, and send the order on WhatsApp.',
    image: '/images/catalog/pj-01.jpg',
    alt: 'A handmade Pichwai jar with cow print and a crystal knob lid',
    published: true,
    subHampers: [
      {
        id: 'pichwai-jar-4-5',
        name: '4 inch and 5 inch jars',
        intro:
          'Every design below comes in 4 inch at Rs. 106 and 5 inch at Rs. 156. Choose the size on the card, then set the quantity.',
        items: [
          ...[
          { id: 'pj-01', code: 'PJ-01', color: 'magenta cow and arch print' },
          { id: 'pj-02', code: 'PJ-02', color: 'blue medallion with cows' },
          { id: 'pj-03', code: 'PJ-03', color: 'red with white cow' },
          { id: 'pj-04', code: 'PJ-04', color: 'mustard yellow with white cow' },
          { id: 'pj-05', code: 'PJ-05', color: 'green medallion with cow' },
          { id: 'pj-06', code: 'PJ-06', color: 'pink pattern with white cow' },
          { id: 'pj-07', code: 'PJ-07', color: 'turquoise with cow and lotus' },
          { id: 'pj-08', code: 'PJ-08', color: 'white with orange florals' },
          { id: 'pj-09', code: 'PJ-09', color: 'white with pink florals' },
          { id: 'pj-10', code: 'PJ-10', color: 'blue with cow medallion' },
          { id: 'pj-11', code: 'PJ-11', color: 'white with pink lotus' },
          { id: 'pj-12', code: 'PJ-12', color: 'orange with pink florals' },
        ].map((p) => ({
          id: p.id,
          name: `Pichwai Jar ${p.code}`,
          description: `Handmade Pichwai jar, ${p.color}. Lid with crystal knob included.`,
          price: 106,
          options: [
            { label: '4"', price: 106 },
            { label: '5"', price: 156 },
          ],
          defaultChecked: false,
          image: `/images/catalog/${p.id}.jpg`,
          alt: `Pichwai jar ${p.code}, ${p.color}, lidded`,
        })),
          { id: 'pj-13', name: 'Pichwai Jar PJ-13', description: 'Handmade Pichwai jar, catalog design PJ-13, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-13.jpg', alt: 'Pichwai jar PJ-13, lidded, catalog photo' },
          { id: 'pj-14', name: 'Pichwai Jar PJ-14', description: 'Handmade Pichwai jar, catalog design PJ-14, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-14.jpg', alt: 'Pichwai jar PJ-14, lidded, catalog photo' },
          { id: 'pj-15', name: 'Pichwai Jar PJ-15', description: 'Handmade Pichwai jar, catalog design PJ-15, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-15.jpg', alt: 'Pichwai jar PJ-15, lidded, catalog photo' },
          { id: 'pj-16', name: 'Pichwai Jar PJ-16', description: 'Handmade Pichwai jar, catalog design PJ-16, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-16.jpg', alt: 'Pichwai jar PJ-16, lidded, catalog photo' },
          { id: 'pj-17', name: 'Pichwai Jar PJ-17', description: 'Handmade Pichwai jar, catalog design PJ-17, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-17.jpg', alt: 'Pichwai jar PJ-17, lidded, catalog photo' },
          { id: 'pj-18', name: 'Pichwai Jar PJ-18', description: 'Handmade Pichwai jar, catalog design PJ-18, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-18.jpg', alt: 'Pichwai jar PJ-18, lidded, catalog photo' },
          { id: 'pj-19', name: 'Pichwai Jar PJ-19', description: 'Handmade Pichwai jar, catalog design PJ-19, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-19.jpg', alt: 'Pichwai jar PJ-19, lidded, catalog photo' },
          { id: 'pj-20', name: 'Pichwai Jar PJ-20', description: 'Handmade Pichwai jar, catalog design PJ-20, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-20.jpg', alt: 'Pichwai jar PJ-20, lidded, catalog photo' },
          { id: 'pj-21', name: 'Pichwai Jar PJ-21', description: 'Handmade Pichwai jar, catalog design PJ-21, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-21.jpg', alt: 'Pichwai jar PJ-21, lidded, catalog photo' },
          { id: 'pj-22', name: 'Pichwai Jar PJ-22', description: 'Handmade Pichwai jar, catalog design PJ-22, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-22.jpg', alt: 'Pichwai jar PJ-22, lidded, catalog photo' },
          { id: 'pj-23', name: 'Pichwai Jar PJ-23', description: 'Handmade Pichwai jar, catalog design PJ-23, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-23.jpg', alt: 'Pichwai jar PJ-23, lidded, catalog photo' },
          { id: 'pj-24', name: 'Pichwai Jar PJ-24', description: 'Handmade Pichwai jar, catalog design PJ-24, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-24.jpg', alt: 'Pichwai jar PJ-24, lidded, catalog photo' },
          { id: 'pj-25', name: 'Pichwai Jar PJ-25', description: 'Handmade Pichwai jar, catalog design PJ-25, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-25.jpg', alt: 'Pichwai jar PJ-25, lidded, catalog photo' },
          { id: 'pj-26', name: 'Pichwai Jar PJ-26', description: 'Handmade Pichwai jar, catalog design PJ-26, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-26.jpg', alt: 'Pichwai jar PJ-26, lidded, catalog photo' },
          { id: 'pj-27', name: 'Pichwai Jar PJ-27', description: 'Handmade Pichwai jar, catalog design PJ-27, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-27.jpg', alt: 'Pichwai jar PJ-27, lidded, catalog photo' },
          { id: 'pj-28', name: 'Pichwai Jar PJ-28', description: 'Handmade Pichwai jar, catalog design PJ-28, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-28.jpg', alt: 'Pichwai jar PJ-28, lidded, catalog photo' },
          { id: 'pj-29', name: 'Pichwai Jar PJ-29', description: 'Handmade Pichwai jar, catalog design PJ-29, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-29.jpg', alt: 'Pichwai jar PJ-29, lidded, catalog photo' },
          { id: 'pj-30', name: 'Pichwai Jar PJ-30', description: 'Handmade Pichwai jar, catalog design PJ-30, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-30.jpg', alt: 'Pichwai jar PJ-30, lidded, catalog photo' },
          { id: 'pj-31', name: 'Pichwai Jar PJ-31', description: 'Handmade Pichwai jar, catalog design PJ-31, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-31.jpg', alt: 'Pichwai jar PJ-31, lidded, catalog photo' },
          { id: 'pj-32', name: 'Pichwai Jar PJ-32', description: 'Handmade Pichwai jar, catalog design PJ-32, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-32.jpg', alt: 'Pichwai jar PJ-32, lidded, catalog photo' },
          { id: 'pj-72', name: 'Pichwai Jar PJ-72', description: 'Handmade Pichwai jar, catalog design PJ-72, with lid.', price: 106, options: [{ label: '4"', price: 106 }, { label: '5"', price: 156 }], defaultChecked: false, image: '/images/catalog/pj-72.jpg', alt: 'Pichwai jar PJ-72, lidded, catalog photo' },
        ],
      },
      {
        id: 'pichwai-solids',
        name: 'Solids and ribbed',
        intro:
          'Solid colors, ribbed bodies and metal lids. Single sizes except where the card offers a choice.',
        items: [
          { id: 'pj-33', name: 'Pichwai Jar PJ-33', description: 'Ribbed jar with gold lid, catalog design PJ-33.', price: 111, options: [{ label: '4"', price: 111 }, { label: '5"', price: 161 }], defaultChecked: false, image: '/images/catalog/pj-33.jpg', alt: 'Ribbed jar PJ-33 with gold lid, catalog photo' },
          { id: 'pj-34', name: 'Pichwai Jar PJ-34', description: 'Marbled jar with lid, catalog design PJ-34.', price: 124, defaultChecked: false, image: '/images/catalog/pj-34.jpg', alt: 'Marbled jar PJ-34, lidded, catalog photo' },
          { id: 'pj-35', name: 'Pichwai Jar PJ-35', description: 'Marbled jar with lid, catalog design PJ-35.', price: 124, defaultChecked: false, image: '/images/catalog/pj-35.jpg', alt: 'Marbled jar PJ-35, lidded, catalog photo' },
          { id: 'pj-36', name: 'Pichwai Jar PJ-36', description: 'Marbled jar with lid, catalog design PJ-36.', price: 124, defaultChecked: false, image: '/images/catalog/pj-36.jpg', alt: 'Marbled jar PJ-36, lidded, catalog photo' },
          { id: 'pj-37', name: 'Pichwai Jar PJ-37', description: 'Ribbed jar with metal lid, catalog design PJ-37.', price: 124, defaultChecked: false, image: '/images/catalog/pj-37.jpg', alt: 'Ribbed jar PJ-37 with metal lid, catalog photo' },
          { id: 'pj-38', name: 'Pichwai Jar PJ-38', description: 'Ribbed jar with metal lid, catalog design PJ-38.', price: 124, defaultChecked: false, image: '/images/catalog/pj-38.jpg', alt: 'Ribbed jar PJ-38 with metal lid, catalog photo' },
          { id: 'pj-39', name: 'Pichwai Jar PJ-39', description: 'Ribbed jar with metal lid, catalog design PJ-39.', price: 124, defaultChecked: false, image: '/images/catalog/pj-39.jpg', alt: 'Ribbed jar PJ-39 with metal lid, catalog photo' },
          { id: 'pj-40', name: 'Pichwai Jar PJ-40', description: 'Ribbed jar with metal lid, catalog design PJ-40.', price: 124, defaultChecked: false, image: '/images/catalog/pj-40.jpg', alt: 'Ribbed jar PJ-40 with metal lid, catalog photo' },
          { id: 'pj-41', name: 'Pichwai Jar PJ-41', description: 'Ribbed jar with metal lid, catalog design PJ-41.', price: 124, defaultChecked: false, image: '/images/catalog/pj-41.jpg', alt: 'Ribbed jar PJ-41 with metal lid, catalog photo' },
          { id: 'pj-42', name: 'Pichwai Jar PJ-42', description: 'White ribbed jar with lid, catalog design PJ-42.', price: 124, options: [{ label: '4"', price: 124 }, { label: '5"', price: 174 }], defaultChecked: false, image: '/images/catalog/pj-42.jpg', alt: 'White ribbed jar PJ-42, lidded, catalog photo' },
          { id: 'pj-43', name: 'Pichwai Jar PJ-43', description: 'White ribbed jar with lid, catalog design PJ-43.', price: 124, options: [{ label: '4"', price: 124 }, { label: '5"', price: 174 }], defaultChecked: false, image: '/images/catalog/pj-43.jpg', alt: 'White ribbed jar PJ-43, lidded, catalog photo' },
          { id: 'pj-44', name: 'Pichwai Jar PJ-44', description: 'Bronze ribbed jar with lid, catalog design PJ-44.', price: 124, defaultChecked: false, image: '/images/catalog/pj-44.jpg', alt: 'Bronze ribbed jar PJ-44, lidded, catalog photo' },
          { id: 'pj-45', name: 'Pichwai Jar PJ-45', description: 'Floral jar with wooden lid, catalog design PJ-45.', price: 156, defaultChecked: false, image: '/images/catalog/pj-45.jpg', alt: 'Floral jar PJ-45 with wooden lid, catalog photo' },
          { id: 'pj-46', name: 'Pichwai Jar PJ-46', description: 'Floral jar with wooden lid, catalog design PJ-46.', price: 156, defaultChecked: false, image: '/images/catalog/pj-46.jpg', alt: 'Floral jar PJ-46 with wooden lid, catalog photo' },
          { id: 'pj-47', name: 'Pichwai Jar PJ-47', description: 'Floral jar with wooden lid, catalog design PJ-47.', price: 156, defaultChecked: false, image: '/images/catalog/pj-47.jpg', alt: 'Floral jar PJ-47 with wooden lid, catalog photo' },
          { id: 'pj-48', name: 'Pichwai Jar PJ-48', description: 'Floral jar with wooden lid, catalog design PJ-48.', price: 156, defaultChecked: false, image: '/images/catalog/pj-48.jpg', alt: 'Floral jar PJ-48 with wooden lid, catalog photo' },
        ],
      },
      {
        id: 'pichwai-large',
        name: 'Large 5 and 6 inch',
        intro:
          'Bigger jars for dry fruits and gifting. One fixed size each.',
        items: [
          { id: 'pj-49', name: 'Pichwai Jar PJ-49', description: 'Large 6 inch handmade jar with lid, catalog design PJ-49.', price: 186, defaultChecked: false, image: '/images/catalog/pj-49.jpg', alt: 'Large jar PJ-49, 6 inch, lidded, catalog photo' },
          { id: 'pj-50', name: 'Pichwai Jar PJ-50', description: 'Large 6 inch handmade jar with lid, catalog design PJ-50.', price: 186, defaultChecked: false, image: '/images/catalog/pj-50.jpg', alt: 'Large jar PJ-50, 6 inch, lidded, catalog photo' },
          { id: 'pj-51', name: 'Pichwai Jar PJ-51', description: 'Large 6 inch handmade jar with lid, catalog design PJ-51.', price: 186, defaultChecked: false, image: '/images/catalog/pj-51.jpg', alt: 'Large jar PJ-51, 6 inch, lidded, catalog photo' },
          { id: 'pj-52', name: 'Pichwai Jar PJ-52', description: 'Large 6 inch handmade jar with lid, catalog design PJ-52.', price: 186, defaultChecked: false, image: '/images/catalog/pj-52.jpg', alt: 'Large jar PJ-52, 6 inch, lidded, catalog photo' },
          { id: 'pj-53', name: 'Pichwai Jar PJ-53', description: 'Large 5 inch handmade jar with lid, catalog design PJ-53.', price: 174, defaultChecked: false, image: '/images/catalog/pj-53.jpg', alt: 'Large jar PJ-53, 5 inch, lidded, catalog photo' },
          { id: 'pj-54', name: 'Pichwai Jar PJ-54', description: 'Large 5 inch handmade jar with lid, catalog design PJ-54.', price: 174, defaultChecked: false, image: '/images/catalog/pj-54.jpg', alt: 'Large jar PJ-54, 5 inch, lidded, catalog photo' },
          { id: 'pj-55', name: 'Pichwai Jar PJ-55', description: 'Large 5 inch handmade jar with lid, catalog design PJ-55.', price: 174, defaultChecked: false, image: '/images/catalog/pj-55.jpg', alt: 'Large jar PJ-55, 5 inch, lidded, catalog photo' },
          { id: 'pj-56', name: 'Pichwai Jar PJ-56', description: 'Large 5 inch handmade jar with lid, catalog design PJ-56.', price: 174, defaultChecked: false, image: '/images/catalog/pj-56.jpg', alt: 'Large jar PJ-56, 5 inch, lidded, catalog photo' },
          { id: 'pj-57', name: 'Pichwai Jar PJ-57', description: 'Large 5 inch handmade jar with lid, catalog design PJ-57.', price: 169, defaultChecked: false, image: '/images/catalog/pj-57.jpg', alt: 'Large jar PJ-57, 5 inch, lidded, catalog photo' },
          { id: 'pj-58', name: 'Pichwai Jar PJ-58', description: 'Large 5 inch handmade jar with lid, catalog design PJ-58.', price: 169, defaultChecked: false, image: '/images/catalog/pj-58.jpg', alt: 'Large jar PJ-58, 5 inch, lidded, catalog photo' },
          { id: 'pj-59', name: 'Pichwai Jar PJ-59', description: 'Large 5 inch handmade jar with lid, catalog design PJ-59.', price: 169, defaultChecked: false, image: '/images/catalog/pj-59.jpg', alt: 'Large jar PJ-59, 5 inch, lidded, catalog photo' },
          { id: 'pj-60', name: 'Pichwai Jar PJ-60', description: 'Large 5 inch handmade jar with lid, catalog design PJ-60.', price: 169, defaultChecked: false, image: '/images/catalog/pj-60.jpg', alt: 'Large jar PJ-60, 5 inch, lidded, catalog photo' },
        ],
      },
      {
        id: 'pichwai-premium',
        name: 'Premium 4 inch',
        intro:
          'Detailed prints at 4 and 4.5 inch. One fixed size each.',
        items: [
          { id: 'pj-61', name: 'Pichwai Jar PJ-61', description: 'Handmade 4 inch jar with lid, catalog design PJ-61.', price: 156, defaultChecked: false, image: '/images/catalog/pj-61.jpg', alt: 'Jar PJ-61, 4 inch, lidded, catalog photo' },
          { id: 'pj-62', name: 'Pichwai Jar PJ-62', description: 'Handmade 4 inch jar with lid, catalog design PJ-62.', price: 156, defaultChecked: false, image: '/images/catalog/pj-62.jpg', alt: 'Jar PJ-62, 4 inch, lidded, catalog photo' },
          { id: 'pj-63', name: 'Pichwai Jar PJ-63', description: 'Handmade 4 inch jar with lid, catalog design PJ-63.', price: 156, defaultChecked: false, image: '/images/catalog/pj-63.jpg', alt: 'Jar PJ-63, 4 inch, lidded, catalog photo' },
          { id: 'pj-64', name: 'Pichwai Jar PJ-64', description: 'Handmade 4 inch jar with lid, catalog design PJ-64.', price: 156, defaultChecked: false, image: '/images/catalog/pj-64.jpg', alt: 'Jar PJ-64, 4 inch, lidded, catalog photo' },
          { id: 'pj-65', name: 'Pichwai Jar PJ-65', description: 'Handmade 4.5 inch jar with lid, catalog design PJ-65.', price: 156, defaultChecked: false, image: '/images/catalog/pj-65.jpg', alt: 'Jar PJ-65, 4.5 inch, lidded, catalog photo' },
          { id: 'pj-66', name: 'Pichwai Jar PJ-66', description: 'Handmade 4.5 inch jar with lid, catalog design PJ-66.', price: 156, defaultChecked: false, image: '/images/catalog/pj-66.jpg', alt: 'Jar PJ-66, 4.5 inch, lidded, catalog photo' },
          { id: 'pj-67', name: 'Pichwai Jar PJ-67', description: 'Handmade 4.5 inch jar with lid, catalog design PJ-67.', price: 156, defaultChecked: false, image: '/images/catalog/pj-67.jpg', alt: 'Jar PJ-67, 4.5 inch, lidded, catalog photo' },
          { id: 'pj-68', name: 'Pichwai Jar PJ-68', description: 'Handmade 4 inch jar with lid, catalog design PJ-68.', price: 156, defaultChecked: false, image: '/images/catalog/pj-68.jpg', alt: 'Jar PJ-68, 4 inch, lidded, catalog photo' },
          { id: 'pj-69', name: 'Pichwai Jar PJ-69', description: 'Handmade 4 inch jar with lid, catalog design PJ-69.', price: 156, defaultChecked: false, image: '/images/catalog/pj-69.jpg', alt: 'Jar PJ-69, 4 inch, lidded, catalog photo' },
          { id: 'pj-70', name: 'Pichwai Jar PJ-70', description: 'Handmade 4 inch jar with lid, catalog design PJ-70.', price: 156, defaultChecked: false, image: '/images/catalog/pj-70.jpg', alt: 'Jar PJ-70, 4 inch, lidded, catalog photo' },
          { id: 'pj-71', name: 'Pichwai Jar PJ-71', description: 'Handmade 4 inch jar with lid, catalog design PJ-71.', price: 156, defaultChecked: false, image: '/images/catalog/pj-71.jpg', alt: 'Jar PJ-71, 4 inch, lidded, catalog photo' },
        ],
      },
    ],
  },

  {
    id: 'pichwai-trays',
    name: 'Trays and Baskets',
    tagline: 'Plates, baskets and gift combos.',
    intro:
      'Round and square Pichwai trays, metal baskets and ready gift combos. Pick a design, choose the size where offered, set how many.',
    image: '/images/catalog/pt-01.jpg',
    alt: 'A round Pichwai plate with cow print and silver rim',
    published: true,
    subHampers: [
      {
        id: 'round-premium',
        name: 'Round plates, premium',
        intro:
          'Bestseller plates at 6 inch Rs. 199 and 8 inch Rs. 236.',
        items: [
          { id: 'pt-01', name: 'Pichwai Plate PT-01', description: 'Round Pichwai plate, catalog design PT-01. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-01.jpg', alt: 'Round Pichwai plate PT-01, catalog photo' },
          { id: 'pt-02', name: 'Pichwai Plate PT-02', description: 'Round Pichwai plate, catalog design PT-02. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-02.jpg', alt: 'Round Pichwai plate PT-02, catalog photo' },
          { id: 'pt-03', name: 'Pichwai Plate PT-03', description: 'Round Pichwai plate, catalog design PT-03. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-03.jpg', alt: 'Round Pichwai plate PT-03, catalog photo' },
          { id: 'pt-04', name: 'Pichwai Plate PT-04', description: 'Round Pichwai plate, catalog design PT-04. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-04.jpg', alt: 'Round Pichwai plate PT-04, catalog photo' },
          { id: 'pt-05', name: 'Pichwai Plate PT-05', description: 'Round Pichwai plate, catalog design PT-05. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-05.jpg', alt: 'Round Pichwai plate PT-05, catalog photo' },
          { id: 'pt-06', name: 'Pichwai Plate PT-06', description: 'Round Pichwai plate, catalog design PT-06. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-06.jpg', alt: 'Round Pichwai plate PT-06, catalog photo' },
          { id: 'pt-07', name: 'Pichwai Plate PT-07', description: 'Round Pichwai plate, catalog design PT-07. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-07.jpg', alt: 'Round Pichwai plate PT-07, catalog photo' },
          { id: 'pt-08', name: 'Pichwai Plate PT-08', description: 'Round Pichwai plate, catalog design PT-08. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-08.jpg', alt: 'Round Pichwai plate PT-08, catalog photo' },
          { id: 'pt-09', name: 'Pichwai Plate PT-09', description: 'Round Pichwai plate, catalog design PT-09. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-09.jpg', alt: 'Round Pichwai plate PT-09, catalog photo' },
          { id: 'pt-10', name: 'Pichwai Plate PT-10', description: 'Round Pichwai plate, catalog design PT-10. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-10.jpg', alt: 'Round Pichwai plate PT-10, catalog photo' },
          { id: 'pt-11', name: 'Pichwai Plate PT-11', description: 'Round Pichwai plate, catalog design PT-11. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-11.jpg', alt: 'Round Pichwai plate PT-11, catalog photo' },
          { id: 'pt-12', name: 'Pichwai Plate PT-12', description: 'Round Pichwai plate, catalog design PT-12. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-12.jpg', alt: 'Round Pichwai plate PT-12, catalog photo' },
          { id: 'pt-13', name: 'Pichwai Plate PT-13', description: 'Round Pichwai plate, catalog design PT-13. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-13.jpg', alt: 'Round Pichwai plate PT-13, catalog photo' },
          { id: 'pt-14', name: 'Pichwai Plate PT-14', description: 'Round Pichwai plate, catalog design PT-14. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-14.jpg', alt: 'Round Pichwai plate PT-14, catalog photo' },
          { id: 'pt-15', name: 'Pichwai Plate PT-15', description: 'Round Pichwai plate, catalog design PT-15. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-15.jpg', alt: 'Round Pichwai plate PT-15, catalog photo' },
          { id: 'pt-16', name: 'Pichwai Plate PT-16', description: 'Round Pichwai plate, catalog design PT-16. Choose 6 inch or 8 inch.', price: 199, options: [{ label: '6"', price: 199 }, { label: '8"', price: 236 }], defaultChecked: false, image: '/images/catalog/pt-16.jpg', alt: 'Round Pichwai plate PT-16, catalog photo' },
        ],
      },
      {
        id: 'round-essentials',
        name: 'Round plates, essentials',
        intro:
          'Everyday plates at 6 inch Rs. 124 and 8 inch Rs. 161.',
        items: [
          { id: 'pt-29', name: 'Pichwai Plate PT-29', description: 'Round Pichwai plate, catalog design PT-29. Choose 6 inch or 8 inch.', price: 124, options: [{ label: '6"', price: 124 }, { label: '8"', price: 161 }], defaultChecked: false, image: '/images/catalog/pt-29.jpg', alt: 'Round Pichwai plate PT-29, catalog photo' },
          { id: 'pt-30', name: 'Pichwai Plate PT-30', description: 'Round Pichwai plate, catalog design PT-30. Choose 6 inch or 8 inch.', price: 124, options: [{ label: '6"', price: 124 }, { label: '8"', price: 161 }], defaultChecked: false, image: '/images/catalog/pt-30.jpg', alt: 'Round Pichwai plate PT-30, catalog photo' },
          { id: 'pt-31', name: 'Pichwai Plate PT-31', description: 'Round Pichwai plate, catalog design PT-31. Choose 6 inch or 8 inch.', price: 124, options: [{ label: '6"', price: 124 }, { label: '8"', price: 161 }], defaultChecked: false, image: '/images/catalog/pt-31.jpg', alt: 'Round Pichwai plate PT-31, catalog photo' },
          { id: 'pt-32', name: 'Pichwai Plate PT-32', description: 'Round Pichwai plate, catalog design PT-32. Choose 6 inch or 8 inch.', price: 124, options: [{ label: '6"', price: 124 }, { label: '8"', price: 161 }], defaultChecked: false, image: '/images/catalog/pt-32.jpg', alt: 'Round Pichwai plate PT-32, catalog photo' },
          { id: 'pt-33', name: 'Pichwai Plate PT-33', description: 'Round Pichwai plate, catalog design PT-33. Choose 6 inch or 8 inch.', price: 124, options: [{ label: '6"', price: 124 }, { label: '8"', price: 161 }], defaultChecked: false, image: '/images/catalog/pt-33.jpg', alt: 'Round Pichwai plate PT-33, catalog photo' },
          { id: 'pt-34', name: 'Pichwai Plate PT-34', description: 'Round Pichwai plate, catalog design PT-34. Choose 6 inch or 8 inch.', price: 124, options: [{ label: '6"', price: 124 }, { label: '8"', price: 161 }], defaultChecked: false, image: '/images/catalog/pt-34.jpg', alt: 'Round Pichwai plate PT-34, catalog photo' },
          { id: 'pt-35', name: 'Pichwai Plate PT-35', description: 'Round Pichwai plate, catalog design PT-35. Choose 6 inch or 8 inch.', price: 124, options: [{ label: '6"', price: 124 }, { label: '8"', price: 161 }], defaultChecked: false, image: '/images/catalog/pt-35.jpg', alt: 'Round Pichwai plate PT-35, catalog photo' },
          { id: 'pt-36', name: 'Pichwai Plate PT-36', description: 'Round Pichwai plate, catalog design PT-36. Choose 6 inch or 8 inch.', price: 124, options: [{ label: '6"', price: 124 }, { label: '8"', price: 161 }], defaultChecked: false, image: '/images/catalog/pt-36.jpg', alt: 'Round Pichwai plate PT-36, catalog photo' },
        ],
      },
      {
        id: 'baskets',
        name: 'Baskets and combos',
        intro:
          'Metal baskets, some with jars. Fixed price except where sizes are offered.',
        items: [
          { id: 'pt-17', name: 'Pichwai Basket PT-17', description: 'Metal basket, 6 inch, catalog design PT-17.', price: 211, defaultChecked: false, image: '/images/catalog/pt-17.jpg', alt: 'Metal basket PT-17, catalog photo' },
          { id: 'pt-18', name: 'Pichwai Basket PT-18', description: 'Metal basket, catalog design PT-18. Choose 6 inch or 8 inch.', price: 224, options: [{ label: '6"', price: 224 }, { label: '8"', price: 249 }], defaultChecked: false, image: '/images/catalog/pt-18.jpg', alt: 'Metal basket PT-18, catalog photo' },
          { id: 'pt-19', name: 'Pichwai Basket PT-19', description: 'Metal basket, catalog design PT-19. Choose 6 inch or 8 inch.', price: 224, options: [{ label: '6"', price: 224 }, { label: '8"', price: 249 }], defaultChecked: false, image: '/images/catalog/pt-19.jpg', alt: 'Metal basket PT-19, catalog photo' },
          { id: 'pt-20', name: 'Pichwai Basket PT-20', description: 'Metal basket, catalog design PT-20. Choose 6 inch or 8 inch.', price: 224, options: [{ label: '6"', price: 224 }, { label: '8"', price: 249 }], defaultChecked: false, image: '/images/catalog/pt-20.jpg', alt: 'Metal basket PT-20, catalog photo' },
          { id: 'pt-21', name: 'Pichwai Basket PT-21', description: 'Metal basket, catalog design PT-21. Choose 6 inch or 8 inch.', price: 224, options: [{ label: '6"', price: 224 }, { label: '8"', price: 249 }], defaultChecked: false, image: '/images/catalog/pt-21.jpg', alt: 'Metal basket PT-21, catalog photo' },
          { id: 'pt-22', name: 'Pichwai Basket PT-22', description: 'Metal basket, catalog design PT-22. Choose 6 inch or 8 inch.', price: 224, options: [{ label: '6"', price: 224 }, { label: '8"', price: 249 }], defaultChecked: false, image: '/images/catalog/pt-22.jpg', alt: 'Metal basket PT-22, catalog photo' },
          { id: 'pt-23', name: 'Pichwai Basket PT-23', description: 'Metal basket, catalog design PT-23. Choose 6 inch or 8 inch.', price: 224, options: [{ label: '6"', price: 224 }, { label: '8"', price: 249 }], defaultChecked: false, image: '/images/catalog/pt-23.jpg', alt: 'Metal basket PT-23, catalog photo' },
          { id: 'pt-24', name: 'Pichwai Basket PT-24', description: 'Metal basket, catalog design PT-24. Choose 6 inch or 8 inch.', price: 224, options: [{ label: '6"', price: 224 }, { label: '8"', price: 249 }], defaultChecked: false, image: '/images/catalog/pt-24.jpg', alt: 'Metal basket PT-24, catalog photo' },
          { id: 'pt-25', name: 'Pichwai Basket PT-25', description: 'Metal basket, 5 inch, catalog design PT-25.', price: 169, defaultChecked: false, image: '/images/catalog/pt-25.jpg', alt: 'Metal basket PT-25, catalog photo' },
          { id: 'pt-26', name: 'Pichwai Basket Combo PT-26', description: 'Basket with jar combo, catalog combo PT-26.', price: 194, defaultChecked: false, image: '/images/catalog/pt-26.jpg', alt: 'Basket with jar combo PT-26, catalog photo' },
          { id: 'pt-27', name: 'Pichwai Basket Combo PT-27', description: 'Basket with jar, 5 inch, catalog combo PT-27.', price: 244, defaultChecked: false, image: '/images/catalog/pt-27.jpg', alt: 'Basket with jar PT-27, catalog photo' },
          { id: 'pt-28', name: 'Pichwai Basket Combo PT-28', description: 'Basket with jar, 5 inch, catalog combo PT-28.', price: 244, defaultChecked: false, image: '/images/catalog/pt-28.jpg', alt: 'Basket with jar PT-28, catalog photo' },
        ],
      },
      {
        id: 'square-sets',
        name: 'Square trays and sets',
        intro:
          'Square trays plus 6 and 8 inch sets.',
        items: [
          { id: 'pt-37', name: 'Pichwai Square Tray PT-37', description: 'Square Pichwai tray, catalog design PT-37. Choose 6 inch or 8 inch.', price: 174, options: [{ label: '6"', price: 174 }, { label: '8"', price: 224 }], defaultChecked: false, image: '/images/catalog/pt-37.jpg', alt: 'Square Pichwai tray PT-37, catalog photo' },
          { id: 'pt-38', name: 'Pichwai Square Tray PT-38', description: 'Square Pichwai tray, catalog design PT-38. Choose 6 inch or 8 inch.', price: 174, options: [{ label: '6"', price: 174 }, { label: '8"', price: 224 }], defaultChecked: false, image: '/images/catalog/pt-38.jpg', alt: 'Square Pichwai tray PT-38, catalog photo' },
          { id: 'pt-39', name: 'Pichwai Square Tray PT-39', description: 'Square Pichwai tray, catalog design PT-39. Choose 6 inch or 8 inch.', price: 174, options: [{ label: '6"', price: 174 }, { label: '8"', price: 224 }], defaultChecked: false, image: '/images/catalog/pt-39.jpg', alt: 'Square Pichwai tray PT-39, catalog photo' },
          { id: 'pt-40', name: 'Pichwai Square Tray PT-40', description: 'Square Pichwai tray, catalog design PT-40. Choose 6 inch or 8 inch.', price: 174, options: [{ label: '6"', price: 174 }, { label: '8"', price: 224 }], defaultChecked: false, image: '/images/catalog/pt-40.jpg', alt: 'Square Pichwai tray PT-40, catalog photo' },
          { id: 'pt-41', name: 'Pichwai Tray Set PT-41', description: 'Square tray set of 6 and 8 inch, catalog set PT-41.', price: 374, defaultChecked: false, image: '/images/catalog/pt-41.jpg', alt: 'Square tray set PT-41, catalog photo' },
          { id: 'pt-42', name: 'Pichwai Tray Set PT-42', description: 'Round tray set of 6 and 8 inch, catalog set PT-42.', price: 306, defaultChecked: false, image: '/images/catalog/pt-42.jpg', alt: 'Round tray set PT-42, catalog photo' },
          { id: 'pt-43', name: 'Pichwai Tray Set PT-43', description: 'Round tray set of 6 and 8 inch, catalog set PT-43.', price: 306, defaultChecked: false, image: '/images/catalog/pt-43.jpg', alt: 'Round tray set PT-43, catalog photo' },
          { id: 'pt-44', name: 'Pichwai Tray Set PT-44', description: 'Round tray set of 6 and 8 inch, catalog set PT-44.', price: 306, defaultChecked: false, image: '/images/catalog/pt-44.jpg', alt: 'Round tray set PT-44, catalog photo' },
        ],
      },
      {
        id: 'singles',
        name: 'Single baskets and trays',
        intro:
          'One fixed size each.',
        items: [
          { id: 'pt-45', name: 'Pichwai Basket PT-45', description: 'Gold basket, 5 inch, catalog design PT-45.', price: 119, defaultChecked: false, image: '/images/catalog/pt-45.jpg', alt: 'Gold basket PT-45, catalog photo' },
          { id: 'pt-46', name: 'Pichwai Basket PT-46', description: 'Gold basket, 6 inch, catalog design PT-46.', price: 124, defaultChecked: false, image: '/images/catalog/pt-46.jpg', alt: 'Gold basket PT-46, catalog photo' },
          { id: 'pt-47', name: 'Pichwai Basket PT-47', description: 'Gold basket, 8 inch, catalog design PT-47.', price: 149, defaultChecked: false, image: '/images/catalog/pt-47.jpg', alt: 'Gold basket PT-47, catalog photo' },
          { id: 'pt-48', name: 'Pichwai Tray PT-48', description: 'Gold oval tray, 8 by 4 inch, catalog design PT-48.', price: 124, defaultChecked: false, image: '/images/catalog/pt-48.jpg', alt: 'Gold oval tray PT-48, catalog photo' },
        ],
      },
      {
        id: 'gift-combos',
        name: 'Gift combos',
        intro:
          'Ready combos of trays, jars and baskets at fixed prices.',
        items: [
          { id: 'pt-49', name: 'Gift Combo PT-49', description: 'Tray and jar gift combo, catalog combo PT-49.', price: 361, defaultChecked: false, image: '/images/catalog/pt-49.jpg', alt: 'Gift combo PT-49, catalog photo' },
          { id: 'pt-50', name: 'Gift Combo PT-50', description: 'Tray and jar gift combo, catalog combo PT-50.', price: 374, defaultChecked: false, image: '/images/catalog/pt-50.jpg', alt: 'Gift combo PT-50, catalog photo' },
          { id: 'pt-51', name: 'Gift Combo PT-51', description: 'Tray and jar gift combo, catalog combo PT-51.', price: 361, defaultChecked: false, image: '/images/catalog/pt-51.jpg', alt: 'Gift combo PT-51, catalog photo' },
          { id: 'pt-52', name: 'Gift Combo PT-52', description: 'Gift set of 3, catalog combo PT-52.', price: 436, defaultChecked: false, image: '/images/catalog/pt-52.jpg', alt: 'Gift combo PT-52, catalog photo' },
          { id: 'pt-53', name: 'Gift Combo PT-53', description: 'Tray and jar gift combo, catalog combo PT-53.', price: 374, defaultChecked: false, image: '/images/catalog/pt-53.jpg', alt: 'Gift combo PT-53, catalog photo' },
          { id: 'pt-54', name: 'Gift Combo PT-54', description: 'Basket and jar gift combo, catalog combo PT-54.', price: 324, defaultChecked: false, image: '/images/catalog/pt-54.jpg', alt: 'Gift combo PT-54, catalog photo' },
          { id: 'pt-55', name: 'Gift Combo PT-55', description: 'Tray and jar gift combo, catalog combo PT-55.', price: 411, defaultChecked: false, image: '/images/catalog/pt-55.jpg', alt: 'Gift combo PT-55, catalog photo' },
          { id: 'pt-56', name: 'Gift Combo PT-56', description: 'Tray and jar gift combo, catalog combo PT-56.', price: 361, defaultChecked: false, image: '/images/catalog/pt-56.jpg', alt: 'Gift combo PT-56, catalog photo' },
          { id: 'pt-57', name: 'Gift Pack PT-57', description: 'Gift packed jar, 4 inch, catalog pack PT-57.', price: 124, defaultChecked: false, image: '/images/catalog/pt-57.jpg', alt: 'Gift packed jar PT-57, catalog photo' },
          { id: 'pt-58', name: 'Gift Pack PT-58', description: 'Gift packed jar set of 2, 4 inch, catalog pack PT-58.', price: 249, defaultChecked: false, image: '/images/catalog/pt-58.jpg', alt: 'Gift packed jar set PT-58, catalog photo' },
          { id: 'pt-59', name: 'Gift Pack PT-59', description: 'Gift packed plate, catalog pack PT-59. Choose 6 inch or 8 inch.', price: 149, options: [{ label: '6"', price: 149 }, { label: '8"', price: 174 }], defaultChecked: false, image: '/images/catalog/pt-59.jpg', alt: 'Gift packed plate PT-59, catalog photo' },
          { id: 'pt-60', name: 'Gift Combo PT-60', description: 'Jar and tray gift combo, catalog combo PT-60.', price: 224, defaultChecked: false, image: '/images/catalog/pt-60.jpg', alt: 'Jar and tray gift combo PT-60, catalog photo' },
        ],
      },
      {
        id: 'gift-packing',
        name: 'Gift packing',
        intro:
          'Net packed and ready to gift pieces at fixed prices.',
        items: [
          { id: 'pt-61', name: 'Gift Pack PT-61', description: 'Gift packed box, 5 inch, catalog pack PT-61.', price: 186, defaultChecked: false, image: '/images/catalog/pt-61.jpg', alt: 'Gift packed box PT-61, catalog photo' },
          { id: 'pt-62', name: 'Gift Pack PT-62', description: 'Gift pack with potli, 4 inch, catalog pack PT-62.', price: 149, defaultChecked: false, image: '/images/catalog/pt-62.jpg', alt: 'Gift pack PT-62, catalog photo' },
          { id: 'pt-63', name: 'Gift Pack PT-63', description: 'Gift potli, 4 inch, catalog pack PT-63.', price: 124, defaultChecked: false, image: '/images/catalog/pt-63.jpg', alt: 'Gift potli PT-63, catalog photo' },
          { id: 'pt-64', name: 'Gift Pack PT-64', description: 'Netted basket gift pack, catalog pack PT-64. Choose 6 inch or 8 inch.', price: 149, options: [{ label: '6"', price: 149 }, { label: '8"', price: 186 }], defaultChecked: false, image: '/images/catalog/pt-64.jpg', alt: 'Netted basket gift pack PT-64, catalog photo' },
          { id: 'pt-65', name: 'Gift Pack PT-65', description: 'Basket and jar gift pack, catalog pack PT-65.', price: 206, defaultChecked: false, image: '/images/catalog/pt-65.jpg', alt: 'Basket and jar gift pack PT-65, catalog photo' },
          { id: 'pt-66', name: 'Gift Pack PT-66', description: 'Basket and jar gift pack, catalog pack PT-66.', price: 206, defaultChecked: false, image: '/images/catalog/pt-66.jpg', alt: 'Basket and jar gift pack PT-66, catalog photo' },
          { id: 'pt-67', name: 'Gift Pack PT-67', description: 'Basket and jar gift pack, catalog pack PT-67.', price: 206, defaultChecked: false, image: '/images/catalog/pt-67.jpg', alt: 'Basket and jar gift pack PT-67, catalog photo' },
          { id: 'pt-68', name: 'Gift Pack PT-68', description: 'Gift set of 3 with jars, catalog set PT-68.', price: 436, defaultChecked: false, image: '/images/catalog/pt-68.jpg', alt: 'Gift set PT-68, catalog photo' },
          { id: 'pt-69', name: 'Gift Pack PT-69', description: 'Basket and jar gift pack, catalog pack PT-69.', price: 561, defaultChecked: false, image: '/images/catalog/pt-69.jpg', alt: 'Basket and jar gift pack PT-69, catalog photo' },
          { id: 'pt-70', name: 'Gift Pack PT-70', description: 'Basket and jar gift set of 3, catalog set PT-70.', price: 311, defaultChecked: false, image: '/images/catalog/pt-70.jpg', alt: 'Basket and jar gift set PT-70, catalog photo' },
          { id: 'pt-71', name: 'Gift Pack PT-71', description: 'Basket and jar gift pack, catalog pack PT-71.', price: 374, defaultChecked: false, image: '/images/catalog/pt-71.jpg', alt: 'Basket and jar gift pack PT-71, catalog photo' },
          { id: 'pt-72', name: 'Gift Pack PT-72', description: 'Large basket and jar gift pack, catalog pack PT-72.', price: 561, defaultChecked: false, image: '/images/catalog/pt-72.jpg', alt: 'Large basket and jar gift pack PT-72, catalog photo' },
        ],
      },
    ],
  },

  {
    id: 'sindoor-kumkum',
    name: 'Sindoor and Kumkum',
    tagline: 'Silver and brass boxes.',
    intro:
      'Small sindoor and kumkum boxes in silver and brass. One fixed size each, made for return gifts in bulk.',
    image: '/images/catalog/sb-01.jpg',
    alt: 'A silver sindoor kumkum box with enamel lid',
    published: true,
    subHampers: [
      {
        id: 'sindoor-boxes',
        name: 'Sindoor boxes',
        intro:
          'Tick the designs you like and set how many of each.',
        items: [
          { id: 'sb-01', name: 'Sindoor Box SB-01', description: 'Silver sindoor kumkum box, 2 inch, design SB-01.', price: 100, defaultChecked: false, image: '/images/catalog/sb-01.jpg', alt: 'Silver sindoor box SB-01, catalog photo' },
          { id: 'sb-02', name: 'Sindoor Box SB-02', description: 'Silver sindoor kumkum box, 2 inch, design SB-02.', price: 100, defaultChecked: false, image: '/images/catalog/sb-02.jpg', alt: 'Silver sindoor box SB-02, catalog photo' },
          { id: 'sb-03', name: 'Sindoor Box SB-03', description: 'Silver sindoor kumkum box, 2 inch, design SB-03.', price: 100, defaultChecked: false, image: '/images/catalog/sb-03.jpg', alt: 'Silver sindoor box SB-03, catalog photo' },
          { id: 'sb-04', name: 'Sindoor Box SB-04', description: 'Silver sindoor kumkum box, 2 inch, design SB-04.', price: 100, defaultChecked: false, image: '/images/catalog/sb-04.jpg', alt: 'Silver sindoor box SB-04, catalog photo' },
          { id: 'sb-05', name: 'Sindoor Box SB-05', description: 'Brass sindoor kumkum box, 2 inch, design SB-05.', price: 94, defaultChecked: false, image: '/images/catalog/sb-05.jpg', alt: 'Brass sindoor box SB-05, catalog photo' },
          { id: 'sb-06', name: 'Sindoor Box SB-06', description: 'Brass sindoor kumkum box, 2 inch, design SB-06.', price: 94, defaultChecked: false, image: '/images/catalog/sb-06.jpg', alt: 'Brass sindoor box SB-06, catalog photo' },
          { id: 'sb-07', name: 'Sindoor Box SB-07', description: 'Brass sindoor kumkum box, 2 inch, design SB-07.', price: 94, defaultChecked: false, image: '/images/catalog/sb-07.jpg', alt: 'Brass sindoor box SB-07, catalog photo' },
          { id: 'sb-08', name: 'Sindoor Box SB-08', description: 'Brass sindoor kumkum box, 2 inch, design SB-08.', price: 94, defaultChecked: false, image: '/images/catalog/sb-08.jpg', alt: 'Brass sindoor box SB-08, catalog photo' },
          { id: 'sb-09', name: 'Sindoor Box SB-09', description: 'Brass sindoor kumkum box, 2 inch, engraved.', price: 88, defaultChecked: false, image: '/images/catalog/sb-09.jpg', alt: 'Brass sindoor box SB-09, catalog photo' },
          { id: 'sb-10', name: 'Sindoor Box SB-10', description: 'Brass sindoor kumkum box, 2 inch, enamel lid.', price: 111, defaultChecked: false, image: '/images/catalog/sb-10.jpg', alt: 'Brass sindoor box SB-10, catalog photo' },
          { id: 'sb-11', name: 'Sindoor Box SB-11', description: 'Brass sindoor kumkum box, 2.5 inch, design SB-11.', price: 94, defaultChecked: false, image: '/images/catalog/sb-11.jpg', alt: 'Brass sindoor box SB-11, catalog photo' },
          { id: 'sb-12', name: 'Sindoor Box SB-12', description: 'Brass sindoor kumkum box, 2.5 inch, design SB-12.', price: 94, defaultChecked: false, image: '/images/catalog/sb-12.jpg', alt: 'Brass sindoor box SB-12, catalog photo' },
        ],
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
