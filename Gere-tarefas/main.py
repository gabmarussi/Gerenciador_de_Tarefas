import streamlit as st
import pandas as pd
from datetime import datetime, date, time
from urllib.parse import quote_plus, unquote_plus

# ------------------- Config / CSV -------------------
st.set_page_config(page_title="Gerenciador de Tarefas", layout="wide")
TASKS_FILE = "tasks.csv"

def load_tasks():
    try:
        return pd.read_csv(TASKS_FILE, parse_dates=["due_date"])
    except FileNotFoundError:
        # garante colunas esperadas
        return pd.DataFrame(columns=["id", "title", "category", "due_date", "notes", "flagged", "done", "priority"])

def save_tasks(df):
    df.to_csv(TASKS_FILE, index=False)

tasks_df = load_tasks()

# ------------------- CSS para NAV buttons (ícone em cima, texto embaixo) -------------------
st.markdown("""
    <style>
    /* estiliza botões (nav) para empilhar ícone/texto e ter altura fixa */
    div.stButton > button {
        height: 72px;
        border-radius: 10px;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        white-space: pre-line;
        padding: 6px 8px;
        text-align: center;
    }
    div.stButton > button > span {
        overflow-wrap: anywhere;
    }

    /* pequenas melhorias tipográficas no main */
    .task-title { font-weight:700; margin-bottom:4px; }
    .task-notes { color: #9aa0a6; font-size:0.95em; margin-top:4px; }
    </style>
""", unsafe_allow_html=True)

# ------------------- Navegação (sidebar topo) -------------------
nav_options = ["Todos", "Agendados", "Hoje", "Sinalizados"]
nav_icons   = ["📋", "📅", "⏰", "⭐"]

if "selected_view" not in st.session_state:
    st.session_state.selected_view = "Todos"

# Se a URL possui ?view=..., prioriza esse parâmetro (permite links diretos)
params = st.experimental_get_query_params()
if "view" in params and params["view"]:
    try:
        decoded = unquote_plus(params["view"][0])
        # atualiza somente se valor existir (evita sobrescrever)
        st.session_state.selected_view = decoded
    except Exception:
        pass

st.sidebar.title("Navegação")

# Botões de navegação (2 por linha)
for i in range(0, len(nav_options), 2):
    cols = st.sidebar.columns(2)
    for j, col in enumerate(cols):
        idx = i + j
        if idx < len(nav_options):
            option = nav_options[idx]
            icon = nav_icons[idx]
            label = f"{icon}\n{option}"
            if col.button(label, use_container_width=True, key=f"nav_btn_{option}"):
                st.session_state.selected_view = option

selected_view = st.session_state.selected_view

# ------------------- Listas (flat links sem fundo) -------------------
st.sidebar.markdown("---")
st.sidebar.subheader("Listas")

# obtém categorias persistidas via tasks_df (controlo de "Sem categoria" ignorado)
custom_categories = [c for c in tasks_df["category"].dropna().unique().tolist() if c != "Sem categoria"]

# renderiza cada categoria como link plano com contador à direita
for cat in custom_categories:
    count = int(tasks_df[(tasks_df["category"] == cat) & (tasks_df["done"] == False)].shape[0])
    cat_url = f"?view={quote_plus(cat)}"
    
    html = f"""
    <a href="{cat_url}" style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        color:inherit;
        text-decoration:none;
        width:100%;
        box-sizing:border-box;
    ">
        <div style="display:flex; align-items:center; gap:8px; flex:1; justify-content:flex-start;">
            <span style="font-size:18px; line-height:1;">📂</span>
            <span style="font-weight:500;">{cat}</span>
            <div style="min-width:28px; text-align:right; font-weight:600;">
                {count}
            </div>
        </div>
    </a>
    """
    st.sidebar.markdown(html, unsafe_allow_html=True)

# adicionar nova lista (persistida como "phantom" task para simplicidade)
with st.sidebar.expander("➕ Nova Lista"):
    new_category = st.text_input("Nome da lista", key="new_category_input")
    if st.button("Adicionar Lista", key="add_category_btn"):
        if new_category and new_category not in custom_categories:
            # cria um registro "done" (oculto) apenas para persistir a categoria
            tasks_df = pd.concat([tasks_df, pd.DataFrame([{
                "id": len(tasks_df) + 1,
                "title": "",
                "category": new_category,
                "due_date": pd.NaT,
                "notes": "",
                "flagged": False,
                "done": True,
                "priority": 0
            }])], ignore_index=True)
            save_tasks(tasks_df)
            st.success(f"Lista '{new_category}' criada! (recarregue para ver)")

# ------------------- Cabeçalho (topo, alinhado à esquerda) -------------------
st.markdown(
    f"<h1 style='text-align:left; margin-top:4px; margin-bottom:4px;'>Tarefas - {selected_view}</h1>",
    unsafe_allow_html=True
)

