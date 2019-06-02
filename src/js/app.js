import '../css/style.css';
import { fetchData } from './data';
import { initMap } from './air-map';
import { initRangeSlider } from './range-slider';
import { initAirChart, prepareDataForChart } from './air-chart';
import inside from 'point-in-polygon';

(async () => {
  let airChart;
  const airData = await fetchData();
  const heatmap = initMap(airData[0], function visibleAreaChanged(event) {
    const bounds = event.target.getBounds();
    const southWest = bounds._southWest;
    const northEast = bounds._northEast;
    const polygon = [[southWest.lng, southWest.lat], [southWest.lng, northEast.lat], [northEast.lng, northEast.lat], [northEast.lng, southWest.lat]];
    const filtered = airData.map(function(interval) {
      return interval.filter(function(measurement) {
        return inside([measurement.lng, measurement.lat], polygon);
      });
    });
    const data = prepareDataForChart(filtered);
    airChart.onDataChange(data);
  });

  initRangeSlider(function onChange(i) {
    heatmap.setData({ data: airData[Math.min(i, 23)] });
  });

  airChart = initAirChart(prepareDataForChart(airData));
})();
