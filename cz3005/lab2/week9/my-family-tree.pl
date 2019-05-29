male(jerry).
male(stuart).
male(warren).
male(peter).
female(kather).
female(maryalice).
female(ann).
brother(jerry,stuart).
brother(jerry,kather).
brother(peter,warren).
sister(ann,maryalice).
sister(kather,jerry).
parent_of(warren,jerry).
parent_of(maryalice,jerry).

sibling(X, Y):- 
  brother(X, Y);
  sister(X, Y).

father(X, Y):- male(X), parent_of(X, Y).
father(X, Y):- male(X), parent_of(X, Z), sibling(Z, Y).

mother(X, Y):- female(X), parent_of(X, Y).
mother(X, Y):- female(X), parent_of(X, Z), sibling(Z, Y).

son(X, Y):- male(X), parent_of(Y, X).
son(X, Y):- male(X), parent_of(Y, Z), sibling(Z, X).

daughter(X, Y):- female(X), parent_of(Y, X).
daughter(X, Y):- female(X), parent_of(Y, Z), sibling(Z, X).

grandfather(X, Y):- male(X), parent_of(X, Z), parent_of(Z, Y).

aunt(X, Y):- female(X), sibling(X, Z), parent_of(Z, Y).

uncle(X, Y):- male(X), sibling(X, Z), parent_of(Z, Y).

cousin(X, Y):- parent_of(A, X), parent_of(B, Y), sibling(A, B).

spouse(X, Y):- parent_of(X, Z), parent_of(Y, Z), male(X), female(Y).

parentof(X, Y):- parent_of(X, Y).