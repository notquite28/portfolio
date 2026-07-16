---
title: "Building a Cloudflare PR Review Agent"
description: "How I built a GitHub App review bot on Cloudflare Workers using Flue, AveMujicaAPI, bounded PR context, structured findings, and update-in-place PR comments."
author: "Arnav Panigrahi"
published: "2026-06-03"
updated: "2026-06-03T00:00:00.000Z"
categories: ["ai", "agents", "cloudflare", "github", "typescript"]
---


## Let the clankers fight amongst themselves

## A world built on vibes

The year is 2026. People are finessing Meta AI into handing over Instagram accounts by simply saying [please](https://www.bbc.com/news/articles/c98rzr72dpyo). Software engineers are tokenmaxxing so Bay Area dashboards can call them productive. Anthropic keeps telling everyone that if they are not using AI, their career is finished, while also offering very serious money to engineers whose job is stopping Claude Code from combusting after six failed write-tool calls. The same company then has to make sure its "dumb users" cannot break into the Pentagon by pasting a system prompt large enough to qualify as grad-school reading.

Claude claims they had to develop a game-engine just for the TUI flickering, which is AI generated too. Everyone is shipping AI-generated code, AI-generated PR descriptions, and AI-generated test plans. Who knows, this hit piece is probably AI-generated too. I dread the day the ChatGPT servers go down and someone asks me for my name.

My heart goes out to the senior developer still expected to read a 3,000-line diff before lunch and type `LGTM`, like how they merged the million-line PR translating Bun from Zig to Rust.

![Bun test output showing a passing review-agent result](/posts/images/2026-06-03-building-flue-review-agent/bun.png)
*Looks good to me.*

This is the current AI software development model: write a diff three times longer than necessary, add abstractions for "future extensibility" before which the company will go out of business, shrink the review window, drop a chatbot somewhere in the middle, and hope the house of cards holds. Lay off engineers because AI is cheaper. Spend the entire year's budget on Claude. Rehire people because AI got expensive enough that new grads are suddenly a cost-saving measure. Lay them off again after record-breaking profits so the next budget can go deeper into AI.

Like I said, it is 2026 and everything needs to be AI. My therapist, my friends, my mother, the CEO and CTO of my million-dollar SaaS company that is definitely not vibe-coded. I added "make no mistakes" to the prompt, so legally it is enterprise software. Naturally, the next step was letting AI review my code too.

```text
@agent-review can you review this PR?
```

Not a fake review where CI runs tests and adds a green checkmark like it read the code. I wanted the vicarious kind: a GitHub App, a Cloudflare Worker, a bounded model review, and one useful comment back on the PR.

The dangerous part is obvious once you stare at it for more than five seconds. A review bot sees private source code, has GitHub write permissions, holds model provider credentials, and takes webhooks from the internet. That is how "let the agent handle it" becomes "why did the robot post our API key into a public issue?"

So the rule was simple:

> The model can review code. Application code owns every side effect.

The model gets one job: read bounded PR context and return JSON. No GitHub token. No endpoint choices. No posting comments. The Worker validates the JSON, filters it, formats it, and writes to GitHub. I still have to fix the code myself, unfortunately.

## The stack, because every project needs a grocery list

I used:

1. Cloudflare Workers
2. GitHub Apps
3. Flue
4. Hono
5. Valibot
6. AveMujicaAPI
7. TypeScript
8. Wrangler

Cloudflare is the public webhook doorbell. GitHub Apps handle repo-scoped auth. Flue keeps the review logic from rotting inside one route handler. Hono handles routing, Valibot keeps the model on a leash, and AveMujicaAPI is the OpenAI-compatible model provider. The model is currently `gpt-5.5`.

The first working loop looked like this:

```text
PR comment
  -> GitHub issue_comment webhook
  -> Cloudflare Worker
  -> verify X-Hub-Signature-256
  -> parse @agent-review
  -> create GitHub App installation token
  -> fetch PR files and patches
  -> send bounded context to AveMujicaAPI
  -> validate ReviewResult JSON
  -> update one PR comment
```

Nothing about that is fancy. This is a compliment. Fancy is how you end up paying more money to Greptile than you do to OpenAI.

## Why Cloudflare

GitHub needs a public HTTPS URL for webhooks. I did not want to run a Node server just to receive `issue_comment` events, then spend the rest of the afternoon remembering which dashboard owns the deploy button.

Cloudflare fits my preferred level of operational maturity: type a command in the terminal, ship the Worker, and let the platform handle the weather. `wrangler deploy` is exactly boring enough. A request comes in, the Worker does the webhook chores, and I do not have to pretend I want to operate infrastructure.

A Cloudflare Worker is good at this boring job:

* receive a webhook,
* verify a signature,
* return quickly,
* keep secrets out of the repo,
* do a little background work,
* scale without me cosplaying as an SRE.

The route returns `202 accepted` and continues the review with `executionCtx.waitUntil(...)`. GitHub does not need to sit there while the model decides whether leaking an OpenAI key through `/debug/openai` is bad. It is bad. The model figured that out too, which was nice of it. I gave it a pat of approval.

Cloudflare also gives this project room to grow. KV for dedupe. D1 for run records. Durable Objects for per-repo state. Cloudflare Sandbox later if I decide I hate myself enough to run untrusted PR code in a container. I am.

For now, the Worker is the only place with the GitHub App private key and the model provider key. That boundary matters.

## Why Flue

I have a confession. The first reason I looked into Flue is because it is built around Mario Zechner's [Pi](https://pi.dev) agent. I saw that and immediately became the target audience. This is exactly how you rouse interest in the open-source community.

The actual reason it stuck is that Flue describes an agent as a model running inside a harness. The model is not the product. The harness gives it tools, files, sessions, skills, sandboxing, and enough adult supervision to do something useful without wandering into traffic.

A pull request review is not a forever-chat. It is a bounded job:

1. collect context,
2. run a review,
3. return a result.

That maps cleanly to a Flue workflow. The docs even call out code review and CI-style tasks as finite workflows. Perfect. I do not need an immortal chat agent with memory of every bad decision I have made since freshman year. I need a scoped review unit.

The other useful bit is that workflows can still be normal TypeScript. Rust users, stop with the egg throwing. Application code can fetch GitHub context, stage files, initialize the agent, ask for a structured result, validate it with a schema, and then decide what happens next. The model does not get to freestyle a GitHub API call because it had a big day. It returns data. The app owns the machinery.

The project currently has:

```text
src/review/engine.ts
.flue/workflows/review-pr.ts
```

The engine is the real logic. The workflow wraps it. The Worker can call the engine directly today, but the project still has a Flue workflow seam for later.

That seam matters because Flue gives me a place to grow without turning one route handler into a haunted object. Workflow runs can have IDs and inspectable events. Agents can get skills or subagents later. The same code can target Node for local work or Cloudflare Workers for deployment. `flue build --target cloudflare` plus `wrangler deploy` is the kind of boring deployment path I can hand to an agent without lighting a candle first.

That is the part I care about. Routing, GitHub auth, context fetching, model review, validation, and comment posting should not all become one 900-line `app.ts` file. I have seen that movie. The monster wins.

## GitHub App, not a personal access token

A personal access token would have been easier for exactly five minutes.

A GitHub App is better because it has:

* install flow,
* repo-scoped installation tokens,
* explicit permissions,
* short-lived tokens,
* webhook identity,
* app attribution in the PR.

The app needs:

```text
Contents: read
Issues: read/write
Pull requests: read/write
Metadata: read
```

The Issues permission looks suspicious until you remember GitHub's PR conversation comments are issue comments. This caused one of those debugging moments where everything works except the thing you actually wanted.

The Worker logs said:

```text
403 Resource not accessible by integration
```

Translation: GitHub received the webhook, Cloudflare ran the code, the token existed, and the app still could not post because I had given it the wrong permission. Auth bugs are just riddles written by a committee.

## The webhook route

The Worker exposes:

```text
POST /webhooks/github
```

The route does this before it trusts anything:

```text
read raw body
verify X-Hub-Signature-256
ignore non-issue_comment events
parse @agent-review
start background review
return 202 accepted
```

Signature verification happens before JSON parsing. GitHub signs the raw body, not the cozy parsed object you wish existed.

After that, the background job does the actual work:

```text
create installation token
fetch PR context
claim run for dedupe
post "review in progress"
run model review
post final review or failure comment
mark run complete
```

The processing comment turned out to be very useful:

```text
Review in progress. I’m fetching PR context and checking the diff now.
```

Without it, the UX is just staring at GitHub and wondering if the webhook died, the permissions are wrong, the model is slow, the model had a seizure, or Cloudflare is reminiscing about that one high-school sweetheart.

Now the bot gives immediate feedback, then replaces that same comment with the final review. No comment spam. No thread full of half-finished robot thoughts.

## What the model actually sees

The model does not get the entire repo.

Right now it gets:

* repo owner/name,
* PR number,
* base SHA,
* head SHA,
* changed file metadata,
* GitHub patch hunks,
* raw contents for up to 20 changed files,
* up to 40,000 characters per fetched file.

That sounds small, but it caught more than I expected: secret leaks, direct correctness regressions, disabled tool calls, unsafe debug endpoints, and tests that proved the shape of something while missing the behavior. Very normal things to discover with a robot you assembled in a Worker.

It will miss things. A changed function can break an unchanged caller three modules away, and the current bot may never see that caller. A config file can matter without being part of the diff. Same for a test that should have been added somewhere else.

The fix is not "send the whole repo." That is how you build a SaaS agent that racks up a five-digit invoice.

The next version should fetch bounded extra context:

```text
changed files
+ imported local modules
+ adjacent tests
+ root config files
+ CI/package files
+ small architecture docs
```

That is closer to how I review code anyway. I read the diff first, then open the files that explain the diff.

## The JSON contract

The model has to return this shape:

```ts
type ReviewResult = {
  recommendation: "comment" | "request_changes" | "approve";
  prSummary: string;
  summary: string;
  findings: Array<{
    path: string;
    line: number | null;
    side: "RIGHT" | "LEFT" | null;
    severity: "low" | "medium" | "high";
    category: "correctness" | "security" | "test" | "maintainability";
    confidence: "low" | "medium" | "high";
    body: string;
  }>;
};
```

Valibot validates it. Low-confidence findings get tossed. Findings below the severity threshold get tossed too. The result is capped, because the bot does not need to write a novella after someone renames `user` to `account`.

This is the difference between a review system and a group chat with delusions of architecture. The model can still be wrong, but at least it has to be wrong in a shape the application understands.

## The review comment

The bot posts one PR conversation comment and updates it in place. It finds its old comment with this marker:

```html
<!-- flue-agent-review-bot -->
```

The final comment looks roughly like this:

```md
### Flue Agent review

**Severity:** High

**PR summary:** Adds a `/debug/openai` endpoint and registers it in the app.

**Recommendation:** request_changes

**Review summary:** Requesting changes due to a high-severity secret exposure risk.

- **high security** (high confidence) at `app/api/debug.py:8`: ...

---
_Triggered by @notquite28 · Model: gpt-5.5 · Completed in 10.3s_
```

The severity badge is dumb in the way I like:

```text
Low / none
Medium
High
```

Any high finding makes it red. Any medium finding makes it orange. Otherwise it stays green. No separate vibes classifier. No dramatic "risk posture" paragraph. Just read the findings.

This was not me discovering review agents for the first time and seeing the face of God in a diff. I already use review agents in coding agents and in actual PRs. The curiosity here was more specific: what does it look like when the review agent is not a chat window I babysit, but a GitHub App wired through Cloudflare and a Flue workflow with real webhook auth, scoped tokens, structured output, and boring posting rules?

## Calibration PRs

I made a private Python backend repo to test this properly. It has FastAPI, LangGraph, OpenAI integration, tools, repositories, services, routes, and tests. Enough structure that the bot cannot win by spotting `console.log("password")` and calling itself an engineer.

Then I opened three PRs.

The clean PR added recent agent-run listing. The bot approved it.

![Clean pull request where the review bot found no issue](/posts/images/2026-06-03-building-flue-review-agent/low.png)
*A clean PR where the bot found nothing worth bothering a human about.*

The bad security PR added an OpenAI diagnostics endpoint. It hardcoded an API-key-looking string and returned the configured OpenAI key from an unauthenticated route. The bot requested changes and called it high severity.

![Security calibration pull request with a high-severity bot finding](/posts/images/2026-06-03-building-flue-review-agent/high.png)
*The security calibration PR. Red dot of shame included.*

The bad correctness PR added prompt cache keys but also changed:

```py
create_react_agent(model, self._tools if allow_tools else [])
```

into:

```py
create_react_agent(model, [])
```

That disables tools even when `allow_tools=True`. The bot caught it and explained the runtime regression.

That was the first moment the project felt real instead of cute. It did not just summarize the diff. It found the thing I planted. I love these moments when carefully harnessed models can do something more impressive than "Oh cute! It says it's thinking lol!"

## The parts that broke first

The first deploy failed because I imported `flue()` from the wrong package path. It needed to come from `@flue/runtime/routing`, not `@flue/runtime/app`.

The second deploy failed because the workflow exported a default function instead of a named `run` function.

Then GitHub refused to let the app post comments because I had not approved the right write permission on the installation.

None of these were glamorous bugs. They were the normal sludge: SDK drift, export shape, permissions, config. The kind of bugs that make you briefly consider carpentry before remembering wood also has edge cases.

Each failure paid rent in the README. Runtime imports went into build verification. Workflow exports went into docs. GitHub App permissions got spelled out. Wrangler tail stopped being optional.

## The shape I want to poke at long term

This is not me trying to speedrun Greptile or CodeRabbit in a weekend. It does not index whole repos, run tests, post inline comments, remember suppressions, or understand your entire monorepo's emotional baggage.

But the architecture has places for those features to go:

```text
GitHub App webhook
  -> event parser
  -> run store
  -> repository policy loader
  -> context builder
  -> code intelligence retriever
  -> review workflow
  -> finding validator
  -> finding ranker
  -> output publisher
```

The modules are the important part.

Richer context goes into the context builder. Greptile-ish code understanding probably starts with import graph retrieval, then maybe a persistent code index if that ever becomes worth the trouble. Inline comments need a diff mapper and a batch PR review publisher. Check runs can live in a `checks.ts` module with the GitHub App Checks permission. Automatic reviews are just another trigger once `pull_request` events normalize into the same shape as `@agent-review` comments.

The model stays boxed in. It reviews. It does not operate the machinery. That is the constraint that makes the rest of this fun instead of terrifying.

## What I want to try next

First: richer bounded context. Changed files are good. Changed files plus imports, adjacent tests, root config, and CI signals would be much better. That is where this starts feeling less like a prompt trick and more like an actual GitHub integration.

Second: inline comments, but only after diff anchoring gets boring. A wrong inline comment is worse than a summary finding because it looks precise. Fake precision is worse than honest vagueness.

Third: a calibration suite. Keep private PRs with known outcomes:

* clean PR,
* secret leak,
* auth bypass,
* data loss,
* missing tests,
* disabled tool calls,
* noisy refactor.

Every prompt change and model change should run against those. If the bot gets more talkative but less accurate, that is not improvement. That is ESLint with a gambling addiction.

## Final thoughts

I wanted to build a reviewer with Flue, Cloudflare, and GitHub instead of just prompting a model with a patch file. I wanted to see the seams: where the webhook enters, where the GitHub App token gets minted, where Flue wraps the review unit, where Valibot says "absolutely not," and where the final comment gets posted without the model touching the steering wheel.

"LLM reads diff" is the demo. The useful work is around it: verified webhooks, scoped tokens, bounded context, structured output, deterministic posting, and a comment format that gives a human signal without turning the PR into a TED Talk.

I would not trust this bot with everything. Because I built it in a day. But, I want one narrow job widened only when the boring parts keep holding.

Agents are easier to like when they are not allowed to improvise infrastructure.

Cheers!
