export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          safety_score: number;
          total_points_earned: number;
          current_tier: string;
          last_safety_score_reset: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          safety_score?: number;
          total_points_earned?: number;
          current_tier?: string;
          last_safety_score_reset?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          safety_score?: number;
          total_points_earned?: number;
          current_tier?: string;
          last_safety_score_reset?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          user_id: string;
          address: string;
          city: string;
          state: string;
          country: string;
          property_type: string;
          safety_devices: Json;
          risk_assessment: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          address: string;
          city: string;
          state: string;
          country?: string;
          property_type: string;
          safety_devices?: Json;
          risk_assessment?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          address?: string;
          city?: string;
          state?: string;
          country?: string;
          property_type?: string;
          safety_devices?: Json;
          risk_assessment?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      risk_categories: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string;
          icon: string;
          color: string;
          examples: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description: string;
          icon: string;
          color: string;
          examples: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string;
          icon?: string;
          color?: string;
          examples?: Json;
          is_active?: boolean;
          created_at?: string;
        };
      };
      task_categories: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string;
          risk_category_id: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description: string;
          risk_category_id: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string;
          risk_category_id?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      task_templates: {
        Row: {
          id: string;
          template_id: string;
          name: string;
          description: string;
          task_category_id: string;
          risk_category_id: string;
          points_value: number;
          frequency: string;
          verification_type: string;
          insurance_relevance: string;
          example_evidence: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          name: string;
          description: string;
          task_category_id: string;
          risk_category_id: string;
          points_value: number;
          frequency: string;
          verification_type: string;
          insurance_relevance: string;
          example_evidence: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          template_id?: string;
          name?: string;
          description?: string;
          task_category_id?: string;
          risk_category_id?: string;
          points_value?: number;
          frequency?: string;
          verification_type?: string;
          insurance_relevance?: string;
          example_evidence?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      points_tiers: {
        Row: {
          id: string;
          tier_name: string;
          min_points: number;
          max_points: number | null;
          insurance_discount: number;
          description: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tier_name: string;
          min_points: number;
          max_points?: number | null;
          insurance_discount: number;
          description: string;
          display_order: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          tier_name?: string;
          min_points?: number;
          max_points?: number | null;
          insurance_discount?: number;
          description?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      insurance_discounts: {
        Row: {
          id: string;
          tier_id: string;
          discount_percentage: number;
          points_required: number;
          benefits: Json;
          partner_eligible: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tier_id: string;
          discount_percentage: number;
          points_required: number;
          benefits: Json;
          partner_eligible?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          tier_id?: string;
          discount_percentage?: number;
          points_required?: number;
          benefits?: Json;
          partner_eligible?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
      };
      points_redemption_options: {
        Row: {
          id: string;
          redemption_id: string;
          name: string;
          description: string;
          points_cost: number;
          category: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          redemption_id: string;
          name: string;
          description: string;
          points_cost?: number;
          category: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          redemption_id?: string;
          name?: string;
          description?: string;
          points_cost?: number;
          category?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      task_checklists: {
        Row: {
          id: string;
          property_id: string;
          checklist_month: string;
          status: string;
          due_date: string;
          ai_generation_metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          checklist_month: string;
          status?: string;
          due_date: string;
          ai_generation_metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          checklist_month?: string;
          status?: string;
          due_date?: string;
          ai_generation_metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          checklist_id: string;
          template_id: string | null;
          task_name: string;
          description: string;
          task_category_id: string;
          risk_category_id: string;
          base_points_value: number;
          frequency: string;
          verification_type: string;
          status: string;
          photo_url: string | null;
          receipt_url: string | null;
          verification_result: Json | null;
          points_earned: number | null;
          completed_at: string | null;
          verified_at: string | null;
          due_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          checklist_id: string;
          template_id?: string | null;
          task_name: string;
          description: string;
          task_category_id: string;
          risk_category_id: string;
          base_points_value: number;
          frequency: string;
          verification_type: string;
          status?: string;
          photo_url?: string | null;
          receipt_url?: string | null;
          verification_result?: Json | null;
          points_earned?: number | null;
          completed_at?: string | null;
          verified_at?: string | null;
          due_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          checklist_id?: string;
          template_id?: string | null;
          task_name?: string;
          description?: string;
          task_category_id?: string;
          risk_category_id?: string;
          base_points_value?: number;
          frequency?: string;
          verification_type?: string;
          status?: string;
          photo_url?: string | null;
          receipt_url?: string | null;
          verification_result?: Json | null;
          points_earned?: number | null;
          completed_at?: string | null;
          verified_at?: string | null;
          due_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      task_completion_streaks: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          template_id: string;
          consecutive_months: number;
          last_completed_month: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          template_id: string;
          consecutive_months?: number;
          last_completed_month: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          template_id?: string;
          consecutive_months?: number;
          last_completed_month?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      verifications: {
        Row: {
          id: string;
          task_id: string;
          photo_url: string | null;
          receipt_url: string | null;
          ai_analysis: Json;
          is_verified: boolean;
          verification_confidence: number | null;
          rejection_reason: string | null;
          verification_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          photo_url?: string | null;
          receipt_url?: string | null;
          ai_analysis: Json;
          is_verified: boolean;
          verification_confidence?: number | null;
          rejection_reason?: string | null;
          verification_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          photo_url?: string | null;
          receipt_url?: string | null;
          ai_analysis?: Json;
          is_verified?: boolean;
          verification_confidence?: number | null;
          rejection_reason?: string | null;
          verification_type?: string;
          created_at?: string;
        };
      };
      blockchain_transactions: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          property_id: string;
          vechain_tx_hash: string;
          metadata: Json;
          status: string;
          created_at: string;
          confirmed_at: string | null;
        };
        Insert: {
          id?: string;
          task_id: string;
          user_id: string;
          property_id: string;
          vechain_tx_hash: string;
          metadata: Json;
          status?: string;
          created_at?: string;
          confirmed_at?: string | null;
        };
        Update: {
          id?: string;
          task_id?: string;
          user_id?: string;
          property_id?: string;
          vechain_tx_hash?: string;
          metadata?: Json;
          status?: string;
          created_at?: string;
          confirmed_at?: string | null;
        };
      };
      rewards: {
        Row: {
          id: string;
          user_id: string;
          task_id: string;
          points_earned: number;
          base_points: number;
          frequency_multiplier: number;
          verification_bonus: number;
          streak_bonus: number;
          early_completion_bonus: number;
          blockchain_tx_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id: string;
          points_earned: number;
          base_points: number;
          frequency_multiplier: number;
          verification_bonus: number;
          streak_bonus: number;
          early_completion_bonus: number;
          blockchain_tx_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string;
          points_earned?: number;
          base_points?: number;
          frequency_multiplier?: number;
          verification_bonus?: number;
          streak_bonus?: number;
          early_completion_bonus?: number;
          blockchain_tx_id?: string | null;
          created_at?: string;
        };
      };
      safety_score_history: {
        Row: {
          id: string;
          user_id: string;
          previous_score: number;
          new_score: number;
          change_reason: string;
          related_task_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          previous_score: number;
          new_score: number;
          change_reason: string;
          related_task_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          previous_score?: number;
          new_score?: number;
          change_reason?: string;
          related_task_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

