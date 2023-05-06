import supabase from "./supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

export const addUserInfo = async (id: string, nickname: string, age: string, country: string, avatar_url: string) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert({ id: id, nickname: nickname, age: age, country: country, avatar_url: avatar_url });

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error while adding user info:', (error as PostgrestError).message);
    }
};
