# Demo sandbox

- Direct URL: <https://one-sitting-idle.sociobot.in/demo/> or `/?demo=1`.
- First-screen action: **Try it with sample data**.
- Seed: Act II at 22:00 elapsed, 3,400 light, 940 bearings, a 50/50 beam,
  six bought repairs, and eight field-log entries.
- Storage: `demo:last-light-save-v1` and `demo:last-light-motion` only.
- Reset: **Reset demo** replaces the sample state with the bundled seed.
- Exit: **Start for real** deletes both demo keys and opens `/`.

Demo code chooses its storage key before reading or writing state. It never
reads, writes, migrates, or deletes `last-light-save-v1`.
