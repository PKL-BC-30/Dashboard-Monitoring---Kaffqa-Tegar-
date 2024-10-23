import { createSignal } from 'solid-js';
import './Switch.css'; // Pastikan untuk mengimpor file CSS

const Switch = (props) => {
  const [isChecked, setIsChecked] = createSignal(false);

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setIsChecked(target.checked);
    props.onToggle(target.checked); // Panggil fungsi dari prop onToggle dengan nilai baru
  };

  return (
    <label class="switch">
      <input
        type="checkbox"
        class="theme-checkbox"
        checked={isChecked()}
        onChange={handleChange}
      />
      <span class="slider"></span>
    </label>
  );
};

export default Switch;
