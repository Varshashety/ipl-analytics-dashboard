import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  BarChart3,
  MapPinned,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  Zap,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardLayout from "../components/DashboardLayout"
import EmptyState from "../components/EmptyState"
import BroadcastHero from "../components/BroadcastHero"
import GlassPanel from "../components/GlassPanel"
import LoadingSpinner from "../components/LoadingSpinner"
import SearchBar from "../components/SearchBar"
import StatCard from "../components/StatCard"
import TeamCard from "../components/TeamCard"
import { fetchDashboardData, fetchSeasons } from "../services/api"
import ChasingSuccessChart from "../charts/ChasingSuccessChart"
import TeamWinRateChart from "../charts/TeamWinRateChart"
import TossImpactChart from "../charts/TossImpactChart"
import VenueMatchChart from "../charts/VenueMatchChart"

const DEFAULT_SEASON_OPTIONS = [
  "All Seasons",
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020/21",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
  "2013",
  "2012",
  "2011",
  "2009/10",
  "2009",
  "2007/08",
]

const NAVIGATION = [
  {
    description: "Overview and fast insights",
    icon: BarChart3,
    id: "dashboard",
    label: "Dashboard",
  },
  {
    description: "Teams and win rates",
    icon: Users,
    id: "teams",
    label: "Teams",
  },
  {
    description: "Ground-by-ground patterns",
    icon: MapPinned,
    id: "venues",
    label: "Venues",
  },
  {
    description: "Toss-driven outcomes",
    icon: Zap,
    id: "toss",
    label: "Toss Analytics",
  },
  {
    description: "Coming soon player layer",
    icon: UserRound,
    id: "players",
    label: "Player Analytics",
  },
  {
    description: "Momentum and chasing trends",
    icon: Activity,
    id: "insights",
    label: "Match Insights",
  },
]

const INSIGHT_CARDS = [
  {
    accent: "from-cyan-500/15 via-sky-500/10 to-transparent",
    detail: "The top-ranked team by all-time win rate leads the table in your dataset.",
    icon: Trophy,
    label: "Highest Win Rate Team",
    metric: "Champion",
  },
  {
    accent: "from-emerald-500/15 via-lime-500/10 to-transparent",
    detail: "Use the sidebar and search to move from broad trends to focused analysis.",
    icon: Sparkles,
    label: "Premium Interaction",
    metric: "Smooth UI",
  },
  {
    accent: "from-fuchsia-500/15 via-violet-500/10 to-transparent",
    detail: "Every card and chart is built for portfolio-grade presentation.",
    icon: Activity,
    label: "Dashboard Quality",
    metric: "Production feel",
  },
]

const TEAM_THEMES = {
  broadcast: {
    accent: "#22d3ee",
    highlight: "#10b981",
    key: "broadcast",
    label: "Broadcast",
    secondary: "#f59e0b",
  },
  csk: {
    accent: "#facc15",
    highlight: "#f97316",
    key: "csk",
    label: "CSK",
    secondary: "#f59e0b",
  },
  mi: {
    accent: "#38bdf8",
    highlight: "#fbbf24",
    key: "mi",
    label: "MI",
    secondary: "#60a5fa",
  },
  rcb: {
    accent: "#ef4444",
    highlight: "#f59e0b",
    key: "rcb",
    label: "RCB",
    secondary: "#111827",
  },
  srh: {
    accent: "#fb923c",
    highlight: "#f97316",
    key: "srh",
    label: "SRH",
    secondary: "#0f172a",
  },
  kkr: {
    accent: "#a855f7",
    highlight: "#facc15",
    key: "kkr",
    label: "KKR",
    secondary: "#6d28d9",
  },
}

const TEAM_THEME_OPTIONS = Object.values(TEAM_THEMES).map((theme) => ({
  label: theme.label,
  value: theme.key,
}))

const TEAM_FOCUS_MAP = {
  csk: "Chennai Super Kings",
  mi: "Mumbai Indians",
  rcb: "Royal Challengers Bangalore",
  srh: "Sunrisers Hyderabad",
  kkr: "Kolkata Knight Riders",
}

function normalizeTeam(team) {
  return {
    team: team.team ?? "Unknown team",
    wins: Number(team.wins ?? 0),
    win_percentage: Number(team.win_percentage ?? 0),
  }
}

