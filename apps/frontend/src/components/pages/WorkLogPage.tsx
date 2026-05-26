"use client";
import { useState } from "react";
import Header from "../_shared/Header";
import WorkLogContent from "../_shared/WorkLogContent";

export default function WorkLogPage() {
  const [date, setDate] = useState("");

  return (
    <div className="flex-1 space-y-5">
      <Header value={date} onChange={setDate} />
      <WorkLogContent date={date} />
    </div>
  );
}
