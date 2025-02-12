import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { type ScrapeRequest, type ScrapeDataContentDefn, defaultScrapeRequest, TableTypeDefn, SectionTypeDefn, TextTypeDefn, ColumnMapDefn, ProcessPhaseDefn, ScrapePhaseDefn } from "@/types.ts"
import Loading from "@/components/loading"
import AlertDestructive from "@/components/ErrorAlert"
import ScrapeResponse from "@/components/ScrapeResponse"

const TableTypeMap = "Map of Key Value";
const TableTypeList = "Names of Columns"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000"

export default function ScraperForm() {
    const [request, setRequest] = useState<ScrapeRequest>(defaultScrapeRequest())

    const [tableType, setTableType] = useState<string>(TableTypeMap);
    const [loading, setLoading] = useState(false);
    const [errorOccured, setErrorOccured] = useState(false);
    const [scrapeResponse, setScrapeResponse] = useState<any>(undefined);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setRequest((prev) => ({
            ...prev,
            url: name === "url" ? value : prev.url,
            config: {
                ...prev.config!,
                [name]: type === "number" ? Number(value) : value,
            },
        }))
    }

    const handleScrapePhaseChange = (name: keyof ScrapePhaseDefn, value: string) => {
        setRequest((prev) => ({
            ...prev,
            config: {
                ...prev.config,
                scrape_phase: {
                    ...prev.config.scrape_phase,
                    [name]: value
                }
            }
        }))
    }

    const handleProcessPhaseChange = (name: keyof ProcessPhaseDefn, value: string) => {
        setRequest((prev) => ({
            ...prev,
            config: {
                ...prev.config,
                process_phase: {
                    ...prev.config.process_phase,
                    [name]: value
                }
            }
        }))
    }

    const handleSwitchChange = (name: string) => (checked: boolean) => {
        setRequest((prev) => ({
            ...prev,
            config: {
                ...prev.config!,
                [name]: checked,
            },
        }))
    }

    const handleContentChange = (index: number, field: keyof ScrapeDataContentDefn, value: any) => {
        setRequest((prev) => ({
            ...prev,
            config: {
                ...prev.config!,
                content: prev.config!.content.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
            },
        }))
    }

    const handleTextChange = (index: number, field: keyof TextTypeDefn, value: any) => {
        setRequest((prev) => ({
            ...prev,
            config: {
                ...prev.config!,
                content: prev.config!.content.map((item, i) => (i === index ? { ...item, text: { ...item.text, [field]: value } as TextTypeDefn } : item)),
            },
        }))
    }

    const handleSectionChange = (index: number, field: keyof SectionTypeDefn, value: any) => {
        var elementArray: string[] = []
        if (field === "data" || field === "title") {
            elementArray = value.split(",").map((item: string) => item.trim())
        }

        setRequest((prev) => ({
            ...prev,
            config: {
                ...prev.config!,
                content: prev.config!.content.map((item, i) => (i === index ? { ...item, section: { ...item.section, [field]: ((field === "data" || field === "title") ? elementArray : value) } as SectionTypeDefn } : item)),
            },
        }))
    }

    const handleTableChange = (index: number, field: keyof TableTypeDefn, value: any) => {
        var columnNamesArray: string[] = []
        if (field === "column_names") {
            columnNamesArray = value.split(",").map((item: string) => item.trim())
        }

        setRequest((prev) => ({
            ...prev,
            config: {
                ...prev.config!,
                content: prev.config!.content.map((item, i) => (i === index ? { ...item, table: { ...item.table, [field]: (field === "column_names" ? columnNamesArray : value) } as TableTypeDefn } : item)),
            },
        }))
    }

    const handleTableColumnMapChange = (index: number, field: keyof ColumnMapDefn, value: any) => {
        setRequest((prev) => ({
            ...prev,
            config: {
                ...prev.config!,
                content: prev.config!.content.map((item, i) => (i === index ? { ...item, table: { ...item.table, column_map: { ...item.table?.column_map, [field]: value } } as TableTypeDefn } : item)),
            },
        }))
    }

    const addContentItem = () => {
        setRequest((prev) => ({
            ...prev,
            config: {
                ...prev.config!,
                content: [...prev.config!.content, { name: "", type: "text", selector: "" }],
            },
        }))
    }

    const removeContentItem = (index: number) => {
        setRequest((prev) => ({
            ...prev,
            config: {
                ...prev.config!,
                content: prev.config!.content.filter((_, i) => i !== index),
            },
        }))
    }

    const handleExcludeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const excludeArray = e.target.value.split(",").map((item) => item.trim())
        setRequest((prev) => ({
            ...prev,
            config: {
                ...prev.config!,
                exclude: excludeArray,
            },
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setScrapeResponse(undefined);
        if (loading) {
            setErrorOccured(true)
            setTimeout(() => {
                setErrorOccured(false)
            }, 5000)
        }
        setLoading(true)
        try {
            console.log("my request", request)
            const response = await fetch(API_BASE_URL + "/scraper/scrape/url/start/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            })
            if (response.ok) {
                setScrapeResponse(await response.json())
                setLoading(false)
                console.log("Scraper job started:", scrapeResponse)
                // Handle success (e.g., show a success message, clear form, etc.)
            } else {
                console.error("Failed to start scraper job")
                setScrapeResponse("error")
                setLoading(false)
                // Handle error (e.g., show error message)
            }
        } catch (error) {
            setScrapeResponse("error")
            console.error("Error:", error)
            setLoading(false)
            // Handle error (e.g., show error message)
        }
    }

    return (
        <div className="h-screen">
            <h1 className="text-2xl font-bold text-center py-4">
                Config Based Scraper
            </h1>
            {errorOccured &&
                <div className="max-w-2xl mx-auto py-4">
                    <AlertDestructive ErrorMessage="Please wait for the current request to end." />
                </div>
            }
            {loading &&
                <Loading />
            }
            {scrapeResponse &&
                <ScrapeResponse response={scrapeResponse} setResponse={setScrapeResponse} />
            }
            <form onSubmit={handleSubmit} className="h-auto space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <div>
                    <Label htmlFor="url">Target URL</Label>
                    <span className="text-red-500 font-bold">*</span>
                    <Input
                        id="url"
                        name="url"
                        value={request.url}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="root">Root Selector</Label>
                    <span className="text-red-500 font-bold">*</span>
                    <Input id="root" name="root" value={request.config?.root} onChange={handleInputChange} placeholder="body" required />
                </div>

                <div>
                    <Label htmlFor="scrapePhaseLibrary">Scrape Phase Library</Label>
                    <span className="text-red-500 font-bold">*</span>
                    <Select value={request.config?.scrape_phase.library} onValueChange={value => handleScrapePhaseChange("library", value)} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select scrape phase library" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="chromedp">chromedp</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="processPhaseLibrary">Process Phase Library</Label>
                    <Select value={request.config?.process_phase?.library} onValueChange={value => handleProcessPhaseChange("library", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select process phase library" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="goquery">goquery</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="depth">Depth</Label>
                        <Input
                            id="depth"
                            name="depth"
                            type="number"
                            value={request.config?.depth}
                            onChange={handleInputChange}
                            min={0}
                            max={3}
                        />
                    </div>
                    <div>
                        <Label htmlFor="maxlimit">Max Limit</Label>
                        <Input
                            id="maxlimit"
                            name="maxlimit"
                            type="number"
                            value={request.config?.maxlimit}
                            onChange={handleInputChange}
                            min={-1}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="scrape_images"
                        checked={request.config?.scrape_images}
                        onCheckedChange={handleSwitchChange("scrape_images")}
                    />
                    <Label htmlFor="scrape_images">Scrape Images</Label>
                </div>

                <div>
                    <Label htmlFor="exclude">Exclude Selectors (comma-separated)</Label>
                    <Textarea
                        id="exclude"
                        name="exclude"
                        value={request.config?.exclude.join(", ")}
                        onChange={handleExcludeChange}
                        placeholder="nav, script, noscript, button, style"
                    />
                </div>

                <div>
                    <Label>Content</Label>
                    <br></br>
                    {request.config?.content.map((item, index) => (
                        <div key={index} className="space-y-3 mt-2 p-4 border rounded">
                            <div>
                                <Label htmlFor="queryName">Query Name</Label>
                                <span className="text-red-500 font-bold">*</span>
                                <Input
                                    required
                                    placeholder="Name"
                                    value={item.name}
                                    onChange={(e) => handleContentChange(index, "name", e.target.value)}
                                    className="mb-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="queryType">Query Type</Label>
                                <span className="text-red-500 font-bold">*</span>
                                <Select value={item.type} onValueChange={(value) => handleContentChange(index, "type", value)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">Text</SelectItem>
                                        <SelectItem value="section">Section</SelectItem>
                                        <SelectItem value="table">Table</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {item.type === "text" &&
                                <div className="space-y-3 mt-2 p-4 rounded">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="text-prefix">Prefix</Label>
                                            <Input
                                                id="prefix"
                                                name="prefix"
                                                value={item.text?.prefix}
                                                onChange={(e) => handleTextChange(index, "prefix", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="text-suffix">Suffix</Label>
                                            <Input
                                                id="suffix"
                                                name="suffix"
                                                value={item.text?.suffix}
                                                onChange={(e) => handleTextChange(index, "suffix", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>}
                            {item.type === "section" &&
                                <div className="space-y-3 mt-2 p-4 rounded">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="section-prefix">Prefix</Label>
                                            <Input
                                                id="prefix"
                                                name="prefix"
                                                value={item.section?.prefix}
                                                onChange={(e) => handleSectionChange(index, "prefix", e.target.value)}
                                                min={0}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="section-suffix">Suffix</Label>
                                            <Input
                                                id="suffix"
                                                name="suffix"
                                                value={item.section?.suffix}
                                                onChange={(e) => handleSectionChange(index, "suffix", e.target.value)}
                                                min={0}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="section-start">Start</Label>
                                            <Input
                                                id="start"
                                                name="start"
                                                value={item.section?.start}
                                                onChange={(e) => handleSectionChange(index, "start", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="section-end">End</Label>
                                            <Input
                                                id="end"
                                                name="end"
                                                value={item.section?.end}
                                                onChange={(e) => handleSectionChange(index, "end", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="section-title">Title-selectors (comma-separated)</Label>
                                        <Textarea
                                            id="title"
                                            name="title"
                                            value={item.section?.title.join(", ")}
                                            onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                                            placeholder="p, div.content, span"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="section-data">Data-selectors (comma-separated)</Label>
                                        <Textarea
                                            id="data"
                                            name="data"
                                            value={item.section?.data.join(", ")}
                                            onChange={(e) => handleSectionChange(index, "data", e.target.value)}
                                            placeholder="h1, h2, div.heading"
                                        />
                                    </div>
                                </div>}
                            {item.type === "table" &&
                                <div className="space-y-3 mt-2 p-4 rounded">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="table-prefix">Prefix</Label>
                                            <Input
                                                id="prefix"
                                                name="prefix"
                                                value={item.table?.prefix}
                                                onChange={(e) => handleTableChange(index, "prefix", e.target.value)}
                                                min={0}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="table-suffix">Suffix</Label>
                                            <Input
                                                id="suffix"
                                                name="suffix"
                                                value={item.table?.suffix}
                                                onChange={(e) => handleTableChange(index, "suffix", e.target.value)}
                                                min={0}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="table-title">Selector for Title of Table</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={item.table?.title}
                                            onChange={(e) => handleTableChange(index, "title", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex just justify-center items-center space-x-2">
                                        <Switch
                                            id="table_type"
                                            // checked={request.config?.scrape_images}
                                            onCheckedChange={() => { setTableType(tableType === TableTypeMap ? TableTypeList : TableTypeMap) }}
                                        />
                                        <Label htmlFor="table_type">{tableType}</Label>
                                    </div>
                                    {tableType === TableTypeMap ?
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="table-key">Table Key selector (Generally th)</Label>
                                                <span className="text-red-500 font-bold">*</span>
                                                <Input
                                                    id="key"
                                                    name="key"
                                                    value={item.table?.column_map?.key}
                                                    onChange={(e) => handleTableColumnMapChange(index, "key", e.target.value)}
                                                    placeholder="th"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="table-value">Table Value selector (Generally tb)</Label>
                                                <span className="text-red-500 font-bold">*</span>
                                                <Input
                                                    id="value"
                                                    name="value"
                                                    value={item.table?.column_map?.value}
                                                    onChange={(e) => handleTableColumnMapChange(index, "value", e.target.value)}
                                                    placeholder="tb"
                                                    required
                                                />
                                            </div>
                                        </div> :
                                        <div>
                                            <Label htmlFor="table-name">Names of Columns (comma-separated)</Label>
                                            <span className="text-red-500 font-bold">*</span>
                                            <Textarea
                                                id="names"
                                                name="names"
                                                value={item.table?.column_names.join(", ")}
                                                onChange={(e) => handleTableChange(index, "column_names", e.target.value)}
                                                placeholder="column1, column2, column3"
                                                required
                                            />
                                        </div>}
                                </div>}
                            <div>
                                <Label htmlFor="querySelector">Query Selector</Label>
                                <span className="text-red-500 font-bold">*</span>
                                <Input
                                    placeholder="Selector"
                                    value={item.selector}
                                    onChange={(e) => handleContentChange(index, "selector", e.target.value)}
                                    className="mt-2"
                                    required
                                />
                            </div>
                            <Button type="button" onClick={() => removeContentItem(index)} className="mt-2">
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={addContentItem} className="mt-2">
                        Add Content Item
                    </Button>
                </div>

                <Button type="submit" className="w-full">
                    Start Scraping
                </Button>
            </form>
        </div>
    )
}

