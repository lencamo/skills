#!/usr/bin/env python3
from __future__ import annotations

import argparse
import math
import sys
from collections import deque
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    print(
        "Error: Pillow is required. Install it with `python3 -m pip install --user pillow`.",
        file=sys.stderr,
    )
    raise SystemExit(1)


WEB_PNGS = [
    ("favicon-16x16.png", 16, True, "web", "favicon", 0),
    ("favicon-32x32.png", 32, True, "web", "favicon", 0),
    ("favicon-48x48.png", 48, True, "web", "favicon", 0.04),
    ("favicon.png", 64, True, "web", "favicon", 0.06),
    ("icon-192.png", 192, True, "web", "web", 0.08),
    ("icon-512.png", 512, True, "web", "web", 0.08),
    ("icon-192-maskable.png", 192, True, "app", None, 0),
    ("icon-512-maskable.png", 512, True, "app", None, 0),
    ("apple-touch-icon.png", 180, True, "app", None, 0),
]

DESKTOP_ICON_SIZES = [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024]
ICO_SIZES = [16, 24, 32, 48, 64, 128, 256]
FAVICON_ICO_SIZES = [16, 32, 48]


def parse_hex_color(value: str) -> tuple[int, int, int, int]:
    raw = value.strip().lstrip("#")
    if len(raw) != 6:
        raise argparse.ArgumentTypeError("background must be a 6-digit hex color, for example #ffffff")
    try:
        rgb = tuple(int(raw[index : index + 2], 16) for index in (0, 2, 4))
    except ValueError as exc:
        raise argparse.ArgumentTypeError("background must be a valid hex color") from exc
    return rgb[0], rgb[1], rgb[2], 255


