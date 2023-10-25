export function formatCurrency(amount: number): string {
  const formattedAmount = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedAmount;
}

export function getTruncateString(
  inputString: string,
  maxLength: number
): string {
  if (inputString.length <= maxLength) {
    return inputString;
  }

  const truncatedString = inputString.slice(0, maxLength - 3); // 원하는 길이보다 3 작게 자름
  return truncatedString + "...";
}

export function formatKoreanCurrency(amount: number): string {
  const formattedAmount = amount.toLocaleString("ko-KR");

  return formattedAmount;
}
