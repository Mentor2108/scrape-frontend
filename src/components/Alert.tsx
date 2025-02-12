import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function ResponseAlert(props: {response: any}) {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Scraping SUCCESS! (This Response Structure is a WIP)</AlertTitle>
      <AlertDescription>
        {JSON.stringify(props.response)}
      </AlertDescription>
    </Alert>
  )
}
