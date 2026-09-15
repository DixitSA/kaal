# Kaal Demo Video: Google Flow Prompt Pack

A shot-by-shot prompt pack for producing a 40 second Kaal demo film in Google Flow
(Veo). Everything here is derived from `PRODUCT.md` and `DESIGN.md`, so the film
matches the Editorial Sanctuary language the product already speaks.

Section 2 is the 16:9 cut for the site hero and YouTube. Section 7 is the vertical
9:16 cut for Instagram Reels, recomposed rather than cropped.

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

## 2. The five clips (16:9)

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

---

## 7. The vertical cut (9:16) for Instagram

Set **Aspect 9:16** in Flow and generate these fresh. Do not center crop the 16:9
clips: the lateral dolly in Clip 5 has nowhere to travel in a tall frame, and cropping
a 40mm medium gives you a tight, headroom starved portrait that loses the editorial
composition entirely.

### What actually changes

- **Negative space moves from beside the subject to above and below her.** In 16:9 she
  sits off center with room to her right. In 9:16 she sits in the lower two thirds with
  window light and empty wall above.
- **Horizontal camera moves become vertical ones.** Lateral dollies become boom downs
  and tilts. A tall frame rewards rising steam, falling light, and a tilt that travels
  from a surface up to a face.
- **Desk work goes overhead.** Hands on paper read far better top down in vertical than
  from a low side angle.
- **The phone composite gets better, not worse.** A vertical phone in a vertical frame
  can run nearly full height, which means the real Today section composite is larger
  and more legible than it ever was in 16:9. Clip 3 is the payoff shot here.

### Safe zones (1080 x 1920)

Instagram overlays its own furniture on your frame. Keep anything that matters inside
the middle band:

| Zone | Keep clear |
|---|---|
| Top 250px | Reels header and sound attribution |
| Bottom 420px | Caption, username, audio ticker |
| Right 180px | Like, comment, share, save buttons |

So the working area is roughly **y 250 to y 1500, x 0 to x 900**. Faces, the phone
screen composite, and any typeset line all live inside that. The brand card in Clip 5
sits in the upper middle, not the top edge.

### Watch it muted

Most Reels views start with sound off, so the voiceover cannot carry the film. Burn the
voiceover lines in as typeset captions in the middle band, styled per `DESIGN.md`:
Playfair Display for the display lines, Inter for body, lowercase, no em dashes. Treat
the audio as a bonus for the people who turn it on.

### Order for Instagram

The 16:9 cut builds slowly, which suits a landing page where the viewer already chose
to be there. A Reel has about one second before the thumb moves, so the vertical cut
leads with the payoff and explains afterward. **Section 8 supersedes this section on
ordering and timing**: it carries the full retention beat sheet, the extra micro beats
the Reel needs, and the loop. Generate the clips here, then assemble them per section 8.

---

### V1 — The unresolved decision (vertical)

> A woman in her early thirties sits at a worn wooden desk in a dim apartment before
> sunrise, wearing a soft oatmeal sweater, framed in the lower two thirds of a tall
> vertical frame with the window and empty wall above her. A contract and a pen rest
> under her hand at the bottom of frame. She hovers the pen above the signature line,
> hesitates, and sets it down without signing. She exhales and looks up toward the
> window, where first light is just reaching the sill. Her face is thoughtful, not
> distressed. Camera: vertical portrait composition, slow push in at chest height, 35mm,
> generous headroom filled with soft window light. Audio: room tone, a distant early
> morning street, the small click of a pen set down on wood, no music and no dialogue.

### V2 — The ritual (vertical)

> A woman pours tea into an unglazed clay cup beside a window, hands and cup centered in
> a tall vertical frame with steam rising through the upper third. She sets the pot
> down, picks up a phone, and turns it face up in her palm. The screen glows a warm
> cream color, held at a raking angle so it reads as a soft bright rectangle rather than
> readable content. Camera: vertical portrait composition, starts centered on the cup
> and hands, then a slow tilt up from the cup to her face as she settles and reads.
> Audio: tea pouring, ceramic on wood, a single distant bird, no music.

### V3 — The signal, macro (vertical) — the hook shot

> Extreme close up of a phone held upright in two hands in warm morning window light,
> the phone running nearly the full height of a tall vertical frame. The screen is a
> warm parchment cream field with a thin terracotta rule and a single small block of
> dark text, deliberately out of focus and unreadable, drifting in and out of the focal
> plane. A thumb scrolls once, slowly and deliberately. The window reflection curves
> across the glass. Rack focus up from the screen to the woman's eyes at the top of
> frame as they settle and narrow slightly with recognition, then a small nod. Camera:
> vertical portrait composition, macro 85mm, very shallow depth of field, a single
> vertical rack focus from the lower frame to the upper frame, no cuts. Audio: one soft
> thumb swipe on glass, quiet breath, room tone, no music and no interface sounds.

