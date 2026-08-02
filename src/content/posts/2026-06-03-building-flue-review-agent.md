---
title: "Building a Cloudflare PR Review Agent"
description: "How I built a GitHub App that reviews pull requests with bounded context, structured findings, and no authority to act on its own."
author: "Arnav Panigrahi"
published: "2026-06-03"
updated: "2026-08-01T00:00:00.000Z"
categories: ["ai", "agents", "cloudflare", "github", "typescript"]
---

## World is Vibes

It is 2026. People are finessing Meta AI into handing over Instagram accounts by saying [please](https://www.bbc.com/news/articles/c98rzr72dpyo). Software engineers are tokenmaxxing so Bay Area dashboards can call them productive. Everyone is shipping AI-generated code, PR descriptions, and test plans.

My heart goes out to the senior developer still expected to read a 3,000-line diff before lunch and type `LGTM`.

![Bun test output showing a passing review-agent result](/posts/images/2026-06-03-building-flue-review-agent/bun.png)
*Looks good to me.*

Naturally, the next step was letting AI review the AI-generated code too.

```text
@agent-review can you review this PR?
```

I wanted a GitHub App that could receive that comment, inspect bounded pull-request context, and return one useful review without gaining the authority to freestyle against my repository.

The rule was simple:

> The model can review code. Application code owns every side effect.

The model reads bounded PR context and returns JSON. It has no GitHub token, no endpoint choices, and no permission to post comments. The Worker validates the result, filters it, formats it, and writes to GitHub. I still have to fix the code myself, unfortunately.

## A grocery list with a webhook

I used:

1. Cloudflare Workers
2. GitHub Apps
3. Flue
4. Hono
5. Valibot
6. AveMujicaAPI
7. TypeScript
8. Wrangler

Cloudflare receives the webhook. The GitHub App supplies repo-scoped authentication. Flue contains the review workflow. Hono handles routing, Valibot distrusts the model on my behalf, and AveMujicaAPI provides `gpt-5.5`.

The first working loop:

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

## Cloudflare handles the weather

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


For now, the Worker is the only place with the GitHub App private key and the model provider key. That boundary matters.

## Flue in the Shell

I have a confession. The first reason I looked into Flue is because it is built around Mario Zechner's [Pi](https://pi.dev) agent. I saw that and immediately became the target audience. This is exactly how you rouse interest in the open-source community.

Flue treats the model as one part of a harness. The harness owns tools, files, sessions, sandboxing, and the workflow around the model.

A pull request review is a bounded job:

1. collect context,
2. run a review,
3. return a result.

The docs even call out code review and CI-style tasks as finite workflows. Perfect. A scoped review unit suits the job; memory of every bad decision I have made since freshman year does not.

Workflows can still be normal TypeScript. Rust users, put down the eggs. Application code fetches GitHub context, stages files, initializes the agent, validates its result, and decides what happens next. The model returns data; the app owns the machinery and every GitHub API call.

The project currently has:

```text
src/review/engine.ts
.flue/workflows/review-pr.ts
```

The engine contains the logic, while the workflow wraps it. The Worker can call the engine directly today, but the project still has a Flue workflow seam for later.

That seam matters because Flue gives me a place to grow without turning one route handler into a haunted object. Workflow runs can have IDs and inspectable events. Agents can get skills or subagents later. The same code can target Node for local work or Cloudflare Workers for deployment. `flue build --target cloudflare` plus `wrangler deploy` is the kind of boring deployment path I can hand to an agent without lighting a candle first.

That is the part I care about. Routing, GitHub auth, context fetching, model review, validation, and comment posting should not all become one 900-line `app.ts` file. I have seen that movie. The monster wins.

## The bot should not borrow my identity

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

## Verify first, parse later

The Worker exposes:

```text
POST /webhooks/github
```

The complete path is:

```text
read raw body
  -> verify X-Hub-Signature-256
  -> ignore non-issue_comment events
  -> parse @agent-review
  -> return 202 accepted
  -> create installation token
  -> fetch bounded PR context
  -> claim run for dedupe
  -> post "review in progress"
  -> run and validate review
  -> update the same comment
  -> mark run complete
```

Signature verification happens before JSON parsing. GitHub signs the raw body, not the cozy parsed object you wish existed. The route then returns `202 accepted` and moves the review into `executionCtx.waitUntil(...)`.

The processing comment turned out to be very useful:

```text
Review in progress. I’m fetching PR context and checking the diff now.
```

Without it, the UX is just staring at GitHub and wondering if the webhook died, the permissions are wrong, the model is slow, the model had a seizure, or Cloudflare is reminiscing about that one high-school sweetheart.

Now the bot gives immediate feedback, then replaces that same comment with the final review. The PR contains one updated review comment.

## The model does not get the whole repo

Sending an entire repository to a model is expensive, noisy, and still does not guarantee that it will read the important part.

Right now the reviewer gets:

* repo owner/name,
* PR number,
* base SHA,
* head SHA,
* changed file metadata,
* GitHub patch hunks,
* raw contents for up to 20 changed files,
* up to 40,000 characters per fetched file.

That was enough to catch secret leaks, direct correctness regressions, disabled tool calls, unsafe debug endpoints, and tests that checked shape while missing behavior. Very normal things to discover with a robot you assembled in a Worker.

It will still miss failures outside that boundary. A changed function can break an unchanged caller three modules away. Configuration and tests can matter without appearing in the diff.

That boundary is deliberate. I read the diff first, then open the files that explain it. The reviewer should do the same without inhaling the repository and hoping attention happens.

## JSON or it did not happen

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

Valibot validates the result before application code touches it. Low-confidence findings and findings below the configured severity threshold are discarded. The total finding count is capped because the bot does not need to publish a novella after someone renames `user` to `account`.

The schema cannot make the model correct. It can stop malformed model output from becoming application behavior.

## One bot, one comment

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

The badge follows finding severity: any high finding is red, any medium finding is orange, and everything else stays green. The comment shows the findings without inventing a separate risk-posture classifier.


## Three PRs enter, one bot leaves

A review bot that only sees code I expect to pass is a very expensive affirmation machine. I made a private Python backend repo with FastAPI, LangGraph, OpenAI integration, tools, repositories, services, routes, and tests. Enough structure that the bot cannot win by spotting `console.log("password")` and calling itself an engineer.

Then I opened three PRs: one clean change and two planted failures. The clean PR added recent agent-run listing. The bot approved it.

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

That was the first moment the project felt real. The bot found the tool regression I planted and explained the runtime effect. I love when carefully constrained models do something more impressive than "Oh cute! It says it's thinking lol!"

## The boring bugs win again

The first deploy failed because I imported `flue()` from the wrong package path. It needed to come from `@flue/runtime/routing`, not `@flue/runtime/app`.

The second deploy failed because the workflow exported a default function instead of a named `run` function.

Then GitHub refused to let the app post comments because I had not approved the right write permission on the installation.

None of these were glamorous bugs. The normal sludge was SDK drift, export shape, permissions, and config. The kind of bugs that make you briefly consider carpentry before remembering wood also has edge cases.

Each failure paid rent in the README. Runtime imports went into build verification. Workflow exports went into docs. GitHub App permissions got spelled out. Wrangler tail stopped being optional.

## More context, fewer delusions

Right now, the bot reviews bounded PR context and posts one conversation comment. Separate modules handle the webhook, context, review, validation, and publishing paths:

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

The next improvement is richer bounded context:

```text
changed files
+ imported local modules
+ adjacent tests
+ root config files
+ CI/package files
+ small architecture docs
```

That belongs in the context builder instead of spreading through the webhook and review code. Greptile-ish code understanding probably starts with import-graph retrieval, then maybe a persistent index if that becomes worth the trouble.

After that, inline comments, but only when diff anchoring gets boring. A wrong inline comment looks precise, which makes it worse than an honestly vague summary finding. Inline comments need a diff mapper and a batch PR review publisher; check runs can stay in their own module.

I also want a permanent calibration suite with known outcomes:

* clean PR,
* secret leak,
* auth bypass,
* data loss,
* missing tests,
* disabled tool calls,
* noisy refactor.

Every prompt and model change should run against those cases. A more talkative bot that gets less accurate has regressed.

For now, the bot receives a bounded diff, returns validated findings, and updates one comment. It cannot post on its own or choose what GitHub endpoint to call. That limited authority is why I trust it on my PRs.

Cheers!
