import { notFound } from "next/navigation";
import OutreachWorkspace from "@/components/OutreachWorkspace";

export default function WorkspacePage() {
    if (process.env.NODE_ENV === "production") {
        notFound();
    }

    return <OutreachWorkspace mode="private" />;
}