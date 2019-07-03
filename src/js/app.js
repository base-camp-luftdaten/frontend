import '../css/style.css';
import { fetchData } from './data';
import { initMap } from './air-map';
import { initRangeSlider } from './range-slider';
import { initAirChart, prepareDataForChart } from './air-chart';
import inside from 'point-in-polygon';

(async() => {
    let airChart;
    let sliderPosition = 0;

    const airData = await fetchData();

    const heatmap = initMap(airData[sliderPosition], function visibleAreaChanged(event) {
        const bounds = event.target.getBounds();
        const southWest = bounds._southWest;
        const northEast = bounds._northEast;
        const polygon = [
            [southWest.lng, southWest.lat],
            [southWest.lng, northEast.lat],
            [northEast.lng, northEast.lat],
            [northEast.lng, southWest.lat]
        ];
        const filtered = airData.map(function(interval) {
            return interval.filter(function(measurement) {
                return inside([measurement.lng, measurement.lat], polygon);
            });
        });
        const data = prepareDataForChart(filtered);
        airChart.onDataChange(data);
    });

    initRangeSlider(function onChange(i) {
        sliderPosition = Math.min(i, 23);
        airChart.onSliderChange(23 - sliderPosition);
        heatmap.setData({ data: airData[sliderPosition] });
    });

    airChart = initAirChart(prepareDataForChart(airData));
})();

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px 
function openSidebar() {
    document.getElementById("sidebar").style.width = "40%";
    document.getElementById("openbtn").style.marginLeft = "250px";
}*/

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 
function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("openbtn").style.marginLeft = "0";
}*/

document.getElementById("openbtn").addEventListener("click", toggleSidebar);

function toggleSidebar() {
    let sidebarSize = document.getElementById("sidebar").style.width;
    if (sidebarSize == "50%") {
        return closeSidebar();
    }
    return openSidebar();
}

function openSidebar() {
    document.getElementById("sidebar").style.width = "50%";
    document.getElementById("map-wrapper").style.width = "50%";
    document.getElementById("map").style.width = "200%";
    document.getElementById("openbtn").innerHTML = '&#10005';
}

function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("map-wrapper").style.width = "100%";
    document.getElementById("map").style.width = "100%";
    document.getElementById("openbtn").innerHTML = '&#9776;';
}