def parse_fill(value: str) -> float:
    try:
        fill = float(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("fill must be a number between 0 and 1") from exc
    if not 0 < fill <= 1:
        raise argparse.ArgumentTypeError("fill must be greater than 0 and less than or equal to 1")
    return fill


def parse_corner_radius(value: str) -> float:
    try:
        radius = float(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("corner radius must be a number between 0 and 0.5") from exc
    if not 0 <= radius <= 0.5:
        raise argparse.ArgumentTypeError("corner radius must be greater than or equal to 0 and less than or equal to 0.5")
    return radius


def parse_inset(value: str) -> float:
    try:
        inset = float(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("container inset must be a number between 0 and 0.4") from exc
    if not 0 <= inset <= 0.4:
        raise argparse.ArgumentTypeError("container inset must be greater than or equal to 0 and less than or equal to 0.4")
    return inset


def slug_from_path(path: Path) -> str:
    chars = []
    for char in path.stem.lower():
        if char.isalnum():
            chars.append(char)
        elif chars and chars[-1] != "-":
            chars.append("-")
    return "".join(chars).strip("-") or "brand"


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return math.sqrt(sum((a[index] - b[index]) ** 2 for index in range(3)))


def border_background_color(image: Image.Image) -> tuple[int, int, int]:
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = []
    for x in range(width):
        pixels.append(rgb.getpixel((x, 0)))
        pixels.append(rgb.getpixel((x, height - 1)))
    for y in range(height):
        pixels.append(rgb.getpixel((0, y)))
        pixels.append(rgb.getpixel((width - 1, y)))
    channels = []
    for index in range(3):
        values = sorted(pixel[index] for pixel in pixels)
        channels.append(values[len(values) // 2])
    return channels[0], channels[1], channels[2]


def has_useful_alpha(image: Image.Image) -> bool:
    if image.mode != "RGBA":
        return False
    extrema = image.getchannel("A").getextrema()
    return extrema[0] < 250


def remove_edge_background(image: Image.Image, threshold: int) -> Image.Image:
    rgba = image.convert("RGBA")
    if has_useful_alpha(rgba):
        return rgba

    background = border_background_color(rgba)
    width, height = rgba.size
    pixels = rgba.load()
    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    def maybe_add(x: int, y: int) -> None:
        if (x, y) in visited:
            return
        pixel = pixels[x, y]
        if color_distance(pixel[:3], background) <= threshold:
            visited.add((x, y))
            queue.append((x, y))

    for x in range(width):
        maybe_add(x, 0)
        maybe_add(x, height - 1)
    for y in range(height):
        maybe_add(0, y)
        maybe_add(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                maybe_add(nx, ny)

    output = rgba.copy()
    out_pixels = output.load()
    for x, y in visited:
        r, g, b, _alpha = out_pixels[x, y]
        out_pixels[x, y] = (r, g, b, 0)
    return output


def crop_subject(image: Image.Image) -> Image.Image:
    box = image.getchannel("A").getbbox()
    if box is None:
        raise SystemExit("No visible subject found after background removal.")
    return image.crop(box)


def make_mark(subject: Image.Image, size: int, fill: float) -> Image.Image:
    subject = subject.convert("RGBA")
    target = max(1, round(size * fill))
    scale = min(target / subject.width, target / subject.height)
    next_size = (max(1, round(subject.width * scale)), max(1, round(subject.height * scale)))
    resized = subject.resize(next_size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((size - resized.width) // 2, (size - resized.height) // 2))
    return canvas


def with_background(image: Image.Image, background: tuple[int, int, int, int] | None) -> Image.Image:
    rgba = image.convert("RGBA")
    if background is None:
        return rgba
    canvas = Image.new("RGBA", rgba.size, background)
    canvas.alpha_composite(rgba)
    return canvas


def resize_square(image: Image.Image, size: int, background: tuple[int, int, int, int] | None) -> Image.Image:
    resized = image.convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    return with_background(resized, background)


def rounded_background(
    size: int,
    background: tuple[int, int, int, int],
    radius_ratio: float,
    inset_ratio: float = 0,
) -> Image.Image:
    inset = max(0, round(size * inset_ratio))
    radius = max(0, round((size - inset * 2) * radius_ratio))
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    if radius == 0 and inset == 0:
        canvas.paste(background, (0, 0, size, size))
        return canvas

    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((inset, inset, size - 1 - inset, size - 1 - inset), radius=radius, fill=255)
    canvas.paste(background, (0, 0, size, size))
    canvas.putalpha(mask)
    return canvas


def resize_icon(
    image: Image.Image,
    size: int,
    background: tuple[int, int, int, int] | None,
    corner_radius_ratio: float = 0,
    container_inset_ratio: float = 0,
) -> Image.Image:
    inset = max(0, round(size * container_inset_ratio)) if background else 0
    subject_size = max(1, size - inset * 2)
    resized = image.convert("RGBA").resize((subject_size, subject_size), Image.Resampling.LANCZOS)
    if background is None:
        return resized

    canvas = rounded_background(size, background, corner_radius_ratio, container_inset_ratio)
    canvas.alpha_composite(resized, (inset, inset))
    return canvas


def should_use_background(default_background: bool, args: argparse.Namespace) -> tuple[int, int, int, int] | None:
    if args.transparent_background:
        return None
    if args.force_background or default_background:
        return args.background
    return None


def radius_for_kind(kind: str | None, args: argparse.Namespace) -> float:
    if kind == "favicon":
        return args.favicon_corner_radius
    if kind == "web":
        return args.web_corner_radius
    return 0


def inset_for_kind(kind: str | None, default_inset: float, args: argparse.Namespace) -> float:
    if kind == "favicon":
        return args.favicon_container_inset if args.favicon_container_inset is not None else default_inset
    if kind == "web":
        return args.web_container_inset
    return 0


def save_ico(
    source: Image.Image,
    output_path: Path,
    sizes: list[int],
    background: tuple[int, int, int, int] | None,
    corner_radius_ratio: float = 0,
    container_inset_ratio: float = 0,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    base_size = max(sizes)
    base = resize_icon(source, base_size, background, corner_radius_ratio, container_inset_ratio)
    base.save(output_path, format="ICO", sizes=[(size, size) for size in sizes])


def save_icns(source: Image.Image, output_path: Path, background: tuple[int, int, int, int] | None) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    base = resize_square(source, 1024, background)
    try:
        base.save(output_path, format="ICNS")
    except Exception as exc:
        raise SystemExit("Failed to write ICNS output with the active Pillow build.") from exc


def save_template(source: Image.Image, output_path: Path, size: int) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    resized = source.convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    alpha = resized.getchannel("A")
    template = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    template.putalpha(alpha)
    template.save(output_path)


def build_source(input_path: Path, output_dir: Path, name: str, args: argparse.Namespace) -> tuple[Path, Path]:
    source_dir = output_dir / "source"
    source_dir.mkdir(parents=True, exist_ok=True)
    image = Image.open(input_path).convert("RGBA")
    subject = crop_subject(remove_edge_background(image, args.background_threshold))
    mark_app = make_mark(subject, 512, args.app_fill)
    mark_web = make_mark(subject, 512, args.web_fill)
    mark_app_path = source_dir / f"{name}-mark-app.png"
    mark_web_path = source_dir / f"{name}-mark-web.png"
    mark_app.save(mark_app_path)
    mark_web.save(mark_web_path)
    return mark_app_path, mark_web_path


def build_web(output_dir: Path, mark_app: Image.Image, mark_web: Image.Image, args: argparse.Namespace) -> None:
    web_dir = output_dir / "web"
    web_dir.mkdir(parents=True, exist_ok=True)
    for filename, size, default_background, source_kind, radius_kind, default_inset in WEB_PNGS:
        source = mark_app if source_kind == "app" else mark_web
        background = should_use_background(default_background, args)
        radius = radius_for_kind(radius_kind, args)
        inset = inset_for_kind(radius_kind, default_inset, args)
        resize_icon(source, size, background, radius, inset).save(web_dir / filename)
    save_ico(
        mark_web,
        web_dir / "favicon.ico",
        FAVICON_ICO_SIZES,
        should_use_background(True, args),
        args.favicon_corner_radius,
    )


def build_desktop(output_dir: Path, mark_app: Image.Image, mark_web: Image.Image, args: argparse.Namespace) -> None:
    desktop_dir = output_dir / "desktop"
    icons_dir = desktop_dir / "icons"
    icons_dir.mkdir(parents=True, exist_ok=True)
    icon_background = should_use_background(True, args)
    for size in DESKTOP_ICON_SIZES:
        resize_square(mark_app, size, icon_background).save(icons_dir / f"{size}x{size}.png")
    resize_square(mark_app, 512, icon_background).save(desktop_dir / "icon.png")
    save_ico(mark_app, desktop_dir / "icon.ico", ICO_SIZES, icon_background)
    save_icns(mark_app, desktop_dir / "icon.icns", icon_background)
    resize_square(mark_web, 32, should_use_background(False, args)).save(desktop_dir / "tray.png")
    save_ico(mark_web, desktop_dir / "tray.ico", ICO_SIZES, should_use_background(False, args))
    save_template(mark_web, desktop_dir / "trayTemplate.png", 22)
    save_template(mark_web, desktop_dir / "trayTemplate@2x.png", 44)


def make_preview(output_dir: Path, paths: list[Path]) -> None:
    thumbs = []
    for path in paths:
        if not path.exists() or path.suffix.lower() not in {".png", ".ico", ".icns"}:
            continue
        try:
            image = Image.open(path).convert("RGBA")
        except Exception:
            continue
        image.thumbnail((160, 160), Image.Resampling.LANCZOS)
        thumbs.append((path.name, image.copy()))

    if not thumbs:
        return

    cell = 200
    cols = min(4, len(thumbs))
    rows = math.ceil(len(thumbs) / cols)
    sheet = Image.new("RGBA", (cols * cell, rows * cell), (245, 245, 245, 255))
    for y in range(sheet.height):
        for x in range(sheet.width):
            value = 225 if ((x // 16 + y // 16) % 2) else 245
            sheet.putpixel((x, y), (value, value, value, 255))
    for index, (_name, image) in enumerate(thumbs):
        x = (index % cols) * cell + (cell - image.width) // 2
        y = (index // cols) * cell + (cell - image.height) // 2
        sheet.alpha_composite(image, (x, y))
    sheet.convert("RGB").save(output_dir / "preview.png", quality=95)


def validate_outputs(output_dir: Path, profile: str) -> None:
    required = [output_dir / "source"]
    if profile in {"web", "all"}:
        required.append(output_dir / "web" / "favicon.ico")
    if profile in {"desktop", "all"}:
        required.extend([output_dir / "desktop" / "icon.ico", output_dir / "desktop" / "tray.ico"])
    missing = [path for path in required if not path.exists()]
    if missing:
        raise SystemExit("Missing generated output: " + ", ".join(str(path) for path in missing))


def print_summary(output_dir: Path, name: str, profile: str, args: argparse.Namespace) -> None:
    print(f"output: {output_dir}")
    print("source:")
    print(f"- source/{name}-mark-app.png")
    print(f"- source/{name}-mark-web.png")
    if profile in {"web", "all"}:
        print("web:")
        for filename, size, default_background, _source_kind, radius_kind, default_inset in WEB_PNGS:
            background = should_use_background(default_background, args)
            bg = (
                f", background #{background[0]:02x}{background[1]:02x}{background[2]:02x}"
                if background
                else ", transparent"
            )
            shape = ", rounded" if background and radius_for_kind(radius_kind, args) > 0 else ", square"
            inset = inset_for_kind(radius_kind, default_inset, args) if background else 0
            inset_text = f", inset {inset:g}" if inset else ""
            print(f"- web/{filename}: {size}x{size}{bg}{shape}{inset_text}")
        favicon_background = should_use_background(True, args)
        favicon_shape = "rounded" if favicon_background and args.favicon_corner_radius > 0 else "square"
        favicon_bg = "background" if favicon_background else "transparent"
        print(f"- web/favicon.ico: 16x16, 32x32, 48x48, {favicon_bg}, {favicon_shape}")
    if profile in {"desktop", "all"}:
        print("desktop:")
        print("- desktop/icon.icns")
        print("- desktop/icon.ico: 16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 256x256")
        print("- desktop/icon.png: 512x512")
        print("- desktop/icons/*.png: 16, 24, 32, 48, 64, 96, 128, 256, 512, 1024")
        print("- desktop/tray.ico: 16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 256x256")
        print("- desktop/tray.png: 32x32")
        print("- desktop/trayTemplate.png: 22x22")
        print("- desktop/trayTemplate@2x.png: 44x44")
    print("- preview.png")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate brand image assets from one source image.")
    parser.add_argument("--input", required=True, help="Source image path.")
    parser.add_argument("--output-dir", required=True, help="Output root directory.")
    parser.add_argument("--name", help="Output source mark filename prefix. Defaults to input filename slug.")
    parser.add_argument("--profile", choices=["source", "web", "desktop", "all"], default="all")
    parser.add_argument("--background", type=parse_hex_color, default=parse_hex_color("#ffffff"))
    parser.add_argument("--web-fill", type=parse_fill, default=0.86)
    parser.add_argument("--app-fill", type=parse_fill, default=0.68)
    parser.add_argument("--favicon-corner-radius", type=parse_corner_radius, default=0.18)
    parser.add_argument("--web-corner-radius", type=parse_corner_radius, default=0.22)
    parser.add_argument("--favicon-container-inset", type=parse_inset)
    parser.add_argument("--web-container-inset", type=parse_inset, default=0.08)
    parser.add_argument("--background-threshold", type=int, default=28)
    parser.add_argument("--force-background", action="store_true")
    parser.add_argument("--transparent-background", action="store_true")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    input_path = Path(args.input).expanduser().resolve()
    output_dir = Path(args.output_dir).expanduser().resolve()
    if not input_path.exists():
        raise SystemExit(f"Missing input file: {input_path}")
    if args.background_threshold < 0:
        raise SystemExit("--background-threshold must be greater than or equal to 0")
    if args.force_background and args.transparent_background:
        raise SystemExit("--force-background and --transparent-background cannot be used together")

    name = args.name or slug_from_path(input_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    mark_app_path, mark_web_path = build_source(input_path, output_dir, name, args)
    mark_app = Image.open(mark_app_path).convert("RGBA")
    mark_web = Image.open(mark_web_path).convert("RGBA")

    if args.profile in {"web", "all"}:
        build_web(output_dir, mark_app, mark_web, args)
    if args.profile in {"desktop", "all"}:
        build_desktop(output_dir, mark_app, mark_web, args)

    preview_paths = [mark_app_path, mark_web_path]
    if args.profile in {"web", "all"}:
        preview_paths.extend((output_dir / "web" / item[0]) for item in WEB_PNGS)
    if args.profile in {"desktop", "all"}:
        preview_paths.extend(
            [
                output_dir / "desktop" / "icon.png",
                output_dir / "desktop" / "tray.png",
                output_dir / "desktop" / "trayTemplate.png",
            ]
        )
    make_preview(output_dir, preview_paths)
    validate_outputs(output_dir, args.profile)
    print_summary(output_dir, name, args.profile, args)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
