"""Create seek-friendly derivatives; the owner-supplied source is never modified.
Usage: python scripts/encode-how-journey.py SOURCE.mp4 --ffmpeg PATH_TO_FFMPEG
"""
import argparse
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
parser.add_argument('--ffmpeg', required=True, type=Path)
args = parser.parse_args()
source = args.source.resolve(strict=True)
ffmpeg = args.ffmpeg.resolve(strict=True)
output = Path(__file__).resolve().parents[1] / 'public' / 'brand' / 'mywonderbox'
variants = [
    ('how-journey', 'how-journey-poster', 1280, 22),
    ('how-journey-mobile', 'how-journey-poster-compact', 640, 24),
]
if any(source == (output / (name + '.mp4')).resolve() for name, _, _, _ in variants):
    raise ValueError('Source must not be an output derivative')
for name, poster, width, crf in variants:
    target = output / (name + '.mp4')
    subprocess.run([str(ffmpeg), '-hide_banner', '-y', '-i', str(source), '-map', '0:v:0', '-an',
                    '-vf', f'scale={width}:-2:flags=lanczos,fps=24', '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf),
                    '-pix_fmt', 'yuv420p', '-g', '6', '-keyint_min', '6',
                    '-sc_threshold', '0', '-bf', '0', '-movflags', '+faststart', str(target)], check=True)
    subprocess.run([str(ffmpeg), '-hide_banner', '-y', '-i', str(target), '-frames:v', '1',
                    '-c:v', 'libwebp', '-quality', '86', str(output / (poster + '.webp'))], check=True)
