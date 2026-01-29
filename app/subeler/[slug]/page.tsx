import { supabase } from "@/lib/supabase"
import BranchDetailPage from "./client"

export async function generateStaticParams() {
    try {
        const { data: branches } = await supabase
            .from("branches")
            .select("slug")
            .eq("active", true)

        return branches?.map(({ slug }) => ({
            slug,
        })) || []
    } catch (error) {
        console.warn('Error generating static params:', error)
        return []
    }
}

export default function Page() {
    return <BranchDetailPage />
}