import { Database } from "./supabase";


export type Tables< T extends keyof Database ['public']['Tables']> = 
Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> = 
Database['public']['Enums'][T];


export type Service = {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    provider_email: string;
    user_id: string;
}