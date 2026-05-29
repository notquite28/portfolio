---
title: "WabiSabi: An Imperfect Rust Agent Harness"
description: "A look at building Sabi Agent, a small Rust coding-agent harness with inspectable loops, tools, approvals, sessions, and an early Tauri desktop shell."
author: "Arnav Panigrahi"
published: "2026-05-27"
updated: "2026-05-27T00:00:00.000Z"
categories: ["rust", "ai", "agents", "tauri", "cli"]
---

# Building Sabi Agent: A Rust Coding-Agent Harness

#### "Can I build this in Rust?"

### Rust-shaped Box

Sabi Agent is a small Rust coding-agent harness. The name comes from **sabi**, or **錆**, which means rust in Japanese. Yes, I could not come up with something more clever.

I built it because coding agents are impressive but also scary. They can one-shot a SaaS business, then obliterate the company's AWS bucket while calling the senior developer's code crap.

So I asked the dangerous question: can I build a small version of this in Rust? Not the polished demo version where the agent spawns a million subagents, overwrites other people's branches, and says, “You are absolutely right! I should not have erased your S3 bucket without asking!”

I wanted the boring machinery: loops, tools, sessions, approvals, diffs, and frontend boundaries. A coding agent should be something I can inspect, not a shining slot machine with whimsical loader text designed to make my brain spend a million more tokens.

