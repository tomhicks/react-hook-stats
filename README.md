# `react-hook-stats ⚛️-🎣-📊`

## Get stats on your hooks usage like this:

```
Callback         ████████ 22
Context          ██ 7
DebugValue       ▏0
Effect           ████████████████████████████████████████████ 120
ImperativeHandle ▏0
LayoutEffect     ▏0
Memo             ██ 6
Reducer          ▏0
Ref              ████████████████████ 56
State            ██████████████████████████████████████████████████ 136
```

## Usage

Just run `npx react-hook-stats src` where `src` is your source code directory.

It will output a PNG file in your current directory, if it finds any hook usage.

It only checks the built-in hooks.

## Motivation

To see if we are all using hooks in a similar way! The output above is from a project of mine, but I suspect that a lot of people might migrate towards more `useReducer` calls as they get better with hooks, for instance.

I'd like to see a high-level view of how other people are using hooks without having to read all their source code.
