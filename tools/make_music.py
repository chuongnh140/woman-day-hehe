"""Create a short original, looping piano-like instrumental with Python's stdlib."""
from array import array
from math import exp, pi, sin, tanh
from pathlib import Path
import sys
import wave

RATE = 22050
BEAT = 60 / 74
BAR = BEAT * 4
LENGTH = BAR * 16 + 3.2
samples = array('f', [0.0]) * int(LENGTH * RATE)


def note(midi, start, duration, velocity=0.2):
    frequency = 440 * 2 ** ((midi - 69) / 12)
    offset = int(start * RATE)
    count = min(int((duration + 0.8) * RATE), len(samples) - offset)
    harmonics = ((1, 1), (2, .24), (3, .09), (4, .025))
    decay = 1.35 if midi > 65 else .95
    for index in range(count):
        t = index / RATE
        attack = min(t / .012, 1)
        release = exp(-max(0, t - duration) * 6)
        envelope = attack * exp(-t * decay) * release
        tone = sum(amplitude * sin(2 * pi * frequency * harmonic * t) * exp(-t * .22 * (harmonic - 1)) for harmonic, amplitude in harmonics)
        samples[offset + index] += velocity * envelope * tone


# Original melody and broken chords; no recordings or third-party melodies.
chords = [(48, 55, 60, 64), (45, 52, 57, 60), (41, 48, 53, 57), (43, 50, 55, 62),
          (48, 55, 59, 64), (45, 52, 57, 60), (41, 48, 53, 60), (43, 50, 55, 59)]
melodies = [
    [(76, 0, 1.5), (74, 2, .75), (72, 3, .9)],
    [(72, 0, .9), (69, 1.5, .9), (67, 3, .9)],
    [(69, 0, 1.4), (72, 2, .9), (76, 3, .9)],
    [(74, 0, 2.5), (71, 3, .9)],
    [(76, 0, 1.4), (79, 2, .9), (76, 3, .9)],
    [(72, 0, 1.4), (71, 2, .9), (69, 3, .9)],
    [(69, 0, .9), (72, 1.5, .9), (74, 3, .9)],
    [(71, 0, 1.4), (67, 2, 1.8)],
    [(72, 0, 1.4), (76, 2, .9), (79, 3, .9)],
    [(76, 0, 1.4), (72, 2, .9), (69, 3, .9)],
    [(72, 0, 1.4), (69, 2, .9), (65, 3, .9)],
    [(67, 0, 1.4), (71, 2, 1.8)],
    [(76, 0, 1.4), (74, 2, .9), (72, 3, .9)],
    [(69, 0, 1.4), (72, 2, 1.8)],
    [(69, 0, .9), (67, 1.5, .9), (65, 3, .9)],
    [(67, 0, 1.4), (72, 2, 2.4)],
]
for bar_index, melody in enumerate(melodies):
    chord = chords[bar_index % len(chords)]
    if bar_index == 15:
        chord = (48, 55, 60, 64)
    start = .08 + bar_index * BAR
    note(chord[0], start, BEAT * 3.5, .14)
    pattern = (1, 2, 3, 2, 1, 2, 3, 2)
    for eighth, chord_index in enumerate(pattern):
        note(chord[chord_index], start + eighth * BEAT / 2, BEAT * 1.2, .074)
    for pitch, beat, length in melody:
        note(pitch, start + beat * BEAT + .025, length * BEAT, .115)

dry = samples[:]
for seconds, gain in ((.139, .13), (.283, .075), (.421, .045)):
    shift = int(seconds * RATE)
    for i in range(shift, len(samples)):
        samples[i] += dry[i - shift] * gain
peak = max(abs(value) for value in samples) or 1
pcm = array('h')
for i, sample in enumerate(samples):
    fade = min(1, i / (RATE * .25), (len(samples) - i) / (RATE * 1.7))
    pcm.append(round(tanh(sample / peak * 1.15) * 27000 * fade))
if sys.byteorder != 'little':
    pcm.byteswap()
output = Path(__file__).resolve().parents[1] / 'assets' / 'a-little-tenderness.wav'
output.parent.mkdir(exist_ok=True)
with wave.open(str(output), 'wb') as audio:
    audio.setnchannels(1)
    audio.setsampwidth(2)
    audio.setframerate(RATE)
    audio.writeframes(pcm.tobytes())
print(f'Created {output.name}: {LENGTH:.1f}s, {output.stat().st_size:,} bytes')
