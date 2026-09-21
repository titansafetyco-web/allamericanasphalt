#!/usr/bin/env python3
"""Download WordPress pages, posts, and media for the rebuild."""
from __future__ import annotations

import json
import re
import ssl
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
RAW = CONTENT / "raw"
PUBLIC = ROOT / "public"
GALLERY_PAVING = PUBLIC / "gallery" / "paving"
GALLERY_SEAL = PUBLIC / "gallery" / "sealcoating"
IMAGES = PUBLIC / "images"
BADGES = PUBLIC / "badges"

BASE = "https://allamericanasphaltpaving.com"
UA = "AllAmericanRebuild/1.0 (content migration)"

ctx = ssl.create_default_context()

GALLERY_PAVING_FILES = [
    "asphalt-parking-lot_2.jpg",
    "asphalt-parking-lot_3.jpg",
    "asphalt-parking-lot_4.jpg",
    "asphalt-parking-lot_5.jpg",
    "asphalt-parking-lot_6.jpg",
    "asphalt-parking-lot_7.jpg",
    "asphalt-parking-lot_8.jpg",
    "asphalt-parking-lot_1.jpg",
    "palm-trees-asphalt.jpg",
    "dark-asphalt.jpg",
    "cloudy-sky-asphalt.jpg",
    "asphalt-step-3.jpg",
    "asphalt-step-2.jpg",
    "asphalt-step-1.jpg",
    "asphalt-parking-lot.jpg",
    "apartment-roads.jpg",
    "rolling-driveway.jpg",
    "river-parking-lot.jpg",
    "paving-street.jpg",
    "paving-half-of-street.jpg",
    "palm-tree-parking-lot.jpg",
    "house-long-driveway.jpg",
    "house-driveway.jpg",
    "handicap-parking-lot.jpg",
    "driveway.jpg",
    "community-street.jpg",
    "church-parking-lot-arrows.jpg",
    "church-parking-lot.jpg",
    "building-parking-lot.jpg",
    "Parking-Lot-1.jpg",
    "Parking-Lot-3.jpg",
    "Parking-Lot-2.jpg",
    "asphalt_2.jpg",
    "asphalt_1.jpg",
    "business-parking-lot.jpg",
    "parking-lot-with-lines.jpg",
    "paving-parking-lot.jpg",
    "large-parking-lot.jpg",
    "construction-site-street.jpg",
    "3rd-pic-in-prep-do-row-3-1st-pic-finish-job.jpg",
    "1st-pic-5th-row-then-yellow-dump-2nd.jpg",
    "second-row-last-pic.jpg",
    "business-asphalt.jpg",
    "second-row-2nd-pic.jpg",
    "before-parking-lot.jpg",
    "brick-ashalt-parking-lot.jpg",
    "new-parking-lot.jpg",
    "asphalt-gallery-1st-roll-2nd-pic.jpg",
    "parking-lot-set-up.jpg",
    "asphalt-parking-lot-1.jpg",
    "Pave-roadway.jpg",
    "paved-parking-lot.jpg",
    "Paved-Apartment-complex.jpg",
    "Palms-and-Pavement.jpg",
    "House-pic-after.jpg",
    "Duplex-photo.jpg",
    "Asphalt-Parking-Lot.jpg",
    "House-Driveway.jpg",
    "Twin-Peaks.jpg",
    "Unknown-1.png",
    "Unknown-3.png",
    "Unknown-2.jpg",
    "Unknown-4.jpg",
    "Unknown-5.jpg",
    "Unknown.jpg",
    "Screenshot_20250906_164534_Messages.jpg",
    "Screenshot_20260615_162903_Messages.jpg",
    "6788481311683810014.jpg",
    "Screenshot_20250906_164543_Messages.jpg",
    "Screenshot_20250906_164547_Messages.jpg",
    "Screenshot_20250905_092505_Messages.jpg",
    "Screenshot_20260615_162903_Messages-1.jpg",
    "Screenshot_20251015_200124_Gallery.jpg",
    "6788481311683810014-1.jpg",
]

GALLERY_SEAL_FILES = [
    "sealcoating_1.jpg",
    "sealcoating_2.jpg",
    "sealcoating_3.jpg",
    "seat-coat-parking.jpg",
    "seal-coat-with-no-cars.jpg",
    "seal-coat-with-cars.jpg",
    "seal-coat-out.jpg",
    "seal-coat-in-out.jpg",
    "apartment-complex-sealcoat.jpg",
    "apartment-complex-sealcoat-2.jpg",
    "dealership-seal-coating.jpg",
    "dealership-roads.jpg",
    "dealership-parking-lot.jpg",
    "arbys-parking-lot.jpg",
    "Badcock-furniture-parking-lot.jpg",
    "bank-of-america-parking-lot.jpg",
    "chilis-parking-lot.jpg",
    "driveway-seal-coat.jpg",
    "driveway-seal-coating.jpg",
    "hampton-parking-lot.jpg",
    "ihop-parking-lot.jpg",
    "long-driveway-seal-coating.jpg",
    "neighborhood-road-seal-coating.jpg",
    "parking-lot-seal-coating.jpg",
    "pbs-entrance.jpg",
    "road-seal-coating.jpg",
    "seal-coating-road.jpg",
    "shopping-parking-lot.jpg",
    "street-road-seal-coat.jpg",
    "street-seal-coating.jpg",
    "taco-bell-parking-lot.jpg",
    "walgreens-parking-lot.jpg",
    "applebees-parking-lot.jpg",
    "Apartment-Complex.jpg",
    "Church-Parking-Lot.jpg",
    "unnamed-1-1-scaled.jpg",
]