I used the TypeScript [Pi coding agent](https://pi.dev/) as a reference and ported the core ideas into Rust. [Mario Zechner](https://github.com/badlogic) designed Pi as a minimal terminal coding harness that exposes the seams: agent loop, tools, sessions, skills, prompts, providers, and user control. His [writeup on Pi](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) and [cchistory project](https://mariozechner.at/posts/2025-08-03-cchistory/) made me think about something small that adds up: hidden prompts and tool changes matter because they change the programming environment under your feet.

So I borrowed Pi's philosophy, not its whole house: **learn the behavior, do not rebuild the spaceship**.

Pi has the mature harness stuff: TUI, usage modes, extensions, skills, prompt templates, package sharing, provider support, context hooks, and tree-structured sessions. Sabi deliberately does not. It is a small boring loop, small boring tools, and enough structure that I can work on it at 3 a.m. with a podcast by a Japanese lady trying to name the 50 states.

If a feature required a whiteboard, a second brain, or me pretending I was founding AgentLayer, it probably did not belong in the first version.

The questions I cared about were simple:

* What did the model see?
* What tool did it ask for?
* What arguments did it pass?
* Did the user approve the risky thing?
* What changed on disk?
* Can I inspect the session later?

### WabiSabi?

Sabi is currently an alpha/proof-of-concept coding-agent harness, not an open-source Claude Code clone. The CLI is the part I am actually proud of. The desktop UI is the part that exists because every agent project eventually looks at a terminal and says, “what if this had panes?”

The repo is split like this:

* `sabi-agent/` is the active Rust crate.
* `desktop/` is the early Tauri shell over the same Rust library.
* `pi/` is the TypeScript reference, kept as a submodule and treated like a place of reverence: useful to visit, bad omen to casually defile.
* `docs/` has architecture notes, the user manual, roadmap, and porting notes.

I also tried to keep the ancestry visible in the Rust code. `agent.rs` points back to Pi's agent loop. `edit.rs` points back to Pi's edit and diff tools. `session.rs` points back to JSONL session storage.

The “I will remember why I did this” to “a mysterious Ronin in my dreams revealed this system design” pipeline is one of the funniest jokes in software. Two weeks later you are staring at your own code like it appeared out of thin air. The module notes are mostly there because future me deserves breadcrumbs.

One decision I like: core logic lives behind `src/lib.rs`, while `src/main.rs` stays a thin CLI frontend. That lets the desktop app call the same engine instead of reverse-engineering its own CLI output like Ouroboros.

At the moment, Sabi supports OpenAI-compatible chat completions, project/user/env config, built-in file and shell tools, Exa-backed search, JSONL sessions, slash commands, skills, approval prompts, and a small Tauri shell with project selection, autocomplete, approval cards, compact tool rows, and collapsible diffs.

### The Meat and Bones

The heart of Sabi is the agent loop. It sounds more mysterious than it is:

1. Add the user message.
2. Send messages and tool schemas to an OpenAI-compatible provider.
3. Receive assistant text and optional tool calls.
4. Execute requested tools.
5. Append tool results.
6. Repeat until the assistant stops asking for tools.

The Rust version keeps this linear. No branching session tree, compaction, extension runtime, RPC mode, or multi-agent orchestration. I am sure someone has already built an executive committee suite of subagents. I do not want it near my dotfiles.

There is a hard cap of 30 tool rounds. Is 30 sacred? No. It is high enough for useful multi-step work and low enough that if the model starts trying to commune with `rg`, the program eventually says no.

`agent.rs` is almost annoyingly literal: persist the user message, call `complete_chat_message`, copy out assistant text and tool calls, persist the assistant message, run each tool, append tool results, repeat. System prompts are not written to the session file; they are re-injected on resume, `/clear`, `/new`, and `/reload`. Good for me because I do not want my system prompt to be my digital footprint.

The agent emits structured events for assistant text, tool start/finish, diffs, file changes, and errors. That boundary matters. The CLI can print plain text, while the desktop app can render cards, approvals, diffs, and session state without stdout archaeology.

The provider layer is intentionally boring too. It builds an OpenAI-style `/chat/completions` request, maps the response back into Sabi's `Message` enum, and includes `--check-provider` for the deeply stupid but common case where the agent loop is fine and the base URL is just wrong.

That command is basically emotional support for debugging. When an agent fails, your brain wants to blame the loop, the schema, the serializer, the model, the moon, and maybe your childhood. Sometimes the URL is just wrong.

### Pi as a Reference

Pi was useful because it gave me a map, not code to blindly copy. A real terminal harness eventually has to care about the assistant/tool/result rhythm, practical file editing, durable sessions, reusable instructions, provider support, and extension seams.

Every time Pi had a mature feature, I asked: “Do I need this to understand the core harness? Or am I hyperfixating again?” The answer was usually yes to the latter. Immaculate open-source repositories are dangerous. They show up as a friend and then steal your weekend.

So Sabi does not have branching session trees, compaction, OAuth, an extension runtime, package installation, prompt templates, image support, RPC mode, SDK mode, or a full TUI. Those omissions are guardrails for the tiny model inside my noodle.

I did not copy Pi's answers; although I did ask chat gipitty to paraphrase it a bit. Pi goes YOLO by default; Sabi has approvals. Pi embraces extensions; Sabi is just a small boy. The lesson transferred cleanly: the harness should make its machinery visible, and the user should understand what the model saw, what tool it called, and why a file changed.

The Rust version is also honest about cheating. `grep` is `rg`. `find` is `fd`. Diffs use `similar`. Skill discovery uses `ignore::WalkBuilder`. This is the cheating I endorse: small code, sharp boundaries, and battle-tested tools doing battle-tested things. There is no medal for writing a worse `grep` because you wanted everything to be pure Rust.

### The CLI Is the Good Part

The CLI is the part I like most. It is simple, direct, and does not pretend to be a full IDE. A little sharp, inspectable, and not trying to upsell me a workspace.

Run a one-shot prompt:

```bash
cargo run -- "Read README.md and summarize the setup"
```

Or start an interactive session:

```bash
cargo run
```

Interactive mode gives you a readline prompt, persisted history, slash commands, approvals, skills, and sessions. Sessions live under `~/.sabi/sessions/<workspace>/`, and `--resume` loads the latest non-empty session for the current directory.

First-launch onboarding creates the boring but necessary `~/.sabi/` layout. I added this after realizing that “just create these files manually” is the kind of instruction only the author thinks is acceptable:

```text
~/.sabi/
  config.toml
  auth.toml
  sessions/
  history
```

There is also `/fiwb`, alias `/yolo`, which bypasses approvals for the current process. It stands for exactly what you think it stands for. It resets after restart because even drunk drivers are sober the next day.

The slash-command parser is basically a `match` over `/help`, `/quit`, `/clear`, `/new`, `/session`, `/reload`, `/fiwb`, `/yolo`, and `/skill:name`. I love this.

Config is split between secrets and presets because I have met myself before:

* API keys live in `~/.sabi/auth.toml`, with owner-only permissions on Unix.
* Model/base URL defaults live in `~/.sabi/config.toml`.
* Projects can override model/base URL with `sabi.toml`.
* Environment variables still work for one-off overrides.

The precedence is simple: project config, user config, env vars, then defaults. You can argue about the order, but at least there is one, and it does not require reading tea leaves from five directories named `config`.

### Tools, Approvals, Sessions

Sabi has a small static tool registry: `read`, `write`, `edit`, `bash`, `ls`, `grep`, `find`, `web_search`, and `exa_search`. I wanted a toolbox, not Kubernetes for `read_file`.

Most of these are intentionally boring. `grep` shells out to `rg`, `find` shells out to `fd`, and diffs use `similar::TextDiff`. I am not trying to defeat BurntSushi in honorable combat. I have enough questionable hobbies already.

The only fussy tool is `edit`, and that is on purpose. It does exact replacement and rejects empty, no-op, missing, or duplicate snippets. Fuzzy editing is useful, but it is also where “replace this line” becomes “congratulations, we performed vibes-based surgery on your source file.”

Approvals are equally blunt. Read-only tools run freely; `write`, `edit`, and `bash` require approval in interactive mode. My desktop is not GTA for gipitty 5.5 to wreak havoc in.

Sessions are append-only JSONL files with a header, messages, and optional metadata like desktop titles. `--resume` only resumes the latest non-empty session whose stored `cwd` matches the current directory. That avoids the very funny and very bad situation where an agent applies old repo context like it has tenure.

Skills follow an Agent Skills-style convention and load from:

```text
.sabi/skills/
~/.sabi/skills/
```

You can invoke them with `/skill:name optional instructions`. Skill summaries go into normal prompts so the model knows what exists. The parser only handles what I need: `name`, `description`, `disable-model-invocation`, and the markdown body. Bad frontmatter gets skipped with a warning instead of detonating startup. Boring failure modes, my beloved.

### The Desktop Shell

The Tauri desktop app exists, but it is not the show stealer. I would not call it polished unless I was trying to raise money from YC, and thankfully I am not. The useful decision is architectural: it uses the Rust engine directly instead of shelling out to the CLI.

Right now it has project selection, workspace sessions, file/slash/skill autocomplete, approval cards, compact tool rows, and collapsible diffs. The autocomplete is intentionally humble: skip junk folders, cap the walk, return enough suggestions to make `@src/whatever` useful without building a search daemon.

The cursed part is streaming. Prompt execution still returns a completed event batch, while approvals need to interrupt the same turn live. That is where the actual desktop app begins. The desktop shell is cool, but the CLI is the part I trust.

### What I Learned, Unfortunately

Building Sabi taught me that agent harnesses are mostly careful plumbing:

* Message formats.
* Tool schemas.
* Provider compatibility.
* Error handling.
* Filesystem safety.
* Sessions.
* Approvals.
* Diffs.
* UI events.

The LLM is the one making calls, but the harness is the cellphone. I tried to make the cellphone not explode when the model uses it.

The annoying realization was that API design is product design here. Tool schemas shape what the model can do. Approval prompts shape trust. Session formats decide whether future me can understand what happened after the agent does something weird.

Small failures are good too. “The exact snippet appears twice” is the harness refusing to guess. “No session resumes from this CWD” prevents cross-repo context poisoning. “`fd` is missing” is clearer than silently implementing a worse finder because I wanted zero dependencies. Sometimes the best agent behavior is not being impressive, but being deterministic.

### Final Thoughts

Sabi started as “I want to understand coding agents” and became a small real harness with tools, sessions, skills, approvals, and a desktop shell beginning to form around it. This is usually how my projects go.

It made the category less intimidating. Before building it, coding agents felt like a black box pointed at a terminal. After building the loop, tools, approvals, and session files, the fog cleared enough to see the gears. Some of it is ugly. Some of it is interesting. All of it is just software. Most of “AI Engineering” right now is just Software Engineering with a model-shaped slot machine sitting in the cockpit.

The satisfying part is that the agent uses only around 1,000 tokens in the first message.

Also, using Rust for an agent named Rust is funny to me, and it is giving *wabisabi* because I had fun.

Cheers!
