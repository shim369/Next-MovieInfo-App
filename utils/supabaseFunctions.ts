import { supabase } from "./supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { UserData } from "../components/UserInfo";

export const getUserInfo = async (userId: string): Promise<UserData | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
  
    if (error) {
      console.error("Error fetching user info:", error.message);
      return null;
    }
  
    if (data) {
      return {
        nickname: data.nickname,
        birthdate: data.birthdate,
        country: data.country,
        avatar_url: data.avatar_url,
      } as UserData;
    }
  
    return null;
};
  
  


export const addUserInfo = async (id: string, nickname: string, birthdate: string, country: string, avatar_url: string) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert({ id: id, nickname: nickname, birthdate: birthdate, country: country, avatar_url: avatar_url });

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error while adding user info:', (error as PostgrestError).message);
    }
};

export const updateAvatar = async (userId: string, file: File): Promise<string | null> => {
    const uniqueFileName = `${new Date().toISOString()}-${file.name}`;
  
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`${userId}/${uniqueFileName}`, file);
  
    if (error) {
      console.error("Error uploading avatar:", error.message);
      return null;
    }
  
    const publicUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_ENDPOINT}/storage/v1/object/public/avatars/${userId}/${uniqueFileName}`;
  
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);
  
    if (updateError) {
    console.error("Error updating user info with new avatar:", updateError.message);
    return null;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    return publicUrl;
};   

export const updateUserInfo = async (id: string, nickname: string, birthdate: string, country: string, avatar_url: string) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ nickname: nickname, birthdate: birthdate, country: country, avatar_url: avatar_url })
            .eq('id', id);

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error while updating user info:', (error as PostgrestError).message);
    }
};