HOME_IMAGES = {
    "hero.jpg": "Homepage-Billboard2.jpg",
    "hoa.jpg": "hoa-done.jpg",
    "parking-lot.jpg": "commercial-carking-lot-done.jpg",
    "driveway.jpg": "residential-driveway-done.jpg",
    "bollards.jpg": "Bollards-and-speed-zoom-in.webp",
    "striping.jpg": "20250829_141723-1.jpg",
    "road-work.jpg": "RoadWork-American-Aspshalt.jpg",
    "before-after.jpg": "Before-After.jpg",
    "twin-peaks.jpg": "Twin-Peaks-restaurant-1.jpg",
    "map.jpg": "map-footer-296x220-320w-1.jpg",
}

BADGE_FILES = {
    "angie.jpg": "ANGIE-AWARD-2025.jpg",
    "chamber.png": "Chambers-of-Commerce-Logo.png",
    "wbe.png": "WBE.png",
    "sba.png": "SBA-Logo.png",
    "top3.webp": "Des-Moines-Business-Rate-Top-3-1.webp",
    "visa.png": "visa-icon.png",
    "mastercard.png": "mastercard-icon.png",
    "discover.png": "discover-icon.png",
    "amex.png": "amex-icon.png",
}


def request(url: str, retries: int = 4) -> bytes:
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
                return resp.read()
        except Exception as exc:  # noqa: BLE001
            last = exc
            time.sleep(1.2 * (i + 1))
    raise RuntimeError(f"Failed {url}: {last}")


def download(url: str, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0:
        return True
    try:
        data = request(url)
        dest.write_bytes(data)
        print(f"  saved {dest.relative_to(ROOT)} ({len(data)} bytes)")
        return True
    except Exception as exc:  # noqa: BLE001
        print(f"  FAIL {url}: {exc}")
        return False


def fetch_json(path: str) -> list:
    url = f"{BASE}{path}"
    print("fetch", url)
    data = json.loads(request(url).decode("utf-8"))
    return data


def strip_html(html: str) -> str:
    text = re.sub(r"<script[\s\S]*?</script>", "", html, flags=re.I)
    text = re.sub(r"<style[\s\S]*?</style>", "", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&amp;", "&", text)
    text = re.sub(r"&quot;", '"', text)
    text = re.sub(r"&#8217;", "'", text)
    text = re.sub(r"&#8211;", "–", text)
    text = re.sub(r"&#8220;", '"', text)
    text = re.sub(r"&#8221;", '"', text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def main() -> None:
    for d in (RAW, GALLERY_PAVING, GALLERY_SEAL, IMAGES, BADGES):
        d.mkdir(parents=True, exist_ok=True)

    pages = fetch_json("/wp-json/wp/v2/pages?per_page=100")
    posts = fetch_json("/wp-json/wp/v2/posts?per_page=100")
    (RAW / "pages.json").write_text(json.dumps(pages, indent=2), encoding="utf-8")
    (RAW / "posts.json").write_text(json.dumps(posts, indent=2), encoding="utf-8")
    print(f"pages={len(pages)} posts={len(posts)}")

    slim_pages = []
    for p in pages:
        html = p.get("content", {}).get("rendered", "")
        slim_pages.append(
            {
                "id": p["id"],
                "slug": p["slug"],
                "title": p["title"]["rendered"],
                "link": p["link"],
                "html": html,
                "text": strip_html(html),
            }
        )
    slim_posts = []
    for p in posts:
        html = p.get("content", {}).get("rendered", "")
        slim_posts.append(
            {
                "id": p["id"],
                "slug": p["slug"],
                "title": p["title"]["rendered"],
                "date": p.get("date", "")[:10],
                "link": p["link"],
                "excerpt": strip_html(p.get("excerpt", {}).get("rendered", "")),
                "html": html,
                "text": strip_html(html),
            }
        )
    (CONTENT / "pages.json").write_text(json.dumps(slim_pages, indent=2), encoding="utf-8")
    (CONTENT / "posts.json").write_text(json.dumps(slim_posts, indent=2), encoding="utf-8")

    print("downloading gallery paving...")
    for name in GALLERY_PAVING_FILES:
        download(f"{BASE}/wp-content/uploads/{name}", GALLERY_PAVING / name)

    print("downloading gallery sealcoating...")
    for name in GALLERY_SEAL_FILES:
        dest_name = name.replace("-scaled", "")
        download(f"{BASE}/wp-content/uploads/{name}", GALLERY_SEAL / dest_name)

    print("downloading home images...")
    for dest, src in HOME_IMAGES.items():
        download(f"{BASE}/wp-content/uploads/{src}", IMAGES / dest)

    print("downloading badges...")
    for dest, src in BADGE_FILES.items():
        download(f"{BASE}/wp-content/uploads/{src}", BADGES / dest)

    print("downloading pdf...")
    download(
        f"{BASE}/wp-content/uploads/All-American-Asphalt_about.pdf",
        PUBLIC / "All-American-Asphalt_about.pdf",
    )

    print("done")


if __name__ == "__main__":
    main()
