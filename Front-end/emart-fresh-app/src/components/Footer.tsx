import styles from "./comp_css/Footer.module.css";
import GitHubIcon from "../../src/assets/images/github-logo.svg";
import NotionIcon from "../../src/assets/images/notion-logo.svg";
export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContentWrapper}>
          <p>
            신세계 I&C KDT과정 fianl project <br />
          </p>
          <p>
            팀장 - 정진성 <br />
            프론트 엔드- 김예원, 강창희, 정진성 <br />
            백엔드 - 최무진, 김현민, 정진성
          </p>
        </div>
        <div>
          <a
            href="https://github.com/orgs/emartFresh/repositories"
            target="_blank"
          >
            <img className={styles.logoImg} src={GitHubIcon} alt="" />
          </a>
          <a
            className={styles.logo}
            href="https://github.com/orgs/emartFresh/repositories"
            target="_blank"
          ></a>
          <a
            className={styles.logo}
            href="https://agate-spectacles-58a.notion.site/KDT-741249c98b9c47f7a710a4e549a4990f"
            target="_blank"
          >
            <img className={styles.logoImg} src={NotionIcon} alt="" />
          </a>
        </div>
      </footer>
    </>
  );
}
