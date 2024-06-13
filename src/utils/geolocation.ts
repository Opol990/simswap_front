import axios from 'axios';

const geoapifyApiKey = "7c4d3cacd6244d6b8da9038d618ea384";

interface GeoapifyFeature {
  properties: {
    formatted: string;
    lat: number;
    lon: number;
  };
}

export const getGeolocation = async (query: string): Promise<GeoapifyFeature[]> => {
  try {
    const response = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete`, {
      params: {
        apiKey: geoapifyApiKey,
        text: query,
        limit: 5
      }
    });
    return response.data.features;
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return [];
  }
};

export const getDistance = async (direccion1: string, direccion2: string) => {
  try {
    const geo1 = await getGeolocation(direccion1);
    const geo2 = await getGeolocation(direccion2);

    if (geo1.length === 0 || geo2.length === 0) {
      throw new Error('No se pudo encontrar la ubicación');
    }

    const lat1 = geo1[0].properties.lat;
    const lon1 = geo1[0].properties.lon;
    const lat2 = geo2[0].properties.lat;
    const lon2 = geo2[0].properties.lon;

    const response = await axios.get(`https://api.geoapify.com/v1/routing`, {
      params: {
        apiKey: geoapifyApiKey,
        waypoints: `${lat1},${lon1}|${lat2},${lon2}`,
        mode: 'drive'
      }
    });

    return response.data.features[0].properties.distance;
  } catch (error) {
    console.error('Error fetching distance:', error);
    return null;
  }
};
