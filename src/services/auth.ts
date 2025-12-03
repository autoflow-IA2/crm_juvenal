import { supabase } from '@/lib/supabase'

export const authService = {
  async signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password })
  },

  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  },

  async signOut() {
    return supabase.auth.signOut()
  },

  async resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  },

  async updatePassword(newPassword: string) {
    return supabase.auth.updateUser({ password: newPassword })
  },

  async updateProfile(updates: { email?: string; password?: string; data?: any }) {
    return supabase.auth.updateUser(updates)
  },

  async updateEmail(newEmail: string) {
    return supabase.auth.updateUser({ email: newEmail })
  },

  getUser() {
    return supabase.auth.getUser()
  },

  getSession() {
    return supabase.auth.getSession()
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
