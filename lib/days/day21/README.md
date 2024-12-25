# Day 21

## Working notes

```

+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+

379A
^A^^<<A>>AvvvA (14)

 ^  A  ^^   <<    A  >>  A   vvv   A (14)
<A >A <AA v<AA ^>>A vAA ^A v<AAA ^>A (28)

   <    A  >  A    <    A A   v  <    A A  ^   > >  A   v   A A  ^  A   v  <    A A A  ^   >  A (28)
v<<A ^>>A vA ^A v<<A ^>>A A v<A <A ^>>A A <A v>A A ^A v<A ^>A A <A >A v<A <A ^>>A A A <A v>A ^A (68)

    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+

v<<A^>>AvA^Av<<A^>>AAv<A<A^>>AA<Av>AA^Av<A^>AA<A>Av<A<A^>>AAA<Av>A^A (68)
   <   A > A   <   AA  v <   AA ^  >> A  v  AA ^ A  v <   AAA ^  > A (28)
       ^   A       ^^        <<       A     >>   A        vvv      A (14)
           3                          7          9                 A


<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^    A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
   <   A > A  v <<   AA >  ^ AA >     A  v  AA ^ A   < v  AAA >  ^ A
       ^   A         <<      ^^       A     >>   A        vvv      A
           3                          7`         9                 A

<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
v<<A^>>AvA^Av<<A^>>AAv<A<A^>>AA<Av>AA^Av<A^>AA<A>Av<A<A^>>AAA<Av>A^A (68)

<A>Av<<AA>^AA>AvAA^A<vAAA>^A
<A>A<AAv<AA^>>AvAA^Av<AAA^>A (28)

^A<<^^A>>AvvvA
^A^^<<A>>AvvvA (14)

379A
379A (4)

// to avoid X
// above left ^> or >^
// above right ^<
// below left >v
// below right v< or <v
// if going up from A or 0 go up first, if going down to A or 0 go down second
// otherwise X is not a problem

```
