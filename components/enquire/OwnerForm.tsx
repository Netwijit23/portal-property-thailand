"use client";
import { useState } from "react";
import { Field, TextInput, TextArea, PrefixInput, Segmented, ChipSingle, StepShell, SuccessCard } from "./kit";
import PhotoUpload, { type UploadedPhoto } from "./PhotoUpload";

const BEDS = [
  { label: "Studio", value: "Studio" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4+", value: "4+" },
];

export default function OwnerForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Owner
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [line, setLine] = useState("");

  // Property
  const [listType, setListType] = useState<"rent" | "sale" | "both">("rent");
  const [project, setProject] = useState("");
  const [zone, setZone] = useState("");
  const [propType, setPropType] = useState<"condo" | "house" | "other">("condo");
  const [beds, setBeds] = useState<string | null>(null);
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");

  // Photos
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);

  // All owner submissions default to the full marketing service
  const goal = "full";
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/owner-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, email, line,
          listType, project, zone, propType,
          beds, size, price, goal, notes,
          photos: photos.map((p) => p.url),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong");
      }
      // Notify the team by email too (best-effort)
      fetch("/api/send-lead-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_title: `Owner listing — ${project || zone || name}`,
          client_name: name, client_phone: phone, client_email: email || "", client_line: line || "",
          notes: `Owner submitted a property with ${photos.length} photo(s). A draft listing was created for review.`,
        }),
      }).catch(() => {});
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <SuccessCard
        title="We'd love to help"
        message="Thanks for trusting Portal Property with your unit. Our listings team will reach out to arrange photos, pricing, and marketing within 24 hours."
      />
    );
  }

  return (
    <>
      {step === 1 && (
        <StepShell
          step={1} total={4}
          title="Your property"
          subtitle="A few details about the unit you'd like us to market."
          canNext={true}
          onNext={() => setStep(2)}
          nextLabel="Continue"
        >
          <Field label="I want to">
            <Segmented
              value={listType}
              onChange={setListType}
              options={[
                { label: "Rent out", value: "rent" },
                { label: "Sell", value: "sale" },
                { label: "Both", value: "both" },
              ]}
            />
          </Field>
          <Field label="Building / project name" hint="optional">
            <TextInput value={project} onChange={(e) => setProject(e.target.value)} placeholder="e.g. Ashton Asoke" />
          </Field>
          <Field label="Zone or nearest BTS" hint="optional">
            <TextInput value={zone} onChange={(e) => setZone(e.target.value)} placeholder="e.g. Asok / Sukhumvit" />
          </Field>
          <Field label="Property type">
            <Segmented
              value={propType}
              onChange={setPropType}
              options={[
                { label: "Condo", value: "condo" },
                { label: "House", value: "house" },
                { label: "Other", value: "other" },
              ]}
            />
          </Field>
        </StepShell>
      )}

      {step === 2 && (
        <StepShell
          step={2} total={4}
          title="Size & price"
          subtitle="Give us a rough idea — we'll advise on the best market price."
          canNext={true}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          nextLabel="Continue"
        >
          <Field label="Bedrooms">
            <ChipSingle options={BEDS} value={beds} onChange={setBeds} />
          </Field>
          <Field label="Size" hint="optional">
            <PrefixInput
              prefix="sqm"
              inputMode="numeric"
              value={size}
              onChange={(e) => setSize(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="e.g. 65"
            />
          </Field>
          <Field label={`Asking price${listType === "rent" ? " (per month)" : ""}`} hint="optional">
            <PrefixInput
              prefix="฿"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^\d,.]/g, ""))}
              placeholder={listType === "rent" ? "e.g. 45,000" : "e.g. 8,000,000"}
            />
          </Field>
        </StepShell>
      )}

      {step === 3 && (
        <StepShell
          step={3} total={4}
          title="Add your photos"
          subtitle="Upload photos of your unit — the more you add, the faster we can list it. You can skip and send them later."
          canNext={true}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
          nextLabel="Continue"
        >
          <Field label="Property photos" hint="optional — up to 12">
            <PhotoUpload photos={photos} onChange={setPhotos} />
          </Field>
        </StepShell>
      )}

      {step === 4 && (
        <StepShell
          step={4} total={4}
          title="How can we reach you?"
          subtitle="We'll review your unit and be in touch to confirm details and go live."
          canNext={name.trim().length > 0 && phone.trim().length > 0}
          onBack={() => setStep(3)}
          onNext={submit}
          nextLabel="Submit my property"
          submitting={submitting}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></Field>
            <Field label="Phone / WhatsApp"><TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+66…" /></Field>
            <Field label="Email" hint="optional"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></Field>
            <Field label="LINE ID" hint="optional"><TextInput value={line} onChange={(e) => setLine(e.target.value)} placeholder="@yourid" /></Field>
          </div>
          <Field label="Anything else?" hint="optional">
            <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Availability date, furnished status, special features…" />
          </Field>
          {error && (
            <p className="font-sans text-[13px] text-red-500 text-center">{error}</p>
          )}
        </StepShell>
      )}
    </>
  );
}
