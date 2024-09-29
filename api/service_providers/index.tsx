import { supabase } from "@/lib/supabase"
import { useMutation, useQuery } from "@tanstack/react-query"



export const useServices = () => {return useQuery({
    queryKey: ['service'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Services').select('*, User_Business(*)');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}
export const useCategories = () => {return useQuery({
    queryKey: ['service_categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('service_categories').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}
  
  
export const useService = (id: number) => {
    return useQuery({
        queryKey: ['service', id],
        queryFn: async () => {
          const { data, error } = await supabase.from('Services').select('*, User_Business(*)').eq('id', id).single();
          if (error) {
            throw new Error(error.message);
          }
          return data;
        },
      });
}




export const useInsertCompany = () => {
return useMutation({
    async mutationFn(data: any){
        const {error, data: newCompany } = await supabase 
        .from('User_Business')
        .insert({ 
              id: data.user.id,           
              business_name: data.business_name,
              coordinates: data.coordinates, 
              address: data.address,
              description: data.description,
              telephone: data.telephone,
              provider_email: data.provider_email
            })
            .select();
            
            if (error) {
                throw new Error(error.message);
            }
            return newCompany;                      
        
    },
});
};


/* ------------------------------------------User Queries ---------------------------- */

export const useUser = (id: number) => {
  return useQuery({
      queryKey: ['user', id],
      queryFn: async () => {
        const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
}