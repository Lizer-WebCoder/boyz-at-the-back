# Boyz at the Back

**Prison-themed Discord-style chat app** built with React Native (Expo) + Supabase.

> *"Pass a note through the bars..."*

## Theme: Cell Block Chic

- **Colors**: Department of Corrections Orange `#FF5F1F`, Charcoal `#1E1E24`, Concrete `#2B2B33`
- **Statuses**: In the Yard · Solitary Confinement · Out on Bail · On Parole
- **Channels**: Wings (categories) → Cell Blocks (text) / Payphones (voice)
- **DMs**: 1-on-1 Interrogation & Gang Alliances
- **Roles**: Warden, Shot Caller, Lifer, Fresh Fish

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Lizer-WebCoder/boyz-at-the-back.git
cd boyz-at-the-back
npm install
```

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full script in `supabase/schema.sql`
3. Enable **Realtime** for the tables listed in the SQL file
4. Create a Storage bucket named `media` (public)
5. Copy your project URL + anon key into `.env`:

```bash
cp .env.example .env
# then edit .env
```

### 3. Run

```bash
npx expo start
```

Scan the QR code with Expo Go (or press `i` / `a` for simulators).

## Project Structure

```
app/                    # Expo Router screens
src/
  components/           # UI + chat components
  contexts/             # Auth, Theme
  hooks/                # useMessages, usePresence, etc.
  lib/                  # supabase client, theme, types
  stores/               # Zustand stores
supabase/
  schema.sql            # Full PostgreSQL + RLS + triggers
```

## Features Implemented (Foundation)

- [x] Auth (email/password) + auto profile + Inmate ID
- [x] Real-time messaging via Supabase Realtime
- [x] Channel list (Wings / Cell Blocks)
- [x] Message input ("Smuggle" button)
- [x] Mugshot-style avatars
- [x] Prison theme throughout
- [x] Row Level Security + profile trigger
- [ ] Voice (Payphones) — LiveKit/Agora skeleton ready
- [ ] Threads ("Secret Tunnel")
- [ ] Lockdown Mode
- [ ] Full long-press actions + custom reactions
- [ ] Push notifications
- [ ] Friend requests / blocking

## License

MIT — build something illegal (in the fun way).
