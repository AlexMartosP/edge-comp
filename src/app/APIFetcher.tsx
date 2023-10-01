"use client";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { useState } from "react";
import Chart from "@/components/Chart";

type Status = "idle" | "pending";
type Data = {
  fetchNum: number;
  edge_processingTime: number;
  serverless_processingTime: number;
  edge_coldStart: boolean;
  serverless_coldStart: boolean;
  edge_endToEndTime: number;
  serverless_endToEndTime: number;
};

export default function APIFetcher() {
  const [selections, setSelections] = useState({
    edge: "global",
    numOfQueries: "1",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<Data[]>([]);

  function updateSelection(key: keyof typeof selections, value: string) {
    setSelections((prev) => ({ ...prev, [key]: value }));
  }

  async function fetchEdge() {
    const startTime = Date.now();

    const res = await fetch(
      `/api/${
        selections.edge === "global" ? "edge-global" : "edge-region"
      }?numofqueries=${selections.numOfQueries}`
    );
    const data = await res.json();

    return {
      edge_processingTime: data.duration,
      edge_coldStart: data.isColdStart,
      edge_endToEndTime: Date.now() - startTime,
    };
  }

  async function fetchServerless() {
    const startTime = Date.now();

    const res = await fetch(
      `/api/serverless?numofqueries=${selections.numOfQueries}`
    );
    const data = await res.json();

    return {
      serverless_processingTime: data.duration,
      serverless_coldStart: data.isColdStart,
      serverless_endToEndTime: Date.now() - startTime,
    };
  }

  async function startFetching() {
    setData([]);
    setStatus("pending");

    for (let i = 1; i <= 10; i++) {
      const [edge, serverless] = await Promise.all([
        fetchEdge(),
        fetchServerless(),
      ]);

      setData((prev) => [
        ...prev,
        {
          fetchNum: i,
          ...edge,
          ...serverless,
        },
      ]);
    }

    setStatus("idle");
  }

  return (
    <div className="p-4 border rounded-md">
      <div>
        <h2 className="font-semibold text-md">Global Edge or Regional Edge</h2>
        <p>Select what to compare Serverless functions to</p>
        <div className="py-1"></div>
        <RadioGroup
          defaultValue={selections.edge}
          onValueChange={(value: string) => updateSelection("edge", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="global" id="global" />
            <Label htmlFor="global">Global Edge</Label>
            <RadioGroupItem value="regional" id="regional" />
            <Label htmlFor="regional">Regional Edge</Label>
          </div>
        </RadioGroup>
        <div className="py-2"></div>
        <h2 className="font-semibold text-md">Number of queries</h2>
        <p>Select number of queries to the database from the route handler</p>
        <RadioGroup defaultValue={selections.numOfQueries}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="1" />
            <Label htmlFor="1">Single query</Label>
            <RadioGroupItem value="2" id="2" />
            <Label htmlFor="2">2 queries</Label>{" "}
            <RadioGroupItem value="5" id="5" />
            <Label htmlFor="5">5 queries</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="py-4"></div>
      <Button disabled={status !== "idle"} onClick={startFetching}>
        {status === "idle" ? "Start fetching" : "Fetching..."}
      </Button>
      <div className="py-4"></div>
      <div className="flex gap-24">
        <div>
          <h2 className="font-semibold text-2xl">Processing time</h2>
          <p>This is the time it took for the route handler to process</p>
          <div className="py-2"></div>
          <Chart
            data={data}
            width={500}
            height={500}
            line1Key="edge_processingTime"
            line2Key="serverless_processingTime"
          />
        </div>
        <div>
          <h2 className="font-semibold text-2xl">End to end time</h2>
          <p>
            This is the time it took for the entire request to get a response
          </p>
          <div className="py-2"></div>
          <Chart
            data={data}
            width={500}
            height={500}
            line1Key="edge_endToEndTime"
            line2Key="serverless_endToEndTime"
          />
        </div>
      </div>
    </div>
  );
}
