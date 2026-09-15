# Kaal Demo Video: Google Flow Prompt Pack

Prompts and edit plan for the Kaal trailer (16:9, site hero and YouTube) and Instagram
Reels (9:16), written for **Google Flow on Gemini Omni 1.1 Flash** as of September 2026.
Creative direction is derived from `PRODUCT.md` and `DESIGN.md` (Editorial Sanctuary:
parchment cream, terracotta, brass, sage; Playfair Display and Inter; no purple, no
starfields, no crystals; lowercase body copy, no em dashes).

Sections 1 to 3 are the rules. Sections 4 to 7 are the prompts. Section 9 is the path to
automating all of it.

---

## 1. Flow setup

| Setting | Use | Why |
|---|---|---|
| Model | **Gemini Omni 1.1 Flash** | Better character consistency, readable text, conversational edits, start and end frames. Keep Veo 3.1 as a fallback if a shot's physics look wrong |
| Aspect | 16:9 for the trailer, **9:16 native** for Reels | Omni generates vertical natively. Never crop 16:9 to 9:16 |
| Duration | 3 to 10 s per generation | Omni's limit. Extend up to 40 s total when a take is right but short |
| Resolution | **Draft at 360p**, download finals at 1080p (4K for the site hero) | 360p drafts cost fewer credits. Only upscale the take you keep |
| Outputs | 2 per prompt while drafting, 4 for hand-heavy shots | Hands on a pen and a phone are the most likely failures |

Check the credit cost shown in the prompt box before each run. Prices and defaults change.

**Use the Flow Agent for batch work.** Asking it things costs nothing; only generating
uses credits. Give it section 2 of this doc as project context, then ask for batches
("generate V2 and V4 with 2 variations each at 360p, 9:16") and have it name assets by
clip ID (`V3_take2`).

---

## 2. How Omni wants to be prompted

These rules come from Google's official Omni skill and prompting guide (sources at the
end). They replace the Veo-era habits in the first version of this doc.

**Five parts, in this order:** Goal, Input role, Scene, Motion, Constraints.

1. **Say single shot, or you get several.** By default Omni cuts between shots and builds
   its own mini narrative. For a single take write `Single continuous shot, no scene cuts.`
   To get a planned sequence of shots, use timecodes (rule 3).
2. **Flow has no negative prompt box.** Describe the look you want positively, then add a
   short `Constraints` line with simple exclusions such as `No dialogue. No music.`
   Long "no purple, no neon, no starfield…" lists pull those exact things into the frame.
   If a take drifts, fix it with an edit (section 8), not a longer list.
3. **Timecodes control the beats.** `[0-3s] … [3-6s] … [6-10s] …` sets exactly what
   happens when, including cuts. This is how a whole Reel sequence can come out of one
   generation with the same woman, room and light.
4. **Always describe the audio.** Omni generates sound by default and may add music. Name
   the sounds you want, and write `No music` when the score is added in the edit.
5. **Don't over-explain.** Omni already knows what dawn light, linen and a clay cup look
   like. Spend words on camera, action and timing, not adjectives like "serene" or
   "sacred".
6. **Text now renders correctly.** Put exact words in quotes. We still typeset Kaal's
   captions and wordmark in the edit because Omni can't guarantee Playfair Display. Use
   Omni text only for text that belongs in the scene, like a contract heading.
7. **Say what each reference is for.** "Use the character reference for her face, hair and
   sweater. Use the style reference for palette and grain only, not as a first frame."

---

## 3. Build the references first

Make these once in Flow (Nano Banana Pro images) or photograph them, then attach them to
every clip. They replace the old approach of chaining one clip's last frame into the next.

| Ref | Make it like this | Attach to |
|---|---|---|
| **CHAR** | Front and three-quarter views of the woman on a plain warm-grey background: early thirties, dark hair loosely tied, soft oatmeal knit sweater, no jewellery. Same image every time | Every clip with her in it |
| **STYLE** | One still: a warm room at dawn, linen, unglazed clay cup, brass object, aged paper, single window light, fine film grain, parchment cream, charcoal brown, terracotta, sage | Every clip |
| **UI** | Real 1080×1920 screenshot of the Kaal Today section (and one of the Decision tabs) | Phone macro shots, as a test (section 6) |
| **LOOP** | A still saved from the first frame of Reel part A (section 7) | Last frame of Reel part B |

