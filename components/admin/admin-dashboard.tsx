"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { STUDY_FIELDS, STUDY_LEVELS } from "@/data/study-fields";
import {
  Building2,
  BookOpen,
  Languages,
  Users,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Database,
  ExternalLink,
  RefreshCcw,
  X,
  Save,
} from "lucide-react";

type University = Record<string, any>;
type Programme = Record<string, any>;
type Institute = Record<string, any>;
type Consultation = Record<string, any>;

type Props = {
  configured: boolean;
  universities: University[];
  programmes: Programme[];
  institutes: Institute[];
  consultations: Consultation[];
};

type Tab = "overview" | "universities" | "programmes" | "institutes" | "consultations";
type EditEntity = "universities" | "programmes" | "language-institutes";
type EditableRecord = University | Programme | Institute;
type RemoveHandler = (entity: EditEntity, id: string, label: string) => void;
type TableProps<T extends Record<string, any>> = {
  rows: T[];
  onAdd: () => void;
  onEdit: (record: T) => void;
  onDelete: RemoveHandler;
};

const universityFields = [
  ["slug", "Slug"], ["name", "Name"], ["short_name", "Short name"], ["arabic_name", "Arabic name"],
  ["city", "City / location"], ["institution_type", "Institution type"], ["campus", "Campus"],
  ["official_url", "Official website"], ["logo_path", "Logo path"], ["verified_at", "Verified date (YYYY-MM-DD)"],
] as const;
const instituteFields = [
  ["slug", "Slug"], ["name", "Name"], ["short_name", "Short name"], ["arabic_name", "Arabic name"],
  ["city", "City / location"], ["institution_type", "Institution type"], ["official_url", "Official website"],
  ["logo_path", "Logo path"], ["verified_at", "Verified date (YYYY-MM-DD)"],
] as const;
const STUDY_MODES = ["Full-time", "Part-time", "Online", "Hybrid"] as const;
const FEE_PERIODS = ["Total programme", "Per year", "Per semester", "Per intake", "Other"] as const;
const CURRENCIES = ["MYR", "USD", "GBP", "AUD", "SGD"] as const;

