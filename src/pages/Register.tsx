import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import styles from './Register.module.css';
import LogoWeb from './img/LogoWeb.svg';
import LogoUser from './img/LogoUser.svg';
import LogoEmail from './img/LogoEmail.svg';
import LogoPassword from './img/LogoPassword.svg';
import LogoHidePassword from './img/LogoHidePassword.svg';
import GenderPria from './img/GenderPria.svg';
import GenderWanita from './img/GenderWanita.svg';

// Data Provinsi, Kabupaten, dan Kecamatan
const locationData = {
  sumatra: {
    "Sumatra Utara": {
      "Medan": ["Medan Kota", "Medan Amplas"],
      "Deliserdang": ["Lubuk Pakam", "Batang Kuis"]
    },
    "Sumatra Selatan": {
      "Palembang": ["Ilir Timur", "Seberang Ulu"],
      "Banyuasin": ["Banyuasin I", "Banyuasin II"]
    },
    "Aceh": {
      "Banda Aceh": ["Baiturrahman", "Kuta Alam"],
      "Aceh Besar": ["Darul Imarah", "Lhoong"]
    }
  },
  jawa: {
    "Jakarta": {
      "Jakarta Pusat": ["Gambir", "Menteng"],
      "Jakarta Selatan": ["Kebayoran Baru", "Pasar Minggu"]
    },
    "Jawa Barat": {
      "Bandung": ["Cicendo", "Coblong"],
      "Bekasi": ["Bekasi Utara", "Bekasi Timur"]
    },
    "Jawa Tengah": {
      "Semarang": ["Semarang Barat", "Semarang Timur"],
      "Surakarta": ["Laweyan", "Serengan"]
    },
    "Jawa Timur": {
      "Surabaya": ["Rungkut", "Tegalsari"],
      "Malang": ["Klojen", "Lowokwaru"]
    }
  },
  kalimantan: {
    "Kalimantan Barat": {
      "Pontianak": ["Pontianak Kota", "Pontianak Utara"],
      "Kubu Raya": ["Sungai Raya", "Teluk Pakedai"]
    },
    "Kalimantan Timur": {
      "Balikpapan": ["Balikpapan Selatan", "Balikpapan Utara"],
      "Samarinda": ["Samarinda Utara", "Samarinda Kota"]
    },
    "Kalimantan Selatan": {
      "Banjarmasin": ["Banjarmasin Utara", "Banjarmasin Selatan"],
      "Banjarbaru": ["Cempaka", "Landasan Ulin"]
    }
  }
};

