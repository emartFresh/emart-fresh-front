export const convertDateToShortForm = (inputDate: string): string => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};


export const formatFullDate = (stringDate: string) : string => {
  const date = new Date(stringDate);
  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초`;

  return formattedDate;
}

export const formatSlashSeparatedDate = (stringDate: string) : string => {
  const date = new Date(stringDate);
  const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return formattedDate;
}

export const formatHyphenSeparatedDate = (stringDate: string) : string => {
  const date = new Date(stringDate);
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return formattedDate;
}
