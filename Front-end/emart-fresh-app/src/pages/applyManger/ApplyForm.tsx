import { GetUserAllInfo } from "../../utils/LoginUtils";
import styles from "../page_css/ApplyManager.module.css";

export default function ApplyForm() {
  const userInfo = GetUserAllInfo();
  return (
    <div className={styles.applyManagerWrapper}>
      <div>{userInfo.memberName}님의 점주 신청 화면</div>
      <table>
        <tbody>
          <tr>
            <th>상태</th>
            <td>22</td>
          </tr>
          <tr>
            <th>신청일</th>
            <td>22</td>
          </tr>
          <tr>
            <th>사업자 등록증</th>
            <td>22</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
