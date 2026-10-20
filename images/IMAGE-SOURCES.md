# Image sources (private record, not shown on the site)

Every photo is from Pexels, under the Pexels License: free for commercial and personal use, no attribution or citation required, and you may crop and edit. https://www.pexels.com/license/

`tools/fetch-images.py` downloads each one, crops it to its slot, converts it to WebP (quality 80) and drops all metadata. None of these are used on any other client site.

| File | Slot | Source page | Photographer | Size |
|---|---|---|---|---|
| mechanic-under-car-etobicoke.webp | FAQ, tall | https://www.pexels.com/photo/a-man-repairing-a-car-11139242/ | Hasan Gulec | 900x1200 |
| vap-auto-repairs-etobicoke-og.webp | Social share | Same as FAQ tall (11139242) | Hasan Gulec | 1200x630 |
| oil-change-etobicoke.webp | Services, tall | https://www.pexels.com/photo/pouring-oil-to-engine-13065690/ | Daniel Andraski | 900x1125 |
| tire-change-etobicoke.webp | Services, second | https://www.pexels.com/photo/man-changing-a-car-tire-3806249/ | Andrea Piacquadio | 1200x800 |
| mechanic-with-customer-etobicoke.webp | FAQ, square | https://www.pexels.com/photo/an-auto-mechanic-holding-a-new-cabin-filter-7541976/ | see source page | 800x800 |

After running the script, open each file. If a logo, plate or sign is visible, blur it or change the crop focus in the script, and note the edit here.

Edits (2026-10-20, all downloaded that day): blurred the Shell/VW/MAXI label on the oil bottle, the Falco label on the lift (FAQ tall and social share), and the AC Car Treatment logo on the shirt (social share). The boxes live in the BLUR table in the script. Before launch, add the download date to each row.
