# To confirm with the shop (private, not deployed)

Everything below is on the page already, written from the Google listing and reviews. Check it with the owner before launch.

## Promises the copy makes (check they match how the shop works)
- "You hear the price before any work starts" and "nothing gets done until you say yes". Used in the hero, Why us, How it works, FAQ and footer.
- "If we find something else along the way, we call again first" (FAQ).
- "Get a free quote" wording on every quote button.
- Appointments are recommended, not required (a review says "do get appointment").
- Services list: oil changes (conventional and synthetic), seasonal tire changeovers and rotations, brakes, scheduled maintenance, batteries, diagnostics, suspension and steering, engine and cooling, electrical, A/C and heating. Oil changes, tire changes and rotations, brakes and maintenance come from reviews; the rest need confirming. Do they sell tires?
- "Most makes and models, cars, SUVs and minivans".
- "Four service bays" (from one review).
- "Etobicoke regulars since 2007" and "over 15 years" (from a review: customer since buying their first car in 2007). Ask the founding year; it can replace these.

## Listing facts used
- Address 1770 Albion Rd, Unit 33, Shops at Albion, floor 1, Etobicoke, ON M9V 1C2.
- Phone (647) 710-0734.
- Hours: Mon to Fri 9 AM to 7 PM, Sat 9 AM to 5 PM, Sun closed.
- Wheelchair-accessible entrance (from the Google listing icon).
- 171 Google reviews. The 3.7 rating is deliberately not shown.
- Area list: Rexdale, Thistletown, Smithfield, Mount Olive, Jamestown, Humberwood, Kipling Heights. Check these match where customers actually come from.
- One review mentions "MELAD" by name. If that is the owner, the site could name him (people like a name to ask for).

## Technical
- Domain: replace every SITE-DOMAIN in index.html, robots.txt and sitemap.xml.
- Quote form: no endpoint yet. Paste a Formspree or Web3Forms URL into `data-endpoint` on the form. Until then, submitting shows a message asking people to call.
- "Read all reviews on Google" links to a Maps search. Swap in the listing's direct reviews link.
- Photos: run tools/fetch-images.py (needs access to images.pexels.com), then check every crop.

## Real photos to get from the shop (replace stock first)
1. Hero: the shop floor or a bay with a car on the hoist (portrait, 4:5).
2. Mechanic with customer: the owner talking someone through a repair (4:3).
3. Outside the unit at Shops at Albion, for a future About block.
