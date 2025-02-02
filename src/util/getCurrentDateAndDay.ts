export function getCurrentDateAndDay() {
  const date = new Date();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const day = days[date.getDay()];
  return `${date.toLocaleDateString()} (${day})`;
};
