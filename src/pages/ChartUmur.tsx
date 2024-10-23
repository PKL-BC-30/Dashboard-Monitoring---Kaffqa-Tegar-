import { createSignal, onMount, onCleanup } from 'solid-js';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function ChartUmur() {
  const [data, setData] = createSignal([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/users/ChartUmurPengguna");
      const result = await response.json();
      const chartData = [
        { category: "0-5", value: result.age_0_5 },
        { category: "6-12", value: result.age_6_12 },
        { category: "13-17", value: result.age_13_17 },
        { category: "18-20", value: result.age_18_20 },
        { category: "21-59", value: result.age_21_59 },
        { category: "60+", value: result.age_60_plus }
      ];
      setData(chartData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  onMount(() => {
    let root;

    fetchData().then(() => {
      root = am5.Root.new("chartdivUmur");

      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true
      }));

      let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
      cursor.lineY.set("visible", false);

      let xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 30,
        minorGridEnabled: true
      });

      xRenderer.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });

      xRenderer.grid.template.setAll({
        location: 1
      });

      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "category",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      }));

      let yRenderer = am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      });

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: yRenderer
      }));

      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}"
        })
      }));

      series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
      series.columns.template.adapters.add("fill", function (fill, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      series.columns.template.adapters.add("stroke", function (stroke, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      // Update chart data after chart is created
      xAxis.data.setAll(data());
      series.data.setAll(data());

      series.appear(1000);
      chart.appear(1000, 100);
    });

    onCleanup(() => {
      if (root) {
        root.dispose();
      }
    });
  });

  return <div id="chartdivUmur" style={{ width: "100%", height: "330px" }}></div>;
}
