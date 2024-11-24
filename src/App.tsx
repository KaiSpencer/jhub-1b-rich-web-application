import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { useState } from "react";
import { Label } from "./components/ui/label";
import { FloodData } from "./types";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import ThreeDotsBounce from "./components/ui/loading";

function App() {
  const [maxItems, setMaxItems] = useState(10);
  const [severityLevel, setSeverityLevel] = useState<number | undefined>();
  const [county, setCounty] = useState<string | undefined>();
  const [currentCountyValue, setCurrentCountyValue] = useState<
    string | undefined
  >();

  const url = `https://environment.data.gov.uk/flood-monitoring/id/floods?_limit=${maxItems}${
    severityLevel ? `&severityLevel=${severityLevel}` : ""
  }${currentCountyValue ? `&county=${currentCountyValue}` : ""}`;

  const floodsQuery = useQuery({
    queryKey: ["floods", maxItems, severityLevel, currentCountyValue],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch flood data");
      }
      return (await response.json()) as FloodData;
    },
  });

  return (
    <div className="m-10">
      <div className="text-xl">Query Flood data</div>
      <div> Data from: http://environment.data.gov.uk/flood-monitoring</div>
      <div className="my-2">
        Use the filters below to manipulate the data, once changed you can see
        the query executed on the API below.
      </div>
      <div>
        Query executed:{" "}
        <a target="_blank" href={url} className="underline">
          {url}
        </a>
      </div>
      <div>
        <Select
          onValueChange={(value) => setMaxItems(parseInt(value))}
          value={maxItems.toString()}
        >
          <Label>Max items</Label>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select max items" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Max items</SelectLabel>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            if (value === "all") {
              setSeverityLevel(undefined);
            } else {
              setSeverityLevel(parseInt(value));
            }
          }}
          value={severityLevel ? severityLevel.toString() : "all"}
        >
          <Label>Severity Level</Label>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select severity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Severity Level</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div>
          <Label>Search by County</Label>
          <Input
            className="my-2 w-[180px]"
            placeholder="Search..."
            id="county"
            onChange={(e) => setCounty(e.target.value)}
          />
          <div className="flex">
            <Button onClick={() => setCurrentCountyValue(county)}>
              Search
            </Button>
            <Button
              disabled={!county}
              onClick={() => {
                setCounty(undefined);
                setCurrentCountyValue(undefined);
                const input = document.getElementById(
                  "county"
                ) as HTMLInputElement;
                if (input) {
                  input.value = "";
                }
              }}
              className=" ml-4"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flood Area ID</TableHead>
            <TableHead>County</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Severity Level</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-right">Time</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {floodsQuery.isLoading && (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex items-center justify-center">
                  <ThreeDotsBounce />
                </div>
              </TableCell>
            </TableRow>
          )}
          {floodsQuery.isError && (
            <TableRow>
              <TableCell colSpan={7}>
                Error: {floodsQuery.error.message}
              </TableCell>
            </TableRow>
          )}
          {floodsQuery.data ? (
            <Data floodData={floodsQuery.data.items} />
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

function Data({ floodData }: { floodData: FloodData["items"] }) {
  return (
    <>
      {floodData.map((record) => (
        <TableRow key={record["@id"]}>
          <TableCell className="font-medium">{record.floodAreaID}</TableCell>
          <TableCell>{record.floodArea.county}</TableCell>
          <TableCell>{record.severity}</TableCell>
          <TableCell>{record.severityLevel}</TableCell>
          <TableCell className="max-w-[500px]">{record.message}</TableCell>
          <TableCell className="text-right">{record.timeRaised}</TableCell>
          <TableCell className="text-right">
            <Button
              onClick={() => {
                window.open(record["@id"], "_blank");
              }}
            >
              View Full Data
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default App;
