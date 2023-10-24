import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import styles from "./comp_css/ToTopBtn.module.css";

export default function ToTopBtn() {
  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={styles.toTopBtn}
      onClick={() => {
        goToTop();
      }}
    >
      <ExpandLessIcon />
    </button>
  );
}
