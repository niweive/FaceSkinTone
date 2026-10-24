# FaceSkinTone

**Remove green spill from cutout photos and restore natural skin tones in one click.**

A Figma plugin that cleans up the green cast left on skin, hair edges, and clothing when a photo was shot against a green background, even after the background has been removed.

---

## The problem

Photos taken in front of a green screen or green wall pick up reflected light. Removing the background does not remove that light, so faces still look slightly green. Fixing it by hand with Figma's tint and saturation sliders shifts the whole image, not just the affected skin.

## What this plugin does

FaceSkinTone works at the pixel level. For every pixel it limits the green channel so it can never exceed the average of the red and blue channels (a standard despill method).

- Natural skin tones already sit below that limit, so they are left alone.
- Pixels that are too green, such as spill on skin and edges, are pulled back toward neutral.
- Fully transparent pixels are skipped, so cutouts keep their transparency.

## Features

- One click, no settings required
- Works on many images at once
- Searches inside frames, groups, and components, so you can select a whole page of cards
- Keeps PNG transparency
- Runs locally in Figma. Images are never uploaded anywhere and no network access is needed

## Usage

1. **Duplicate your frame first.** The plugin replaces the original images with corrected versions. (Cmd/Ctrl+Z also undoes it.)
2. Select the photo layers, or the frames or cards that contain them.
3. Run **Plugins → FaceSkinTone**.
4. Wait for the confirmation message, for example `Despilled 24 image(s)`.

If no image is found in the selection, the plugin tells you so and changes nothing.

## Tuning

Two constants at the top of `ui.html` control the effect:

| Setting | Default | What it does |
|---|---|---|
| `STRENGTH` | `1.0` | How much of the correction is applied. `0` = no change, `1` = full despill. Lower it (for example `0.7`) if skin looks flat or pink afterwards. |
| `BIAS` | `1.0` | How strict the green limit is. Lower it (for example `0.97` or `0.95`) if skin is still greenish. Going much lower makes skin look pink or gray. |

Test on a few photos first, then run the whole batch.

## Limitations

- Anything genuinely green in the photo, such as a green shirt or plants, will be slightly muted too. Check those photos after running.
- It corrects green spill only. It does not fix other color casts.
- Heavy spill on very bright, low-detail areas may need a manual touch-up afterwards.
- Images are re-encoded as PNG, so JPEG sources may become larger files.

## Tips for better source photos

- Place the subject farther from the green background.
- Add a soft, slightly warm light on the subject to counter the green bounce.
- If possible, shoot against a neutral gray or white background.

## Install for development

1. In the Figma desktop app, go to **Plugins → Development → New plugin…**, choose **Empty**, and name it.
2. In the folder Figma creates, replace the contents of `code.js` and add `ui.html`.
3. In `manifest.json`, keep the `id` Figma generated and make sure it contains:
   ```json
   {
     "name": "FaceSkinTone",
     "api": "1.0.0",
     "main": "code.js",
     "ui": "ui.html",
     "editorType": ["figma"]
   }
   ```
4. Run it from **Plugins → Development → FaceSkinTone**.

## Project files

| File | Purpose |
|---|---|
| `manifest.json` | Plugin name, entry points, and editor type |
| `code.js` | Finds the image fills in your selection and swaps in the corrected images |
| `ui.html` | Hidden page that does the pixel processing on a canvas |

## Troubleshooting

- **Nothing happens or an error appears:** open **Plugins → Development → Open console** and check the message.
- **Skin is still greenish:** lower `BIAS` to `0.97` or `0.95`.
- **Skin looks flat or pink:** lower `STRENGTH` to `0.7`.
- **"No image fills found":** select the layers or frames that contain the photos, and make sure the photos are image fills rather than vectors or embedded elsewhere.

## Privacy

All processing happens locally inside Figma. The plugin makes no network requests and sends no data anywhere.

## License

Free to use and modify.
MIT license.