Flow's advice: use plain or segmented backgrounds for character and product references.
Keep your text consistent with the references. A prompt that contradicts a reference
loses to it.

**Look line.** Put this at the end of every prompt instead of the old long style block:

> Look: 35mm film, shallow depth of field, single soft window light, warm earthy palette
> matching the style reference, fine grain, muted contrast, calm unhurried pacing.

---

## 4. Trailer, 16:9 (five clips, about 40 s)

Attach **CHAR** and **STYLE** to every clip. Draft at 360p, final at 1080p or 4K.

### T1: The unresolved decision (8 s)

> Goal: an 8 second opening shot of a woman unable to sign a contract before sunrise.
> Input role: the character reference is the woman; the style reference sets palette and
> light only.
> Scene: she sits at a worn wooden desk in a dim apartment before dawn. A contract and a
> pen rest under her hand. First light is just reaching the window sill.
> Motion: [0-4s] slow push in from medium wide to medium, eye level, 40mm, her off center
> with space to her right; she hovers the pen above the signature line. [4-8s] she
> hesitates, sets the pen down without signing, exhales and looks toward the window.
> Thoughtful, not distressed.
> Audio: quiet room tone, a distant early morning street, the small click of the pen on
> wood.
> Constraints: single continuous shot, no scene cuts. No dialogue. No music.
> Look: (look line)

### T2: The ritual (8 s)

> Goal: an 8 second shot of the same woman starting her morning ritual with her phone.
> Input role: character reference is the woman; style reference sets palette and light.
> Scene: morning light fills the same room. A clay teapot, an unglazed cup and a phone lie
> face down on a small table by the window.
> Motion: [0-3s] static wide as she pours tea, steam rising through window light. [3-8s]
> slow handheld drift into a two-thirds profile as she turns the phone face up and settles
> into a chair to read, shoulders dropping. The screen is angled away from the lens, a soft
> warm cream glow.
> Audio: tea pouring into clay, ceramic set on wood, one distant bird.
> Constraints: single continuous shot, no scene cuts. No dialogue. No music.
> Look: (look line)

### T3: The signal, macro (8 s)

> Goal: an 8 second macro of the moment she reads her daily signal and recognises it.
> Input role: character reference is the woman; style reference sets palette and light.
> Scene: extreme close up of a phone held in two hands in warm window light. The screen is
> a parchment cream field with a thin terracotta line and a small block of dark text,
> softly out of focus. The window reflection curves across the glass.
> Motion: [0-4s] macro 100mm, very shallow focus; her thumb scrolls once, slowly. [4-8s]
> one rack focus up from the screen to her eyes as they settle and narrow slightly, then a
> small nod.
> Audio: one soft thumb swipe on glass, a quiet breath, room tone.
> Constraints: single continuous shot, no scene cuts. No dialogue. No music. No interface
> sounds.
> Look: (look line)

### T4: Acting on the timing (8 s)

> Goal: an 8 second shot of her signing the contract with calm certainty.
> Input role: character reference is the woman; style reference sets palette and light.
> Scene: full warm daylight on the desk. The phone lies face up beside the contract. A
> brass object and a small paper stack sit out of focus in the foreground.
> Motion: [0-4s] low close angle on her hand as she picks up the pen and signs in one
> unhurried stroke. [4-8s] cut to a medium wide as she caps the pen and sits back.
> Audio: pen nib on paper, a chair settling, daylight room ambience.
> Constraints: exactly one cut, at 4s. No dialogue. No music.
> Look: (look line)

### T5: Brand close (8 s)

> Goal: an 8 second still-life end card plate with room for a title.
> Input role: style reference sets palette and light. No person in frame.
> Scene: the empty desk in soft afternoon light: the clay cup, the signed page, and the
> phone lying face down on the wood. Clean empty wall in the upper third.
> Motion: [0-4s] slow lateral dolly right, 50mm. [4-8s] settle and hold completely still on
> a composed editorial arrangement.
> Audio: room tone fading to near silence.
> Constraints: single continuous shot. No text in frame. No dialogue. No music.
> Look: (look line)

