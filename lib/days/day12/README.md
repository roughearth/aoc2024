# Day 12

OK I admit it, I needed to look at the Reddit for part 2 today. Lots of "solutions" there that didn't really help with algorithms. In the end the gut that helped pointed out that the number of vertical sides ias the same as the number of horizontal sides. So I only needed to count how many vertical lines. Log the cells left edges and those with right edges, then count the number of cells with no similar edge above it (this being the start of a continuous edge).

I also made a hash of the BFS/DFS implementation for finding the regions, sothat didn't help how long it took.

I might have gathered too much analysis data in the regions...
