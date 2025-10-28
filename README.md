# FECAP - Fundação de Comércio Álvares Penteado

<p align="center">
<a href= "https://www.fecap.br/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZPrRa89Kma0ZZogxm0pi-tCn_TLKeHGVxywp-LXAFGR3B1DPouAJYHgKZGV0XTEf4AE&usqp=CAU" alt="FECAP - Fundação de Comércio Álvares Penteado" border="0"></a>
</p>

# 🎓 EduTask

## Integrantes: <a href="https://www.linkedin.com/in/eduardo-savino-gomes-77833a10/">Arthur Rodrigues Ferreira</a>, <a href="https://www.linkedin.com/in/gabrielmarussi/">Gabriel Henrique Coelho Marussi</a>, <a href="https://www.linkedin.com/in/lucasskenichi/">Lucas Kenichi Soares Abe</a> e <a href="https://www.linkedin.com/in/pedro-dimitry-zyrianoff-2223b1268/">Pedro Dimitry Zyrianoff</a>.

## Professora Orientadora: <a href="https://www.linkedin.com/in/lucymari/">Lucy Mari Tabuti</a>

## Descrição

<p align="center">
 <img width="2500" height="1259" alt="Image" src="https://github.com/user-attachments/assets/3c7c931b-d029-4ddd-9196-55b25c87a1e6" />
</p>

O projeto **EduTask** é um sistema desenvolvido por nós alunos da FECAP por meio da matéria Engenharia de Software e Arquitetura de Sistemas com o objetivo de **solucionar um problema de gestão de tempo e organização** na comunidade acadêmica, desenvolvendo uma ferramenta educacional focada em produtividade. Esta aplicação foi criada para ser uma **ferramenta web** de gerenciamento de tarefas que beneficiará **professores e orientadores** ao facilitar e organizar as tarefas do dia a dia na profissão, com uma interface elegante e intuitiva (inspirada no estilo Apple Reminders).
<br><br>

## 🛠 Como Utilizar

O EduTask foi projetado para ser intuitivo e acessível via navegador (web).

1.  **Acesso:** Basta executar o link de acesso (URL) no seu celular/computador.
2.  **Registro:** Crie uma conta de usuário (ou faça login).
3.  **Organização:** Comece utilizando as Listas Inteligentes (como "Hoje" ou "Prioridade") ou crie novas Listas/Projetos (ex: "Turma de TCC", "Planejamento de Aulas").
4.  **Produtividade:** Siga utilizando o sistema, criando todas as tarefas, definindo prioridades e prazos, e acompanhando seu progresso nas visualizações em Lista, Kanban ou Calendário.

## 🚀 Tecnologias Usadas

O EduTask é uma aplicação web completa (Full-Stack), utilizando tecnologias modernas para garantir performance, escalabilidade e uma excelente experiência de usuário.

| Categoria | Tecnologia | Objetivo |
| :--- | :--- | :--- |
| **Frontend**                 | **[React 18 / Vite ]**                  | Construção da Interface de Usuário (UI) limpa e responsiva.                    |
| **Linguagem**                | **[TypeScript]**                          | Linguagem principal para o desenvolvimento do Frontend e Backend.              |
| **Backend / Banco de Dados** | **[Supabase (Auth + Postgres)]**        | Armazenamento e manipulação persistente de tarefas, listas e dados de usuário. |
| **Estilização**              | **[Tailwind CSS, Radix UI (Components)]** | Implementação do Design System minimalista e elegante (Estilo Apple).          |

## 💻 Configuração para Desenvolvimento

Para rodar e contribuir com o desenvolvimento do EduTask:

### Pré-requisitos

- **Node.js (LTS)**: Necessário para executar o ambiente JavaScript.
- **npm** (ou yarn): Gerenciador de pacotes.
- **Supbase**: Necessário para criação de banco de dados e backend.

### Passos de Execução

1. **Instalar dependências**

```bash
npm install
```

2. **Criar um arquivo `.env` com as variáveis abaixo:**

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-or-publishable-key>
```

3. **Rodar em modo desenvolvimento**

```bash
npm run dev
```

4. **Build para produção**

```bash
npm run build
```

Notas:

- As migrations estão em `supabase/migrations/`. Aplique-as via Supabase SQL Editor ou `supabase` CLI para criar as tabelas `profiles`, `lists` e `tasks` e as policies associadas.
