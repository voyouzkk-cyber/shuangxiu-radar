-- Crowd-sourced brand weekend-off registry. Rows are unowned (auth off).
create table if not exists brands (
  id serial primary key,
  name text not null unique,
  name_en text not null default '',
  aliases text not null default '',
  weekend_off boolean not null,
  category text not null default '其他',
  note text not null default '',
  weekend_votes integer not null default 0,
  no_weekend_votes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brands_weekend_off_idx on brands (weekend_off);
create index if not exists brands_category_idx on brands (category);
create index if not exists brands_name_en_idx on brands (name_en);