### V4 — Acting on the timing (vertical)

> Overhead top down view of a worn wooden desk in full warm daylight, shot straight down
> into a tall vertical frame. A phone lies face up at the bottom of frame. A hand enters
> from the lower edge, picks up a pen, and signs a contract in one unhurried stroke. The
> hand withdraws and the signed page sits alone. Camera: vertical portrait composition,
> locked off overhead, slow five percent push in, minimal handheld drift. Audio: pen on
> paper, a chair settling, the room's daylight ambience, no music.

### V5 — Brand close (vertical)

> An empty desk in soft afternoon light, shot from a high three quarter angle into a
> tall vertical frame. A clay cup, a signed page, and a phone lying face down on the
> wood are arranged in the lower half, with clean empty wood and wall filling the upper
> half. Camera: vertical portrait composition, a slow boom down over the surface as the
> light moves, settling into a still, composed editorial still life and holding for four
> to five seconds. Audio: room tone fading to near silence.

### V6 — The method (vertical, optional)

> Overhead flat lay on aged paper in a tall vertical frame: a brass drafting compass, a
> hand drawn geometric yantra in fine dark ink, and a folded almanac page, arranged in a
> vertical stack down the center of frame. A hand enters from the lower edge and traces
> one line of the geometry with a fingertip. The paper is deeply textured, the ink is
> matte and hand made, the light is a single soft window source. Camera: vertical
> portrait composition, locked off overhead, slow five percent push in. Audio: paper
> texture, a fingertip on rough stock, distant room tone.

---

Append the same style block from section 1 and the same negative prompt to every
vertical clip. Add `vertical composition, portrait orientation` to the front of the
style block, and add `letterboxing, pillarboxing, black bars, horizontal composition`
to the negative prompt so Flow does not hand you a padded landscape frame.

---

## 8. Product trailer structure and Reel retention

This section turns the clips above into an edit that actually holds attention. It
supersedes section 7 on ordering and timing.

### The tension, and how this resolves it

Standard Reels advice says cut every one to two seconds, open loud, and never hold a
frame. Applied literally, that produces exactly the thing `PRODUCT.md` lists as an anti
reference: frantic, corporate, and at odds with a product whose entire claim is calm,
intentional timing. A hectic ad for a patience product does not convert, it confuses.

The resolution is that premium brands do not hold attention with cutting speed. They
hold it with **tactile density and sound**. Macro texture, a thumb on glass, tea hitting
clay, a pen nib on rough paper: these are ASMR triggers, and they are the highest
retention tool available that does not break the brand. So this edit keeps the calm
pacing and buys attention with texture and audio instead of velocity.

Two retention rules we do adopt without compromise, because they cost the brand nothing:

1. **The product appears in the first second.** In the 16:9 cut the app shows up at
   0:16, which is fatal for a trailer. Here it is frame one.
2. **The film loops.** Last frame matches first frame, so a replay is seamless. Watch
   time is measured as a ratio, and a clean loop inflates it more than any hook line.

### Product trailer fundamentals applied

| Principle | How this cut does it |
|---|---|
| Show the product doing the thing, early | Real Today section composited into the opening macro shot |
| One value prop, not a feature list | "know when" is the only claim. Chart math, nakshatras and tara bala stay out |
| Problem before payoff, but briefly | The unsigned contract lands at 0:03, after the hook, not before it |
| A hero moment | The Decision tabs: ask a real question, get a real answer |
| Earn the end card | Wordmark only at the end, never at the head |

### Never put the logo first

A brand card at 0:00 is the single most reliable way to lose a Reel audience. The viewer
has not been given a reason to care yet, so the logo reads as an ad and the thumb moves.
Kaal's wordmark appears at 0:19 and not before.

### The beat sheet (23 seconds)

| Time | Shot | On screen text | Retention function |
|---|---|---|---|
| 0:00 to 0:02 | V3 macro, thumb swipe on the real Today screen | `some decisions aren't about what` | Hook. Motion and text in frame one |
| 0:02 to 0:04 | V3 continues, rack up to her eyes | `they're about when` | Open loop. The claim lands, the proof has not |
| 0:04 to 0:07 | V1 pen hovering over the unsigned contract | `so you sit on it for a week` | Problem. Recognition beat |
| 0:07 to 0:10 | V2 tea pour, phone turned face up | `kaal reads your chart once` | Pattern interrupt. ASMR pour |
| 0:10 to 0:13 | Real UI: Today section, signal and focus area | `then tells you what today is carrying` | Product proof |
| 0:13 to 0:16 | Real UI: Decision tabs switching category | `ask it directly` | Hero moment. Interaction, not narration |
| 0:16 to 0:19 | V4 overhead, the contract signed in one stroke | `then move` | Payoff. Loop closes on the 0:04 problem |
| 0:19 to 0:23 | V5 brand close, phone face down | `Kaal` then `know what's happening. know what to do.` | End card and visual loop back to frame one |

