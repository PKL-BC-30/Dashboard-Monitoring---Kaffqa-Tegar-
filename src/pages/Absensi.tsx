import { createSignal, For, createEffect } from 'solid-js';
import styles from './Absensi.module.css';

const TopBar = () => {
  return (
    <div class={styles.topBar}>
      <select class={styles.periodSelect}>
        <option>2023/2024 - 2</option>
      </select>
      <div class={styles.topBarIcons}>
        <span>Kalender</span>
        <span>Notifikasi</span>
        <span>Pencarian</span>
      </div>
      <div class={styles.userInfo}>
        <div class={styles.userAvatar}>I</div>
        <span>Irfan Satya</span>
      </div>
    </div>
  );
};

const SideBar = () => {
  return (
    <div class={styles.sideBar}>
      <div class={styles.logo}>LMS</div>
      <input type="text" placeholder="Cari.." class={styles.searchInput} />
      <nav>
        <ul>
          <li>Pembelajaran</li>
          <li class={styles.subMenu}>Materi</li>
          <li class={styles.subMenu}>Tugas</li>
          <li>Transkrip Nilai</li>
          <li>Data Siswa</li>
          <li class={styles.active}>Absensi</li>
        </ul>
      </nav>
      <div class={styles.sideBarFooter}>
        <span>Lainnya</span>
        <span>Pengaturan</span>
        <span class={styles.logout}>Keluar</span>
      </div>
    </div>
  );
};

const Absensi = () => {
  const [showDetail, setShowDetail] = createSignal(false);
  const [selectedClass, setSelectedClass] = createSignal(null);
  const [selectedGrade, setSelectedGrade] = createSignal('X');
  const [searchTerm, setSearchTerm] = createSignal('');
  const [changesSaved, setChangesSaved] = createSignal(false);

  const classes = {
    X: [
      { id: 1, name: 'X MIPA 1', students: 34, teacher: 'Windi Natalie' },
      { id: 2, name: 'X MIPA 2', students: 33, teacher: 'Windi Natalie' },
    ],
    XI: [
      { id: 3, name: 'XI MIPA 1', students: 32, teacher: 'John Doe' },
      { id: 4, name: 'XI MIPA 2', students: 31, teacher: 'Jane Smith' },
    ],
    XII: [
      { id: 5, name: 'XII MIPA 1', students: 30, teacher: 'Bob Johnson' },
      { id: 6, name: 'XII MIPA 2', students: 29, teacher: 'Alice Brown' },
    ],
  };

  const [students, setStudents] = createSignal([
    { id: 1, nis: '541221001', name: 'Adhara Faliya', gender: 'Perempuan', status: 'Hadir' },
    { id: 2, nis: '541221002', name: 'Auranisa Valent', gender: 'Perempuan', status: 'Sakit' },
    { id: 3, nis: '541221003', name: 'John Doe', gender: 'Laki-laki', status: 'Hadir' },
    { id: 4, nis: '541221004', name: 'Jane Smith', gender: 'Perempuan', status: 'Izin' },
  ]);

  const filteredStudents = () => {
    return students().filter(student => 
      student.name.toLowerCase().includes(searchTerm().toLowerCase())
    );
  };

  const handleCekDetail = (classId) => {
    setSelectedClass(classId);
    setShowDetail(true);
    setChangesSaved(false);
  };

  const handleStatusChange = (studentId, newStatus) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, status: newStatus } : student
    ));
  };

  const handleSaveChanges = () => {
    setChangesSaved(true);
    // Here you would typically save the changes to a backend
  };

  const handleBack = () => {
    setShowDetail(false);
    setSelectedClass(null);
    setChangesSaved(false);
  };

  return (
    <div class={styles.layout}>
      <SideBar />
      <div class={styles.mainContent}>
        <TopBar />
        <div class={styles.contentArea}>
          <header class={styles.contentHeader}>
            <h1>Daftar Kelas</h1>
            <select 
              class={styles.classSelect} 
              value={selectedGrade()} 
              onInput={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="X">Kelas : X</option>
              <option value="XI">Kelas : XI</option>
              <option value="XII">Kelas : XII</option>
            </select>
          </header>

          {!showDetail() ? (
            <div class={styles.classList}>
              <For each={classes[selectedGrade()]}>
                {(kelas) => (
                  <div class={styles.classCard}>
                    <h2>{kelas.name}</h2>
                    <p>Absensi : {kelas.students} Hadir</p>
                    <p>Guru pengampu : {kelas.teacher}</p>
                    <button class={styles.detailButton} onClick={() => handleCekDetail(kelas.id)}>
                      Cek detail
                    </button>
                  </div>
                )}
              </For>
            </div>
          ) : (
            <div class={styles.detailView}>
              <h2>{classes[selectedGrade()].find(c => c.id === selectedClass())?.name}</h2>
              <p>Pengampu : {classes[selectedGrade()].find(c => c.id === selectedClass())?.teacher}</p>
              <h3>Absensi Siswa</h3>
              <div class={styles.filterContainer}>
                <input 
                  type="text" 
                  placeholder="Cari siswa..." 
                  class={styles.searchInput} 
                  value={searchTerm()}
                  onInput={(e) => setSearchTerm(e.target.value)}
                />
                <input type="date" class={styles.dateInput} value="2024-09-18" />
              </div>
              <table class={styles.studentTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>NIS</th>
                    <th>NAMA</th>
                    <th>JENIS KELAMIN</th>
                    <th>HADIR</th>
                    <th>ALFA</th>
                    <th>IZIN</th>
                    <th>SAKIT</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={filteredStudents()}>
                    {(student, index) => (
                      <tr>
                        <td>{index() + 1}</td>
                        <td>{student.nis}</td>
                        <td>{student.name}</td>
                        <td>{student.gender}</td>
                        <td><input type="radio" name={`status-${student.id}`} checked={student.status === 'Hadir'} onChange={() => handleStatusChange(student.id, 'Hadir')} /></td>
                        <td><input type="radio" name={`status-${student.id}`} checked={student.status === 'Alfa'} onChange={() => handleStatusChange(student.id, 'Alfa')} /></td>
                        <td><input type="radio" name={`status-${student.id}`} checked={student.status === 'Izin'} onChange={() => handleStatusChange(student.id, 'Izin')} /></td>
                        <td><input type="radio" name={`status-${student.id}`} checked={student.status === 'Sakit'} onChange={() => handleStatusChange(student.id, 'Sakit')} /></td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
              <div class={styles.pagination}>
                <span>1-10 of 4</span>
                <select>
                  <option>Kolom per halaman 10</option>
                </select>
                <button disabled>&lt;</button>
                <span>1/4</span>
                <button>&gt;</button>
              </div>
              <div class={styles.actionButtons}>
                {!changesSaved() ? (
                  <>
                    <button class={styles.cancelButton}>Batal</button>
                    <button class={styles.saveButton} onClick={handleSaveChanges}>Simpan perubahan</button>
                  </>
                ) : (
                  <button class={styles.backButton} onClick={handleBack}>Kembali</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Absensi;