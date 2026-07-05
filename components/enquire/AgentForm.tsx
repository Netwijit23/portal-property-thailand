"use client";
import { useState } from "react";
import { Field, TextInput, TextArea, PrefixInput, Segmented, ChipMulti, ChipSingle, StepShell, SuccessCard, submitEnquiry } from "./kit";

const AREAS = [
  "Sukhumvit", "Silom", "Sathorn", "Thonglor", "Ekkamai", "Ari",
  "Asok", "Phrom Phong", "On Nut", "Ratchada", "Rama 9", "Riverside",
];
const BEDS = [
  { label: "Studio", value: "Studio" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4+", value: "4+" },
];

export default function AgentForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Agent
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [line, setLine] = useState("");

  // Their client's requirement
  const [intent, setIntent] = useState<"rent" | "buy">("rent");
  const [beds, setBeds] = useState<string | null>(null);
  const [areas, setAreas] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [split, setSplit] = useState("");
  const [notes, setNotes] = useState("");

  function toggleArea(a: string) {
    setAreas((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));
  }

  async function submit() {
    setSubmitting(true);
    await submitEnquiry({
      kind: "AGENT CO-BROKE REQUEST",
      name, phone, line, email,
      summaryTitle: `Co-broke — ${agency || name}`,
      notesLines: [
        `Agent: ${name}`,
        agency ? `Agency: ${agency}` : null,
        email ? `Email: ${email}` : null,
        `── Their client is looking to ${intent === "rent" ? "RENT" : "BUY"} ──`,
        beds ? `Bedrooms: ${beds}` : null,
        areas.length ? `Preferred areas: ${areas.join(", ")}` : null,
        budget ? `Budget: ฿${budget}${intent === "rent" ? " / month" : ""}` : null,
        split ? `Commission split expectation: ${split}` : null,
        notes ? `Notes: ${notes}` : null,
      ],
    });
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <SuccessCard
        title="Let's co-broke"
        message="Thanks for reaching out. Our team will review your client's brief and share matching inventory — we'll be in touch shortly."
      />
    );
  }

  return (
    <>
      {step === 1 && (
        <StepShell
          step={1} total={2}
          title="About you"
          subtitle="Agent-to-agent — we co-broke fairly and transparently."
          canNext={name.trim().length > 0 && phone.trim().length > 0}
          onNext={() => setStep(2)}
          nextLabel="Continue"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Your name"><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" /></Field>
            <Field label="Agency" hint="optional"><TextInput value={agency} onChange={(e) => setAgency(e.target.value)} placeholder="Company name" /></Field>
            <Field label="Phone / WhatsApp"><TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+66…" /></Field>
            <Field label="Email" hint="optional"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@agency.com" /></Field>
            <Field label="LINE ID" hint="optional"><TextInput value={line} onChange={(e) => setLine(e.target.value)} placeholder="@yourid" /></Field>
          </div>
        </StepShell>
      )}

      {step === 2 && (
        <StepShell
          step={2} total={2}
          title="Your client's brief"
          subtitle="What is your client looking for?"
          canNext={true}
          onBack={() => setStep(1)}
          onNext={submit}
          nextLabel="Send co-broke request"
          submitting={submitting}
        >
          <Field label="Client is looking to">
            <Segmented
              value={intent}
              onChange={setIntent}
              options={[{ label: "Rent", value: "rent" }, { label: "Buy", value: "buy" }]}
            />
          </Field>
          <Field label="Bedrooms">
            <ChipSingle options={BEDS} value={beds} onChange={setBeds} />
          </Field>
          <Field label="Preferred areas" hint="select any">
            <ChipMulti options={AREAS} selected={areas} onToggle={toggleArea} />
          </Field>
          <Field label={`Budget${intent === "rent" ? " (per month)" : ""}`} hint="optional">
            <PrefixInput
              prefix="฿"
              inputMode="numeric"
              value={budget}
              onChange={(e) => setBudget(e.target.value.replace(/[^\d,.]/g, ""))}
              placeholder={intent === "rent" ? "e.g. 45,000" : "e.g. 8,000,000"}
            />
          </Field>
          <Field label="Commission split" hint="optional">
            <TextInput value={split} onChange={(e) => setSplit(e.target.value)} placeholder="e.g. 50/50" />
          </Field>
          <Field label="Notes" hint="optional">
            <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Specific buildings, move-in date, other requirements…" />
          </Field>
        </StepShell>
      )}
    </>
  );
}
