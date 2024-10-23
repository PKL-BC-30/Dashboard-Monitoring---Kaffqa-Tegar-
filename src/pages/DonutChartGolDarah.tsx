import { onMount } from 'solid-js';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import styles from './DonutChartGolDarah.module.css'; // Assuming you have some basic styling

export default function DonutChartGolDarah() {
  onMount(async () => {
    /* Create root element */
    let root = am5.Root.new("chartdiv");

    /* Set themes */
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    /* Create chart */
    let chart = root.container.children.push(am5percent.PieChart.new(root, {
      radius: am5.percent(90),
      innerRadius: am5.percent(50),
      layout: root.horizontalLayout
    }));

    /* Create series */
    let series = chart.series.push(am5percent.PieSeries.new(root, {
      name: "Blood Types",
      valueField: "value",
      categoryField: "bloodType"
    }));

    /* Fetch data from the backend */
    const response = await fetch('http://127.0.0.1:8080/users/ChartGolDarah');
    const data = await response.json();

    const chartData = [
      { bloodType: 'A', value: data['Total Golongan Darah A'] },
      { bloodType: 'B', value: data['Total Golongan Darah B'] },
      { bloodType: 'AB', value: data['Total Golongan Darah AB'] },
      { bloodType: 'O', value: data['Total Golongan Darah O'] },
    ];

    /* Set data */
    series.data.setAll(chartData);

    /* Disabling labels and ticks */
    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    /* Adding gradients */
    series.slices.template.set("strokeOpacity", 0);
    series.slices.template.set("fillGradient", am5.RadialGradient.new(root, {
      stops: [{
        brighten: -0.8
      }, {
        brighten: -0.8
      }, {
        brighten: -0.5
      }, {
        brighten: 0
      }, {
        brighten: -0.5
      }]
    }));

    /* Create legend */
    let legend = chart.children.push(am5.Legend.new(root, {
      centerY: am5.percent(50),
      y: am5.percent(50),
      layout: root.verticalLayout
    }));

    /* Set value labels align to right */
    legend.valueLabels.template.setAll({ textAlign: "right" });
    /* Set width and max width of labels */
    legend.labels.template.setAll({ 
      maxWidth: 140,
      width: 140,
      oversizedBehavior: "wrap"
    });

    legend.data.setAll(series.dataItems);

    /* Play initial series animation */
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  return (
    <div class={styles.chartContainer}>
      <div id="chartdiv" class={styles.chart}></div>
    </div>
  );
}
