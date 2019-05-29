offspring(prince, charlie).
offspring(princess, ann).
offspring(prince, andrew).
offspring(prince, edward).

elder(charlie, ann).
elder(ann, andrew).
elder(andrew, edward).

is_elder(A, B):- elder(A, B).
is_elder(A, B):- elder(A, C), is_elder(C, B).

is_youngest(A):- is_elder(B, A), is_elder(C, B), is_elder(D, C).

is_next(A):- elder(A, B).
is_next(A):- (not(elder(A, B)), is_next(B)) ; is_youngest(A).