### T6 (optional): The method (8 s, insert after T3 for a 48 s cut)

> Goal: an 8 second overhead insert suggesting the Vedic method behind Kaal.
> Input role: style reference sets palette and light.
> Scene: overhead flat lay on aged, deeply textured paper: a brass drafting compass, a
> hand-drawn geometric yantra in fine matte ink, a folded almanac page.
> Motion: locked off overhead with a slow 5 percent push in. At 3s a hand enters and traces
> one line of the geometry with a fingertip.
> Audio: fingertip on rough paper, distant room tone.
> Constraints: single continuous shot. No dialogue. No music.
> Look: (look line)

---

## 5. Voiceover and on-screen copy

Record or generate the voice separately, not in Omni (Omni can't take audio references yet,
and a voice drifts between separate generations). Direction: a calm, low, unhurried woman's
voice, warm and certain, like a seasoned counsellor rather than a meditation app.

| Time | Voiceover | On screen (typeset in edit) |
|---|---|---|
| 0:02 | some decisions are not about what. they are about when. | |
| 0:10 | kaal reads your birth chart once, then tells you what today is carrying. | `Built on Vedic timing systems` |
| 0:18 | a signal for the day. the phase you are inside. what to move on, and what to leave alone. | Today section cut-in |
| 0:26 | ask it directly. career, money, relationships, travel, a move, a conversation. | Decision tabs cut-in |
| 0:34 | | `Kaal`, then `know what's happening. know what to do.` |

Copy rules from `DESIGN.md`: body lines lowercase or sentence case, only labels uppercase,
no em dashes.

---

## 6. Showing the real product

**Default: cut to full-screen app footage. Don't track it onto the phone.** Tracking a
recording onto a generated phone takes After Effects-level work and was the bottleneck of
the first plan. A clean cut to the real interface reads as more honest anyway.

1. Record the app at 1080×1920 (portrait) and 1920×1080 (a desktop or device frame): the
   birth form, loading screen, Today section, Current Phase, Decision tabs switching
   category. Playwright can script this so it's repeatable (section 9).
2. Grade the recording slightly warm and add a touch of grain so it sits next to the film.
3. Cut in on a motion beat: the thumb swipe in T3 or V3, the tab switch.

**Optional test: Kaal's screen inside the shot.** Attach **UI** to T3 or V3 and change the
scene line to: `The phone screen shows the app screen from the UI reference, held flat to
camera, slightly soft.` Omni's text handling means this can now work. If the screen text
comes out garbled after two tries, go back to the cut-in and keep the screen soft.

---

## 7. Instagram Reel, 9:16 (23 s, loops)

### Retention rules this cut is built on

- **The product is in frame one.** A logo or slow build at 0:00 loses the scroll.
- **It loops.** The last frame matches the first, so a replay feels like one continuous
  video and watch time counts it again. Omni can do this natively (part B below).
- **Texture and sound hold attention, not fast cutting.** Frantic pacing contradicts a
  product about calm timing (`PRODUCT.md` anti-references). Macro detail plus close
  sounds (thumb on glass, tea on clay, pen nib on paper) do the work.
- **Muted first.** Captions carry the message; audio is a bonus.

### Beat sheet

| Time | Shot | Caption | Job |
|---|---|---|---|
| 0:00-0:02 | Part A, hands lift phone, thumb swipe | `some decisions aren't about what` | Hook, motion in frame one |
| 0:02-0:04 | Part A, rack to her eyes | `they're about when` | Claim lands, proof pending |
| 0:04-0:07 | Part A, pen hovering over contract | `so you sit on it for a week` | Problem, recognition |
| 0:07-0:10 | Part A, tea pour, phone turned up | `kaal reads your chart once` | Pattern interrupt, loud ASMR |
| 0:10-0:13 | App cut-in: Today section | `then tells you what today is carrying` | Product proof |
| 0:13-0:16 | App cut-in: Decision tabs switching | `ask it directly` | Hero moment |
| 0:16-0:19 | Part B, overhead signature | `then move` | Payoff, closes the 0:04 problem |
| 0:19-0:23 | Part B, still life, phone face down | `Kaal`, then `know what's happening. know what to do.` | End card, loops to 0:00 |

