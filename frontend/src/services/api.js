import axios from "axios"

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://ipl-backend.onrender.com"

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

const toArray = (value) => (Array.isArray(value) ? value : [])

function seasonParams(season) {
  if (!season || season === "All Seasons") {
    return undefined
  }

  return { season }
}

function teamParams(team) {
  if (!team) {
    return undefined
  }

  return { team }
}

export async function fetchSeasons() {
  const response = await api.get("/seasons")
  const seasons = toArray(response.data)

  return seasons.length > 0 ? seasons : ["All Seasons"]
}

export async function fetchDashboardData({ season, team } = {}) {
  const params = {
    ...(seasonParams(season) ?? {}),
    ...(teamParams(team) ?? {}),
  }

  const results = await Promise.allSettled([
    api.get("/team-win-rates", { params }),
    api.get("/toss-impact", { params }),
    api.get("/venues", { params }),
    api.get("/chasing-analysis", { params }),
  ])

  const errors = []

  const teams =
    results[0].status === "fulfilled" ? toArray(results[0].value.data) : []

  if (results[0].status !== "fulfilled") {
    errors.push("team win rates")
  }

  const toss =
    results[1].status === "fulfilled"
      ? results[1].value.data ?? null
      : null

  if (results[1].status !== "fulfilled") {
    errors.push("toss impact")
  }

  const venues =
    results[2].status === "fulfilled" ? toArray(results[2].value.data) : []

  if (results[2].status !== "fulfilled") {
    errors.push("venues")
  }

  const chasing =
    results[3].status === "fulfilled" ? toArray(results[3].value.data) : []

  if (results[3].status !== "fulfilled") {
    errors.push("chasing analysis")
  }

  return {
    chasing,
    errors,
    teams,
    toss,
    venues,
  }
}
