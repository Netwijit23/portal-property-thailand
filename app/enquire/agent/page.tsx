import type { Metadata } from "next";
import FormPage from "@/components/enquire/FormPage";
import AgentForm from "@/components/enquire/AgentForm";

export const metadata: Metadata = {
  title: "Co-broke With Us | Portal Property Thailand",
  description: "Agents: share your client's brief and co-broke with Portal Property Thailand.",
};

export default function AgentEnquiryPage() {
  return (
    <FormPage eyebrow="Agents" heading="Co-broke with us">
      <AgentForm />
    </FormPage>
  );
}
