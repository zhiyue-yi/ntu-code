% Append the first parameter with the second parameter. The output will be the third parameter
append([], Y, Y).
append([H|X], Y, [H|Z]) :- append(X, Y, Z).

% List of categories and options
meals([healthy, normal, value, vegan, veggie]).
breads([wheat, honey_oat, italian, hearty_italian, flatbread]).
meats([chicken, beef, ham, bacon, salmon, tuna, turkey]).
veggies([cucumber, green_pepper, lettuce, red_onion, tomato]).
fatty_sauces([chipotle, bbq, ranch, sweet_chilli, mayo]).
non_fatty_sauces([honey_mustard, sweet_onion]).
cheese_topups([cheddar, parmesan]).
non_cheese_topups([avocado, egg_mayo]).
sides([soup, soda, chips, cookies, hashbrowns]).

% Check conditions.
healthy_meal(healthy).
value_meal(value).
vegan_meal(vegan).
veggie_meal(veggie).
normal_meal(normal).

% Show available meals.
ask_meal(X) :- meals(X).

% Show available breads.
ask_bread(X) :- breads(X).

% Show available meats. Vegan and veggie meal has no meat.
ask_meats(X) :- chosen_meal(Y), \+vegan_meal(Y), \+veggie_meal(Y), meats(X).

% Show available veggies.
ask_veggies(X) :- veggies(X).

% Show list of sauces. Healthy meal has no fatty sauces.
% If healthy meal is chosen, only non-fatty-sauce is listed.
% Otherwise, the list will combine fatty and non-fatty sauces.
ask_sauces(X) :- chosen_meal(Y), healthy_meal(Y) -> non_fatty_sauces(X) ;
	fatty_sauces(L1), non_fatty_sauces(L2), append(L1, L2, X).

% Show list of topups. Value meal has no topup, vegan meal has no cheese topup.
ask_topups(X) :- chosen_meal(Y), \+value_meal(Y) -> (vegan_meal(Y) -> non_cheese_topups(X) ;
	cheese_topups(L1), non_cheese_topups(L2), append(L1, L2, X)).

% Show list of sides.
ask_sides(X) :- sides(X).

% Show user order.
% findall(X, fact(X), L) - Find all values for fact and append it into the list L.
show_meal(Meals) :- findall(X, chosen_meal(X), Meals).
show_bread(Breads) :- findall(X, chosen_bread(X), Breads).
show_meat(Meats) :- findall(X, chosen_meat(X), Meats).
show_veggie(Veggies) :- findall(X, chosen_veggie(X), Veggies).
show_sauce(Sauces) :- findall(X, chosen_sauce(X), Sauces).
show_topups(TopUps) :- findall(X, chosen_topup(X), TopUps).
show_sides(Sides) :- findall(X, chosen_side(X), Sides).
show_order(Meals, Breads, Meats, Veggies, Sauces, TopUps, Sides) :-
    show_meal(Meals), show_bread(Breads), show_meat(Meats), show_veggie(Veggies), show_sauce(Sauces),
    show_topups(TopUps), show_sides(Sides).

% User input will be appended below as memorised user preferences
