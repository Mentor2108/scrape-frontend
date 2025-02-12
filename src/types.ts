export interface ScrapeRequest {
    url: string;
    config: ScrapeConfig;
}

export interface ScrapeConfig {
    root: string;
    depth: number;
    maxlimit: number;
    continueonerror?: boolean; // not using as of now
    scrape_phase: ScrapePhaseDefn;
    process_phase?: ProcessPhaseDefn;
    content: ScrapeDataContentDefn[];
    exclude: string[];
    scrape_images: boolean;
}

export interface ScrapePhaseDefn {
    library: string;
    wait_for?: WaitForDefn;
}

export interface ProcessPhaseDefn {
    library: string;
}

export interface ScrapeDataContentDefn {
    name: string;
    type: string;
    selector: string;
    section?: SectionTypeDefn;
    table?: TableTypeDefn;
    text?: TextTypeDefn;
}

export interface SectionTypeDefn {
    prefix: string;
    suffix: string;
    start: string;
    end: string;
    title: string[];
    data: string[];
}

export interface TableTypeDefn {
    prefix: string;
    suffix: string;
    title: string;
    column_map?: ColumnMapDefn;
    column_names: string[];
}

export interface ColumnMapDefn {
    key: string;
    value: string;
}

export interface TextTypeDefn {
    prefix: string;
    suffix: string;
}

export interface WaitForDefn {
    duration: number;
    selector: string;
}

export const defaultScrapeRequest = (): ScrapeRequest => ({
    url: '',
    config: {
        root: 'body',
        depth: 0,
        maxlimit: 0,
        continueonerror: true,
        scrape_phase: {
            "library": "chromedp"
        },
        content: [],
        exclude: ['nav', 'script', 'noscript', 'button', 'style'],
        scrape_images: false,
    },
});
