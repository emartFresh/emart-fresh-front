import styles from "../page_css/MakeStore.module.css";

export default function UserInfoSide({
  memberInfo,
  certifImg,
}: {
  memberInfo: MemberData;
  certifImg: string;
}) {
  return (
    <div className={styles.infoWrapper}>
      <div className={styles.imgWrapper}>
        <img className={styles.certfImg} src={certifImg} alt="" />
      </div>
      <div>
        <div className={styles.title}>유저 이름 </div>
        <div className={styles.content}>{memberInfo?.memberName}</div>
      </div>
      <div>
        <div className={styles.title}>유저 이메일 </div>
        <div className={styles.content}>{memberInfo?.memberEmail}</div>
      </div>
      <div>
        <div>경고횟수 </div>
        <div className={styles.content}> {memberInfo?.memberWarning}</div>
      </div>
    </div>
  );
}
