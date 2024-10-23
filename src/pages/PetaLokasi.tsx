  import { createSignal, onCleanup, onMount } from 'solid-js';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import './PetaLokasi.module.css';  // Import CSS untuk styling

  const mapStyles = {
    width: '95vw',
    height: '60vh',
  };

  // Data provinsi, kabupaten, dan kecamatan
  const provinsiCoordinates = [
    // Pulau Jawa
    {
      name: 'Jakarta',
      lat: -6.208763,
      lng: 106.845599,
      kabupaten: [
        {
          name: 'Jakarta Pusat',
          lat: -6.182617,
          lng: 106.835227,
          kecamatan: [
            { name: 'Gambir', lat: -6.17511, lng: 106.82714 },
            { name: 'Tanah Abang', lat: -6.18393, lng: 106.81435 }
          ]
        },
        {
          name: 'Jakarta Utara',
          lat: -6.121435,
          lng: 106.774124,
          kecamatan: [
            { name: 'Penjaringan', lat: -6.12555, lng: 106.79488 },
            { name: 'Pademangan', lat: -6.12748, lng: 106.83159 }
          ]
        }
      ]
    },
    {
      name: 'Jawa Barat',
      lat: -6.982709,
      lng: 107.667373,
      kabupaten: [
        {
          name: 'Bandung',
          lat: -6.914744,
          lng: 107.60981,
          kecamatan: [
            { name: 'Cicendo', lat: -6.91497, lng: 107.59529 },
            { name: 'Andir', lat: -6.91328, lng: 107.59885 }
          ]
        },
        {
          name: 'Bogor',
          lat: -6.597147,
          lng: 106.806039,
          kecamatan: [
            { name: 'Bogor Barat', lat: -6.57167, lng: 106.79444 },
            { name: 'Bogor Tengah', lat: -6.59666, lng: 106.79555 }
          ]
        }
      ]
    },
    {
      name: 'Jawa Tengah',
      lat: -7.150975,
      lng: 110.140259,
      kabupaten: [
        {
          name: 'Semarang',
          lat: -6.966667,
          lng: 110.416664,
          kecamatan: [
            { name: 'Semarang Tengah', lat: -6.9932, lng: 110.4185 },
            { name: 'Semarang Selatan', lat: -7.033, lng: 110.4095 }
          ]
        },
        {
          name: 'Solo',
          lat: -7.56662,
          lng: 110.829996,
          kecamatan: [
            { name: 'Banjarsari', lat: -7.55234, lng: 110.81145 },
            { name: 'Laweyan', lat: -7.55285, lng: 110.81367 }
          ]
        }
      ]
    },
    {
      name: 'Jawa Timur',
      lat: -7.536064,
      lng: 112.238402,
      kabupaten: [
        {
          name: 'Surabaya',
          lat: -7.257472,
          lng: 112.752088,
          kecamatan: [
            { name: 'Tegalsari', lat: -7.26141, lng: 112.73735 },
            { name: 'Wonokromo', lat: -7.293, lng: 112.730 }
          ]
        },
        {
          name: 'Malang',
          lat: -7.96662,
          lng: 112.632632,
          kecamatan: [
            { name: 'Klojen', lat: -7.9738, lng: 112.6184 },
            { name: 'Blimbing', lat: -7.9334, lng: 112.637 }
          ]
        }
      ]
    },
    
    // Pulau Kalimantan
    {
      name: 'Kalimantan Barat',
      lat: -0.315834,
      lng: 109.348805,
      kabupaten: [
        {
          name: 'Pontianak',
          lat: -0.02633,
          lng: 109.342503,
          kecamatan: [
            { name: 'Pontianak Utara', lat: -0.01247, lng: 109.33329 },
            { name: 'Pontianak Selatan', lat: -0.05398, lng: 109.36571 }
          ]
        }
      ]
    },
    {
      name: 'Kalimantan Timur',
      lat: 0.573325,
      lng: 117.129814,
      kabupaten: [
        {
          name: 'Samarinda',
          lat: -0.50218,
          lng: 117.153709,
          kecamatan: [
            { name: 'Samarinda Seberang', lat: -0.50462, lng: 117.11942 },
            { name: 'Sungai Kunjang', lat: -0.48253, lng: 117.12853 }
          ]
        }
      ]
    },
    {
      name: 'Kalimantan Selatan',
      lat: -3.09264,
      lng: 114.65356,
      kabupaten: [
        {
          name: 'Banjarmasin',
          lat: -3.324722,
          lng: 114.592645,
          kecamatan: [
            { name: 'Banjarmasin Utara', lat: -3.31237, lng: 114.59083 },
            { name: 'Banjarmasin Selatan', lat: -3.35873, lng: 114.59549 }
          ]
        }
      ]
    },
    
    // Pulau Sumatra
    {
      name: 'Sumatra Utara',
      lat: 3.597031,
      lng: 98.678513,
      kabupaten: [
        {
          name: 'Medan',
          lat: 3.595195,
          lng: 98.672223,
          kecamatan: [
            { name: 'Medan Kota', lat: 3.5910, lng: 98.6765 },
            { name: 'Medan Polonia', lat: 3.5761, lng: 98.6594 }
          ]
        }
      ]
    },
    {
      name: 'Sumatra Selatan',
      lat: -3.319437,
      lng: 104.914542,
      kabupaten: [
        {
          name: 'Palembang',
          lat: -2.990934,
          lng: 104.756554,
          kecamatan: [
            { name: 'Ilir Timur', lat: -2.9785, lng: 104.7713 },
            { name: 'Seberang Ulu', lat: -3.0060, lng: 104.7557 }
          ]
        }
      ]
    },
    {
      name: 'Aceh',
      lat: 5.548290,
      lng: 95.323753,
      kabupaten: [
        {
          name: 'Banda Aceh',
          lat: 5.5483,
          lng: 95.3238,
          kecamatan: [
            { name: 'Baiturrahman', lat: 5.5615, lng: 95.3345 },
            { name: 'Kuta Alam', lat: 5.5541, lng: 95.3174 }
          ]
        }
      ]
    }
  ];

  const fetchTotalPenduduk = async (provinsiName: string) => {
    try {
      const response = await fetch(`/users/DataPenduduk/${provinsiName}`);
      const data = await response.json();
      return data[`Total Penduduk ${provinsiName}`] || 'Data tidak tersedia';
    } catch (error) {
      console.error('Error fetching total penduduk:', error);
      return 'Error fetching data';
    }
  };

  const handleSearch = async (e: Event, map, zoomToLocation, kabupatenLayers, kecamatanLayers, searchMarker) => {
    e.preventDefault();
    const searchValue = (e.target as HTMLFormElement).search.value.trim().toLowerCase();

    let foundLocation = false;
    for (const provinsi of provinsiCoordinates) {
      if (provinsi.name.toLowerCase().includes(searchValue)) {
        const totalPenduduk = await fetchTotalPenduduk(provinsi.name);
        zoomToLocation([provinsi.lat, provinsi.lng], 10);  // Zoom ke provinsi
        kabupatenLayers(provinsi);  // Tampilkan marker kabupaten di provinsi ini
        searchMarker([provinsi.lat, provinsi.lng], `
          <b>${provinsi.name}</b><br>
          Latitude: ${provinsi.lat}<br>
          Longitude: ${provinsi.lng}<br>
          Total Penduduk: ${totalPenduduk}
        `);
        foundLocation = true;
        break;
      }
      for (const kabupaten of provinsi.kabupaten) {
        if (kabupaten.name.toLowerCase().includes(searchValue)) {
          zoomToLocation([kabupaten.lat, kabupaten.lng], 12);  // Zoom ke kabupaten
          kecamatanLayers(kabupaten);  // Tampilkan marker kecamatan di kabupaten ini
          searchMarker([kabupaten.lat, kabupaten.lng], `
            <b>${kabupaten.name}</b><br>
            Latitude: ${kabupaten.lat}<br>
            Longitude: ${kabupaten.lng}
          `);
          foundLocation = true;
          break;
        }
        for (const kecamatan of kabupaten.kecamatan) {
          if (kecamatan.name.toLowerCase().includes(searchValue)) {
            zoomToLocation([kecamatan.lat, kecamatan.lng], 14);  // Zoom ke kecamatan
            searchMarker([kecamatan.lat, kecamatan.lng], `
              <b>${kecamatan.name}</b><br>
              Latitude: ${kecamatan.lat}<br>
              Longitude: ${kecamatan.lng}
            `);
            foundLocation = true;
            break;
          }
        }
        if (foundLocation) break;
      }
      if (foundLocation) break;
    }

    if (!foundLocation) {
      alert('Lokasi tidak ditemukan');
    }
  };

  export default function PetaLokasi() {
    let map: L.Map;
    let provinsiGroup = L.layerGroup();
    let kabupatenGroup = L.layerGroup();
    let kecamatanGroup = L.layerGroup();
    let currentSearchMarker: L.Marker | null = null;  // Marker untuk hasil pencarian

    const clearMarkers = () => {
      kabupatenGroup.clearLayers();
      kecamatanGroup.clearLayers();
    };

    const zoomToLocation = (coords: [number, number], zoomLevel: number) => {
      map.setView(coords, zoomLevel);
    };

    const kabupatenLayers = async (provinsi: any) => {
      clearMarkers();
      provinsi.kabupaten.forEach((kabupaten: any) => {
        const marker = L.marker([kabupaten.lat, kabupaten.lng])
          .bindPopup(`
            <b>${kabupaten.name}</b><br>${provinsi.name}<br>
            Latitude: ${kabupaten.lat}<br>
            Longitude: ${kabupaten.lng}
          `)
          .on('click', async () => {
            const totalPenduduk = await fetchTotalPenduduk(provinsi.name);
            marker.setPopupContent(`
              <b>${kabupaten.name}</b><br>${provinsi.name}<br>
              Latitude: ${kabupaten.lat}<br>
              Longitude: ${kabupaten.lng}<br>
              Total Penduduk: ${totalPenduduk}
            `);
            marker.openPopup();  // Tampilkan popup pada klik
          })
          .on('dblclick', () => {
            zoomToLocation([kabupaten.lat, kabupaten.lng], 12);
            kecamatanLayers(kabupaten);  // Tampilkan marker kecamatan di kabupaten ini
          });
        kabupatenGroup.addLayer(marker);
      });
      kabupatenGroup.addTo(map);
    };

    const kecamatanLayers = (kabupaten: any) => {
      clearMarkers();
      kabupaten.kecamatan.forEach((kecamatan: any) => {
        const marker = L.marker([kecamatan.lat, kecamatan.lng])
          .bindPopup(`
            <b>${kecamatan.name}</b><br>${kabupaten.name}<br>
            Latitude: ${kecamatan.lat}<br>
            Longitude: ${kecamatan.lng}
          `)
          .on('click', () => {
            marker.openPopup();  // Tampilkan popup pada klik
          })
          .on('dblclick', () => {
            zoomToLocation([kecamatan.lat, kecamatan.lng], 14);
          });
        kecamatanGroup.addLayer(marker);
      });
      kecamatanGroup.addTo(map);
    };

    const searchMarker = (coords: [number, number], popupContent: string) => {
      if (currentSearchMarker) {
        map.removeLayer(currentSearchMarker);
      }

      currentSearchMarker = L.marker(coords)
        .bindPopup(popupContent)
        .on('click', () => {
          currentSearchMarker?.openPopup();  // Tampilkan popup pada klik
        });
      currentSearchMarker.addTo(map);
      currentSearchMarker.openPopup();  // Buka popup secara otomatis setelah pencarian
    };

    onMount(() => {
      const apiKey = 'ErHN1_E8Bd3nhwY2dCPNyCWfXx6Cd2VBWcNo5vjiw8w';  // API Key dari HERE Maps
      map = L.map('map').setView([-2.548926, 118.0148634], 5);

      L.tileLayer(`https://{s}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey=${apiKey}`, {
        attribution: '&copy; <a href="https://legal.here.com/en-gb/privacy">HERE</a> contributors',
        subdomains: '1234'
      }).addTo(map);

      (async () => {
        for (const provinsi of provinsiCoordinates) {
          const totalPenduduk = await fetchTotalPenduduk(provinsi.name);

          const marker = L.marker([provinsi.lat, provinsi.lng])
            .bindPopup(`
              <b>${provinsi.name}</b><br>
              Latitude: ${provinsi.lat}<br>
              Longitude: ${provinsi.lng}<br>
              Total Penduduk: ${totalPenduduk}
            `)
            .on('click', async () => {
              const totalPenduduk = await fetchTotalPenduduk(provinsi.name);
              marker.setPopupContent(`
                <b>${provinsi.name}</b><br>
                Latitude: ${provinsi.lat}<br>
                Longitude: ${provinsi.lng}<br>
                Total Penduduk: ${totalPenduduk}
              `);
              marker.openPopup();
            })
            .on('dblclick', () => {
              zoomToLocation([provinsi.lat, provinsi.lng], 10);
              kabupatenLayers(provinsi);  // Tampilkan marker kabupaten di provinsi ini
            });
          provinsiGroup.addLayer(marker);
        }

        provinsiGroup.addTo(map);
      })();
    });

    onCleanup(() => {
      if (map) {
        map.remove();
      }
    });

    return (
      <div>
        <form onSubmit={(e) => handleSearch(e, map, zoomToLocation, kabupatenLayers, kecamatanLayers, searchMarker)}>
          <input type="text" name="search" placeholder="Cari lokasi..." />
          <button type="submit">Cari</button>
        </form>
        <div id="map" style={mapStyles}></div>
      </div>
    );
  }
