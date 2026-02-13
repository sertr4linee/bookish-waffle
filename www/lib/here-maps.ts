const HERE_API_KEY = process.env.HERE_API_KEY;

interface GeocodingResult {
  lat: number;
  lng: number;
  address: string;
}

export async function geocode(query: string): Promise<GeocodingResult | null> {
  const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(query)}&apiKey=${HERE_API_KEY}&lang=fr`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;

  return {
    lat: item.position.lat,
    lng: item.position.lng,
    address: item.address.label,
  };
}

export async function autocomplete(query: string): Promise<Array<{ id: string; label: string }>> {
  const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?q=${encodeURIComponent(query)}&at=48.8566,2.3522&apiKey=${HERE_API_KEY}&lang=fr&limit=5`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const data = await res.json();
  return (data.items ?? [])
    .filter((item: { resultType: string }) => item.resultType === "locality" || item.resultType === "street" || item.resultType === "houseNumber")
    .map((item: { id: string; address: { label: string } }) => ({
      id: item.id,
      label: item.address.label,
    }));
}

// Haversine distance in km
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number) {
  return deg * (Math.PI / 180);
}
