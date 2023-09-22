/* eslint-disable @typescript-eslint/no-unused-vars */
import Card from "./Card";

interface ReviewCardProps {
  totalElements?: number;
}
export default function ReviewCard({ totalElements }: ReviewCardProps) {
  return (
    <Card title="내가 쓴 리뷰보기">
      <p>총 리뷰은 {totalElements}건 입니다</p>
    </Card>
  );
}
