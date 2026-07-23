import type { Metadata } from "next";
import FormPage from "@/components/enquire/FormPage";
import AgentForm from "@/components/enquire/AgentForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Co-broke With Us — Agent Referrals | Portal Property Thailand",
  description: "Agents: share your client's brief and co-broke a Bangkok condo or house sale/rental with Portal Property Thailand.",
  path: "/enquire/agent",
});

export default function AgentEnquiryPage() {
  return (
    <FormPage eyebrow="Agents" heading="Co-broke with us">
      <AgentForm />
    </FormPage>
  );
}
