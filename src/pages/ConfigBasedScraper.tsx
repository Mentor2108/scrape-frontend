import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ScraperConfigPage() {
  const [config, setConfig] = useState({
    root: "",
    depth: 1,
    maxLimit: 10,
    scrapePhase: {
      library: "",
      waitFor: { duration: 0, selector: "" },
    },
    processPhase: { library: "" },
    scrapeData: [{ name: "", type: "", selector: "" }],
  });

  const handleChange = (field: string, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleScrapeDataChange = (index: number, field: string, value: any) => {
    const newScrapeData = [...config.scrapeData];
    newScrapeData[index][field] = value;
    setConfig((prev) => ({ ...prev, scrapeData: newScrapeData }));
  };

  const addScrapeData = () => {
    setConfig((prev) => ({
      ...prev,
      scrapeData: [...prev.scrapeData, { name: "", type: "", selector: "" }],
    }));
  };

  const handleScrape = () => {
    console.log("Scrape Config:", config);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 p-6">
      <Card className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Config-Based Web Scraper</h1>
        <CardContent>
          <div className="mb-4">
            <label className="text-lg font-semibold text-gray-700">Root URL:</label>
            <Input
              className="mt-1 p-2 w-full border-2 border-blue-300 rounded-lg"
              placeholder="https://example.com"
              value={config.root}
              onChange={(e) => handleChange("root", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-lg font-semibold text-gray-700">Depth:</label>
              <Input
                type="number"
                className="mt-1 p-2 w-full border-2 border-green-300 rounded-lg"
                value={config.depth}
                onChange={(e) => handleChange("depth", parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-700">Max Limit:</label>
              <Input
                type="number"
                className="mt-1 p-2 w-full border-2 border-green-300 rounded-lg"
                value={config.maxLimit}
                onChange={(e) => handleChange("maxLimit", parseInt(e.target.value))}
              />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-purple-700 mt-4">Scrape Phase</h2>
          <div className="mb-4">
            <label className="text-lg font-semibold text-gray-700">Library:</label>
            <Input
              className="mt-1 p-2 w-full border-2 border-blue-300 rounded-lg"
              placeholder="Enter library name"
              value={config.scrapePhase.library}
              onChange={(e) => handleChange("scrapePhase", { ...config.scrapePhase, library: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-lg font-semibold text-gray-700">Wait Duration:</label>
              <Input
                type="number"
                className="mt-1 p-2 w-full border-2 border-green-300 rounded-lg"
                value={config.scrapePhase.waitFor.duration}
                onChange={(e) =>
                  handleChange("scrapePhase", {
                    ...config.scrapePhase,
                    waitFor: { ...config.scrapePhase.waitFor, duration: parseInt(e.target.value) },
                  })
                }
              />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-700">Wait Selector:</label>
              <Input
                className="mt-1 p-2 w-full border-2 border-green-300 rounded-lg"
                placeholder="CSS Selector"
                value={config.scrapePhase.waitFor.selector}
                onChange={(e) =>
                  handleChange("scrapePhase", {
                    ...config.scrapePhase,
                    waitFor: { ...config.scrapePhase.waitFor, selector: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-purple-700 mt-4">Process Phase</h2>
          <div className="mb-4">
            <label className="text-lg font-semibold text-gray-700">Library:</label>
            <Input
              className="mt-1 p-2 w-full border-2 border-blue-300 rounded-lg"
              placeholder="Enter library name"
              value={config.processPhase.library}
              onChange={(e) => handleChange("processPhase", { library: e.target.value })}
            />
          </div>

          <h2 className="text-2xl font-semibold text-purple-700 mt-4">Scrape Data</h2>
          {config.scrapeData.map((data, index) => (
            <div key={index} className="mb-4 border-b-2 pb-4">
              <label className="text-lg font-semibold text-gray-700">Name:</label>
              <Input
                className="mt-1 p-2 w-full border-2 border-blue-300 rounded-lg"
                placeholder="Data name"
                value={data.name}
                onChange={(e) => handleScrapeDataChange(index, "name", e.target.value)}
              />
              <label className="text-lg font-semibold text-gray-700 mt-2">Type:</label>
              <Input
                className="mt-1 p-2 w-full border-2 border-green-300 rounded-lg"
                placeholder="Data type"
                value={data.type}
                onChange={(e) => handleScrapeDataChange(index, "type", e.target.value)}
              />
              <label className="text-lg font-semibold text-gray-700 mt-2">Selector:</label>
              <Input
                className="mt-1 p-2 w-full border-2 border-purple-300 rounded-lg"
                placeholder="CSS Selector"
                value={data.selector}
                onChange={(e) => handleScrapeDataChange(index, "selector", e.target.value)}
              />
            </div>
          ))}
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition mb-4" onClick={addScrapeData}>
            + Add Scrape Data
          </Button>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition" onClick={handleScrape}>
            Generate Scraper Config
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
