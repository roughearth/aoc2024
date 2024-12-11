# Day 11

This was the first time for 2024 that there was the need to think a little differently.

I did part 1 the naïve brute force way, and it was fast enough (~80ms), so I've left that as is.

I knew part 2 would be a `O()` explosion. Caching didn't seem to be likely to work unless there were a lot stones at each blink with the same number, couldn't see anywhere that might loop (each number grows or splits on each blink). Then I remembered a past puzzle where we kept track of how many of each thing there were, because each identical thing adds to the next iteration independently of its position in the list. I guess that's a bit like caching?

Anyway, my optimized part 2 is actually faster than my naïve part 1.