### Generate it in two parts

Generating each Reel section as one multi-shot generation keeps the woman, room and light
identical, which works better than stitching separate clips. Attach **CHAR** and **STYLE**
to both parts, 9:16.

**Part A (10 s): hook through problem**

> Goal: a 10 second vertical sequence of one quiet morning, four shots, same woman and
> room throughout.
> Input role: character reference is the woman; style reference sets palette and light
> only, not a first frame.
> Scene: a warm apartment at dawn, a worn wooden desk by a window, a phone, a contract, a
> pen, a clay cup. She sits in the lower two thirds of the frame with window light above.
> Motion:
> [0-2s] extreme close up, two hands lift a phone upright into window light and a thumb
> swipes once; the screen is a soft parchment cream glow, nearly full frame height.
> [2-4s] rack focus up from the screen to her eyes; they settle and narrow slightly.
> [4-7s] cut to a medium vertical shot: her pen hovers over an unsigned contract, she sets
> it down and looks up at the window.
> [7-10s] cut to a close shot of tea pouring into an unglazed clay cup, steam rising through
> the upper frame, then her hand turns the phone face up.
> Audio: close and present: thumb on glass at 0s, a breath at 2s, pen click at 6s, tea
> pouring loudly at 7s, constant quiet room tone.
> Constraints: exactly three cuts at 2s, 4s and 7s. No dialogue. No music. No text in frame.
> Look: (look line), vertical portrait composition.

Save **the first frame of your chosen Part A take** as the **LOOP** image.

**Part B (7 s): payoff and loop**

> Goal: a 7 second vertical ending that resolves the unsigned contract and returns to the
> opening frame.
> Input role: character reference is the woman's hand and sweater sleeve; style reference
> sets palette and light; the LOOP image is the last frame.
> Scene: the same desk in full warm daylight.
> Motion:
> [0-3s] overhead top-down shot, a hand enters from the bottom edge and signs the contract in
> one unhurried stroke, then withdraws.
> [3-7s] cut to a high three-quarter still life: clay cup, signed page, phone face down on the
> wood, clean empty wall in the upper half; slow boom down, then two hands reach in and lift
> the phone upright, ending exactly on the last frame image.
> Audio: pen nib on paper loud and close at 1s, then room tone fading low.
> Constraints: exactly one cut at 3s. No dialogue. No music. No text in frame.
> Look: (look line), vertical portrait composition.

In Flow, set LOOP as the **end frame** for Part B. If the cut at 3s breaks the end-frame
match, split Part B into two generations and put the end frame only on the second.

**Fallback:** if a multi-shot generation drifts (wrong cut timing, a changing face),
generate each beat as its own single shot with the same prompt parts and cut them together
in the edit.

### Safe zones (1080×1920)

| Zone | Keep clear of |
|---|---|
| Top 250 px | Reels header, sound attribution |
| Bottom 420 px | Caption, username, audio ticker |
| Right 180 px | Like, comment, share, save |

Faces, the phone, and every caption stay in **x 0-900, y 250-1500**.

### Captions

Burned in, typeset in the edit (Playfair Display for display lines, Inter for body,
lowercase, no em dashes). Two to four words per card, changed on the beat, each on screen
at least 0.8 s, in the middle band. Don't use Instagram's auto captions.

### Sound mix

1. Close sounds loud and forward: thumb on glass, tea, pen nib. They are the hooks.
2. One continuous room tone under everything, so it feels like a single morning.
3. Music last and lowest: one sustained string or a tanpura-like drone, no percussion, no
   riser. If you notice the music, it's too loud.

### Hook lines to A/B test

Same edit, swap only the 0:00 caption, one per week, keep the winner:

- `some decisions aren't about what. they're about when.` (default)
- `i stopped guessing when to make big decisions.`
- `your chart already knows what today is carrying.`
- `the contract sat unsigned for nine days.`

