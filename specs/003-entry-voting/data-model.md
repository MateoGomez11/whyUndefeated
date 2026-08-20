# Data Model: Votación de Veredicto en el Detalle de Entrada

**Feature**: 003-entry-voting | **Date**: 2026-08-17

A diferencia de `001-entries-directory`/`002-methodology-page`, el modelo de datos de esta feature **no**
vive en archivos versionados — vive en Supabase/PostgreSQL (Principio II de la constitución: la DB es
únicamente para contadores de voto/reacción). `content/entries/*.json` y `lib/content/schema.ts` no se
modifican ni se referencian desde aquí (research.md Decisión 3).

## Tabla: `votes`

| Columna | Tipo | Obligatorio | Reglas |
|---------|------|-------------|--------|
| `id` | `bigint generated always as identity` | Sí (PK) | Autogenerado |
| `entry_slug` | `text` | Sí | Sin FK (research.md Decisión 3) — corresponde al `Entry.slug` de `001-entries-directory`, no validado en DB |
| `voter_id` | `uuid` | Sí | Generado y persistido client-side (`lib/votes/voterId.ts`); opaco, no-personal |
| `choice` | `text` | Sí | `CHECK (choice IN ('agree', 'disagree'))` |
| `created_at` | `timestamptz` | Sí | `DEFAULT now()` |
| `updated_at` | `timestamptz` | Sí | `DEFAULT now()`; se actualiza en cada upsert (cambio de voto) |

**Restricción de integridad**: `UNIQUE (entry_slug, voter_id)` — implementa FR-002/FR-004/FR-011
(research.md Decisión 4): un `voter_id` solo puede tener **una** fila por `entry_slug`; cambiar de opción
actualiza esa fila (`ON CONFLICT ... DO UPDATE`), nunca inserta una segunda.

**Explícitamente NO incluye** (FR-005, Principio VI): nombre, email, dirección IP, user-agent, ni ningún
otro campo que permita reconstruir la identidad de un visitante. `voter_id` es un UUID generado
client-side sin relación con ningún sistema de identidad.

## Vista: `vote_counts` (único dato de voto de lectura pública — FR-013)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `entry_slug` | `text` | Agrupador |
| `choice` | `text` | `'agree'` \| `'disagree'` |
| `votes` | `bigint` | `COUNT(*)` de filas de `votes` para ese `(entry_slug, choice)` |

La vista se define con permisos de un rol que sí puede leer `votes` directamente; RLS en la tabla base
**deniega toda lectura al rol `anon`**. El único `GRANT SELECT` público es sobre `vote_counts`. Esto es lo
que hace que "leer registros individuales" sea imposible para un visitante, incluso conociendo la
`anon key` pública (research.md Decisión 7).

## Políticas de Row Level Security (RLS)

```sql
-- Habilitar RLS (deniega todo por defecto salvo policy explícita)
alter table votes enable row level security;

-- Lectura de filas individuales: SIN policy para `anon` → denegada (FR-013).

-- Escritura: cualquiera puede insertar/actualizar su propio voto (sin auth,
-- no se puede restringir "propio" más allá de lo que la unique constraint ya
-- garantiza — ver Assumptions de spec.md: best-effort, no infalible sin login).
create policy "anon can insert votes"
  on votes for insert
  to anon
  with check (choice in ('agree', 'disagree'));

create policy "anon can update their own vote row"
  on votes for update
  to anon
  using (true)
  with check (choice in ('agree', 'disagree'));
```

## SQL de referencia (migración completa)

```sql
-- supabase/migrations/0001_votes.sql

create table votes (
  id bigint generated always as identity primary key,
  entry_slug text not null,
  voter_id uuid not null,
  choice text not null check (choice in ('agree', 'disagree')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entry_slug, voter_id)
);

alter table votes enable row level security;

create policy "anon can insert votes"
  on votes for insert
  to anon
  with check (choice in ('agree', 'disagree'));

create policy "anon can update their own vote row"
  on votes for update
  to anon
  using (true)
  with check (choice in ('agree', 'disagree'));

create view vote_counts as
  select entry_slug, choice, count(*) as votes
  from votes
  group by entry_slug, choice;

grant select on vote_counts to anon;
```

**Alternativa documentada (no elegida, ver research.md Decisión 7)**: una función `security definer`
`get_vote_counts(p_slug text)` en vez de la vista `vote_counts` — funcionalmente equivalente, se prefirió
la vista por poder consultarse con la sintaxis estándar de PostgREST (`.from('vote_counts').select(...)`)
sin necesitar `.rpc(...)`.

## Relación con el modelo de datos de `001-entries-directory`

```text
content/entries/{slug}.json  →  Entry.slug (fuente de verdad del slug, en archivo)
                                        │
                                        │ (sin FK — research.md Decisión 3)
                                        ▼
Supabase: votes.entry_slug   →  texto libre, coincide con Entry.slug por convención de la app,
                                  no forzado por la base de datos
```

## Reglas de derivación en tiempo de uso (cliente)

- **Voto inicial vs. cambio de voto**: `VoteWidget` siempre llama `castVote(slug, voterId, choice)`, que
  hace un upsert — el cliente no necesita saber de antemano si el visitante ya votó; Postgres resuelve
  insert-vs-update vía `ON CONFLICT (entry_slug, voter_id)` (research.md Decisión 4).
- **Conteo mostrado**: `fetchVoteCounts(slug)` consulta `vote_counts` filtrando por `entry_slug`; si no
  hay filas para una opción, el conteo es 0 (no un placeholder roto — Edge Case de spec.md).
- **Degradación**: si `fetchVoteCounts` o `castVote` fallan (red, timeout, credenciales ausentes), el
  widget entra en estado "voting unavailable" — nunca lanza una excepción que afecte al resto de la
  página (research.md Decisión 9, FR-007/FR-008).