export function AdminDashboard(props: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [editor, setEditor] = useState<{ entity: EditEntity; record: EditableRecord | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const newLeads = useMemo(() => props.consultations.filter((item) => item.status === "new").length, [props.consultations]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function remove(entity: EditEntity, id: string, label: string) {
    if (!confirm(`Delete ${label}? This cannot be undone.`)) return;
    setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/catalog/${entity}/${id}`, { method: "DELETE" });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) return setMessage(payload.error || "Delete failed.");
    setMessage("Deleted successfully.");
    router.refresh();
  }

  async function updateLead(id: string, status: string) {
    const response = await fetch(`/api/admin/consultations/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const payload = await response.json();
    if (!response.ok) setMessage(payload.error || "Unable to update lead.");
    else router.refresh();
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><img src="/yaz-logo.png" alt="YAZ" /><div><strong>YAZ</strong><span>Admin</span></div></div>
        <nav>
          <AdminNav active={tab === "overview"} onClick={() => setTab("overview")} icon={<Database size={18} />} label="Overview" />
          <AdminNav active={tab === "universities"} onClick={() => setTab("universities")} icon={<Building2 size={18} />} label="Universities" />
          <AdminNav active={tab === "programmes"} onClick={() => setTab("programmes")} icon={<BookOpen size={18} />} label="Programmes" />
          <AdminNav active={tab === "institutes"} onClick={() => setTab("institutes")} icon={<Languages size={18} />} label="Language institutes" />
          <AdminNav active={tab === "consultations"} onClick={() => setTab("consultations")} icon={<Users size={18} />} label="Consultations" badge={newLeads || undefined} />
        </nav>
        <button className="admin-logout" onClick={logout}><LogOut size={17} /> Sign out</button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div><p className="admin-eyebrow">CONTENT MANAGEMENT</p><h1>{titleFor(tab)}</h1></div>
          <div className="admin-top-actions">
            <a href="/en" target="_blank" rel="noreferrer">View website <ExternalLink size={15} /></a>
            <button onClick={() => router.refresh()}><RefreshCcw size={16} /> Refresh</button>
          </div>
        </header>

        {!props.configured ? (
          <div className="admin-setup-banner">
            <Database size={22} />
            <div><strong>Supabase is not connected.</strong><p>Add the Supabase URL, anon key and server-only service-role key in Vercel to enable live catalogue editing and lead storage.</p></div>
          </div>
        ) : null}
        {message ? <div className="admin-message">{message}</div> : null}

        {tab === "overview" ? <Overview {...props} newLeads={newLeads} /> : null}
        {tab === "universities" ? <UniversityTable rows={props.universities} onAdd={() => setEditor({ entity: "universities", record: null })} onEdit={(record) => setEditor({ entity: "universities", record })} onDelete={remove} /> : null}
        {tab === "programmes" ? <ProgrammeTable rows={props.programmes} onAdd={() => setEditor({ entity: "programmes", record: null })} onEdit={(record) => setEditor({ entity: "programmes", record })} onDelete={remove} /> : null}
        {tab === "institutes" ? <InstituteTable rows={props.institutes} onAdd={() => setEditor({ entity: "language-institutes", record: null })} onEdit={(record) => setEditor({ entity: "language-institutes", record })} onDelete={remove} /> : null}
        {tab === "consultations" ? <Consultations rows={props.consultations} onStatus={updateLead} /> : null}
      </section>

      {editor ? (
        <Editor
          entity={editor.entity}
          record={editor.record}
          universities={props.universities}
          onClose={() => setEditor(null)}
          onSaved={(text) => { setEditor(null); setMessage(text); router.refresh(); }}
        />
      ) : null}
      {busy ? <div className="admin-busy">Working…</div> : null}
    </main>
  );
}

function AdminNav({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: ReactNode; label: string; badge?: number }) {
  return <button className={active ? "active" : ""} onClick={onClick}>{icon}<span>{label}</span>{badge ? <b>{badge}</b> : null}</button>;
}
function titleFor(tab: Tab) {
  return ({ overview: "Dashboard overview", universities: "Universities", programmes: "Programmes", institutes: "Language institutes", consultations: "Consultation leads" } as const)[tab];
}

function Overview({ universities, programmes, institutes, consultations, newLeads }: Props & { newLeads: number }) {
  const cards = [
    ["Universities", universities.length, Building2], ["Programmes", programmes.length, BookOpen],
    ["Language institutes", institutes.length, Languages], ["New leads", newLeads, Users],
  ] as const;
  return <>
    <div className="admin-stat-grid">{cards.map(([label, value, Icon]) => <article key={label}><span><Icon size={20} /></span><div><strong>{value}</strong><p>{label}</p></div></article>)}</div>
    <div className="admin-overview-grid">
      <article className="admin-panel"><h2>Recent consultations</h2>{consultations.slice(0, 6).map((lead) => <div className="admin-recent-lead" key={lead.id}><div><strong>{lead.full_name}</strong><span>{lead.study_level} · {lead.nationality}</span></div><em className={`status-${lead.status}`}>{lead.status}</em></div>)}{!consultations.length ? <p className="admin-empty">No stored leads yet.</p> : null}</article>
      <article className="admin-panel"><h2>Production workflow</h2><ol className="admin-workflow"><li>Verify information against an official source.</li><li>Add or update the record here.</li><li>Mark verified only when the source has been checked.</li><li>Confirm the public page after publishing.</li></ol></article>
    </div>
  </>;
}

function PanelHeader({ title, count, onAdd }: { title: string; count: number; onAdd: () => void }) {
  return <div className="admin-panel-header"><div><h2>{title}</h2><p>{count} records</p></div><button onClick={onAdd}><Plus size={17} /> Add new</button></div>;
}
function UniversityTable({ rows, onAdd, onEdit, onDelete }: TableProps<University>) {
  return <div className="admin-panel"><PanelHeader title="Universities" count={rows.length} onAdd={onAdd} /><div className="admin-table-wrap"><table><thead><tr><th>Institution</th><th>Location</th><th>Type</th><th>Verified</th><th /></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.short_name}</strong><span>{row.name}</span></td><td>{row.city || "—"}</td><td>{row.institution_type || "—"}</td><td>{row.verified ? "Yes" : "No"}</td><td><RowActions onEdit={() => onEdit(row)} onDelete={() => onDelete("universities", row.id, row.name)} /></td></tr>)}</tbody></table></div></div>;
}
function ProgrammeTable({ rows, onAdd, onEdit, onDelete }: TableProps<Programme>) {
  return <div className="admin-panel"><PanelHeader title="Programmes" count={rows.length} onAdd={onAdd} /><div className="admin-table-wrap"><table><thead><tr><th>Programme</th><th>University</th><th>Level</th><th>Campus</th><th>Fee</th><th>Verified</th><th /></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.name}</strong><span>{row.field || row.slug}</span></td><td>{row.universities?.short_name || "—"}</td><td>{row.level}</td><td>{row.campus || "—"}</td><td>{row.international_fee || (row.international_fee_amount ? `${row.fee_currency || "MYR"} ${Number(row.international_fee_amount).toLocaleString()}` : "—")}</td><td>{row.verified_at || "No"}</td><td><RowActions onEdit={() => onEdit(row)} onDelete={() => onDelete("programmes", row.id, row.name)} /></td></tr>)}</tbody></table></div></div>;
}
function InstituteTable({ rows, onAdd, onEdit, onDelete }: TableProps<Institute>) {
  return <div className="admin-panel"><PanelHeader title="Language institutes" count={rows.length} onAdd={onAdd} /><div className="admin-table-wrap"><table><thead><tr><th>Institute</th><th>Location</th><th>Verified</th><th /></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.short_name}</strong><span>{row.name}</span></td><td>{row.city || "—"}</td><td>{row.verified ? "Yes" : "No"}</td><td><RowActions onEdit={() => onEdit(row)} onDelete={() => onDelete("language-institutes", row.id, row.name)} /></td></tr>)}</tbody></table></div></div>;
}
function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) { return <div className="admin-row-actions"><button onClick={onEdit} title="Edit"><Pencil size={15} /></button><button onClick={onDelete} title="Delete" className="danger"><Trash2 size={15} /></button></div>; }

