import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import styles from './Dashboard.module.css';
import LogoWeb from './img/LogoWeb.svg';
import IconTotalUser from './img/IconTotalUser.svg';
import IconMen from './img/IconMen.svg';
import IconWoman from './img/IconWoman.svg';
import TabelPengguna from './TabelPengguna';
import DonutChartGolDarah from './DonutChartGolDarah';
import ChartUmur from './ChartUmur';
import PieChartGender from './PieChartGender';
import Switch from './Switch';
import PetaLokasi from './PetaLokasi';


export default function Dashboard() {
  const [totalUsers, setTotalUsers] = createSignal(0);
  const [totalMen, setTotalMen] = createSignal(0);
  const [totalWomen, setTotalWomen] = createSignal(0);
  const [isDarkMode, setIsDarkMode] = createSignal(false); // Signal untuk dark mode
  const navigate = useNavigate();
    
  onMount(() => {
    fetch('http://127.0.0.1:8080/users/Dashboard')
      .then(response => response.json())
      .then(data => {
        setTotalUsers(data['Total Pengguna']);
        setTotalMen(data['Total Pengguna Pria']);
        setTotalWomen(data['Total Pengguna Wanita']);
      })
      .catch(error => console.error('Error fetching data:', error));
  });

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
  
    if (token) {
      const response = await fetch("http://localhost:8080/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
  
      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Failed to log out. Please try again.");
      }
    } else {
      alert("No user is logged in");
    }
  };

  return (
    <div class={isDarkMode() ? styles.darkMode : ''}> {/* Gunakan kelas darkMode jika isDarkMode true */}
      <nav class={styles.navbar}>
        <div class={styles.navLeft}>
          <img src={LogoWeb} alt="Logo Web" class={styles.navLogo} />
          <span class={styles.navGreeting}>Dashboard</span>
        </div>
        <div class={styles.navRight}>
          <button 
            class={styles.chartButton} 
            onClick={() => document.getElementById('chartsSection')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Chart
          </button>
          <button 
            class={styles.chartButton} 
            onClick={() => document.getElementById('mapsSection')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Maps
          </button>
          <Switch onToggle={setIsDarkMode} /> {/* Pasang fungsi setIsDarkMode sebagai prop */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <header class={styles.dashboardHeader}>
        {/* Header content */}
      </header>
      <div class={styles.greeting}>
        <h2>Halo! Kaffqa Tegar..</h2>
      </div>
      <div class={styles.statsContainer}>
        <div class={styles.statBox}>
          <p>Total Pengguna</p>
          <h3>{totalUsers().toLocaleString()}</h3>
          <img src={IconTotalUser} alt="Total Pengguna" />
        </div>
        <div class={styles.statBox}>
          <p>Total Pengguna Pria</p>
          <h3>{totalMen().toLocaleString()}</h3>
          <img src={IconMen} alt="Pengguna Pria" />
        </div>
        <div class={styles.statBox}>
          <p>Total Pengguna Wanita</p>
          <h3>{totalWomen().toLocaleString()}</h3>
          <img src={IconWoman} alt="Pengguna Wanita" />
        </div>
      </div>
      <div class={styles.chartContainer} id="chartsSection">
        <div class={styles.chartPlaceholder}>
          <TabelPengguna isDarkMode={isDarkMode()} /> {/* Pass isDarkMode prop */}
        </div>
        <section class={styles.chartsContainer}>
          <div class={styles.chartsHeader}>
            <img src={LogoWeb} alt="Logo Web" class={styles.chartsLogo} />
            <h1 class={styles.chartsTitle}>Chart's</h1>
          </div>
          <h2 class={styles.chartsSubtitle}>Welcome to Charts..</h2>
          <div class={styles.chartsGrid}>
            <div class={styles.chart}>
              <h3 class={styles.chartTitle}>Distribusi Golongan Darah</h3>
              <DonutChartGolDarah />
            </div>
            <div class={styles.chart}>
              <h3 class={styles.chartTitle}>Kategori Umur Pengguna</h3>
              <ChartUmur />
            </div>
            <div class={styles.chart}>
              <h3 class={styles.chartTitle}>Distribusi Gender Pengguna</h3>
              <PieChartGender />
            </div>
            <div class={styles.chart}>
              <h3 class={styles.chartTitle}>Chart Title 4</h3>
              {/* Add your fourth chart component here */}
            </div>
          </div>
        </section>
      </div>

      {/* Bagian Maps */}
      <div class={styles.mapsContainer} id="mapsSection">
        <h2 class={styles.mapsTitle}>Maps</h2>
        <div class={styles.mapBox}>
          {/* Kosong untuk nanti diisi oleh komponen Maps */}
          <PetaLokasi />
        </div>
      </div>

  
    </div>
  );
}
