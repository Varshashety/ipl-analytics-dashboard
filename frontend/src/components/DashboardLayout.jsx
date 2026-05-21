import { useState } from "react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function DashboardLayout({
  activeSection,
  children,
  collapsed,
  mobileOpen,
  navigation,
  onSectionChange,
  onToggleCollapsed,
  onToggleMobile,
  onThemeChange,
  season,
  onSeasonChange,
  seasonOptions,
  theme,
  themeOptions,
  title,
}) {
  const [pointer, setPointer] = useState({ x: "50%", y: "25%" })
  const offsetClass = collapsed ? "lg:pl-24" : "lg:pl-72"
  const sectionTitle =
    navigation.find((item) => item.id === activeSection)?.label ?? "Dashboard"

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      onPointerMove={(event) => {
        setPointer({
          x: `${event.clientX}px`,
          y: `${event.clientY}px`,
        })
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[-6rem] top-[-4rem] h-72 w-72 rounded-full blur-3xl"
          style={{ background: `${theme.accent}15` }}
        />
        <div
          className="absolute right-[-4rem] top-24 h-80 w-80 rounded-full blur-3xl"
          style={{ background: `${theme.secondary}16` }}
        />
        <div
          className="absolute bottom-[-5rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: `${theme.highlight}13` }}
        />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(circle 360px at ${pointer.x} ${pointer.y}, ${theme.accent}16, transparent 62%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.02)_0%,transparent_24%,transparent_76%,rgba(255,255,255,0.02)_100%)]" />
      </div>

      <Sidebar
        activeSection={activeSection}
        collapsed={collapsed}
        items={navigation}
        mobileOpen={mobileOpen}
        onClose={() => onToggleMobile(false)}
        onSelect={(section) => {
          onSectionChange(section)
          onToggleMobile(false)
        }}
      />

      {mobileOpen ? (
        <button
          type="button"
          onClick={() => onToggleMobile(false)}
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation overlay"
        />
      ) : null}

      <div className={`relative z-10 min-h-screen transition-[padding] duration-300 ${offsetClass}`}>
        <Topbar
          collapsed={collapsed}
          onMenuClick={() => onToggleMobile(true)}
          onThemeChange={onThemeChange}
          onToggleCollapse={onToggleCollapsed}
          season={season}
          onSeasonChange={onSeasonChange}
          seasonOptions={seasonOptions}
          sectionTitle={sectionTitle}
          theme={theme}
          themeOptions={themeOptions}
          title={title}
        />

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
