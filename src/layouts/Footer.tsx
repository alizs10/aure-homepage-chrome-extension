import NetworkStatus from "@/components/features/network-status/NetworkStatus";

export default function Footer() {
    return (
        <div className="bg-linear-to-t from-background to-transparent fixed inset-0 top-auto p-4 md:p-8 lg:p-10 pt-0 md:pt-0 lg:pt-0 flex justify-end">

            <NetworkStatus />




        </div>
    )
}
