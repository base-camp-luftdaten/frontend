import { Chart } from 'chart.js';

export function prepareDataForChart(data) {
  // return data.flat().map(function(measurement) {
  //   return {
  //     x: Number(measurement.timestamp),
  //     y: measurement.p2val
  //   };
  // });
  return data.map(function(measurements, i) {
    return {
      x: i,
      y:
        measurements.reduce(function(sum, measurement) {
          return sum + measurement.p2val;
        }, 0) / measurements.length
    };
  });
}

export function initAirChart(chartData) {
  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'P25 Average',
          data: chartData,
          backgroundColor: 'rgba(255,0,0,0.3)',
          spanGaps: true
        }
      ]
    },
    options: {
      scales: {
        xAxes: [
          {
            type: 'linear',
            position: 'bottom',
            ticks: {
              max: 23
            }
          }
        ],
        yAxes: [
          {
            type: 'linear',
            ticks: {
              // max: 10
            }
          }
        ]
      }
    }
  });

  return {
    onDataChange: function(newData) {
      myChart.data.datasets[0].data = newData;
      myChart.update();
    }
  };
}
