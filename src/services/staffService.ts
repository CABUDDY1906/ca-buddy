import { supabase } from './supabaseClient';
import type { Staff, StaffInput } from '@/types/staff';

export const StaffService = {
  async list(): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff').select('*').order('full_name');
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async getCurrentStaff(): Promise<Staff | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('staff').select('*').eq('auth_user_id', user.id).single();
    if (error) return null;
    return data;
  },
  async invite(input: StaffInput & { temp_password?: string }): Promise<Staff> {
    // 1. Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to invite a staff member');
    }

    // 2. Insert staff row into DB
    const { data: staffData, error: insertError } = await supabase
      .from('staff')
      .insert({
        full_name: input.full_name,
        email: input.email,
        phone_number: input.phone_number,
        role: input.role,
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // 3. Call the Edge Function if temp_password is provided
    if (input.temp_password) {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const response = await fetch(`${supabaseUrl}/functions/v1/create-staff-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            staff_id: staffData.id,
            email: staffData.email,
            password: input.temp_password,
            full_name: staffData.full_name,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to create auth user (status: ${response.status})`);
        }
      } catch (err) {
        // Rollback staff record on failure
        await supabase.from('staff').delete().eq('id', staffData.id);
        throw err;
      }
    }

    // Return the updated staff member with auth_user_id populated by the Edge function
    const { data: updatedStaff, error: fetchError } = await supabase
      .from('staff')
      .select('*')
      .eq('id', staffData.id)
      .single();

    if (fetchError || !updatedStaff) {
      return staffData;
    }
    return updatedStaff;
  },
  async completePasswordChange(userId: string): Promise<void> {
    const { error } = await supabase
      .from('staff')
      .update({ must_change_password: false })
      .eq('auth_user_id', userId);
    if (error) throw error;
  },
  async updateRole(id: string, role: Staff['role']): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff').update({ role }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async setActive(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('staff').update({ is_active: isActive }).eq('id', id);
    if (error) throw error;
  },
};

