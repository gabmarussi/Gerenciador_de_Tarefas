import streamlit as st
import pandas as pd
from datetime import datetime, date

# ------------------- Arquivo CSV -------------------
TASKS_FILE = "tasks.csv"

def load_tasks():
    try:
        return pd.read_csv(TASKS_FILE, parse_dates=["due_date"])
    except FileNotFoundError:
        return pd.DataFrame(columns=["id", "title", "category", "due_date", "notes", "flagged", "done"])

def save_tasks(df):
    df.to_csv(TASKS_FILE, index=False)

tasks_df = load_tasks()

# ------------------- Navegação -------------------
nav_options = ["Todos", "Agendados", "Hoje", "Sinalizados"]
nav_icons = ["📋", "📅", "⏰", "⭐"]

if "selected_view" not in st.session_state:
    st.session_state.selected_view = "Todos"

st.sidebar.title("Navegação")

# Botões de navegação grandes
for i in range(0, len(nav_options), 2):
    cols = st.sidebar.columns(2)
    for j, col in enumerate(cols):
        idx = i + j
        if idx < len(nav_options):
            option = nav_options[idx]
            icon = nav_icons[idx]
            label = f"{icon} {option}"
            if col.button(label, use_container_width=True, key=f"nav_btn_{option}"):
                st.session_state.selected_view = option

selected_view = st.session_state.selected_view

# ------------------- Listas minimalistas -------------------
st.sidebar.markdown("---")
st.sidebar.subheader("Listas")

custom_categories = [c for c in tasks_df["category"].dropna().unique().tolist() if c != "Sem categoria"]

for cat in custom_categories:
    count = tasks_df[(tasks_df["category"] == cat) & (tasks_df["done"] == False)].shape[0]

    # Linha com colunas para nome + contagem
    cols = st.sidebar.columns([4, 1])
    with cols[0]:
        if st.button(f"📂 {cat}", key=f"cat_btn_{cat}"):
            st.session_state.selected_view = cat
    with cols[1]:
        st.markdown(
            f"<div style='display:flex; align-items:center; justify-content:flex-end; height:100%;'>{count}</div>",
            unsafe_allow_html=True
        )

    # Espaçamento compacto entre listas
    st.sidebar.markdown("<div style='height:2px;'></div>", unsafe_allow_html=True)

# Adicionar nova lista
with st.sidebar.expander("➕ Nova Lista"):
    new_category = st.text_input("Nome da lista", key="new_category_input")
    if st.button("Adicionar Lista", key="add_category_btn"):
        if new_category and new_category not in custom_categories:
            # Tarefa fantasma para registrar categoria
            tasks_df = pd.concat([tasks_df, pd.DataFrame([{
                "id": len(tasks_df)+1,
                "title": "",
                "category": new_category,
                "due_date": pd.NaT,
                "notes": "",
                "flagged": False,
                "done": True,
            }])], ignore_index=True)
            save_tasks(tasks_df)
            custom_categories.append(new_category)
            st.session_state.selected_view = new_category
            st.success(f"Lista '{new_category}' criada!")

# ------------------- Main - Adicionar Tarefa -------------------
st.title(f"Tarefas - {st.session_state.selected_view}")

with st.expander("➕ Adicionar Tarefa"):
    view_key = st.session_state.get("selected_view", "Todos")
    title = st.text_input("Título da Tarefa", key=f"new_task_title_{view_key}")
    category = st.selectbox(
        "Lista", options=["Sem categoria"] + custom_categories, key=f"new_task_category_{view_key}"
    )
    due_date = st.date_input("Data de entrega (opcional)", value=None, key=f"new_task_due_date_{view_key}")
    notes = st.text_area("Notas (opcional)", key=f"new_task_notes_{view_key}")
    flagged = st.checkbox("Sinalizar", key=f"new_task_flagged_{view_key}")

    if st.button("Salvar Tarefa", key=f"save_new_task_{view_key}"):
        if title:
            new_task = {
                "id": len(tasks_df) + 1,
                "title": title,
                "category": category if category else "Sem categoria",
                "due_date": pd.to_datetime(due_date) if due_date else pd.NaT,
                "notes": notes,
                "flagged": flagged,
                "done": False,
            }
            tasks_df = pd.concat([tasks_df, pd.DataFrame([new_task])], ignore_index=True)
            save_tasks(tasks_df)
            st.success("Tarefa adicionada com sucesso!")
            st.session_state.selected_view = category

