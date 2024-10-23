import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import styles from './TabelPengguna.module.css';

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  age: number;
  blood_type: string;
  gender: string;
  is_verified: boolean;
  question?: string; // Assuming there's an optional question field
  kecamatan?: string; // Assuming there's an optional kecamatan field
  kabupaten?: string; // Assuming there's an optional kabupaten field
  provinsi?: string;  // Assuming there's an optional provinsi field
}

interface TabelPenggunaProps {
  isDarkMode: boolean; // Properti untuk mode gelap
}

const TabelPengguna: Component<TabelPenggunaProps> = (props) => {
  let gridApi: any;
  let gridColumnApi: any;
  const [editingUser, setEditingUser] = createSignal<UserData | null>(null);
  const [rowData, setRowData] = createSignal<UserData[]>([]);
  const [showAddPopup, setShowAddPopup] = createSignal(false);
  const [showVerifyPopup, setShowVerifyPopup] = createSignal(false);
  const [verifyEmail, setVerifyEmail] = createSignal('');
  const [verifyToken, setVerifyToken] = createSignal('');
  const [newUser, setNewUser] = createSignal<UserData>({
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    age: 0,
    blood_type: '',
    gender: '',
    is_verified: false,
    question: '', // Assuming there's a question field
    kecamatan: '',
    kabupaten: '',
    provinsi: ''
  });

  const columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "First Name", field: "first_name" },
    { headerName: "Last Name", field: "last_name" },
    { headerName: "Email", field: "email" },
    { headerName: "Password", field: "password" },
    { headerName: "Age", field: "age" },
    { headerName: "Blood Type", field: "blood_type" },
    { headerName: "Gender", field: "gender" },
    { headerName: "Verified", field: "is_verified", cellRenderer: (params: any) => (
      params.value ? "Yes" : "No"
    )},
    { headerName: "Kecamatan", field: "kecamatan" },
    { headerName: "Kabupaten", field: "kabupaten" },
    { headerName: "Provinsi", field: "provinsi" },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params: any) => {
        const handleEditButtonClick = () => {
          handleEdit(params.data);
        };

        const handleDeleteButtonClick = () => {
          handleDelete(params.data.id);
        };

        return (
          <div>
            <button
              onClick={handleEditButtonClick}
              class={styles.editButton}
            >
              Edit
            </button>
            <button
              onClick={handleDeleteButtonClick}
              class={styles.deleteButton}
            >
              Hapus
            </button>
          </div>
        );
      },
    },
  ];

  const onGridReady = async (params: any) => {
    gridApi = params.api;
    gridColumnApi = params.columnApi;

    try {
      const response = await fetch('http://127.0.0.1:8080/users');
      if (response.ok) {
        const data = await response.json();
        setRowData(data);
        gridApi.setRowData(data);
      } else {
        console.error('Gagal mengambil data pengguna');
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data:', error);
    }
  };

  const handleEdit = (user: UserData) => {
    setEditingUser({ ...user });
  };

  const handleSave = async () => {
    const updatedUser = editingUser();

    try {
      const response = await fetch('http://127.0.0.1:8080/users/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      const responseData = await response.json();

      if (response.ok) {
        const updatedUsers = rowData().map(user =>
          user.id === updatedUser?.id ? updatedUser : user
        );
        setRowData(updatedUsers);
        gridApi.setRowData(updatedUsers);
        setEditingUser(null);
      } else {
        console.error('Gagal memperbarui pengguna:', responseData);
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat mengupdate data:', error);
    }
  };

  const closePopup = () => {
    setEditingUser(null);
    setShowAddPopup(false); // Close the add popup
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedData = rowData().filter(user => user.id !== id);
        setRowData(updatedData);
        gridApi.setRowData(updatedData);
      } else {
        console.error('Gagal menghapus pengguna');
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat menghapus data:', error);
    }
  };

  const handleAddUser = async () => {
    const existingUser = rowData().find(user => user.email === newUser().email);
  
    if (existingUser) {
      console.error('Pengguna dengan email ini sudah ada');
      alert('Pengguna dengan email ini sudah ada. Silakan gunakan email lain.');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8080/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser()),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        setRowData([...rowData(), responseData]);
        gridApi.setRowData([...rowData(), responseData]);
        setShowAddPopup(false);
        setShowVerifyPopup(true); // Show verify popup
        setNewUser({
          id: 0,
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          age: 0,
          blood_type: '',
          gender: '',
          is_verified: false,
          question: '',
          kecamatan: '',
          kabupaten: '',
          provinsi: ''
        }); // Reset the form
      } else {
        console.error('Gagal menambahkan pengguna:', responseData);
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat menambahkan data:', error);
    }
  };

  const handleVerify = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/verifikasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: verifyEmail(), otp: verifyToken() }),
      });
  
      if (response.ok) {
        alert('Email telah diverifikasi');
        setShowVerifyPopup(false);
      } else {
        const errorText = await response.text();
        alert(`Verifikasi gagal: ${errorText}`);
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };

  return (
    <div class={`${styles.container} ${props.isDarkMode ? styles.darkMode : 'ag-theme-alpine'}`}>
      <h1 class={styles.title}>Tabel Pengguna</h1>
      <button onClick={() => setShowAddPopup(true)} class={styles.addButton}>Tambah</button>
      <button onClick={() => setShowVerifyPopup(true)} class={styles.verifikasiButton}>Verifikasi</button>
      <div style={{ height: '400px', width: '100%' }}>
      <AgGridSolid
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, filter: true }}
          rowData={rowData()}
          onGridReady={onGridReady}
        />
      </div>
      {editingUser() && (
        <div class={styles.popup}>
          <div class={styles.popupContent}>
            <h2>Edit User</h2>
            <div class={styles.editForm}>
              <label>
                First Name:
                <input
                  type="text"
                  value={editingUser()?.first_name}
                  onInput={(e) => setEditingUser({ ...editingUser()!, first_name: e.target.value })}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  value={editingUser()?.last_name}
                  onInput={(e) => setEditingUser({ ...editingUser()!, last_name: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={editingUser()?.email}
                  readonly
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={editingUser()?.password}
                  readonly
                />
              </label>
              <label>
                Age:
                <input
                  type="number"
                  value={editingUser()?.age}
                  onInput={(e) => setEditingUser({ ...editingUser()!, age: parseInt(e.target.value) })}
                />
              </label>
              <label>
                Blood Type:
                <select
                  value={editingUser()?.blood_type}
                  onChange={(e) => setEditingUser({ ...editingUser()!, blood_type: e.target.value })}
                >
                  <option value="">Select Blood Type</option>
                  <option value="A">A</option>
                  <option value="AB">AB</option>
                  <option value="B">B</option>
                  <option value="O">O</option>
                </select>
              </label>
              <label>
                Gender:
                <select
                  value={editingUser()?.gender}
                  onChange={(e) => setEditingUser({ ...editingUser()!, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
              <label>
                Kecamatan:
                <input
                  type="text"
                  value={editingUser()?.kecamatan}
                  onInput={(e) => setEditingUser({ ...editingUser()!, kecamatan: e.target.value })}
                />
              </label>
              <label>
                Kabupaten:
                <input
                  type="text"
                  value={editingUser()?.kabupaten}
                  onInput={(e) => setEditingUser({ ...editingUser()!, kabupaten: e.target.value })}
                />
              </label>
              <label>
                Provinsi:
                <input
                  type="text"
                  value={editingUser()?.provinsi}
                  onInput={(e) => setEditingUser({ ...editingUser()!, provinsi: e.target.value })}
                />
              </label>
              <button onClick={handleSave}>Save</button>
              <button onClick={closePopup} class={styles.closeButton}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showAddPopup() && (
        <div class={styles.popup}>
          <div class={styles.popupContent}>
            <h2>Add User</h2>
            <div class={styles.editForm}>
              <label>
                First Name:
                <input
                  type="text"
                  value={newUser().first_name}
                  onInput={(e) => setNewUser({ ...newUser(), first_name: e.target.value })}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  value={newUser().last_name}
                  onInput={(e) => setNewUser({ ...newUser(), last_name: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={newUser().email}
                  onInput={(e) => setNewUser({ ...newUser(), email: e.target.value })}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={newUser().password}
                  onInput={(e) => setNewUser({ ...newUser(), password: e.target.value })}
                />
              </label>
              <label>
                Age:
                <input
                  type="number"
                  value={newUser().age}
                  onInput={(e) => setNewUser({ ...newUser(), age: parseInt(e.target.value) })}
                />
              </label>
              <label>
                Blood Type:
                <select
                  value={newUser().blood_type}
                  onChange={(e) => setNewUser({ ...newUser(), blood_type: e.target.value })}
                >
                  <option value="">Select Blood Type</option>
                  <option value="A">A</option>
                  <option value="AB">AB</option>
                  <option value="B">B</option>
                  <option value="O">O</option>
                </select>
              </label>
              <label>
                Gender:
                <select
                  value={newUser().gender}
                  onChange={(e) => setNewUser({ ...newUser(), gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
              <label>
                Question:
                <input
                  type="text"
                  value={newUser().question}
                  onInput={(e) => setNewUser({ ...newUser(), question: e.target.value })}
                />
              </label>
              <label>
                Kecamatan:
                <input
                  type="text"
                  value={newUser().kecamatan}
                  onInput={(e) => setNewUser({ ...newUser(), kecamatan: e.target.value })}
                />
              </label>
              <label>
                Kabupaten:
                <input
                  type="text"
                  value={newUser().kabupaten}
                  onInput={(e) => setNewUser({ ...newUser(), kabupaten: e.target.value })}
                />
              </label>
              <label>
                Provinsi:
                <input
                  type="text"
                  value={newUser().provinsi}
                  onInput={(e) => setNewUser({ ...newUser(), provinsi: e.target.value })}
                />
              </label>
              <button onClick={handleAddUser}>Add</button>
              <button onClick={() => setShowAddPopup(false)} class={styles.closeButton}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showVerifyPopup() && (
        <div class={styles.popup}>
          <div class={styles.popupContent}>
            <h2>Verify Email</h2>
            <div class={styles.verifyForm}>
              <label>
                Masukkan Email:
                <input
                  type="email"
                  value={verifyEmail()}
                  onInput={(e) => setVerifyEmail(e.target.value)}
                />
              </label>
              <label>
                Masukkan Kode OTP:
                <input
                  type="text"
                  value={verifyToken()}
                  onInput={(e) => setVerifyToken(e.target.value)}
                />
              </label>
              <button onClick={handleVerify}>Confirm</button>
              <button onClick={() => setShowVerifyPopup(false)} class={styles.closeButton}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabelPengguna;

