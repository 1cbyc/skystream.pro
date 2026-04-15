const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_BASE_URL = "https://api.nasa.gov";
const EONET_BASE_URL = "https://eonet.gsfc.nasa.gov/api/v3";
const NASA_IMAGES_BASE_URL = "https://images-api.nasa.gov";
const EXOPLANET_BASE_URL =
  "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";

type JsonRecord = Record<string, unknown>;

export type DashboardPayload = {
  apod: Awaited<ReturnType<typeof fetchApod>> | null;
  asteroidCount: number;
  marsPhotoCount: number;
  epicFrames: number;
  solarAlerts: number;
  activeEvents: number;
  exoplanetCount: number;
  libraryHighlights: Awaited<ReturnType<typeof searchNasaLibrary>>["items"];
};

function buildNasaUrl(
  path: string,
  params: Record<string, string | number | undefined> = {},
) {
  const url = new URL(path, NASA_BASE_URL);
  url.searchParams.set("api_key", NASA_API_KEY);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function requestJson<T>(url: string, cacheSeconds = 1800): Promise<T> {
  const response = await fetch(url, {
    next: { revalidate: cacheSeconds },
    signal: AbortSignal.timeout(12000),
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `NASA request failed (${response.status} ${response.statusText})`,
    );
  }

  return (await response.json()) as T;
}

function getArray<T = JsonRecord>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeDate(value?: string) {
  return value ? value.slice(0, 10) : undefined;
}

function mapApod(raw: JsonRecord, fallbackDate?: string) {
  return {
    date: String(raw.date || fallbackDate || ""),
    title: String(raw.title || "Astronomy Picture of the Day"),
    explanation: String(raw.explanation || ""),
    imageUrl: String(raw.hdurl || raw.url || ""),
    mediaType: String(raw.media_type || "image"),
    copyright: raw.copyright ? String(raw.copyright) : null,
  };
}

export async function fetchApod(date?: string) {
  try {
    const raw = await requestJson<JsonRecord>(
      buildNasaUrl("/planetary/apod", { date }),
      60 * 60,
    );

    return mapApod(raw, date);
  } catch (error) {
    if (!date) {
      for (let offset = 1; offset <= 7; offset += 1) {
        const fallbackDate = new Date();
        fallbackDate.setDate(fallbackDate.getDate() - offset);
        const isoDate = normalizeDate(fallbackDate.toISOString());

        try {
          const raw = await requestJson<JsonRecord>(
            buildNasaUrl("/planetary/apod", { date: isoDate }),
            60 * 60,
          );
          return mapApod(raw, isoDate);
        } catch {
          continue;
        }
      }
    }

    throw error;
  }
}

export async function fetchNeoFeed(startDate: string, endDate: string) {
  const raw = await requestJson<JsonRecord>(
    buildNasaUrl("/neo/rest/v1/feed", {
      start_date: startDate,
      end_date: endDate,
    }),
    60 * 30,
  );

  const nearEarthObjects = raw.near_earth_objects as
    | Record<string, JsonRecord[]>
    | undefined;
  const flattened = Object.values(nearEarthObjects || {})
    .flat()
    .map((item) => {
      const approach = getArray<JsonRecord>(item.close_approach_data)[0] || {};
      const diameter = (item.estimated_diameter as JsonRecord)?.kilometers as
        | JsonRecord
        | undefined;
      const missDistance = (approach.miss_distance as JsonRecord) || {};
      const velocity = (approach.relative_velocity as JsonRecord) || {};

      return {
        id: String(item.id || item.neo_reference_id || ""),
        name: String(item.name || "Unnamed object"),
        hazardous: Boolean(item.is_potentially_hazardous_asteroid),
        date: String(approach.close_approach_date || startDate),
        missDistanceKm: Number(missDistance.kilometers || 0),
        velocityKph: Number(velocity.kilometers_per_hour || 0),
        diameterMinMeters: Number(
          Number(diameter?.estimated_diameter_min || 0) * 1000,
        ),
        diameterMaxMeters: Number(
          Number(diameter?.estimated_diameter_max || 0) * 1000,
        ),
        nasaJplUrl: item.nasa_jpl_url ? String(item.nasa_jpl_url) : null,
      };
    })
    .sort((left, right) => left.missDistanceKm - right.missDistanceKm);

  return {
    count: flattened.length,
    items: flattened,
  };
}

export async function fetchMarsManifest(rover = "curiosity") {
  const raw = await requestJson<JsonRecord>(
    buildNasaUrl(`/mars-photos/api/v1/manifests/${rover}`),
    60 * 60 * 24,
  );
  const manifest = (raw.photo_manifest as JsonRecord) || {};

  return {
    rover: String(manifest.name || rover),
    status: String(manifest.status || "unknown"),
    maxSol: Number(manifest.max_sol || 0),
    launchDate: String(manifest.launch_date || ""),
    landingDate: String(manifest.landing_date || ""),
    totalPhotos: Number(manifest.total_photos || 0),
  };
}

export async function fetchMarsPhotos(options?: {
  rover?: string;
  sol?: number;
  page?: number;
  camera?: string;
}) {
  const rover = options?.rover || "curiosity";
  try {
    const manifest = await fetchMarsManifest(rover);
    const sol = options?.sol ?? manifest.maxSol;
    const page = options?.page ?? 1;

    const raw = await requestJson<JsonRecord>(
      buildNasaUrl(`/mars-photos/api/v1/rovers/${rover}/photos`, {
        sol,
        page,
        camera: options?.camera,
      }),
      60 * 60 * 24,
    );

    const photos = getArray<JsonRecord>(raw.photos).map((photo) => ({
      id: String(photo.id || ""),
      rover: String((photo.rover as JsonRecord)?.name || rover),
      camera: String((photo.camera as JsonRecord)?.full_name || ""),
      imageUrl: String(photo.img_src || ""),
      earthDate: String(photo.earth_date || ""),
      sol: Number(photo.sol || sol),
    }));

    return {
      rover,
      manifest,
      photos,
    };
  } catch {
    const library = await searchNasaLibrary({
      query: `${rover} mars rover`,
      mediaType: "image",
      page: options?.page ?? 1,
    });

    return {
      rover,
      manifest: {
        rover,
        status: "archive",
        maxSol: 0,
        launchDate: "",
        landingDate: "",
        totalPhotos: library.totalHits,
      },
      photos: library.items.slice(0, 12).map((item, index) => ({
        id: item.nasaId || `${rover}-${index}`,
        rover,
        camera: item.center || "NASA archive",
        imageUrl: item.previewUrl || "",
        earthDate: item.dateCreated,
        sol: 0,
      })),
    };
  }
}

function buildEpicImageUrl(image: string, date: string) {
  const [day] = date.split(" ");
  const [year, month, datePart] = day.split("-");
  return `${NASA_BASE_URL}/EPIC/archive/natural/${year}/${month}/${datePart}/jpg/${image}.jpg?api_key=${NASA_API_KEY}`;
}

export async function fetchEpic(limit = 8) {
  const raw = await requestJson<JsonRecord[]>(
    buildNasaUrl("/EPIC/api/natural"),
    60 * 60,
  );

  return raw.slice(0, limit).map((frame) => ({
    id: String(frame.identifier || ""),
    caption: String(frame.caption || "Earth from DSCOVR"),
    imageUrl: buildEpicImageUrl(
      String(frame.image || ""),
      String(frame.date || ""),
    ),
    date: String(frame.date || ""),
    centroid: frame.centroid_coordinates as JsonRecord | undefined,
  }));
}

export async function fetchEarthAssets(options?: {
  lat?: number;
  lon?: number;
  date?: string;
  dim?: number;
}) {
  const lat = options?.lat ?? 6.5244;
  const lon = options?.lon ?? 3.3792;
  const date = options?.date || normalizeDate(new Date().toISOString());
  const dim = options?.dim ?? 0.15;

  const raw = await requestJson<JsonRecord>(
    buildNasaUrl("/planetary/earth/assets", { lat, lon, date, dim }),
    60 * 60 * 6,
  );

  return {
    lat,
    lon,
    date: String(raw.date || date || ""),
    id: raw.id ? String(raw.id) : null,
    resource: raw.resource as JsonRecord | undefined,
    url: raw.url ? String(raw.url) : null,
  };
}

export async function fetchEonet(options?: {
  status?: "open" | "closed" | "all";
  limit?: number;
  start?: string;
  end?: string;
}) {
  const url = new URL("/events", EONET_BASE_URL);
  url.searchParams.set("status", options?.status || "open");
  url.searchParams.set("limit", String(options?.limit || 12));

  if (options?.start) {
    url.searchParams.set("start", options.start);
  }

  if (options?.end) {
    url.searchParams.set("end", options.end);
  }

  const raw = await requestJson<JsonRecord>(url.toString(), 60 * 15);
  const events = getArray<JsonRecord>(raw.events).map((event) => ({
    id: String(event.id || ""),
    title: String(event.title || "Untitled event"),
    categories: getArray<JsonRecord>(event.categories).map((category) =>
      String(category.title || "Event"),
    ),
    sources: getArray<JsonRecord>(event.sources).map((source) => ({
      id: String(source.id || ""),
      url: String(source.url || ""),
    })),
    geometry: getArray<JsonRecord>(event.geometry),
  }));

  return {
    title: String(raw.title || "EONET"),
    description: String(raw.description || ""),
    count: events.length,
    events,
  };
}

export async function fetchDonkiDigest(days = 14) {
  const endDate = normalizeDate(new Date().toISOString())!;
  const start = new Date();
  start.setDate(start.getDate() - days);
  const startDate = normalizeDate(start.toISOString())!;

  const [cmes, flares, storms] = await Promise.allSettled([
    requestJson<JsonRecord[]>(
      buildNasaUrl("/DONKI/CME", { startDate, endDate }),
      60 * 20,
    ),
    requestJson<JsonRecord[]>(
      buildNasaUrl("/DONKI/FLR", { startDate, endDate }),
      60 * 20,
    ),
    requestJson<JsonRecord[]>(
      buildNasaUrl("/DONKI/GST", { startDate, endDate }),
      60 * 20,
    ),
  ]);

  const getResult = (result: PromiseSettledResult<JsonRecord[]>) =>
    result.status === "fulfilled" ? result.value : [];

  return {
    windowStart: startDate,
    windowEnd: endDate,
    cmes: getResult(cmes).slice(0, 8),
    flares: getResult(flares).slice(0, 8),
    storms: getResult(storms).slice(0, 8),
  };
}

export async function searchNasaLibrary(options?: {
  query?: string;
  mediaType?: "image" | "video" | "audio";
  page?: number;
}) {
  const url = new URL("/search", NASA_IMAGES_BASE_URL);
  url.searchParams.set("q", options?.query || "galaxy");
  url.searchParams.set("page", String(options?.page || 1));
  url.searchParams.set("media_type", options?.mediaType || "image");

  const raw = await requestJson<JsonRecord>(url.toString(), 60 * 60);
  const collection = (raw.collection as JsonRecord) || {};
  const items = getArray<JsonRecord>(collection.items).map((item) => {
    const data = getArray<JsonRecord>(item.data)[0] || {};
    const links = getArray<JsonRecord>(item.links);
    const preview = links.find((link) => link.render === "image") || links[0];

    return {
      nasaId: String(data.nasa_id || ""),
      title: String(data.title || "Untitled asset"),
      description: String(data.description || ""),
      mediaType: String(data.media_type || options?.mediaType || "image"),
      previewUrl: preview?.href ? String(preview.href) : null,
      dateCreated: String(data.date_created || ""),
      center: data.center ? String(data.center) : null,
    };
  });

  return {
    totalHits: Number(collection.metadata && (collection.metadata as JsonRecord).total_hits) || items.length,
    items,
  };
}

export async function fetchExoplanets(limit = 18) {
  const query = `
    select top ${limit} pl_name, hostname, discoverymethod, disc_year, disc_facility, sy_dist, pl_rade, pl_bmasse, pl_orbper
    from pscomppars
    where disc_year is not null
    order by disc_year desc
  `;

  const url = new URL(EXOPLANET_BASE_URL);
  url.searchParams.set("query", query.replace(/\s+/g, " ").trim());
  url.searchParams.set("format", "json");

  const raw = await requestJson<JsonRecord[]>(url.toString(), 60 * 60 * 12);

  return raw.map((planet) => ({
    name: String(planet.pl_name || "Unknown planet"),
    host: String(planet.hostname || "Unknown host"),
    method: String(planet.discoverymethod || "Unknown"),
    year: Number(planet.disc_year || 0),
    facility: String(planet.disc_facility || "Unknown facility"),
    distanceParsecs: Number(planet.sy_dist || 0),
    radiusEarths: Number(planet.pl_rade || 0),
    massEarths: Number(planet.pl_bmasse || 0),
    orbitalPeriodDays: Number(planet.pl_orbper || 0),
  }));
}

export async function buildCapsule(date: string) {
  const [apod, neos, events, earth] = await Promise.allSettled([
    fetchApod(date),
    fetchNeoFeed(date, date),
    fetchEonet({
      status: "all",
      limit: 6,
      start: `${date}T00:00:00Z`,
      end: `${date}T23:59:59Z`,
    }),
    fetchEarthAssets({ date }),
  ]);

  return {
    date,
    apod: apod.status === "fulfilled" ? apod.value : null,
    asteroidCount: neos.status === "fulfilled" ? neos.value.count : 0,
    notableApproaches:
      neos.status === "fulfilled" ? neos.value.items.slice(0, 3) : [],
    events:
      events.status === "fulfilled" ? events.value.events.slice(0, 3) : [],
    earth: earth.status === "fulfilled" ? earth.value : null,
  };
}

export async function buildDashboard(): Promise<DashboardPayload> {
  const [apod, neos, mars, epic, weather, events, exoplanets, library] =
    await Promise.allSettled([
      fetchApod(),
      fetchNeoFeed(normalizeDate(new Date().toISOString())!, normalizeDate(new Date().toISOString())!),
      fetchMarsPhotos({ rover: "curiosity", page: 1 }),
      fetchEpic(4),
      fetchDonkiDigest(10),
      fetchEonet({ limit: 8 }),
      fetchExoplanets(8),
      searchNasaLibrary({ query: "nebula", mediaType: "image", page: 1 }),
    ]);

  return {
    apod: apod.status === "fulfilled" ? apod.value : null,
    asteroidCount: neos.status === "fulfilled" ? neos.value.count : 0,
    marsPhotoCount: mars.status === "fulfilled" ? mars.value.photos.length : 0,
    epicFrames: epic.status === "fulfilled" ? epic.value.length : 0,
    solarAlerts:
      weather.status === "fulfilled"
        ? weather.value.cmes.length +
          weather.value.flares.length +
          weather.value.storms.length
        : 0,
    activeEvents: events.status === "fulfilled" ? events.value.count : 0,
    exoplanetCount: exoplanets.status === "fulfilled" ? exoplanets.value.length : 0,
    libraryHighlights:
      library.status === "fulfilled" ? library.value.items.slice(0, 3) : [],
  };
}
