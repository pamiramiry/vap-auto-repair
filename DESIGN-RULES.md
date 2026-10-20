# VAP Auto Repairs: Design Rules (read before every change)

Built with three design skills, installed in `.claude/skills/`: taste-skill (art direction and the inspector), Impeccable (the craft floor) and Emil Kowalski's design engineering (motion and interaction). Claude Code picks them up automatically in this repo.

## The idea
The page is the shop's work order: the slip you approve before any repair starts. Every section is another piece of paper from the counter (the order, a receipt slip, review notes, a letter with a tear-off stub, a visit card, a reply card, the back of the card in the footer). Paper is bone on a green-black ground.

The one live thing: on the work order, the visitor taps what the car is doing, the Concern line fills in, and the quote form further down is pre-filled.

## Locked
- Palette: ground #161C1A, surface #1F2725, surface-2 #2A3431, ink/paper #E3E2DA, paper-2 #D6D5CC, paper ink #161C1A, paper muted #50574F, muted #9AA099, accent jade #9FC7B8 (call and booking buttons only).
- Type: Rokkitt 800 uppercase for headings, Literata for everything else. Five sizes (small, body, lead, head, display) plus the one giant word.
- Square corners everywhere. Buttons are flat fills, no outlines.
- Shaped paper edges (scallops, zigzag tear, dotted perforation of 4px+) are made with fills, clip-path or SVG, never outlined boxes.
- Motion: strong ease-out curves, press feedback scale(0.97), hover only behind `(hover: hover) and (pointer: fine)`, every hidden state behind `.js` and `prefers-reduced-motion: no-preference`. Signature move: the curtain footer.

## Banned (taste-skill house rules, checked by its inspector)
No small labels above headings, no 01/02/03 numbering, no thin divider lines, no gradients, no shadows on things at rest, no glass blur, no icon-topped card rows, no styled accent word in a headline, no cream-and-terracotta. Headlines stay on two lines or fewer at every width.

## Content
- Exactly one H1: "Auto repair in Etobicoke". Title tag: "Auto Repair in Etobicoke | VAP Auto Repairs".
- The 3.7 Google rating is not shown. Review count and real 5-star quotes only, word for word, first name and last initial.
- Never invent facts; anything unconfirmed goes in TO-CONFIRM.md. No em dashes or en dashes.
- Every section has a call or quote action within reach; the phone bar is always present under 900px.

## Checks before every push
```
node .claude/skills/taste-skill/scripts/lint.mjs index.html css js
node .claude/skills/taste-skill/scripts/inspect.mjs index.html
```
Known, accepted inspector findings: too few pictures (until tools/fetch-images.py has been run) and covered footer text (that is the curtain footer).
