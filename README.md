# Qtile Dotfiles Configurator & Dashboard

An interactive, premium web-based dashboard and custom configuration compiler for the **Qtile Window Manager**. This tool provides a beautiful glassmorphic graphical user interface (GUI) to customize your window tiling setups, widgets, workspaces, autostart programs, and keybindings, and instantly export production-ready configuration dotfiles.

---

## What It Does

### 1. Interactive Desktop Tiling Simulation
- Displays dynamic, mock window arrangements (Master + Stack splits for `MonadTall`, single maximize box for `Max`, grid structures for `Columns`, floating layer overlaps for `Floating`) in real-time as you toggle window manager properties.

### 2. Live Top Status Bar Preview
- Renders a simulated top bar panel representing widget selections (toggling Clock, CPU Load, RAM, Volume indicator, Group indicator boxes, Systray applets) aligned dynamically inside a mockup Linux screen matching the active color theme.
hi
### 3. Settings Configurator
- **Mod Modifier Switch**: Toggle between `Super (mod4)` and `Alt (mod1)` directly.
- **Terminal selection**: Set your default desktop terminal emulator.
- **Margins & Borders**: Interactive sliders to adjust window gaps (`margin`) and window borders (`border_width`).
- **Autostart Services Checklist**: Check/uncheck standard Linux utilities (`picom` compositor, `feh` wallpaper restorer, `dunst` notification daemon, network managers) and add custom scripts.

### 4. Interactive Keybindings Editor
- Add custom key shortcuts, map modifiers, write custom `lazy` execution triggers, and delete bindings dynamically using a simple form.

### 5. Config Exporter
- Outputs fully formatted Python (`config.py`) and shell script (`autostart.sh`) with built-in regex-based code highlighting.
- Download code or copy directly to clipboard with satisfying micro-animation toasts.

---

## Themes Included
- **Dracula** (Vibrant Purple & Pink Neon)
- **Nord** (Cool Arctic Frost & Blue)
- **Tokyo Night** (Deep Neon Blue & Lavender)
- **Gruvbox** (Classic Warm Retro Yellow & Rust)
- **One Dark** (Sleek Slate Grey & Blue)

---

## Local Development Setup

To run the dashboard configurator locally on your machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Anthropicalluv/qtile-dotfiles.git
   cd qtile-dotfiles
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Verify TypeScript compilation and lints**:
   ```bash
   npm run build
   npm run lint
   ```

---

## Deploying Configs to Linux

To use your generated setup:

1. Create the configuration directories:
   ```bash
   mkdir -p ~/.config/qtile/
   ```
2. Move your downloaded `config.py` and `autostart.sh` files into `~/.config/qtile/`.
3. Make the autostart shell script executable:
   ```bash
   chmod +x ~/.config/qtile/autostart.sh
   ```
4. Hot-reload Qtile config using the default keybinding: `Super + Ctrl + R`.
