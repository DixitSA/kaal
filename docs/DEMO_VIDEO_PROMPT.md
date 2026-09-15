# Kaal Demo Video: Google Flow Prompt Pack

A shot-by-shot prompt pack for producing a 40 second Kaal demo film in Google Flow
(Veo). Everything here is derived from `PRODUCT.md` and `DESIGN.md`, so the film
matches the Editorial Sanctuary language the product already speaks.

---

## 0. How to use this in Flow

Flow generates in roughly 8 second clips, so the film is written as five clips plus
an optional sixth. Work in this order:

1. Create a new project, set **Model: Veo (latest quality)**, **Aspect 16:9**,
   **Outputs per prompt: 2 to 4**.
2. Upload the style ingredients listed in section 1 under **Ingredients to Video**,
   so every clip inherits the same palette and grain.
3. Generate clips 1 to 5 as separate scenes, then order them in the Scenebuilder.
4. Where two clips must feel continuous, use **Frames to Video**: take the last
   frame of the previous clip as the start frame of the next.
5. Export, then composite the real product screens and typography in your editor
   (see section 4). Do not ask Veo to render Kaal's interface copy.

### The one rule that saves the most reroll credits

Generative video cannot render legible product UI or typography reliably. Every
prompt below deliberately keeps screens **out of focus, off angle, glare washed, or
cropped**, so the app reads as present without Veo trying to spell it. The real
dashboard goes in during the edit as a screen recording, tracked into the device.

---

## 1. Style ingredients (upload these first)

Generate or shoot three reference stills and add them as ingredients:

| Ingredient | What it anchors |
|---|---|
| Palette card | Parchment cream `#F5F0E8`, charcoal ink `#2C2418`, terracotta `#B5563E`, brass gold `#786030`, muted sage `#5E7A5E` |
| Texture plate | Uncoated paper grain, letterpress tooth, a faint yantra line drawing at 5 percent opacity |
| Set still | A warm room at dawn: linen, unglazed ceramic, brass, aged paper, one clay cup |

### Reusable style block

Paste this at the end of every clip prompt:

> Shot on 35mm film, anamorphic, shallow depth of field, soft directional dawn light
> from a single window, warm earthy palette of parchment cream, charcoal brown,
> terracotta clay, brass and sage. Editorial magazine photography, tactile paper and
> linen textures, muted contrast, fine natural grain, no color pop. Calm unhurried
> pacing. Handheld micro movement only.

### Negative prompt (paste into the negative field every time)

> text, on-screen text, captions, subtitles, watermarks, logos, user interface,
> legible screen content, purple, neon, glowing gradients, starfield, galaxy,
> crystals, zodiac wheels, tarot cards, incense theatrics, stock corporate office,
> blue corporate palette, glossy plastic, lens flare spam, fast cuts, whip pans,
> distorted hands, extra fingers, warped jewelry

---

## 2. The five clips

Each clip gives you **Prompt**, **Camera**, and **Audio**. In Flow, put the prompt
body in the main field and keep the camera and audio lines inside the same prompt
text (Veo reads them), then append the style block from section 1.

### Clip 1 — The unresolved decision (0:00 to 0:08)

**Prompt**

> A woman in her early thirties sits at a worn wooden desk in a dim apartment before
> sunrise, wearing a soft oatmeal sweater. A contract and a pen rest under her hand.
> She hovers the pen above the signature line, hesitates, and sets it down without
> signing. She exhales and looks toward the window, where first light is just
> reaching the sill. The room is quiet and still. Her face is thoughtful, not
> distressed.

**Camera:** Slow push in from a medium wide to a medium, eye level, 40mm, subject
slightly off center with negative space to her right.

**Audio:** Room tone, a distant early morning street, the small click of a pen set
down on wood. No music, no dialogue.

---

### Clip 2 — The ritual (0:08 to 0:16)

**Prompt**

> Morning has arrived. The same woman pours tea into an unglazed clay cup beside the
> window, then picks up a phone from the table and turns it face up in her palm. The
> phone screen glows a warm cream color, held at a low angle so the screen is a soft
> bright rectangle rather than readable content. She settles into a chair with the
> cup in one hand and the phone in the other, shoulders dropping as she reads. Steam
> drifts across the frame. Dust floats in the window light.

**Camera:** Static locked off wide, then a gentle handheld drift into a two thirds
profile. Screen stays at a raking angle to the lens.

**Audio:** Tea pouring, ceramic on wood, a single distant bird. No music.

> Continuity note: use the last frame of Clip 1 as the start frame here so the room
> and wardrobe match.

---

### Clip 3 — The signal, macro (0:16 to 0:24)

**Prompt**

> Extreme close up of the phone held in two hands. The screen is a warm parchment
> cream field with a thin terracotta rule across it and a single small block of dark
> text, deliberately out of focus and unreadable, drifting in and out of the focal
> plane. Her thumb scrolls once, slowly and deliberately. The reflection of the
> window curves across the glass. Cut to her eyes as they settle and narrow slightly
> with recognition, then a small nod.

**Camera:** Macro 100mm, very shallow focus, a single rack focus from the screen to
her eyes. No cuts inside the shot, let the rack do the work.

**Audio:** A single soft thumb swipe on glass, breath, room tone. No UI beeps.

> This is the clip you will overlay the real Today section on. Keep the screen
> largely flat and evenly lit so the tracked composite sits cleanly.

---

### Clip 4 — Acting on the timing (0:24 to 0:32)

**Prompt**