export default function Register() {
  const [isPasswordVisible, setIsPasswordVisible] = createSignal(false);
  const [selectedGender, setSelectedGender] = createSignal('');
  const [firstName, setFirstName] = createSignal('');
  const [lastName, setLastName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [age, setAge] = createSignal('');
  const [bloodType, setBloodType] = createSignal('');
  const [question, setQuestion] = createSignal('');
  const [selectedProvince, setSelectedProvince] = createSignal('');
  const [selectedKabupaten, setSelectedKabupaten] = createSignal('');
  const [selectedKecamatan, setSelectedKecamatan] = createSignal('');
  const [popupMessage, setPopupMessage] = createSignal('');
  const [popupVisible, setPopupVisible] = createSignal(false);
  const [popupColor, setPopupColor] = createSignal('');
  const [showOtpPopup, setShowOtpPopup] = createSignal(false);
  const [otp, setOtp] = createSignal('');
  const navigate = useNavigate();

  // Data untuk Kabupaten dan Kecamatan berdasarkan provinsi yang dipilih
  const getKabupaten = () => {
    if (!selectedProvince()) return [];
    const provinceData = Object.values(locationData).find(pulau =>
      pulau[selectedProvince()]
    );
    return provinceData ? Object.keys(provinceData[selectedProvince()]) : [];
  };

  const getKecamatan = () => {
    if (!selectedKabupaten()) return [];
    const provinceData = Object.values(locationData).find(pulau =>
      pulau[selectedProvince()]
    );
    return provinceData[selectedProvince()][selectedKabupaten()] || [];
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible());
  };

  const handleGenderSelection = (gender) => {
    if (gender === 'pria') {
      setSelectedGender('Male');
    } else if (gender === 'wanita') {
      setSelectedGender('Female');
    }
  };

  const handleRegisterClick = async () => {
    let valid = true;
    let message = '';
  
    // Validasi input sesuai kebutuhan...
    if (!firstName() || firstName().length < 4) {
      message = 'Nama Awal harus memiliki minimal 4 karakter!';
      valid = false;
    } else if (!lastName() || lastName().length < 4) {
      message = 'Nama Akhir harus memiliki minimal 4 karakter!';
      valid = false;
    } else if (!email() || !email().endsWith('@gmail.com')) {
      message = 'Email harus menggunakan @gmail.com!';
      valid = false;
    } else if (!password() || !/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&!])[A-Za-z\d@#$%^&!]{8,}$/.test(password())) {
      message = 'Password harus mengandung minimal satu huruf kapital, angka, dan karakter khusus seperti @, #, $, %, dll!';
      valid = false;
    } else if (!age() || !selectedGender() || !bloodType() || !question()) {
      message = 'Silahkan Isi Data Terlebih Dahulu!';
      valid = false;
    } else if (!selectedProvince() || !selectedKabupaten() || !selectedKecamatan()) {
      message = 'Silahkan pilih Provinsi, Kabupaten, dan Kecamatan!';
      valid = false;
    }
  
    if (!valid) {
      setPopupMessage(message);
      setPopupColor('red');
      showPopup();
      return;
    }
  
    // Urutan data yang sesuai dengan Backend (first_name, last_name, email, password, age, blood_type, gender, otp, is_verified, question, kecamatan, kabupaten, provinsi)
    const userData = {
      first_name: firstName(),
      last_name: lastName(),
      email: email(),
      password: password(),
      age: parseInt(age(), 10),
      blood_type: bloodType(),
      gender: selectedGender(),
      otp: '', // OTP akan dihasilkan di Backend
      is_verified: false, // Verifikasi diatur di Backend
      question: question(), // Field untuk pertanyaan keamanan atau lainnya
      kecamatan: selectedKecamatan(),
      kabupaten: selectedKabupaten(),
      provinsi: selectedProvince(),
    };
  
    try {
      const response = await fetch('http://127.0.0.1:8080/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        setPopupMessage('Pengisian Data Berhasil. Silahkan Verifikasi Email Anda!');
        setPopupColor('green');
        showPopup();
        setShowOtpPopup(true); // Tampilkan popup untuk OTP jika diperlukan
      } else {
        const errorText = await response.text();
        setPopupMessage(`Terjadi Kesalahan: ${errorText}`);
        setPopupColor('red');
        showPopup();
      }
    } catch (error) {
      setPopupMessage(`Terjadi Kesalahan: ${error.message}`);
      setPopupColor('red');
      showPopup();
    }
  };
  

  const handleOtpVerifyClick = async () => {
    if (!otp()) {
      setPopupMessage('Masukkan Kode OTP!');
      setPopupColor('red');
      showPopup();
    } else {
      try {
        const response = await fetch('http://127.0.0.1:8080/verifikasi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email(), otp: otp() }),
        });

        if (response.ok) {
          setPopupMessage('Email telah terverifikasi. Silahkan Login!');
          setPopupColor('green');
          showPopup();
          setTimeout(() => navigate('/login'), 5000);
        } else {
          const errorText = await response.text();
          setPopupMessage(`Verifikasi Gagal: ${errorText}`);
          setPopupColor('red');
          showPopup();
        }
      } catch (error) {
        setPopupMessage(`Terjadi Kesalahan: ${error.message}`);
        setPopupColor('red');
        showPopup();
      }
    }
  };

  const showPopup = () => {
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 5000);
  };

  return (
    <section class={styles.registerContainer}>
      <div class={styles.formContainer}>
        <div class={styles.logoContainer}>
          <img src={LogoWeb} alt="Logo" class={styles.logo} />
        </div>
        <h1 class={styles.title}>Daftarkan Diri Anda</h1>

                {/* Input nama, email, password, dll */}
                <div class={styles.inputRow}>
          <div class={styles.formGroup}>
            <label>Nama Awal</label>
            <div class={styles.inputGroup}>
              <img src={LogoUser} alt="User" />
              <input 
                type="text" 
                placeholder="Masukan Nama Pertama ..." 
                onInput={(e) => setFirstName(e.currentTarget.value)}
              />
            </div>
            {firstName().length < 4 && firstName() && (
              <p class={styles.warningMessage}>Nama Awal harus memiliki minimal 4 karakter!</p>
            )}
          </div>
          <div class={styles.formGroup}>
            <label>Nama Akhir</label>
            <div class={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="Masukan Nama Terakhir ..." 
                onInput={(e) => setLastName(e.currentTarget.value)}
              />
            </div>
            {lastName().length < 4 && lastName() && (
              <p class={styles.warningMessage}>Nama Akhir harus memiliki minimal 4 karakter!</p>
            )}
          </div>
        </div>

        <div class={styles.inputRow}>
          <div class={styles.formGroup}>
            <label>Email</label>
            <div class={styles.inputGroup}>
              <img src={LogoEmail} alt="Email" />
              <input 
                type="email" 
                placeholder="Masukkan Email Anda ..." 
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            {email() && !email().endsWith('@gmail.com') && (
              <p class={styles.warningMessage}>Email harus menggunakan @gmail.com!</p>
            )}
          </div>
          <div class={styles.formGroup}>
            <label>Password</label>
            <div class={styles.inputGroup}>
              <img src={LogoPassword} alt="Password" />
              <input 
                type={isPasswordVisible() ? 'text' : 'password'} 
                placeholder="Masukkan Password Anda ..." 
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
              <img 
                src={isPasswordVisible() ? LogoHidePassword : LogoHidePassword} 
                alt="Show/Hide Password" 
                onClick={togglePasswordVisibility}
              />
            </div>
            {password() && !/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&!])[A-Za-z\d@#$%^&!]{8,}$/.test(password()) && (
              <p class={styles.warningMessage}>Password harus mengandung minimal satu huruf kapital, angka, dan karakter khusus seperti @, #, $, %, dll!</p>
            )}
          </div>
        </div>

        <div class={styles.inputRow}>
          <div class={styles.formGroup}>
            <label>Umur</label>
            <div class={styles.inputGroup}>
              <input 
                type="number" 
                placeholder="Masukkan Umur Anda ..." 
                onInput={(e) => setAge(e.currentTarget.value)}
              />
            </div>
          </div>
          <div class={styles.formGroup}>
            <label>Jenis Kelamin</label>
            <div class={styles.genderSelection}>
              <div 
                class={`${styles.genderOption} ${selectedGender() === 'Male' ? styles.selected : ''}`} 
                onClick={() => handleGenderSelection('pria')}
              >
                <img src={GenderPria} alt="Male" />
                <span>Pria</span>
              </div>
              <div 
                class={`${styles.genderOption} ${selectedGender() === 'Female' ? styles.selected : ''}`} 
                onClick={() => handleGenderSelection('wanita')}
              >
                <img src={GenderWanita} alt="Female" />
                <span>Wanita</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Lokasi: Provinsi, Kabupaten, Kecamatan */}
        <div class={styles.inputRow}>
          <div class={styles.formGroup}>
            <label>Provinsi</label>
            <div class={styles.inputGroup}>
              <select
                value={selectedProvince()}
                onChange={(e) => {
                  setSelectedProvince(e.currentTarget.value);
                  setSelectedKabupaten('');
                  setSelectedKecamatan('');
                }}
                class={styles.selectInput}
              >
                <option value="" disabled>Pilih Provinsi</option>
                {Object.keys(locationData).map((pulau) => (
                  Object.keys(locationData[pulau]).map((province) => (
                    <option value={province}>{province}</option>
                  ))
                ))}
              </select>
            </div>
          </div>

          <div class={styles.formGroup}>
            <label>Kabupaten</label>
            <div class={styles.inputGroup}>
              <select
                value={selectedKabupaten()}
                onChange={(e) => setSelectedKabupaten(e.currentTarget.value)}
                disabled={!selectedProvince()}
                class={styles.selectInput}
              >
                <option value="" disabled>Pilih Kabupaten</option>
                {getKabupaten().map((kabupaten) => (
                  <option value={kabupaten}>{kabupaten}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div class={styles.inputRow}>
          <div class={styles.formGroup}>
            <label>Kecamatan</label>
            <div class={styles.inputGroup}>
              <select
                value={selectedKecamatan()}
                onChange={(e) => setSelectedKecamatan(e.currentTarget.value)}
                disabled={!selectedKabupaten()}
                class={styles.selectInput}
              >
                <option value="" disabled>Pilih Kecamatan</option>
                {getKecamatan().map((kecamatan) => (
                  <option value={kecamatan}>{kecamatan}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div class={styles.inputRow}>
          <div class={styles.formGroup}>
            <label>Golongan Darah</label>
            <div class={styles.inputGroup}>
              <select
                value={bloodType()} 
                onChange={(e) => setBloodType(e.currentTarget.value)}
                class={styles.selectInput}
              >
                <option value="" disabled>Pilih Golongan Darah</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
          </div>
          <div class={styles.formGroup}>
            <label>Pertanyaan Keamanan</label>
            <div class={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="Masukkan Pertanyaan Keamanan ..." 
                onInput={(e) => setQuestion(e.currentTarget.value)}
              />
            </div>
          </div>
        </div>

        <button class={styles.registerButton} onClick={handleRegisterClick}>
          Daftar
        </button>
        {popupVisible() && (
          <div class={`${styles.popup} ${styles[popupColor()]}`}>
            {popupMessage()}
          </div>
        )}
        {showOtpPopup() && (
          <div class={styles.otpPopup}>
            <h2>Verifikasi Email</h2>
            <input 
              type="text" 
              placeholder="Masukkan Kode OTP ..." 
              onInput={(e) => setOtp(e.currentTarget.value)}
            />
            <button class={styles.verifyButton} onClick={handleOtpVerifyClick}>
              Verifikasi
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
