  import { createSignal } from 'solid-js';
  import { useNavigate } from '@solidjs/router';
  import styles from './Login.module.css';
  import LogoWeb from './img/LogoWeb.svg';
  import LogoEmail from './img/LogoEmailWhite.svg';
  import LogoPassword from './img/LogoPasswordWhite.svg';
  import LogoHidePassword from './img/LogoHidePasswordWhite.svg';
  import ContentJapan from './img/ContentJapan.svg';
  import Google from './img/Google.svg';

  export default function Login() {
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [passwordVisible, setPasswordVisible] = createSignal(false);
    const [popupMessage, setPopupMessage] = createSignal('');
    const [popupVisible, setPopupVisible] = createSignal(false);
    const [popupColor, setPopupColor] = createSignal('');
    const [forgotPasswordPopupVisible, setForgotPasswordPopupVisible] = createSignal(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = createSignal('');
    const [newPassword, setNewPassword] = createSignal('');
    const [questionAnswer, setQuestionAnswer] = createSignal('');
    const navigate = useNavigate();
    const [verificationPopupVisible, setVerificationPopupVisible] = createSignal(false);
    const [verificationEmail, setVerificationEmail] = createSignal('');
    const [verificationOtp, setVerificationOtp] = createSignal('');


    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible());
    };

    const handleLoginClick = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8080/users/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: email(), password: password() }),
          });

          const data = await response.json();

          if (response.ok) {
              if (!data.is_verified) {
                  // Jika belum diverifikasi, tampilkan pop-up verifikasi
                  setVerificationEmail(email());
                  setVerificationPopupVisible(true);
              } else {
                  localStorage.setItem('token', data.token); 
                  localStorage.setItem('userId', data.user_id);// Simpan token jika perlu
                  navigate('/dashboard');
              }
          } else {
              setPopupMessage(data.message || 'Login failed');
              setPopupColor('red');
              showPopup();
          }
      } catch (error) {
          console.error('Error during login:', error);
          setPopupMessage('Login failed');
          setPopupColor('red');
          showPopup();
      }
  };


    const handleForgotPasswordClick = () => {
      setForgotPasswordPopupVisible(true);
    };

    const handleForgotPasswordSubmit = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/users/lupapassword', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: forgotPasswordEmail(),
            new_password: newPassword(),
            question_answer: questionAnswer(), // Include question_answer
          }),
        });

        const data = await response.text();

        if (response.ok) {
          setPopupMessage('Password berhasil diperbarui. Silakan login ulang.');
          setPopupColor('green');
          setForgotPasswordPopupVisible(false);

          // Arahkan ke halaman login setelah beberapa detik
          setTimeout(() => {
            navigate('/login');
          }, 3000); // Redirect after 3 seconds
        } else if (response.status === 401) {
          setPopupMessage('Email atau jawaban pertanyaan tidak sesuai');
          setPopupColor('red');
        } else {
          setPopupMessage(data || 'Gagal memperbarui password');
          setPopupColor('red');
        }
        showPopup();
      } catch (error) {
        console.error('Error during password reset:', error);
        setPopupMessage('Gagal memperbarui password');
        setPopupColor('red');
        showPopup();
      }
    };

    const handleVerificationSubmit = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8080/verifikasi', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  email: verificationEmail(),
                  otp: verificationOtp(),
              }),
          });

          const data = await response.text();

          if (response.ok) {
              setPopupMessage('Email has been verified, please log in again.');
              setPopupColor('green');
              setVerificationPopupVisible(false);

              // Redirect ke halaman login setelah beberapa detik
              setTimeout(() => {
                  navigate('/login');
              }, 3000); // Redirect after 3 seconds
          } else {
              setPopupMessage(data || 'Verification failed');
              setPopupColor('red');
              showPopup();
          }
      } catch (error) {
          console.error('Error during verification:', error);
          setPopupMessage('Verification failed');
          setPopupColor('red');
          showPopup();
      }
  };


    const showPopup = () => {
      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
      }, 5000);
    };

    return (
      <section class={styles.loginContainer}>
        <div class={styles.formContainer}>
          <div class={styles.logoContainer}>
            <img src={LogoWeb} alt="Logo" class={styles.logo} />
          </div>
          <h1 class={styles.title}>Silahkan Login Terlebih Dahulu</h1>
          <div class={`${styles.formGroup} ${styles.wideInputGroup}`}>
            <label>Email</label>
            <div class={`${styles.inputGroup} ${styles.wideInput}`}>
              <img src={LogoEmail} alt="Email" />
              <input 
                type="email" 
                placeholder="Masukan Email Anda ..." 
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
          </div>
          <div class={`${styles.formGroup} ${styles.wideInputGroup}`}>
            <label>Password</label>
            <div class={`${styles.inputGroup} ${styles.wideInput}`}>
              <img src={LogoPassword} alt="Password" />
              <input
                type={passwordVisible() ? 'text' : 'password'}
                placeholder="Masukan Password Anda ..."
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
              <img
                src={LogoHidePassword}
                alt="Toggle Password"
                class={styles.togglePassword}
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
          <a href="#" class={styles.forgotPassword} onClick={handleForgotPasswordClick}>Lupa Password ?</a>
          <button class={styles.loginButton} onClick={handleLoginClick}>LOGIN</button>
          <button class={styles.googleButton}>
            <img src={Google} alt="Google Icon" class={styles.googleIcon} />
            Lanjutkan Dengan Google
          </button>
          <p class={styles.footerText}>
            Belum Mempunyai Akun? <span class={styles.registerLink} onClick={() => navigate('/register')}>Register</span>
          </p>
        </div>
        
        {/* Popup Notification */}
        {popupVisible() && (
          <div class={styles.popup} style={{ background: popupColor() }}>
            {popupMessage()}
          </div>
        )}

        {/* Forgot Password Popup */}
        {forgotPasswordPopupVisible() && (
          <div class={styles.forgotPasswordPopup}>
            <div class={styles.popupContent}>
              <h2>Reset Password</h2>
              <div class={styles.formGroup}>
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="Masukan Email Anda ..." 
                  onInput={(e) => setForgotPasswordEmail(e.currentTarget.value)}
                />
              </div>
              <div class={styles.formGroup}>
                <label>Password Baru</label>
                <input 
                  type={passwordVisible() ? 'text' : 'password'}
                  placeholder="Masukan Password Baru Anda ..."
                  onInput={(e) => setNewPassword(e.currentTarget.value)}
                />
              </div>
              <div class={styles.formGroup}>
                <label>Jawaban Pertanyaan Keamanan</label>
                <input 
                  type="text" 
                  placeholder="Masukan Jawaban Pertanyaan Keamanan Anda ..."
                  onInput={(e) => setQuestionAnswer(e.currentTarget.value)}
                />
              </div>
              <div class={styles.buttonGroup}>
                <button class={styles.resetButton} onClick={handleForgotPasswordSubmit}>Reset Password</button>
                <button class={styles.cancelButton} onClick={() => setForgotPasswordPopupVisible(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Verification Popup */}
        {verificationPopupVisible() && (
            <div class={styles.verificationPopup}>
                <div class={styles.popupContent}>
                    <h2>Verifikasi Akun</h2>
                    <p>Akun anda belum melakukan verifikasi silahkan melakukan verifikasi terlebih dahulu!</p>
                    <div class={styles.formGroup}>
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={verificationEmail()}
                            readonly
                        />
                    </div>
                    <div class={styles.formGroup}>
                        <label>Kode OTP</label>
                        <input 
                            type="text" 
                            placeholder="Masukan Kode OTP Anda ..."
                            onInput={(e) => setVerificationOtp(e.currentTarget.value)}
                        />
                    </div>
                    <div class={styles.buttonGroup}>
                        <button class={styles.verifyButton} onClick={handleVerificationSubmit}>Verifikasi</button>
                        <button class={styles.closeButton} onClick={() => setVerificationPopupVisible(false)}>Close</button>
                    </div>
                </div>
            </div>
        )}


        <div class={styles.contentImageContainer}>
          <img src={ContentJapan} alt="Content Japan" class={styles.contentImage} />
        </div>
      </section>
    );
  }
