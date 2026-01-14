CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL CHECK (sport_type IN ('Soccer', 'Basketball', 'Tennis', 'Baseball', 'Football', 'Hockey', 'Golf', 'Swimming', 'Volleyball', 'Cricket', 'Rugby', 'Other')),
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT
);

CREATE TABLE public.venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT
);

CREATE INDEX events_user_id_idx ON public.events(user_id);
CREATE INDEX events_sport_type_idx ON public.events(sport_type);
CREATE INDEX events_date_time_idx ON public.events(date_time);
CREATE INDEX venues_event_id_idx ON public.venues(event_id);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events"
  ON public.events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON public.events FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view venues of their events"
  ON public.venues FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = venues.event_id 
    AND events.user_id = auth.uid()
  ));

CREATE POLICY "Users can create venues for their events"
  ON public.venues FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = venues.event_id 
    AND events.user_id = auth.uid()
  ));

CREATE POLICY "Users can update venues of their events"
  ON public.venues FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = venues.event_id 
    AND events.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete venues of their events"
  ON public.venues FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = venues.event_id 
    AND events.user_id = auth.uid()
  ));
