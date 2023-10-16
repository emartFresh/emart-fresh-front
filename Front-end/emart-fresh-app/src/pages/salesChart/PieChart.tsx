import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import "./chart.css";

const PieChart = () => {
  const options = {
    colors: ['#000000', '#333333', '#666666', '#999999', '#bbbbbb', '#dddddd'],
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    credits: {enabled: false},//워터마크
    title: {
      text: 'Browser market shares January, 2015 to May, 2015'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        // size:'70%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Brands',
      colorByPoint: true,
      data: [{
        name: 'Microsoft Internet Explorer',
        y: 54.33
      }, {
        name: 'Chrome',
        y: 23.03,
        sliced: true,
        selected: true
      }, {
        name: 'Firefox',
        y: 10.38
      }, {
        name: 'Safari',
        y: 4.77
      }, {
        name: 'Opera',
        y: 2.41
      }, {
        name: 'Proprietary or Undetectable',
        y: 1.7
      }]
    }]
  };

  return (
    <div style={{maxWidth:'500px'}}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChart;
