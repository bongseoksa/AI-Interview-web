export type CategoryType =
  | "html"
  | "css"
  | "javascript"
  | "react"
  | "nextjs"
  | "infra_security_network"
  | "version_control"
  | "performance_seo";

export type Difficulty = "junior" | "mid" | "senior";

export type NodeRow = Database["public"]["Tables"]["nodes"]["Row"];
export type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];

export interface Database {
  public: {
    Tables: {
      nodes: {
        Row: {
          id: string;
          category: CategoryType;
          title: string;
          slug: string;
          content_body: string | null;
          difficulty: string | null;
          key_keywords: string[];
          default_tip: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category: CategoryType;
          title: string;
          slug: string;
          content_body?: string | null;
          difficulty?: string | null;
          key_keywords?: string[];
          default_tip?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["nodes"]["Insert"]>;
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          node_id: string;
          question: string;
          answer_guide: string | null;
          is_diagnostic: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          node_id: string;
          question: string;
          answer_guide?: string | null;
          is_diagnostic?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
        Relationships: [];
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          node_id: string;
          mastery_level: number;
          last_accessed: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          node_id: string;
          mastery_level?: number;
          last_accessed?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_progress"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      category_type: CategoryType;
    };
    CompositeTypes: Record<string, never>;
  };
}
