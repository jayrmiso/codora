insert into public.topics (slug, name, description, sort_order)
values
  ('arrays', 'Arrays', 'Problems focused on ordered collections and indexed access.', 10),
  ('strings', 'Strings', 'Problems focused on text manipulation and parsing.', 20),
  ('control-flow', 'Control Flow', 'Problems focused on branches, loops, and logic.', 30),
  ('recursion', 'Recursion', 'Problems focused on recursive problem solving.', 40),
  ('data-structures', 'Data Structures', 'Problems focused on maps, sets, stacks, queues, and trees.', 50),
  ('algorithms', 'Algorithms', 'Problems focused on search, sorting, and general techniques.', 60)
on conflict (slug) do nothing;

insert into public.difficulty_levels (slug, name, description, sort_order)
values
  ('beginner', 'Beginner', 'Introductory problems with minimal prerequisites.', 10),
  ('intermediate', 'Intermediate', 'Problems that combine multiple concepts or steps.', 20),
  ('advanced', 'Advanced', 'More difficult problems with deeper reasoning or implementation.', 30)
on conflict (slug) do nothing;

insert into public.learning_tags (slug, name, description, sort_order)
values
  ('variables', 'Variables', 'Use and update named values.', 10),
  ('conditionals', 'Conditionals', 'Branch based on different cases.', 20),
  ('loops', 'Loops', 'Repeat work with iteration.', 30),
  ('functions', 'Functions', 'Break logic into reusable functions.', 40),
  ('arrays', 'Arrays', 'Work with ordered collections.', 50),
  ('strings', 'Strings', 'Manipulate text values.', 60),
  ('hash-maps', 'Hash Maps', 'Store and retrieve keyed data efficiently.', 70),
  ('sets', 'Sets', 'Track unique values and membership.', 80),
  ('sorting', 'Sorting', 'Order data with comparison-based or key-based approaches.', 90),
  ('search', 'Search', 'Find items or targets efficiently.', 100),
  ('recursion', 'Recursion', 'Solve problems by calling a function from within itself.', 110),
  ('stacks', 'Stacks', 'Use last-in, first-out data handling.', 120),
  ('queues', 'Queues', 'Use first-in, first-out data handling.', 130),
  ('trees', 'Trees', 'Work with hierarchical data.', 140),
  ('graphs', 'Graphs', 'Work with connected nodes and edges.', 150)
on conflict (slug) do nothing;
