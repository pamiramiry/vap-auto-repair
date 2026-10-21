#!/usr/bin/env python3
"""Download the stock photos for the site from Pexels and crop them to their slots.

Every photo here is from Pexels, under the Pexels License: free for commercial use,
no attribution required. Run from the repo root on a machine that can reach
images.pexels.com:

    pip install pillow
    python3 tools/fetch-images.py

Then LOOK at every file in images/ before publishing. Blur or re-crop anything
that shows a brand logo, a licence plate or another business's sign, and log
the edit in images/IMAGE-SOURCES.md.
"""
import io
import pathlib
import urllib.request

from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "images"
SRC = OUT / "_src"  # originals, git-ignored

# slot file, Pexels photo id, output size, vertical focus (0 top, 0.5 centre, 1 bottom)
SLOTS = [
    ("oil-change-etobicoke.webp", 13065690, (900, 1125), 0.5),
    ("tire-change-etobicoke.webp", 3806249, (1200, 800), 0.55),
    ("mechanic-under-car-etobicoke.webp", 11139242, (900, 1200), 0.5),
    ("mechanic-with-customer-etobicoke.webp", 7541976, (800, 800), 0.4),
    ("vap-auto-repairs-etobicoke-og.webp", 11139242, (1200, 630), 0.45),
    ("hero-shop.webp", 8985723, (1000, 1400), 0.3),
]

# Boxes (left, top, right, bottom) in output pixels to blur: other brands' logos.
BLUR = {
    "oil-change-etobicoke.webp": [(595, 440, 830, 680)],  # oil bottle label
    "mechanic-under-car-etobicoke.webp": [(630, 650, 825, 705)],  # lift maker's label
    "vap-auto-repairs-etobicoke-og.webp": [(880, 50, 1000, 190), (600, 340, 815, 395)],  # shirt logo, lift label
    "hero-shop.webp": [(430, 300, 690, 365), (355, 375, 475, 420)],  # car maker's badges
}


def fetch(photo_id):
    SRC.mkdir(parents=True, exist_ok=True)
    cached = SRC / f"pexels-{photo_id}.jpg"
    if not cached.exists():
        url = f"https://images.pexels.com/photos/{photo_id}/pexels-photo-{photo_id}.jpeg?auto=compress&cs=tinysrgb&w=2400"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            cached.write_bytes(r.read())
    return Image.open(io.BytesIO(cached.read_bytes())).convert("RGB")


def cover(img, size, focus_y):
    tw, th = size
    scale = max(tw / img.width, th / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    left = (img.width - tw) // 2
    top = round((img.height - th) * focus_y)
    return img.crop((left, top, left + tw, top + th))


def main():
    for name, photo_id, size, focus_y in SLOTS:
        out = cover(fetch(photo_id), size, focus_y)
        for box in BLUR.get(name, []):
            # Feathered mask so the blur fades into the photo instead of showing a hard box.
            mask = Image.new("L", out.size, 0)
            mask.paste(255, box)
            mask = mask.filter(ImageFilter.GaussianBlur(10))
            out = Image.composite(out.filter(ImageFilter.GaussianBlur(14)), out, mask)
        # A fresh image carries no EXIF or other metadata.
        out.save(OUT / name, "WEBP", quality=80, method=6)
        print(f"{name}: Pexels {photo_id}, {size[0]}x{size[1]}")


if __name__ == "__main__":
    main()
