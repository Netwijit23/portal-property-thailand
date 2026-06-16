"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Loader2, Upload, X } from "lucide-react";

const zones = ["Sukhumvit", "Silom", "Sathorn", "Thonglor", "Ekkamai", "Ari", "Ratchada", "Ladprao", "On Nut", "Bearing", "Other"];
const btsStations = ["Asoke", "Phrom Phong", "Thonglor", "Ekkamai", "On Nut", "Bearing", "Chong Nonsi", "Sala Daeng", "Surasak", "Ari", "Saphan Khwai", "Lat Phrao", "Other"];

export default function SubmitForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const [form, setForm] = useState({
    title: "",
    type: "condo",
    listing_type: "rent",
    zone: "",
    building_name: "",
    bts_station: "",
    floor: "",
    bedrooms: "1",
    bathrooms: "1",
    size_sqm: "",
    sale_price: "",
    rent_price: "",
    description: "",
    agent_name: "",
    agent_phone: "",
    agent_line: "",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newFiles = [...photoFiles, ...files].slice(0, 6);
    setPhotoFiles(newFiles);
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setPhotoPreviews(urls);
  }

  function removePhoto(i: number) {
    const newFiles = photoFiles.filter((_, idx) => idx !== i);
    setPhotoFiles(newFiles);
    setPhotoPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload photos to Supabase Storage if available
      const photoUrls: string[] = [];
      for (const file of photoFiles) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data } = await supabase.storage
          .from("Listings-Photos")
          .upload(path, file);
        if (data) {
          const { data: urlData } = supabase.storage.from("Listings-Photos").getPublicUrl(path);
          photoUrls.push(urlData.publicUrl);
        }
      }

      // Map to actual DB column names
      const payload = {
        title_en: form.title,
        title: form.title,
        building_type: form.type,
        listing_type: form.listing_type,
        zone: form.zone || null,
        project: form.building_name || null,
        floor: form.floor ? parseInt(form.floor) : null,
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        size_sqm: form.size_sqm ? parseFloat(form.size_sqm) : null,
        sale_price: form.listing_type === "sale" && form.sale_price ? parseFloat(form.sale_price) : null,
        rent_price_1m: form.listing_type === "rent" && form.rent_price ? parseFloat(form.rent_price) : null,
        description_en: form.description || null,
        photos: photoUrls,
        agent_name: form.agent_name || null,
        agent_tel: form.agent_phone || null,
        agent_line: form.agent_line || null,
        status: "available",
        pet_allowed: false,
        foreigner_quota: false,
        is_penthouse: false,
        is_duplex: false,
      };

      const { error: insertError } = await supabase.from("listings").insert(payload);
      if (insertError) throw insertError;
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-10 text-center">
        <CheckCircle2 className="mx-auto mb-4 text-[#1A3A2A]" size={48} />
        <h2 className="font-cormorant text-2xl text-[#0A0A0A] mb-2">Listing submitted!</h2>
        <p className="font-sans text-sm text-[#8A8680] mb-6">Your property has been submitted and will be reviewed shortly.</p>
        <button
          onClick={() => { setSuccess(false); setForm({ title: "", type: "condo", listing_type: "rent", zone: "", building_name: "", bts_station: "", floor: "", bedrooms: "1", bathrooms: "1", size_sqm: "", sale_price: "", rent_price: "", description: "", agent_name: "", agent_phone: "", agent_line: "" }); setPhotoPreviews([]); setPhotoFiles([]); }}
          className="font-sans text-sm font-medium px-6 py-2.5 rounded-full bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors"
        >
          Submit another listing
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Listing type */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6">
        <h2 className="font-cormorant text-xl text-[#0A0A0A] mb-4">Listing type</h2>
        <div className="flex gap-3 mb-4">
          {[
            { label: "For Rent", value: "rent" },
            { label: "For Sale", value: "sale" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set("listing_type", opt.value)}
              className={`flex-1 font-sans text-sm font-medium py-3 rounded-xl border transition-colors ${
                form.listing_type === opt.value
                  ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                  : "bg-white text-[#8A8680] border-[#E8E4DC]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          {[
            { label: "Condo", value: "condo" },
            { label: "House", value: "house" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set("type", opt.value)}
              className={`flex-1 font-sans text-sm font-medium py-3 rounded-xl border transition-colors ${
                form.type === opt.value
                  ? "bg-[#B8935A] text-white border-[#B8935A]"
                  : "bg-white text-[#8A8680] border-[#E8E4DC]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property details */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 space-y-4">
        <h2 className="font-cormorant text-xl text-[#0A0A0A] mb-2">Property details</h2>

        <Field label="Listing title *">
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Modern 2-bed condo in Asoke"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Zone">
            <select value={form.zone} onChange={(e) => set("zone", e.target.value)} className={inputClass}>
              <option value="">Select zone</option>
              {zones.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </Field>
          <Field label="Building name">
            <input value={form.building_name} onChange={(e) => set("building_name", e.target.value)} placeholder="e.g. Ashton Asoke" className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="BTS station">
            <select value={form.bts_station} onChange={(e) => set("bts_station", e.target.value)} className={inputClass}>
              <option value="">Select station</option>
              {btsStations.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Floor">
            <input type="number" value={form.floor} onChange={(e) => set("floor", e.target.value)} placeholder="e.g. 12" className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Bedrooms *">
            <select required value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className={inputClass}>
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
          <Field label="Bathrooms *">
            <select required value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className={inputClass}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
          <Field label="Size (sqm) *">
            <input required type="number" value={form.size_sqm} onChange={(e) => set("size_sqm", e.target.value)} placeholder="65" className={inputClass} />
          </Field>
        </div>

        <Field label={form.listing_type === "rent" ? "Monthly rent (฿) *" : "Sale price (฿) *"}>
          <input
            required
            type="number"
            value={form.listing_type === "rent" ? form.rent_price : form.sale_price}
            onChange={(e) => set(form.listing_type === "rent" ? "rent_price" : "sale_price", e.target.value)}
            placeholder={form.listing_type === "rent" ? "e.g. 35000" : "e.g. 8500000"}
            className={inputClass}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            placeholder="Describe the property, key features, nearby amenities..."
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {/* Photos */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6">
        <h2 className="font-cormorant text-xl text-[#0A0A0A] mb-4">Photos</h2>

        {photoPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {photoPreviews.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[#F5F2EC]">
                <Image src={url} alt="" fill className="object-cover" sizes="150px" unoptimized />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E8E4DC] rounded-xl py-8 cursor-pointer hover:border-[#B8935A] transition-colors">
          <Upload size={24} className="text-[#8A8680]" />
          <span className="font-sans text-sm text-[#8A8680]">Tap to add photos (up to 6)</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
        </label>
      </div>

      {/* Agent contact */}
      <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 space-y-4">
        <h2 className="font-cormorant text-xl text-[#0A0A0A] mb-2">Your contact info</h2>
        <Field label="Your name *">
          <input required value={form.agent_name} onChange={(e) => set("agent_name", e.target.value)} placeholder="Khun Somchai" className={inputClass} />
        </Field>
        <Field label="Phone number *">
          <input required type="tel" value={form.agent_phone} onChange={(e) => set("agent_phone", e.target.value)} placeholder="+66 81 234 5678" className={inputClass} />
        </Field>
        <Field label="Line ID">
          <input value={form.agent_line} onChange={(e) => set("agent_line", e.target.value)} placeholder="your.line.id" className={inputClass} />
        </Field>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-sans text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 font-sans text-sm font-medium py-4 rounded-2xl bg-[#0A0A0A] text-white hover:bg-[#B8935A] transition-colors disabled:opacity-60"
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit listing"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans text-xs uppercase tracking-wider text-[#8A8680] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full font-sans text-sm bg-[#F5F2EC] border border-[#E8E4DC] rounded-xl px-4 py-3 text-[#0A0A0A] placeholder-[#8A8680] focus:outline-none focus:border-[#B8935A] transition-colors appearance-none";
