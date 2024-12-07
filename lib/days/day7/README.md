# Day 7

Not much option but to brute force all the combinations. OK for part 1, but part 2 got much bigger.

My first attempt took 17 seconds. I got it down to 2½ by optimising the calculation.

* First attempt did string analysis on the base 2 or 3 number what represented the operation set. I got it down to 7½ seconds by using modular maths instead.
* Then I decided to look at the "concatenation" operation. The first attempt was to use string concatenation, and `parseInt` the result. I got it down to 2½ seconds by using logs to work out what to multiply by.
