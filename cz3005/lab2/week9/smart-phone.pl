company(sumSum).
company(appy).
boss(stevey).
technology(galacticaS3).
competitor(sumSum, appy).
develop(sumSum, galacticaS3).
steal(stevey, galacticaS3).

rival(X):- competitor(X, appy); competitor(appy, X).

business(X):- technology(X).

unethical(X):- boss(X), rival(Comp), business(Biz), develop(Comp, Tech), steal(X, Biz).