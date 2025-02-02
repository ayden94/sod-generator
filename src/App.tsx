import { ChangeEvent, useState } from "react"
import { For, Show } from "utilinent"
import { getCurrentDateAndDay } from "./util/getCurrentDateAndDay";
import { handleGroupBy } from "./util/formatGroupBy";
import { isAfternoon } from "./util/isAfternoon";

export type RowItem = {id: number, startAt: string, endAt: string, content: string}

export default function App() {
  const STEP_OPTIONS = [1, 15, 30, 60];
  const [sod, setSod] = useState("");
  const [step, setStep] = useState(1800);
  const [row, setRow] = useState<Array<RowItem>>([
    { id: Math.random(), startAt: "08:00", endAt: "08:00", content: "" },
    { id: Math.random(), startAt: "08:00", endAt: "08:00", content: "" },
    { id: Math.random(), startAt: "08:00", endAt: "08:00", content: "" },
  ])

  const handleStepChange = (value: number) => () => setStep(value);
  const handleRowAdd = () => setRow([...row, { id: Math.random(), startAt: "08:00", endAt: "08:00", content: "" }]);
  const handleRowDelete = (id: number) => () => setRow(row.filter((r) => r.id !== id));
  const handleInputChange = (target: "startAt" | "endAt" | "content", id: number) =>
    (e: ChangeEvent<HTMLInputElement>) => setRow(row.map((r) => r.id === id ? { ...r, [target]: e.target.value } : r))

  return (
    <>
      <div>
        <span>시간 단위 : </span>
        <For each={STEP_OPTIONS}>
          {step => (
            <button type="button" key={step} onClick={handleStepChange(60 * step)}>{step}분</button>
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
                style={{width: "120px"}}
                step={step}
                value={startAt} 
                onChange={handleInputChange("startAt", id)}
              />
              <input
                type="time" 
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
      <button type="button" onClick={handleGroupBy(row, setSod)}>변환하기</button>
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