### 7 second cut

For paid placement: Part A 0-3 s with the hook caption → Decision tabs cut-in (3-5 s) →
`Kaal` over the Part B still life (5-7 s).

---

## 8. Fixing takes in Flow

Omni edits a take in conversation, which is cheaper than regenerating.

- **Keep edit prompts short** and end with `Keep everything else the same.`
  - `Make the phone screen softer and unreadable. Keep everything else the same.`
  - `Remove the ring on her hand. Keep everything else the same.`
  - `Make the light warmer and lower. Keep everything else the same.`
  - `Remove the background music. Keep everything else the same.`
- Edits keep context for about three turns. After that, start a fresh edit from the best
  version.
- **Extend** rather than re-prompt when a take is right but ends early: `The scene
  continues. She sets the cup down.` Extensions carry motion, character and audio forward.
- **Change one thing at a time** between drafts so you know what fixed it.
- Save strong frames as images. They become first frames, end frames or references for
  later shots.

---

## 9. Automating it

Flow has no API, and scripting its web page with a bot breaks easily and risks the account.
Omni itself is available through the Gemini API with the same capabilities, so the automated
pipeline calls the API directly and these prompts carry over almost unchanged.

**API differences from Flow:**
- References attach as tags in the prompt: `<IMAGE_REF_0>` (CHAR), `<IMAGE_REF_1>` (STYLE),
  `<FIRST_FRAME>` / `<LAST_FRAME>` (use the LOOP image for both to get a native loop).
- Draft with `resolution="360p"`, final with `"1080p"`; `duration` 3-10; `aspect_ratio`
  `"9:16"`.
- Edits and extensions chain with `previous_interaction_id` instead of the Flow chat.
- Needs `GEMINI_API_KEY`, Python 3.10+, `google-genai >= 2.19.0`, and ffmpeg.

**Skills and repos worth using**

| Repo | What it gives us | Verdict |
|---|---|---|
| [google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills) → `gemini-omni-flash-api` | Google's official Claude Code skill: generate, first/last frame, loops, extend, edit, batch jobs from a JSON file (`--batch jobs.json --concurrency 3`), ffmpeg prep | **Use this.** Official and actively maintained; the batch JSON format fits this prompt pack |
| [kdowswell/veo-tools](https://github.com/kdowswell/veo-tools) | `/veo` for Veo 3.1 on Vertex AI, plus `/video-loop` (ffmpeg seamless loops) | Only for the Veo fallback or the loop script |
| [xbill9/omni-skill-claude](https://github.com/xbill9/omni-skill-claude) | MCP server for stateful Omni edit sessions | Skip unless we need multi-turn edits driven by Claude |
| [zysilm/video-producer-skill](https://github.com/zysilm/video-producer-skill) | Walks you through continuous shots using the Gemini web interface | Skip, manual |

**Planned pipeline:** Playwright records the app screens → `gemini-omni-flash-api` batch
generates B-roll and Reel parts from this doc → ffmpeg assembles cut-ins, typeset captions
and the sound bed into finished Reels and hook variants.

---

## Sources

- [Generate and edit videos with Gemini Omni Flash (Gemini API docs)](https://ai.google.dev/gemini-api/docs/omni)
- [google-gemini/gemini-skills: gemini-omni-flash-api SKILL.md](https://github.com/google-gemini/gemini-skills)
- [Google Flow brings new creative control features (Aug 2026)](https://blog.google/innovation-and-ai/models-and-research/google-labs/new-creative-controls-google-flow/)
- [New agents, mobile apps and Gemini Omni for Google Flow (May 2026)](https://blog.google/innovation-and-ai/models-and-research/google-labs/flow-updates/)
- [Create videos in Google Flow (Help Center)](https://support.google.com/flow/answer/16353334?hl=en)
- [Edit videos and build scenes in Google Flow (Help Center)](https://support.google.com/flow/answer/16935718?hl=en)
- [Mastering Gemini Omni: video prompting guide (Google AI)](https://x.com/GoogleAI/article/2059381218660270435)
