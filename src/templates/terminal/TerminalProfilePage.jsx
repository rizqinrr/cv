import { useState, useRef, useEffect } from 'react'
import { PROFILE } from '../../config/profile.js'
import { MENU, SOCIALS } from '../../config/links.js'
import './terminal.css'

export default function TerminalProfilePage() {
  const [themeMode, setThemeMode] = useState('green') // 'green' | 'amber' | 'cyan'
  const [commandInput, setCommandInput] = useState('')
  const [history, setHistory] = useState([])
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const terminalEndRef = useRef(null)

  // Skill bars definition
  const skillsData = [
    { name: 'Linux / Bash Scripting', pct: 95, bar: '[==================> ]' },
    { name: 'React / Next.js / Node', pct: 90, bar: '[=================>  ]' },
    { name: 'CyberSec & Penetration', pct: 85, bar: '[================>   ]' },
    { name: 'Docker / Cloud Infra', pct: 80, bar: '[===============>    ]' },
    { name: 'PostgreSQL / Supabase', pct: 88, bar: '[=================>  ]' },
  ]

  // Virtual files for 'ls' command
  const executableFiles = [
    { name: 'curriculum_vitae.run', desc: 'Detailed CV & Experience', href: '#/cv', type: 'ELF 64-bit' },
    { name: 'portfolio_showcase.bin', desc: 'Case Studies & Production Apps', href: '#/portfolio', type: 'ELF 64-bit' },
    ...MENU.map((item) => ({
      name: `${item.label.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20)}.sh`,
      desc: item.label,
      href: item.href,
      type: 'Shell Script',
    })),
  ]

  const handleCommand = (cmdText) => {
    const trimmed = (cmdText || commandInput).trim().toLowerCase()
    if (!trimmed) return

    let output = ''
    if (trimmed === 'help') {
      output = `Supported commands:
  - help      : Show this manual page
  - neofetch  : Display system specs and profile info
  - ls, dir   : List executable profiles and links
  - cat bio   : Print author biography
  - skills    : Render ASCII skill proficiency gauges
  - theme     : Cycle palette (green -> amber -> cyan)
  - contact   : Print transmission & communication handles
  - clear, cls: Flush terminal screen buffer`
    } else if (trimmed === 'clear' || trimmed === 'cls') {
      setHistory([])
      setCommandInput('')
      return
    } else if (trimmed === 'ls' || trimmed === 'dir') {
      output = executableFiles.map(f => `-rwxr-xr-x 1 root root  4096 Sep 03 13:37 ${f.name}`).join('\n')
    } else if (trimmed === 'neofetch' || trimmed === 'fastfetch') {
      output = `User: ${PROFILE.name}
Role: ${PROFILE.title}
OS: Arch Linux x86_64
Kernel: 6.8.9-zen1-1-zen
Shell: zsh 5.9
Status: System Online & Accepting Contracts`
    } else if (trimmed === 'cat bio' || trimmed === 'bio' || trimmed === 'about') {
      output = `${PROFILE.bio}\nLocation: ${PROFILE.location}`
    } else if (trimmed === 'skills') {
      output = skillsData.map(s => `${s.name.padEnd(25)} ${s.bar} ${s.pct}%`).join('\n')
    } else if (trimmed === 'contact') {
      output = `Transmission channels:
- WhatsApp / Signal: Ready
- GitHub: https://github.com/rizqinrr
- Status: Encryption active`
    } else if (trimmed.startsWith('theme')) {
      const nextTheme = themeMode === 'green' ? 'amber' : themeMode === 'amber' ? 'cyan' : 'green'
      setThemeMode(nextTheme)
      output = `Terminal phosphor palette updated to: ${nextTheme.toUpperCase()}`
    } else {
      output = `bash: command not found: ${trimmed}. Type 'help' for valid instructions.`
    }

    setHistory(prev => [...prev, { cmd: trimmed, output }])
    setCommandInput('')
  }

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [history])

  const copyLicenseLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`term-page theme-${themeMode}`}>
      {/* Visual CRT effects */}
      <div className="term-scanlines" />
      <div className="term-vignette" />

      {/* Commercial Banner */}
      <header className="term-comm-banner">
        <div className="term-comm-badge">
          <span className="pulse-dot" />
          TTY / Terminal
        </div>
        <div className="term-comm-actions">
          <a href="#/" className="term-btn-action" title="Kembali ke tampilan profil default">
            [ESC]
          </a>
          <button
            type="button"
            className="term-btn-action"
            onClick={() => setShowBuyModal(true)}
          >
            [$ Buy]
          </button>
        </div>
      </header>

      <main className="term-container">
        {/* Terminal Shell Window */}
        <div className="term-window">
          {/* Chrome bar */}
          <div className="term-titlebar">
            <div className="term-window-dots">
              <span className="term-dot term-dot-red" />
              <span className="term-dot term-dot-yellow" />
              <span className="term-dot term-dot-green" />
            </div>
            <div className="term-title">
              <span>root@rizqi-box: ~ (zsh)</span>
            </div>
            <div className="term-palette-toggles">
              <button
                type="button"
                className={`term-palette-btn ${themeMode === 'green' ? 'active' : ''}`}
                onClick={() => setThemeMode('green')}
              >
                GRN
              </button>
              <button
                type="button"
                className={`term-palette-btn ${themeMode === 'amber' ? 'active' : ''}`}
                onClick={() => setThemeMode('amber')}
              >
                AMB
              </button>
              <button
                type="button"
                className={`term-palette-btn ${themeMode === 'cyan' ? 'active' : ''}`}
                onClick={() => setThemeMode('cyan')}
              >
                CYN
              </button>
            </div>
          </div>

          {/* Terminal Screen Body */}
          <div className="term-body">
            {/* ASCII Banner */}
            <div className="term-ascii-wrapper">
              <div className="term-ascii-banner">
{` ____  ___ ________  ___ 
|  _ \\|_ _|__  / _ \\|_ _|
| |_) || |  / / | | || | 
|  _ < | | / /| |_| || | 
|_| \\_\\___/____\\__\\_\\___|`}
              </div>
            </div>

            {/* Neofetch System Summary */}
            <div className="term-neofetch">
              <div className="term-avatar-box">
                <div className="term-avatar-frame">
                  <img src={PROFILE.avatar} alt={PROFILE.name} />
                  <div className="term-avatar-overlay" />
                </div>
                <div className="term-status-badge">
                  ● SYSTEM IDLE
                </div>
              </div>

              <div className="term-sys-stats">
                <div className="term-sys-row">
                  <span className="term-sys-label">ID:</span>
                  <span className="term-sys-val">{PROFILE.name}</span>
                </div>
                <div className="term-sys-row">
                  <span className="term-sys-label">ROLE:</span>
                  <span className="term-sys-val">{PROFILE.title}</span>
                </div>
                <div className="term-sys-row">
                  <span className="term-sys-label">LOC:</span>
                  <span className="term-sys-val">{PROFILE.location}</span>
                </div>
                <div className="term-sys-row">
                  <span className="term-sys-label">UPTIME:</span>
                  <span className="term-sys-val">99.98% / 4,281h</span>
                </div>
                <div className="term-sys-row">
                  <span className="term-sys-label">BIO:</span>
                  <span className="term-sys-val">{PROFILE.bio}</span>
                </div>
              </div>
            </div>

            {/* Prompt for directory execute */}
            <div className="term-prompt-line">
              <span className="term-user">rizqi</span>
              <span className="term-at">@</span>
              <span className="term-host">box</span>
              <span className="term-path">~/bin</span>
              <span className="term-dollar">$</span>
              <span className="term-command">./load.sh</span>
            </div>

            {/* Virtual Filesystem Grid (Executable links) */}
            <div className="term-fs-grid">
              {executableFiles.map((file) => (
                <a
                  key={file.name}
                  href={file.href}
                  className="term-file-item"
                  target={file.href.startsWith('http') ? '_blank' : '_self'}
                  rel={file.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <div className="term-file-left">
                    <span className="term-file-icon">⚡</span>
                    <div className="term-file-info">
                      <div className="term-file-name">{file.name}</div>
                      <div className="term-file-perm">{file.desc}</div>
                    </div>
                  </div>
                  <span className="term-file-badge">EXEC</span>
                </a>
              ))}
            </div>

            {/* Social Outlets Section */}
            <div className="term-prompt-line">
              <span className="term-user">rizqi</span>
              <span className="term-at">@</span>
              <span className="term-host">box</span>
              <span className="term-path">~/net</span>
              <span className="term-dollar">$</span>
              <span className="term-command">netstat</span>
            </div>

            <div className="term-fs-grid">
              {SOCIALS.map((soc) => (
                <a
                  key={soc.label}
                  href={soc.href}
                  className="term-file-item"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="term-file-left">
                    <span className="term-file-icon">📡</span>
                    <div className="term-file-info">
                      <div className="term-file-name">{soc.label.toLowerCase()}.conn</div>
                      <div className="term-file-perm">Encrypted endpoint</div>
                    </div>
                  </div>
                  <span className="term-file-badge">LIVE</span>
                </a>
              ))}
            </div>

            {/* Technical Skills Gauge Section */}
            <div className="term-prompt-line">
              <span className="term-user">rizqi</span>
              <span className="term-at">@</span>
              <span className="term-host">box</span>
              <span className="term-path">~/spec</span>
              <span className="term-dollar">$</span>
              <span className="term-command">cat skills.matrix</span>
            </div>

            <div className="term-skills-list">
              {skillsData.map((skill) => (
                <div key={skill.name} className="term-skill-row">
                  <div className="term-skill-top">
                    <span className="term-skill-label">{skill.name}</span>
                    <span className="term-skill-pct">{skill.pct}%</span>
                  </div>
                  <div className="term-skill-bar">{skill.bar}</div>
                </div>
              ))}
            </div>

            {/* Interactive Command History Buffer */}
            {history.length > 0 && (
              <div className="term-interactive-history">
                {history.map((h, i) => (
                  <div key={i} className="term-history-entry">
                    <div className="term-prompt-line" style={{ margin: 0 }}>
                      <span className="term-user">guest</span>
                      <span className="term-dollar">$</span>
                      <span className="term-command">{h.cmd}</span>
                    </div>
                    <div className="term-history-output">{h.output}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Command Prompt */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleCommand(commandInput)
              }}
              className="term-input-box"
            >
              <span className="term-user">guest</span>
              <span className="term-dollar">$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="type 'help', 'neofetch', 'skills', or 'theme'..."
                className="term-input-field"
                autoComplete="off"
                spellCheck="false"
              />
              <span className="term-cursor" />
              <button type="submit" className="term-btn-exec">
                RUN
              </button>
            </form>

            {/* Quick action suggestion chips */}
            <div className="term-quick-chips">
              <span style={{ opacity: 0.6 }}>Shortcuts:</span>
              <button type="button" className="term-chip" onClick={() => handleCommand('help')}>help</button>
              <button type="button" className="term-chip" onClick={() => handleCommand('neofetch')}>neofetch</button>
              <button type="button" className="term-chip" onClick={() => handleCommand('skills')}>skills</button>
              <button type="button" className="term-chip" onClick={() => handleCommand('theme')}>theme</button>
              <button type="button" className="term-chip" onClick={() => handleCommand('clear')}>clear</button>
            </div>

            <div ref={terminalEndRef} />
          </div>
        </div>
      </main>

      {/* Commercial License Modal */}
      {showBuyModal && (
        <div className="term-modal-backdrop" onClick={() => setShowBuyModal(false)}>
          <div className="term-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="term-modal-header">
              <span>[COMMERCIAL_LICENSE_OFFER.md]</span>
              <button
                type="button"
                className="term-modal-close"
                onClick={() => setShowBuyModal(false)}
              >
                [X]
              </button>
            </div>
            <div className="term-modal-body">
              <h3 style={{ color: 'var(--term-color-highlight)', margin: '0 0 8px' }}>
                CLI / Terminal Hacker Template
              </h3>
              <p>
                Dapatkan paket source code lengkap template ini untuk profil dev, sysadmin, portfolio cybersecurity, atau custom terminal website.
              </p>
              <div className="term-modal-specs">
                <div>✓ 100% Self-contained React 19 + Vanilla CSS modular</div>
                <div>✓ Dynamic Phosphor palettes (Matrix Green, Amber, Cyan)</div>
                <div>✓ Built-in interactive CLI parser (neofetch, help, etc)</div>
                <div>✓ Responsive layout & CRT scanline shader overlay</div>
              </div>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                Hubungi via WhatsApp untuk negosiasi harga dan delivery repo / file source code.
              </p>
            </div>
            <div className="term-modal-footer">
              <button
                type="button"
                className="term-btn-action"
                onClick={copyLicenseLink}
              >
                {copied ? '[COPIED!]' : '[COPY LINK]'}
              </button>
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  'Halo! Saya tertarik membeli source code template profil CLI / Terminal Hacker.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="term-btn-action"
                style={{ background: 'var(--term-color-primary)', color: '#000' }}
              >
                [ORDER VIA WA]
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
