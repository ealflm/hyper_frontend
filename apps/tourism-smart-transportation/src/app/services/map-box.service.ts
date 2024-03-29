import { RentStation } from './../models/RentStationResponse';
import {
  StationsResponse,
  Station,
  StationResponse,
} from './../models/StationResponse';
import { MapService } from './map.service';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { environment } from '../../environments/environment.prod';

import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
@Injectable({
  providedIn: 'root',
})
export class MapBoxService {
  map!: mapboxgl.Map;
  miniMap!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  // style = 'mapbox://styles/mapbox/satellite-v9';
  lat = 10.22698;
  lng = 103.9967;
  zoom = 12;
  coordinates$ = new Subject<any>();
  coordinates = this.coordinates$.asObservable();
  initViewMiniMapPartner$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  iniViewMiniMapAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  // currentBusStationMarkers: any = [];
  // currentRentStationMarkers: any = [];
  constructor(private mapService: MapService) {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;
  }

  initializeMap(longitude: number, latitude: number, zoom: number) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: zoom,
      center: [longitude, latitude],
    });
    // this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('mousemove', (e) => {
      const geo = JSON.stringify(e.lngLat.wrap());
      this.coordinates$.next(geo);
    });
  }
  removeRoute() {
    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
    }
    if (this.map.getLayer('arrow-layer')) {
      this.map.removeLayer('arrow-layer');
    }
    if (this.map.getSource('route')) {
      this.map.removeSource('route');
    }
    if (this.map.getSource('mapDataSourceId')) {
      this.map.removeSource('mapDataSourceId');
    }
  }
  getRoute(routeRes: any) {
    const data = routeRes;
    const route = data.geometry.coordinates;
    const geojson: any = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route,
      },
    };
    this.removeRoute();
    this.map.addSource('mapDataSourceId', {
      type: 'geojson',
      data: geojson,
    });
    // if the route already exists on the map, we'll reset it using setData

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson,
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#03afff',
        'line-width': 5,
        'line-opacity': 0.75,
      },
    });
    const url = 'https://i.imgur.com/LcIng3L.png';
    this.map.loadImage(url, (err, image) => {
      if (err) throw err;
      if (!this.map.hasImage('arrow')) {
        if (image) {
          this.map.addImage('arrow', image);
        }
      }
      this.map.addLayer({
        id: 'arrow-layer',
        type: 'symbol',
        source: 'mapDataSourceId',
        layout: {
          'symbol-placement': 'line',
          'symbol-spacing': 1,
          'icon-allow-overlap': true,
          // 'icon-ignore-placement': true,
          'icon-image': 'arrow',
          'icon-size': 0.045,
          visibility: 'visible',
        },
      });
    });
  }
  removeRouteMiniMap() {
    if (this.miniMap.getLayer('route')) {
      this.miniMap.removeLayer('route');
    }
    if (this.miniMap.getSource('route')) {
      this.miniMap.removeSource('route');
    }
  }
  getRouteMiniMap(routeRes: any) {
    const data = routeRes;
    const route = data.geometry.coordinates;
    const geojson: any = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route,
      },
    };
    // if the route already exists on the map, we'll reset it using setData
    if (this.miniMap.getLayer('route')) {
      this.miniMap.removeLayer('route');
    }
    if (this.miniMap.getSource('route')) {
      this.miniMap.removeSource('route');
    }

    this.miniMap.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson,
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#00d795',
        'line-width': 5,
        'line-opacity': 0.75,
      },
    });
  }
  removeLayerTracking() {
    if (this.map.getLayer('iss')) {
      this.map.removeLayer('iss');
    }
    if (this.map.getSource('iss')) {
      this.map.removeSource('iss');
    }
  }

  trackingVehicle(geojson: any) {
    // console.log(geojson);
    if (this.map.getSource('iss') && this.map.getLayer('iss')) {
      const source = this.map.getSource('iss') as mapboxgl.GeoJSONSource;
      source.setData(geojson);
    } else {
      this.map.addSource('iss', {
        type: 'geojson',
        data: geojson,
      });
      this.map.loadImage(
        'https://img.icons8.com/color/48/undefined/car--v1.png',
        (error, image) => {
          if (error) throw error;
          if (!this.map.hasImage('car')) {
            if (image) {
              this.map.addImage('car', image);
            }
          }
          this.map.addLayer({
            id: 'iss',
            type: 'symbol',
            source: 'iss',
            // source: {
            //   type: 'geojson',
            //   data: geojson,
            // },
            layout: {
              'icon-image': 'car',
              'icon-size': 0.5,
            },
          });
        }
      );
    }

    // this.removeLayerTracking();
  }
  initializeMiniMap() {
    this.miniMap = new mapboxgl.Map({
      container: 'mini-map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
    });
  }
  flyToMarker(longitude: number, latitude: number) {
    this.map.flyTo({
      zoom: 17,
      center: [longitude, latitude],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
  }
  flyToRoute(longitude: number, latitude: number) {
    this.map.flyTo({
      zoom: 12,
      center: [longitude, latitude],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
  }
  flyToMarkerMiniMap(longitude: number, latitude: number, zoom: number) {
    this.miniMap.flyTo({
      zoom: zoom,
      center: [longitude, latitude],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
  }
  getCoordinates() {
    return this.coordinates;
  }

  setStyleMap(style: string) {
    this.style = style;
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            console.log(
              'Latitude: ' +
                position.coords.latitude +
                'Longitude: ' +
                position.coords.longitude
            );
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            console.log(this.lat);
            console.log(this.lat);
          }
        },
        (error: any) => console.log(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  getMarkers() {
    const geoJson = [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [103.96, 10.215],
        },
        properties: {
          description: 'Southern Ave',
          title: 'Trạm Dương Đông',
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [103.995, 10.185],
        },
        properties: {
          description: 'Deanwood',
          title: 'Trạm sân bay',
        },
      },
    ];
    return geoJson;
  }
  // setRentStationMarkers(rentStations: RentStation[]) {
  //   rentStations.map((marker) => {
  //     const el = document.createElement('div');
  //     el.id = marker.id;
  //     const width = 40;
  //     const height = 40;
  //     el.className = 'marker';
  //     el.style.backgroundImage = `url('../../../assets/image/rent-station.png')`;
  //     el.style.width = `${width}px`;
  //     el.style.height = `${height}px`;
  //     el.style.backgroundSize = '100%';
  //     el.style.cursor = 'pointer';

  //     const markerDiv = new mapboxgl.Marker(el)
  //       .setLngLat([marker.longitude, marker.latitude] as [number, number])
  //       .addTo(this.map);
  //     markerDiv.getElement().addEventListener('click', () => {
  //       if (marker.longitude && marker.latitude) {
  //         this.flyToMarker(marker.longitude, marker.latitude);
  //       }
  //     });
  //     this.currentRentStationMarkers.push(markerDiv);
  //   });
  // }
  // removeRentStationMarker() {
  //   if (this.currentRentStationMarkers !== null) {
  //     for (let i = this.currentRentStationMarkers.length - 1; i >= 0; i--) {
  //       this.currentRentStationMarkers[i].remove();
  //     }
  //   }
  // }
  // bus stations
  // setBusStationMarkers(busStations: Station[]) {
  //   busStations.map((marker) => {
  //     // console.log(marker);
  //     const elStationMarker = document.createElement('div');
  //     elStationMarker.id = marker.id;
  //     const width = 40;
  //     const height = 40;
  //     elStationMarker.className = 'marker';
  //     elStationMarker.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
  //     elStationMarker.style.width = `${width}px`;
  //     elStationMarker.style.height = `${height}px`;
  //     elStationMarker.style.backgroundSize = '100%';
  //     elStationMarker.style.cursor = 'pointer';

  //     const markerDiv = new mapboxgl.Marker(elStationMarker)
  //       .setLngLat([marker.longitude, marker.latitude] as [number, number])
  //       .addTo(this.map)
  //       .setPopup(
  //         new mapboxgl.Popup({ offset: 25 }).setHTML(`
  //       <h3>${marker.title}</h3>
  //       <p>${marker.description}</p>
  //       `)
  //       );
  //     // markerDiv.getElement().addEventListener('mouseenter', () => {
  //     //   markerDiv.togglePopup();
  //     // });
  //     markerDiv.getElement().addEventListener('click', () => {
  //       if (marker.longitude && marker.latitude) {
  //         this.flyToMarker(marker.longitude, marker.latitude);
  //         markerDiv.getPopup();
  //       }
  //     });
  //     this.currentBusStationMarkers.push(markerDiv);
  //   });
  // }
  // removeBusStationMarker() {
  //   if (this.currentBusStationMarkers !== null) {
  //     for (let i = this.currentBusStationMarkers.length - 1; i >= 0; i--) {
  //       this.currentBusStationMarkers[i].remove();
  //     }
  //   }
  // }
  checkMarkerInsidePolygon(lng: number, lat: number) {
    const point = turf.point([lat, lng]);
    const poly = turf.polygon([
      [
        [10.332359022967914, 103.84989738464357],
        [10.32437392484577, 103.85135650634766],
        [10.31647312558862, 103.85530471801759],
        [10.311022726007307, 103.85702133178712],
        [10.309755177699923, 103.85684967041017],
        [10.309417163956429, 103.8559913635254],
        [10.308065105355265, 103.85616302490236],
        [10.307177813744563, 103.85757923126222],
        [10.305867997752166, 103.85959625244142],
        [10.304473671519158, 103.85989665985109],
        [10.302192033467513, 103.86066913604738],
        [10.301727253320932, 103.8618278503418],
        [10.304177904555411, 103.86131286621095],
        [10.306290519634985, 103.86238574981691],
        [10.307389073878536, 103.86543273925783],
        [10.307896097622084, 103.86860847473146],
        [10.306761988445697, 103.87367248535156],
        [10.305156404679302, 103.87766361236574],
        [10.303128287175905, 103.88079643249513],
        [10.299079614962594, 103.88500213623048],
        [10.295530332354865, 103.8874912261963],
        [10.292826090226713, 103.88882160186769],
        [10.291685231126614, 103.88869285583496],
        [10.291135927125767, 103.89036655426027],
        [10.289952807568568, 103.89229774475099],
        [10.29003731625548, 103.89478683471681],
        [10.289657026986232, 103.89830589294435],
        [10.290628876430096, 103.90079498291017],
        [10.291473960470219, 103.9039707183838],
        [10.293248629587277, 103.90491485595705],
        [10.29257256633874, 103.90882015228273],
        [10.289403500552162, 103.91422748565675],
        [10.28695273452397, 103.91675949096681],
        [10.285009010007203, 103.91839027404785],
        [10.282938507686573, 103.92014980316164],
        [10.280318668969713, 103.92208099365236],
        [10.274928380939606, 103.92512798309328],
        [10.270195633274701, 103.92688751220705],
        [10.265800875586773, 103.92864704132081],
        [10.261913154431138, 103.93165111541748],
        [10.259335399941179, 103.93482685089113],
        [10.256461812816498, 103.93886089324953],
        [10.25227816141283, 103.94177913665773],
        [10.247291514836576, 103.9453411102295],
        [10.240741139525213, 103.94924640655519],
        [10.234232890709444, 103.95143508911134],
        [10.224470267245106, 103.9546537399292],
        [10.21965223857983, 103.9556407928467],
        [10.218088476731939, 103.95718574523927],
        [10.220286193893852, 103.95748615264894],
        [10.219905820857214, 103.95976066589357],
        [10.21732772494308, 103.9614772796631],
        [10.219567711109082, 103.95881652832031],
        [10.218426588053656, 103.9581298828125],
        [10.217158668742762, 103.95860195159914],
        [10.216778291963326, 103.95705699920654],
        [10.215129987326653, 103.95774364471437],
        [10.209002795521608, 103.95993232727052],
        [10.201951281836514, 103.96199226379395],
        [10.195991708553313, 103.96353721618654],
        [10.190666038094957, 103.96452426910402],
        [10.188510384274833, 103.96525382995607],
        [10.183015514495498, 103.9665412902832],
        [10.175043878424734, 103.9684295654297],
        [10.166934203743335, 103.97018909454347],
        [10.158014956833899, 103.97203445434572],
        [10.152012290414625, 103.97340774536134],
        [10.14311088103717, 103.97512435913087],
        [10.130268171957704, 103.9776134490967],
        [10.119022674576852, 103.9801025390625],
        [10.110328551493685, 103.98203372955324],
        [10.101703684791397, 103.98392200469972],
        [10.092148415337952, 103.98572444915771],
        [10.081874070243405, 103.98765563964845],
        [10.072805242135916, 103.98877143859865],
        [10.071710092472925, 103.98812770843506],
        [10.070526158943185, 103.98872852325441],
        [10.05856259734052, 103.99091720581055],
        [10.05594091763215, 103.98967266082765],
        [10.053065502523651, 103.99117469787599],
        [10.049682628467071, 103.99100303649904],
        [10.048216684584451, 103.99138927459718],
        [10.04686351891518, 103.99250507354738],
        [10.046398366908628, 103.99473667144777],
        [10.045933214233065, 103.99907112121583],
        [10.037946325300867, 104.00310516357423],
        [10.035620494483515, 104.00379180908205],
        [10.035282190427194, 104.00271892547609],
        [10.033506088332382, 104.003963470459],
        [10.03274896624264, 104.00336265563966],
        [10.031099716005192, 104.00447845458986],
        [10.029027569188358, 104.00675296783449],
        [10.027462878115783, 104.0065383911133],
        [10.023276235121465, 104.00748252868654],
        [10.020442819788038, 104.00902748107912],
        [10.017820831303911, 104.00949954986574],
        [10.016044633513676, 104.00846958160402],
        [10.015198821623933, 104.00932788848878],
        [10.012830536602392, 104.00876998901367],
        [10.0113080585329, 104.00937080383302],
        [10.009616407857434, 104.01065826416017],
        [10.010504525561327, 104.0134906768799],
        [10.01384551801394, 104.01409149169923],
        [10.01545256542239, 104.01507854461671],
        [10.01689044319819, 104.01400566101074],
        [10.017524799014284, 104.01683807373048],
        [10.01841289507257, 104.02117252349855],
        [10.017271056836714, 104.02507781982423],
        [10.01553714664446, 104.02730941772462],
        [10.009700990600585, 104.03185844421388],
        [10.014310716766541, 104.03306007385255],
        [10.01629837665059, 104.03713703155519],
        [10.013307120652838, 104.04057025909425],
        [10.011107986600495, 104.04138565063478],
        [10.010135287939763, 104.0442180633545],
        [10.007809257584906, 104.04580593109132],
        [10.00654050673112, 104.04782295227051],
        [10.005694670074538, 104.05134201049805],
        [10.008147590308598, 104.05198574066162],
        [10.010177579246474, 104.05074119567873],
        [10.012799629501883, 104.04868125915529],
        [10.013307120652838, 104.04644966125488],
        [10.011700062618957, 104.04550552368165],
        [10.0123767196032, 104.04314517974855],
        [10.014575845057806, 104.04138565063478],
        [10.01609830779508, 104.03971195220949],
        [10.01935466244158, 104.03941154479982],
        [10.022695563745895, 104.03640747070314],
        [10.027374700642543, 104.03293132781984],
        [10.031138405257392, 104.03027057647706],
        [10.036165643637998, 104.0308713912964],
        [10.040817280726287, 104.03404712677003],
        [10.039670868792713, 104.03739452362062],
        [10.04148925354557, 104.03885364532472],
        [10.044195624190099, 104.03529167175293],
        [10.055521048651174, 104.0358066558838],
        [10.060801411483878, 104.03889656066896],
        [10.061097404191425, 104.04112815856935],
        [10.060759126789222, 104.04297351837158],
        [10.06490300054611, 104.04207229614259],
        [10.06748232367836, 104.04344558715822],
        [10.06997705922677, 104.04211521148683],
        [10.071118711434146, 104.03662204742432],
        [10.074459078019574, 104.03267383575441],
        [10.078349081573398, 104.02756690979004],
        [10.075769845329244, 104.02748107910158],
        [10.072767757489741, 104.03014183044435],
        [10.07014619314206, 104.02979850769044],
        [10.068116580307267, 104.02559280395509],
        [10.066721214078246, 104.02615070343019],
        [10.066594362303729, 104.02542114257814],
        [10.0643049650657, 104.02396202087404],
        [10.063839838166995, 104.01889801025392],
        [10.06443181773997, 104.02130126953125],
        [10.066376885836112, 104.02464866638185],
        [10.069928719068166, 104.02576446533205],
        [10.071831470787673, 104.02868270874025],
        [10.076144333129966, 104.02559280395509],
        [10.076390802227156, 104.02263164520265],
        [10.082773107620678, 104.01803970336915],
        [10.085352287819665, 104.01881217956544],
        [10.084887191277002, 104.02018547058107],
        [10.08717038604307, 104.02138710021974],
        [10.089538126482365, 104.02327537536623],
        [10.09232865536239, 104.02576446533205],
        [10.099756723469461, 104.02524948120119],
        [10.107067087578622, 104.02657985687257],
        [10.11108353139587, 104.03022766113283],
        [10.118355280867561, 104.03584957122804],
        [10.124612235799185, 104.03550624847414],
        [10.129981282288941, 104.03190135955812],
        [10.132160913051116, 104.02971267700195],
        [10.13359829980632, 104.03142929077148],
        [10.13520475056374, 104.02988433837892],
        [10.141461376755576, 104.0321159362793],
        [10.140817611374711, 104.03366088867189],
        [10.143227230199253, 104.03340339660646],
        [10.144706811721765, 104.03499126434328],
        [10.146989581230981, 104.03447628021242],
        [10.152435836137396, 104.04293060302734],
        [10.15374628527397, 104.04215812683107],
        [10.170017406821843, 104.0471363067627],
        [10.179937789559808, 104.04876708984376],
        [10.191519285558956, 104.05211448669435],
        [10.202339573080359, 104.0563201904297],
        [10.208383558005591, 104.05996799468996],
        [10.207707313647111, 104.06138420104982],
        [10.210708137025028, 104.0663194656372],
        [10.218273467477994, 104.07164096832277],
        [10.230783339472195, 104.0760612487793],
        [10.241264204075009, 104.07902240753175],
        [10.245399135497609, 104.08103942871095],
        [10.256640176327045, 104.08018112182619],
        [10.268800242996386, 104.07588958740236],
        [10.282322250848127, 104.07460212707521],
        [10.294618324169981, 104.07764911651613],
        [10.308999616611521, 104.08013820648195],
        [10.321709666104288, 104.07588958740236],
        [10.327867360175905, 104.07464504241945],
        [10.32959957520821, 104.07541751861572],
        [10.334880659681318, 104.07288551330568],
        [10.347034931341263, 104.07322883605958],
        [10.352609456405593, 104.07657623291017],
        [10.353792340349832, 104.07983779907228],
        [10.358904037515899, 104.07897949218751],
        [10.365367469128755, 104.07631874084474],
        [10.369169425432636, 104.07812118530275],
        [10.374564178623917, 104.0764904022217],
        [10.380470100736034, 104.07215595245363],
        [10.388031359024616, 104.06490325927734],
        [10.396554777992721, 104.06074047088623],
        [10.399553803815786, 104.05726432800293],
        [10.400947707420073, 104.05666351318361],
        [10.403144148952352, 104.05816555023195],
        [10.402975192460195, 104.06005382537842],
        [10.40500266432884, 104.058895111084],
        [10.403101909837881, 104.05752182006837],
        [10.402172647873318, 104.05571937561037],
        [10.403777734983313, 104.05125617980958],
        [10.410522373429234, 104.04456138610841],
        [10.414577205878992, 104.04177188873292],
        [10.415421956001481, 104.03851032257081],
        [10.414239305189037, 104.03696537017824],
        [10.412169655471676, 104.0359354019165],
        [10.412423082705823, 104.03263092041017],
        [10.416139991805599, 104.02700901031496],
        [10.422813421899502, 104.02147293090822],
        [10.430246947843518, 104.01675224304199],
        [10.438736155209238, 104.0118169784546],
        [10.4458314343401, 104.00774002075197],
        [10.450367934530245, 103.99941444396974],
        [10.45209768797854, 103.99477958679199],
        [10.449310332415843, 103.98653984069826],
        [10.44939693147012, 103.984694480896],
        [10.448214409762905, 103.98327827453613],
        [10.444793518055802, 103.97872924804688],
        [10.443526511571621, 103.97658348083498],
        [10.440823547145971, 103.97495269775392],
        [10.439303119330193, 103.9731502532959],
        [10.437782684080757, 103.97272109985353],
        [10.432901193309478, 103.97203445434572],
        [10.42614350739982, 103.97203445434572],
        [10.420737253071763, 103.97117614746095],
        [10.415753279253236, 103.9695453643799],
        [10.411994127632312, 103.96791458129883],
        [10.409628795516845, 103.96727085113527],
        [10.408277169110761, 103.97177696228027],
        [10.406967775444695, 103.97263526916505],
        [10.412838884753942, 103.97847175598146],
        [10.412120841346455, 103.98173332214357],
        [10.409290889464437, 103.98246288299562],
        [10.405489421151954, 103.9823341369629],
        [10.403017811563014, 103.9805316925049],
        [10.40648140089503, 103.97945880889893],
        [10.405636626554244, 103.97516727447511],
        [10.40529871617749, 103.97207736968994],
        [10.40627020752427, 103.96615505218506],
        [10.405974536565056, 103.97143363952637],
        [10.408044227395031, 103.97031784057617],
        [10.408508849979759, 103.96581172943115],
        [10.406777071373904, 103.96255016326906],
        [10.40576334285119, 103.9589023590088],
        [10.405129760851887, 103.95349502563478],
        [10.402299745548959, 103.94877433776857],
        [10.398920589187139, 103.94619941711427],
        [10.392880256080533, 103.94478321075441],
        [10.38596098017494, 103.94362449645998],
        [10.378577264701498, 103.94113540649415],
        [10.371483992536097, 103.93727302551271],
        [10.36768206433327, 103.93461227416994],
        [10.36434477820497, 103.9308786392212],
        [10.361810106757606, 103.92847537994385],
        [10.359613374918762, 103.92259597778322],
        [10.359782354837636, 103.91839027404785],
        [10.361810106757606, 103.91667366027833],
        [10.361810106757606, 103.9137125015259],
        [10.36312427903429, 103.90950679779054],
        [10.364391612005386, 103.90324115753175],
        [10.367599593514354, 103.89418601989748],
        [10.369120370735603, 103.88487339019775],
        [10.370979088420102, 103.87835025787355],
        [10.370091974538017, 103.87500286102296],
        [10.37207741641043, 103.8704538345337],
        [10.373091254211978, 103.86547565460206],
        [10.373513685660113, 103.86161327362062],
        [10.37414733176333, 103.85890960693361],
        [10.37655517525511, 103.8516139984131],
        [10.374480072669348, 103.84925365447998],
        [10.374480072669348, 103.84539127349854],
        [10.376718942911937, 103.8435459136963],
        [10.377056884198632, 103.83689403533937],
        [10.373677454908593, 103.83796691894533],
        [10.370424719754741, 103.83865356445314],
        [10.367219748837949, 103.8347911834717],
        [10.365614474034833, 103.8349199295044],
        [10.3647273449563, 103.83328914642335],
        [10.36253063356897, 103.83346080780031],
        [10.360671865750584, 103.83414745330812],
        [10.361474516842902, 103.83650779724123],
        [10.359573497766625, 103.83788108825685],
        [10.35868635158499, 103.8411855697632],
        [10.354729375863693, 103.84350299835206],
        [10.349575364306627, 103.84560585021974],
        [10.342224414452083, 103.84766578674318],
        [10.333943828028811, 103.84976863861085],
        [10.332359022967914, 103.84989738464357],
      ],
    ]);
    return turf.booleanPointInPolygon(point, poly);
  }
}
