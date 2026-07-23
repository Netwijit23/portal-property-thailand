import type { Metadata } from "next";
import FormPage from "@/components/enquire/FormPage";
import OwnerForm from "@/components/enquire/OwnerForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "List My Property in Bangkok | Portal Property Thailand",
  description: "Owners: rent out or sell your Bangkok condo or house with Portal Property's full-service marketing. Book a viewing today.",
  path: "/enquire/owner",
});

export default function OwnerEnquiryPage() {
  return (
    <FormPage eyebrow="Owners & Landlords" heading="List your property">
      <OwnerForm />
    </FormPage>
  );
}
