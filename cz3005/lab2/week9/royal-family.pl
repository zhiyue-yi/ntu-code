offspring(prince, charlie).
offspring(princess, ann).
offspring(prince, andrew).
offspring(prince, edward).

elder(charlie, ann).
elder(ann, andrew).
elder(andrew, edward).

is_elder(A, B):- elder(A, B).
is_elder(A, B):- elder(A, C), is_elder(C, B).

male(A):- offspring(prince, A).
female(A):- offspring(princess, A).

is_youngest_male(A):- is_elder(B, A), is_elder(C, B), male(A), male(B), male(C).

is_higher(A, B):- male(A), female(B).
is_higher(A, B):- (male(A), male(B)) ; (female(A), female(B)), is_elder(A, B).

is_next(A):- 
  (is_higher(A, B), female(B)); 
  (is_higher(A, B), female(A), female(B));
  (is_higher(B, A), female(A), is_youngest_male(B)).

