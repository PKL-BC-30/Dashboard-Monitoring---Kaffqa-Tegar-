import { onMount } from 'solid-js';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import styles from './PieChartGender.module.css'; // Pastikan Anda memiliki modul CSS ini

export default function PieChartGender() {
  onMount(async () => {
    // Buat elemen root
    let root = am5.Root.new("chartdiv");

    // Atur tema
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Buat chart
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270
      })
    );

    // Buat seri
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270
      })
    );

    series.states.create("hidden", {
      endAngle: -90
    });

    // Ambil data dari backend
    try {
      const response = await fetch('http://127.0.0.1:8080/users/ChartGenderPengguna');
      const data = await response.json();

      // Siapkan data untuk chart
      const chartData = [
        { category: "Male", value: data['Total Pengguna Pria'] },
        { category: "Female", value: data['Total Pengguna Wanita'] }
      ];

      // Set data
      series.data.setAll(chartData);

      // Penampilan chart
      series.appear(1000, 100);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }

    // Cleanup saat komponen di-unmount
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
