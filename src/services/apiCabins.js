import toast from "react-hot-toast";
import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function createEditCabin(cabinData, id) {
  const hasImagePath =
    typeof cabinData.image === "string" &&
    cabinData.image.startsWith(supabaseUrl);
  const imageName = hasImagePath
    ? null
    : `${Math.random()}-${cabinData.image.name}`.replaceAll("/", "");
  const imagePath = hasImagePath
    ? cabinData.image
    : `${supabaseUrl}/storage/v1/object/public/cabins/${imageName}`;

  const cabinValues = { ...cabinData, image: imagePath };
  const query = id
    ? supabase.from("cabins").update(cabinValues).eq("id", id)
    : supabase.from("cabins").insert([cabinValues]);
  const { data, error } = await query.select().single();

  if (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }

  if (hasImagePath) return data;

  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage
      .from("cabins")
      .upload(imageName, cabinData.image);
    if (storageError) {
      if (!id) await supabase.from("cabins").delete().eq("id", data.id);
      toast.error(storageError.message);
      throw new Error(storageError.message);
    }
  }

  return data;
}
