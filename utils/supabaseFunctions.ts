import { supabase } from "./supabaseClient"

export const addUserInfo = async (nickname: string, age: string, country: string ) => {
    await supabase
    .from('users')
    .insert({ nickname: nickname,age: age,country: country });
}