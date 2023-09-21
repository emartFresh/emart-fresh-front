/* eslint-disable @typescript-eslint/no-unused-vars */
import Card from "./Card";

interface CouponCardProps {
  totalElements: number;
}
export default function CouponCard({ totalElements }: CouponCardProps) {
  return (
    <Card title="쿠폰 조회">
      <p>총 보유쿠폰은 {totalElements} 장 입니다</p>
    </Card>
  );
}
