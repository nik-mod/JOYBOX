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
output = Path(__file__).resolve().parents[1] / 'public' / 'brand'
for name, width, crf, keyframes in [('how-journey', 1920, 21, 6), ('how-journey-mobile', 960, 22, 4)]:
    target = output / (name + '.mp4')
    if source == target.resolve():
        raise ValueError('Source must not be an output derivative')
    subprocess.run([str(ffmpeg), '-hide_banner', '-y', '-i', str(source), '-map', '0:v:0', '-an',
                    '-vf', f'scale={width}:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf),
                    '-pix_fmt', 'yuv420p', '-g', str(keyframes), '-keyint_min', str(keyframes),
                    '-sc_threshold', '0', '-bf', '0', '-movflags', '+faststart', str(target)], check=True)
for name, time in [('how-journey-poster', 0), ('how-journey-reveal', 14.875)]:
    subprocess.run([str(ffmpeg), '-hide_banner', '-y', '-ss', str(time), '-i', str(source),
                    '-frames:v', '1', '-vf', 'scale=1440:-2', '-c:v', 'libwebp', '-quality', '86',
                    str(output / (name + '.webp'))], check=True)
