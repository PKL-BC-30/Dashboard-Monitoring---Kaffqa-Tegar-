import { createSignal, For, Show } from 'solid-js';
import styles from './Admin.module.css';
import { Chart } from 'chart.js/auto';

const Admin = () => {
  const [widgets, setWidgets] = createSignal([
    { id: 1, title: 'Total User', value: '40,689', icon: '👥' },
    { id: 2, title: 'Total Siswa Kelas', value: '40,689', icon: '🏫' },
    { id: 3, title: 'Total Guru', value: '40,689', icon: '👨‍🏫' },
    { id: 4, title: 'Total Mata Pelajaran', value: '40,689', icon: '📚' },
    { id: 5, title: 'Total Ekstrakulikuler', value: '40,689', icon: '🏆' },
  ]);

  const [chartContents, setChartContents] = createSignal([
    { id: 1, title: 'Penggunaan LMS', type: 'line' },
    { id: 2, title: 'Data Ekstrakulikuler', type: 'pie' },
  ]);

  const [tableData, setTableData] = createSignal([
    { nama: 'Priyono', kelas: 'XII - PPLG 2', nis: '541221074', email: '541221074@student.smktelkom-pwt.sch.id', status: 'Online' },
    { nama: 'Henoch', kelas: 'XII - PPLG 2', nis: '541221074', email: '541221074@student.smktelkom-pwt.sch.id', status: 'Online' },
  ]);

  const [showWidgetPopup, setShowWidgetPopup] = createSignal(false);
  const [showChartPopup, setShowChartPopup] = createSignal(false);
  const [newWidget, setNewWidget] = createSignal({ title: '', value: '', icon: '' });
  const [newChart, setNewChart] = createSignal({ title: '', type: 'bar' });

  const addWidget = () => {
    setWidgets([...widgets(), { id: Date.now(), ...newWidget() }]);
    setShowWidgetPopup(false);
    setNewWidget({ title: '', value: '', icon: '' });
  };

  const addChartContent = () => {
    setChartContents([...chartContents(), { id: Date.now(), ...newChart() }]);
    setShowChartPopup(false);
    setNewChart({ title: '', type: 'bar' });
  };

  const removeWidget = (id) => {
    setWidgets(widgets().filter(widget => widget.id !== id));
  };

  const removeChart = (id) => {
    setChartContents(chartContents().filter(chart => chart.id !== id));
  };

  return (
    <div class={styles.adminLayout}>
      <nav class={styles.navbar}>
        <div class={styles.logo}>Untitle</div>
        <div class={styles.searchBar}>
          <input type="text" placeholder="Search" />
        </div>
        <div class={styles.userInfo}>
          <span class={styles.notificationIcon}>🔔</span>
          <span class={styles.languageSelector}>🇬🇧 English</span>
          <span class={styles.userAvatar}>P</span>
          <span class={styles.userName}>PRIYONO</span>
          <span class={styles.userRole}>Admin</span>
        </div>
      </nav>

      <aside class={styles.sidebar}>
        <ul>
          <li class={styles.active}>Dashboard</li>
          <li>Data Siswa</li>
          <li>Ekstrakurikuler</li>
          <li>Data Guru</li>
          <li>Transkrip Nilai</li>
          <li>Pengaturan</li>
          <li class={styles.logout}>Keluar</li>
        </ul>
      </aside>

      <main class={styles.mainContent}>
        <h1>Dashboard</h1>
        
        <div class={styles.widgetContainer}>
          <For each={widgets()}>{(widget) => 
            <div class={styles.widget}>
              <button class={styles.removeButton} onClick={() => removeWidget(widget.id)}>×</button>
              <h3>{widget.title}</h3>
              <p>{widget.value}</p>
              <span>{widget.icon}</span>
            </div>
          }</For>
          <button onClick={() => setShowWidgetPopup(true)} class={styles.addButton}>+</button>
        </div>

        <div class={styles.chartContainer}>
          <For each={chartContents()}>{(chart) => 
            <div class={styles.chart}>
              <button class={styles.removeButton} onClick={() => removeChart(chart.id)}>×</button>
              <h3>{chart.title}</h3>
              <canvas></canvas>
            </div>
          }</For>
          <button onClick={() => setShowChartPopup(true)} class={styles.addButton}>+</button>
        </div>

        <div class={styles.tableContainer}>
          <h3>Siswa Online</h3>
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kelas</th>
                <th>NIS</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <For each={tableData()}>{(row) => 
                <tr>
                  <td>{row.nama}</td>
                  <td>{row.kelas}</td>
                  <td>{row.nis}</td>
                  <td>{row.email}</td>
                  <td>{row.status}</td>
                </tr>
              }</For>
            </tbody>
          </table>
        </div>
      </main>

      <Show when={showWidgetPopup()}>
        <div class={styles.popup}>
          <h3>Add New Widget</h3>
          <input 
            type="text" 
            placeholder="Widget Title" 
            value={newWidget().title} 
            onInput={(e) => setNewWidget({...newWidget(), title: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Widget Value" 
            value={newWidget().value} 
            onInput={(e) => setNewWidget({...newWidget(), value: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Widget Icon" 
            value={newWidget().icon} 
            onInput={(e) => setNewWidget({...newWidget(), icon: e.target.value})}
          />
          <button onClick={addWidget}>Add Widget</button>
          <button onClick={() => setShowWidgetPopup(false)}>Cancel</button>
        </div>
      </Show>

      <Show when={showChartPopup()}>
        <div class={styles.popup}>
          <h3>Add New Chart</h3>
          <input 
            type="text" 
            placeholder="Chart Title" 
            value={newChart().title} 
            onInput={(e) => setNewChart({...newChart(), title: e.target.value})}
          />
          <select 
            value={newChart().type} 
            onChange={(e) => setNewChart({...newChart(), type: e.target.value})}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
          <button onClick={addChartContent}>Add Chart</button>
          <button onClick={() => setShowChartPopup(false)}>Cancel</button>
        </div>
      </Show>
    </div>
  );
};

export default Admin;