function Consultations({ rows, onStatus }: { rows: Consultation[]; onStatus: (id: string, status: string) => void }) {
  return <div className="admin-panel"><div className="admin-panel-header"><div><h2>Consultation leads</h2><p>{rows.length} most recent enquiries</p></div></div><div className="admin-table-wrap"><table><thead><tr><th>Student</th><th>Contact</th><th>Interest</th><th>Date</th><th>Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.full_name}</strong><span>{row.nationality}</span></td><td><a href={`https://wa.me/${String(row.whatsapp || "").replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{row.whatsapp}</a><span>{row.email || ""}</span></td><td>{row.study_level}<span>{row.field_of_study || ""}</span></td><td>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}</td><td><select value={row.status} onChange={(event) => onStatus(row.id, event.target.value)}><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="closed">Closed</option></select></td></tr>)}</tbody></table></div></div>;
}

function Editor({ entity, record, universities, onClose, onSaved }: { entity: EditEntity; record: EditableRecord | null; universities: University[]; onClose: () => void; onSaved: (text: string) => void }) {
  const [form, setForm] = useState<Record<string, any>>(() => ({ ...(record || {}), verified: record?.verified ?? false }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isProgramme = entity === "programmes";
  const fields = entity === "universities" ? universityFields : entity === "language-institutes" ? instituteFields : [];

  function set(key: string, value: any) { setForm((current) => ({ ...current, [key]: value })); }
  async function save() {
    setLoading(true); setError("");
    const url = record?.id ? `/api/admin/catalog/${entity}/${record.id}` : `/api/admin/catalog/${entity}`;
    const response = await fetch(url, { method: record?.id ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) return setError(payload.error || "Unable to save.");
    onSaved(record?.id ? "Record updated." : "Record created.");
  }

  return <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="admin-editor"><header><div><p className="admin-eyebrow">{record ? "EDIT RECORD" : "NEW RECORD"}</p><h2>{entity === "language-institutes" ? "Language institute" : entity === "universities" ? "University" : "Programme"}</h2></div><button onClick={onClose}><X /></button></header><div className="admin-editor-body">
    {isProgramme ? <>
      <SectionTitle title="Programme information" description="Core information used by programme search and profile pages." />
      <label><span>University *</span><select value={form.university_id || ""} onChange={(e) => set("university_id", e.target.value)}><option value="">Select university</option>{universities.map((item) => <option key={item.id} value={item.id}>{item.short_name} — {item.name}</option>)}</select></label>
      <label><span>Study level *</span><select value={form.level || ""} onChange={(e) => set("level", e.target.value)}><option value="">Select level</option>{STUDY_LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label><span>Programme name *</span><input value={form.name || ""} onChange={(e) => set("name", e.target.value)} placeholder="Bachelor of Civil Engineering (Honours)" /></label>
      <label><span>Arabic name</span><input value={form.arabic_name || ""} onChange={(e) => set("arabic_name", e.target.value)} placeholder="بكالوريوس الهندسة المدنية" dir="rtl" /></label>
      <label><span>Slug *</span><input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} placeholder="utm-bachelor-civil-engineering" /></label>
      <label><span>Field *</span><input list="admin-study-fields" value={form.field || ""} onChange={(e) => set("field", e.target.value)} placeholder="Civil Engineering" /><datalist id="admin-study-fields">{STUDY_FIELDS.map((item) => <option key={item} value={item} />)}</datalist></label>
      <label><span>Campus</span><input value={form.campus || ""} onChange={(e) => set("campus", e.target.value)} placeholder="Johor Bahru" /></label>
      <label><span>Duration</span><input value={form.duration || ""} onChange={(e) => set("duration", e.target.value)} placeholder="4 years" /></label>
      <label><span>Study mode</span><select value={form.study_mode || ""} onChange={(e) => set("study_mode", e.target.value)}><option value="">Not specified</option>{STUDY_MODES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <TextArea label="Intakes (one per line)" value={arrayText(form.intakes)} onChange={(v) => set("intakes", v)} />
      <TextArea label="Specialisations / pathways (one per line)" value={arrayText(form.specialisations)} onChange={(v) => set("specialisations", v)} />

      <SectionTitle title="Tuition" description="Keep the original display text, and add a numeric amount when possible for future budget matching." />
      <label><span>International fee display</span><input value={form.international_fee || ""} onChange={(e) => set("international_fee", e.target.value)} placeholder="RM 85,000 total" /></label>
      <label><span>Fee amount (number only)</span><input inputMode="decimal" value={form.international_fee_amount ?? ""} onChange={(e) => set("international_fee_amount", e.target.value)} placeholder="85000" /></label>
      <label><span>Currency</span><select value={form.fee_currency || "MYR"} onChange={(e) => set("fee_currency", e.target.value)}>{CURRENCIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label><span>Fee period</span><select value={form.fee_period || ""} onChange={(e) => set("fee_period", e.target.value)}><option value="">Not specified</option>{FEE_PERIODS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>

      <SectionTitle title="Admission requirements" description="Store exact official requirements. Do not infer or simplify them without a source." />
      <TextArea label="Academic requirements (English)" value={form.academic_requirements_en} onChange={(v) => set("academic_requirements_en", v)} />
      <TextArea label="Academic requirements (Arabic)" value={form.academic_requirements_ar} onChange={(v) => set("academic_requirements_ar", v)} />
      <TextArea label="English requirements (English)" value={form.english_requirements_en} onChange={(v) => set("english_requirements_en", v)} />
      <TextArea label="English requirements (Arabic)" value={form.english_requirements_ar} onChange={(v) => set("english_requirements_ar", v)} />
      <TextArea label="Required documents (English, one per line)" value={arrayText(form.required_documents_en)} onChange={(v) => set("required_documents_en", v)} />
      <TextArea label="Required documents (Arabic, one per line)" value={arrayText(form.required_documents_ar)} onChange={(v) => set("required_documents_ar", v)} />

      <SectionTitle title="Quality, funding and notes" description="Optional information that helps students compare and prepare an application." />
      <label className="admin-wide-field"><span>Accreditation / recognition</span><input value={form.accreditation || ""} onChange={(e) => set("accreditation", e.target.value)} /></label>
      <TextArea label="Scholarship information (English)" value={form.scholarship_info_en} onChange={(v) => set("scholarship_info_en", v)} />
      <TextArea label="Scholarship information (Arabic)" value={form.scholarship_info_ar} onChange={(v) => set("scholarship_info_ar", v)} />
      <TextArea label="Application notes (English)" value={form.application_notes_en} onChange={(v) => set("application_notes_en", v)} />
      <TextArea label="Application notes (Arabic)" value={form.application_notes_ar} onChange={(v) => set("application_notes_ar", v)} />

      <SectionTitle title="Verification" description="The programme becomes public only when a verified date is present." />
      <label className="admin-wide-field"><span>Official programme source URL *</span><input value={form.source_url || ""} onChange={(e) => set("source_url", e.target.value)} placeholder="https://official-university.edu/programme" /></label>
      <label><span>Verified date (YYYY-MM-DD)</span><input type="date" value={form.verified_at || ""} onChange={(e) => set("verified_at", e.target.value)} /></label>
    </> : null}
    {!isProgramme ? fields.map(([key, label]) => <label key={key}><span>{label}</span><input value={form[key] ?? ""} onChange={(e) => set(key, e.target.value)} /></label>) : null}
    {entity === "universities" ? <><TextArea label="Overview (English)" value={form.overview_en} onChange={(v) => set("overview_en", v)} /><TextArea label="Overview (Arabic)" value={form.overview_ar} onChange={(v) => set("overview_ar", v)} /><TextArea label="Study areas (English, one per line)" value={arrayText(form.study_areas_en)} onChange={(v) => set("study_areas_en", v)} /><TextArea label="Study areas (Arabic, one per line)" value={arrayText(form.study_areas_ar)} onChange={(v) => set("study_areas_ar", v)} /><CheckField checked={Boolean(form.verified)} onChange={(v) => set("verified", v)} label="Publish as verified" /></> : null}
    {entity === "language-institutes" ? <><TextArea label="Overview (English)" value={form.overview_en} onChange={(v) => set("overview_en", v)} /><TextArea label="Overview (Arabic)" value={form.overview_ar} onChange={(v) => set("overview_ar", v)} /><TextArea label="Course types (English, one per line)" value={arrayText(form.course_types_en)} onChange={(v) => set("course_types_en", v)} /><TextArea label="Course types (Arabic, one per line)" value={arrayText(form.course_types_ar)} onChange={(v) => set("course_types_ar", v)} /><CheckField checked={Boolean(form.verified)} onChange={(v) => set("verified", v)} label="Publish as verified" /></> : null}
    {error ? <div className="admin-error">{error}</div> : null}
  </div><footer><button className="secondary" onClick={onClose}>Cancel</button><button onClick={save} disabled={loading}><Save size={16} />{loading ? "Saving…" : "Save record"}</button></footer></div></div>;
}
function SectionTitle({ title, description }: { title: string; description?: string }) {
  return <div className="admin-section-title"><strong>{title}</strong>{description ? <p>{description}</p> : null}</div>;
}

function arrayText(value: unknown) { return Array.isArray(value) ? value.join("\n") : typeof value === "string" ? value : ""; }
function TextArea({ label, value, onChange }: { label: string; value?: string; onChange: (value: string) => void }) { return <label className="admin-wide-field"><span>{label}</span><textarea rows={4} value={value || ""} onChange={(e) => onChange(e.target.value)} /></label>; }
function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="admin-check-field"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span>{label}</span></label>; }
