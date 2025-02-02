import { Dispatch, SetStateAction } from "react";
import { RowItem } from "../App";

export function handleGroupBy(row: Array<RowItem>, setSod: Dispatch<SetStateAction<string>>) {
  return () => {
    const { morning, afternoon } = groupBy(row);

    const morningSod = formatGroupBy(morning);
    const afternoonSod = formatGroupBy(afternoon);

    setSod(["오전", morningSod, `\n`, "오후", afternoonSod].join("\n"));
}}

function formatGroupBy(row: Array<RowItem>) {
  return row.sort((a, b) => a.startAt.localeCompare(b.startAt))
    .map(({ startAt, endAt, content }) => `- [ ] ${startAt} ~ ${endAt} : ${content}`)
    .join("\n");
}

function groupBy(row: Array<RowItem>) {
  return Object.values(row).reduce((acc: { morning: Array<RowItem>, afternoon: Array<RowItem> }, item) => {
    const hour = parseInt(item.startAt.split(":")[0], 10);
    const key = hour < 12 ? "morning" : "afternoon";
    (acc[key] = acc[key] || []).push(item);
    return acc;
    }, { morning: [], afternoon: []}
  )
}