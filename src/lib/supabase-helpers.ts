// Helpers temporários para lidar com tipos do Supabase até a sincronização
import { supabase } from "@/integrations/supabase/client";

// Helper type-safe para queries do Supabase
export const supabaseQuery = supabase as any;
