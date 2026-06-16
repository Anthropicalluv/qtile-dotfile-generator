import { useState, useEffect } from 'react'
import './App.css'

interface AutostartService {
  id: string
  name: string
  desc: string
  enabled: boolean
  command: string
}

interface BarWidget {
  id: string
  name: string
  desc: string
  enabled: boolean
  side: 'left' | 'right'
}

interface TilingLayout {
  id: string
  name: string
  enabled: boolean
  pythonClass: string
}

interface GroupConfig {
  id: string
  name: string
  icon: string
}

interface Keybinding {
  id: string
  mod: string
  key: string
  action: string
  cmd: string
  category: 'Window' | 'Layout' | 'Group' | 'System'
  custom?: boolean
}

type TabType = 'dashboard' | 'widgets' | 'keybindings' | 'layouts' | 'exporter'
type ThemeType = 'dracula' | 'nord' | 'tokyo_night' | 'gruvbox' | 'one_dark'

function App() {
  const [local_activeTab, setLocal_activeTab] = useState<TabType>('dashboard')
  const [local_theme, setLocal_theme] = useState<ThemeType>('dracula')
  const [local_toast, setLocal_toast] = useState<string | null>(null)
  const [local_currentTime, setLocal_currentTime] = useState<string>('')
  
  const [local_modKey, setLocal_modKey] = useState<'mod4' | 'mod1'>('mod4')
  const [local_terminalApp, setLocal_terminalApp] = useState<string>('kitty')
  const [local_windowMargin, setLocal_windowMargin] = useState<number>(8)
  const [local_borderWidth, setLocal_borderWidth] = useState<number>(2)
  const [local_customAutostartLines, setLocal_customAutostartLines] = useState<string>('# Add your custom autostart bash commands here\n# picom &')

  const [local_newKeyMod, setLocal_newKeyMod] = useState<string>('mod')
  const [local_newKeyName, setLocal_newKeyName] = useState<string>('p')
  const [local_newKeyAction, setLocal_newKeyAction] = useState<string>('Launch Application')
  const [local_newKeyCmd, setLocal_newKeyCmd] = useState<string>('lazy.spawn("dmenu_run")')
  const [local_newKeyCategory, setLocal_newKeyCategory] = useState<'Window' | 'Layout' | 'Group' | 'System'>('System')

  const [local_groups, setLocal_groups] = useState<GroupConfig[]>([
    { id: '1', name: 'Web', icon: '🌐' },
    { id: '2', name: 'Code', icon: '💻' },
    { id: '3', name: 'Chat', icon: '💬' },
    { id: '4', name: 'Files', icon: '📁' },
    { id: '5', name: 'Media', icon: '🎵' },
    { id: '6', name: 'Games', icon: '🎮' },
    { id: '7', name: 'Social', icon: '📣' },
    { id: '8', name: 'Office', icon: '📄' },
    { id: '9', name: 'System', icon: '⚙️' },
  ])

  const [local_layouts, setLocal_layouts] = useState<TilingLayout[]>([
    { id: 'monadtall', name: 'MonadTall', enabled: true, pythonClass: 'layout.MonadTall' },
    { id: 'columns', name: 'Columns', enabled: true, pythonClass: 'layout.Columns' },
    { id: 'max', name: 'Max', enabled: true, pythonClass: 'layout.Max' },
    { id: 'floating', name: 'Floating', enabled: true, pythonClass: 'layout.Floating' },
    { id: 'stack', name: 'Stack', enabled: false, pythonClass: 'layout.Stack' },
  ])

  const [local_services, setLocal_services] = useState<AutostartService[]>([
    { id: 'picom', name: 'Picom', desc: 'X11 compositor for fade, opacity, shadows & blur effects.', enabled: true, command: 'picom --experimental-backends &' },
    { id: 'feh', name: 'Feh', desc: 'Lightweight image viewer used to restore wallpaper background.', enabled: true, command: 'feh --bg-fill ~/.config/qtile/wallpaper.png &' },
    { id: 'dunst', name: 'Dunst', desc: 'Highly customizable notification daemon for system popups.', enabled: true, command: 'dunst &' },
    { id: 'nm-applet', name: 'Network Manager', desc: 'System tray indicator applet for wireless/wired network.', enabled: true, command: 'nm-applet &' },
    { id: 'volumeicon', name: 'VolumeIcon', desc: 'System tray volume dial control and mixer utility.', enabled: false, command: 'volumeicon &' },
    { id: 'flameshot', name: 'Flameshot', desc: 'Powerful open-source tool for screenshots and drawing.', enabled: false, command: 'flameshot &' },
  ])

  const [local_widgets, setLocal_widgets] = useState<BarWidget[]>([
    { id: 'groupbox', name: 'GroupBox', desc: 'Workspace indicator dots/icons.', enabled: true, side: 'left' },
    { id: 'layout', name: 'CurrentLayoutIcon', desc: 'Visual icon for active window layout.', enabled: true, side: 'left' },
    { id: 'windowname', name: 'WindowName', desc: 'Displays the title of the focused window.', enabled: true, side: 'left' },
    { id: 'cpu', name: 'CPU Usage', desc: 'Displays percentage of CPU utilization.', enabled: true, side: 'right' },
    { id: 'memory', name: 'Memory Usage', desc: 'Displays amount of active RAM usage.', enabled: true, side: 'right' },
    { id: 'volume', name: 'Volume', desc: 'Displays current volume percentage level.', enabled: true, side: 'right' },
    { id: 'systray', name: 'Systray', desc: 'Displays background system icon tray.', enabled: true, side: 'right' },
    { id: 'clock', name: 'Clock', desc: 'Displays current local date and time.', enabled: true, side: 'right' },
  ])

  const [local_keybindings, setLocal_keybindings] = useState<Keybinding[]>([
    { id: 'focus-left', mod: 'mod', key: 'h', action: 'Focus Left Window', cmd: 'lazy.layout.left()', category: 'Window' },
    { id: 'focus-right', mod: 'mod', key: 'l', action: 'Focus Right Window', cmd: 'lazy.layout.right()', category: 'Window' },
    { id: 'focus-down', mod: 'mod', key: 'j', action: 'Focus Window Below', cmd: 'lazy.layout.down()', category: 'Window' },
    { id: 'focus-up', mod: 'mod', key: 'k', action: 'Focus Window Above', cmd: 'lazy.layout.up()', category: 'Window' },
    
    { id: 'move-left', mod: 'mod+shift', key: 'h', action: 'Move Window Left', cmd: 'lazy.layout.shuffle_left()', category: 'Window' },
    { id: 'move-right', mod: 'mod+shift', key: 'l', action: 'Move Window Right', cmd: 'lazy.layout.shuffle_right()', category: 'Window' },
    { id: 'move-down', mod: 'mod+shift', key: 'j', action: 'Move Window Down', cmd: 'lazy.layout.shuffle_down()', category: 'Window' },
    { id: 'move-up', mod: 'mod+shift', key: 'k', action: 'Move Window Up', cmd: 'lazy.layout.shuffle_up()', category: 'Window' },

    { id: 'next-layout', mod: 'mod', key: 'Tab', action: 'Toggle Layout Style', cmd: 'lazy.next_layout()', category: 'Layout' },
    { id: 'kill-window', mod: 'mod', key: 'q', action: 'Close Focused Window', cmd: 'lazy.window.kill()', category: 'Window' },
    { id: 'toggle-floating', mod: 'mod+shift', key: 'f', action: 'Toggle Floating State', cmd: 'lazy.window.toggle_floating()', category: 'Window' },

    { id: 'grow-left', mod: 'mod+control', key: 'h', action: 'Grow Window Left', cmd: 'lazy.layout.grow_left()', category: 'Layout' },
    { id: 'grow-right', mod: 'mod+control', key: 'l', action: 'Grow Window Right', cmd: 'lazy.layout.grow_right()', category: 'Layout' },

    { id: 'launch-terminal', mod: 'mod', key: 'Return', action: 'Open Terminal App', cmd: 'lazy.spawn("kitty")', category: 'System' },
    { id: 'launch-browser', mod: 'mod', key: 'b', action: 'Open Web Browser', cmd: 'lazy.spawn("firefox")', category: 'System' },
    { id: 'launch-launcher', mod: 'mod', key: 'd', action: 'Open App Launcher', cmd: 'lazy.spawn("rofi -show drun")', category: 'System' },
    
    { id: 'restart-qtile', mod: 'mod+control', key: 'r', action: 'Hot Reload Qtile Config', cmd: 'lazy.reload_config()', category: 'System' },
    { id: 'shutdown-qtile', mod: 'mod+control', key: 'q', action: 'Exit Qtile Desktop', cmd: 'lazy.shutdown()', category: 'System' },
  ])

  const [local_searchQuery, setLocal_searchQuery] = useState('')
  const [local_selectedExporterFile, setLocal_selectedExporterFile] = useState<'config.py' | 'autostart.sh'>('config.py')

  const local_themePalettes = {
    dracula: {
      name: 'Dracula',
      colors: ['#282a36', '#44475a', '#bd93f9', '#ff79c6', '#50fa7b'],
      bg: '#282a36',
      fg: '#f8f8f2',
      active: '#bd93f9',
      inactive: '#6272a4',
      accent: '#ff79c6',
      urgent: '#ff5555'
    },
    nord: {
      name: 'Nord',
      colors: ['#2e3440', '#3b4252', '#88c0d0', '#81a1c1', '#a3be8c'],
      bg: '#2e3440',
      fg: '#d8dee9',
      active: '#88c0d0',
      inactive: '#4c566a',
      accent: '#81a1c1',
      urgent: '#bf616a'
    },
    tokyo_night: {
      name: 'Tokyo Night',
      colors: ['#1a1b26', '#24283b', '#7aa2f7', '#bb9af7', '#9ece6a'],
      bg: '#1a1b26',
      fg: '#c0caf5',
      active: '#7aa2f7',
      inactive: '#565f89',
      accent: '#bb9af7',
      urgent: '#f7768e'
    },
    gruvbox: {
      name: 'Gruvbox',
      colors: ['#282828', '#3c3836', '#fabd2f', '#fe8019', '#b8bb26'],
      bg: '#282828',
      fg: '#ebdbb2',
      active: '#fabd2f',
      inactive: '#7c6f64',
      accent: '#fe8019',
      urgent: '#fb4934'
    },
    one_dark: {
      name: 'One Dark',
      colors: ['#21252b', '#282c34', '#61afef', '#c678dd', '#98c379'],
      bg: '#21252b',
      fg: '#abb2bf',
      active: '#61afef',
      inactive: '#5c6370',
      accent: '#c678dd',
      urgent: '#e06c75'
    }
  }

  const local_activePalette = local_themePalettes[local_theme]

  useEffect(() => {
    const local_updateTime = () => {
      const local_date = new Date()
      const local_hours = local_date.getHours().toString().padStart(2, '0')
      const local_minutes = local_date.getMinutes().toString().padStart(2, '0')
      const local_seconds = local_date.getSeconds().toString().padStart(2, '0')
      const local_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const local_day = local_date.getDate()
      setLocal_currentTime(`${local_months[local_date.getMonth()]} ${local_day} | ${local_hours}:${local_minutes}:${local_seconds}`)
    }
    local_updateTime()
    const local_timer = setInterval(local_updateTime, 1000)
    return () => clearInterval(local_timer)
  }, [])

  useEffect(() => {
    document.body.className = `theme-${local_theme}`
    return () => {
      document.body.className = ''
    }
  }, [local_theme])

  const local_triggerToast = (param_msg: string) => {
    setLocal_toast(param_msg)
    setTimeout(() => {
      setLocal_toast(null)
    }, 3000)
  }

  const local_toggleService = (param_id: string) => {
    setLocal_services(prev =>
      prev.map(s => (s.id === param_id ? { ...s, enabled: !s.enabled } : s))
    )
    local_triggerToast('Autostart services updated')
  }

  const local_toggleWidget = (param_id: string) => {
    setLocal_widgets(prev =>
      prev.map(w => (w.id === param_id ? { ...w, enabled: !w.enabled } : w))
    )
    local_triggerToast('Bar widgets updated')
  }

  const local_toggleLayout = (param_id: string) => {
    const local_activeCount = local_layouts.filter(l => l.enabled).length
    const local_target = local_layouts.find(l => l.id === param_id)
    if (local_activeCount === 1 && local_target?.enabled) {
      local_triggerToast('At least one layout must remain active')
      return
    }
    setLocal_layouts(prev =>
      prev.map(l => (l.id === param_id ? { ...l, enabled: !l.enabled } : l))
    )
    local_triggerToast('Tiling layouts updated')
  }

  const local_handleGroupConfigChange = (param_id: string, param_field: 'name' | 'icon', param_value: string) => {
    setLocal_groups(prev =>
      prev.map(g => (g.id === param_id ? { ...g, [param_field]: param_value } : g))
    )
  }

  const local_filteredKeybindings = local_keybindings.filter(
    k =>
      k.action.toLowerCase().includes(local_searchQuery.toLowerCase()) ||
      k.key.toLowerCase().includes(local_searchQuery.toLowerCase()) ||
      k.category.toLowerCase().includes(local_searchQuery.toLowerCase())
  )

  const local_handleKeybindingChange = (param_id: string, param_field: 'key' | 'mod', param_value: string) => {
    setLocal_keybindings(prev =>
      prev.map(k => (k.id === param_id ? { ...k, [param_field]: param_value } : k))
    )
  }

  const local_addCustomKeybinding = (e: React.FormEvent) => {
    e.preventDefault()
    if (!local_newKeyName) {
      local_triggerToast('Key combination is required')
      return
    }
    const local_newBinding: Keybinding = {
      id: `custom-${Date.now()}`,
      mod: local_newKeyMod,
      key: local_newKeyName,
      action: local_newKeyAction,
      cmd: local_newKeyCmd,
      category: local_newKeyCategory,
      custom: true
    }
    setLocal_keybindings(prev => [...prev, local_newBinding])
    local_triggerToast('Custom keybinding added!')
    setLocal_newKeyName('')
    setLocal_newKeyAction('')
    setLocal_newKeyCmd('lazy.spawn("")')
  }

  const local_removeCustomKeybinding = (param_id: string) => {
    setLocal_keybindings(prev => prev.filter(k => k.id !== param_id))
    local_triggerToast('Keybinding removed!')
  }

  const local_generateConfigPyCode = () => {
    const local_activeLayoutsList = local_layouts.filter(l => l.enabled)
    const local_activeLeftWidgets = local_widgets.filter(w => w.enabled && w.side === 'left')
    const local_activeRightWidgets = local_widgets.filter(w => w.enabled && w.side === 'right')

    const local_pythonKeys = local_keybindings
      .map(k => {
        const local_mods = k.mod.split('+').map(m => m === 'mod' ? 'mod' : `"${m}"`).join(', ')
        return `    Key([${local_mods}], "${k.key}", ${k.cmd}, desc="${k.action}"),`
      })
      .join('\n')

    const local_pythonGroups = local_groups
      .map(g => `    Group("${g.id}", label="${g.icon}"),`)
      .join('\n')

    const local_pythonLayouts = local_activeLayoutsList
      .map(l => {
        if (l.id === 'max') return '    layout.Max(),'
        if (l.id === 'floating') return '    layout.Floating(),'
        return `    ${l.pythonClass}(border_focus=colors["active"], border_normal=colors["bg"], border_width=${local_borderWidth}, margin=${local_windowMargin}),`
      })
      .join('\n')

    const local_mapWidgetToPython = (param_w: BarWidget) => {
      switch (param_w.id) {
        case 'groupbox':
          return `                widget.GroupBox(
                    active=colors["active"],
                    inactive=colors["inactive"],
                    urgent_border=colors["urgent"],
                    highlight_method="line",
                    highlight_color=[colors["bg"], colors["bg"]],
                    this_current_screen_border=colors["active"],
                    margin_y=3,
                    margin_x=0,
                    padding_y=5,
                    padding_x=3,
                    borderwidth=3,
                    disable_drag=True
                ),`
        case 'layout':
          return `                widget.CurrentLayoutIcon(scale=0.6, background=colors["bg"]),`
        case 'windowname':
          return `                widget.WindowName(foreground=colors["accent"], max_chars=40),`
        case 'cpu':
          return `                widget.CPU(format="CPU: {load_percent}%", foreground=colors["active"], padding=8),`
        case 'memory':
          return `                widget.Memory(format="RAM: {MemUsed:.1f}G/{MemTotal:.1f}G", foreground=colors["fg"], padding=8),`
        case 'volume':
          return `                widget.Volume(fmt="VOL: {}", foreground=colors["accent"], padding=8),`
        case 'systray':
          return `                widget.Systray(padding=5),`
        case 'clock':
          return `                widget.Clock(format="%b %d | %H:%M:%S", foreground=colors["fg"], padding=8),`
        default:
          return ''
      }
    }

    const local_pythonLeftWidgets = local_activeLeftWidgets.map(local_mapWidgetToPython).join('\n')
    const local_pythonRightWidgets = local_activeRightWidgets.map(local_mapWidgetToPython).join('\n')

    const local_pythonModString = local_modKey === 'mod4' ? 'mod4' : 'mod1'

    return `# Qtile Window Manager Custom Configuration
# Generated by Qtile Configurator Dashboard

import os
import subprocess
from libqtile import bar, layout, widget, hook
from libqtile.config import Click, Drag, Group, Key, Match, Screen
from libqtile.lazy import lazy

# Super key (Windows Key) set as Mod modifier
mod = "${local_pythonModString}"
terminal = "${local_terminalApp}"

# Theme colors dictionary representing "${local_themePalettes[local_theme].name}" palette
colors = {
    "bg": "${local_activePalette.bg}",
    "fg": "${local_activePalette.fg}",
    "active": "${local_activePalette.active}",
    "inactive": "${local_activePalette.inactive}",
    "accent": "${local_activePalette.accent}",
    "urgent": "${local_activePalette.urgent}"
}

# Searchable keybindings list
keys = [
${local_pythonKeys}
]

# Workspace group definitions
groups = [
${local_pythonGroups}
]

# Map navigation keys to groups
for i in groups:
    keys.extend([
        # Switch to workspace
        Key([mod], i.name, lazy.group[i.name].toscreen(),
            desc="Switch to group {}".format(i.name)),
        # Move focused window to workspace
        Key([mod, "shift"], i.name, lazy.window.togroup(i.name, switch_group=True),
            desc="Move focused window to group {}".format(i.name)),
    ])

# Enabled window layout tiling classes
layouts = [
${local_pythonLayouts}
]

# Default widget settings shared across bar items
widget_defaults = dict(
    font="sans",
    fontsize=12,
    padding=4,
    background=colors["bg"],
    foreground=colors["fg"]
)
extension_defaults = widget_defaults.copy()

# Setup status bar widgets on primary monitor screen
screens = [
    Screen(
        top=bar.Bar(
            [
${local_pythonLeftWidgets}
                widget.Spacer(background=colors["bg"]),
${local_pythonRightWidgets}
            ],
            28,
            background=colors["bg"],
            margin=[4, 8, 4, 8],
            border_width=[0, 0, 2, 0],
            border_color=colors["active"]
        ),
    ),
]

# Interactive mouse drag controls
mouse = [
    Drag([mod], "Button1", lazy.window.set_position_floating(), start=lazy.window.get_position()),
    Drag([mod], "Button3", lazy.window.set_size_floating(), start=lazy.window.get_size()),
    Click([mod], "Button2", lazy.window.bring_to_front()),
]

dgroups_key_binder = None
dgroups_app_rules = []
follow_mouse_focus = True
bring_front_click = False
floats_keep_top = True
cursor_warp = False

floating_layout = layout.Floating(
    float_rules=[
        *layout.Floating.default_float_rules,
        Match(wm_class="confirmreset"),
        Match(wm_class="makebranch"),
        Match(wm_class="maketag"),
        Match(wm_class="ssh-askpass"),
        Match(title="branchdialog"),
        Match(title="pinentry"),
    ]
)

auto_fullscreen = True
focus_on_window_activation = "smart"
reconfigure_screens = True
auto_minimize = True
wl_input_rules = None
wmname = "LG3D"

# Autostart execution script hook
@hook.subscribe.startup_once
def autostart():
    home = os.path.expanduser('~')
    subprocess.Popen([home + '/.config/qtile/autostart.sh'])
`
  }

  const local_generateAutostartShCode = () => {
    const local_enabledServices = local_services.filter(s => s.enabled)
    const local_servicesCommands = local_enabledServices
      .map(s => `# Launch ${s.name} (${s.desc})\n${s.command}`)
      .join('\n\n')

    return `#!/bin/sh

# Qtile Autostart script
# Generated automatically by Qtile Configurator

# Set display refresh rates or configurations if necessary
# xrandr --rate 144 --mode 1920x1080 &

# Restore active system services
${local_servicesCommands}

# User custom commands configured via GUI
${local_customAutostartLines}

# System tray network applet is handled automatically by bar icon
`
  }

  const local_copyToClipboard = () => {
    const local_code = local_selectedExporterFile === 'config.py' ? local_generateConfigPyCode() : local_generateAutostartShCode()
    navigator.clipboard.writeText(local_code)
    local_triggerToast(`${local_selectedExporterFile} copied to clipboard!`)
  }

  const local_downloadCodeFile = () => {
    const local_code = local_selectedExporterFile === 'config.py' ? local_generateConfigPyCode() : local_generateAutostartShCode()
    const local_blob = new Blob([local_code], { type: 'text/plain' })
    const local_url = URL.createObjectURL(local_blob)
    const local_link = document.createElement('a')
    local_link.href = local_url
    local_link.download = local_selectedExporterFile
    document.body.appendChild(local_link)
    local_link.click()
    document.body.removeChild(local_link)
    URL.revokeObjectURL(local_url)
    local_triggerToast(`${local_selectedExporterFile} file download started!`)
  }

  const local_highlightCode = (param_rawCode: string) => {
    const local_escapeHtml = (param_text: string) => {
      return param_text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }

    const local_lines = param_rawCode.split('\n')
    const local_highlightedLines = local_lines.map(line => {
      if (line.trim().startsWith('#')) {
        return `<span class="code-cmt">${local_escapeHtml(line)}</span>`
      }

      let local_esc = local_escapeHtml(line)

      const local_keywords = ['import', 'from', 'def', 'return', 'for', 'in', 'if', 'else', 'and', 'or', 'not', 'True', 'False', 'None', 'as']
      local_keywords.forEach(kw => {
        const local_regex = new RegExp(`\\b${kw}\\b`, 'g')
        local_esc = local_esc.replace(local_regex, `<span class="code-kw">${kw}</span>`)
      })

      const local_types = ['Key', 'Group', 'Screen', 'Bar', 'Drag', 'Click', 'Match', 'Floating', 'MonadTall', 'Columns', 'Max', 'Stack', 'Spacer', 'GroupBox', 'CurrentLayoutIcon', 'WindowName', 'CPU', 'Memory', 'Volume', 'Systray', 'Clock']
      local_types.forEach(t => {
        const local_regex = new RegExp(`\\b${t}\\b`, 'g')
        local_esc = local_esc.replace(local_regex, `<span class="code-typ">${t}</span>`)
      })

      local_esc = local_esc.replace(/([a-zA-Z0-9_]+)(?=\()/g, '<span class="code-fn">$1</span>')
      local_esc = local_esc.replace(/"([^"]*)"/g, '<span class="code-str">"$1"</span>')

      if (local_esc.includes(' #')) {
        const local_parts = local_esc.split(' #')
        local_esc = local_parts[0] + ` <span class="code-cmt">#${local_parts.slice(1).join(' #')}</span>`
      }

      return local_esc
    })

    return local_highlightedLines.join('\n')
  }

  const local_getActiveLayoutName = () => {
    const local_firstEnabled = local_layouts.find(l => l.enabled)
    return local_firstEnabled ? local_firstEnabled.name : 'MonadTall'
  }

  const local_renderTilingWindowsMock = () => {
    const local_activeLayout = local_getActiveLayoutName().toLowerCase()
    
    switch (local_activeLayout) {
      case 'max':
        return (
          <div className="layout-max">
            <div className="tiling-window active" style={{ height: '100%' }}>
              <div className="window-header">
                <span>kitty (~/code/qtile-dotfiles)</span>
                <div className="window-controls">
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                </div>
              </div>
              <div className="window-content">
                <svg className="window-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="window-title">kitty - terminal</div>
              </div>
            </div>
          </div>
        )
      case 'columns':
        return (
          <div className="layout-columns" style={{ height: '100%' }}>
            <div className="tiling-window active" style={{ borderWidth: `${local_borderWidth}px`, margin: `${local_windowMargin}px` }}>
              <div className="window-header">
                <span>visual studio code</span>
                <div className="window-controls">
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                </div>
              </div>
              <div className="window-content">
                <svg className="window-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <div className="window-title">VS Code</div>
              </div>
            </div>
            <div className="tiling-window" style={{ borderWidth: `${local_borderWidth}px`, margin: `${local_windowMargin}px` }}>
              <div className="window-header">
                <span>firefox - qtile docs</span>
                <div className="window-controls">
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                </div>
              </div>
              <div className="window-content">
                <svg className="window-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div className="window-title">Firefox Browser</div>
              </div>
            </div>
          </div>
        )
      case 'floating':
        return (
          <div className="layout-floating">
            <div className="tiling-window layout-floating-win-1" style={{ borderWidth: `${local_borderWidth}px` }}>
              <div className="window-header">
                <span>file explorer (ranger)</span>
                <div className="window-controls">
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                </div>
              </div>
              <div className="window-content">
                <svg className="window-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <div className="window-title">Ranger File Explorer</div>
              </div>
            </div>
            <div className="tiling-window active layout-floating-win-2" style={{ borderWidth: `${local_borderWidth}px` }}>
              <div className="window-header">
                <span>htop - resource stats</span>
                <div className="window-controls">
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                </div>
              </div>
              <div className="window-content">
                <svg className="window-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div className="window-title">Htop Utility</div>
              </div>
            </div>
          </div>
        )
      case 'stack':
        return (
          <div className="layout-stack" style={{ height: '100%' }}>
            <div className="tiling-window active layout-stack-half" style={{ borderWidth: `${local_borderWidth}px`, margin: `${local_windowMargin}px` }}>
              <div className="window-header">
                <span>master terminal</span>
                <div className="window-controls">
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                </div>
              </div>
              <div className="window-content">
                <svg className="window-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="window-title">kitty terminal (master)</div>
              </div>
            </div>
            <div className="tiling-window layout-stack-half" style={{ borderWidth: `${local_borderWidth}px`, margin: `${local_windowMargin}px` }}>
              <div className="window-header">
                <span>secondary process</span>
                <div className="window-controls">
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                </div>
              </div>
              <div className="window-content">
                <svg className="window-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="window-title">kitty terminal (stack)</div>
              </div>
            </div>
          </div>
        )
      case 'monadtall':
      default:
        return (
          <div className="layout-monadtall" style={{ height: '100%' }}>
            <div className="tiling-window active layout-monadtall-master" style={{ borderWidth: `${local_borderWidth}px`, margin: `${local_windowMargin}px` }}>
              <div className="window-header">
                <span>visual studio code</span>
                <div className="window-controls">
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                  <span className="window-dot"></span>
                </div>
              </div>
              <div className="window-content">
                <svg className="window-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <div className="window-title">VS Code (Master Window)</div>
              </div>
            </div>
            <div className="layout-monadtall-stack">
              <div className="tiling-window" style={{ borderWidth: `${local_borderWidth}px`, margin: `${local_windowMargin}px` }}>
                <div className="window-header">
                  <span>kitty - terminal</span>
                  <div className="window-controls">
                    <span className="window-dot"></span>
                    <span className="window-dot"></span>
                    <span className="window-dot"></span>
                  </div>
                </div>
                <div className="window-content">
                  <svg className="window-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="window-title">kitty terminal</div>
                </div>
              </div>
              <div className="tiling-window" style={{ borderWidth: `${local_borderWidth}px`, margin: `${local_windowMargin}px` }}>
                <div className="window-header">
                  <span>firefox - browser</span>
                  <div className="window-controls">
                    <span className="window-dot"></span>
                    <span className="window-dot"></span>
                    <span className="window-dot"></span>
                  </div>
                </div>
                <div className="window-content">
                  <svg className="window-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <div className="window-title">Firefox</div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  const local_renderBarWidgetMock = (param_widgetId: string) => {
    const local_activeWidget = local_widgets.find(w => w.id === param_widgetId)
    if (!local_activeWidget || !local_activeWidget.enabled) return null

    switch (param_widgetId) {
      case 'groupbox':
        return (
          <div key={param_widgetId} className="bar-widget widget-groupbox">
            {local_groups.map(g => (
              <span 
                key={g.id} 
                className={`widget-group ${g.id === '2' ? 'active' : ''} ${g.id === '1' || g.id === '2' || g.id === '3' || g.id === '5' ? 'has-windows' : ''}`}
                title={g.name}
              >
                {g.icon}
              </span>
            ))}
          </div>
        )
      case 'layout':
        return (
          <span key={param_widgetId} className="bar-widget widget-layout">
            [{local_getActiveLayoutName()}]
          </span>
        )
      case 'windowname':
        return (
          <span key={param_widgetId} className="bar-widget widget-windowname">
            {local_getActiveLayoutName() === 'Max' ? 'kitty (~/code/qtile-dotfiles)' : 'visual studio code'}
          </span>
        )
      case 'cpu':
        return (
          <span key={param_widgetId} className="bar-widget widget-sys">
            ⚡ cpu: 14%
          </span>
        )
      case 'memory':
        return (
          <span key={param_widgetId} className="bar-widget widget-sys">
            💾 mem: 2.8G
          </span>
        )
      case 'volume':
        return (
          <span key={param_widgetId} className="bar-widget widget-sys">
            🔊 vol: 72%
          </span>
        )
      case 'systray':
        return (
          <div key={param_widgetId} className="bar-widget" style={{ gap: '6px' }}>
            <span style={{ fontSize: '0.65rem' }}>📶</span>
            <span style={{ fontSize: '0.65rem' }}>🔋 94%</span>
          </div>
        )
      case 'clock':
        return (
          <span key={param_widgetId} className="bar-widget widget-clock" style={{ fontWeight: 'bold' }}>
            📅 {local_currentTime || 'Clock'}
          </span>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="dashboard-container">
        <aside className="glass-panel sidebar">
          <div className="profile-section">
            <div className="avatar">QT</div>
            <div>
              <h2>Qtile Config</h2>
              <p>dotfiles compiler</p>
            </div>
          </div>

          <nav>
            <ul className="nav-menu">
              <li 
                className={`nav-item ${local_activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setLocal_activeTab('dashboard')}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Overview
              </li>
              <li 
                className={`nav-item ${local_activeTab === 'widgets' ? 'active' : ''}`}
                onClick={() => setLocal_activeTab('widgets')}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Bar & Widgets
              </li>
              <li 
                className={`nav-item ${local_activeTab === 'keybindings' ? 'active' : ''}`}
                onClick={() => setLocal_activeTab('keybindings')}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Keybindings
              </li>
              <li 
                className={`nav-item ${local_activeTab === 'layouts' ? 'active' : ''}`}
                onClick={() => setLocal_activeTab('layouts')}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 7a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm0 7a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
                </svg>
                Layouts & Groups
              </li>
              <li 
                className={`nav-item ${local_activeTab === 'exporter' ? 'active' : ''}`}
                onClick={() => setLocal_activeTab('exporter')}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 00.707-.293H20" />
                </svg>
                Export Config
              </li>
            </ul>
          </nav>
        </aside>

        <main className="glass-panel main-content">
          {local_activeTab === 'dashboard' && (
            <div className="tab-view animate-fade">
              <div className="section-header">
                <h2>Overview Dashboard</h2>
                <p>Monitor your active styling theme, tiling configs, and background autostart services.</p>
              </div>

              <div className="dashboard-grid">
                <div className="glass-panel stat-card">
                  <span className="keybinding-category">Active Theme</span>
                  <div className="value" style={{ textTransform: 'capitalize' }}>
                    {local_theme.replace('_', ' ')}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Current Colors: {local_activePalette.colors.join(', ')}
                  </span>
                </div>
                <div className="glass-panel stat-card">
                  <span className="keybinding-category">Tiling Layouts</span>
                  <div className="value">
                    {local_layouts.filter(l => l.enabled).length} Active
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Primary: {local_getActiveLayoutName()}
                  </span>
                </div>
                <div className="glass-panel stat-card">
                  <span className="keybinding-category">Keybindings</span>
                  <div className="value">
                    {local_keybindings.length} keys
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Super key maps to: {local_modKey === 'mod4' ? 'Super/Win' : 'Alt'}
                  </span>
                </div>
              </div>

              <div className="glass-panel" style={{ marginTop: '24px', padding: '20px' }}>
                <h3 style={{ marginBottom: '14px', fontSize: '1.1rem', color: 'var(--accent-primary)' }}>General Window Settings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Mod Modifier Key</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className={`code-action-btn ${local_modKey === 'mod4' ? 'active' : ''}`}
                        onClick={() => setLocal_modKey('mod4')}
                        style={{ flex: 1, padding: '8px', background: local_modKey === 'mod4' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: local_modKey === 'mod4' ? '#000' : '#fff' }}
                      >
                        Super (mod4)
                      </button>
                      <button 
                        className={`code-action-btn ${local_modKey === 'mod1' ? 'active' : ''}`}
                        onClick={() => setLocal_modKey('mod1')}
                        style={{ flex: 1, padding: '8px', background: local_modKey === 'mod1' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: local_modKey === 'mod1' ? '#000' : '#fff' }}
                      >
                        Alt (mod1)
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Default Terminal App</label>
                    <input 
                      type="text" 
                      className="workspace-input"
                      value={local_terminalApp}
                      onChange={(e) => setLocal_terminalApp(e.target.value)}
                      placeholder="e.g. kitty"
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Window Margin / Gaps ({local_windowMargin}px)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="32" 
                      value={local_windowMargin}
                      onChange={(e) => setLocal_windowMargin(parseInt(e.target.value))}
                      style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Border Width ({local_borderWidth}px)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="8" 
                      value={local_borderWidth}
                      onChange={(e) => setLocal_borderWidth(parseInt(e.target.value))}
                      style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginTop: '24px' }}>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h3 style={{ marginBottom: '14px', fontSize: '1.1rem' }}>Active Screen Mockup</h3>
                  <div className="desktop-mockup">
                    <div className="qtile-bar-mock">
                      <div className="bar-group">
                        {local_widgets.filter(w => w.enabled && w.side === 'left').map(w => local_renderBarWidgetMock(w.id))}
                      </div>
                      <div className="bar-group">
                        {local_widgets.filter(w => w.enabled && w.side === 'right').map(w => local_renderBarWidgetMock(w.id))}
                      </div>
                    </div>
                    <div className="tiling-area">
                      {local_renderTilingWindowsMock()}
                    </div>
                  </div>
                </div>

                <div className="glass-panel autostart-section">
                  <h3 style={{ fontSize: '1.1rem' }}>Autostart Scripts</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Toggle scripts loaded on startup:</p>
                  
                  <div className="task-list">
                    {local_services.map(service => (
                      <div 
                        key={service.id} 
                        className={`task-item ${service.enabled ? 'completed' : ''}`}
                        onClick={() => local_toggleService(service.id)}
                      >
                        <div className="task-checkbox"></div>
                        <div className="task-info">
                          <span className="task-name">{service.name}</span>
                          <span className="task-desc">{service.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Custom Autostart script line</label>
                    <textarea 
                      className="workspace-input"
                      style={{ fontSize: '0.8rem', fontFamily: 'monospace', height: '60px', resize: 'none' }}
                      value={local_customAutostartLines}
                      onChange={(e) => setLocal_customAutostartLines(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ marginTop: '24px', padding: '20px' }}>
                <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Change Qtile Desktop Theme</h3>
                <div className="theme-picker-grid">
                  {(Object.keys(local_themePalettes) as ThemeType[]).map(t => (
                    <div 
                      key={t}
                      className={`theme-card ${local_theme === t ? 'active' : ''}`}
                      onClick={() => setLocal_theme(t)}
                    >
                      <div className="theme-dot-preview">
                        {local_themePalettes[t].colors.map((c, i) => (
                          <span key={i} style={{ backgroundColor: c }}></span>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>
                        {t.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {local_activeTab === 'widgets' && (
            <div className="tab-view animate-fade">
              <div className="section-header">
                <h2>Bar & Widgets Builder</h2>
                <p>Enable/disable top bar widgets and visually watch the qtile monitor bar mockup adjust.</p>
              </div>

              <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '12px', fontSize: '1rem' }}>Live Top Bar Preview</h3>
                <div className="desktop-mockup" style={{ aspectRatio: '21/5' }}>
                  <div className="qtile-bar-mock">
                    <div className="bar-group">
                      {local_widgets.filter(w => w.enabled && w.side === 'left').map(w => local_renderBarWidgetMock(w.id))}
                    </div>
                    <div className="bar-group">
                      {local_widgets.filter(w => w.enabled && w.side === 'right').map(w => local_renderBarWidgetMock(w.id))}
                    </div>
                  </div>
                  <div className="tiling-area" style={{ background: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>Mock Wallpaper Screen</span>
                  </div>
                </div>
              </div>

              <div className="widget-builder-container">
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h3 style={{ marginBottom: '14px', fontSize: '1rem', color: 'var(--accent-primary)' }}>Left Side Widgets</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {local_widgets.filter(w => w.side === 'left').map(w => (
                      <div key={w.id} className="widget-item-config">
                        <div className="widget-item-info">
                          <span className="widget-item-name">{w.name}</span>
                          <span className="widget-item-desc">{w.desc}</span>
                        </div>
                        <div 
                          className={`toggle-switch ${w.enabled ? 'active' : ''}`}
                          onClick={() => local_toggleWidget(w.id)}
                        >
                          <span className="toggle-dot"></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h3 style={{ marginBottom: '14px', fontSize: '1rem', color: 'var(--accent-secondary)' }}>Right Side Widgets</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {local_widgets.filter(w => w.side === 'right').map(w => (
                      <div key={w.id} className="widget-item-config">
                        <div className="widget-item-info">
                          <span className="widget-item-name">{w.name}</span>
                          <span className="widget-item-desc">{w.desc}</span>
                        </div>
                        <div 
                          className={`toggle-switch ${w.enabled ? 'active' : ''}`}
                          onClick={() => local_toggleWidget(w.id)}
                        >
                          <span className="toggle-dot"></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {local_activeTab === 'keybindings' && (
            <div className="tab-view animate-fade">
              <div className="section-header">
                <h2>Keyboard Shortcuts</h2>
                <p>Customize key mappings for window layout managers and system utility executions.</p>
              </div>

              <form onSubmit={local_addCustomKeybinding} className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
                <h3 style={{ width: '100%', fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '-4px' }}>Add Custom Keybinding</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '120px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Modifier</label>
                  <select 
                    className="workspace-input" 
                    value={local_newKeyMod}
                    onChange={(e) => setLocal_newKeyMod(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px' }}
                  >
                    <option value="mod">mod (Super)</option>
                    <option value="mod+shift">mod + shift</option>
                    <option value="mod+control">mod + control</option>
                    <option value="mod+control+shift">mod+ctrl+shift</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '90px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Key</label>
                  <input 
                    type="text" 
                    className="workspace-input"
                    value={local_newKeyName}
                    onChange={(e) => setLocal_newKeyName(e.target.value)}
                    placeholder="e.g. p"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1, minWidth: '150px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Description</label>
                  <input 
                    type="text" 
                    className="workspace-input"
                    value={local_newKeyAction}
                    onChange={(e) => setLocal_newKeyAction(e.target.value)}
                    placeholder="e.g. Open dmenu"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1, minWidth: '180px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Qtile command</label>
                  <input 
                    type="text" 
                    className="workspace-input"
                    value={local_newKeyCmd}
                    onChange={(e) => setLocal_newKeyCmd(e.target.value)}
                    placeholder='e.g. lazy.spawn("dmenu_run")'
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Category</label>
                  <select 
                    className="workspace-input" 
                    value={local_newKeyCategory}
                    onChange={(e) => setLocal_newKeyCategory(e.target.value as 'Window' | 'Layout' | 'Group' | 'System')}
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px' }}
                  >
                    <option value="Window">Window</option>
                    <option value="Layout">Layout</option>
                    <option value="Group">Group</option>
                    <option value="System">System</option>
                  </select>
                </div>

                <button type="submit" className="code-action-btn" style={{ padding: '9px 16px', height: '38px' }}>
                  Add Binding
                </button>
              </form>

              <div className="search-container">
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Search key combo, shortcut action, or category..."
                  value={local_searchQuery}
                  onChange={(e) => setLocal_searchQuery(e.target.value)}
                />
              </div>

              <div className="glass-panel" style={{ padding: '16px' }}>
                <div className="keybinding-row" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)', borderRadius: 0, fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                  <span>Key Combination</span>
                  <span>Category</span>
                  <span>Trigger Action / Python Code</span>
                </div>
                
                <div className="keybinding-grid">
                  {local_filteredKeybindings.length > 0 ? (
                    local_filteredKeybindings.map(k => (
                      <div key={k.id} className="keybinding-row" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <span className="key-badge">{k.mod}</span>
                          <span>+</span>
                          <input 
                            type="text" 
                            className="workspace-input" 
                            style={{ width: '70px', padding: '4px 6px', fontSize: '0.8rem', textAlign: 'center' }}
                            value={k.key}
                            onChange={(e) => local_handleKeybindingChange(k.id, 'key', e.target.value)}
                          />
                        </div>
                        <span className="keybinding-category">{k.category}</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className="keybinding-action">{k.action}</span>
                            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{k.cmd}</span>
                          </div>
                          {k.custom && (
                            <button 
                              onClick={() => local_removeCustomKeybinding(k.id)}
                              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                      No keybindings match "{local_searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {local_activeTab === 'layouts' && (
            <div className="tab-view animate-fade">
              <div className="section-header">
                <h2>Layouts & Workspaces</h2>
                <p>Configure active tiling window layout strategies and label your nine workspace workspaces.</p>
              </div>

              <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
                <h3>Active Tiling Strategies</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Enable tiling layouts for qtile (first checked layout will be active by default):</p>
                <div className="layout-picker-grid">
                  {local_layouts.map(l => (
                    <div 
                      key={l.id}
                      className={`layout-card ${l.enabled ? 'active' : ''}`}
                      onClick={() => local_toggleLayout(l.id)}
                    >
                      <div className="layout-icon-preview">
                        {l.id === 'monadtall' && (
                          <>
                            <div className="layout-preview-box" style={{ flex: 3 }}></div>
                            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <div className="layout-preview-box" style={{ flex: 1 }}></div>
                              <div className="layout-preview-box" style={{ flex: 1 }}></div>
                            </div>
                          </>
                        )}
                        {l.id === 'max' && (
                          <div className="layout-preview-box" style={{ flex: 1 }}></div>
                        )}
                        {l.id === 'columns' && (
                          <>
                            <div className="layout-preview-box" style={{ flex: 1 }}></div>
                            <div className="layout-preview-box" style={{ flex: 1 }}></div>
                            <div className="layout-preview-box" style={{ flex: 1 }}></div>
                          </>
                        )}
                        {l.id === 'floating' && (
                          <div style={{ flex: 1, position: 'relative' }}>
                            <div className="layout-preview-box" style={{ position: 'absolute', width: '60%', height: '60%', top: '10%', left: '10%' }}></div>
                            <div className="layout-preview-box" style={{ position: 'absolute', width: '50%', height: '50%', bottom: '10%', right: '10%', opacity: 0.6 }}></div>
                          </div>
                        )}
                        {l.id === 'stack' && (
                          <>
                            <div className="layout-preview-box" style={{ flex: 1 }}></div>
                            <div className="layout-preview-box" style={{ flex: 1 }}></div>
                          </>
                        )}
                      </div>
                      <span className="layout-text-label">{l.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3>Workspace Groups Setup</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Labels and icons displayed in widget bar buttons (super key + index jumps to workspace):</p>
                <div className="workspace-list">
                  {local_groups.map(group => (
                    <div key={group.id} className="workspace-row">
                      <span className="workspace-index">Grp {group.id}</span>
                      <input 
                        type="text"
                        className="workspace-input name"
                        value={group.name}
                        onChange={(e) => local_handleGroupConfigChange(group.id, 'name', e.target.value)}
                        placeholder="Label"
                      />
                      <input 
                        type="text"
                        className="workspace-input icon"
                        value={group.icon}
                        onChange={(e) => local_handleGroupConfigChange(group.id, 'icon', e.target.value)}
                        placeholder="Icon"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {local_activeTab === 'exporter' && (
            <div className="tab-view animate-fade">
              <div className="section-header">
                <h2>Configuration Exporter</h2>
                <p>Inspect and download your custom qtile config files. Move these files to <code>~/.config/qtile/</code>.</p>
              </div>

              <div className="code-container">
                <div className="code-header">
                  <div className="code-header-tabs">
                    <button 
                      className={`code-tab-btn ${local_selectedExporterFile === 'config.py' ? 'active' : ''}`}
                      onClick={() => setLocal_selectedExporterFile('config.py')}
                    >
                      config.py
                    </button>
                    <button 
                      className={`code-tab-btn ${local_selectedExporterFile === 'autostart.sh' ? 'active' : ''}`}
                      onClick={() => setLocal_selectedExporterFile('autostart.sh')}
                    >
                      autostart.sh
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="code-action-btn" onClick={local_copyToClipboard} style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </button>
                    <button className="code-action-btn" onClick={local_downloadCodeFile}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
                
                <pre className="code-body">
                  <code 
                    dangerouslySetInnerHTML={{ 
                      __html: local_highlightCode(
                        local_selectedExporterFile === 'config.py' ? local_generateConfigPyCode() : local_generateAutostartShCode()
                      ) 
                    }} 
                  />
                </pre>
              </div>

              <div className="glass-panel" style={{ marginTop: '24px', padding: '20px' }}>
                <h3 style={{ marginBottom: '10px', fontSize: '1rem', color: 'var(--accent-primary)' }}>Deployment Quick Start</h3>
                <ol style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Create the configuration directories on your Linux computer: <code>mkdir -p ~/.config/qtile</code></li>
                  <li>Copy and save your downloaded <code>config.py</code> and <code>autostart.sh</code> scripts to that directory.</li>
                  <li>Ensure the autostart shell script is executable by running: <code>chmod +x ~/.config/qtile/autostart.sh</code></li>
                  <li>Trigger a hot reload of Qtile by hitting your hotkey: <code>Super + Control + R</code> (reload config).</li>
                </ol>
              </div>
            </div>
          )}
        </main>
      </div>

      {local_toast && (
        <div className="toast-msg animate-fade">
          <span>✔️</span> {local_toast}
        </div>
      )}
    </>
  )
}

export default App