# ------------------- Filtragem de tarefas -------------------
today = pd.to_datetime(date.today())

if selected_view == "Hoje":
    view_df = tasks_df[(tasks_df["due_date"].dt.date == today.date()) & (tasks_df["done"] == False)]
elif selected_view == "Programados":
    view_df = tasks_df[(tasks_df["due_date"].notna()) & (tasks_df["due_date"] >= today) & (tasks_df["done"] == False)]
elif selected_view == "Sinalizados":
    view_df = tasks_df[(tasks_df["flagged"] == True) & (tasks_df["done"] == False)]
elif selected_view == "Todos":
    view_df = tasks_df[tasks_df["done"] == False]
else:
    view_df = tasks_df[(tasks_df["category"] == selected_view) & (tasks_df["done"] == False)]

# ------------------- Listagem de tarefas -------------------
if view_df.empty:
    st.info("Nenhuma tarefa encontrada.")
else:
    for idx, row in view_df.iterrows():
        cols = st.columns([0.05, 4, 1])
        
        # Checkbox para concluir
        with cols[0]:
            done = st.checkbox("", value=row["done"], key=f"done_{row['id']}")
            if done != row["done"]:
                tasks_df.at[idx, "done"] = done
                save_tasks(tasks_df)

        # Conteúdo da tarefa
        with cols[1]:
            priority = row.get("priority", 0)
            pri_symbol = "❗" * priority if priority else ""
            task_title = f"{pri_symbol} **{row['title']}**"
            if row["flagged"]:
                task_title += " ⭐"
            st.markdown(task_title)
            if row["notes"]:
                st.caption(row["notes"])
            if pd.notna(row["due_date"]):
                due = row["due_date"]
                if due.date() == date.today():
                    st.caption(f"📅 Hoje, {due.strftime('%H:%M')}")
                elif due.date() == (date.today() + pd.Timedelta(days=1)):
                    st.caption(f"📅 Amanhã, {due.strftime('%H:%M')}")
                else:
                    st.caption(f"📅 {due.strftime('%d/%m/%Y %H:%M')}")

        # Botão de edição
        with cols[2]:
            if st.button("ℹ️", key=f"info_{row['id']}"):
                with st.expander("Editar Tarefa", expanded=True):
                    new_title = st.text_input("Título", value=row["title"], key=f"edit_title_{row['id']}")
                    new_notes = st.text_area("Notas", value=row["notes"], key=f"edit_notes_{row['id']}")
                    new_priority = st.selectbox("Prioridade", [0,1,2,3], index=row.get("priority",0), key=f"edit_priority_{row['id']}")
                    new_date = st.date_input("Data", value=row["due_date"].date() if pd.notna(row["due_date"]) else None, key=f"edit_date_{row['id']}")
                    new_time = st.time_input("Hora", value=row["due_date"].time() if pd.notna(row["due_date"]) else datetime.now().time(), key=f"edit_time_{row['id']}")
                    if st.button("Salvar", key=f"save_edit_{row['id']}"):
                        tasks_df.at[idx, "title"] = new_title
                        tasks_df.at[idx, "notes"] = new_notes
                        tasks_df.at[idx, "priority"] = new_priority
                        tasks_df.at[idx, "due_date"] = datetime.combine(new_date, new_time)
                        save_tasks(tasks_df)
                        st.experimental_rerun()