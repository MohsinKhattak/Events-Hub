export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SportType =
  | "Soccer"
  | "Basketball"
  | "Tennis"
  | "Baseball"
  | "Football"
  | "Hockey"
  | "Golf"
  | "Swimming"
  | "Volleyball"
  | "Cricket"
  | "Rugby"
  | "Other";

export const SPORT_TYPES: SportType[] = [
  "Soccer",
  "Basketball",
  "Tennis",
  "Baseball",
  "Football",
  "Hockey",
  "Golf",
  "Swimming",
  "Volleyball",
  "Cricket",
  "Rugby",
  "Other",
];

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          name: string;
          sport_type: string;
          date_time: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          name: string;
          sport_type: string;
          date_time: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          name?: string;
          sport_type?: string;
          date_time?: string;
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      venues: {
        Row: {
          id: string;
          created_at: string;
          event_id: string;
          name: string;
          address: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          event_id: string;
          name: string;
          address?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          event_id?: string;
          name?: string;
          address?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "venues_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      sport_type: SportType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

export type Venue = Database["public"]["Tables"]["venues"]["Row"];
export type VenueInsert = Database["public"]["Tables"]["venues"]["Insert"];
export type VenueUpdate = Database["public"]["Tables"]["venues"]["Update"];

export interface EventWithVenues extends Event {
  venues: Venue[];
}
