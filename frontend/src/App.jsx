import { useState, useEffect, useRef } from "react"

const API = "http://localhost:3000"

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const SearchIcon = () => <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
const PlusIcon = () => <Icon d="M12 5v14M5 12h14" />
const EditIcon = () => <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
const TrashIcon = () => <Icon d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
const CloseIcon = () => <Icon d="M18 6L6 18M6 6l12 12" size={20} />
const MapPinIcon = () => <Icon d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" size={13} />
const CalIcon = () => <Icon d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" size={13} />
const LinkIcon = () => <Icon d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" size={13} />

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return ""
  const dt = new Date(d)
  return dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

const MESES = [
  ["01","Janeiro"],["02","Fevereiro"],["03","Março"],["04","Abril"],
  ["05","Maio"],["06","Junho"],["07","Julho"],["08","Agosto"],
  ["09","Setembro"],["10","Outubro"],["11","Novembro"],["12","Dezembro"],
]

const IMGS = [
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=70",
  "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=70",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=70",
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=70",
  "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=70",
]
const getImg = (id) => IMGS[Math.abs(id?.toString().charCodeAt(0) ?? 0) % IMGS.length]

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [corridas, setCorridas] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")
  const [busca, setBusca] = useState("")
  const [filtroDia, setFiltroDia] = useState("")
  const [filtroMes, setFiltroMes] = useState("")
  const [filtroAno, setFiltroAno] = useState("")
  const [filtroLocal, setFiltroLocal] = useState("")
  const [filtroDist, setFiltroDist] = useState("")

  const [modal, setModal] = useState(null) // null | "criar" | corrida

  // form state
  const [form, setForm] = useState({ nome: "", data: "", local: "", link: "", distancias: [] })
  const [formErro, setFormErro] = useState("")
  const [saving, setSaving] = useState(false)
  const [distInput, setDistInput] = useState("")
  const inputRef = useRef(null)

  async function buscarCorridas() {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (busca) p.set("nome", busca)
      if (filtroDia) p.set("dia", filtroDia)
      if (filtroMes) p.set("mes", filtroMes)
      if (filtroAno) p.set("ano", filtroAno)
      if (filtroLocal) p.set("local", filtroLocal)
      if (filtroDist) p.set("distancia", filtroDist)
      const r = await fetch(`${API}/corridas?${p}`)
      const d = await r.json()
      setCorridas(Array.isArray(d) ? d : [])
    } catch {
      setErro("Não foi possível conectar à API.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { buscarCorridas() }, [busca, filtroDia, filtroMes, filtroAno, filtroLocal, filtroDist])

  function abrirCriar() {
    setForm({ nome: "", data: "", local: "", link: "", distancias: [] })
    setFormErro("")
    setDistInput("")
    setModal("criar")
  }

  function abrirEditar(c) {
    setForm({
      nome: c.nome,
      data: c.data ? c.data.split("T")[0] : "",
      local: c.local,
      link: c.link || "",
      distancias: [...(c.distancias || [])],
    })
    setFormErro("")
    setDistInput("")
    setModal(c)
  }

  function addDist() {
    const v = Number(distInput)
    if (!distInput || isNaN(v) || v <= 0) return
    if (form.distancias.includes(v)) { setDistInput(""); return }
    setForm(f => ({ ...f, distancias: [...f.distancias, v].sort((a, b) => a - b) }))
    setDistInput("")
    inputRef.current?.focus()
  }

  function remDist(km) {
    setForm(f => ({ ...f, distancias: f.distancias.filter(d => d !== km) }))
  }

  async function salvar() {
    const { nome, data, local, link, distancias } = form
    if (!nome || !data || !local || !link) { setFormErro("Preencha todos os campos."); return }
    if (distancias.length === 0) { setFormErro("Adicione ao menos uma distância."); return }
    setSaving(true)
    setFormErro("")
    try {
      const isEdit = modal && modal !== "criar"
      const url = isEdit ? `${API}/corridas/${modal._id}` : `${API}/corridas`
      const method = isEdit ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, data, local, link, distancias }),
      })
      if (!res.ok) {
        const err = await res.json()
        setFormErro(err.error || "Erro ao salvar.")
        return
      }
      setModal(null)
      buscarCorridas()
    } catch {
      setFormErro("Erro de conexão com a API.")
    } finally {
      setSaving(false)
    }
  }

  async function deletar(id) {
    if (!confirm("Remover esta corrida?")) return
    await fetch(`${API}/corridas/${id}`, { method: "DELETE" })
    buscarCorridas()
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f4f1eb; color: #1a1a1a; font-family: 'DM Sans', sans-serif; min-height: 100vh; }

    /* HERO */
    .hero { position: relative; height: 440px; overflow: hidden; display: flex; align-items: flex-end; }
    .hero-bg { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1600&q=80') center/cover; filter: brightness(.45) saturate(1.2); }
    .hero-content { position: relative; z-index: 1; padding: 48px 48px 52px; max-width: 760px; }
    .hero-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #f5c842; margin-bottom: 12px; }
    .hero-title { font-family: 'Syne', sans-serif; font-size: clamp(44px, 7vw, 88px); font-weight: 800; line-height: .92; color: #f4f1eb; }
    .hero-title span { color: #f5c842; }
    .search-wrap { margin-top: 28px; display: flex; gap: 10px; flex-wrap: wrap; max-width: 680px; }
    .search-box { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 10px; background: rgba(244,241,235,.1); backdrop-filter: blur(10px); border: 1px solid rgba(244,241,235,.2); border-radius: 10px; padding: 12px 16px; color: #f4f1eb; }
    .search-box input { flex: 1; background: none; border: none; outline: none; color: inherit; font-family: inherit; font-size: 14px; }
    .search-box input::placeholder { color: rgba(244,241,235,.5); }
    .filter-sel { background: rgba(244,241,235,.1); backdrop-filter: blur(10px); border: 1px solid rgba(244,241,235,.2); border-radius: 10px; padding: 12px 14px; color: #f4f1eb; font-family: inherit; font-size: 13px; outline: none; min-width: 130px; }
    .filter-sel option { background: #1a1a1a; }

    /* MAIN */
    .main { max-width: 1280px; margin: 0 auto; padding: 48px 32px 80px; }
    .list-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
    .list-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; }
    .list-sub { font-size: 13px; color: #888; margin-top: 4px; }
    .btn-new { display: flex; align-items: center; gap: 8px; background: #1a1a1a; color: #f4f1eb; border: none; border-radius: 10px; padding: 13px 22px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: transform .15s, background .15s; }
    .btn-new:hover { background: #333; transform: translateY(-2px); }

    /* GRID */
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 22px; }
    .card { background: #fff; border-radius: 18px; overflow: hidden; transition: transform .22s, box-shadow .22s; }
    .card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,.1); }
    .card-img { position: relative; height: 190px; overflow: hidden; }
    .card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
    .card:hover .card-img img { transform: scale(1.06); }
    .card-badges { position: absolute; bottom: 12px; left: 12px; display: flex; gap: 6px; flex-wrap: wrap; }
    .badge { background: #f5c842; color: #1a1a1a; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; letter-spacing: .3px; }
    .card-actions { position: absolute; top: 12px; right: 12px; display: flex; gap: 6px; opacity: 0; transition: opacity .18s; }
    .card:hover .card-actions { opacity: 1; }
    .btn-icon { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform .12s; }
    .btn-icon:hover { transform: scale(1.1); }
    .btn-edit { background: #fff; color: #1a1a1a; }
    .btn-del { background: #ff4444; color: #fff; }
    .card-body { padding: 20px 22px 22px; }
    .card-name { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 10px; line-height: 1.2; }
    .card-meta { display: flex; flex-direction: column; gap: 6px; }
    .meta-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #666; }
    .card-link { display: inline-flex; align-items: center; gap: 5px; margin-top: 14px; font-size: 12px; font-weight: 600; color: #1a1a1a; text-decoration: none; border-bottom: 1.5px solid #f5c842; padding-bottom: 1px; transition: color .15s; }
    .card-link:hover { color: #666; }

    /* EMPTY / LOADING */
    .empty { text-align: center; padding: 80px; color: #aaa; }
    .empty-icon { font-size: 52px; margin-bottom: 16px; }

    /* MODAL */
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal { background: #fff; border-radius: 20px; padding: 40px; width: 100%; max-width: 500px; position: relative; max-height: 90vh; overflow-y: auto; }
    .modal-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; margin-bottom: 28px; }
    .btn-close { position: absolute; top: 20px; right: 20px; background: #f4f1eb; border: none; border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #666; transition: background .15s; }
    .btn-close:hover { background: #e8e4db; color: #1a1a1a; }
    .field { margin-bottom: 18px; }
    .field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 7px; }
    .field input { width: 100%; background: #f4f1eb; border: 1.5px solid transparent; border-radius: 10px; padding: 12px 16px; font-family: inherit; font-size: 14px; color: #1a1a1a; outline: none; transition: border-color .15s; }
    .field input:focus { border-color: #f5c842; }
    .dist-row { display: flex; gap: 8px; margin-bottom: 10px; }
    .dist-row input { flex: 1; background: #f4f1eb; border: 1.5px solid transparent; border-radius: 10px; padding: 12px 16px; font-family: inherit; font-size: 14px; outline: none; }
    .dist-row input:focus { border-color: #f5c842; }
    .btn-add-dist { background: #1a1a1a; color: #fff; border: none; border-radius: 10px; padding: 0 18px; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background .15s; }
    .btn-add-dist:hover { background: #333; }
    .dist-tags { display: flex; gap: 7px; flex-wrap: wrap; min-height: 28px; }
    .dist-tag { display: flex; align-items: center; gap: 6px; background: #f5c842; border-radius: 8px; padding: 5px 10px; font-size: 13px; font-weight: 700; }
    .dist-tag button { background: none; border: none; cursor: pointer; font-size: 16px; line-height: 1; color: #1a1a1a; padding: 0; }
    .form-err { background: #fff0f0; border: 1.5px solid #ffaaaa; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #cc3333; margin-bottom: 16px; }
    .btn-save { width: 100%; background: #1a1a1a; color: #f4f1eb; border: none; border-radius: 12px; padding: 15px; font-family: inherit; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 8px; transition: background .15s; }
    .btn-save:hover:not(:disabled) { background: #333; }
    .btn-save:disabled { opacity: .5; cursor: not-allowed; }

    @media (max-width: 640px) {
      .hero-content { padding: 32px 24px 40px; }
      .main { padding: 32px 20px 60px; }
      .list-header { flex-direction: column; align-items: flex-start; gap: 16px; }
    }
  `

  return (
    <>
      <style>{css}</style>

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-eyebrow">Plataforma de corridas</div>
          <h1 className="hero-title">Encontre sua<br />próxima <span>linha</span><br />de chegada.</h1>
          <div className="search-wrap">
            <div className="search-box">
              <SearchIcon />
              <input placeholder="Buscar por nome..." value={busca}
                onChange={e => setBusca(e.target.value)} />
            </div>
            <input className="filter-sel" style={{minWidth:80}} type="number"
              min="1" max="31" placeholder="📅 Dia"
              value={filtroDia} onChange={e => setFiltroDia(e.target.value)} />
            <select className="filter-sel" value={filtroMes}
              onChange={e => setFiltroMes(e.target.value)}>
              <option value="">🗓 Mês</option>
              {MESES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <input className="filter-sel" style={{minWidth:100}} type="number"
              min="2000" max="2100" placeholder="📆 Ano"
              value={filtroAno} onChange={e => setFiltroAno(e.target.value)} />
            <input className="filter-sel" style={{minWidth:150}} placeholder="📍 Cidade/Estado"
              value={filtroLocal} onChange={e => setFiltroLocal(e.target.value)} />
            <input className="filter-sel" style={{minWidth:100}} type="number"
              placeholder="🏃 km" value={filtroDist}
              onChange={e => setFiltroDist(e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="main">
        <div className="list-header">
          <div>
            <div className="list-title">Corridas disponíveis</div>
            <div className="list-sub">{corridas.length} resultado{corridas.length !== 1 ? "s" : ""}</div>
          </div>
          <button className="btn-new" onClick={abrirCriar}>
            <PlusIcon /> Nova corrida
          </button>
        </div>

        {erro && <div className="form-err">{erro}</div>}

        {loading ? (
          <div className="empty"><div className="empty-icon">⏳</div><div>Carregando...</div></div>
        ) : corridas.length === 0 ? (
          <div className="empty"><div className="empty-icon">🏁</div><div>Nenhuma corrida encontrada.</div></div>
        ) : (
          <div className="grid">
            {corridas.map(c => (
              <div className="card" key={c._id}>
                <div className="card-img">
                  <img src={getImg(c._id)} alt={c.nome} loading="lazy" />
                  <div className="card-badges">
                    {(c.distancias || []).map(km => (
                      <span className="badge" key={km}>{km}km</span>
                    ))}
                  </div>
                  <div className="card-actions">
                    <button className="btn-icon btn-edit" onClick={() => abrirEditar(c)} title="Editar"><EditIcon /></button>
                    <button className="btn-icon btn-del" onClick={() => deletar(c._id)} title="Excluir"><TrashIcon /></button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-name">{c.nome}</div>
                  <div className="card-meta">
                    <div className="meta-row"><MapPinIcon />{c.local}</div>
                    <div className="meta-row"><CalIcon />{fmtDate(c.data)}</div>
                    {c.link && (
                      <div className="meta-row"><LinkIcon />
                        <a className="card-link" href={c.link} target="_blank" rel="noreferrer">Ver evento</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <button className="btn-close" onClick={() => setModal(null)}><CloseIcon /></button>
            <div className="modal-title">{modal === "criar" ? "Nova corrida" : "Editar corrida"}</div>

            {formErro && <div className="form-err">{formErro}</div>}

            <div className="field">
              <label>Nome da corrida</label>
              <input placeholder="Ex: São Silvestre 2025" value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
            </div>
            <div className="field">
              <label>Data</label>
              <input type="date" value={form.data}
                onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
            </div>
            <div className="field">
              <label>Local</label>
              <input placeholder="Ex: São Paulo, SP" value={form.local}
                onChange={e => setForm(f => ({ ...f, local: e.target.value }))} />
            </div>
            <div className="field">
              <label>Link do evento</label>
              <input placeholder="https://..." value={form.link}
                onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
            </div>

            <div className="field">
              <label>Distâncias (km)</label>
              <div className="dist-row">
                <input ref={inputRef} type="number" min="1" placeholder="Ex: 10"
                  value={distInput} onChange={e => setDistInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addDist()} />
                <button className="btn-add-dist" onClick={addDist}>Adicionar</button>
              </div>
              <div className="dist-tags">
                {form.distancias.map(km => (
                  <span className="dist-tag" key={km}>
                    {km}km
                    <button onClick={() => remDist(km)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <button className="btn-save" onClick={salvar} disabled={saving}>
              {saving ? "Salvando..." : modal === "criar" ? "Cadastrar corrida" : "Salvar alterações"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}