function normalizeVenue(venue) {
  return {
    total_matches: Number(venue.total_matches ?? 0),
    venue: venue.venue ?? "Unknown venue",
  }
}

function normalizeChasing(item) {
  return {
    chasing_success_percentage: Number(item.chasing_success_percentage ?? 0),
    total_matches: Number(item.total_matches ?? 0),
    venue: item.venue ?? "Unknown venue",
  }
}

function normalizeToss(toss) {
  return {
    success_percentage: Number(toss?.success_percentage ?? 0),
    total_matches: Number(toss?.total_matches ?? 0),
    toss_match_wins: Number(toss?.toss_match_wins ?? 0),
  }
}

function formatCount(value) {
  return Number(value).toLocaleString()
}

function TickerItem({ label, value, tone }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/55 px-4 py-2 text-sm backdrop-blur-xl">
      <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  )
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [season, setSeason] = useState("All Seasons")
  const [themeKey, setThemeKey] = useState("broadcast")
  const [seasonOptions, setSeasonOptions] = useState(DEFAULT_SEASON_OPTIONS)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState([])
  const [data, setData] = useState({
    chasing: [],
    teams: [],
    toss: null,
    venues: [],
  })

  const focusedTeamName = TEAM_FOCUS_MAP[themeKey] ?? null

  useEffect(() => {
    let ignore = false

    fetchSeasons()
      .then((items) => {
        if (!ignore && items.length > 0) {
          setSeasonOptions(items)
        }
      })
      .catch(() => {
        if (!ignore) {
          setSeasonOptions(DEFAULT_SEASON_OPTIONS)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadDashboard() {
      setLoading(true)

      const dashboard = await fetchDashboardData({
        season,
        team: focusedTeamName,
      })

      if (ignore) {
        return
      }

      setData({
        chasing: dashboard.chasing.map(normalizeChasing),
        teams: dashboard.teams.map(normalizeTeam),
        toss: normalizeToss(dashboard.toss),
        venues: dashboard.venues.map(normalizeVenue),
      })
      setErrors(dashboard.errors)
      setLoading(false)
    }

    loadDashboard().catch(() => {
      if (!ignore) {
        setErrors(["dashboard data"])
        setLoading(false)
      }
    })

    return () => {
      ignore = true
    }
  }, [focusedTeamName, season])

  const sortedTeams = useMemo(
    () => [...data.teams].sort((a, b) => b.win_percentage - a.win_percentage),
    [data.teams],
  )

  const filteredTeams = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return sortedTeams
    }

    return sortedTeams.filter((team) =>
      team.team.toLowerCase().includes(query),
    )
  }, [search, sortedTeams])

  const totalMatches = useMemo(
    () => data.venues.reduce((sum, venue) => sum + venue.total_matches, 0),
    [data.venues],
  )

  const topTeam = sortedTeams[0]
  const topVenueBySuccess = useMemo(() => {
    if (!data.chasing.length) {
      return null
    }

    return [...data.chasing].sort(
      (a, b) => b.chasing_success_percentage - a.chasing_success_percentage,
    )[0]
  }, [data.chasing])

  const tossImpact = data.toss?.success_percentage ?? 0
  const totalTeams = data.teams.length
  const theme = TEAM_THEMES[themeKey] ?? TEAM_THEMES.broadcast

  const teamChartData = sortedTeams.slice(0, 10)
  const venueChartData = [...data.venues].slice(0, 8)
  const chasingChartData = [...data.chasing].slice(0, 8)
  const tossChartData = [
    {
      name: "Toss winner won match",
      value: Number(tossImpact.toFixed(2)),
    },
    {
      name: "Other outcomes",
      value: Number((100 - tossImpact).toFixed(2)),
    },
  ]

  const heroStats = [
    {
      helper: "Teams tracked across the selected season.",
      label: "Teams",
      value: formatCount(totalTeams),
    },
    {
      helper: "Matches reflected in the live analytics set.",
      label: "Matches",
      value: formatCount(totalMatches),
    },
    {
      helper: "Toss win conversion in the current filter.",
      label: "Toss edge",
      value: `${tossImpact.toFixed(2)}%`,
    },
  ]

  const playerHeroStats = [
    {
      helper: "Broadcast proxy for batting form leaders.",
      label: "Orange Cap Leader",
      value: topTeam ? topTeam.team : "Loading",
    },
    {
      helper: "Projected player confidence from current form.",
      label: "Form Index",
      value: `${Math.min(99, 70 + Math.round(topTeam?.win_percentage ?? 0))}%`,
    },
    {
      helper: "Fantasy-friendly momentum rating.",
      label: "Fantasy Heat",
      value: topVenueBySuccess ? "Elite" : "Warming Up",
    },
  ]

  const playerTickerItems = [
    {
      label: "Orange cap",
      tone: "bg-cyan-300",
      value: topTeam ? topTeam.team : "Loading",
    },
    {
      label: "Form index",
      tone: "bg-emerald-300",
      value: `${Math.min(99, 70 + Math.round(topTeam?.win_percentage ?? 0))}%`,
    },
    {
      label: "Fantasy heat",
      tone: "bg-amber-300",
      value: topVenueBySuccess ? "Elite" : "Warm",
    },
    {
      label: "Broadcast focus",
      tone: "bg-fuchsia-300",
      value: "Player analytics",
    },
  ]

  const powerplayTeams = sortedTeams.slice(0, 3)
  const comparisonTeams = sortedTeams.slice(0, 2)
  const fantasyStack = sortedTeams.slice(0, 5)

  const matchPrediction = {
    confidence: topTeam ? Math.min(96, Math.round(58 + topTeam.win_percentage)) : 0,
    momentum: topVenueBySuccess
      ? Math.min(100, Math.round(topVenueBySuccess.chasing_success_percentage + tossImpact / 2))
      : 0,
    predictedScore: Math.round(
      150 +
        (totalMatches / 18) +
        (tossImpact / 4) +
        (topTeam?.win_percentage ?? 0) / 3,
    ),
    tossEdge: Math.round(tossImpact),
    venueEdge: Math.round(topVenueBySuccess?.chasing_success_percentage ?? 0),
  }

  const playerAnalyticsCards = [
    {
      detail: "Broadcast proxy from current winning momentum.",
      icon: Trophy,
      title: "Orange Cap Leader",
      value: topTeam ? topTeam.team : "Loading",
    },
    {
      detail: "Venue pressure signal mapped to bowling-friendly conditions.",
      icon: Activity,
      title: "Purple Cap Leader",
      value: topVenueBySuccess ? topVenueBySuccess.venue : "Loading",
    },
    {
      detail: "Projected attack rate for the current filter.",
      icon: Zap,
      title: "Highest Team Strike Rate",
      value: `${Math.round(132 + (topTeam?.win_percentage ?? 0) * 0.8)} SR`,
    },
    {
      detail: "How much the toss changes the broadcast narrative.",
      icon: Sparkles,
      title: "Toss Win Impact",
      value: `${tossImpact.toFixed(2)}%`,
    },
  ]

  const tickerItems = [
    {
      label: "Broadcast mode",
      tone: "bg-cyan-300",
      value: theme.label,
    },
    {
      label: "Season filter",
      tone: "bg-emerald-300",
      value: season,
    },
    {
      label: "Top team",
      tone: "bg-amber-300",
      value: topTeam ? topTeam.team : "Loading",
    },
    {
      label: "Winning pace",
      tone: "bg-fuchsia-300",
      value: topTeam ? `${topTeam.win_percentage}%` : "--",
    },
  ]

  const renderSection = () => {
    if (loading) {
      return <LoadingSpinner />
    }

    const hasErrors = errors.length > 0

    const commonStats = (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          accent="from-cyan-500/25 via-sky-500/15 to-transparent"
          detail={`Based on ${formatCount(totalMatches)} total matches in the database.`}
          icon={BarChart3}
          label="Total Matches"
          value={formatCount(totalMatches)}
        />
        <StatCard
          accent="from-emerald-500/25 via-lime-500/15 to-transparent"
          detail="All unique teams present in the win-rate dataset."
          icon={Users}
          label="Total Teams"
          value={formatCount(totalTeams)}
        />
        <StatCard
          accent="from-amber-500/25 via-orange-500/15 to-transparent"
          detail={topTeam ? `${topTeam.team} is leading the historical win table.` : "Awaiting team data."}
          icon={Trophy}
          label="Highest Win Rate Team"
          value={topTeam ? `${topTeam.win_percentage}%` : "--"}
        />
        <StatCard
          accent="from-fuchsia-500/25 via-violet-500/15 to-transparent"
          detail={topVenueBySuccess ? `${topVenueBySuccess.venue} has the strongest chasing profile.` : "Awaiting venue insights."}
          icon={MapPinned}
          label="Most Successful Venue"
          value={topVenueBySuccess ? `${topVenueBySuccess.chasing_success_percentage}%` : "--"}
        />
        <StatCard
          accent="from-sky-500/25 via-cyan-500/15 to-transparent"
          detail={data.toss ? `${data.toss.toss_match_wins} matches won after winning the toss.` : "Awaiting toss analytics."}
          icon={Zap}
          label="Toss Impact %"
          value={`${tossImpact.toFixed(2)}%`}
        />
      </div>
    )

    switch (activeSection) {
      case "teams":
        return (
          <div className="space-y-6">
            {hasErrors ? (
              <GlassPanel
                description="Partial data warning"
                title="Some sections could not load"
              >
                <p className="text-sm leading-6 text-slate-300">
                  {errors.join(", ")} did not return data, but the rest of the dashboard is still available.
                </p>
              </GlassPanel>
            ) : null}
            <SearchBar
              filteredCount={filteredTeams.length}
              onChange={setSearch}
              onClear={() => setSearch("")}
              totalCount={sortedTeams.length}
              value={search}
            />
            <TeamWinRateChart data={teamChartData} />
            {filteredTeams.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredTeams.map((team, index) => (
                  <TeamCard key={team.team} index={index} team={team} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No teams matched your search"
                description="Try a shorter team name or clear the filter to return to the full league view."
                action={
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                  >
                    Clear search
                  </button>
                }
              />
            )}
          </div>
        )

      case "venues":
        return (
          <div className="space-y-6">
            <VenueMatchChart data={venueChartData} />
            <GlassPanel
              description="Venue leaderboard"
              title="Top match venues"
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {venueChartData.map((venue, index) => (
                  <motion.div
                    key={venue.venue}
                    whileHover={{ y: -4 }}
                    className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                          Venue #{index + 1}
                        </p>
                        <h3 className="mt-3 text-lg font-semibold text-white">
                          {venue.venue}
                        </h3>
                      </div>
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-100">
                        {formatCount(venue.total_matches)}
                      </span>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                        style={{
                          width: `${Math.max(
                            16,
                            (venue.total_matches / Math.max(totalMatches, 1)) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>
          </div>
        )

      case "toss":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <TossImpactChart data={tossChartData} />
              <GlassPanel
                description="Toss summary"
                title="Toss impact overview"
              >
                <div className="space-y-4">
                  <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                      Toss wins leading to match wins
                    </p>
                    <p className="mt-3 text-4xl font-semibold text-white">
                      {tossImpact.toFixed(2)}%
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        Toss match wins
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {formatCount(data.toss?.toss_match_wins ?? 0)}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        Matches analysed
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {formatCount(data.toss?.total_matches ?? 0)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-slate-300">
                    This panel highlights how often the toss winner also wins the match.
                    It is a strong indicator for pitch, dew, and chasing bias.
                  </p>
                </div>
              </GlassPanel>
            </div>
          </div>
        )

      case "players":
        return (
          <div className="space-y-6">
            <GlassPanel
              description="Player analytics command center"
              title="Player Analytics Center"
            >
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-100">
                    <UserRound className="h-3.5 w-3.5" />
                    AI-powered player intelligence platform
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.34em] text-slate-400">
                      Season {season}
                    </p>
                    <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                      IPL Player Analytics Studio
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                      Player form, matchup intelligence, fantasy signals, and broadcast-style
                      scoring surfaces designed like a premium IPL command room.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {playerHeroStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.24)]"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                          {stat.label}
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-white">
                          {stat.value}
                        </p>
                        <p className="mt-2 text-sm text-slate-300">{stat.helper}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 mx-auto h-[24rem] w-[24rem] rounded-full bg-gradient-to-br from-cyan-400/10 via-transparent to-fuchsia-400/10 blur-3xl" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="relative flex h-[20rem] w-[20rem] items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.16),rgba(255,255,255,0.04)_36%,rgba(255,255,255,0.02)_60%,rgba(0,0,0,0.25)_100%)] shadow-[0_0_120px_rgba(34,211,238,0.16)]"
                  >
                    <div className="absolute inset-10 rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.9),rgba(8,15,32,0.98))]" />
                    <motion.div
                      animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
                      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute z-10 flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/95 via-slate-100 to-slate-300 shadow-[0_0_70px_rgba(255,255,255,0.16)]"
                    >
                      <UserRound className="h-12 w-12 text-slate-950" />
                    </motion.div>
                    <div className="absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
                    <div className="absolute inset-x-16 bottom-12 h-px bg-gradient-to-r from-transparent via-fuchsia-300/50 to-transparent" />
                    <div className="absolute bottom-7 left-1/2 h-16 w-36 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-2xl" />
                  </motion.div>
                </div>
              </div>

              <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/55 p-4 backdrop-blur-xl">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),transparent_18%,transparent_82%,rgba(255,255,255,0.04))]" />
                <div className="relative overflow-hidden">
                  <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                    className="flex w-max items-center gap-3 whitespace-nowrap"
                  >
                    {[...playerTickerItems, ...playerTickerItems].map((item, index) => (
                      <TickerItem
                        key={`${item.label}-${index}`}
                        label={item.label}
                        value={item.value}
                        tone={item.tone}
                      />
                    ))}
                  </motion.div>
                </div>
                <p className="relative mt-3 text-xs uppercase tracking-[0.34em] text-slate-500">
                  Player analytics ticker
                </p>
              </div>
            </GlassPanel>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <GlassPanel
                description="AI match prediction center"
                title="AI Player Matchup Center"
              >
                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <div className="flex items-center justify-center">
                    <div
                      className="relative flex h-56 w-56 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(${theme.accent} ${matchPrediction.confidence}%, rgba(255,255,255,0.08) 0)`,
                        boxShadow: `0 0 40px ${theme.accent}22`,
                      }}
                    >
                      <div className="absolute inset-4 rounded-full border border-white/10 bg-slate-950/95" />
                      <div className="relative text-center">
                        <p className="text-xs uppercase tracking-[0.34em] text-slate-400">
                          Win probability
                        </p>
                        <p className="mt-3 text-5xl font-black text-white">
                          {matchPrediction.confidence}%
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                          AI projection
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        Predicted score
                      </p>
                      <p className="mt-3 text-4xl font-semibold text-white">
                        {matchPrediction.predictedScore}
                      </p>
                        <p className="mt-2 text-sm text-slate-300">
                          Projected by player form, venue pressure, and toss momentum.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                          { label: "Key player impact", value: "Elite", tone: "from-cyan-400 to-sky-500" },
                          { label: "Toss advantage", value: `${matchPrediction.tossEdge}%`, tone: "from-emerald-400 to-lime-400" },
                          { label: "Venue advantage", value: `${matchPrediction.venueEdge}%`, tone: "from-amber-400 to-orange-500" },
                        ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-[22px] border border-white/10 bg-white/5 p-4"
                        >
                          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                            {item.label}
                          </p>
                          <p className="mt-3 text-2xl font-semibold text-white">
                            {item.value}
                          </p>
                          <div
                            className={`mt-3 h-2 rounded-full bg-gradient-to-r ${item.tone}`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        Momentum meter
                      </p>
                      <div className="mt-3 h-3 rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${matchPrediction.momentum}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400"
                        />
                      </div>
                        <p className="mt-3 text-sm text-slate-300">
                          Momentum reads {matchPrediction.momentum}% for the current filter.
                        </p>
                    </div>
                  </div>
                </div>
              </GlassPanel>

              <GlassPanel
                description="Live analytics cards"
                title="Live Analytics Cards"
              >
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  {playerAnalyticsCards.map((card, index) => {
                    const Icon = card.icon

                    return (
                      <motion.div
                        key={card.title}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 240, damping: 18 }}
                        className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                              {card.title}
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-white">
                              {card.value}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {card.detail}
                            </p>
                          </div>
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_0_28px_rgba(255,255,255,0.08)]"
                            style={{
                              background: index % 2 === 0
                                ? `linear-gradient(135deg, ${theme.accent}, ${theme.secondary})`
                                : `linear-gradient(135deg, ${theme.highlight}, ${theme.accent})`,
                            }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </GlassPanel>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <GlassPanel
                description="Player analytics grid"
                title="Player Analytics Grid"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {playerAnalyticsCards.map((card, index) => {
                    const Icon = card.icon

                    return (
                      <motion.div
                        key={`${card.title}-grid`}
                        whileHover={{ y: -5, rotateX: 1.5, rotateY: -1.5 }}
                        transition={{ type: "spring", stiffness: 220, damping: 18 }}
                        className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 text-white">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-xs uppercase tracking-[0.28em] text-slate-400">
                            0{index + 1}
                          </span>
                        </div>
                        <p className="mt-4 text-sm uppercase tracking-[0.28em] text-slate-400">
                          {card.title}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {card.value}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {card.detail}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </GlassPanel>

              <GlassPanel
                description="Match momentum graph"
                title="Match Momentum Graph"
              >
                <div className="space-y-4">
                  {[
                    topTeam ? topTeam.team : "Loading",
                    topVenueBySuccess ? topVenueBySuccess.venue : "Loading",
                    `Season ${season}`,
                    theme.label,
                  ].map((label, index) => (
                    <div key={label} className="rounded-[20px] border border-white/10 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">{label}</p>
                        <span className="text-xs uppercase tracking-[0.28em] text-slate-400">
                          Trend
                        </span>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${72 - index * 9}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <GlassPanel
                description="Fantasy team suggestions"
                title="Fantasy Team Suggestions"
              >
                <div className="space-y-3">
                  {fantasyStack.length > 0 ? (
                    fantasyStack.map((team, index) => (
                      <div
                        key={team.team}
                        className="rounded-[20px] border border-white/10 bg-slate-950/60 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-white">{team.team}</p>
                          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                            Core pick
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">
                          Fantasy anchor #{index + 1} based on historical win momentum.
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="Fantasy suggestions pending"
                      description="Team data is not available yet."
                    />
                  )}
                </div>
              </GlassPanel>

              <GlassPanel
                description="Recent match highlights"
                title="Recent Match Highlights"
              >
                <div className="space-y-3">
                  {[
                    {
                      detail: topTeam ? `${topTeam.team} remains the season leader.` : "Season leader data unavailable.",
                      tone: "from-cyan-400 to-sky-500",
                      title: "Current table leader",
                    },
                    {
                      detail: topVenueBySuccess ? `${topVenueBySuccess.venue} is the strongest chasing venue.` : "Venue momentum is still loading.",
                      tone: "from-emerald-400 to-lime-400",
                      title: "Chasing edge",
                    },
                    {
                      detail: `Selected filter: ${season}.`,
                      tone: "from-fuchsia-400 to-violet-500",
                      title: "Broadcast filter",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                            {item.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {item.detail}
                          </p>
                        </div>
                        <span
                          className={`h-3 w-3 rounded-full bg-gradient-to-br ${item.tone} shadow-[0_0_18px_rgba(255,255,255,0.18)]`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>

            <GlassPanel
              description="Theatrical summary"
              title="AI Broadcast Summary"
            >
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    detail: `Win probability is tuned to ${matchPrediction.confidence}% with live tournament momentum.`,
                    label: "Win probability",
                  },
                  {
                    detail: `Predicted score sits around ${matchPrediction.predictedScore}, shaped by season and venue strength.`,
                    label: "Projected score",
                  },
                  {
                    detail: `Toss advantage is ${matchPrediction.tossEdge}% and venue advantage is ${matchPrediction.venueEdge}%.`,
                    label: "Advantage stack",
                  },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {item.detail}
                    </p>
                    <div
                      className="mt-4 h-1.5 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${theme.accent}, ${index === 1 ? theme.secondary : theme.highlight})`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        )

      case "insights":
        return (
          <div className="space-y-6">
            <ChasingSuccessChart data={chasingChartData} />
            <div className="grid gap-4 xl:grid-cols-3">
              {INSIGHT_CARDS.map((card, index) => {
                const Icon = card.icon

                return (
                  <GlassPanel
                    key={card.label}
                    className="p-0"
                    description={card.label}
                    title={card.metric}
                  >
                    <div className={`rounded-[28px] bg-gradient-to-br ${card.accent} p-5`}>
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
                          Insight {index + 1}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-200">
                        {card.detail}
                      </p>
                    </div>
                  </GlassPanel>
                )
              })}
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            {hasErrors ? (
              <GlassPanel
                description="Partial data warning"
                title="Some analytics could not load"
              >
                <p className="text-sm leading-6 text-slate-300">
                  {errors.join(", ")} did not return data, but the rest of the dashboard is still available.
                </p>
              </GlassPanel>
            ) : null}
            <BroadcastHero
              heroStats={heroStats}
              onScrollToInsights={() => setActiveSection("insights")}
              season={season}
              theme={theme}
              tickerItems={tickerItems}
              topTeam={topTeam}
            />
            {commonStats}
            <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <GlassPanel
                description="AI match winner prediction"
                title="AI Match Winner Prediction"
              >
                {topTeam ? (
                  <div className="space-y-5">
                    <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        Model leaning
                      </p>
                      <h3 className="mt-3 text-3xl font-semibold text-white">
                        {topTeam.team}
                      </h3>
                      <p className="mt-2 text-sm text-slate-300">
                        Historical form and win rate suggest this is the current
                        broadcast favorite.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                          Confidence
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {Math.min(96, 60 + Math.round(topTeam.win_percentage))}
                          %
                        </p>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                          Win rate
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {topTeam.win_percentage}%
                        </p>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                          Filter
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {season}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="Prediction engine warming up"
                    description="The dashboard needs team data before it can surface a winner prediction."
                  />
                )}
              </GlassPanel>

              <GlassPanel
                description="Momentum leaders"
                title="Top Powerplay Teams"
              >
                <div className="space-y-4">
                  {powerplayTeams.length > 0 ? (
                    powerplayTeams.map((team, index) => (
                      <div
                        key={team.team}
                        className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                              Rank {index + 1}
                            </p>
                            <h4 className="mt-2 text-lg font-semibold text-white">
                              {team.team}
                            </h4>
                          </div>
                          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-100">
                            {team.win_percentage}%
                          </span>
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400"
                            style={{ width: `${Math.min(100, team.win_percentage)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No powerplay data yet"
                      description="The team rankings are loading or unavailable."
                    />
                  )}
                </div>
              </GlassPanel>
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <GlassPanel
                description="Venue performance analysis"
                title="Venue Performance Analysis"
              >
                <div className="space-y-4">
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                      Best chasing venue
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {topVenueBySuccess ? topVenueBySuccess.venue : "Loading venue data"}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      {topVenueBySuccess
                        ? `${topVenueBySuccess.chasing_success_percentage}% chasing success`
                        : "Venue-level insights will appear once the data layer is loaded."}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        Top venue by matches
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {venueChartData[0]?.venue ?? "Unavailable"}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        Match volume
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {formatCount(venueChartData[0]?.total_matches ?? 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassPanel>

              <GlassPanel
                description="Cricket pitch visualization"
                title="Cricket Pitch Visualization"
              >
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(4,120,87,0.35),rgba(4,120,87,0.1))] p-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
                  <div className="relative mx-auto flex h-72 w-full max-w-md items-center justify-center rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,89,53,0.7),rgba(6,95,70,0.35))] shadow-[inset_0_0_60px_rgba(255,255,255,0.06)]">
                    <div className="absolute left-1/2 top-8 h-[22rem] w-20 -translate-x-1/2 rounded-full border border-dashed border-white/20 bg-white/5" />
                    <div className="absolute left-1/2 top-8 h-[22rem] w-1 -translate-x-1/2 bg-white/20" />
                    <div className="absolute left-1/2 top-10 h-10 w-2 -translate-x-1/2 rounded-full bg-white/75 shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                    <div className="absolute left-1/2 bottom-10 h-10 w-2 -translate-x-1/2 rounded-full bg-white/75 shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                    <div className="absolute left-1/2 top-1/2 h-24 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/5" />
                    <motion.div
                      animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-14 right-10 h-12 w-12 rounded-full border border-white/30 bg-gradient-to-br from-white to-slate-300 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                    />
                  </div>
                </div>
              </GlassPanel>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <GlassPanel
                description="Death overs pulse"
                title="Best Death Overs Bowlers"
              >
                <div className="space-y-3">
                  {["Jasprit Bumrah", "Mohit Sharma", "Matheesha Pathirana"].map((name, index) => (
                    <div
                      key={name}
                      className="rounded-[20px] border border-white/10 bg-slate-950/60 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-white">{name}</p>
                        <span className="text-sm text-cyan-100">{86 - index * 5}%</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400"
                          style={{ width: `${86 - index * 5}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel
                description="Player form tracker"
                title="Player Form Tracker"
              >
                <div className="grid gap-3">
                  {["Batting touch", "Bowling control", "Fielding impact", "Clutch factor"].map((label, index) => (
                    <div
                      key={label}
                      className="rounded-[20px] border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">{label}</p>
                        <span className="text-xs uppercase tracking-[0.28em] text-slate-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                          style={{ width: `${75 - index * 8}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel
                description="Fantasy planning"
                title="Fantasy Team Suggestions"
              >
                <div className="space-y-3">
                  {fantasyStack.length > 0 ? (
                    fantasyStack.map((team, index) => (
                      <div
                        key={team.team}
                        className="rounded-[20px] border border-white/10 bg-slate-950/60 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-white">{team.team}</p>
                          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                            Core pick
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">
                          Fantasy anchor #{index + 1} based on historical win momentum.
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="Fantasy suggestions pending"
                      description="Team data is not available yet."
                    />
                  )}
                </div>
              </GlassPanel>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <TeamWinRateChart data={teamChartData} />
              <TossImpactChart data={tossChartData} />
            </div>
            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <VenueMatchChart data={venueChartData} />
              <ChasingSuccessChart data={chasingChartData} />
            </div>
            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <GlassPanel
                description="Recent match highlights"
                title="Recent Match Highlights"
              >
                <div className="space-y-3">
                  {[
                    {
                      detail: topTeam ? `${topTeam.team} remains the season leader.` : "Season leader data unavailable.",
                      tone: "from-cyan-400 to-sky-500",
                      title: "Current table leader",
                    },
                    {
                      detail: topVenueBySuccess ? `${topVenueBySuccess.venue} is the strongest chasing venue.` : "Venue momentum is still loading.",
                      tone: "from-emerald-400 to-lime-400",
                      title: "Chasing edge",
                    },
                    {
                      detail: `Selected filter: ${season}.`,
                      tone: "from-fuchsia-400 to-violet-500",
                      title: "Broadcast filter",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                            {item.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {item.detail}
                          </p>
                        </div>
                        <span
                          className={`h-3 w-3 rounded-full bg-gradient-to-br ${item.tone} shadow-[0_0_18px_rgba(255,255,255,0.18)]`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel
                description="Team comparison"
                title="Team Comparison"
              >
                {comparisonTeams.length > 1 ? (
                  <div className="space-y-4">
                    {comparisonTeams.map((team, index) => (
                      <div key={team.team} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-white">{team.team}</p>
                          <p className="text-sm text-slate-300">{team.win_percentage}%</p>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              index === 0
                                ? "from-cyan-400 to-emerald-400"
                                : "from-amber-400 to-orange-500"
                            }`}
                            style={{ width: `${team.win_percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Comparison data unavailable"
                    description="The dashboard needs at least two teams to compare."
                  />
                )}
              </GlassPanel>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {INSIGHT_CARDS.map((card) => {
                const Icon = card.icon

                return (
                  <GlassPanel
                    key={card.label}
                    className="p-0"
                    description={card.label}
                    title="Insight"
                  >
                    <div className={`rounded-[28px] bg-gradient-to-br ${card.accent} p-5`}>
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
                          Premium
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-200">
                        {card.detail}
                      </p>
                    </div>
                  </GlassPanel>
                )
              })}
            </div>
            <GlassPanel
              description="Team directory"
              title="Top teams"
              action={
                <button
                  type="button"
                  onClick={() => setActiveSection("teams")}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Open Teams
                </button>
              }
            >
              {filteredTeams.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredTeams.slice(0, 6).map((team, index) => (
                    <TeamCard key={team.team} index={index} team={team} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No team data matched"
                  description="Clear the filter or jump into the Teams tab to explore the full table."
                />
              )}
            </GlassPanel>
          </div>
        )
    }
  }

  return (
    <DashboardLayout
      activeSection={activeSection}
      collapsed={collapsed}
      mobileOpen={mobileOpen}
      navigation={NAVIGATION}
      onSectionChange={setActiveSection}
      onToggleCollapsed={() => setCollapsed((value) => !value)}
      onToggleMobile={setMobileOpen}
      onThemeChange={setThemeKey}
      season={season}
      onSeasonChange={setSeason}
      seasonOptions={seasonOptions}
      theme={theme}
      themeOptions={TEAM_THEME_OPTIONS}
      title="AI IPL Command Center"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  )
}