> She sets the phone down face up on the desk, picks up the pen, and signs the
> contract in one unhurried stroke. Full daylight now fills the room, warm and
> directional. She caps the pen and sits back. A brass desk object and a small stack
> of paper sit in the foreground, slightly out of focus.

**Camera:** Low angle close on the hand and pen, then a cut to a medium wide as she
sits back. Handheld, minimal drift.

**Audio:** Pen on paper, a chair settling, the room's daylight ambience. No music.

---

### Clip 5 — Brand close (0:32 to 0:40)

**Prompt**

> The empty desk in soft afternoon light. The clay cup, the signed page, and the
> phone lying face down on the wood. A slow drift across the surface as the light
> moves. The frame is still, composed like an editorial magazine spread, with clean
> negative space in the upper third for a title card.

**Camera:** Slow lateral dolly right, 50mm, static subject, 4 to 5 seconds of hold at
the end on a clean composition.

**Audio:** Room tone fading to near silence.

> Leave the upper third empty. The wordmark and the closing line are typeset in the
> edit, never generated.

---

### Optional Clip 6 — The method (insert after Clip 3 if you want a 48 second cut)

**Prompt**

> Overhead flat lay on aged paper: a brass drafting compass, a hand drawn geometric
> yantra in fine dark ink, and a folded almanac page. A hand enters the frame and
> traces one line of the geometry with a fingertip. The paper is deeply textured, the
> ink is matte and hand made, the light is a single soft window source.

**Camera:** Locked off overhead, slow 5 percent push in.

**Audio:** Paper texture, a fingertip on rough stock, distant room tone.

---

## 3. Voiceover and on-screen copy

Generate the voice separately (Veo dialogue is inconsistent across clips). Direction:
a calm, low, unhurried woman's voice, warm and certain, the register of a seasoned
counselor rather than a meditation app. Sentence case, never breathy.

| Timecode | Voiceover | On-screen text (typeset in edit) |
|---|---|---|
| 0:02 | some decisions are not about what. they are about when. | |
| 0:10 | kaal reads your birth chart once, then tells you what today is carrying. | `Built on Vedic timing systems` |
| 0:18 | a signal for the day. the phase you are inside. what to move on, and what to leave alone. | Real Today section composite |
| 0:26 | ask it directly. career, money, relationships, travel, a move, a conversation. | Real Decision tabs composite |
| 0:34 | | `Kaal` wordmark, then `know what's happening. know what to do.` |

Copy rules inherited from `DESIGN.md`: body and guidance lines stay lowercase or
sentence case, only labels and micro copy go uppercase, and no em dashes anywhere.

---

## 4. The composite pass (this is where the product actually appears)

Flow gives you the film. The product footage comes from the real app:

1. Run the app locally and screen record on a real device or a device frame at
   60fps: the birth form, the loading screen, the Today section, Current Phase, and
   the Decision tabs with category switching.
2. Track the recording onto the phone screen in Clips 2, 3 and 4. Match the parchment
   cream of the UI to the film's white balance so it reads as the same room light.
3. Add a subtle screen reflection and a touch of grain over the composite so it does
   not sit on top of the plate.
4. Typeset the title card and captions in Playfair Display for display lines and
   Inter for body, per the type scale in `DESIGN.md`.
5. Score it with a sparse acoustic bed: single sustained strings or a tanpura like
   drone, low in the mix. No tabla build, no percussion swell, no cinematic riser.
6. Respect the product's own restraint: terracotta appears on no more than about 15
   percent of any frame.

---

## 5. Prompting notes for Flow specifically

- **One idea per clip.** Veo degrades when a prompt carries two beats. Clip 1 is
  hesitation, Clip 4 is commitment. Do not merge them.
- **Describe light, not mood words.** "Single soft window source at low angle" gets
  you further than "serene" or "sacred".
- **Use Frames to Video for continuity.** Wardrobe and room drift between
  independent generations, so chain the clips through their end frames.
- **Generate four variants and pick.** The keeper is usually the one where the hands
  behave. Hands on a pen and a phone are the highest risk elements in this film.
- **Extend rather than re-prompt** when a clip is right but ends early.
- **Keep screens oblique.** Any prompt that asks Veo for readable interface copy will
  produce convincing nonsense, which is worse than an out of focus screen.

---

## 6. Copy paste block for Clip 3

For convenience, the highest value single clip, fully assembled:

> Extreme close up of a phone held in two hands in warm morning window light. The
> screen is a warm parchment cream field with a thin terracotta rule and a single
> small block of dark text, deliberately out of focus and unreadable, drifting in and
> out of the focal plane. A thumb scrolls once, slowly and deliberately. The window
> reflection curves across the glass. Rack focus from the screen to the woman's eyes
> as they settle and narrow slightly with recognition, then a small nod. Macro 100mm,
> very shallow depth of field, single rack focus, no cuts. Audio: one soft thumb
> swipe on glass, quiet breath, room tone, no music and no interface sounds. Shot on
> 35mm film, anamorphic, soft directional dawn light from a single window, warm
> earthy palette of parchment cream, charcoal brown, terracotta clay, brass and sage.
> Editorial magazine photography, tactile paper and linen textures, muted contrast,
> fine natural grain. Calm unhurried pacing, handheld micro movement only.
>
> Negative prompt: text, on-screen text, captions, subtitles, watermarks, logos,
> legible screen content, purple, neon, glowing gradients, starfield, crystals,
> zodiac wheels, corporate office, blue palette, glossy plastic, fast cuts, distorted
> hands, extra fingers.
