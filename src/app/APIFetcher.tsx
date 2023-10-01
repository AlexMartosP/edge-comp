"use client";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { useState } from "react";
import Chart from "@/components/Chart";
import { Checkbox } from "@/components/ui/Checkbox";

type Status = "idle" | "pending";
type Data = {
  fetchNum: number;
  global_processingTime?: number;
  global_coldStart?: boolean;
  global_endToEndTime?: number;
  regional_processingTime?: number;
  regional_coldStart?: boolean;
  regional_endToEndTime?: number;
};

export default function APIFetcher() {
  const [selections, setSelections] = useState({
    edge: {
      global: true,
      regional: false,
    },
    numOfQueries: "1",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<Data[]>([]);

  function updateSelection(key: keyof typeof selections, value: string) {
    if (key === "edge") {
      setSelections((prev) => ({
        ...prev,
        edge: {
          ...prev.edge,
          [value]: !prev.edge[value as "global" | "regional"],
        },
      }));
    } else {
      setSelections((prev) => ({ ...prev, [key]: value }));
    }
  }

  async function fetchGlobalEdge() {
    const startTime = Date.now();

    const res = await fetch(
      `/api/edge-global?numofqueries=${selections.numOfQueries}`
    );
    const data = await res.json();

    return {
      global_processingTime: data.duration,
      global_coldStart: data.isColdStart,
      global_endToEndTime: Date.now() - startTime,
    };
  }

  async function fetchRegionalEdge() {
    const startTime = Date.now();

    const res = await fetch(
      `/api/edge-region?numofqueries=${selections.numOfQueries}`
    );
    const data = await res.json();

    return {
      regional_processingTime: data.duration,
      regional_coldStart: data.isColdStart,
      regional_endToEndTime: Date.now() - startTime,
    };
  }

  async function startFetching() {
    setData([]);
    setStatus("pending");

    for (let i = 1; i <= 5; i++) {
      let edge: Omit<Data, "fetchNum">;

      if (selections.edge.global && selections.edge.regional) {
        const allEdge = await Promise.all([
          fetchGlobalEdge(),
          fetchRegionalEdge(),
        ]);

        edge = {
          ...allEdge[0],
          ...allEdge[1],
        };
      } else if (selections.edge.global) {
        edge = await fetchGlobalEdge();
      } else if (selections.edge.regional) {
        edge = await fetchRegionalEdge();
      }

      setData((prev) => [
        ...prev,
        {
          fetchNum: i,
          ...edge,
        },
      ]);
    }

    setStatus("idle");
  }

  console.log(data);

  return (
    <div className="p-4 border rounded-md">
      <div>
        <h2 className="font-semibold text-md">Global Edge or Regional Edge</h2>
        <p>Select what to compare Serverless functions to</p>
        <div className="py-1"></div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="global"
            value="global"
            checked={selections.edge.global}
            onCheckedChange={() => updateSelection("edge", "global")}
          />
          <Label htmlFor="global">Global edge</Label>
          <Checkbox
            id="regional"
            value="regional"
            checked={selections.edge.regional}
            onCheckedChange={() => updateSelection("edge", "regional")}
          />
          <Label htmlFor="region">Regional edge</Label>
        </div>
        <div className="py-2"></div>
        <h2 className="font-semibold text-md">Number of queries</h2>
        <p>Select number of queries to the database from the route handler</p>
        <RadioGroup
          defaultValue={selections.numOfQueries}
          onValueChange={(value) => updateSelection("numOfQueries", value)}
        >
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
      <Button
        disabled={
          status !== "idle" ||
          (!selections.edge.global && !selections.edge.regional)
        }
        onClick={startFetching}
      >
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
            line1Key="global_processingTime"
            line2Key="regional_processingTime"
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
            line1Key="global_endToEndTime"
            line2Key="regional_endToEndTime"
          />
        </div>
      </div>
    </div>
  );
}
