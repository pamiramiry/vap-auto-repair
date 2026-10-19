# VAP Auto Repairs: Design Rules (read before every change)

- One-page site. Vanilla HTML/CSS/JS. No frameworks, no build step.
- Palette locked: ink #0C1B2A, ink-2 #132A40, paper #F7F4EE, sand #EEE8DD, line #DCD3C4, text #2A333E, muted #5B6470, copper #B4531E, copper-deep #923F12, copper-soft #F4E4D7, copper-light #E8956A (text on ink only), star #E8A33D. No red, no pure black.
- Copper is the only accent and the colour of every primary action (Call). Ink is the secondary action (Quote).
- Fonts locked: Archivo (headings, width about 108, sentence case, tight tracking), Public Sans (body). No uppercase headings; uppercase only for the small kicker labels.
- Shape: pill buttons, 16-24px radius on cards and photos. Soft navy shadows, never grey-black.
- Hero is a split layout on paper with the photo in a rounded frame. Never put text over a photo.
- Every image sits in a `.frame` with a `data-label`. If the file is missing, the frame shows a designed navy panel instead of a broken image.
- Images: stock only from Pexels or Unsplash (no attribution needed), every one logged in images/IMAGE-SOURCES.md. No brand logos, plates or other businesses' signage in frame. No visible credits on the site. No photos shared with other client sites.
- No grids of icon cards. Use numbered lists, editorial rows and quote cards.
- Exactly one H1. Title = "Auto Repair in Etobicoke | VAP Auto Repairs". Keep "Auto Repair in Etobicoke" in the title, H1 and meta description.
- Call to action every one or two sections. The sticky mobile bar (Free quote / Call now) is always present under 900px.
- Live open/closed status runs on Toronto time from the HOURS table in js/main.js. Update it and the hours table together.
- The Google rating number is not shown on the site (it is 3.7). Show the review count and real quotes only.
- Review quotes are copied word for word from Google, cut with "…" only, with reviewer first name and last initial. Only 5-star reviews are quoted. Don't name staff.
- Never invent facts. Anything not confirmed by the shop goes in TO-CONFIRM.md.
- No em dashes or en dashes anywhere. Write ranges with "to".
- Persuasion copy: specifics over adjectives, the customer's fear named and answered, risk removed (price before work), proof from real reviews.