# ------------------- Adicionar Tarefa (compacto) -------------------
with st.container():
    st.markdown("### ➕ Adicionar Tarefa")
    view_key = st.session_state.get("selected_view", "Todos")
    title = st.text_input("Título da Tarefa", key=f"new_task_title_{view_key}")
    category = st.selectbox(
        "Lista", options=["Sem categoria"] + custom_categories, key=f"new_task_category_{view_key}"
    )
    due_date = st.date_input("Data de entrega (opcional)", value=None, key=f"new_task_due_date_{view_key}")
    # hora opcional (para exibir hora quando adicionada)
    due_time = st.time_input("Hora (opcional)", value=None, key=f"new_task_time_{view_key}")
    notes = st.text_area("Notas (opcional)", key=f"new_task_notes_{view_key}")
    flagged = st.checkbox("Sinalizar", key=f"new_task_flagged_{view_key}")
    priority = st.selectbox("Prioridade", [0, 1, 2, 3], index=0, key=f"new_task_priority_{view_key}")

    if st.button("Salvar Tarefa", key=f"save_new_task_{view_key}"):
        if title:
            # combina data e hora quando ambos fornecidos
            if due_date and isinstance(due_time, time):
                due_dt = datetime.combine(due_date, due_time)
            elif due_date:
                due_dt = datetime.combine(due_date, time(0, 0))
            else:
                due_dt = pd.NaT

            new_task = {
                "id": len(tasks_df) + 1,
                "title": title,
                "category": category if category else "Sem categoria",
                "due_date": due_dt,
                "notes": notes if notes else "",
                "flagged": bool(flagged),
                "done": False,
                "priority": int(priority)
            }
            tasks_df = pd.concat([tasks_df, pd.DataFrame([new_task])], ignore_index=True)
            save_tasks(tasks_df)
            st.success("Tarefa adicionada com sucesso!")
            # atualiza view para a categoria criada/selecionada
            st.session_state.selected_view = new_task["category"]

# ------------------- Filtragem de tarefas -------------------
today = pd.to_datetime(date.today())

if selected_view == "Hoje":
    view_df = tasks_df[(tasks_df["due_date"].dt.date == today.date()) & (tasks_df["done"] == False)]
elif selected_view == "Agendados" or selected_view == "Agendados":  # compatibilidade
    view_df = tasks_df[(tasks_df["due_date"].notna()) & (tasks_df["due_date"] >= today) & (tasks_df["done"] == False)]
elif selected_view == "Sinalizados":
    view_df = tasks_df[(tasks_df["flagged"] == True) & (tasks_df["done"] == False)]
elif selected_view == "Todos":
    view_df = tasks_df[tasks_df["done"] == False]
else:
    # categoria específica
    view_df = tasks_df[(tasks_df["category"] == selected_view) & (tasks_df["done"] == False)]

# ------------------- Listagem de tarefas (visual mais rico) -------------------
st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)  # pequeno espaçamento

if view_df.empty:
    st.info("Nenhuma tarefa encontrada.")
else:
    for idx, row in view_df.iterrows():
        # layout: checkbox | conteúdo (título + notas + data) | ações
        cols = st.columns([0.05, 4, 0.7])

        # checkbox de conclusão
        with cols[0]:
            done = st.checkbox("", value=bool(row["done"]), key=f"done_{row['id']}")
            if done != bool(row["done"]):
                tasks_df.at[idx, "done"] = bool(done)
                save_tasks(tasks_df)

        # conteúdo principal
        with cols[1]:
            priority = int(row.get("priority", 0)) if pd.notna(row.get("priority", 0)) else 0
            pri_symbol = "❗" * priority if priority else ""
            title_text = row["title"] if pd.notna(row["title"]) else ""

            # título (sempre alinhado à esquerda com um leve offset)
            st.markdown(f"<div class='task-title' style='margin-left:8px;'>{pri_symbol} {title_text} {'⭐' if row.get('flagged') else ''}</div>", unsafe_allow_html=True)

            # notas: só exibe se houver (evita 'nan')
            notes = str(row["notes"]) if (pd.notna(row.get("notes")) and row.get("notes") != "") else None
            if notes:
                st.markdown(f"<div class='task-notes' style='margin-left:8px;'>{notes}</div>", unsafe_allow_html=True)

            # data/horário (formato amigável)
            if pd.notna(row.get("due_date")):
                due = pd.to_datetime(row["due_date"])
                if due.date() == date.today():
                    st.caption(f"📅 Hoje, {due.strftime('%H:%M')}")
                elif due.date() == (date.today() + pd.Timedelta(days=1)):
                    st.caption(f"📅 Amanhã, {due.strftime('%H:%M')}")
                else:
                    st.caption(f"📅 {due.strftime('%d/%m/%Y %H:%M')}")

        # ações (editar / info)
        with cols[2]:
            # abrimos expander de edição ao clicar
            if st.button("ℹ️", key=f"info_{row['id']}"):
                # ao abrir o expander usamos campos para editar
                with st.expander("Editar Tarefa", expanded=True):
                    new_title = st.text_input("Título", value=row["title"], key=f"edit_title_{row['id']}")
                    new_notes = st.text_area("Notas", value=row["notes"], key=f"edit_notes_{row['id']}")
                    new_priority = st.selectbox("Prioridade", [0,1,2,3], index=int(row.get("priority",0)), key=f"edit_priority_{row['id']}")
                    new_flagged = st.checkbox("Sinalizar", value=bool(row.get("flagged", False)), key=f"edit_flagged_{row['id']}")
                    new_date = st.date_input("Data", value=pd.to_datetime(row["due_date"]).date() if pd.notna(row["due_date"]) else None, key=f"edit_date_{row['id']}")
                    new_time = st.time_input("Hora", value=pd.to_datetime(row["due_date"]).time() if pd.notna(row["due_date"]) else time(0,0), key=f"edit_time_{row['id']}")
                    if st.button("Salvar", key=f"save_edit_{row['id']}"):
                        # atualiza os campos
                        tasks_df.at[idx, "title"] = new_title
                        tasks_df.at[idx, "notes"] = new_notes if new_notes else ""
                        tasks_df.at[idx, "priority"] = int(new_priority)
                        tasks_df.at[idx, "flagged"] = bool(new_flagged)
                        if new_date:
                            tasks_df.at[idx, "due_date"] = datetime.combine(new_date, new_time)
                        else:
                            tasks_df.at[idx, "due_date"] = pd.NaT
                        save_tasks(tasks_df)
                        st.experimental_rerun()