import { ResponseAlert } from "./Alert";
import AlertDestructive from "./ErrorAlert";

export default function ScrapeResponse(props: { response: any, setResponse: React.Dispatch<any> }) {
    const { response, setResponse } = props

    if (response.scrape_job && response.scrape_job.scrape_task && response.scrape_job.response && !response.scrape_job.response.error) {
        console.log(response)
        return (
            <div className="max-w-2xl mx-auto py-4">
                <ResponseAlert response={response} />
            </div>
        );
    }

    console.log(response)
    setTimeout(() => {
        setResponse(undefined);
    }, 5000)
    return (
        <div className="max-w-2xl mx-auto py-4">
            <AlertDestructive ErrorMessage="An Error occured in server's side. Please Try again." />
        </div>
    );
}