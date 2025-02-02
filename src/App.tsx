import { ChangeEvent, useState } from "react"
import { For, Show } from "utilinent"
import { getCurrentDateAndDay } from "./util/getCurrentDateAndDay";
import { handleGroupBy } from "./util/formatGroupBy";
import { isAfternoon } from "./util/isAfternoon";
import { create } from "caro-kann";
import { persist } from "caro-kann/middleware";

export type RowItem = {id: number, startAt: string, endAt: string, content: string}

const initValue = [
  { id: Math.random(), startAt: "08:00", endAt: "08:00", content: "" },
  { id: Math.random(), startAt: "08:00", endAt: "08:00", content: "" },
  { id: Math.random(), startAt: "08:00", endAt: "08:00", content: "" },
]

const useRow = create<Array<RowItem>>(persist(initValue, { local: "row" }));

export default function App() {
  const STEP_OPTIONS = [1, 15, 30, 60];
  const [sod, setSod] = useState("");
  const [step, setStep] = useState(1800);
  const [row, setRow] = useRow();

  const handleStepChange = (value: number) => () => setStep(value);
  const handleRowAdd = () => setRow([...row, { id: Math.random(), startAt: "08:00", endAt: "08:00", content: "" }]);
  const handleRowDelete = (id: number) => () => setRow(row.filter((r) => r.id !== id));
  const handleInputChange = (target: "startAt" | "endAt" | "content", id: number) =>
    (e: ChangeEvent<HTMLInputElement>) => setRow(row.map((r) => r.id === id ? { ...r, [target]: e.target.value } : r))

  return (
    <>
      <h1>오늘의 <Show when={isAfternoon()} fallback="SOD">EOD</Show>를 만들어보세요</h1>

      <div>
        <span>시간 단위 : </span>
        <For each={STEP_OPTIONS}>
          {stepI => (
            <button type="button" style={{ backgroundColor: step === 60 * stepI ? "rgba(0,0,220,0.5)" : "" }} key={stepI} onClick={handleStepChange(60 * stepI)}>{stepI}분</button>
          )}
        </For>
      </div>
      
      <p>| 행삭제  | --- 시작 시간 --- | --- 끝나는 시간 --- | 할 일 내용 </p>

      <For each={row}>
        {({ id, startAt, endAt, content }) => {
          return (
            <div key={id} style={{ display: "flex", gap: "10px" }}>
              <button type="button" style={{width: "50px"}} onClick={handleRowDelete(id)}>삭제</button>
              <input 
                type="time"
                step={step}
                style={{width: "120px"}}
                value={startAt} 
                onChange={handleInputChange("startAt", id)}
              />
              <input
                type="time"
                step={step}
                style={{width: "120px"}}
                value={endAt}
                onChange={handleInputChange("endAt", id)}
              />
              <input value={content} style={{flex: "1"}} onChange={handleInputChange("content", id)}/>
          </div>
          )
        }}
      </For>

      <button type="button" onClick={handleRowAdd}>추가</button>
      <br/>
      <br/>
      <br/>
      <button type="button" onClick={handleGroupBy(row, setSod)}>변환하기</button> <button onClick={() => setRow(initValue)}>페이지 초기화</button>
      <br/>
      <br/>
      <br/>
      <Show when={sod}>
        <p>{getCurrentDateAndDay()} [ <Show when={isAfternoon()} fallback="SOD">EOD</Show> ]</p>

        <pre style={{fontSize: "16px"}}>{sod}</pre>

        <Show when={isAfternoon()}>
          <p>오늘의 감상 ----------------------------------------</p>
        </Show>
      </Show>
    </>
  )
}