### Where the retention dips, and what sits there

Reels lose people at predictable moments. Each one gets a new visual or sonic event:

- **0:02** the first scroll decision. The rack focus to her eyes fires here, plus the
  caption's second half. Never hold a static frame across this mark.
- **0:07** the post hook slump. The tea pour is the loudest, most tactile sound in the
  film and it lands exactly here.
- **0:13** the mid film drift. The Decision tab switch is the only moment of visible
  interface motion, so it carries this beat.
- **0:19** the exit. The signed page and the end card arrive together, and the frame
  match to 0:00 invites the replay.

### The loop

End V5 on the phone lying face down on the wood in soft light. Open V3 on two hands
lifting a phone into the same light, matched in white balance and position. Cut them
together and the film reads as continuous on replay. Test it by watching three times in
a row: if you cannot find the seam, it is right.

### Captions

- Burned in, not auto generated. Instagram's auto captions will break the typography.
- Two to four words per card, swapped on the beat, never a paragraph.
- Positioned in the middle band (y 250 to y 1500), never the bottom where the real
  caption and audio ticker sit.
- Playfair Display for the display lines, Inter for the body lines, lowercase, no em
  dashes, per `DESIGN.md`.
- Hold each card for a minimum of 0.8 seconds, or it cannot be read.

### Sound design is the retention engine

Build the mix in this order, and keep it quiet enough to feel expensive:

1. **Tactile layer, loud and close.** Thumb on glass at 0:00, tea into clay at 0:07, pen
   nib on paper at 0:16. These are the hooks. Mix them forward, almost uncomfortably
   present.
2. **Room tone bed.** Continuous, the same room across every cut, so the film feels like
   one morning rather than eight generations.
3. **Music last and lowest.** A single sustained string or a tanpura like drone, no
   percussion, no build, no riser. If the music is noticeable, it is too loud.

The tactile layer is doing the work that fast cutting does in a conventional Reel. Do
not bury it under music.

### The first frame is a thumbnail

Whatever frame the Reel opens on is what appears in the grid and in feed previews. Open
on the phone already in hand with the warm cream screen visible and her hands in frame:
legible at a glance, warm against a feed of white and blue, and it poses a question. Do
not open on black, on a fade in, or on an empty room.

### Hook line alternatives

Test these against the default. Same footage, swap the 0:00 caption only:

- `some decisions aren't about what. they're about when.` (default, claim led)
- `i stopped guessing when to make big decisions.` (first person, highest reach)
- `your chart already knows what today is carrying.` (curiosity led)
- `the contract sat unsigned for nine days.` (story led, pairs with V1)

Run one per week against the same edit and keep the winner. Hook swaps move retention
far more than any other variable in this list.

### Extra micro beats to generate

The beat sheet needs three inserts that are not in section 7. Generate these at 9:16
with the same style and negative blocks:

**M1, the loop opener (2 seconds, precedes V3)**

> Two hands lift a phone upright into warm morning window light in a tall vertical
> frame, the screen a soft parchment cream rectangle, the motion settling as the phone
> reaches eye level. Camera: vertical portrait composition, macro 85mm, locked off, the
> phone rising into a static frame. Audio: fabric movement and a quiet breath.

**M2, the recognition insert (1.5 seconds, sits at 0:02)**

> Extreme close up of a woman's eyes in warm morning light in a tall vertical frame,
> catching the soft cream glow of a screen below. Her gaze settles, narrows very
> slightly, and she gives a single small nod. Camera: vertical portrait composition,
> macro 100mm, static, very shallow depth of field. Audio: one quiet breath, room tone.

**M3, the loop closer (2 seconds, ends V5)**

> A phone lies face down on worn wood in soft afternoon light in a tall vertical frame,
> beside a clay cup. The light shifts almost imperceptibly across the surface. Camera:
> vertical portrait composition, locked off, completely static, no movement in frame.
> Audio: room tone fading to near silence.

Match M3's light and framing to M1 so the loop is invisible.

### The seven second cut

For paid placement and for feeds that punish anything long, there is a shorter edit made
entirely from footage above:

`M1 and V3 macro with the hook caption (0 to 3) → Decision tab switch, real UI (3 to 5)
→ wordmark over V5 (5 to 7).`

Hook, product, name. Completion rate on a seven second Reel runs far higher than on a
twenty three second one, and completion is what the ranking actually rewards.
